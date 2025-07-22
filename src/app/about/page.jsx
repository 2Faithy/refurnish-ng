// app/about/page.jsx

import React from "react";
import Link from "next/link";
// Import professional icons
import { FaInfoCircle, FaEye, FaHandshake, FaRecycle, FaUsers, FaLightbulb, FaShieldAlt, FaRocket, FaEnvelope, FaGlobe, FaCheckCircle, FaChevronRight } from "react-icons/fa"; // Using Font Awesome
import { FiTarget } from "react-icons/fi"; // Using Feather Icons for 'Our Aim'

export default function AboutPage() {
  return (
    <div className="font-sans text-[#5F7161] bg-[#F9F9F9]">
      {/* Hero Section / Page Title */}
      <section className="bg-[#E8CEB0] bg-opacity-30 py-20 px-4 sm:px-8 lg:px-16 text-center relative overflow-hidden">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#775522] mb-4 animate-fade-in-down drop-shadow-lg">
          About Refurnish NG
        </h1>
        <p className="max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed text-[#5F7161] animate-fade-in-up">
          Your trusted platform for sustainable furniture resale in Lagos.
        </p>
        {/* Decorative swirls or patterns for visual interest */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#775522] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#E8CEB0] opacity-10 rounded-full translate-x-1/2 translate-y-1/2 animate-spin-slow-reverse"></div>
      </section>

      {/* About Intro */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-white shadow-inner">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <p className="text-lg sm:text-xl leading-relaxed text-[#5F7161] mb-6">
            Refurnish NG is a modern furniture resale platform built specifically for{" "}
            <span className="font-semibold text-[#775522]">Lagos, Nigeria</span>.
            Whether you're looking to declutter your space or find affordable, quality pre-owned furniture,
            we've made the process <span className="font-semibold">easy, secure, and community-driven</span>.
          </p>
          <p className="text-lg sm:text-xl leading-relaxed text-[#5F7161]">
            Our platform bridges the gap between sellers and buyers, ensuring a commitment to{" "}
            <span className="font-semibold text-[#775522]">quality, trust, and convenience</span> at every step.
            Join us in building a more sustainable and accessible furniture market.
          </p>
        </div>
      </section>

      {/* --- */}

      {/* Mission & Vision - Enhanced with icons and a subtle background */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-[#F6F1EB]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Mission Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up-staggered">
            <FaInfoCircle className="w-16 h-16 mb-6 text-[#775522]" /> {/* Professional icon */}
            <h2 className="text-3xl font-bold mb-4 text-[#5F7161]">Our Mission</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              To simplify how people buy and sell furniture and decorative items in Lagos by offering a seamless,
              safe, and efficient marketplace experience.
            </p>
          </div>
          {/* Vision Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up-staggered" style={{ animationDelay: '0.1s' }}>
            <FaEye className="w-16 h-16 mb-6 text-[#775522]" /> {/* Professional icon */}
            <h2 className="text-3xl font-bold mb-4 text-[#5F7161]">Our Vision</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              A Lagos where every household can easily declutter, furnish, and refresh their space affordably,
              conveniently, and sustainably.
            </p>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Core Values - Grid with professional icons */}
      <section className="py-16 px-4 sm:px-8 lg:px-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#775522] animate-fade-in-down">Our Core Values</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Trust", icon: <FaHandshake />, desc: "A platform you can rely on, built on integrity and transparency." },
            { name: "Convenience", icon: <FaLightbulb />, desc: "Designed for ease and simplicity, from listing to delivery." },
            { name: "Sustainability", icon: <FaRecycle />, desc: "Reducing waste by promoting reuse and responsible consumption." },
            { name: "Community", icon: <FaUsers />, desc: "Empowering Lagosians through shared value and connection." },
          ].map((value, index) => (
            <div
              key={value.name}
              className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up-staggered"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="text-5xl mb-4 text-[#775522]">{value.icon}</div> {/* Render professional icon */}
              <h3 className="text-xl font-semibold text-[#5F7161] mb-2">{value.name}</h3>
              <p className="text-sm text-gray-600">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- */}

      {/* Brand Tone & Identity - More visual */}
      <section className="bg-[#E8CEB0] bg-opacity-30 py-16 px-4 sm:px-8 lg:px-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#775522] animate-fade-in-down">Our Identity & Tone</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in-left">
            <h3 className="text-2xl font-semibold text-[#5F7161] mb-4">What We Are</h3>
            <ul className="list-none space-y-3 text-lg">
              <li className="flex items-center"><FaCheckCircle className="text-[#9933BB] text-xl mr-3 flex-shrink-0" /> <strong>Innovative & Modern:</strong> Always evolving, user-friendly tech.</li>
              <li className="flex items-center"><FaCheckCircle className="text-[#9933BB] text-xl mr-3 flex-shrink-0" /> <strong>Customer-Centric & Empowering:</strong> Your needs, our priority.</li>
              <li className="flex items-center"><FaCheckCircle className="text-[#9933BB] text-xl mr-3 flex-shrink-0" /> <strong>Secure & Reliable:</strong> Safe transactions and trustworthy community.</li>
              <li className="flex items-center"><FaCheckCircle className="text-[#9933BB] text-xl mr-3 flex-shrink-0" /> <strong>Efficient & Scalable:</strong> Smooth processes, ready for growth.</li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md animate-fade-in-right">
            <h3 className="text-2xl font-semibold text-[#5F7161] mb-4">Our Aim</h3>
            <p className="text-lg leading-relaxed text-gray-700">
              Refurnish NG aims to be an easy-to-use and affordable alternative to buying new furniture.
              We believe everyone in Lagos should be able to refresh their home without breaking the bank,
              contributing to a circular economy where quality items find new life.
            </p>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Co-Founders Section - Animated and Polished */}
      <section className="bg-[#F6F1EB] py-16 px-4 sm:px-8 lg:px-16">
        <h2 className="text-4xl font-bold text-center text-[#775522] mb-12 animate-fade-in-down">
          Meet the Co-Founders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Samuel Nyong */}
          <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-b-4 border-[#E8CEB0] animate-fade-in-up-staggered">
            <img
              src="/oluseyi.png"
              alt="OluSeyi Adebayo"
              className="w-40 h-40 object-cover rounded-full mb-6 border-4 border-[#775522] shadow-md"
            />
            <h3 className="text-2xl font-bold text-[#5F7161] mb-2">OluSeyi Adebayo</h3>
            <p className="text-[#775522] italic text-md mb-4 max-w-prose">
              “We started Refurnish NG to give people in Lagos an affordable, safe, and meaningful way to declutter and refresh their homes, promoting a sustainable lifestyle.”
            </p>
            <span className="text-base text-gray-500 font-semibold">Co-Founder & CEO</span>
          </div>

          {/* OluSeyi Adebayo */}
          <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-b-4 border-[#E8CEB0] animate-fade-in-up-staggered" style={{ animationDelay: '0.1s' }}>
            <img
              src="/samuel.png"
              alt="Samuel Nyong"
              className="w-40 h-40 object-cover rounded-full mb-6 border-4 border-[#775522] shadow-md"
            />
            <h3 className="text-2xl font-bold text-[#5F7161] mb-2">Samuel Nyong</h3>
            <p className="text-[#775522] italic text-md mb-4 max-w-prose">
              “We believe great furniture shouldn't cost a fortune or harm the planet. Refurnish NG is our solution to both, fostering a circular economy.”
            </p>
            <span className="text-base text-gray-500 font-semibold">Co-Founder & CTO</span>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* Contact Info - Prominent and action-oriented */}
      <section className="py-16 px-4 sm:px-8 lg:px-16 bg-[#F9F9F9] text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-[#775522] animate-fade-in-down">Get in Touch!</h2>
        <p className="text-lg sm:text-xl mb-6 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
          Have questions, feedback, or just want to say hello? We'd love to hear from you. Reach out to us through the following channels:
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-10">
          <p className="text-lg flex items-center">
            <FaEnvelope className="text-[#775522] text-xl mr-2" /> <a href="mailto:refurnishng@gmail.com" className="text-[#775522] hover:underline font-semibold transition-colors duration-200">refurnishng@gmail.com</a>
          </p>
          <p className="text-lg flex items-center">
            <FaGlobe className="text-[#775522] text-xl mr-2" /> <a href="https://www.refurnishng.com" className="text-[#775522] hover:underline font-semibold transition-colors duration-200" target="_blank" rel="noopener noreferrer">www.refurnishng.com</a>
          </p>
        </div>
        <Link href="/contact" className="inline-block bg-[#775522] text-white px-8 py-4 rounded-full shadow-lg font-bold text-lg
            hover:bg-[#5E441B] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105
            focus:outline-none focus:ring-4 focus:ring-[#E8CEB0] focus:ring-offset-2 focus:ring-offset-[#775522] animate-bounce-once">
          Send Us a Message <FaChevronRight className="inline-block ml-2 -translate-y-px" />
        </Link>
      </section>
    </div>
  );
}