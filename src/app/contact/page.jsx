"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaArrowRight,
} from "react-icons/fa";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form handling or API logic here safely later
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: "", email: "", message: "" });
    }, 4000);
  };

  return (
    <main className="min-h-screen bg-[#E8CEB0]/15 pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#B66B44]/20 selection:text-[#211000]">
      <div className="max-w-5xl mx-auto">
        {/* Header Block */}
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-bold uppercase tracking-widest text-[#5F7161] mb-3"
          >
            Get In Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#211000] mb-5 leading-tight"
          >
            We'd love to hear from you.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base text-[#211000]/70 leading-relaxed font-medium"
          >
            Have a question about our curated spaces, custom furniture pieces,
            or just want to talk design? Drop a message and let's craft
            something beautiful together.
          </motion.p>
        </div>

        {/* Content Section Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Direct Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-5 space-y-10"
          >
            {/* Info Unit 1 */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white border border-[#E8CEB0]/60 rounded-xl text-[#5F7161] shadow-sm flex-shrink-0">
                <FaEnvelope className="text-lg" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#211000]/40 mb-1">
                  Email Support
                </h3>
                <a
                  href="mailto:hello@refurnish.com"
                  className="text-base font-semibold text-[#211000] hover:text-[#B66B44] transition-colors duration-200"
                >
                  hello@refurnish.com
                </a>
                <p className="text-xs text-[#211000]/50 mt-1">
                  We respond within 24 business hours.
                </p>
              </div>
            </div>

            {/* Info Unit 2 */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white border border-[#E8CEB0]/60 rounded-xl text-[#5F7161] shadow-sm flex-shrink-0">
                <FaPhoneAlt className="text-lg" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#211000]/40 mb-1">
                  Call Our Studio
                </h3>
                <a
                  href="tel:+1234567890"
                  className="text-base font-semibold text-[#211000] hover:text-[#B66B44] transition-colors duration-200"
                >
                  +1 (234) 567-890
                </a>
                <p className="text-xs text-[#211000]/50 mt-1">
                  Mon - Fri from 9am to 5pm EST.
                </p>
              </div>
            </div>

            {/* Info Unit 3 */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white border border-[#E8CEB0]/60 rounded-xl text-[#5F7161] shadow-sm flex-shrink-0">
                <FaMapMarkerAlt className="text-lg" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#211000]/40 mb-1">
                  Showroom Location
                </h3>
                <p className="text-base font-semibold text-[#211000] leading-snug">
                  452 Artisan Way, Suite 100
                  <br />
                  Brooklyn, NY 11211
                </p>
              </div>
            </div>

            {/* Micro Decorative Element */}
            <div className="pt-6 border-t border-[#E8CEB0]/40 text-xs font-medium text-[#211000]/40 italic">
              "Good design is sustainable. Great design is unforgettable."
            </div>
          </motion.div>

          {/* Right Column: Clean Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-7 bg-white border border-[#E8CEB0]/50 rounded-2xl p-6 sm:p-10 shadow-xl shadow-[#211000]/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input: Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-bold uppercase tracking-wider text-[#211000]/60"
                >
                  Your Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full bg-[#E8CEB0]/10 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-[#211000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B66B44]/20 focus:border-[#B66B44] focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Input: Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-bold uppercase tracking-wider text-[#211000]/60"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full bg-[#E8CEB0]/10 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-[#211000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B66B44]/20 focus:border-[#B66B44] focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Input: Message */}
              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-xs font-bold uppercase tracking-wider text-[#211000]/60"
                >
                  How can we help you?
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  placeholder="Tell us about your space or questions..."
                  className="w-full bg-[#E8CEB0]/10 border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium text-[#211000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B66B44]/20 focus:border-[#B66B44] focus:bg-white transition-all duration-200 resize-none"
                />
              </div>

              {/* Submit CTA Button container */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className={`w-full flex items-center justify-center gap-2 bg-[#B66B44] hover:bg-[#965432] text-white font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl transition-all duration-300 shadow-md shadow-[#B66B44]/20 hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none`}
                >
                  <span>
                    {isSubmitted ? "Message Sent Beautifully!" : "Send Message"}
                  </span>
                  {!isSubmitted && (
                    <FaArrowRight className="text-[10px] transform group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>

              {/* Success Notification Interaction */}
              {isSubmitted && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-xs font-semibold text-[#5F7161]"
                >
                  Thank you! Your message reached us safely. We will touch base
                  soon.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
