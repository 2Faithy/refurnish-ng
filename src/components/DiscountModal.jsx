"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";

export default function DiscountModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the modal
    const hasSeen = localStorage.getItem("refurnish_discount_shown");
    if (!hasSeen) {
      // Delay it by 2 seconds so it doesn't block the initial page load
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("refurnish_discount_shown", "true");
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#211000]/30 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-[#FAF4EC] rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full relative overflow-hidden border border-[#211000]/5"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#211000]/40 hover:text-[#211000] p-2 rounded-full bg-white/50 hover:bg-white transition-all z-10"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 relative min-h-[200px] md:min-h-[480px]">
            <Image
              src="/airbnb.jpg"
              alt="Unlock Discount"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[#B66B44]/10" />
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#B66B44]/10 px-4 py-1.5 mb-6">
              <Sparkles className="size-3.5 text-[#B66B44]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                Welcome Offer
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#211000] mb-6 leading-tight">
              A gift for your home.
            </h2>

            <p className="text-sm sm:text-base text-[#211000]/70 leading-relaxed mb-10 font-medium">
              Sign up today and get{" "}
              <strong className="text-[#B66B44] font-bold">10% OFF</strong> your
              first purchase or{" "}
              <strong className="text-[#5F7161] font-bold">
                FREE LOGISTICS
              </strong>{" "}
              on your first two orders.
            </p>

            <Link href="/login" onClick={handleClose}>
              <button className="w-full sm:w-auto bg-[#211000] text-[#E8CEB0] px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#B66B44] transition-all active:scale-[0.98]">
                Claim my discount
              </button>
            </Link>

            <button
              onClick={handleClose}
              className="mt-6 text-xs font-bold text-[#211000]/40 hover:text-[#211000] underline underline-offset-4 transition-colors"
            >
              No thanks
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
