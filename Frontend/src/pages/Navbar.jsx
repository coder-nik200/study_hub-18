import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, User, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const userMenuRef = useRef(null); // 🔹 Ref for user menu

  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });

      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // 🔹 Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-indigo-600 text-2xl font-bold transition hover:scale-105"
          >
            <BookOpen size={32} />
            StudyHub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link className="nav-link" to="/">
              Home
            </Link>
            {user && (
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            )}
            <Link className="nav-link" to="/tips">
              Study Tips
            </Link>
            <Link className="nav-link" to="/about">
              About
            </Link>
            <Link className="nav-link" to="/contact">
              Contact Us
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  <User size={20} />
                  <span className="text-sm">{user.name || user.email}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg animate-[slideDown_0.2s_ease]">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm rounded-md hover:bg-gray-100 transition"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md border-2 font-semibold border-blue-900 text-blue-900 hover:bg-indigo-600 hover:text-white transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-md font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col items-center gap-4 py-6">
            <Link
              className="mobile-link"
              to="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user && (
              <Link className="mobile-link" to="/dashboard">
                Dashboard
              </Link>
            )}
            <Link className="mobile-link" to="/tips">
              Study Tips
            </Link>
            <Link className="mobile-link" to="/about">
              About
            </Link>
            <a className="mobile-link" href="/contact">
              Contact Us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
