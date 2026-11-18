
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaArrowRight,
  FaUndo,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import Link from "next/link";

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

const CONDITION_LABELS = {
  new: "Brand New",
  like_new: "Like New",
  "like-new": "Like New",
  good: "Good Condition",
  fair: "Fair Condition",
};

const ROOM_CATEGORIES = {
  bedroom: ["bedroom"],
  "living-room": ["living room", "living-room", "livingroom"],
  dining: ["dining"],
  workspace: ["office", "workspace"],
  airbnb: [],
  studio: [],
};

const STYLE_KEYWORDS = {
  "afro-minimal": [
    "afro",
    "african",
    "wood",
    "woven",
    "rattan",
    "natural",
    "minimal",
  ],
  japandi: [
    "japandi",
    "minimal",
    "wood",
    "bamboo",
    "neutral",
    "simple",
  ],
  "modern-luxury": [
    "luxury",
    "modern",
    "marble",
    "velvet",
    "leather",
    "glass",
    "gold",
  ],
  "cozy-neutral": [
    "cozy",
    "neutral",
    "cream",
    "beige",
    "soft",
    "fabric",
    "wood",
  ],
  "contemporary-african": [
    "african",
    "contemporary",
    "woven",
    "rattan",
    "wood",
    "pattern",
  ],
  "scandinavian-warm": [
    "scandinavian",
    "minimal",
    "wood",
    "natural",
    "simple",
    "neutral",
  ],
};

function mapListingToProduct(listing) {
  const photos = Array.isArray(listing.photos)
    ? listing.photos.filter(
        (photo) =>
          typeof photo === "string" && photo.trim().length > 0
      )
    : [];

  return {
    id: String(listing.id),
    slug: String(listing.id),
    title: listing.itemTitle || "Furniture item",
    brand: listing.brand || listing.category || "RefurnishNG",
    images: photos,
    category: listing.category || "",
    condition:
      CONDITION_LABELS[listing.condition || ""] ||
      listing.condition ||
      "Pre-owned",
    material: listing.material || "",
    price: Number(listing.sellingPrice) || 0,
    originalPrice: listing.originalPrice
      ? Number(listing.originalPrice)
      : undefined,
    location: [listing.lga, listing.state].filter(Boolean).join(", "),
    description: listing.description || "",
  };
}

function getListingText(product) {
  return [
    product.title,
    product.brand,
    product.category,
    product.material,
    product.description,
  ]
    .join(" ")
    .toLowerCase();
}

function scoreProduct(product, styleId, priorityId, roomId) {
  const text = getListingText(product);
  const category = product.category.toLowerCase();
  let score = 0;

  // Match the selected room against the real Shop category.
  const roomMatches = ROOM_CATEGORIES[roomId] || [];

  if (roomMatches.length > 0) {
    if (roomMatches.some((term) => category.includes(term))) {
      score += 12;
    } else {
      score -= 8;
    }
  }

  // Match style using words found in actual listing information.
  const styleWords = STYLE_KEYWORDS[styleId] || [];

  for (const word of styleWords) {
    if (text.includes(word)) score += 2;
  }

  // Prioritise products according to the user's main concern.
  if (priorityId === "budget") {
    score += product.price > 0
      ? Math.max(0, 8 - product.price / 100000)
      : 0;
  }

  if (priorityId === "comfort") {
    if (/sofa|couch|bed|mattress|chair|cushion|upholster/.test(text)) {
      score += 5;
    }
  }

  if (priorityId === "aesthetics") {
    if (/design|modern|luxury|wood|marble|velvet|decor/.test(text)) {
      score += 5;
    }
  }

  if (priorityId === "functionality") {
    if (/storage|shelf|cabinet|desk|table|drawer|multipurpose/.test(text)) {
      score += 5;
    }
  }

  if (priorityId === "hosting") {
    if (/dining|sofa|sectional|table|chair|stool/.test(text)) {
      score += 5;
    }
  }

  if (priorityId === "compact") {
    if (/compact|small|foldable|folding|storage|space-saving/.test(text)) {
      score += 5;
    }
  }

  return score;
}

export default function DiscoveryQuiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentStep = QUIZ_STEPS[stepIndex];

  // Fetch real listings from the same backend as the Shop page.
  useEffect(() => {
    let active = true;

    async function fetchListings() {
      try {
        setLoading(true);
        setError("");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("The API URL is not configured.");
        }

        const response = await fetch(`${apiUrl}/api/listings`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load shop listings.");
        }

        const listings = Array.isArray(data.listings)
          ? data.listings
          : [];

        if (active) {
          setProducts(listings.map(mapListingToProduct));
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load shop listings."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchListings();

    return () => {
      active = false;
    };
  }, []);

  // Load favourites from the Shop page's existing storage key.
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("refurnish_saved") || "[]"
      );

      if (Array.isArray(saved)) {
        setLikedProducts(saved.map(String));
      }
    } catch {
      setLikedProducts([]);
    }
  }, []);

  // Build recommendations from actual listings.
  const recommendedProducts = useMemo(() => {
    if (!showResults) return [];

    const styleId = selections[0] || "afro-minimal";
    const priorityId = selections[1] || "comfort";
    const roomId = selections[2] || "living-room";

    const scored = products
      .filter((product) => product.images.length > 0)
      .map((product) => ({
        product,
        score: scoreProduct(product, styleId, priorityId, roomId),
      }));

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      if (priorityId === "budget") {
        return a.product.price - b.product.price;
      }

      return 0;
    });

    const roomMatches = ROOM_CATEGORIES[roomId] || [];

    const matchingRoomProducts =
      roomMatches.length > 0
        ? scored.filter(({ product }) =>
            roomMatches.some((term) =>
              product.category.toLowerCase().includes(term)
            )
          )
        : [];

    const finalProducts =
      matchingRoomProducts.length > 0 ? matchingRoomProducts : scored;

    return finalProducts.slice(0, 4).map(({ product }) => product);
  }, [products, selections, showResults]);

  const handleSelect = (optionId) => {
    setSelections((previous) => ({
      ...previous,
      [stepIndex]: optionId,
    }));

    window.setTimeout(() => {
      if (stepIndex < QUIZ_STEPS.length - 1) {
        setStepIndex((current) => current + 1);
      } else {
        setShowResults(true);
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((current) => current - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleLike = (id) => {
    setLikedProducts((previous) => {
      const next = previous.includes(id)
        ? previous.filter((productId) => productId !== id)
        : [...previous, id];

      localStorage.setItem("refurnish_saved", JSON.stringify(next));
      return next;
    });
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

    const styleLabel =
      QUIZ_STEPS[0].options.find((option) => option.id === styleId)?.label ||
      "Afro-minimal";

    const priorityLabel =
      QUIZ_STEPS[1].options.find((option) => option.id === priorityId)
        ?.label || "Comfort";

    const roomLabel =
      QUIZ_STEPS[2].options.find((option) => option.id === roomId)?.label ||
      "Living room";

    const styleDescriptions = {
      "afro-minimal":
        "natural textures and understated African-inspired design",
      japandi: "calm simplicity, natural materials and balanced spaces",
      "modern-luxury":
        "refined finishes and contemporary statement pieces",
      "cozy-neutral": "warm tones, soft textures and comfortable details",
      "contemporary-african":
        "modern furniture with African-inspired character",
      "scandinavian-warm":
        "simple forms, natural materials and warm details",
    };

    const priorityDescriptions = {
      comfort: "comfort at the centre of every choice",
      aesthetics: "design and visual appeal guiding your choices",
      budget: "affordable finds and thoughtful spending",
      functionality: "practical pieces that work hard every day",
      hosting: "welcoming pieces for entertaining guests",
      compact: "smart choices for making the most of your space",
    };

    return {
      title: `A ${styleLabel} ${roomLabel}, with ${priorityLabel.toLowerCase()} in mind.`,
      paragraph: `Your direction combines ${
        styleDescriptions[styleId] || "intentional design"
      } with ${
        priorityDescriptions[priorityId] || "thoughtful details"
      }. Explore real listings from the RefurnishNG shop that fit your selections.`,
    };
  };

  const personalizedContext = getPersonalizedDetails();

  return (
    <main className="min-h-screen bg-[#E8CEB0] text-[#211000] font-sans antialiased pt-32 sm:pt-36 lg:pt-40 pb-20 px-4 sm:px-8 lg:px-16 selection:bg-[#B66B44]/20">
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
              {/* Header */}
              <div className="mb-4">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                  {currentStep.subtitle}
                </p>

                <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-tight mt-3 mb-6 max-w-3xl leading-[1.15]">
                  {currentStep.title}
                </h1>
              </div>

              {/* Progress */}
              <div className="w-full flex items-center justify-between gap-4 border-t border-[#211000]/10 pt-4 mb-10">
                <div className="flex-1 flex gap-2">
                  {QUIZ_STEPS.map((_, index) => (
                    <div
                      key={index}
                      className="h-[3px] flex-1 bg-[#211000]/10 relative overflow-hidden"
                    >
                      {index <= stepIndex && (
                        <motion.div
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

              <h2 className="text-xl sm:text-2xl font-serif font-medium tracking-tight mb-8">
                {currentStep.questionText}
              </h2>

              {/* Image options */}
              {currentStep.type === "image_grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentStep.options.map((option) => {
                    const isSelected =
                      selections[stepIndex] === option.id;

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
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

              {/* Pill options */}
              {currentStep.type === "pills" && (
                <div className="flex flex-wrap gap-3 max-w-4xl">
                  {currentStep.options.map((option) => {
                    const isSelected =
                      selections[stepIndex] === option.id;

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

              {/* Back */}
              {stepIndex > 0 && (
                <button
                  onClick={goBack}
                  className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#211000]/70 hover:text-[#B66B44]"
                >
                  <FaArrowLeft />
                  Back
                </button>
              )}
            </motion.div>
          ) : (
            /* Results */
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

              {/* Personalised edit */}
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

              {/* Loading */}
              {loading ? (
                <div className="py-16 text-center">
                  <p className="font-serif text-xl">
                    Finding pieces for your space...
                  </p>
                  <p className="text-sm text-[#211000]/60 mt-2">
                    Loading the latest RefurnishNG shop listings.
                  </p>
                </div>
              ) : error ? (
                /* Error */
                <div className="bg-white/40 border border-[#B66B44]/30 rounded-2xl p-8 text-center">
                  <p className="font-serif text-xl mb-2">
                    We couldn't load the shop items.
                  </p>

                  <p className="text-sm text-[#211000]/70 mb-5">
                    {error}
                  </p>

                  <button
                    onClick={() => window.location.reload()}
                    className="bg-[#B66B44] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest"
                  >
                    Try again
                  </button>
                </div>
              ) : recommendedProducts.length > 0 ? (
                /* Real product cards */
                <>
                  <div>
                    <h2 className="font-serif text-2xl mb-2">
                      Pieces selected for your space
                    </h2>

                    <p className="text-sm text-[#211000]/60">
                      These are real items currently listed in our shop.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {recommendedProducts.map((product) => {
                      const isLiked = likedProducts.includes(product.id);

                      return (
                        <div
                          key={product.id}
                          className="group relative flex flex-col"
                        >
                          <div className="relative">
                            <Link href={`/product/${product.slug}`}>
                              <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden bg-white relative shadow-sm border border-[#211000]/5">
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                <span className="absolute bottom-3 left-3 bg-[#E8CEB0] text-[#211000] text-[9px] font-bold px-2 py-1 rounded-md shadow-sm">
                                  {product.condition}
                                </span>
                              </div>
                            </Link>

                            <button
                              onClick={() => toggleLike(product.id)}
                              className="absolute top-3 right-3 p-2 rounded-full bg-white text-gray-400 hover:text-red-500 transition-colors duration-200 shadow-sm"
                              aria-label={
                                isLiked ? "Remove saved item" : "Save item"
                              }
                            >
                              <FaHeart
                                className={`text-xs ${
                                  isLiked ? "text-red-500" : ""
                                }`}
                              />
                            </button>
                          </div>

                          <Link href={`/product/${product.slug}`}>
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

                                  {product.originalPrice ? (
                                    <span className="text-[10px] text-[#211000]/40 line-through font-medium block">
                                      ₦
                                      {product.originalPrice.toLocaleString(
                                        "en-NG"
                                      )}
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <div className="mt-auto pt-2 flex items-center gap-1.5 text-[10px] text-[#211000]/50 font-medium">
                                <FaCheckCircle className="text-[#5F7161] text-[9px]" />
                                <span>
                                  {product.location || "RefurnishNG Shop"}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* No products */
                <div className="bg-white/40 rounded-2xl p-8 text-center">
                  <h2 className="font-serif text-2xl mb-3">
                    No matching items just yet
                  </h2>

                  <p className="text-sm text-[#211000]/65 mb-6">
                    We couldn't find listings with photos for this selection.
                    Visit the Shop to explore all available furniture.
                  </p>

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-[#B66B44] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-6 rounded-full"
                  >
                    Explore the shop <FaArrowRight />
                  </Link>
                </div>
              )}

              {/* Actions */}
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
