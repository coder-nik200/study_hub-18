import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import api from "../api/axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error("Please fill all required fields ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/contact", formData);

      if (res.status === 200) {
        toast.success("Message sent successfully ✅");

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-4 text-4xl sm:text-5xl font-bold text-slate-900">
            Get in Touch
          </h1>
          <p className="mb-8 sm:mb-10 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Have questions about StudyHub? We'd love to hear from you. Send us a
            message and we'll respond as soon as possible.
          </p>

          <div className="space-y-6">
            {[
              { icon: Mail, title: "Email", info: "support@studyhub.com" },
              { icon: Phone, title: "Phone", info: "+1 (555) 123-4567" },
              {
                icon: MapPin,
                title: "Address",
                info: "New Preet Nagar, Batala Road, Amritsar, 143001",
              },
            ].map((contact, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <contact.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {contact.title}
                  </p>
                  <p className="text-slate-600 text-sm sm:text-base">
                    {contact.info}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-lg">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div>
                <label className="mb-2 block font-semibold text-slate-900">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2 sm:py-3 text-sm sm:text-md focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-slate-900">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2 sm:py-3 text-sm sm:text-md focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-900">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-2 sm:py-3 text-sm sm:text-md focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-900">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-2 sm:py-3 text-sm sm:text-md focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold text-slate-900">
                Message
              </label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-2 sm:py-3 text-sm sm:text-md focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 sm:py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
            >
              <Send size={18} />
              {loading ? <Spinner size="lg" color="white" /> : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
