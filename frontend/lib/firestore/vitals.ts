// src/lib/firestore/vitals.ts
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SaveVitalsInput = {
  patientId: string;
  patientName?: string;
  patientEmail?: string | null;
  patientMobile?: string;

  bp: string;
  heartRate: string;
  temp: string;
  weight: string;
};

export async function saveVitalsEntry(input: SaveVitalsInput) {
  if (!input.patientId) throw new Error("patientId is required");

  // basic validation
  if (!input.bp || !input.heartRate || !input.temp || !input.weight) {
    throw new Error("Please fill all vitals fields");
  }

  const vitalsDoc = {
    patientId: input.patientId,
    patientName: input.patientName || "Unknown Patient",
    patientEmail: input.patientEmail || "",
    patientMobile: input.patientMobile || "",

    bp: input.bp,
    heartRate: input.heartRate,
    temp: input.temp,
    weight: input.weight,

    recordedAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, "vitals"), vitalsDoc);
  return docRef;
}