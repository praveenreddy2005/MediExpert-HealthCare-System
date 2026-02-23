// frontend/app/patient/my-files/page.tsx
"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import MyFilesStorage from "@/components/patient/MyFilesStorage";

export default function PatientMyFilesPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <main className="w-full mx-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">My Files</h1>
            <p className="text-sm text-gray-400">
              Upload and manage your medical reports, prescriptions, and documents.
            </p>
          </div>

          <MyFilesStorage />
        </div>
      </main>
    </div>
  );
}