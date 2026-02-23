import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Save symptom journal entry into Firestore.
 * Firestore auto-creates "symptoms" collection when first doc is added.
 */
export async function saveSymptomEntry(params: {
  patientId: string;
  patientName?: string;
  patientEmail?: string | null;
  patientMobile?: string;
  details: string;
}) {
  const text = params.details.trim();
  if (!text) throw new Error("Please enter your symptoms before saving.");

  return await addDoc(collection(db, "symptoms"), {
    patientId: params.patientId,
    patientName: params.patientName || "Unknown Patient",
    patientEmail: params.patientEmail || "",
    patientMobile: params.patientMobile || "",
    details: text,                 // ✅ store the textarea text here
    symptomRisk: null,             // optional (can update later)
    aiSuggestion: null,            // optional
    status: "SAVED",               // simple status
    recordedAt: serverTimestamp(), // ✅ best for orderBy
    reviewedAt: null,
    doctorNote: null,
    doctorId: null,
    doctorName: null,
    agreeWithAI: null,
  });
}