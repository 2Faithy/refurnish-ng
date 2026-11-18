
"use client";

import React, { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  const PRIMARY_COLOR = "#8B2C24";
  const ACCENT_COLOR = "#E8CEB0";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Subscription failed. Please try again.");
      }

      setMessage("Thank you for subscribing!");
      setMessageType("success");
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white w-full text-gray-700 font-sans border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] py-10 px-4 sm:px-8 lg:px-6">
        {/* COLUMN 1: Logo & Description */}
        <div className="py-4 lg:py-0 lg:pr-10">
          <div className="mb-4">
            <img
              src="/logo.png"
              alt="Refurnish NG Logo"
              className="w-[180px] h-auto"
            />
          </div>

          <p className="text-sm leading-relaxed text-gray-600 max-w-[250px]">
            Refurnish NG is your trusted Nigerian marketplace for
            quality used furniture. Buy smart, sell sustainability
          </p>
        </div>

        {/* COLUMN 2, 3, 4: Navigation Links & Connect */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          {/* COMPANY */}
          <div>
            <h3
              className="text-base font-semibold mb-4 uppercase"
              style={{ color: PRIMARY_COLOR }}
            >
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
              <li><Link href="/help#faqs" className="hover:text-black transition-colors">FAQs</Link></li>
              <li><Link href="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div>
            <h3
              className="text-base font-semibold mb-4 uppercase"
              style={{ color: PRIMARY_COLOR }}
            >
              Help
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/support" className="hover:text-black transition-colors">Support</Link></li>
              <li><Link href="/returns" className="hover:text-black transition-colors">Returns</Link></li>
              <li><Link href="/help#how-it-works" className="hover:text-black transition-colors">How it works</Link></li>
            </ul>
          </div>

          {/* CONNECT & SUBSCRIPTION */}
          <div>
            <h3
              className="text-base font-semibold mb-4 uppercase"
              style={{ color: PRIMARY_COLOR }}
            >
              Connect
            </h3>

            <div className="flex gap-4 mb-4 text-xl text-gray-600">
              <a href="#" aria-label="Facebook"><FaFacebookF className="hover:text-black transition-colors" /></a>
              <a href="#" aria-label="Instagram"><FaInstagram className="hover:text-black transition-colors" /></a>
              <a href="#" aria-label="Twitter"><FaTwitter className="hover:text-black transition-colors" /></a>
              <a href="#" aria-label="Pinterest"><FaPinterestP className="hover:text-black transition-colors" /></a>
            </div>

            <p className="text-sm mb-2">Subscribe to our updates</p>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-[250px] text-sm"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                disabled={loading}
                className="min-w-0 p-3 text-gray-700 rounded-l-md w-full border border-r-0 border-gray-300 outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-60"
                style={{ backgroundColor: "#F0F0EE" }}
              />

              <button
                type="submit"
                disabled={loading}
                className="text-black px-4 py-3 rounded-r-md transition-colors duration-200 active:scale-[0.98] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: ACCENT_COLOR, fontWeight: 500 }}
              >
                {loading ? "..." : "SUBSCRIBE"}
              </button>
            </form>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-2 max-w-[250px] text-xs font-semibold ${
                  messageType === "success"
                    ? "text-[#426348]"
                    : "text-red-700"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center text-sm text-gray-600 border-t border-gray-200 py-4">
        © {new Date().getFullYear()} Refurnish NG. All rights reserved.
      </div>
    </footer>
  );
}
