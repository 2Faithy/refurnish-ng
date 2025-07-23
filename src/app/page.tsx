import React from "react";
import Image from "next/image";
import Link from "next/link";
import products from "@/data/products.json";
import { FaInfoCircle, FaQuestionCircle, FaHeadset, FaEnvelope } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="font-sans text-[#5F7161]">
      {/* Hero Section */}
      <section
        className="w-full min-h-screen relative bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg2.png')" }}
      >
        <div className="absolute inset-0 bg-[#E8CEB0]/30 z-0"></div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-16 flex flex-col md:flex-row items-center justify-between top-35">
          <div className="max-w-xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#5F7161] leading-tight">
              Simplifying Furniture Buying & Selling in Lagos
            </h1>
            <p className="text-lg leading-7 mb-8">
              Discover a seamless, safe, and efficient marketplace where you can declutter, furnish, and refresh your space with ease.
            </p>
            <Link href="/shop" className="inline-block bg-[#775522] text-white px-6 py-3 rounded-md shadow hover:bg-[#5E441B] transition-all duration-300">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
<section className="bg-[#F6F1EB] py-12 px-4 sm:px-8 lg:px-16 overflow-hidden">
  <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#5F7161] mb-8 animate-fade-in-up">
    Hot Deals
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
    {products.slice(0, 3).map((product, index) => (
      <div
        key={product.id}
        className={`
          bg-white shadow-xl rounded-xl p-6 text-center
          transform transition-all duration-300 ease-in-out
          hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-[#E8CEB0]
          flex flex-col items-center animate-fade-in-up
        `}
        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
      >
        <div className="w-full h-[200px] mb-4 overflow-hidden rounded-lg border border-gray-100 group-hover:border-[#775522] transition-colors duration-300">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={200}
            className="w-full h-full object-cover object-center transform transition-transform duration-300 hover:scale-110"
          />
        </div>
        <h3 className="font-semibold text-xl text-[#5F7161] mb-2 truncate w-full">
          {product.name}
        </h3>
        <p className="mb-4 text-[#775522] font-bold text-2xl">
  ₦{product.price.toLocaleString()}
  {product.oldPrice !== undefined && (
    <span className="line-through text-gray-400 text-base ml-2">
      ₦{product.oldPrice.toLocaleString()}
    </span>
  )}
</p>

        <Link
          href="/shop"
          className="text-white bg-[#775522] px-6 py-3 rounded-full font-semibold text-lg hover:bg-[#5E441B] transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E8CEB0] focus:ring-offset-2"
        >
          Grab Deal
        </Link>
      </div>
    ))}
  </div>
</section>

      {/* How It Works Section */}
      <section className="bg-[#E8CEB0]/30 py-16 px-4 sm:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-center text-[#5F7161] mb-10"> How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <Image src="/how1.png" alt="Step 1" width={80} height={80} className="mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">1. Browse</h4>
            <p>Explore listings from trusted sellers across Lagos.</p>
          </div>
          <div>
            <Image src="/how2.png" alt="Step 2" width={80} height={80} className="mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">2. Connect</h4>
            <p>Chat directly with sellers and get answers fast.</p>
          </div>
          <div>
            <Image src="/how3.png" alt="Step 3" width={80} height={80} className="mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2">3. Buy & Enjoy</h4>
            <p>Secure safe payment and enjoy your new furniture.</p>
          </div>
        </div>
      </section>

      {/* Sign Up Today Section */}
      <section className="bg-gradient-to-br from-[#775522] to-[#A07B3F] text-white py-16 px-4 sm:px-8 lg:px-24 text-center relative overflow-hidden">
  <div className="absolute inset-0 bg-pattern-overlay opacity-10 z-0"></div>

  <div className="relative z-10"> 
    <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 animate-scale-in drop-shadow-md">
      Join Our Thriving Community!
    </h2>
    <p className="mb-8 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
      Unlock <strong className="text-[#E8CEB0]">exclusive deals</strong>, effortlessly sell your beloved furniture, and connect with a trusted network of passionate buyers & sellers.
    </p>
    <Link
      href="/login#signup"
      className="
        inline-block bg-white text-[#775522] font-bold text-lg px-8 py-4 rounded-full shadow-lg
        hover:bg-[#FFD700] hover:text-[#5E441B] transition-all duration-300 ease-in-out
        transform hover:-translate-y-1 hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-[#E8CEB0] focus:ring-offset-2 focus:ring-offset-[#775522]
        animate-pulse-once
      "
    >
      Sign Up Free Today! 🚀
    </Link>
  </div>
</section>

    <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-16 bg-[#F9F9F9] overflow-hidden relative">
      {/* Subtle background element for visual interest */}
      <div className="absolute top-0 left-1/2 w-80 h-80 bg-[#E8CEB0] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-blob-slow-reverse"></div>
      <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-[#775522] opacity-5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-blob-slow"></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-[#775522] mb-12 drop-shadow-md animate-fade-in-down">
          Explore Our Resources
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {/* Quick Links with Icons */}
          {[
            {
              icon: <FaInfoCircle />,
              title: 'About Us',
              desc: 'Discover our story, mission, and how Refurnish NG is dedicated to transforming the furniture marketplace.',
              href: '/about',
              linkText: 'Learn More',
            },
            {
              icon: <FaQuestionCircle />,
              title: 'FAQs',
              desc: 'Get quick answers to the most common questions about buying, selling, and using Refurnish NG.',
              href: '/help#faqs',
              linkText: 'Visit FAQs',
            },
            {
              icon: <FaHeadset />,
              title: 'Support',
              desc: 'Need a hand with an order or an issue? Our friendly support team is here to help you every step of the way.',
              href: '/help#support',
              linkText: 'Get Support',
            },
            {
              icon: <FaEnvelope />,
              title: 'Contact Us',
              desc: 'Have a specific inquiry or feedback? Reach out directly through our contact form, email, or social media channels.',
              href: '/contact',
              linkText: 'Send a Message',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-start
                         transform hover:scale-[1.03] hover:shadow-xl transition-all duration-300 ease-in-out
                         border border-gray-100 animate-fade-in-up-staggered"
              style={{ animationDelay: `${0.15 * i}s` }} // Staggered animation
            >
              <div className="text-5xl text-[#E8CEB0] mb-4 p-3 rounded-full bg-[#775522]/10 inline-flex items-center justify-center drop-shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#5F7161]">{item.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6 flex-grow">
                {item.desc}
              </p>
              <Link
                href={item.href}
                className="inline-flex items-center text-[#775522] font-semibold hover:underline text-lg group"
              >
                {item.linkText}{' '}
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    </div>
  );
}
