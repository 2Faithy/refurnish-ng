"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

function CheckoutVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Paystack appends the reference as either `reference` or `trxref`
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setStatus("error");
      setMessage("No payment reference was found. Please contact support if you were charged.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("refurnish_user") || "null");

    if (!user?.token) {
      // Shouldn't normally happen since checkout requires login, but guard anyway
      router.push(`/login?next=${encodeURIComponent(`/checkout/verify?reference=${reference}`)}`);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/verify/${reference}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "We could not verify your payment.");
        }

        setOrder(data.order);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage(err.message || "We could not verify your payment.");
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 sm:pt-32 lg:pt-40 pb-24 px-4 sm:px-8 lg:px-16 flex items-center justify-center">
      <div className="w-full max-w-lg text-center">
        {status === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-10"
          >
            <Loader2 className="size-10 text-[#B66B44] animate-spin mx-auto mb-5" />
            <h1 className="font-serif text-2xl font-medium tracking-tight mb-2">
              Verifying your payment…
            </h1>
            <p className="text-sm text-[#211000]/55 font-medium">
              This will only take a moment. Please don't close this page.
            </p>
          </motion.div>
        )}

        {status === "success" && order && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-8 sm:p-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-[#5F7161]/10 flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 className="size-10 text-[#5F7161]" />
            </motion.div>

            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              Payment confirmed
            </p>

            <h1 className="font-serif text-3xl font-medium tracking-tight mt-2 mb-3">
              Your order is confirmed!
            </h1>

            <p className="text-sm text-[#211000]/60 font-medium leading-relaxed max-w-sm mx-auto">
              We've sent the seller's details and next steps to your email. Check your inbox for
              everything you need to arrange pickup or delivery.
            </p>

            <div className="mt-6 rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-4 text-left space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#211000]/45 font-medium">Order reference</span>
                <span className="font-mono font-bold text-xs">{order.reference}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#211000]/45 font-medium">Amount</span>
                <span className="font-bold">{formatNaira(Number(order.total))}</span>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/orders"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#B66B44]/15"
              >
                View orders
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-[#E8CEB0]/25 border border-[#211000]/12 text-[#211000] px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Continue shopping
              </Link>
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-8 sm:p-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5"
            >
              <AlertCircle className="size-10 text-red-500" />
            </motion.div>

            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-red-500">
              Verification issue
            </p>

            <h1 className="font-serif text-3xl font-medium tracking-tight mt-2 mb-3">
              We couldn't verify your payment.
            </h1>

            <p className="text-sm text-[#211000]/60 font-medium leading-relaxed max-w-sm mx-auto">
              {message}
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/orders"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#B66B44]/15"
              >
                View orders
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-[#E8CEB0]/25 border border-[#211000]/12 text-[#211000] px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Contact support
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
  
export default function CheckoutVerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 sm:pt-32 lg:pt-40 pb-24 px-4 sm:px-8 lg:px-16 flex items-center justify-center">
          <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-10 text-center">
            <Loader2 className="size-10 text-[#B66B44] animate-spin mx-auto mb-5" />
            <h1 className="font-serif text-2xl font-medium tracking-tight">
              Loading...
            </h1>
          </div>
        </main>
      }
    >
      <CheckoutVerify />
    </Suspense>
  );
}