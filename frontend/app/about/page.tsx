// app/about/page.tsx

import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white flex flex-col">

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-blue-950/40 via-black to-black" />
      <div className="fixed inset-0 -z-10 opacity-40 blur-3xl bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.35),transparent_60%)]" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow px-6 lg:px-10 py-12">
        <div className="w-full space-y-10">

          {/* Header Section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10">
            <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase">
              About MediXpert
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
              Smarter, Faster Healthcare Workflows — With Secure Digital Records
            </h1>
            <p className="mt-5 max-w-3xl text-gray-300 leading-relaxed">
              MediXpert is an integrated healthcare platform designed to simplify
              medical record management for both patients and healthcare providers.
              Patients can securely upload health documents and track information,
              while doctors can efficiently review and maintain structured records.
              Our goal is to reduce delays, improve organization, and make
              healthcare access smoother and more efficient.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-xl font-bold">Our Mission</h2>
              <p className="mt-3 text-gray-300 leading-relaxed">
                To provide a secure and intelligent digital ecosystem that enables
                patients and healthcare professionals to manage, access, and share
                medical records seamlessly.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h2 className="text-xl font-bold">Our Vision</h2>
              <p className="mt-3 text-gray-300 leading-relaxed">
                To build a modern healthcare infrastructure where digital records,
                AI-assisted insights, and organized workflows empower faster and
                better medical decisions.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
            <h2 className="text-xl font-bold">What MediXpert Offers</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Feature
                title="Secure Medical File Management"
                desc="Upload prescriptions, lab reports, and scans with controlled, role-based access."
              />
              <Feature
                title="Patient Dashboard"
                desc="Centralized overview of health records, activity logs, and recent updates."
              />
              <Feature
                title="Doctor Review Workflow"
                desc="Streamlined patient history tracking and structured medical evaluation tools."
              />
              <Feature
                title="AI-Assisted Support"
                desc="Smart assistance to help organize records and highlight relevant health data."
              />
              <Feature
                title="Appointment Management"
                desc="Schedule and manage consultations with organized digital tracking."
              />
              <Feature
                title="Privacy & Security"
                desc="Authentication, encrypted storage, and strict access controls by design."
              />
            </div>
          </div>

          {/* Trust & Disclaimer */}
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 md:p-8">
            <h2 className="text-xl font-bold">Trust, Safety & Responsibility</h2>
            <p className="mt-3 text-gray-300 leading-relaxed">
              MediXpert is built with a strong focus on data privacy and ethical
              technology use. Our system is designed to assist healthcare workflows
              and enhance efficiency — not replace professional medical expertise.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-300">
                <span className="font-bold text-white">Disclaimer:</span> This
                platform provides healthcare workflow support and medical record
                organization tools. Always consult a licensed medical professional
                for diagnosis, treatment, and medical advice.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Updated Professional Footer */}
      <footer className="border-t border-white/10 bg-[#0f172a] text-gray-300">

        {/* Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />

        <div className="px-6 lg:px-10 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-white">MediXpert Healthcare</h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              AI-powered healthcare record management system focused on secure
              digital workflows and intelligent clinical support tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-emerald-400 transition">Home</a></li>
              <li><a href="/about" className="hover:text-emerald-400 transition">About</a></li>
              <li><a href="/dashboard" className="hover:text-emerald-400 transition">Dashboard</a></li>
              <li><a href="/contact" className="hover:text-emerald-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-white">Core Services</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>Secure Medical Records</li>
              <li>AI Data Assistance</li>
              <li>Doctor Workflow System</li>
              <li>Cloud Storage</li>
              <li>Remote Consultation</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              <li>Email: support@medixperthealth.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Hyderabad, India</li>
            </ul>

            <div className="mt-4 flex space-x-4 text-sm">
              <a href="#" className="hover:text-emerald-400 transition">LinkedIn</a>
              <a href="#" className="hover:text-emerald-400 transition">Twitter</a>
              <a href="#" className="hover:text-emerald-400 transition">Instagram</a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500 bg-black/40">
          © {new Date().getFullYear()} MediXpert Healthcare System. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5 hover:border-blue-500/30 transition">
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm text-gray-300 leading-relaxed">{desc}</p>
    </div>
  );
}