"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Package,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function SellLandingPage() {
  const router = useRouter();

  const stats = [
    { icon: <Users className="size-5" />, value: "12,000+", label: "Active buyers monthly" },
    { icon: <TrendingUp className="size-5" />, value: "₦2.4M+", label: "Sold this month" },
    { icon: <ShieldCheck className="size-5" />, value: "100%", label: "Secure escrow payments" },
    { icon: <Package className="size-5" />, value: "24hrs", label: "Average listing approval" },
  ];

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <Image
          src="/studio.jpg"
          alt="Selling on Refurnish"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#211000]/85 via-[#211000]/60 to-[#211000]/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full pt-32 pb-20">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-[#FAF4EC]/15 border border-[#FAF4EC]/20 backdrop-blur-sm px-4 py-2 mb-6"
            >
              <Sparkles className="size-3.5 text-[#E8CEB0] fill-[#E8CEB0]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FAF4EC]">
                Start selling today
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] text-[#FAF4EC] tracking-tight"
            >
              Selling on{" "}
              <span className="text-[#E8CEB0]">Refurnish</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-base sm:text-lg text-[#FAF4EC]/80 leading-relaxed font-medium max-w-lg"
            >
              With thousands of design-savvy shoppers browsing each month,
              Refurnish is the best place to sell your pre-loved and refurbished
              furniture across Nigeria.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => router.push("/sell/create")}
                className="inline-flex items-center gap-2.5 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-sm px-7 py-4 rounded-full transition-all shadow-lg shadow-[#B66B44]/25 active:scale-[0.99]"
              >
                <Camera className="size-4" />
                List an item
                <ArrowRight className="size-4" />
              </button>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#FAF4EC]/15 backdrop-blur-sm border border-[#FAF4EC]/25 text-[#FAF4EC] font-bold text-sm px-7 py-4 rounded-full hover:bg-[#FAF4EC]/25 transition-all"
              >
                Browse the shop
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 -mt-16 relative z-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-[#211000]/8 p-5 shadow-sm text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[#B66B44]/10 text-[#B66B44] flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs text-[#211000]/50 font-medium mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
            How it works
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-2 mb-12">
            Three steps to your first sale
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              step: "01",
              title: "Photograph & describe",
              desc: "Upload clean photos, add dimensions, and set your price. Our AI helps you write a compelling listing.",
            },
            {
              step: "02",
              title: "Get verified & go live",
              desc: "Our team reviews your listing within 24 hours. Once approved, thousands of buyers can find your piece.",
            },
            {
              step: "03",
              title: "Sell securely",
              desc: "Buyer pays through our escrow system. You get paid once delivery is confirmed. Zero risk.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="rounded-2xl bg-white border border-[#211000]/8 p-7 shadow-sm hover:shadow-md transition-shadow group"
            >
              <span className="text-4xl font-serif font-medium text-[#E8CEB0]">
                {item.step}
              </span>
              <h3 className="font-serif text-xl font-medium mt-4 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#211000]/55 leading-relaxed font-medium">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-24">
        <div className="rounded-3xl bg-[#211000] text-[#FAF4EC] p-10 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight">
              Ready to list your first piece?
            </h2>
            <p className="mt-3 text-sm text-[#FAF4EC]/60 font-medium max-w-md">
              It takes less than 5 minutes. Free to list, zero risk.
            </p>
          </div>
          <button
            onClick={() => router.push("/sell/create")}
            className="shrink-0 inline-flex items-center gap-2.5 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-sm px-7 py-4 rounded-full transition-all shadow-lg shadow-[#B66B44]/25"
          >
            <Camera className="size-4" />
            List an item
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>
    </main>
  );
}