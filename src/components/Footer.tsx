// src/components/Footer.tsx

import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPinterest,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-[#5F7161] w-full font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] border-t border-gray-200">
        <div className="px-6 py-8 sm:py-10 lg:px-6 lg:py-10 lg:border-r lg:border-gray-200 lg:pr-10"> {/* Adjusted padding and border */}
          <img src="/logo.png" alt="ReFurnish NG Logo" className="w-[160px] mb-4 transform transition-transform duration-300 hover:scale-105" />
          <p className="text-sm leading-6 pr-2 animate-fade-in-up">
            ReFurnish NG is your trusted Nigerian marketplace for quality used furniture. Buy smart, sell sustainably.
          </p>
        </div>

        <div className="px-6 py-8 sm:py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"> {/* Adjusted padding and gap */}
          {/* Company */}
          <div className="animate-fade-in-up delay-100">
            <h3 className="text-lg font-semibold mb-4 text-[#775522]">Company</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/about" className="hover:text-[#775522] transition-colors duration-200 hover:translate-x-1 inline-block">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#775522] transition-colors duration-200 hover:translate-x-1 inline-block">Contact</Link></li>
              <li><Link href="/help#faqs" className="hover:text-[#775522] transition-colors duration-200 hover:translate-x-1 inline-block">FAQs</Link></li>
              <li><Link href="/terms" className="hover:text-[#775522] transition-colors duration-200 hover:translate-x-1 inline-block">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="animate-fade-in-up delay-200">
            <h3 className="text-lg font-semibold mb-4 text-[#775522]">Help</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/help#support" className="hover:text-[#775522] transition-colors duration-200 hover:translate-x-1 inline-block">Support</Link></li>
              <li><Link href="/returns" className="hover:text-[#775522] transition-colors duration-200 hover:translate-x-1 inline-block">Returns</Link></li>
              <li><Link href="/help#how-it-works" className="hover:text-[#775522] transition-colors duration-200 hover:translate-x-1 inline-block">How It Works</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="animate-fade-in-up delay-300">
            <h3 className="text-lg font-semibold mb-4 text-[#775522]">Connect</h3>
            <div className="flex gap-5 mb-4 text-xl">
              <FaFacebook className="cursor-pointer hover:text-[#9933BB] transition-colors duration-200 transform hover:scale-125" />
              <FaInstagram className="cursor-pointer hover:text-[#9933BB] transition-colors duration-200 transform hover:scale-125" />
              <FaTwitter className="cursor-pointer hover:text-[#9933BB] transition-colors duration-200 transform hover:scale-125" />
              <FaPinterest className="cursor-pointer hover:text-[#9933BB] transition-colors duration-200 transform hover:scale-125" />
            </div>
            <p className="text-sm mb-2">Subscribe to our updates</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 text-black rounded-l-md w-full outline-none focus:ring-2 focus:ring-[#9933BB] transition-all duration-200"
              />
              <button
                type="submit"
                className="bg-[#E8CEB0] text-black px-4 py-2 rounded-r-md hover:bg-[#dcbfa3] transition-colors duration-200 active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm text-[#5F7161] border-t border-[#E8CEB0]/30 py-6 animate-fade-in delay-400">
        © {new Date().getFullYear()} ReFurnish NG. All rights reserved.
      </div>
    </footer>
  );
}