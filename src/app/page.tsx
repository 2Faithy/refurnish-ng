"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  MessageCircle,
  Store,
  Sofa,
  BadgeCheck,
} from "lucide-react";

import DiscountModal from "@/components/DiscountModal";
import { products, formatNaira } from "@/lib/data";

const heroSlides = [
  {
    title: "Find quality pre-loved furniture near you.",
    description:
      "Discover curated, gently-used furniture in excellent condition — verified, protected, and ready for your space.",
    image: "/hero1.jpg",
    primaryText: "Browse shop",
    primaryHref: "/shop",
    secondaryText: "Start selling",
    secondaryHref: "/sell",
  },
  {
    title: "Furniture buying and selling, made safer.",
    description:
      "Buy with escrow protection, sell with confidence, and refresh your home without the usual marketplace stress.",
    image: "/hero2.jpg",
    primaryText: "Shop now",
    primaryHref: "/shop",
    secondaryText: "How it works",
    secondaryHref: "#how-it-works",
  },
  {
    title: "Turn unused furniture into money.",
    description:
      "List your pre-loved pieces in minutes and connect with serious buyers across Nigeria.",
    image: "/hero3.jpg",
    primaryText: "List an item",
    primaryHref: "/sell",
    secondaryText: "View dashboard",
    secondaryHref: "/dashboard",
  },
];

const testimonials = [
  {
    id: 1,
    feedback:
      "The sofa was perfect and in great condition. Buying with Refurnish felt safe and simple.",
    author: "Ifechukwude E.",
    bgImage: "/testimonial.jpg",
  },
  {
    id: 2,
    feedback:
      "The dining set looked even better in person, and delivery was smooth. Highly recommend.",
    author: "Chinedu O.",
    bgImage: "/testimonial.jpg",
  },
  {
    id: 3,
    feedback:
      "Found exactly what I needed for my bedroom at a fraction of the cost. Very trustworthy.",
    author: "Aisha G.",
    bgImage: "/testimonial.jpg",
  },
];

const categories = [
  { name: "Living Room", image: "/living.jpg", href: "/shop?category=Living%20Room" },
  { name: "Bedroom", image: "/bedroom.jpg", href: "/shop?category=Bedroom" },
  { name: "Dining", image: "/dining.jpg", href: "/shop?category=Dining" },
  { name: "Workspace", image: "/workspace.jpg", href: "/shop?category=Office" },
  { name: "Studio", image: "/studio.jpg", href: "/shop?category=Studio" },
  { name: "Outdoor", image: "/hero-bg3.png", href: "/shop?category=Outdoor" },
];

const articles = [
  {
    date: "Design Guide",
    title: "How to design your home to feel functional and warm",
    readTime: "5 mins read",
    imageUrl: "/hero-bg4.png",
  },
  {
    date: "Styling",
    title: "Creating the right mood board for your home space",
    readTime: "7 mins read",
    imageUrl: "/hero-bg2.png",
  },
  {
    date: "Small Spaces",
    title: "How to save space in a compact Nigerian apartment",
    readTime: "6 mins read",
    imageUrl: "/hero-bg3.png",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [liked, setLiked] = useState([]);

  const topPicks = useMemo(() => products.slice(0, 4), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  const currentHero = heroSlides[currentHeroSlide];
  const currentTestimonial = testimonials[currentTestimonialIndex];

  const toggleLike = (id) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <main className="bg-[#FAF4EC] text-[#211000] font-sans antialiased overflow-hidden">
      <DiscountModal />

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={slide.title}
              initial={false}
              animate={{ opacity: currentHeroSlide === index ? 1 : 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#211000]/75 via-[#211000]/45 to-[#211000]/15" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 pt-28 pb-20">
          <motion.div
            key={currentHero.title}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-3xl"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-[#FAF4EC]/15 border border-[#FAF4EC]/20 backdrop-blur-sm px-4 py-2 mb-6"
            >
              <Sparkles className="size-3.5 text-[#E8CEB0]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FAF4EC]">
                Pre-loved. Re-loved.
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.02] text-[#FAF4EC]"
            >
              {currentHero.title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-base sm:text-lg text-[#FAF4EC]/80 leading-relaxed font-medium max-w-xl"
            >
              {currentHero.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href={currentHero.primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-7 py-4 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#B66B44]/20"
              >
                {currentHero.primaryText}
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href={currentHero.secondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FAF4EC]/15 hover:bg-[#FAF4EC]/25 border border-[#FAF4EC]/25 text-[#FAF4EC] px-7 py-4 text-xs font-bold uppercase tracking-wider transition-colors backdrop-blur-sm"
              >
                {currentHero.secondaryText}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentHeroSlide === index
                  ? "w-8 bg-[#FAF4EC]"
                  : "w-2 bg-[#FAF4EC]/50 hover:bg-[#FAF4EC]"
              }`}
              aria-label={`Go to hero slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ================= TOP PICKS ================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Curated finds"
            title="Top picks for a softer landing."
            description="Editorial furniture pieces selected for comfort, quality, and beautiful everyday living."
            href="/shop"
            cta="View all"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mt-10">
            {topPicks.map((product) => {
              const isLiked = liked.includes(product.id);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="group"
                >
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-white border border-[#211000]/5 shadow-sm">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <span className="absolute bottom-3 left-3 bg-[#E8CEB0] text-[#211000] text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        {product.condition}
                      </span>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleLike(product.id);
                        }}
                        className="absolute top-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur grid place-items-center text-[#211000]/50 hover:text-red-500 transition-colors shadow-sm"
                        aria-label="Save item"
                      >
                        <Heart
                          className={`size-4 ${
                            isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#211000]/45 truncate">
                          {product.brand}
                        </p>
                        <h3 className="font-serif text-lg font-medium tracking-tight truncate mt-0.5">
                          {product.title}
                        </h3>
                        <p className="mt-1 text-[11px] text-[#211000]/45 font-medium flex items-center gap-1">
                          <BadgeCheck className="size-3 text-[#5F7161]" />
                          Verified · {product.location}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">
                          {formatNaira(product.price)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-[10px] text-[#211000]/35 line-through font-medium">
                            {formatNaira(product.originalPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= STYLE QUIZ CTA — LIKE YOUR IMAGE ================= */}
      <section className="px-4 sm:px-8 lg:px-16 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] sm:rounded-[2.5rem] bg-[#B66B44] text-[#FAF4EC] px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20 min-h-[420px] flex items-center"
          >
            <div className="max-w-4xl">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-[#FAF4EC]/80 mb-8">
                Discover your style
              </p>

              <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.02] max-w-5xl">
                Three questions. A home that finally feels like you.
              </h2>

              <p className="mt-8 text-base sm:text-xl text-[#FAF4EC]/85 leading-relaxed max-w-3xl">
                Tell us how you live and we’ll curate a personalised feed of
                furniture, colour palettes and room inspiration.
              </p>

              <Link
                href="/style"
                className="mt-10 inline-flex items-center justify-center gap-4 rounded-full bg-[#FAF4EC] hover:bg-[#E8CEB0] text-[#211000] px-8 sm:px-10 py-4 text-sm sm:text-base font-bold transition-colors"
              >
                Take the style quiz
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= MEET REFURNISH ================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#E8CEB0]/35">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44] mb-4">
            Meet Refurnish
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
            A better way to furnish in Nigeria.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#211000]/65 leading-relaxed font-medium">
            A trusted marketplace for furniture and décor — built for everyday
            Nigerians, reshaping how we buy and sell with quality,
            affordability, and protection at the core.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-4 text-left">
            {[
              "Your money stays safe with escrow protection.",
              "Pocket-friendly prices and better value.",
              "Professional delivery support, zero wahala.",
              "Verified listings, safer deals, better homes.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white/70 border border-[#211000]/6 p-4 flex gap-3"
              >
                <CheckCircle2 className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-[#211000]/75">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-[#211000] text-[#FAF4EC]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8CEB0] mb-4">
              How Refurnish works
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
              Safe from search to delivery.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                icon: Store,
                title: "Shop",
                text: "Find verified pre-loved pieces from local sellers.",
              },
              {
                icon: CreditCard,
                title: "Pay",
                text: "Pay securely through Refurnish escrow.",
              },
              {
                icon: Truck,
                title: "Deliver",
                text: "Choose home delivery or self-pickup from seller.",
              },
              {
                icon: ShieldCheck,
                title: "Confirm",
                text: "Only release payment after you receive the item.",
              },
            ].map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-3xl bg-[#FAF4EC]/8 border border-[#FAF4EC]/10 p-6"
                >
                  <div className="size-12 rounded-2xl bg-[#FAF4EC]/10 flex items-center justify-center mb-5">
                    <Icon className="size-6 text-[#E8CEB0]" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#FAF4EC]/60 leading-relaxed font-medium">
                    {step.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Shop by category"
            title="A room for every story."
            description="Browse furniture by space and discover pieces that fit beautifully."
            href="/shop"
            cta="Open shop"
          />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden bg-white border border-[#211000]/5 shadow-sm"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#211000]/65 via-[#211000]/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-white font-medium">
                    {category.name}
                  </h3>
                  <span className="size-10 rounded-full bg-white/90 text-[#211000] grid place-items-center">
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ARTICLES ================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="The journal"
            title="Ideas for better living."
            description="Thoughtful tips for styling, saving space, and making furniture last longer."
            href="/blog"
            cta="View articles"
          />

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.title}
                href="/blog"
                className="group rounded-3xl bg-white border border-[#211000]/6 overflow-hidden hover:border-[#B66B44]/25 hover:shadow-sm transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#E8CEB0]/30">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B66B44]">
                    {article.date}
                  </p>
                  <h3 className="mt-2 font-serif text-xl font-medium leading-tight">
                    {article.title}
                  </h3>
                  <p className="mt-4 text-xs text-[#211000]/45 font-bold">
                    {article.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section
        className="relative min-h-[620px] flex items-center justify-center px-4 sm:px-8 lg:px-16 overflow-hidden"
        style={{
          backgroundImage: `url(${currentTestimonial.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#211000]/55" />

        <div className="relative z-10 max-w-3xl mx-auto text-center text-[#FAF4EC]">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8CEB0] mb-4">
            Customers’ feedback
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-10">
            People are furnishing differently.
          </h2>

          <motion.div
            key={currentTestimonial.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-[#FAF4EC]/10 backdrop-blur-md border border-[#FAF4EC]/15 p-8 sm:p-10"
          >
            <p className="font-serif text-2xl sm:text-3xl leading-relaxed">
              “{currentTestimonial.feedback}”
            </p>
            <p className="mt-6 text-sm font-bold text-[#E8CEB0]">
              — {currentTestimonial.author}
            </p>
          </motion.div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => setCurrentTestimonialIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  currentTestimonialIndex === index
                    ? "w-8 bg-[#E8CEB0]"
                    : "w-2 bg-[#FAF4EC]/45"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 lg:px-16 bg-[#E8CEB0]/70">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-32 h-32 sm:w-44 sm:h-44 shrink-0">
            <img
              src="/newsletter.png"
              alt="Newsletter illustration"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44] mb-3">
              Stay inspired
            </p>
            <h3 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight">
              Get 10% off your first purchase.
            </h3>
            <p className="mt-2 text-sm text-[#211000]/60 font-medium">
              Sign up for the latest finds, design tips and exclusive offers.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full lg:w-auto flex max-w-md"
          >
            <input
              type="email"
              placeholder="Enter email address"
              className="flex-1 rounded-l-full bg-white border border-[#211000]/8 px-5 py-4 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44]"
            />
            <button
              type="submit"
              className="rounded-r-full bg-[#B66B44] hover:bg-[#a05934] text-white px-5 py-4 transition-colors"
            >
              <ArrowRight className="size-5" />
            </button>
          </form>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44] mb-3">
              Quick actions
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">
              What would you like to do?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: "Sell",
                text: "List furniture or home décor.",
                href: "/sell",
                image: "/sell.png",
              },
              {
                title: "FAQs",
                text: "Get quick answers.",
                href: "/faqs",
                image: "/faq.png",
              },
              {
                title: "Support",
                text: "Help and contact us.",
                href: "/support",
                image: "/support.png",
              },
              {
                title: "WhatsApp",
                text: "Chat with our team.",
                href: "/contact",
                image: "/whatsapp.png",
              },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-3xl bg-white border border-[#211000]/6 p-7 text-center hover:border-[#B66B44]/30 hover:shadow-sm transition-all"
              >
                <div className="w-20 h-20 rounded-full bg-[#E8CEB0]/35 flex items-center justify-center mx-auto mb-5">
                  <img
                    src={action.image}
                    alt={action.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#211000]">
                  {action.title}
                </h3>
                <p className="mt-2 text-sm text-[#211000]/55 font-medium">
                  {action.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#B66B44]">
                  Continue
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-30 size-12 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white shadow-lg grid place-items-center transition-colors"
      >
        <ArrowLeft className="size-5 rotate-90" />
      </button>
    </main>
  );
}

function SectionHeader({ eyebrow, title, description, href, cta }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
          {eyebrow}
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mt-2 max-w-2xl leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm sm:text-base text-[#211000]/55 font-medium max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#B66B44] hover:underline"
        >
          {cta}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}