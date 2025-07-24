// components/DiscountModal.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'

export default function DiscountModal({ onClose, show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full relative overflow-hidden transform scale-95 opacity-0 animate-scale-in-and-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-300 z-10"
          aria-label="Close discount pop-up"
        >
          &times;
        </button>

        {/* Image Section (Left) - Enhanced with subtle overlay */}
        <div className="w-full md:w-1/2 relative min-h-[200px] md:min-h-[450px] overflow-hidden">
          <Image
            src="/hero-bg-modal-mobile.png" 
            alt="Unlock Your Exclusive Discount"
            layout="fill"
            objectFit="cover"
            className="rounded-l-xl hidden md:block transform hover:scale-105 transition-transform duration-500"
          />
          <Image
            src="/hero-bg-modal-mobile.png" 
            alt="Unlock Your Exclusive Discount"
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl md:hidden transform hover:scale-105 transition-transform duration-500"
          />
          {/* Subtle overlay for better text contrast if image is too bright */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Content Section (Right) - More central and engaging */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#FFF8ED] to-[#F6F1EB]">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#775522] mb-4 leading-tight drop-shadow-sm animate-fade-in-down">
            Exclusive Offer Just For You!
          </h2>
          <p className="text-lg sm:text-xl text-gray-800 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Sign up now to get <strong className="text-red-600 font-bold">10% OFF</strong> your first purchase
            <br />
            OR enjoy <strong className="text-green-700 font-bold">FREE LOGISTICS</strong> on your first two orders!
          </p>

          <Link href="/signup"> {/* Link to your sign-up page */}
            <button
              className="bg-[#775522] text-white px-10 py-4 rounded-full font-extrabold text-xl shadow-lg
                         hover:bg-[#5E441B] hover:scale-105 transition-all duration-300 ease-in-out
                         transform animate-pulse-once"
            >
              Claim My Discount Now!
            </button>
          </Link>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-medium text-base mt-6 underline transition-colors duration-200"
          >
            No thanks.
          </button>
        </div>
      </div>
    </div>
  );
}