import { Link } from "react-router-dom";
import { useState } from "react";

const StudentNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-700">
          EventHub
        </Link>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/howtouse"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            How To Use?
          </Link>
          <Link
            to="/student/myevents"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            My Events
          </Link>
          <Link
            to="/student/info"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Profile
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </div>
        {/* Mobile Burger */}
        <button
          className="md:hidden block text-indigo-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t py-2 px-4 space-y-2">
          <Link
            to="/student/myevents"
            className="block text-green-600 hover:text-green-800 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            My Events
          </Link>
          <Link
            to="/student/info"
            className="block text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="block w-full text-left text-red-600 hover:text-red-800 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default StudentNavbar;
