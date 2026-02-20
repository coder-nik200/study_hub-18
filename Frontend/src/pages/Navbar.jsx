import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, LogOut, UserCircle } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import NotificationBell from "../components/Notification/NotificationBell";

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSign, setOpenSign] = useState(false);

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully");
      setIsUserMenuOpen(false);
      setOpenLogin(true); // ✅ OPEN LOGIN MODAL
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Logout failed");
    }
  };

  // Authenticate Dashboard
  useEffect(() => {
    if (location.state?.openLogin) {
      setOpenLogin(true);
    }
    if (location.state?.openSignup) {
      setOpenSign(true);
    }
  }, [location.state]);

  // Close user menu
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isMenuOpen]);

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

            {user?.role === "expert" && (
              <Link className="nav-link" to="/expert">
                Expert Panel
              </Link>
            )}

            {user && (
              <>
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
                {user.role === "student" && (
                  <Link className="nav-link" to="/student/tasks">
                    My Tasks
                  </Link>
                )}
              </>
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
              <>
                <NotificationBell />
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition"
                  >
                    {user.avatar ? (
                      <img
                        src={
                          user.avatar.startsWith("http")
                            ? user.avatar
                            : `http://localhost:3000/${user.avatar}`
                        }
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-indigo-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium hidden md:block">
                      {user.name || user.email}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-50 transition"
                      >
                        <UserCircle size={18} className="text-gray-600" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-50 transition text-red-600"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <button
                  className="px-4 py-2 rounded-md border-2 font-semibold border-blue-900 text-blue-900 hover:bg-indigo-600 hover:text-white transition hover:-translate-y-1 hover:shadow-2xl"
                  onClick={() => setOpenLogin(true)}
                >
                  Login
                </button>

                <button
                  className="px-4 py-2 rounded-md font-semibold bg-indigo-600 text-white
                   hover:bg-indigo-700 transition hover:-translate-y-1 hover:shadow-2xl"
                  onClick={() => setOpenSign(true)}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col items-center gap-4 py-6">
            <Link
              to="/"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {user.role === "student" && (
              <Link
                className="nav-link"
                to="/student/tasks"
                onClick={() => setIsMenuOpen(false)}
              >
                My Tasks
              </Link>
            )}

            <Link
              to="/tips"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Study Tips
            </Link>
            <Link
              to="/about"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            {!user && (
              <>
                <button
                  className="bg-indigo-600 w-full text-white rounded-xl hover:bg-indigo-700"
                  onClick={() => setOpenLogin(true)}
                >
                  Login
                </button>

                <button
                  className="bg-indigo-600 w-full text-white rounded-xl hover:bg-indigo-700"
                  onClick={() => setOpenSign(true)}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Models */}
      <LoginPage
        isOpen={openLogin}
        setIsOpen={setOpenLogin}
        openSignup={() => {
          setOpenLogin(false);
          setOpenSign(true);
        }}
      />

      <SignupPage
        isOpen={openSign}
        setIsOpen={setOpenSign}
        openLogin={() => {
          setOpenSign(false);
          setOpenLogin(true);
        }}
      />
    </nav>
  );
};

export default Navbar;
