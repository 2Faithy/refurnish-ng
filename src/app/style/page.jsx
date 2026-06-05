"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaArrowRight,
  FaUndo,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import { products } from "@/lib/data";
import Link from "next/link"; // Added for routing functionality

// Quiz Steps mapped to your exact local image asset paths
const QUIZ_STEPS = [
  {
    stepNumber: 1,
    subtitle: "DISCOVER YOUR STYLE",
    title: "Three questions. A home that feels like you.",
    questionText: "What space feels most like you?",
    type: "image_grid",
    options: [
      { id: "afro-minimal", label: "Afro-minimal", image: "/hero1.jpg" },
      { id: "japandi", label: "Japandi", image: "/login-bg.png" },
      { id: "modern-luxury", label: "Modern luxury", image: "/living.jpg" },
      { id: "cozy-neutral", label: "Cozy neutral", image: "/hero-bg4.png" },
      {
        id: "contemporary-african",
        label: "Contemporary African",
        image: "/hero-bg2.png",
      },
      {
        id: "scandinavian-warm",
        label: "Scandinavian warm",
        image: "/hero-bg3.png",
      },
    ],
  },
  {
    stepNumber: 2,
    subtitle: "DISCOVER YOUR STYLE",
    title: "Three questions. A home that feels like you.",
    questionText: "What matters most to you?",
    type: "pills",
    options: [
      { id: "comfort", label: "Comfort" },
      { id: "aesthetics", label: "Aesthetics" },
      { id: "budget", label: "Budget" },
      { id: "functionality", label: "Functionality" },
      { id: "hosting", label: "Hosting guests" },
      { id: "compact", label: "Compact living" },
    ],
  },
  {
    stepNumber: 3,
    subtitle: "DISCOVER YOUR STYLE",
    title: "Three questions. A home that feels like you.",
    questionText: "What room are you furnishing?",
    type: "image_grid",
    options: [
      { id: "bedroom", label: "Bedroom", image: "/bedroom.jpg" },
      { id: "living-room", label: "Living room", image: "/living-room.jpg" },
      { id: "dining", label: "Dining", image: "/dining.jpg" },
      { id: "workspace", label: "Workspace", image: "/workspace.jpg" },
      { id: "airbnb", label: "Airbnb", image: "/airbnb.jpg" },
      { id: "studio", label: "Studio", image: "/studio.jpg" },
    ],
  },
];

// Curated clean editorial items dataset with Unsplash URLs
const RECOMMENDED_PRODUCTS = products.slice(0, 4);

export default function DiscoveryQuiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [likedProducts, setLikedProducts] = useState([]);

  const currentStep = QUIZ_STEPS[stepIndex];

  const handleSelect = (optionId) => {
    setSelections({ ...selections, [stepIndex]: optionId });

    if (stepIndex < QUIZ_STEPS.length - 1) {
      setTimeout(() => {
        setStepIndex(stepIndex + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 400);
    } else {
      setTimeout(() => {
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 400);
    }
  };

  const toggleLike = (id) => {
    setLikedProducts((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const resetQuiz = () => {
    setSelections({});
    setStepIndex(0);
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPersonalizedDetails = () => {
    const styleId = selections[0] || "afro-minimal";
    const priorityId = selections[1] || "comfort";
    const roomId = selections[2] || "living-room";

    const styleLabels = {
      "afro-minimal": "an Afro-minimal",
      japandi: "a balanced Japandi",
      "modern-luxury": "a sleek Modern Luxury",
      "cozy-neutral": "a comforting Cozy Neutral",
      "contemporary-african": "a vibrant Contemporary African",
      "scandinavian-warm": "a warm Scandinavian",
    };

    const priorityLabels = {
      comfort: "uncompromising comfort at its core",
      aesthetics: "high editorial design aesthetics guiding every line",
      budget: "mindful budget considerations keeping it accessible",
      functionality: "smart, daily spatial functionality prioritized",
      hosting: "entertaining and welcoming guests beautifully",
      compact: "maximizing compact, creative layout solutions",
    };

    const roomLabels = {
      bedroom: "bedroom sanctuary",
      "living-room": "living room escape",
      dining: "dining space area",
      workspace: "home office workspace",
      airbnb: "curated boutique Airbnb setup",
      studio: "tailored flat studio design",
    };

    return {
      title: `A premium ${
        QUIZ_STEPS[0].options.find((o) => o.id === styleId)?.label ||
        "Afro-minimal"
      } ${
        QUIZ_STEPS[2].options.find((o) => o.id === roomId)?.label ||
        "Living Room"
      }, with ${
        QUIZ_STEPS[1].options
          .find((o) => o.id === priorityId)
          ?.label.toLowerCase() || "comfort"
      } in mind.`,
      paragraph: `Based on your selections, we've designed an interior concept path featuring ${
        styleLabels[styleId] || "an intentional"
      } ${roomLabels[roomId] || "space layout"} with ${
        priorityLabels[priorityId] || "clean intentional details"
      }. Save the specific pieces that connect with your personal vision, and we'll keep refining your feed.`,
    };
  };

  const personalizedContext = showResults
    ? getPersonalizedDetails()
    : { title: "", paragraph: "" };

  return (
    <main className="min-h-screen bg-[#E8CEB0] text-[#211000] font-sans antialiased pt-24 pb-20 px-4 sm:px-8 lg:px-16 selection:bg-[#B66B44]/20">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Header Text Block */}
              <div className="mb-4">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                  {currentStep.subtitle}
                </p>
                <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight mt-3 mb-6 max-w-3xl leading-[1.15]">
                  {currentStep.title}
                </h1>
              </div>

              {/* Progress Line Bar System */}
              <div className="w-full flex items-center justify-between gap-4 border-t border-[#211000]/10 pt-4 mb-10">
                <div className="flex-1 flex gap-2">
                  {QUIZ_STEPS.map((_, idx) => (
                    <div
                      key={idx}
                      className="h-[3px] flex-1 bg-[#211000]/10 relative overflow-hidden"
                    >
                      {idx <= stepIndex && (
                        <motion.div
                          layoutId="quizProgressIndicator"
                          className="absolute inset-0 bg-[#B66B44]"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{ originX: 0 }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-xs font-medium tracking-wider text-[#211000]/60 flex-shrink-0">
                  Step {currentStep.stepNumber} of {QUIZ_STEPS.length}
                </span>
              </div>

              {/* Question Context Title */}
              <h2 className="text-xl sm:text-2xl font-serif font-medium tracking-tight mb-8">
                {currentStep.questionText}
              </h2>

              {/* Quiz Selection Aspect Ratio: Clean, elongated layout */}
              {currentStep.type === "image_grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentStep.options.map((option) => {
                    const isSelected = selections[stepIndex] === option.id;
                    return (
                      <motion.div
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        whileHover={{ y: -4 }}
                        className={`group cursor-pointer relative rounded-2xl overflow-hidden bg-white/40 border transition-all duration-300 ${
                          isSelected
                            ? "border-[#B66B44] ring-1 ring-[#B66B44]"
                            : "border-transparent"
                        }`}
                      >
                        <div className="aspect-[3/4] w-full overflow-hidden bg-[#211000]/5 relative">
                          <img
                            src={option.image}
                            alt={option.label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                          />
                        </div>
                        <div className="p-4 bg-transparent backdrop-blur-sm">
                          <span className="font-serif text-base sm:text-lg text-[#211000]">
                            {option.label}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Pills Layer Layout */}
              {currentStep.type === "pills" && (
                <div className="flex flex-wrap gap-3 max-w-4xl">
                  {currentStep.options.map((option) => {
                    const isSelected = selections[stepIndex] === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        whileTap={{ scale: 0.97 }}
                        className={`px-6 py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border ${
                          isSelected
                            ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                            : "bg-white/40 border-[#211000]/10 hover:border-[#211000]/30 text-[#211000]"
                        }`}
                      >
                        {option.label}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            /* Results Feed Module */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                  DISCOVER YOUR STYLE
                </p>
                <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight mt-3 mb-8 max-w-3xl leading-[1.15]">
                  Three questions. A home that feels like you.
                </h1>
              </div>

              {/* Personalization Info Card Module */}
              <div className="w-full bg-white/30 border border-white/40 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                  YOUR EDIT
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#211000] mt-3 mb-3 leading-snug">
                  {personalizedContext.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#211000]/70 leading-relaxed max-w-3xl font-medium">
                  {personalizedContext.paragraph}
                </p>
              </div>

              {/* PRODUCT SHOWCASE: Swapped to custom editorial aspect-[2/3] for highly visible, elongated vertical framing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {RECOMMENDED_PRODUCTS.map((product) => {
                  const isLiked = likedProducts.includes(product.id);
                  return (
                    <Link href={`/product/${product.slug}`} key={product.id}>
                      <div className="group relative flex flex-col cursor-pointer">
                        <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-white relative shadow-sm border border-[#211000]/5">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                          <span className="absolute bottom-3 left-3 bg-[#E8CEB0] text-[#211000] text-[9px] font-bold px-2 py-1 rounded-md shadow-sm">
                            {product.condition}
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleLike(product.id);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white text-gray-400 hover:text-red-500 transition-colors duration-200 shadow-sm"
                            aria-label="Save item"
                          >
                            <FaHeart
                              className={`text-xs ${
                                isLiked ? "text-red-500" : ""
                              }`}
                            />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-col flex-grow">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="text-[10px] font-bold tracking-widest text-[#211000]/50 uppercase mb-0.5">
                                {product.brand}
                              </p>
                              <h3 className="font-serif text-sm font-medium text-[#211000] tracking-wide leading-tight">
                                {product.title}
                              </h3>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-xs font-bold text-[#211000] block">
                                ₦{product.price.toLocaleString("en-NG")}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[10px] text-[#211000]/40 line-through font-medium block">
                                  ₦
                                  {product.originalPrice.toLocaleString(
                                    "en-NG"
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-auto pt-2 flex items-center gap-1.5 text-[10px] text-[#211000]/50 font-medium">
                            <FaCheckCircle className="text-[#5F7161] text-[9px]" />
                            <span>Verified · {product.location}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Action Buttons Interface */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full transition-all duration-200 shadow-md shadow-[#B66B44]/10 active:scale-[0.99]"
                >
                  <span>Continue shopping</span>
                  <FaArrowRight className="text-[10px]" />
                </Link>

                <button
                  onClick={resetQuiz}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 text-[#211000] font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full border border-[#211000]/10 transition-colors duration-200"
                >
                  <FaUndo className="text-[9px]" />
                  <span>Retake quiz</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
