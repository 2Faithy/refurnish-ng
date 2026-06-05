"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  Heart,
  Share2,
  Frame,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  getProductBySlug,
  getRelatedProducts,
  formatNaira,
} from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;
  const product = getProductBySlug(slug);

  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#E8CEB0] text-[#211000] pt-32 px-6 text-center">
        <h1 className="font-serif text-4xl">Piece not found</h1>
        <Link
          href="/shop"
          className="mt-5 inline-block text-[#B66B44] hover:underline font-medium"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  const related = getRelatedProducts(product.id, 4);

  return (
    <main className="min-h-screen bg-[#E8CEB0] text-[#211000] font-sans antialiased pt-24 pb-24 px-4 sm:px-8 lg:px-16 selection:bg-[#B66B44]/20">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[#211000]/50 mb-8 flex items-center gap-1.5 font-medium"
        >
          <Link href="/" className="hover:text-[#B66B44] transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/shop" className="hover:text-[#B66B44] transition-colors">
            Shop
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-[#211000] truncate max-w-[180px]">
            {product.title}
          </span>
        </motion.nav>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* ---------- Gallery ---------- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <div className="aspect-square overflow-hidden rounded-3xl bg-white border border-[#211000]/5 shadow-sm relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={product.images[active]}
                  alt={product.title}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="size-full object-cover absolute inset-0"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((src, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActive(i)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    active === i
                      ? "border-[#B66B44] ring-1 ring-[#B66B44]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="size-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ---------- Info ---------- */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
            }}
            className="lg:col-span-5"
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] uppercase tracking-[0.25em] text-[#B66B44] font-bold"
            >
              {product.brand}
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-4xl md:text-5xl mt-2 leading-tight font-medium tracking-tight"
            >
              {product.title}
            </motion.h1>

            <motion.div variants={fadeUp} className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatNaira(product.price)}</span>
              {product.originalPrice && (
                <span className="text-base text-[#211000]/40 line-through font-medium">
                  {formatNaira(product.originalPrice)}
                </span>
              )}
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-xs text-[#211000]/50 mt-1 font-medium"
            >
              + delivery from ₦8,500 to Lagos
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/40 border border-white/40 px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm"
            >
              <span className="size-2 rounded-full bg-[#5F7161]" />
              Condition:{" "}
              <strong className="font-bold">{product.condition}</strong>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-col sm:flex-row gap-3"
            >
              <button className="flex-1 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-6 py-3.5 text-sm font-bold transition-all duration-200 shadow-md shadow-[#B66B44]/15 active:scale-[0.99]">
                Buy with protection
              </button>
              <Link
                href="/preview"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#211000]/20 px-5 py-3.5 text-sm font-bold hover:bg-white/40 transition-colors"
              >
                <Frame className="size-4" /> Preview in my space
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-3 flex gap-2">
              <button
                onClick={() => setSaved((v) => !v)}
                className="flex-1 rounded-full border border-[#211000]/15 bg-white/30 px-4 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 hover:bg-white/50 hover:text-[#B66B44] transition-colors"
              >
                <Heart
                  className={`size-4 ${saved ? "fill-red-500 text-red-500" : ""}`}
                />{" "}
                {saved ? "Saved" : "Save"}
              </button>
              <button className="flex-1 rounded-full border border-[#211000]/15 bg-white/30 px-4 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 hover:bg-white/50 hover:text-[#B66B44] transition-colors">
                <Share2 className="size-4" /> Share
              </button>
            </motion.div>

            {/* Trust block */}
            <motion.div
              variants={fadeUp}
              className="mt-7 rounded-2xl bg-white/30 border border-white/40 p-5 grid gap-4 text-sm backdrop-blur-sm"
            >
              <TrustRow
                icon={<BadgeCheck className="size-4 text-[#5F7161]" />}
                label="Verified seller"
                value={`${product.seller.name} · ${product.seller.rating}★`}
              />
              <TrustRow
                icon={<ShieldCheck className="size-4 text-[#5F7161]" />}
                label="Secure escrow payment"
                value="Funds released after delivery"
              />
              <TrustRow
                icon={<Truck className="size-4 text-[#5F7161]" />}
                label="Delivery support"
                value="Refurnish-assisted across Lagos"
              />
            </motion.div>

            {/* Description + Specs */}
            <motion.div variants={fadeUp} className="mt-8">
              <h2 className="font-serif text-2xl font-medium">About this piece</h2>
              <p className="mt-3 text-[#211000]/70 leading-relaxed font-medium text-sm">
                {product.description}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm border-t border-[#211000]/10 pt-6">
                <Spec label="Material" value={product.material} />
                <Spec label="Color" value={product.color} />
                <Spec label="Dimensions" value={product.dimensions} />
                <Spec label="Style" value={product.style} />
                <Spec label="Room" value={product.room} />
                <Spec label="Pickup" value={product.location} />
              </dl>
            </motion.div>
          </motion.div>
        </div>

        {/* ---------- Related ---------- */}
        <section className="mt-24 sm:mt-32">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl font-medium tracking-tight"
          >
            Pairs well with
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10"
          >
            {related.map((p) => (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </main>
  );
}

/* ---------- Sub-components ---------- */

function TrustRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-[#211000] font-medium">{label}</p>
        <p className="text-xs text-[#211000]/55 font-medium">{value}</p>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-[#211000]/45 font-bold">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium text-[#211000]">{value}</dd>
    </div>
  );
}