"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

async function apiFetch(url: string, body: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<
    "email" | "code" | "reset" | "done"
  >("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCode, setForgotCode] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmResetPassword, setShowConfirmResetPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const switchMode = (next: "login" | "signup") => {
    setMode(next);
    setError("");
    setSuccess("");
    setForm({ name: "", email: "", phone: "", password: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
          }/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: form.email,
              password: form.password,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          if (data.needsEmailVerification) {
            localStorage.setItem("pending_verification_email", data.email);
            router.push("/login/email-verification");
            return;
          }
          setError(data.message || "Login failed.");
          return;
        }

        localStorage.setItem("refurnish_user", JSON.stringify(data.user));
        setSuccess(`Welcome back, ${data.user.name.split(" ")[0]}!`);
        setTimeout(() => router.push("/dashboard"), 1200);
      } else {
        if (!form.name || !form.email || !form.password) {
          setError("Please fill in all required fields.");
          return;
        }

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
          }/api/auth/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              phone: form.phone,
              password: form.password,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Signup failed.");
          return;
        }

        localStorage.setItem("pending_verification_email", form.email);
        setSuccess("Account created! Verifying your email…");
        setTimeout(() => router.push("/login/email-verification"), 1200);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
        }/api/auth/resend-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setForgotError(data.message || "Email not found.");
        return;
      }

      // In dev, code comes back in response
      if (data.devCode) setGeneratedCode(data.devCode);
      setForgotStep("code");
    } catch {
      setForgotError("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot password step 2: verify code
  const handleCodeVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    await new Promise((r) => setTimeout(r, 700));

    if (forgotCode === generatedCode) {
      setForgotStep("reset");
    } else {
      setForgotError("Invalid code. Please check your email and try again.");
    }

    setForgotLoading(false);
  };

  // Forgot password step 3: set new password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!resetPassword || !confirmResetPassword) {
      setForgotError("Please fill in both password fields.");
      return;
    }
    if (resetPassword.length < 8) {
      setForgotError("Password must be at least 8 characters.");
      return;
    }
    if (resetPassword !== confirmResetPassword) {
      setForgotError("Passwords do not match.");
      return;
    }

    setForgotLoading(true);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"
        }/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotEmail,
            code: forgotCode,
            password: resetPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setForgotError(data.message || "Could not reset password.");
        return;
      }

      setForgotStep("done");
    } catch {
      setForgotError("Something went wrong. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgot = () => {
    setForgotOpen(false);
    setForgotStep("email");
    setForgotEmail("");
    setForgotCode("");
    setForgotError("");
    setGeneratedCode("");
    setResetPassword("");
    setConfirmResetPassword("");
    setShowResetPassword(false);
    setShowConfirmResetPassword(false);
  };

  const handleForgotDone = () => {
    setMode("login");
    setForm((prev) => ({
      ...prev,
      email: forgotEmail,
      password: "",
    }));
    closeForgot();
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased selection:bg-[#B66B44]/20 flex">
      {/* LEFT */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/airbnb.jpg"
          alt="Curated interior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#211000]/70 via-[#211000]/30 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full pt-28">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="bg-[#FAF4EC] rounded-xl p-2 shadow-lg">
              <Image src="/logo.png" alt="Refurnish" width={36} height={36} />
            </div>
            <span className="font-serif text-xl text-[#FAF4EC] tracking-tight">
              Refurnish
            </span>
          </Link>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-md"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-[#FAF4EC]/15 border border-[#FAF4EC]/25 backdrop-blur-sm px-3.5 py-1.5 mb-6"
            >
              <Sparkles className="size-3.5 text-[#E8CEB0]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FAF4EC]">
                Pre-loved. Re-loved.
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-4xl xl:text-5xl font-medium leading-[1.1] text-[#FAF4EC] tracking-tight"
            >
              A home that feels like you — beautifully second-hand.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm text-[#FAF4EC]/80 leading-relaxed font-medium max-w-sm"
            >
              Discover verified, curated furniture from sellers across Lagos.
              Every piece checked. Every payment protected.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex items-center gap-6 text-[#FAF4EC]/90"
            >
              <div className="flex items-center gap-2 text-xs font-bold">
                <ShieldCheck className="size-4 text-[#E8CEB0]" />
                Escrow protected
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="size-4 text-[#E8CEB0]" />
                Verified sellers
              </div>
            </motion.div>
          </motion.div>

          <div className="text-[11px] text-[#FAF4EC]/50 font-medium">
            © {new Date().getFullYear()} Refurnish NG. All rights reserved.
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10 py-12 pt-28">
        <div className="w-full max-w-md">
          {/* 👇 Add this back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>

          <div className="lg:hidden mb-8 flex items-center gap-3 justify-center">
            <Image src="/logo.png" alt="Refurnish" width={40} height={40} />
            <span className="font-serif text-2xl tracking-tight">
              Refurnish
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                {mode === "login" ? "Welcome back" : "Get started"}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-2 mb-2 leading-tight">
                {mode === "login"
                  ? "Sign in to your account"
                  : "Create your account"}
              </h2>
              <p className="text-sm text-[#211000]/55 font-medium mb-8">
                {mode === "login"
                  ? "Pick up right where you left off."
                  : "Join thousands furnishing thoughtfully."}
              </p>

              <div className="relative grid grid-cols-2 p-1 rounded-full bg-[#E8CEB0]/50 border border-[#211000]/10 mb-8">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#211000] shadow-sm"
                  style={{ left: mode === "login" ? "4px" : "calc(50% + 0px)" }}
                />
                {(["login", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`relative z-10 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-colors duration-300 ${
                      mode === m ? "text-[#E8CEB0]" : "text-[#211000]/60"
                    }`}
                  >
                    {m === "login" ? "Sign In" : "Sign Up"}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                      <AlertCircle className="size-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/30 px-4 py-3 text-sm text-[#5F7161] font-medium">
                      <CheckCircle2 className="size-4 mt-0.5 shrink-0" />
                      <span>{success}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {mode === "signup" && (
                    <motion.div
                      key="name-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Field
                        icon={<User className="size-4" />}
                        name="name"
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={handleChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field
                  icon={<Mail className="size-4" />}
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                />

                <AnimatePresence mode="popLayout">
                  {mode === "signup" && (
                    <motion.div
                      key="phone-field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Field
                        icon={<Phone className="size-4" />}
                        name="phone"
                        type="tel"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#211000]/40">
                    <Lock className="size-4" />
                  </span>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white border border-[#211000]/12 pl-11 pr-11 py-3.5 text-sm font-medium placeholder:text-[#211000]/40 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#211000]/40 hover:text-[#B66B44] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {mode === "login" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setForgotOpen(true)}
                      className="text-xs font-bold text-[#B66B44] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-70 text-white font-bold text-sm py-4 rounded-xl transition-all duration-200 shadow-md shadow-[#B66B44]/20 mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Please wait…</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {mode === "login" ? "Sign in" : "Create account"}
                      </span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px bg-[#211000]/10" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#211000]/40">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-[#211000]/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SocialButton label="Google" icon={<GoogleIcon />} />
                <SocialButton label="Apple" icon={<AppleIcon />} />
              </div>

              <p className="text-center text-sm text-[#211000]/55 font-medium mt-8">
                {mode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() =>
                    switchMode(mode === "login" ? "signup" : "login")
                  }
                  className="font-bold text-[#B66B44] hover:underline"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {forgotOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div
              className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
              onClick={closeForgot}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md bg-[#FAF4EC] rounded-3xl shadow-2xl border border-[#211000]/10 overflow-hidden"
            >
              <button
                onClick={closeForgot}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#211000]/5 transition-colors z-10"
              >
                <X className="size-4 text-[#211000]/60" />
              </button>

              <div className="p-8 sm:p-10">
                {/* Step 1 */}
                {forgotStep === "email" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#B66B44]/10 flex items-center justify-center mb-5">
                      <Mail className="size-6 text-[#B66B44]" />
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                      <span>Step 1</span>
                      <span className="text-[#211000]/25">/</span>
                      <span className="text-[#211000]/45">4</span>
                    </div>

                    <h3 className="font-serif text-2xl font-medium tracking-tight mb-2">
                      Reset your password
                    </h3>
                    <p className="text-sm text-[#211000]/55 font-medium mb-6">
                      Enter the email associated with your account and we'll
                      send you a verification code.
                    </p>

                    {forgotError && (
                      <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700 font-medium">
                        <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                      <Field
                        icon={<Mail className="size-4" />}
                        name="forgot-email"
                        type="email"
                        placeholder="Enter your email"
                        value={forgotEmail}
                        onChange={(e) => {
                          setForgotEmail(e.target.value);
                          setForgotError("");
                        }}
                      />

                      <button
                        type="submit"
                        disabled={forgotLoading || !forgotEmail}
                        className="w-full flex items-center justify-center gap-2 bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-[#B66B44]/20"
                      >
                        {forgotLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            Send code
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Step 2 */}
                {forgotStep === "code" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#5F7161]/10 flex items-center justify-center mb-5">
                      <ShieldCheck className="size-6 text-[#5F7161]" />
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                      <span>Step 2</span>
                      <span className="text-[#211000]/25">/</span>
                      <span className="text-[#211000]/45">4</span>
                    </div>

                    <h3 className="font-serif text-2xl font-medium tracking-tight mb-2">
                      Check your inbox
                    </h3>
                    <p className="text-sm text-[#211000]/55 font-medium mb-1">
                      We sent a 6-digit code to
                    </p>
                    <p className="text-sm font-bold text-[#211000] mb-6">
                      {forgotEmail}
                    </p>

                    <div className="mb-4 rounded-xl bg-[#E8CEB0]/40 border border-[#E8CEB0] px-3.5 py-2.5 text-xs text-[#211000]/70 font-mono">
                      🔑 Demo code: <strong>{generatedCode}</strong>
                    </div>

                    {forgotError && (
                      <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700 font-medium">
                        <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <form onSubmit={handleCodeVerify} className="space-y-4">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        value={forgotCode}
                        onChange={(e) => {
                          setForgotCode(
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          );
                          setForgotError("");
                        }}
                        className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3.5 text-sm font-bold tracking-[0.3em] text-center placeholder:tracking-normal placeholder:text-[#211000]/30 placeholder:font-medium focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                      />

                      <button
                        type="submit"
                        disabled={forgotLoading || forgotCode.length < 6}
                        className="w-full flex items-center justify-center gap-2 bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-[#B66B44]/20"
                      >
                        {forgotLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            Verify code
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <button
                      onClick={() => {
                        setForgotStep("email");
                        setForgotCode("");
                        setForgotError("");
                      }}
                      className="w-full text-center text-xs font-bold text-[#B66B44] hover:underline mt-4"
                    >
                      Use a different email
                    </button>
                  </motion.div>
                )}

                {/* Step 3 */}
                {forgotStep === "reset" && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#B66B44]/10 flex items-center justify-center mb-5">
                      <Lock className="size-6 text-[#B66B44]" />
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                      <span>Step 3</span>
                      <span className="text-[#211000]/25">/</span>
                      <span className="text-[#211000]/45">4</span>
                    </div>

                    <h3 className="font-serif text-2xl font-medium tracking-tight mb-2">
                      Create a new password
                    </h3>
                    <p className="text-sm text-[#211000]/55 font-medium mb-6">
                      Choose a secure new password for{" "}
                      <span className="font-bold text-[#211000]">
                        {forgotEmail}
                      </span>
                      .
                    </p>

                    {forgotError && (
                      <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700 font-medium">
                        <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#211000]/40">
                          <Lock className="size-4" />
                        </span>
                        <input
                          type={showResetPassword ? "text" : "password"}
                          placeholder="New password"
                          value={resetPassword}
                          onChange={(e) => {
                            setResetPassword(e.target.value);
                            setForgotError("");
                          }}
                          className="w-full rounded-xl bg-white border border-[#211000]/12 pl-11 pr-11 py-3.5 text-sm font-medium placeholder:text-[#211000]/40 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetPassword((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#211000]/40 hover:text-[#B66B44] transition-colors"
                        >
                          {showResetPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#211000]/40">
                          <Lock className="size-4" />
                        </span>
                        <input
                          type={showConfirmResetPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmResetPassword}
                          onChange={(e) => {
                            setConfirmResetPassword(e.target.value);
                            setForgotError("");
                          }}
                          className="w-full rounded-xl bg-white border border-[#211000]/12 pl-11 pr-11 py-3.5 text-sm font-medium placeholder:text-[#211000]/40 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmResetPassword((v) => !v)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#211000]/40 hover:text-[#B66B44] transition-colors"
                        >
                          {showConfirmResetPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-[#211000]/45 font-medium">
                        Use at least 6 characters.
                      </p>

                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="w-full flex items-center justify-center gap-2 bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-[#B66B44]/20"
                      >
                        {forgotLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            Update password
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Step 4 */}
                {forgotStep === "done" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        delay: 0.1,
                      }}
                      className="w-16 h-16 rounded-full bg-[#5F7161]/10 flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle2 className="size-8 text-[#5F7161]" />
                    </motion.div>

                    <div className="mb-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                      <span>Step 4</span>
                      <span className="text-[#211000]/25">/</span>
                      <span className="text-[#211000]/45">4</span>
                    </div>

                    <h3 className="font-serif text-2xl font-medium tracking-tight mb-2">
                      Password updated
                    </h3>
                    <p className="text-sm text-[#211000]/55 font-medium mb-6">
                      Your password has been successfully changed. You can now
                      sign in with your new password.
                    </p>

                    <button
                      onClick={handleForgotDone}
                      className="w-full bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-[#B66B44]/20"
                    >
                      Back to sign in
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Field({
  icon,
  ...props
}: {
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#211000]/40">
        {icon}
      </span>
      <input
        {...props}
        className="w-full rounded-xl bg-white border border-[#211000]/12 pl-11 pr-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/40 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
      />
    </div>
  );
}

function SocialButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-center gap-2.5 rounded-xl border border-[#211000]/12 bg-white hover:bg-[#E8CEB0]/30 py-3 text-sm font-bold transition-colors"
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="#211000">
      <path d="M17.05 12.04c-.03-2.5 2.04-3.7 2.13-3.76-1.16-1.7-2.97-1.93-3.61-1.96-1.54-.16-3 .9-3.78.9-.77 0-1.97-.88-3.24-.86-1.67.03-3.21.97-4.07 2.46-1.73 3-.44 7.45 1.25 9.89.82 1.19 1.8 2.53 3.08 2.48 1.24-.05 1.71-.8 3.21-.8 1.49 0 1.92.8 3.23.77 1.33-.02 2.18-1.21 3-2.41.94-1.38 1.33-2.72 1.35-2.79-.03-.01-2.6-1-2.62-3.97zM14.6 4.7c.68-.83 1.14-1.97 1.01-3.12-.98.04-2.17.65-2.88 1.47-.63.73-1.18 1.9-1.03 3.02 1.09.08 2.21-.55 2.9-1.37z" />
    </svg>
  );
}
