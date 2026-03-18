"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ── Inline SVG icons — no emoji, no external library ──────────

const IcGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const IcMail = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IcPhone = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.42 2 2 0 0 1 3.62 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0 5.45 5.45l1.06-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IcLock = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IcUser = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IcEyeOn = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IcEyeOff = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IcShield = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IcCheck = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IcArrow = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IcCheckCircle = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IcAlertCircle = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IcInfoCircle = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// Nigeria flag SVG (replaces emoji)
const IcNgFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 20 14"
    aria-label="Nigeria"
    role="img"
  >
    <rect width="20" height="14" fill="#fff" />
    <rect width="7" height="14" fill="#008751" />
    <rect x="13" width="7" height="14" fill="#008751" />
  </svg>
);

// Verified badge (replaces emoji on right panel card)
const IcVerifiedBadge = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ── Toast ──────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

const Toast = ({ message, type, visible }: ToastProps) => {
  if (!message) return null;
  const bg =
    type === "success"
      ? "bg-[#5F7161]"
      : type === "error"
      ? "bg-[#A50000]"
      : "bg-[#755210]";
  const Icon =
    type === "success"
      ? IcCheckCircle
      : type === "error"
      ? IcAlertCircle
      : IcInfoCircle;
  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold min-w-[300px] transition-all duration-500 ${bg} ${
        visible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      }`}
    >
      <Icon />
      {message}
    </div>
  );
};

// ── OTP boxes ─────────────────────────────────────────────────
const OtpInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const digits = value.padEnd(4, " ").split("").slice(0, 4);
  return (
    <div className="flex justify-center gap-3">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/, "");
            const arr = value.padEnd(4, " ").split("");
            arr[i] = val || " ";
            onChange(arr.join(""));
            if (val)
              (
                document.getElementById(`otp-${i + 1}`) as HTMLInputElement
              )?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !d.trim())
              (
                document.getElementById(`otp-${i - 1}`) as HTMLInputElement
              )?.focus();
          }}
          className="w-14 h-14 text-center text-xl font-bold text-[#2C1F0E] bg-white border-[1.5px] border-[#E5D5C0] rounded-xl outline-none focus:border-[#755210] focus:ring-2 focus:ring-[#755210]/10 transition-all"
        />
      ))}
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────
type Tab = "login" | "signup";
type Method = "email" | "phone";

export default function AuthPage() {
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("login");
  const [method, setMethod] = useState<Method>("email");
  const [step, setStep] = useState<1 | 2>(1);
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPw: "",
    otp: "",
  });

  const [toast, setToast] = useState({
    message: "",
    type: "info" as "success" | "error" | "info",
    visible: false,
  });
  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info") => {
      setToast({ message, type, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
      setTimeout(() => setToast((t) => ({ ...t, message: "" })), 4600);
    },
    []
  );

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const identifier = method === "email" ? form.email : form.phone;

  const pwStr =
    form.password.length === 0
      ? 0
      : form.password.length < 6
      ? 1
      : form.password.length < 10
      ? 2
      : 3;
  const pwColor = [
    "bg-[#E5D5C0]",
    "bg-red-400",
    "bg-orange-400",
    "bg-[#33B64B]",
  ][pwStr];

  const switchTab = (t: Tab) => {
    setTab(t);
    setStep(1);
    setMethod("email");
    setShowPw(false);
    setAgree(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPw: "",
      otp: "",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !form.password) {
      showToast("Email/Phone and Password are required.", "error");
      return;
    }
    try {
      const res = await fetch("/users.json");
      const users = await res.json();
      const user = users.find((u: any) =>
        method === "email"
          ? u.email === identifier && u.password === form.password
          : u.phone === identifier && u.password === form.password
      );
      if (user) {
        localStorage.setItem("current_user", JSON.stringify(user));
        showToast("Login successful! Welcome back.", "success");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        showToast("Invalid credentials. Please try again.", "error");
      }
    } catch {
      showToast("Could not connect. Please try again.", "error");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !identifier || !form.password) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    if (!agree) {
      showToast("Please agree to the terms to continue.", "error");
      return;
    }
    if (form.password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    if (form.password !== form.confirmPw) {
      showToast("Passwords do not match.", "error");
      return;
    }
    setStep(2);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.otp.trim().length < 4) {
      showToast("Please enter the 4-digit code.", "error");
      return;
    }
    showToast("Account created! Taking you to setup…", "success");
    setTimeout(() => router.push("/onboarding"), 1500);
  };

  // shared field style
  const inp =
    "w-full pl-10 pr-4 py-3.5 bg-white border-[1.5px] border-[#E5D5C0] rounded-xl text-[#2C1F0E] text-sm placeholder-[#8C7A6B] outline-none transition-all duration-200 focus:border-[#755210] focus:ring-2 focus:ring-[#755210]/10";

  const MethodToggle = () => (
    <div className="flex gap-2 mb-4">
      {(["email", "phone"] as Method[]).map((m) => (
        <button
          type="button"
          key={m}
          onClick={() => setMethod(m)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold border-[1.5px] transition-all ${
            method === m
              ? "border-[#755210] bg-[#755210]/5 text-[#755210]"
              : "border-[#E5D5C0] text-[#8C7A6B] hover:border-[#755210]/40"
          }`}
        >
          {m === "email" ? <IcMail /> : <IcPhone />}
          {m === "email" ? "Email" : "Phone"}
        </button>
      ))}
    </div>
  );

  return (
    // pt-16 = standard 64px navbar height — adjusts if your navbar is taller (try pt-20 for 80px)
    <div className="min-h-screen flex font-sans bg-[#FDF8F3] pt-26">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      {/* ══ LEFT — form ══════════════════════════════════════════ */}
      <div className="flex-1 flex items-start lg:items-center justify-center px-6 py-10 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Tab switcher — NO logo above it */}
          <div className="flex bg-[#FAF4EC] border border-[#E5D5C0] rounded-xl p-1 mb-7">
            {(["login", "signup"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? "bg-white text-[#755210] shadow-sm"
                    : "text-[#8C7A6B] hover:text-[#755210]"
                }`}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl font-semibold text-[#2C1F0E] mb-1.5">
            {tab === "login"
              ? "Welcome back"
              : step === 2
              ? "Verify your number"
              : "Let's get started"}
          </h1>
          <p className="text-sm text-[#8C7A6B] font-light mb-5 leading-relaxed">
            {tab === "login"
              ? "Sign in to your account to continue shopping."
              : step === 2
              ? `We sent a 4-digit code to ${identifier}. Enter it below.`
              : "Join thousands of Nigerians buying & selling furniture safely."}
          </p>

          {/* Escrow ribbon */}
          <div className="flex items-center gap-2.5 bg-[#5F7161]/10 border border-[#5F7161]/25 rounded-xl px-4 py-3 mb-6 text-[#5F7161]">
            <IcShield />
            <span className="text-xs font-medium leading-snug">
              Your money is protected until delivery is confirmed.
            </span>
          </div>

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => showToast("Google Sign-In coming soon.", "info")}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-white border-[1.5px] border-[#E5D5C0] rounded-xl text-sm font-medium text-[#2C1F0E] hover:border-[#755210] hover:shadow-sm transition-all"
              >
                <IcGoogle /> Continue with Google
              </button>

              <div className="flex items-center gap-3 text-xs text-[#8C7A6B]">
                <div className="flex-1 h-px bg-[#E5D5C0]" />
                or continue with
                <div className="flex-1 h-px bg-[#E5D5C0]" />
              </div>

              <MethodToggle />

              {/* Identifier */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#755210] pointer-events-none">
                  {method === "email" ? <IcMail /> : <IcPhone />}
                </span>
                <input
                  type={method === "email" ? "email" : "tel"}
                  placeholder={
                    method === "email" ? "Email address" : "Phone number"
                  }
                  value={identifier}
                  onChange={set(method === "email" ? "email" : "phone")}
                  autoComplete={method === "email" ? "email" : "tel"}
                  className={inp}
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#755210] pointer-events-none">
                  <IcLock />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={set("password")}
                  autoComplete="current-password"
                  className={`${inp} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#755210] transition-colors"
                >
                  {showPw ? <IcEyeOff /> : <IcEyeOn />}
                </button>
              </div>

              <div className="text-right -mt-1">
                <a
                  href="#"
                  className="text-xs font-medium text-[#755210] hover:text-[#5F7161] transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#755210] hover:bg-[#9A7235] text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Sign In <IcArrow />
              </button>

              <p className="text-center text-xs text-[#8C7A6B]">
                New to Fûrnit?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  className="text-[#755210] font-semibold underline underline-offset-2"
                >
                  Create account
                </button>
              </p>
            </form>
          )}

          {/* ── SIGNUP STEP 1 ── */}
          {tab === "signup" && step === 1 && (
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => showToast("Google Sign-Up coming soon.", "info")}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-white border-[1.5px] border-[#E5D5C0] rounded-xl text-sm font-medium text-[#2C1F0E] hover:border-[#755210] hover:shadow-sm transition-all"
              >
                <IcGoogle /> Continue with Google
              </button>

              <div className="flex items-center gap-3 text-xs text-[#8C7A6B]">
                <div className="flex-1 h-px bg-[#E5D5C0]" />
                or continue with
                <div className="flex-1 h-px bg-[#E5D5C0]" />
              </div>

              <MethodToggle />

              {/* Name */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#755210] pointer-events-none">
                  <IcUser />
                </span>
                <input
                  type="text"
                  placeholder="Full name e.g. Amara Okafor"
                  value={form.name}
                  onChange={set("name")}
                  autoComplete="name"
                  className={inp}
                  required
                />
              </div>

              {/* Identifier */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#755210] pointer-events-none">
                  {method === "email" ? <IcMail /> : <IcPhone />}
                </span>
                {method === "phone" && (
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-bold text-[#755210] pr-2.5 border-r border-[#E5D5C0] pointer-events-none">
                    <IcNgFlag /> +234
                  </span>
                )}
                <input
                  type={method === "email" ? "email" : "tel"}
                  placeholder={
                    method === "email" ? "Email address" : "0801 234 5678"
                  }
                  value={identifier}
                  onChange={set(method === "email" ? "email" : "phone")}
                  autoComplete={method === "email" ? "email" : "tel"}
                  className={method === "phone" ? `${inp} pl-28` : inp}
                  required
                />
              </div>

              {/* Password + strength */}
              <div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#755210] pointer-events-none">
                    <IcLock />
                  </span>
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={set("password")}
                    autoComplete="new-password"
                    className={`${inp} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#755210] transition-colors"
                  >
                    {showPw ? <IcEyeOff /> : <IcEyeOn />}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map((l) => (
                      <div
                        key={l}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                          l <= pwStr ? pwColor : "bg-[#E5D5C0]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#755210] pointer-events-none">
                  <IcLock />
                </span>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPw}
                  onChange={set("confirmPw")}
                  autoComplete="new-password"
                  className={`${inp} pr-10`}
                  required
                />
                {form.confirmPw && (
                  <span
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${
                      form.password === form.confirmPw
                        ? "text-[#33B64B]"
                        : "text-red-400"
                    }`}
                  >
                    <IcCheck />
                  </span>
                )}
              </div>

              {/* Terms */}
              <label
                htmlFor="terms-cb"
                className="flex items-start gap-2.5 cursor-pointer group"
              >
                <div
                  onClick={() => setAgree((v) => !v)}
                  className={`mt-0.5 w-[18px] h-[18px] min-w-[18px] rounded-md border-[1.5px] flex items-center justify-center transition-all ${
                    agree
                      ? "bg-[#755210] border-[#755210] text-white"
                      : "border-[#E5D5C0] bg-white group-hover:border-[#755210]/50"
                  }`}
                >
                  {agree && <IcCheck />}
                </div>
                <input
                  id="terms-cb"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs text-[#8C7A6B] leading-relaxed">
                  I agree to Refurnish's{" "}
                  <a
                    href="/terms"
                    className="text-[#755210] underline underline-offset-2 hover:text-[#5F7161]"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-[#755210] underline underline-offset-2 hover:text-[#5F7161]"
                  >
                    Privacy Policy
                  </a>
                  . My payments are escrow-protected.
                </span>
              </label>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#755210] hover:bg-[#9A7235] text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Create Account <IcArrow />
              </button>

              <p className="text-center text-xs text-[#8C7A6B]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-[#755210] font-semibold underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* ── SIGNUP STEP 2 — OTP ── */}
          {tab === "signup" && step === 2 && (
            <form onSubmit={handleVerify} className="flex flex-col gap-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-[#755210] flex items-center justify-center text-white">
                  <IcCheck />
                </div>
                <div className="flex-1 h-px bg-[#755210]" />
                <div className="w-7 h-7 rounded-full bg-[#F4E8D8] border-2 border-[#755210] flex items-center justify-center text-xs font-bold text-[#755210]">
                  2
                </div>
              </div>

              <p className="text-xs text-[#8C7A6B] text-center leading-relaxed -mt-1">
                Enter the 4-digit code sent to{" "}
                <span className="font-semibold text-[#2C1F0E]">
                  {identifier}
                </span>
              </p>

              <div className="flex justify-center py-2">
                <OtpInput
                  value={form.otp}
                  onChange={(v) => setForm((f) => ({ ...f, otp: v }))}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#755210] hover:bg-[#9A7235] text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Verify & Continue <IcArrow />
              </button>

              <div className="flex items-center justify-between text-xs text-[#8C7A6B]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="underline underline-offset-2 hover:text-[#755210]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => showToast("Code resent!", "info")}
                  className="text-[#755210] font-medium underline underline-offset-2"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ══ RIGHT — decorative panel ═════════════════════════════ */}
      <div className="hidden lg:flex flex-1 relative bg-[#755210]">
        <Image
          src="/hero1.jpg"
          alt="Furniture lifestyle"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1A07]/55 via-[#755210]/30 to-[#0F0701]/90" />

        <div className="relative z-10 flex flex-col justify-between h-full p-14">
          {/* Logo — only here, not on the form side */}
          <Image
            src="/logo.png"
            alt="Logo"
            width={130}
            height={44}
            className="object-contain brightness-0 invert"
          />

          <div>
            <h2 className="font-serif text-5xl font-normal text-white leading-snug mb-4">
              Nigeria's most
              <br />
              <em className="text-[#E8CEB0]">trusted</em> furniture
              <br />
              marketplace.
            </h2>
            <p className="text-white/60 text-sm font-light leading-relaxed max-w-xs">
              Buy and sell pre-loved furniture with complete confidence — every
              transaction escrow-protected, every seller verified.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Product card */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#E8CEB0]">
                <Image
                  src="/stylish-sofa.png"
                  alt="Sofa"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white/45 text-[10px] uppercase tracking-widest mb-0.5">
                  Just listed · Lekki, Lagos
                </p>
                <p className="font-serif text-white text-sm mb-0.5">
                  Stylish Sofa Set
                </p>
                <p className="text-[#E8CEB0] font-semibold text-sm">₦185,000</p>
              </div>
              <span className="ml-auto self-start flex items-center gap-1 bg-[#33B64B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                <IcVerifiedBadge /> Verified
              </span>
            </div>

            {/* Trust pills */}
            <div className="flex gap-2 flex-wrap">
              {["Escrow protected", "Verified sellers", "5,000+ listings"].map(
                (t) => (
                  <div
                    key={t}
                    className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-white/75 text-xs"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#33B64B] flex-shrink-0" />
                    {t}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
