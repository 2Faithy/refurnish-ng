"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import products from "@/data/products.json";
import {
  FaCheck,
  FaInfoCircle,
  FaQuestionCircle,
  FaHeadset,
  FaEnvelope,
  FaArrowRight,
  FaArrowLeft,
  FaStar,
  FaCheckCircle,
  FaHeart,
} from "react-icons/fa";
import DiscountModal from "../components/DiscountModal";

const testimonials = [
  {
    id: 1,
    feedback: "The sofa was perfect and in great condition! Buying it was easy with a click of a button and they worked with my schedule for pick up. First time buying with Re-furnish was awesome!",
    author: "Ifechukwude . E",
    bgImage: "/testimonial.jpg" 
  },
  {
    id: 2,
    feedback: "I was hesitant at first, but Refurnish exceeded my expectations. The dining set looked even better in person, and the delivery was smooth. Highly recommend for quality pre-owned furniture!",
    author: "Chinedu . O",
    bgImage: "/testimonial.jpg"
  },
  {
    id: 3,
    feedback: "Fantastic experience! Found exactly what I needed for my bedroom at a fraction of the cost. The team was very helpful and trustworthy. Will definitely use Refurnish again.",
    author: "Aisha . G",
    bgImage: "/testimonial.jpg"
  },
  {
    id: 4,
    feedback: "Selling my old office desk was a breeze with Refurnish. The process was transparent, and I got a fair price. It's a great platform for giving furniture a second life.",
    author: "Tunde . A",
    bgImage: "/testimonial.jpg"
  },
];

const categories = [
  { id: 1, name: 'LIVING', imageUrl: '/living.jpg' },
  { id: 2, name: 'DINING', imageUrl: '/dining.jpg' },
  { id: 3, name: 'BEDROOM', imageUrl: '/bedroom.jpg' },
  { id: 4, name: 'OFFICE', imageUrl: 'https://via.placeholder.com/400x400/A79A8F/333333?text=HOME+OFFICE' },
  { id: 5, name: 'OUTDOOR', imageUrl: 'https://via.placeholder.com/400x400/968E82/333333?text=OUTDOOR' },
  { id: 6, name: 'KITCHEN', imageUrl: 'https://via.placeholder.com/400x400/857D71/333333?text=KITCHEN' },
  { id: 7, name: 'BATHROOM', imageUrl: 'https://via.placeholder.com/400x400/746C60/333333?text=BATHROOM' },
  { id: 8, name: 'STORAGE', imageUrl: 'https://via.placeholder.com/400x400/635B4F/333333?text=STORAGE' },
];

const articles = [
  {
    date: 'August 30, 2030',
    title: 'How to Design your Home to be Functional',
    readTime: '5 mins read',
    imageUrl: 'https://via.placeholder.com/350x250/F0F0EE/333333?text=Article+Image+1', // Replace with your image paths
  },
  {
    date: 'Oct 23, 2030',
    title: 'Creating the right mood board for your home space',
    readTime: '7 mins read',
    imageUrl: 'https://via.placeholder.com/350x250/F0F0EE/333333?text=Article+Image+2',
  },
  {
    date: 'Nov 20-22, 2030',
    title: 'How to save space in a small home',
    readTime: '6 mins read',
    imageUrl: 'https://via.placeholder.com/350x250/F0F0EE/333333?text=Article+Image+3',
  },
];

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
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentTopPickSlide, setCurrentTopPickSlide] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);

  const heroSlides = [
    {
      title: "Find Quality Pre-Owned Furniture Near You",
      description:
        "Discover unique, gently used furniture in excellent condition, near you, at unbeatable prices.",
      image: "/hero1.jpg",
      textColor: "text-white",
      buttons: [
        {
          text: "BROWSE",
          href: "/shop",
          bgColor: "bg-[#91B5B3]",
          hoverBg: "hover:bg-[#7a9d9b]",
          textColor: "text-white",
        },
      ],
    },
    {
      title: "Simplifying Furniture Buying & Selling in Lagos",
      description:
        "A seamless, safe, and efficient marketplace where you can declutter, furnish, and refresh your space with ease.",
      image: "/hero2.jpg",
      textColor: "text-white",
      buttons: [
        {
          text: "SHOP NOW",
          href: "/shop",
          bgColor: "bg-[#5F7161]",
          hoverBg: "hover:bg-[#4d5c4e]",
          textColor: "text-white",
        },
      ],
    },
    {
      title: "Turn Your Unused Furniture To Cash Today!",
      description:
        "Unlock the value of your unused items and earn extra cash with just a few clicks.",
      image: "/hero3.jpg",
      textColor: "text-white",
      buttons: [
        {
          text: "START SELLING",
          href: "/dashboard/sell",
          bgColor: "bg-[#91B5B3]",
          hoverBg: "hover:bg-[#7a9d9b]",
          textColor: "text-white",
        },
      ],
    },
    {
      title: "Declutter Your Space, Earn Extra Cash!",
      description:
        "Ready to part with your pre-loved furniture? List it effortlessly and connect with eager buyers in Lagos.",
      image: "/hero4.jpg",
      textColor: "text-white",
      buttons: [
        {
          text: "SELL NOW",
          href: "/dashboard/sell",
          bgColor: "bg-[#5F7161]",
          hoverBg: "hover:bg-[#4d5c4e]",
          textColor: "text-white",
        },
      ],
    },
    {
      title: "Your Ultimate Furniture Marketplace",
      description:
        "Whether you're furnishing a new home or giving old pieces a new life, find or sell exactly what you need with ease.",
      image: "/hero5.jpg",
      textColor: "text-white",
      buttons: [
        {
          text: "SHOP NOW",
          href: "/shop",
          bgColor: "bg-[#5F7161]",
          hoverBg: "hover:bg-[#4d5c4e]",
          textColor: "text-white",
        },
        {
          text: "SELL NOW",
          href: "/dashboard/sell",
          bgColor: "bg-[#5F7161]",
          hoverBg: "hover:bg-[#4d5c4e]",
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

  const topPicks = [
    {
      id: "tp1",
      name: "Asymmetrical Sofa",
      image: "/asymmetrical-sofa.png",
      price: 150000,
      oldPrice: 400000,
      quantity: 1,
      deliveryOff: 8000,
    },
    {
      id: "tp2",
      name: "Round Coffee Table",
      image: "/round-coffee-table.png",
      price: 45000,
      oldPrice: 50000,
      quantity: 1,
      deliveryOff: 5000,
    },
    {
      id: "tp3",
      name: "Modern Armchair",
      image: "/modern-armchair.png",
      price: 90000,
      oldPrice: 250000,
      quantity: 1,
      deliveryOff: 7000,
    },
    {
      id: "tp4",
      name: "Elegant Bookshelf",
      image: "/elegant-bookshelf.png",
      price: 120000,
      oldPrice: 300000,
      quantity: 1,
      deliveryOff: 10000,
    },
    {
      id: "tp5",
      name: "Vintage Dresser",
      image: "/vintage-dresser.png",
      price: 80000,
      oldPrice: 200000,
      quantity: 1,
      deliveryOff: 6000,
    },
    {
      id: "tp6",
      name: "Dining Chairs (Set of 4)",
      image: "/dining-chairs.png",
      price: 180000,
      oldPrice: 450000,
      quantity: 1,
      deliveryOff: 12000,
    },
    {
      id: "tp7",
      name: "Minimalist Bed Frame",
      image: "/minimalist-bed-frame.png",
      price: 200000,
      oldPrice: 500000,
      quantity: 1,
      deliveryOff: 15000,
    },
    {
      id: "tp8",
      name: "Study Desk",
      image: "/study-desk.png",
      price: 60000,
      oldPrice: 150000,
      quantity: 1,
      deliveryOff: 4000,
    },
    {
      id: "tp9",
      name: "Velvet Pouffe",
      image: "/velvet-pouffe.png",
      price: 35000,
      oldPrice: 80000,
      quantity: 1,
      deliveryOff: 3000,
    },
    {
      id: "tp10",
      name: "Glass Display Cabinet",
      image: "/glass-cabinet.png",
      price: 170000,
      oldPrice: 420000,
      quantity: 1,
      deliveryOff: 11000,
    },
    {
      id: "tp11",
      name: "Outdoor Lounge Set",
      image: "/outdoor-lounge-set.png",
      price: 300000,
      oldPrice: 700000,
      quantity: 1,
      deliveryOff: 20000,
    },
    {
      id: "tp12",
      name: "Accent Side Table",
      image: "/accent-side-table.png",
      price: 55000,
      oldPrice: 130000,
      quantity: 1,
      deliveryOff: 4500,
    },
  ];

  const collectionsPerPage = 4;
  const topPicksPerPage = 3;

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

  const handleHeroSlideChange = (newSlide: number) => {
    if (newSlide !== currentHeroSlide) {
      setCurrentHeroSlide(newSlide);
    }
  };

  const handleTopPickSlideChange = (newSlide: number) => {
    if (newSlide !== currentTopPickSlide) {
      setCurrentTopPickSlide(newSlide);
    }
  };

  const nextTopPickSlide = () => {
    setCurrentTopPickSlide((prev) => (prev + 1) % Math.ceil(topPicks.length / topPicksPerPage));
  };

  const prevTopPickSlide = () => {
    setCurrentTopPickSlide((prev) => (prev - 1 + Math.ceil(topPicks.length / topPicksPerPage)) % Math.ceil(topPicks.length / topPicksPerPage));
  };

  useEffect(() => {
    const heroTimer = setInterval(() => {
      handleHeroSlideChange((currentHeroSlide + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(heroTimer);
  }, [currentHeroSlide, heroSlides.length]);

  useEffect(() => {
    const topPickTimer = setInterval(() => {
      nextTopPickSlide();
    }, 7000);
    return () => clearInterval(topPickTimer);
  }, [currentTopPickSlide, topPicks.length]);

  useEffect(() => {
    const modalTimer = setTimeout(() => {
      setShowDiscountModal(true);
    }, 1000);
    return () => clearTimeout(modalTimer);
  }, []);

  const handleCloseModal = () => {
    setShowDiscountModal(false);
  };

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // useEffect to handle automatic sliding
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) =>
        (prevIndex + 1) % testimonials.length
      );
    }, 10000); // Change slide every 10 seconds (10000 ms)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [testimonials.length]); // Re-run effect if testimonials length changes

  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
    <div className="font-sans text-[#5F7161]">
      <DiscountModal show={showDiscountModal} onClose={handleCloseModal} />

      <section className="w-full min-h-screen relative overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
                currentHeroSlide === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                filter: "brightness(0.9)",
              }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col items-center justify-center min-h-screen text-center">
          <div className={`max-w-4xl pt-24 pb-16 transition-opacity duration-500`}>
            <h1
              className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${heroSlides[currentHeroSlide].textColor} transition-colors duration-500`}
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {heroSlides[currentHeroSlide].title}
            </h1>

            <div className="overflow-hidden mb-10">
              <p
                className={`text-xl md:text-2xl leading-8 max-w-3xl mx-auto ${heroSlides[currentHeroSlide].textColor} transition-colors duration-500`}
                style={{
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {heroSlides[currentHeroSlide].description}
              </p>
            </div>

            <div className="flex justify-center flex-wrap gap-6">
              {heroSlides[currentHeroSlide].buttons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={`relative inline-block ${button.bgColor} ${button.hoverBg} ${button.textColor} px-10 py-4 rounded-md shadow-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.03] uppercase`}
                >
                  {button.text}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleHeroSlideChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentHeroSlide === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <section className="min-h-screen flex items-center bg-[#F6F1EB] py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#5F7161] mb-4">
              Our Top Picks
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-serif">
              Curated just for you. Discover exceptional furniture handpicked by our experts.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentTopPickSlide * (100 / (Math.min(topPicks.length, topPicksPerPage)))}%)`,
                }}
              >
                {topPicks.map((product, index) => {
                  const percentageOff = product.oldPrice
                    ? Math.round(
                        ((product.oldPrice - product.price) / product.oldPrice) *
                          100
                      )
                    : 0;

                  return (
                    <Link
                      href={`/product/${product.id}`}
                      key={product.id}
                      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4 group"
                    >
                      <div className="bg-[#FFFDFB] rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
                        <div className="relative h-72 bg-[#fbe7dc]">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                          <div className="absolute top-4 left-4 bg-[#8E4B35] text-white px-3 py-1 rounded-sm text-xs font-serif">
                            ₦{product.deliveryOff.toLocaleString()} off delivery
                          </div>
                          <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-colors duration-200">
                            <FaHeart className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="p-6 text-center font-serif text-[#5F7161]">
                          <h3 className="text-xl md:text-2xl font-normal mb-1">
                            {product.name}
                          </h3>
                          <p className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                            ₦{product.price.toLocaleString()}
                            {product.oldPrice && (
                              <span className="text-sm text-gray-500 line-through font-normal">
                                ₦{product.oldPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-base font-normal">• Qty: {product.quantity}</span>
                          </p>
                          <div className="text-sm flex items-center justify-center gap-2 text-gray-600">
                            <span>Est retail: ₦{product.oldPrice.toLocaleString()}</span>
                            {percentageOff > 0 && (
                              <span className="text-green-600 font-semibold">{percentageOff}% off</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <button
              onClick={prevTopPickSlide}
              className={`absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md transition-all duration-300 hover:scale-110 ${
                currentTopPickSlide === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100"
              }`}
              disabled={currentTopPickSlide === 0}
            >
              <FaArrowLeft className="w-5 h-5 text-[#775522]" />
            </button>
            <button
              onClick={nextTopPickSlide}
              className={`absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-2xl p-3 shadow-md transition-all duration-300 hover:scale-110 ${
                currentTopPickSlide === Math.ceil(topPicks.length / topPicksPerPage) - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
              disabled={currentTopPickSlide === Math.ceil(topPicks.length / topPicksPerPage) - 1}
            >
              <FaArrowRight className="w-5 h-5 text-[#775522]" />
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(topPicks.length / topPicksPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleTopPickSlideChange(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentTopPickSlide === index
                      ? "bg-[#8E4B35]"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to Top Pick slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center py-16 px-4 sm:px-8 lg:px-16" style={{ backgroundColor: '#F0F0EE' }}>
  <div className="max-w-4xl mx-auto w-full text-center">
    {/* Headline - Using a serif font (or simulating one) and a dark color */}
    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-8" style={{ fontFamily: 'Georgia, serif', color: '#333333' }}>Meet Refurnish</h2>
    
    {/* Body Text */}
    <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-10" style={{ color: '#4A4A4A' }}>
      A marketplace for furniture and décor — built for everyday Nigerians, reshaping how we buy and sell with quality, affordability, and trust at the core.
    </p>

    {/* Separator Line (Light Teal/Green) */}
    <div className="w-16 h-0.5 bg-gray-400 mx-auto mb-10" style={{ backgroundColor: '#A2C2B9' }}></div>

    {/* Checklist - No explicit box/shadow in the image, just centered text */}
    <div className="max-w-xl mx-auto">
      <ul className="text-center space-y-4 text-gray-700 text-lg">
        <li className="flex items-center justify-center">
          {/* Using a subtle green checkmark */}
          <span className="text-lg mr-3" style={{ color: '#A2C2B9' }}>✓</span> Your money safe, no mago-mago.
        </li>
        <li className="flex items-center justify-center">
          <span className="text-lg mr-3" style={{ color: '#A2C2B9' }}>✓</span> Pocket-friendly prices, better value for your space.
        </li>
        <li className="flex items-center justify-center">
          <span className="text-lg mr-3" style={{ color: '#A2C2B9' }}>✓</span> Professional delivery service, zero wahala.
        </li>
        <li className="flex items-center justify-center">
          <span className="text-lg mr-3" style={{ color: '#A2C2B9' }}>✓</span> Deals wey sure, quality guaranteed.
        </li>
      </ul>
    </div>
  </div>
</section>

<section className="bg-[#8B2C24] h-screen flex items-center py-16 px-4 sm:px-8 lg:px-16 text-white text-center">
    <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 uppercase" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>
            How Refurnish Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Step 1: Shop */}
            <div className="flex flex-col items-center">
                {/* ICON 1: Shop - CORRECTED PATH */}
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                    <img src="/icon1.png" alt="Shop Icon" className="w-full h-full object-contain"/>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Shop</h3>
                <p className="text-sm px-4 leading-relaxed opacity-90">
                    Shop for the Perfect Pre-Owned Pieces from Verified Local Sellers
                </p>
            </div>

            {/* Step 2: Pay */}
            <div className="flex flex-col items-center">
                {/* ICON 2: Pay - CORRECTED PATH */}
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                    <img src="/icon2.png" alt="Pay Icon" className="w-full h-full object-contain"/>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Pay</h3>
                <p className="text-sm px-4 leading-relaxed opacity-90">
                    Securely Purchase and Pay Online
                </p>
            </div>

            {/* Step 3: Deliver */}
            <div className="flex flex-col items-center">
                {/* ICON 3: Deliver - CORRECTED PATH */}
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                    <img src="/icon3.png" alt="Deliver Icon" className="w-full h-full object-contain"/>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Deliver</h3>
                <p className="text-sm px-4 leading-relaxed opacity-90">
                    Select Delivery or In-Person Pickup
                </p>
            </div>

            {/* Step 4: Confidence */}
            <div className="flex flex-col items-center">
                {/* ICON 4: Confidence - CORRECTED PATH */}
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                    <img src="/icon4.png" alt="Confidence Icon" className="w-full h-full object-contain"/>
                </div>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Confidence</h3>
                <p className="text-sm px-4 leading-relaxed opacity-90">
                    Shop Confidently with Refurnish's Buyer Money-back Guarantee
                </p>
            </div>
        </div>

        {/* Read our FAQs link */}
        <a href="#" className="inline-flex items-center text-lg font-semibold border-b-2 border-white pb-1 hover:border-transparent transition duration-300 ease-in-out">
            Read our FAQs
            <span className="ml-2">→</span>
        </a>
    </div>
</section>

<section className="bg-white py-16 px-4 sm:px-8 lg:px-16">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-12" style={{ fontFamily: 'Georgia, serif', color: '#333333' }}>
      Shop by Category
    </h2>

    {/* CAROUSEL CONTAINER */}
    <div className="relative flex items-center justify-center">

      {/* Left Arrow (Previous Slide Button) */}
      {/* You'll need to attach a click handler here to shift the category data */}
      <button className="absolute left-0 z-20 p-2 rounded-full bg-white bg-opacity-70 shadow-lg -ml-4 focus:outline-none hover:bg-opacity-100 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* SLIDER VIEWPORT */}
      <div className="overflow-hidden w-full max-w-6xl mx-auto">
        
        {/* SLIDE TRACK (You will apply translations/transforms to this element in JS) */}
        <div className="flex transition-transform duration-500 ease-in-out" 
             // IMPORTANT: This inline style ensures only 3 cards are visible
             style={{ transform: 'translateX(0%)' }}> 
          
          {categories.map((category) => (
            <div
              key={category.id}
              // CRUCIAL: w-1/3 ensures exactly 3 items fit the container width
              className="w-full md:w-1/3 p-4 flex-none" 
            >
              <div
                style={{ height: '400px' }}
                className={`rounded-2xl overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-[1.02] cursor-pointer`}
              >
                <div className="relative h-full">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  <p className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xl font-semibold uppercase tracking-wider">
                    {category.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow (Next Slide Button) */}
      {/* You'll need to attach a click handler here to shift the category data */}
      <button className="absolute right-0 z-20 p-2 rounded-full bg-white bg-opacity-70 shadow-lg -mr-4 focus:outline-none hover:bg-opacity-100 transition">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </div>
  </div>
</section>

<section className="bg-white py-20 px-4 sm:px-8 lg:px-16">
  <div className="max-w-7xl mx-auto">

    {/* Header Block: Title and Link */}
    <div className="flex justify-between items-end mb-12">
      <h2 
        className="text-4xl md:text-5xl font-serif font-normal text-gray-900" 
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Read Our Articles
      </h2>
      <a 
        href="#" 
        className="text-lg text-gray-700 font-normal border-b border-gray-700 hover:text-black hover:border-black transition duration-300"
      >
        View all articles
      </a>
    </div>

    {/* Articles Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <a 
          key={index}
          href="#"
          className="block border border-gray-300 transition duration-300 hover:shadow-lg rounded-sm"
        >
          {/* Image Container */}
          <div className="h-64 overflow-hidden mb-4">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 pt-0">
            {/* Date */}
            <p className="text-sm text-gray-500 mb-2">
              {article.date}
            </p>

            {/* Title */}
            <h3 className="text-xl font-medium text-gray-800 mb-4 leading-normal">
              {article.title}
            </h3>

            {/* Read Time */}
            <p className="text-sm text-gray-500 italic">
              {article.readTime}
            </p>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

<section className="min-h-screen bg-[#E8CEB0]/10 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#5F7161] mb-4 tracking-tight">
            How Refurnish NG Works
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover, connect, and transact with ease. Our platform simplifies buying and selling furniture in Nigeria.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {[
            {
              step: 1,
              title: "Discover & List",
              description: "Browse a wide range of furniture or list your items for sale in just a few clicks.",
            },
            {
              step: 2,
              title: "Connect Seamlessly",
              description: "Engage directly with buyers or sellers through our secure messaging system.",
            },
            {
              step: 3,
              title: "Transact with Confidence",
              description: "Complete your purchase or sale with secure payments and reliable delivery options.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="relative bg-white rounded-xl shadow-md p-6 sm:p-8 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#775522] rounded-full flex items-center justify-center text-white text-xl font-bold">
                {item.step}
              </div>
              <h3 className="mt-8 text-xl sm:text-2xl font-semibold text-[#5F7161] mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#775522] mb-6">
                Why Refurnish NG Stands Out
              </h3>
              <ul className="space-y-3">
                {[
                  "Authentic products from verified sellers",
                  "Secure and private messaging platform",
                  "Smart price comparison tools",
                  "Hassle-free delivery coordination",
                  "Trusted quality assurance guarantee",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="w-5 h-5 text-[#9933BB66BB44] mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#get-started"
                className="mt-8 inline-block bg-[#9933BB66BB44] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#775522] transition-colors duration-300"
              >
                Get Started Now
              </a>
            </div>
            <div className="lg:w-1/2 h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
              <img
                src="/why-choose-us.jpg"
                alt="Why choose Refurnish NG"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

      <section 
      className="relative min-h-[600px] flex items-center justify-center py-20 px-4 sm:px-8 lg:px-16 text-white overflow-hidden"
      style={{ backgroundImage: `url(${currentTestimonial.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Background Overlay (matches the image's dark, subtle overlay) */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      {/* Testimonial Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 
          className="text-4xl md:text-5xl font-serif font-normal mb-12" 
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Customers' Feedback
        </h2>

        {/* Testimonial Card - Now without white background */}
        <div 
          className="rounded-3xl p-8 md:p-12 mx-auto max-w-2xl flex flex-col justify-between items-center"
          style={{ 
            maxWidth: '800px', 
            minHeight: '350px', 
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent dark background
            backdropFilter: 'blur(8px)', // Subtle blur effect
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' // Subtle shadow
          }}
        >
          <p className="text-5xl font-bold text-gray-200 mb-6 -mt-4">“</p> {/* Top quote */}
          <p 
            className="text-xl md:text-2xl text-gray-100 font-semibold mb-8 leading-relaxed animate-fade-in" // Added fade-in animation
          >
            {currentTestimonial.feedback}
          </p>
          <p className="text-5xl font-bold text-gray-200 mt-6 rotate-180">”</p> {/* Bottom quote */}
          <p className="text-lg md:text-xl font-medium text-gray-200 mt-4">- {currentTestimonial.author}</p>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTestimonialIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentTestimonialIndex ? 'bg-white' : 'bg-gray-400 opacity-70'
            } transition-colors duration-300`}
            aria-label={`Go to testimonial ${index + 1}`}
          ></button>
        ))}
      </div>

    </section>

    <section className="bg-[#EAD8C7] py-16 px-4 sm:px-8 lg:px-16">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
    
    {/* Illustration Placeholder (Hanging Chair) */}
    <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48">
      {/* Placeholder for the complex hanging chair illustration */}
      <img 
        src="/newsletter.png" 
        alt="Hanging Chair Illustration" 
        className="w-full h-full object-contain"
        // If you were using an SVG, you'd embed it here
      />
    </div>

    {/* Text and Form Container */}
    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12 w-full lg:max-w-3xl">
      
      {/* Text Content */}
      <div className="text-center md:text-left flex-shrink-0">
        <h3 className="text-2xl md:text-3xl font-bold text-[#8B2C24] mb-2">
          Get 10% off your first purchase
        </h3>
        <p className="text-base md:text-lg text-[black]">
          Sign up for the latest updates, products and offers
        </p>
      </div>
      
      {/* Subscription Form */}
      <form className="flex w-full md:max-w-xs lg:max-w-none lg:w-96">
        <input 
          type="email" 
          placeholder="Enter email address" 
          aria-label="Enter email address"
          className="w-full py-3 px-4 text-gray-700 rounded-l-lg border-2 border-r-0 border-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#8B2C24] transition duration-200"
          style={{ backgroundColor: '#F0F0EE' }}
        />
        <button 
          type="submit" 
          aria-label="Subscribe"
          className="flex items-center justify-center px-4 rounded-r-lg bg-[#A0C5C2] hover:bg-[#86A8A4] transition duration-300"
        >
          {/* Right Arrow Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  </div>
  
  {/* Scroll to Top Arrow (Stylized) */}
  <div className="fixed bottom-8 right-8 z-30">
    <button 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
      aria-label="Scroll to top"
      className="p-3 rounded-full bg-[#A0C5C2] text-white shadow-lg hover:bg-[#86A8A4] transition duration-300"
    >
      {/* Up Arrow Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</section>

<section className="bg-white min-h-screen flex items-center py-16 px-4 sm:px-8 lg:px-16">
  <div className="max-w-7xl mx-auto w-full text-center">
    <h2 
      className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-12" 
      style={{ fontFamily: 'Georgia, serif' }}
    >
      Quick Actions
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      
      {/* Action Card 1: Sell - Increased icon size */}
      <div className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
        {/* Changed wrapper to w-24 h-24 and image to w-12 h-12 */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4">
          <img src="/sell.png" alt="Sell Icon" className="w-12 h-12 object-contain" />
        </div>
        <h3 className="text-xl font-bold text-[#8B2C24] mb-2">Sell</h3>
        <p className="text-sm text-gray-600">List a furniture or home decor</p>
      </div>

      {/* Action Card 2: FAQs - Increased icon size */}
      <div className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
        {/* Changed wrapper to w-24 h-24 and image to w-12 h-12 */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4">
          <img src="/faq.png" alt="FAQs Icon" className="w-12 h-12 object-contain" />
        </div>
        <h3 className="text-xl font-bold text-[#8B2C24] mb-2">FAQs</h3>
        <p className="text-sm text-gray-600">Get Answers</p>
      </div>

      {/* Action Card 3: Support - Increased icon size */}
      <div className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
        {/* Changed wrapper to w-24 h-24 and image to w-12 h-12 */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4">
          <img src="/support.png" alt="Support Icon" className="w-12 h-12 object-contain" />
        </div>
        <h3 className="text-xl font-bold text-[#8B2C24] mb-2">Support</h3>
        <p className="text-sm text-gray-600">Help & Contact Us</p>
      </div>

      {/* Action Card 4: WhatsApp - Increased icon size */}
      <div className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
        {/* Changed wrapper to w-24 h-24 and image to w-12 h-12 */}
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4">
          <img src="/whatsapp.png" alt="WhatsApp Icon" className="w-12 h-12 object-contain" />
        </div>
        <h3 className="text-xl font-bold text-[#8B2C24] mb-2">WhatsApp</h3>
        <p className="text-sm text-gray-600">Chat with Us</p>
      </div>

    </div>
  </div>
</section>
    </div>
  );
}