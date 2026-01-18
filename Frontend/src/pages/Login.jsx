import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import LoginPhoto from "../assets/Login.avif";
import api from "../api/axios";
import { UserContext } from "../context/UserContext";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const Login = () => {
  const { setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/login", formData);

      setUser(response.data.user);

      toast.success("Login successful 🎉", {
        toastId: "login-success",
      });

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        toastId: "login-error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-15 min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* IMAGE SECTION */}
        <div className="relative hidden lg:block lg:w-1/2">
          <img
            src={LoginPhoto}
            alt="Login"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* FORM SECTION */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10">
          {/* HEADER */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-base text-slate-500">
              Sign in to your StudyHub account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center mt-2 w-full rounded-xl bg-indigo-600 py-3
             text-base font-semibold text-white
             transition-transform duration-300 ease-out
             hover:-translate-y-1
             hover:bg-indigo-700 hover:shadow-lg
             active:translate-y-0 active:scale-95
             disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Spinner size="lg" color="white" /> : "Login"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 border-t border-slate-200 pt-6 text-center">
            <button className="mb-4 text-base font-semibold text-indigo-600 underline hover:text-indigo-700 transition">
              Forgot your password?
            </button>

            <p className="text-base text-slate-500">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
