export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0b1220] text-gray-300">
      <div className="px-6 lg:px-10 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* About Section */}
        <div>
          <h3 className="text-lg font-bold text-white">MediXpert Healthcare</h3>
          <p className="mt-4 text-sm leading-relaxed">
            MediXpert is an AI-powered healthcare management platform designed to
            streamline medical workflows, secure patient records, and support
            better clinical decisions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-400">Home</a></li>
            <li><a href="/about" className="hover:text-blue-400">About</a></li>
            <li><a href="/dashboard" className="hover:text-blue-400">Dashboard</a></li>
            <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-bold text-white">Our Services</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Medical Record Management</li>
            <li>AI-Assisted Diagnostics</li>
            <li>Doctor Review Workflow</li>
            <li>Secure Cloud Storage</li>
            <li>Remote Consultations</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold text-white">Contact Us</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Email: support@medixperthealth.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Location: Hyderabad, India</li>
          </ul>

          {/* Social Media */}
          <div className="mt-4 flex space-x-4">
            <a href="#" className="hover:text-blue-400">LinkedIn</a>
            <a href="#" className="hover:text-blue-400">Twitter</a>
            <a href="#" className="hover:text-blue-400">Instagram</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} MediXpert Healthcare System. All rights reserved.  
        | Privacy Policy | Terms of Service
      </div>
    </footer>
  );
}