import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import SignupPhoto from "../assets/Signup.avif";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match ❌", {
        toastId: "password-mismatch",
      });
      setLoading(false);
      return;
    }

    try {
      await api.post("/signup", formData);

      toast.success("Account created successfully 🎉", {
        toastId: "signup-success",
      });

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed", {
        toastId: "signup-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-15 min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* IMAGE SECTION */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={SignupPhoto}
            alt="Signup"
            className="h-full w-full object-cover"
          />
        </div>

        {/* FORM SECTION */}
        <div className="w-full lg:w-1/2 p-10 base:p-12">
          {/* HEADER */}
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-500 text-base">
              Join StudyHub and start your journey
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* NAME */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-700">
                <User size={16} /> Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-700">
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-indigo-500
                          focus:ring-2 focus:ring-indigo-200 transition"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-700">
                <Lock size={16} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-base
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-700">
                <Lock size={16} /> Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-base
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
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
          <div className="mt-8 border-t border-slate-200 pt-6 text-center">
            <p className="text-base text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
