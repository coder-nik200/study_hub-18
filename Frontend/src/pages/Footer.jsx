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
        {/* Top Grid */}
        <div className="mb-12 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_2fr]">
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
              {[
                { icon: Twitter, href: "https://x.com/code_Bharti07" },
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/wohh.nitish",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/nitish-kumar-bharti-631a37359/",
                },
                { icon: Github, href: "https://github.com/coder-nik200" },
                { icon: Mail, href: "mailto:codesnippet17@gmail.com" },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-gray-400 transition-colors duration-300 hover:text-indigo-500 active:scale-95"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Product</h3>
            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                Features
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
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
                to="/about"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                Contact
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                Careers
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
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
                to="/tips"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                Study Tips
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                Help Center
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
              >
                Privacy Policy
              </Link>
              <Link
                to="/contact"
                className="block text-gray-400 hover:text-indigo-500 active:scale-95"
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

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-[#2a2a2a] px-3 py-2 text-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              />
              <button
                onClick={handleSubscribe}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition-all duration-300 ease-out active:scale-95"
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
            <div className="flex gap-6 flex-wrap justify-center sm:justify-end">
              <Link
                to="/contact"
                className="hover:text-indigo-500 active:scale-95"
              >
                Privacy
              </Link>
              <Link
                to="/contact"
                className="hover:text-indigo-500 active:scale-95"
              >
                Terms
              </Link>
              <Link
                to="/contact"
                className="hover:text-indigo-500 active:scale-95"
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
