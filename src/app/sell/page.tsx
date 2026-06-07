"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Camera,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  Wallet,
  Recycle,
  ShoppingBag,
  Users,
  Truck,
  CreditCard,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function SellLandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased">
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Replace /sell-hero.jpg with your actual image */}
        <Image
          src="/studio.jpg"
          alt="Selling on Refurnish"
          fill
          priority
          className="object-cover"
        />
        {/* Soft dark overlay — lighter than your current version */}
        <div className="absolute inset-0 bg-[#211000]/45" />

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          className="relative z-10 text-center px-4 max-w-2xl mx-auto pt-20 sm:pt-24"
        >
          <motion.h1
            variants={fadeUp}
            className="font-serif text-5xl sm:text-6xl font-medium text-white leading-tight tracking-tight"
          >
            Selling on Refurnish
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-lg mx-auto"
          >
            With thousands of design-savvy shoppers browsing each month,
            Refurnish is the best place to sell your pre-loved and refurbished
            furniture across Nigeria.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8">
            <button
              onClick={() => router.push("/sell/create")}
              className="inline-flex items-center gap-2 bg-white text-[#211000] font-bold text-sm px-7 py-3.5 rounded-full hover:bg-[#FAF4EC] transition-all shadow-lg"
            >
              List an item
              <ArrowRight className="size-4" />
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. WHY SELL WITH US ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 pt-20 pb-10">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl sm:text-4xl font-medium text-center mb-14 tracking-tight"
        >
          Why sell with us?
        </motion.h2>

        {/* 4-column icon grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
        >
          {[
            {
              icon: <CheckCircle className="size-6 text-[#B66B44]" />,
              text: "The number-one shopping destination for design-conscious buyers in Lagos.",
            },
            {
              icon: <ShieldCheck className="size-6 text-[#B66B44]" />,
              text: "Payments made safely and securely through escrow — released only after delivery.",
            },
            {
              icon: <Wallet className="size-6 text-[#B66B44]" />,
              text: "No monthly fees, no listing fees, no hidden fees. You only pay when you sell.",
            },
            {
              icon: <Recycle className="size-6 text-[#B66B44]" />,
              text: "Reduce carbon emissions from new manufacturing by keeping beautiful pieces in circulation.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full border border-[#B66B44]/30 flex items-center justify-center">
                {item.icon}
              </div>
              <p className="text-xs sm:text-sm text-[#211000]/65 leading-relaxed font-medium max-w-[180px]">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 3. EDITORIAL IMAGE + TEXT SPLIT ─────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: image — replace /sell-interior.jpg with your actual image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <Image
              src="/living.jpg"
              alt="Beautiful interiors"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right: copy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            <p className="text-sm sm:text-base text-[#211000]/70 leading-relaxed font-medium">
              Whether you're a vintage dealer or just making room for something
              new, we believe selling pre-loved furniture and homeware should be
              effortless.
            </p>
            <p className="text-sm sm:text-base text-[#211000]/70 leading-relaxed font-medium">
              Our fully circular model means you won't get stuck with pieces you
              no longer need — and we offset the carbon footprint on the
              delivery of every piece sold.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 4. TWO WAYS TO SELL ─────────────────────────────────── */}
      <section className="bg-[#C4613A] text-white py-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl sm:text-4xl font-medium text-center mb-12 tracking-tight"
          >
            There are two ways to sell on Refurnish
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Professional */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-white/20 p-7 space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-white text-[#C4613A] text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h3 className="font-serif text-xl font-medium">
                  Professional sellers
                </h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                If you run a business dealing in vintage, antiques or
                refurbished pieces, apply for a professional account and receive
                exclusive benefits.
              </p>
              <p className="text-sm font-bold text-white">
                Commission: 17% on the first ₦2,500,000 per item, then 10% on
                any amount above ₦2,500,000.
              </p>
              <button
                onClick={() => router.push("/sell/create?type=professional")}
                className="inline-flex items-center gap-2 bg-white text-[#211000] font-bold text-xs px-5 py-2.5 rounded-full hover:bg-[#FAF4EC] transition-all"
              >
                I'm a professional seller
              </button>
            </motion.div>

            {/* Individual */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-white/20 p-7 space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-white text-[#C4613A] text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="font-serif text-xl font-medium">
                  Individual sellers
                </h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                For anyone who has a quality piece of pre-loved furniture to
                rehome — quick, fair, and fully supported.
              </p>
              <p className="text-sm font-bold text-white">
                Commission: Flat 24% on the item price.
              </p>
              <button
                onClick={() => router.push("/sell/create")}
                className="inline-flex items-center gap-2 bg-white text-[#211000] font-bold text-xs px-5 py-2.5 rounded-full hover:bg-[#FAF4EC] transition-all"
              >
                I'm an individual seller
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 pt-20 pb-10">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-serif text-3xl sm:text-4xl font-medium text-center mb-14 tracking-tight"
        >
          How it works
        </motion.h2>

        {/* 5-step horizontal flow */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-center"
        >
          {[
            {
              num: "1",
              icon: <Camera className="size-5 text-[#B66B44]" />,
              text: "Upload details, photos and videos of your piece.",
            },
            {
              num: "2",
              icon: <Users className="size-5 text-[#B66B44]" />,
              text: "Our curation team will review your listing.",
            },
            {
              num: "3",
              icon: <CheckCircle className="size-5 text-[#B66B44]" />,
              text: "Your piece is shown to our buyers.",
            },
            {
              num: "4",
              icon: <Truck className="size-5 text-[#B66B44]" />,
              text: "Use our all-in-one delivery service or arrange your own.",
            },
            {
              num: "5",
              icon: <CreditCard className="size-5 text-[#B66B44]" />,
              text: "Get paid once your item arrives safely.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-[#B66B44] text-white text-sm font-bold flex items-center justify-center">
                {step.num}
              </div>
              <div className="w-9 h-9 rounded-full border border-[#B66B44]/20 flex items-center justify-center">
                {step.icon}
              </div>
              <p className="text-xs text-[#211000]/60 leading-relaxed font-medium max-w-[130px]">
                {step.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── 6. NOT READY / BROWSE CTA SPLIT ─────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: image — replace /sell-browse.jpg with your actual image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden"
          >
            <Image
              src="/airbnb.jpg"
              alt="Browse interiors"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Right: copy */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
              Not ready to sell?
            </h3>
            <p className="text-sm text-[#211000]/65 leading-relaxed font-medium">
              Browse quality pre-loved pieces from sellers across Nigeria. Learn
              how much your unwanted pieces could sell for — or treat yourself
              to something 'new'.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#B66B44] hover:underline mt-2"
            >
              Browse the shop
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
