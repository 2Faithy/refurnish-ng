"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";

export default function SellerConfirmOrderPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [responding, setResponding] = useState(false);
  const [responded, setResponded] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("This link is missing information. Please check the link in your email.");
      setLoading(false);
      return;
    }

    const fetchConfirmation = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Could not load this confirmation.");
        setConfirmation(data.confirmation);
        if (data.confirmation.availability) {
          setResponded(data.confirmation.availability);
        }
      } catch (err) {
        setError(err.message || "Could not load this confirmation.");
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmation();
  }, [token]);

  const respond = async (available) => {
    setResponding(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/seller/${token}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit response.");
      setResponded(available ? "available" : "unavailable");
    } catch (err) {
      setError(err.message || "Failed to submit response.");
    } finally {
      setResponding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 pb-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {loading ? (
          <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-10 text-center">
            <Loader2 className="size-8 text-[#B66B44] animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#211000]/55 font-medium">Loading…</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-10 text-center">
            <AlertCircle className="size-10 text-red-500 mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-medium mb-2">Something went wrong</h1>
            <p className="text-sm text-[#211000]/55 font-medium">{error}</p>
          </div>
        ) : responded ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-10 text-center"
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
                responded === "available" ? "bg-[#5F7161]/10" : "bg-[#E8CEB0]/40"
              }`}
            >
              {responded === "available" ? (
                <CheckCircle2 className="size-8 text-[#5F7161]" />
              ) : (
                <XCircle className="size-8 text-[#B66B44]" />
              )}
            </div>
            <h1 className="font-serif text-2xl font-medium mb-2">
              {responded === "available" ? "Thanks for confirming!" : "Got it, thanks."}
            </h1>
            <p className="text-sm text-[#211000]/55 font-medium">
              {responded === "available"
                ? "We've let the buyer know your item is available and shared your details for pickup."
                : "We've let the buyer know the item isn't available and their payment will be refunded."}
            </p>
          </motion.div>
        ) : (
          <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="w-14 h-14 rounded-2xl bg-[#B66B44]/10 flex items-center justify-center mb-5">
                <Package className="size-6 text-[#B66B44]" />
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                Order {confirmation.orderReference}
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight mt-2 mb-4">
                Is this item still available?
              </h1>

              <div className="space-y-2 mb-6">
                {(confirmation.items || []).map((item, i) => (
                  <div key={i} className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-3">
                    <p className="text-sm font-bold">{item.itemTitle}</p>
                    <p className="text-xs text-[#211000]/50 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-[#211000]/55 font-medium mb-6">
                A buyer has purchased this item. Let us know if it's ready for pickup, or if it's no
                longer available so we can refund the buyer right away.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => respond(true)}
                  disabled={responding}
                  className="inline-flex items-center justify-center gap-2 bg-[#5F7161] hover:bg-[#4d5e50] disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-full transition-colors"
                >
                  {responding ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  Yes, it's available
                </button>
                <button
                  onClick={() => respond(false)}
                  disabled={responding}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-[#211000]/12 hover:bg-red-50 hover:text-red-600 disabled:opacity-60 text-[#211000] font-bold text-sm py-3.5 rounded-full transition-colors"
                >
                  <XCircle className="size-4" />
                  Not available
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}