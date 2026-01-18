import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import {
  Calendar,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email ❌");
      return;
    }

    try {
      const res = await api.post("/subscribe", { email });

      toast.success(res.data.message || "Subscribed successfully ✅");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Subscription failed ⚠️");
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-6">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top Content */}
        <div className="mb-12 grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr_2fr]">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-3 text-2xl font-bold text-indigo-500">
              <Calendar size={32} />
              <span>StudyHub</span>
            </div>

            <p className="mb-6 text-gray-400 leading-relaxed">
              Empowering students to achieve academic excellence through smart
              study management and organization.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://x.com/code_Bharti07"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 transition hover:text-indigo-500"
              >
                <Twitter />
              </a>

              <a
                href="https://www.instagram.com/wohh.nitish"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 transition hover:text-indigo-500"
              >
                <Instagram />
              </a>

              <a
                href="https://www.linkedin.com/in/nitish-kumar-bharti-631a37359/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 transition hover:text-indigo-500"
              >
                <Linkedin />
              </a>

              <a
                href="https://github.com/coder-nik200"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 transition hover:text-indigo-500"
              >
                <Github />
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=codesnippet17@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-gray-400 transition hover:text-indigo-500"
              >
                <Mail />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Product</h3>
            <div className="space-y-3">
              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/about"
              >
                Features
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 cursor-pointer"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 cursor-pointer"
              >
                Updates
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Company</h3>
            <div className="space-y-3">
              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/about"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 cursor-pointer"
              >
                Contact
              </Link>
              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/contact"
              >
                Careers
              </Link>
              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/contact"
              >
                Press
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Resources</h3>
            <div className="space-y-3">
              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/tips"
              >
                Study Tips
              </Link>
              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/contact"
              >
                Help Center
              </Link>

              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/contact"
              >
                Privacy Policy
              </Link>

              <Link
                className="block text-gray-400 hover:text-indigo-500"
                to="/contact"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Stay Updated</h3>
            <p className="mb-4 text-white">
              Subscribe to our newsletter for study tips and updates.
            </p>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-[#2a2a2a] px-3 py-2 text-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSubscribe}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold  hover:bg-indigo-700 transition-all duration-300 ease-out
               hover:-translate-y-1 0 hover:shadow-lg"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-5">
          <div className="flex flex-col items-center justify-between gap-4 text-gray-400 sm:flex-row">
            <div>&copy; 2026 StudyHub. All rights reserved.</div>

            <div className="flex gap-6">
              <Link
                to="/contact"
                className="cursor-pointer hover:text-indigo-500"
              >
                Privacy
              </Link>

              <Link
                to="/contact"
                className="cursor-pointer hover:text-indigo-500"
              >
                Terms
              </Link>

              <Link
                to="/contact"
                className="cursor-pointer hover:text-indigo-500"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
