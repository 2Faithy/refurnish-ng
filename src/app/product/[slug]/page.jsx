"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ArrowLeft,
  Copy,
  X,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import {
  getProductBySlug,
  getRelatedProducts,
  formatNaira,
} from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";

const SAVED_KEY = "refurnish_saved";
const CART_KEY = "refurnish_cart";
const QTY_KEY = "refurnish_cart_quantities";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();

  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const product = getProductBySlug(slug);

  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [productUrl, setProductUrl] = useState("");

  useEffect(() => {
    if (!product) return;

    try {
      const savedItems = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      setSaved(savedItems.includes(product.id));
    } catch {
      setSaved(false);
    }

    if (typeof window !== "undefined") {
      setProductUrl(`${window.location.origin}/product/${product.slug}`);
    }
  }, [product]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF4EC] text-[#211000] pt-32 px-6 text-center">
        <h1 className="font-serif text-4xl">Piece not found</h1>
        <Link
          href="/shop"
          className="mt-5 inline-flex items-center gap-2 text-[#B66B44] hover:underline font-bold"
        >
          <ArrowLeft className="size-4" />
          Back to shop
        </Link>
      </main>
    );
  }

  const related = getRelatedProducts(product.id, 4);

  const handleToggleSave = () => {
    try {
      const savedItems = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");

      let nextSaved;
      if (savedItems.includes(product.id)) {
        nextSaved = savedItems.filter((id) => id !== product.id);
        setSaved(false);
        setToast("Removed from saved");
      } else {
        nextSaved = [...savedItems, product.id];
        setSaved(true);
        setToast("Saved to your collection");
      }

      localStorage.setItem(SAVED_KEY, JSON.stringify(nextSaved));
    } catch {
      setToast("Could not update saved items");
    }
  };

  const handleBuyWithProtection = () => {
    try {
      /**
       * Buy now should checkout THIS product directly.
       * It sets cart to this single product so the checkout page can read it.
       */
      localStorage.setItem(CART_KEY, JSON.stringify([product.id]));
      localStorage.setItem(
        QTY_KEY,
        JSON.stringify({
          [String(product.id)]: 1,
        })
      );

      router.push("/checkout");
    } catch {
      setToast("Could not start checkout. Please try again.");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setToast("Product link copied");
    } catch {
      setToast("Could not copy link");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 sm:pt-32 lg:pt-40 pb-24 px-4 sm:px-8 lg:px-16 selection:bg-[#B66B44]/20">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to shop
        </Link>

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-[#211000]/45 mb-8 flex items-center gap-1.5 font-medium"
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
          {/* Gallery */}
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

          {/* Info */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.07, delayChildren: 0.15 },
              },
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

            <motion.div
              variants={fadeUp}
              className="mt-5 flex items-baseline gap-3"
            >
              <span className="text-3xl font-bold">
                {formatNaira(product.price)}
              </span>

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
              + delivery from ₦8,500 to Lagos, or self-pickup where available
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white border border-[#211000]/8 px-3.5 py-1.5 text-xs font-medium"
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
              <button
                onClick={handleBuyWithProtection}
                className="flex-1 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-6 py-3.5 text-sm font-bold transition-all duration-200 shadow-md shadow-[#B66B44]/15 active:scale-[0.99]"
              >
                Buy with protection
              </button>

              <Link
                href="/preview"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#211000]/15 bg-white hover:bg-[#E8CEB0]/25 px-5 py-3.5 text-sm font-bold transition-colors"
              >
                <Frame className="size-4" />
                Preview in my space
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-3 flex gap-2">
              <button
                onClick={handleToggleSave}
                className="flex-1 rounded-full border border-[#211000]/12 bg-white px-4 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 hover:bg-[#E8CEB0]/20 hover:text-[#B66B44] transition-colors"
              >
                <Heart
                  className={`size-4 ${
                    saved ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {saved ? "Saved" : "Save"}
              </button>

              <button
                onClick={() => setShareOpen(true)}
                className="flex-1 rounded-full border border-[#211000]/12 bg-white px-4 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2 hover:bg-[#E8CEB0]/20 hover:text-[#B66B44] transition-colors"
              >
                <Share2 className="size-4" />
                Share
              </button>
            </motion.div>

            {/* Trust block */}
            <motion.div
              variants={fadeUp}
              className="mt-7 rounded-2xl bg-white border border-[#211000]/8 p-5 grid gap-4 text-sm shadow-sm"
            >
              <TrustRow
                icon={<BadgeCheck className="size-4 text-[#5F7161]" />}
                label="Verified seller"
                value={`${product.seller?.name || "Seller"} · ${
                  product.seller?.rating || "4.8"
                }★`}
              />

              <TrustRow
                icon={<ShieldCheck className="size-4 text-[#5F7161]" />}
                label="Secure escrow payment"
                value="Funds released after delivery confirmation"
              />

              <TrustRow
                icon={<Truck className="size-4 text-[#5F7161]" />}
                label="Delivery support"
                value="Refurnish-assisted logistics across Lagos"
              />
            </motion.div>

            {/* Description + Specs */}
            <motion.div variants={fadeUp} className="mt-8">
              <h2 className="font-serif text-2xl font-medium">
                About this piece
              </h2>

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

        {/* Related */}
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
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10"
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

      {/* Share Modal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        product={product}
        productUrl={productUrl}
        onCopy={handleCopyLink}
        setToast={setToast}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[90] inline-flex items-center gap-2 bg-[#211000] text-[#FAF4EC] px-5 py-3 rounded-full shadow-2xl"
          >
            <CheckCircle2 className="size-4 text-[#5F7161]" />
            <span className="text-xs font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
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

function ShareModal({ open, onClose, product, productUrl, onCopy, setToast }) {
  if (!product) return null;

  const encodedUrl = encodeURIComponent(productUrl);
  const encodedText = encodeURIComponent(
    `Check out this ${product.title} on Refurnish: ${productUrl}`
  );

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: <FaWhatsapp className="size-5" />,
      href: `https://wa.me/?text=${encodedText}`,
      color: "text-[#25D366]",
    },
    {
      label: "Facebook",
      icon: <FaFacebookF className="size-5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "text-[#1877F2]",
    },
    {
      label: "X / Twitter",
      icon: <FaTwitter className="size-5" />,
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
      color: "text-[#111111]",
    },
    {
      label: "LinkedIn",
      icon: <FaLinkedinIn className="size-5" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "text-[#0A66C2]",
    },
  ];

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title} on Refurnish`,
          url: productUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      onCopy();
    }
  };

  const handleInstagram = async () => {
    await onCopy();
    setToast("Link copied — paste it on Instagram");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-0 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close share modal"
            onClick={onClose}
            className="absolute inset-0 bg-[#211000]/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FAF4EC] border border-[#211000]/10 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 size-9 rounded-full hover:bg-[#211000]/5 grid place-items-center z-10"
              aria-label="Close"
            >
              <X className="size-4 text-[#211000]/60" />
            </button>

            <div className="p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                Share this piece
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight mt-2">
                {product.title}
              </h2>

              <div className="mt-5 flex items-center gap-4 rounded-2xl bg-white border border-[#211000]/8 p-3">
                <div className="size-16 rounded-xl overflow-hidden bg-[#E8CEB0]/30 shrink-0">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45">
                    {product.brand}
                  </p>
                  <p className="text-sm font-bold truncate">{product.title}</p>
                  <p className="text-xs text-[#211000]/50 font-medium">
                    {formatNaira(product.price)}
                  </p>
                </div>
              </div>

              {/* Copy field */}
              <div className="mt-5 rounded-2xl bg-white border border-[#211000]/8 p-3 flex items-center gap-3">
                <p className="flex-1 text-xs font-medium text-[#211000]/55 truncate">
                  {productUrl}
                </p>

                <button
                  onClick={onCopy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#211000] text-[#FAF4EC] px-3 py-2 text-[11px] font-bold hover:bg-[#211000]/90 transition-colors"
                >
                  <Copy className="size-3.5" />
                  Copy
                </button>
              </div>

              {/* Social links */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shareLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl bg-white border border-[#211000]/8 hover:border-[#B66B44]/30 p-4 flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <span className={item.color}>{item.icon}</span>
                    <span className="text-xs font-bold">{item.label}</span>
                  </a>
                ))}

                <button
                  onClick={handleInstagram}
                  className="rounded-2xl bg-white border border-[#211000]/8 hover:border-[#B66B44]/30 p-4 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <FaInstagram className="size-5 text-[#E4405F]" />
                  <span className="text-xs font-bold">Instagram</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="rounded-2xl bg-white border border-[#211000]/8 hover:border-[#B66B44]/30 p-4 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="size-5 text-[#B66B44]" />
                  <span className="text-xs font-bold">More</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}