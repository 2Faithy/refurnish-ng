"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const ADMIN_SESSION_KEY = "refurnish_admin_session";

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid admin email or password.");
        return;
      }

      localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({
          email: data.admin.email,
          token: data.token,
          loggedInAt: new Date().toISOString(),
        })
      );

      router.push("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-7 sm:p-8"
        >
          <div className="size-14 rounded-2xl bg-[#B66B44]/10 flex items-center justify-center mb-6">
            <ShieldCheck className="size-7 text-[#B66B44]" />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
            Admin access
          </p>

          <h1 className="font-serif text-3xl font-medium tracking-tight mt-2">
            Sign in to Admin
          </h1>

          <p className="text-sm text-[#211000]/55 font-medium mt-2 mb-7">
            Manage payouts, listings, verification, disputes, orders and users.
          </p>

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
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/40" />
              <input
                type="email"
                placeholder="Admin email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 pl-11 pr-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Admin password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 pl-11 pr-11 py-3.5 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#211000]/40 hover:text-[#B66B44]"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-60 text-white py-4 text-sm font-bold transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

        </motion.div>
      </div>
    </main>
  );
}
