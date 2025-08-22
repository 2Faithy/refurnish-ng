"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import products from "@/data/products.json";
import {
  FaInfoCircle,
  FaQuestionCircle,
  FaHeadset,
  FaEnvelope,
  FaArrowRight,
  FaArrowLeft,
  FaStar,
  FaCheckCircle
} from "react-icons/fa";
import DiscountModal from "../components/DiscountModal";

// Assume these images exist in your public folder or are imported
const collectionImages = {
  newArrivals: "/images/collection-new-arrivals.jpg",
  kidsFashion: "/images/collection-kids-fashion.jpg",
  womenLingerie: "/images/collection-women-lingerie.jpg",
  classic: "/images/collection-classic.jpg",
  vintageFinds: "/images/collection-vintage-finds.jpg",
  outdoorLiving: "/images/collection-outdoor-living.jpg",
  homeDecor: "/images/collection-home-decor.jpg",
  bedroomEssentials: "/images/collection-bedroom-essentials.jpg",
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);

  const slides = [
    {
      title: "Simplifying Furniture Buying & Selling in Lagos",
      description:
        "Discover a seamless, safe, and efficient marketplace where you can declutter, furnish, and refresh your space with ease.",
      image: "/hero-bg2.png",
      textColor: "text-black",
      buttons: [
        {
          text: "Shop Now",
          href: "/shop",
          bgColor: "bg-[#775522]",
          hoverBg: "hover:bg-[#5E441B]",
          textColor: "text-white",
        },
      ],
    },
    {
      title: "Declutter Your Space, Earn Extra Cash!",
      description:
        "Ready to part with your pre-loved furniture? List it effortlessly and connect with eager buyers in Lagos.",
      image: "/hero-bg3.png",
      textColor: "text-[#5F7161]",
      buttons: [
        {
          text: "Sell Now",
          href: "./dashboard/sell",
          bgColor: "bg-[#775522]",
          hoverBg: "hover:bg-[#5E441B]",
          textColor: "text-white",
        },
      ],
    },
    {
      title: "Your Ultimate Furniture Marketplace",
      description:
        "Whether you're furnishing a new home or giving old pieces a new life, find or sell exactly what you need with ease.",
      image: "/hero-bg4.png",
      textColor: "text-white",
      buttons: [
        {
          text: "Shop Now",
          href: "/shop",
          bgColor: "bg-[#775522]",
          hoverBg: "hover:bg-[#5E441B]",
          textColor: "text-white",
        },
        {
          text: "Sell Now",
          href: "https://forms.gle/41o14xQc4J4kR6Kz7",
          bgColor: "bg-transparent border-2 border-white",
          hoverBg: "hover:bg-white hover:text-[#775522]",
          textColor: "text-white",
        },
      ],
    },
  ];

  const collections = [
    {
      name: "New arrivals",
      image: collectionImages.newArrivals,
      alt: "Man smiling in a light blue shirt",
      href: "/shop?category=new-arrivals",
    },
    {
      name: "Kids furniture",
      image: collectionImages.kidsFashion,
      alt: "Young girl in a red dress and hat",
      href: "/shop?category=kids-furniture",
    },
    {
      name: "Sofa",
      image: collectionImages.womenLingerie,
      alt: "Woman in red lingerie",
      href: "/shop?category=sofa",
    },
    {
      name: "Home Deco",
      image: collectionImages.classic,
      alt: "Boy in a red hoodie and sunglasses",
      href: "/shop?category=home-deco",
    },
    {
      name: "Office Furniture",
      image: collectionImages.vintageFinds,
      alt: "Vintage furniture in a cozy room",
      href: "/shop?category=office-furniture",
    },
    {
      name: "Beds",
      image: collectionImages.outdoorLiving,
      alt: "Outdoor patio furniture",
      href: "/shop?category=beds",
    },
    {
      name: "Chairs",
      image: collectionImages.homeDecor,
      alt: "Stylish home decor items",
      href: "/shop?category=chairs",
    },
    {
      name: "Tables",
      image: collectionImages.bedroomEssentials,
      alt: "Cozy bedroom setup with bed",
      href: "/shop?category=tables",
    },
  ];

  const collectionsPerPage = 4;

  const nextCollection = () => {
    setCurrentCollectionIndex((prevIndex) => {
      const maxIndex = collections.length - collectionsPerPage;
      return prevIndex + 1 > maxIndex ? maxIndex : prevIndex + 1;
    });
  };

  const prevCollection = () => {
    setCurrentCollectionIndex((prevIndex) => {
      return prevIndex - 1 < 0 ? 0 : prevIndex - 1;
    });
  };

  const isPrevDisabled = currentCollectionIndex === 0;
  const isNextDisabled =
    currentCollectionIndex >= collections.length - collectionsPerPage;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const modalTimer = setTimeout(() => {
      setShowDiscountModal(true);
    }, 1000);
    return () => clearTimeout(modalTimer);
  }, []);

  const handleCloseModal = () => {
    setShowDiscountModal(false);
  };

  return (
    <div className="font-sans text-[#5F7161]">
      <DiscountModal show={showDiscountModal} onClose={handleCloseModal} />

      {/* Hero Section - Unchanged */}
      <section
        className="w-full min-h-screen relative bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      >
        <div className="absolute inset-0 bg-[#E8CEB0]/30 z-0"></div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 py-16 flex flex-col items-center justify-center min-h-screen">
          <div
            key={currentSlide}
            className={`max-w-xl text-center md:text-left pt-24 pb-16 animate-fade-in-up ${slides[currentSlide].textColor}`}
          >
            <h1
              className={`text-4xl md:text-5xl font-bold mb-6 leading-tight animate-text-fade-in`}
            >
              {slides[currentSlide].title}
            </h1>
            <p
              className={`text-lg leading-7 mb-8 animate-text-fade-in`}
              style={{ animationDelay: "0.2s" }}
            >
              {slides[currentSlide].description}
            </p>
            <div
              className="flex justify-center md:justify-start space-x-4 animate-text-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {slides[currentSlide].buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={`inline-block ${button.bgColor} ${button.hoverBg} ${button.textColor} px-6 py-3 rounded-md shadow transition-all duration-300`}
                >
                  {button.text}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? "bg-[#775522]" : "bg-gray-300"
              } transition-colors duration-300`}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="min-h-screen flex items-center bg-[#F6F1EB] py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#5F7161] mb-4">
              Hot Deals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Limited time offers on premium furniture. Don't miss out on these amazing deals!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.slice(0, 3).map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    SALE
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#5F7161] mb-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">(24 reviews)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#775522]">
                        ₦{product.price.toLocaleString()}
                      </p>
                      {product.oldPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ₦{product.oldPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    
                    <Link
                      href="/shop"
                      className="bg-[#775522] text-white px-6 py-2 rounded-full hover:bg-[#5E441B] transition-colors duration-300"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-block border-2 border-[#775522] text-[#775522] px-8 py-3 rounded-full font-semibold hover:bg-[#775522] hover:text-white transition-all duration-300"
            >
              View All Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Collection Section */}
      <section className="min-h-screen flex items-center py-16 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#775522] mb-4">
              Shop by Collection
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections to find the perfect pieces for your space
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {collections.slice(0, 8).map((collection, index) => (
                <Link
                  href={collection.href}
                  key={index}
                  className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500"
                >
                  <div className="h-64 overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.alt}
                      width={400}
                      height={256}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white text-xl font-semibold">
                      {collection.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="flex justify-center mt-12 space-x-4">
              <button
                onClick={prevCollection}
                disabled={isPrevDisabled}
                className={`p-3 rounded-full border border-[#775522] text-[#775522] hover:bg-[#775522] hover:text-white transition-colors duration-300 ${isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextCollection}
                disabled={isNextDisabled}
                className={`p-3 rounded-full border border-[#775522] text-[#775522] hover:bg-[#775522] hover:text-white transition-colors duration-300 ${isNextDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <FaArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="min-h-screen flex items-center bg-[#E8CEB0]/20 py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#5F7161] mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Buying and selling furniture has never been easier with our simple process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#775522] rounded-full flex items-center justify-center text-white">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#5F7161] mb-4">Browse or List</h3>
              <p className="text-gray-600">
                Explore thousands of furniture listings or easily list your items for sale in minutes.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#775522] rounded-full flex items-center justify-center text-white">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#5F7161] mb-4">Connect & Communicate</h3>
              <p className="text-gray-600">
                Chat directly with buyers or sellers to ask questions and arrange viewings.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg transform transition-all duration-500 hover:-translate-y-2">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#775522] rounded-full flex items-center justify-center text-white">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#5F7161] mb-4">Complete Transaction</h3>
              <p className="text-gray-600">
                Finalize your purchase or sale with secure payment options and safe pickup/delivery.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-[#775522] mb-4">Why Choose Refurnish NG?</h3>
                <ul className="space-y-4">
                  {[
                    "Verified sellers and authentic products",
                    "Secure messaging system",
                    "Price comparison tools",
                    "Delivery coordination services",
                    "Quality assurance guarantee"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="h-64 bg-gray-200 rounded-xl overflow-hidden">
                <Image
                  src="/why-choose-us.jpg"
                  alt="Why choose Refurnish NG"
                  width={500}
                  height={256}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="min-h-screen flex items-center py-16 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#775522] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from people who have transformed their spaces with Refurnish NG
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Chinedu O.",
                location: "Lekki, Lagos",
                content: "I sold my old sofa set in just 2 days! The process was smooth and the buyer was verified. Highly recommend!",
                rating: 5
              },
              {
                name: "Amaka T.",
                location: "Ikeja, Lagos",
                content: "Found the perfect dining table for my new apartment at half the price of a new one. Quality was exactly as described!",
                rating: 5
              },
              {
                name: "Tunde B.",
                location: "Victoria Island, Lagos",
                content: "As a landlord, I regularly furnish apartments with pieces from Refurnish NG. Great quality and amazing prices!",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#F6F1EB] p-8 rounded-2xl shadow-md">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-[#5F7161]">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-[#775522] to-[#A07B3F] py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of Lagosians who are buying and selling quality furniture on Refurnish NG
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link
              href="/shop"
              className="bg-white text-[#775522] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Start Shopping
            </Link>
            <Link
              href="https://forms.gle/41o14xQc4J4kR6Kz7"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#775522] transition-all duration-300"
            >
              Start Selling
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold">10,000+</p>
              <p className="text-sm opacity-80">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold">5,000+</p>
              <p className="text-sm opacity-80">Listings</p>
            </div>
            <div>
              <p className="text-4xl font-bold">98%</p>
              <p className="text-sm opacity-80">Satisfaction Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold">24/7</p>
              <p className="text-sm opacity-80">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="min-h-screen flex items-center py-16 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#775522] mb-4">
              Helpful Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to make the most of your Refurnish NG experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaInfoCircle className="w-8 h-8" />,
                title: "About Us",
                desc: "Learn about our mission to revolutionize furniture trading in Lagos",
                href: "/about",
                linkText: "Our Story"
              },
              {
                icon: <FaQuestionCircle className="w-8 h-8" />,
                title: "FAQs",
                desc: "Find answers to commonly asked questions about buying and selling",
                href: "/faqs",
                linkText: "Get Answers"
              },
              {
                icon: <FaHeadset className="w-8 h-8" />,
                title: "Support",
                desc: "Get help from our dedicated customer support team",
                href: "/support",
                linkText: "Contact Support"
              },
              {
                icon: <FaEnvelope className="w-8 h-8" />,
                title: "Contact",
                desc: "Reach out to us with any questions or feedback",
                href: "/contact",
                linkText: "Get In Touch"
              }
            ].map((item, index) => (
              <div key={index} className="bg-[#F6F1EB] p-8 rounded-2xl text-center group hover:bg-[#E8CEB0] transition-colors duration-300">
                <div className="text-[#775522] mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#5F7161] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {item.desc}
                </p>
                <Link
                  href={item.href}
                  className="text-[#775522] font-semibold inline-flex items-center group-hover:underline"
                >
                  {item.linkText} <FaArrowRight className="ml-2 w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}