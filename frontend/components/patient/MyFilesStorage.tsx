"use client";

import React, { useEffect, useMemo, useState } from "react";
// import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type PatientFile = {
  id: string;
  patientId: string;
  fileName: string;
  fileUrl: string;
  category: string;
  description?: string;
  fileType?: string;
  size?: number;
  // uploadedAt?: any;
  uploadedAt?: { seconds?: number; nanoseconds?: number } | null;
};

export default function MyFilesStorage() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return () => unsub();
  }, []);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("Medical Report");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<PatientFile[]>([]);

  const formatUploadedAt = (ts: any) => {
    if (!ts?.seconds) return "Just now";
    
    const uploadDate = new Date(ts.seconds * 1000);
    const now = new Date();
    
    const diffMs = now.getTime() - uploadDate.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    
    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hr ago`;
    if (diffDay === 1) return "Yesterday";
    
    return uploadDate.toLocaleDateString();
  };

  // const uid = auth.currentUser?.uid;

  // ✅ LISTENER: load my files only
  useEffect(() => {
    if (!uid) return;

    // const q = query(
    //   collection(db, "patient_files"),
    //   where("patientId", "==", uid),
    //   // orderBy("uploadedAt", "desc")
    // );

    const q = query(
      collection(db, "patient_files"),
      where("patientId", "==", uid),
      orderBy("uploadedAt", "desc")
    );


    // const unsub = onSnapshot(q, (snap) => {
    //   const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    //   setFiles(docs as PatientFile[]);
    // });
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setFiles(docs as PatientFile[]);
      },
      (err) => console.error("patient_files listener error:", err)
    );

    return () => unsub();
  }, [uid]);

  const canUpload = useMemo(() => !!file && !!uid, [file, uid]);

  const handleUpload = async () => {
    if (!uid) {
      toast.error("Please login again.");
      return;
    }
    if (!file) {
      toast.error("Choose a file first.");
      return;
    }

    setUploading(true);
    try {
      // upload via FastAPI -> Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uid", uid);
      
      const res = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        body: formData,
     });
     
     const data = await res.json();
     
     if (!res.ok || !data.success) {
      throw new Error(data?.detail || "Upload failed");
    }
    const url = data.url;
    const publicId = data.public_id;

      // ✅ 2) save metadata to firestore..
      await addDoc(collection(db, "patient_files"), {
        patientId: uid,
        fileName: file.name,
        fileUrl: url,
        cloudinaryPublicId: publicId,
        category,
        description,
        fileType: file.type || "",
        size: file.size || 0,
        uploadedAt: serverTimestamp(),
      });

      toast.success("Uploaded successfully!");
      setFile(null);
      setDescription("");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Upload Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-2 text-white">Digital Storage</h2>
        <p className="text-sm text-gray-400 mb-5">
          Securely store and manage your medical reports, prescriptions, and health documents.
        </p>

        {/* File box */}
        <div className="bg-black/30 border border-dashed border-white/20 rounded-xl p-6 text-center">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0 file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          <p className="text-xs text-gray-500 mt-2">JPG/PNG format (Maximum file size: 200 KB)</p>
        </div>

        {/* Category + Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="text-xs text-gray-400 font-bold uppercase">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
            >
              <option className="text-black">Medical Report</option>
              <option className="text-black">Prescription</option>
              <option className="text-black">Lab Report</option>
              <option className="text-black">X-Ray / Scan</option>
              <option className="text-black">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold uppercase">Description (Optional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Blood test from City Hospital"
              className="mt-2 w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white"
            />
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!canUpload || uploading}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
            text-white font-bold py-3 rounded-xl transition"
        >
          {uploading ? "Uploading..." : "Upload to Secure Storage"}
        </button>
      </div>

      {/* Files List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Your Files ({files.length})</h3>

        {files.length === 0 ? (
          <div className="text-center text-gray-500 py-10 border border-dashed border-white/10 rounded-xl">
            No files stored yet
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {files.map((f) => (
              <div key={f.id} className="bg-black/20 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-white">{f.fileName}</p>
                    <p className="text-xs text-gray-400">{f.category}</p>
                    <p className="text-xs text-gray-500">Uploaded: {formatUploadedAt(f.uploadedAt)}
</p>
                    {f.description ? (
                      <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                    ) : null}
                  </div>

                  <a
                    href={f.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-white"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}