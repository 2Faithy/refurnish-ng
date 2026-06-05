"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, BadgeCheck } from "lucide-react";
import { formatNaira, type Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white border border-[#211000]/5 shadow-sm">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#211000]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked((v) => !v);
            }}
            className="absolute top-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur grid place-items-center text-[#211000]/60 hover:text-red-500 transition-colors duration-200 shadow-sm"
            aria-label="Save"
          >
            <Heart
              className={`size-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
          </button>

          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-[#E8CEB0] text-[#211000] px-2.5 py-1 text-[10px] font-bold shadow-sm">
            {product.condition}
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#211000]/50 font-bold">
              {product.brand}
            </p>
            <h3 className="font-serif text-base leading-tight mt-0.5 truncate text-[#211000]">
              {product.title}
            </h3>
            <p className="text-xs text-[#211000]/50 mt-1 inline-flex items-center gap-1 font-medium">
              <BadgeCheck className="size-3 text-[#5F7161]" />
              Verified · {product.location}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-sm text-[#211000]">
              {formatNaira(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-[10px] text-[#211000]/40 line-through font-medium">
                {formatNaira(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
