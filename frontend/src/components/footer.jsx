const Footer = () => (
  <footer className="bg-indigo-50 border-t border-indigo-200 mt-12">
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center md:justify-between">
      {/* Brand & Copyright */}
      <div className="flex flex-col md:flex-row items-center gap-2">
        <span className="text-indigo-700 font-bold text-lg tracking-wide">
          EventHub
        </span>
        <span className="text-gray-500 text-sm md:ml-4">
          &copy; {new Date().getFullYear()} EventHub. All rights reserved.
        </span>
      </div>

      {/* Quick Links */}
      <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
        <a href="/" className="hover:text-indigo-700 transition">
          Home
        </a>
        <a href="/student/login" className="hover:text-indigo-700 transition">
          Student
        </a>
        <a href="/club/login" className="hover:text-indigo-700 transition">
          Club
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
