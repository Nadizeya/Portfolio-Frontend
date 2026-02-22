import React, { useState } from "react";
import { motion } from "framer-motion";
import { apiService } from "../services/apiService";
import { HiMail } from "react-icons/hi";
import { FaLinkedin } from "react-icons/fa";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await apiService.submitContact(formData);
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } catch (error) {
        console.error("Failed to submit contact form:", error);
        setErrors({ submit: "Failed to send message. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <section
      id="contact"
      className="bg-transparent transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-700 mb-6 block">
              Contact
            </span>
            <h3 className="text-6xl font-black text-white mb-10 tracking-tighter">
              Get in touch.
            </h3>
            <p className="text-slate-400 font-light text-xl mb-16 max-w-md leading-relaxed">
              Open for collaboration and any oppurtunities.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-10 group cursor-pointer">
                <div className="w-16 h-px bg-slate-800 group-hover:w-24 group-hover:bg-emerald-500 transition-all duration-500"></div>
                <a
                  href="mailto:nadizeya@gmail.com"
                  className="flex items-center gap-3 text-xs font-black tracking-[0.3em] uppercase text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  <HiMail className="w-5 h-5" />
                  nadizeya@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-10 group cursor-pointer">
                <div className="w-16 h-px bg-slate-800 group-hover:w-24 group-hover:bg-emerald-500 transition-all duration-500"></div>
                <a
                  href="https://www.linkedin.com/in/nadi-zeya/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs font-black tracking-[0.3em] uppercase text-slate-500 hover:text-emerald-500 transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-900/50 backdrop-blur-sm p-12 md:p-20 rounded-[2.5rem] border border-slate-800 shadow-2xl"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-10"
              >
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-8">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4 className="text-3xl font-black text-white mb-4 tracking-tight">
                  Transmission Received
                </h4>
                <p className="text-slate-400 font-light">
                  I'll respond via encrypted email within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                      Identity
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-transparent border-b-2 ${errors.name ? "border-red-500" : "border-slate-800"} focus:border-emerald-500 py-3 outline-none transition-all font-light text-white text-lg`}
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                      Email Hub
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-transparent border-b-2 ${errors.email ? "border-red-500" : "border-slate-800"} focus:border-emerald-500 py-3 outline-none transition-all font-light text-white text-lg`}
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                    Inquiry Header
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full bg-transparent border-b-2 ${errors.subject ? "border-red-500" : "border-slate-800"} focus:border-emerald-500 py-3 outline-none transition-all font-light text-white text-lg`}
                    placeholder="Subject of Project"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">
                    Detailed Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full bg-transparent border-b-2 ${errors.message ? "border-red-500" : "border-slate-800"} focus:border-emerald-500 py-3 outline-none transition-all font-light text-white text-lg resize-none`}
                    placeholder="Tell me about your architectural goals..."
                  />
                </div>

                {errors.submit && (
                  <div className="text-red-400 text-sm font-light">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Project Inquiry"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
