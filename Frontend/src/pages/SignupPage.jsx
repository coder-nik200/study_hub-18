import { Lock, Mail, User, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const SignupPage = ({ isOpen, setIsOpen, openLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animate, setAnimate] = useState(false);

  const navigate = useNavigate();

  // 🔒 Lock background scroll + animation
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    if (isOpen) setAnimate(true);
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => setIsOpen(false), 700);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ❌");
      setLoading(false);
      return;
    }

    try {
      await api.post("/signup", formData);
      toast.success("Account created successfully 🎉");
      handleClose();
      // navigate("/");
      navigate("/", { state: { openLogin: true }, replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* OVERLAY */}
          <div
            onClick={handleClose}
            className={`absolute inset-0 bg-black/60 transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* MODAL CARD */}
          <div
            className={`relative z-10 w-full max-w-lg mx-4 transform transition-all duration-700 ${
              animate
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-24"
            }`}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-black/40 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition"
            >
              <X size={16} />
            </button>

            {/* CARD */}
            <div className="bg-white rounded-2xl p-7 shadow-2xl min-h-[480px] flex flex-col justify-center">
              {/* HEADER */}
              <div className="mb-6 text-center">
                <h1 className="mb-3 text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Create Account
                </h1>
                <p className="text-base text-slate-500">
                  Join StudyHub and start your journey
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* NAME */}
                <div>
                  <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <User size={16} /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Mail size={16} /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Lock size={16} /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Lock size={16} /> Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* ROLE SELECTION */}
                <div>
                  <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <User size={16} /> I am a
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "student" })}
                      className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                        formData.role === "student"
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-300 bg-white text-slate-700 hover:border-indigo-300"
                      }`}
                    >
                      🎓 Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "expert" })}
                      className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                        formData.role === "expert"
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-slate-300 bg-white text-slate-700 hover:border-indigo-300"
                      }`}
                    >
                      👨‍🏫 Expert
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center mt-2 w-full rounded-xl bg-indigo-600 py-3
                         text-base font-semibold text-white
                         transition-all duration-300
                         hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-lg
                         active:translate-y-0 active:scale-95
                         disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <Spinner size="lg" color="white" /> : "Sign Up"}
                </button>
              </form>

              {/* FOOTER */}
              <div className="mt-5 text-center text-sm">
                <p className="text-base text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false); // close signup modal
                      openLogin(); // open login modal (from navbar)
                    }}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupPage;
