import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import api from "../api/axios";
import { UserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const LoginPage = ({ isOpen, setIsOpen, openSignup }) => {
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false); // ✅ animation state

  const navigate = useNavigate();

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    if (isOpen) setAnimate(true); // start animation when modal opens
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleClose = () => {
    setAnimate(false); // start closing animation
    setTimeout(() => setIsOpen(false), 300); // wait for animation to finish
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", formData);
      setUser(res.data.user);
      toast.success("Login successful 🎉");
      handleClose();
      navigate("/");
      setFormData({ email: "", password: "" }); //Null login page
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
            className={`absolute inset-0 bg-black/60 transition-opacity duration-700 ${
              animate ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          {/* MODAL CARD */}
          <div
            className={`relative z-10 w-full max-w-lg mx-4 transform transition-all duration-700 ${
              animate
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-20"
            }`}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-black/40 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition"
            >
              <X size={16} />
            </button>

            <div className="bg-white rounded-2xl p-8 shadow-2xl min-h-[460px] flex flex-col justify-center">
              <div className="mb-8 text-center">
                <h1 className="mb-2 text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome Back
                </h1>
                <p className=" text-slate-500">Login to your account</p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* EMAIL */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-700">
                    <Mail size={18} /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                           transition"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-700">
                    <Lock size={18} /> Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-base
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
                             transition"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2
                             rounded-lg p-1 text-slate-500
                             hover:bg-slate-100 hover:text-indigo-600
                             transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center mt-2 w-full rounded-xl bg-indigo-600 py-3 text-base font-semibold text-white transition-transform duration-300 ease-out hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-lg active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <Spinner size="lg" color="white" /> : "Login"}
                </button>
              </form>

              <div className="mt-8 text-center text-sm">
                <p className="text-base text-slate-500">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false); // close login modal
                      openSignup(); // open signup modal (from navbar)
                    }}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition"
                  >
                    Sign up here
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

export default LoginPage;
