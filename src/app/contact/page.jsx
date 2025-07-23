'use client';

import React from "react";
import Link from "next/link";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaPaperPlane,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <section
      className="relative bg-cover bg-center text-white py-24 px-4 sm:px-8 lg:px-16 overflow-hidden" // Increased vertical padding, added overflow-hidden for animations
      style={{ backgroundImage: "url('/contact-bg2.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-[#775522]/60 z-0"></div>

      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-[#E8CEB0] opacity-5 rounded-full blur-3xl animate-blob-1"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#9933BB] opacity-5 rounded-full blur-3xl animate-blob-2"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#775522] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-blob-3"></div>

      <div className="relative z-10 max-w-7xl mx-auto"> 
        {/* Page Header */}
        <div className="text-center mb-16"> 
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold flex items-center justify-center gap-4 mb-4 text-[#E8CEB0] animate-fade-in-down drop-shadow-xl">
            <FaPaperPlane className="text-5xl" /> 
            Get In Touch
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-200 animate-fade-in-up">
            We'd love to hear from you — whether you're a buyer, seller, or just curious.
            Your feedback and inquiries are important to us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start"> {/* Increased gap, aligned items to start */}
          {/* Contact Info Section */}
          <div className="space-y-8 animate-slide-in-left bg-white/10 p-8 rounded-2xl shadow-xl backdrop-blur-sm border border-white/20"> {/* Styled card */}
            <h3 className="text-3xl font-bold mb-6 text-[#E8CEB0]">Our Details</h3> {/* New heading */}

            <div className="flex items-start gap-5 p-3 hover:bg-white/5 rounded-lg transition duration-200 cursor-pointer">
              <FaEnvelope className="text-3xl text-[#E8CEB0] mt-1 flex-shrink-0" /> {/* Larger icon */}
              <div>
                <h4 className="font-bold text-xl">Email</h4>
                <a href="mailto:refurnishng@gmail.com" className="text-gray-200 hover:text-[#FFD700] transition-colors">refurnishng@gmail.com</a>
              </div>
            </div>

            <div className="flex items-start gap-5 p-3 hover:bg-white/5 rounded-lg transition duration-200 cursor-pointer">
              <FaMapMarkerAlt className="text-3xl text-[#E8CEB0] mt-1 flex-shrink-0" /> {/* Larger icon */}
              <div>
                <h4 className="font-bold text-xl">Address</h4>
                <p className="text-gray-200">Lagos, Nigeria</p>
              </div>
            </div>

            <div className="flex items-start gap-5 p-3 hover:bg-white/5 rounded-lg transition duration-200 cursor-pointer">
              <FaPhoneAlt className="text-3xl text-[#E8CEB0] mt-1 flex-shrink-0" /> {/* Larger icon */}
              <div>
                <h4 className="font-bold text-xl">Phone</h4>
                <a href="tel:+2340000000000" className="text-gray-200 hover:text-[#FFD700] transition-colors">+234 000 000 0000</a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-8 pt-6 text-3xl justify-center sm:justify-start"> {/* Larger icons, centered on small screens */}
              <Link href="https://facebook.com/refurnishng" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="text-gray-300 hover:text-[#E8CEB0] transition duration-300 transform hover:scale-110" />
              </Link>
              <Link href="https://twitter.com/refurnishng" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="text-gray-300 hover:text-[#E8CEB0] transition duration-300 transform hover:scale-110" />
              </Link>
              <Link href="https://instagram.com/refurnishng" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-gray-300 hover:text-[#E8CEB0] transition duration-300 transform hover:scale-110" />
              </Link>
              <Link href="https://wa.me/2340000000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp className="text-gray-300 hover:text-[#E8CEB0] transition duration-300 transform hover:scale-110" />
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-white rounded-2xl shadow-2xl p-8 space-y-7 text-[#5F7161] animate-slide-in-right border border-gray-100"> {/* Styled form card, increased spacing */}
            <h3 className="text-3xl font-bold mb-6 text-[#775522]">Send Us a Message</h3> {/* New heading */}
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold text-lg">Full Name</label> {/* Larger label */}
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#E8CEB0] focus:border-[#775522] transition duration-200" // Enhanced focus styles
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 font-semibold text-lg">Email</label> {/* Larger label */}
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#E8CEB0] focus:border-[#775522] transition duration-200" // Enhanced focus styles
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 font-semibold text-lg">Message</label> {/* Larger label */}
              <textarea
                id="message"
                placeholder="Write your message here..."
                rows={5} 
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-[#E8CEB0] focus:border-[#775522] transition duration-200 resize-y" // Enhanced focus styles, added resize-y
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#775522] text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg
                         hover:bg-[#5E441B] transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]
                         focus:outline-none focus:ring-4 focus:ring-[#E8CEB0] focus:ring-offset-2 focus:ring-offset-white animate-pulse-once" // Enhanced button styles and animation
            >
              Send Message <FaPhoneAlt className="inline-block ml-2 -translate-y-px" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}