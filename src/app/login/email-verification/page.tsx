"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function EmailVerificationPage() {
  const router = useRouter();
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const signupData = localStorage.getItem("pending_signup");
    const loginEmail = localStorage.getItem("pending_verification_email");
    const loginNext = localStorage.getItem("pending_verification_next");

    if (signupData) {
      const parsed = JSON.parse(signupData);
      setPendingUser(parsed);
    } else if (loginEmail) {
      setPendingUser({ email: loginEmail, next: loginNext || null });
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (canResend) return;
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer, canResend]);

  const handleCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "");
    if (digit.length > 1) return;
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    setError("");
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: pendingUser.email, code: fullCode }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid code. Please try again.");
        return;
      }

      localStorage.setItem(
        "refurnish_user",
        JSON.stringify({ ...data.user, token: data.token })
      );
      localStorage.removeItem("pending_signup");
      localStorage.removeItem("pending_verification_email");
      localStorage.removeItem("pending_verification_next");
      setSuccess(true);
      setTimeout(
        () => router.push(pendingUser?.next || "/dashboard"),
        1500
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(30);
    setCode(["", "", "", "", "", ""]);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: pendingUser.email }),
        }
      );
      const data = await res.json();
    } catch {
      setError("Could not resend code. Please try again.");
    }

    inputRefs.current[0]?.focus();
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased flex flex-col">
      <div className="w-full px-5 sm:px-10 pt-8 pb-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/60 hover:text-[#B66B44] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-10 pb-12">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="verify-form"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -20 }}
                variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              >
                <motion.div
                  variants={fadeUp}
                  className="flex justify-center mb-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#B66B44]/10 flex items-center justify-center">
                    <Mail className="size-7 text-[#B66B44]" />
                  </div>
                </motion.div>

                <motion.p
                  variants={fadeUp}
                  className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44] text-center"
                >
                  Verify your email
                </motion.p>
                <motion.h1
                  variants={fadeUp}
                  className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-2 mb-2 text-center"
                >
                  Check your inbox
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="text-sm text-[#211000]/55 font-medium text-center mb-1"
                >
                  We sent a 6-digit code to
                </motion.p>
                <motion.p
                  variants={fadeUp}
                  className="text-sm font-bold text-center mb-6"
                >
                  {pendingUser?.email || "your email"}
                </motion.p>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-5"
                    >
                      <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                        <AlertCircle className="size-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  variants={fadeUp}
                  className="flex justify-center gap-2.5 mb-6"
                >
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl text-center text-xl font-bold border-2 transition-all focus:outline-none ${
                        digit
                          ? "border-[#B66B44] bg-white"
                          : "border-[#211000]/12 bg-white"
                      } focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15`}
                    />
                  ))}
                </motion.div>

                <motion.button
                  variants={fadeUp}
                  onClick={handleVerify}
                  disabled={loading || code.some((d) => !d)}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-60 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-md shadow-[#B66B44]/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Verifying…</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Continue</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </motion.button>

                <motion.div variants={fadeUp} className="text-center mt-6">
                  <p className="text-sm text-[#211000]/50 font-medium">
                    Didn't receive the code?{" "}
                    {canResend ? (
                      <button
                        onClick={handleResend}
                        className="font-bold text-[#B66B44] hover:underline inline-flex items-center gap-1"
                      >
                        <RefreshCw className="size-3" />
                        Resend code
                      </button>
                    ) : (
                      <span className="text-[#211000]/40">
                        Resend in {resendTimer}s
                      </span>
                    )}
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-[#5F7161]/10 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="size-10 text-[#5F7161]" />
                </motion.div>
                <h2 className="font-serif text-3xl font-medium tracking-tight mb-2">
                  Email verified!
                </h2>
                <p className="text-sm text-[#211000]/55 font-medium">
                  {pendingUser?.next
                    ? "Redirecting you back to finish your listing…"
                    : "Redirecting you to your dashboard…"}
                </p>
                <div className="mt-6 flex justify-center">
                  <Loader2 className="size-5 text-[#B66B44] animate-spin" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
