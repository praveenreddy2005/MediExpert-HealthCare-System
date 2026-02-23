// import type { Metadata } from "next";
// import { Space_Grotesk } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import Navbar from "@/components/Navbar";   // ✅ add this

// const spaceGrotesk = Space_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-space-grotesk",
// });

// export const metadata: Metadata = {
//   title: "Integrated Healthcare System",
//   description: "AI-Powered Healthcare Support",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${spaceGrotesk.variable} font-sans min-h-screen bg-[#0b1220] text-white`}
//       >
//         {/* Global Background */}
//         <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-950/40 via-black to-black" />
//         <div className="fixed inset-0 -z-10 opacity-40 blur-3xl bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_60%)]" />

//         {/* Global Navbar */}
//         <Navbar />

//         {/* Page Content */}
//         <main className="px-6 lg:px-10 py-10">
//           {children}
//         </main>

//         {/* Toast Notifications */}
//         <Toaster position="top-right" />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
// import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";   // ✅ added

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Integrated Healthcare System",
  description: "AI-Powered Healthcare Support",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans`}>
        {/* <Navbar /> */}
        {children}
        <Toaster position="top-right" />   {/* ✅ added */}
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import { Space_Grotesk } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import Navbar from "@/components/Navbar"; // ✅ ADD THIS

// const spaceGrotesk = Space_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-space-grotesk",
// });

// export const metadata: Metadata = {
//   title: "Integrated Healthcare System",
//   description: "AI-Powered Healthcare Support",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${spaceGrotesk.variable} font-sans min-h-screen bg-[#0b1220] text-white`}
//       >
//         {/* ✅ Global Background */}
//         <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-950/40 via-black to-black" />
//         <div className="fixed inset-0 -z-10 opacity-40 blur-3xl bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_60%)]" />

//         {/* ✅ Navbar visible everywhere */}
//         <Navbar />

//         {/* ✅ Page Content */}
//         {/* <main className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-8"> */}
//         <main className="w-full px-6 lg:px-8 py-8">

//           {children}
//         </main>

//         <Toaster position="top-right" />
//       </body>
//     </html>
//   );
// }