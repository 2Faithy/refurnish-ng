"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Landmark,
  Loader2,
  Plus,
  Receipt,
  ShieldAlert,
  X,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const PLATFORM_FEE_PERCENT = 24;

const BANKS = [
  "Access Bank", "GTBank", "Zenith Bank", "First Bank", "UBA", "Fidelity Bank",
  "Stanbic IBTC", "Sterling Bank", "Union Bank", "Wema Bank", "Opay", "PalmPay",
  "Kuda", "Moniepoint",
];

function getToken() {
  try {
    return JSON.parse(localStorage.getItem("refurnish_user") || "null")?.token || "";
  } catch {
    return "";
  }
}

export default function PaymentsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [issueTarget, setIssueTarget] = useState<any | null>(null);
  const [toast, setToast] = useState("");

  const authedFetch = (path: string, options: RequestInit = {}) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${getToken()}`,
      },
    });

  const fetchAll = async () => {
    try {
      const [profileRes, payoutsRes] = await Promise.all([
        authedFetch("/api/users/me"),
        authedFetch("/api/payouts/mine"),
      ]);
      const profileData = await profileRes.json();
      const payoutsData = await payoutsRes.json();

      if (!profileRes.ok) {
        setError(profileData.message || "Couldn't load your account.");
        return;
      }
      setProfile(profileData.user);
      setPayouts(payoutsData.payouts || []);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const saveBankDetails = async (details: { bankName: string; accountNumber: string; accountName: string }) => {
    const res = await authedFetch("/api/users/me/bank-details", {
      method: "PATCH",
      body: JSON.stringify(details),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Couldn't save bank details.");
    }
    setProfile(data.user);
    setBankModalOpen(false);
    setToast("Bank details saved");
  };

  const hasBankDetails = !!(profile?.bankName && profile?.accountNumber);

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/55 hover:text-[#B66B44] transition-colors mb-5"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">Seller payments</p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mt-1">
          Payments & payouts
        </h1>
        <p className="text-sm text-[#211000]/55 font-medium mt-2 max-w-2xl">
          Flat {PLATFORM_FEE_PERCENT}% on the item price. This is deducted from your payout when the item sells.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 flex items-start gap-3">
          <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      ) : loading ? (
        <div className="py-24 flex justify-center">
          <Loader2 className="size-8 animate-spin text-[#B66B44]" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bank account */}
          <div className="rounded-2xl bg-white border border-[#211000]/8 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-serif text-xl font-medium">Payout account</h2>
                <p className="text-xs text-[#211000]/55 font-medium mt-1">
                  The Nigerian bank account where your payouts will be sent.
                </p>
              </div>
              <button
                onClick={() => setBankModalOpen(true)}
                className="size-10 rounded-full bg-[#B66B44] text-white grid place-items-center hover:bg-[#a05934] transition-colors shrink-0"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {hasBankDetails ? (
              <div className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-4">
                <div className="flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-[#5F7161]/10 text-[#5F7161] flex items-center justify-center shrink-0">
                    <Landmark className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{profile.bankName}</p>
                    <p className="text-xs text-[#211000]/55 font-medium mt-0.5">{profile.accountName}</p>
                    <p className="text-xs font-mono font-bold mt-1">{profile.accountNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setBankModalOpen(true)}
                  className="mt-4 w-full rounded-full border border-[#211000]/10 py-2.5 text-xs font-bold hover:border-[#B66B44]/40 transition-colors"
                >
                  Update details
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#E8CEB0]/25 border border-[#E8CEB0] p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-[#B66B44] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#211000]/65 font-medium leading-relaxed">
                    Add your bank account so we can pay you when an item sells.
                  </p>
                </div>
                <button
                  onClick={() => setBankModalOpen(true)}
                  className="mt-4 w-full rounded-full bg-[#211000] text-[#FAF4EC] py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#211000]/90 transition-colors"
                >
                  Add bank account
                </button>
              </div>
            )}
          </div>

          {/* Payouts */}
          <div className="rounded-2xl bg-white border border-[#211000]/8 overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-[#211000]/8">
              <h2 className="font-serif text-xl font-medium">Your payouts</h2>
              <p className="text-xs text-[#211000]/55 font-medium mt-0.5">
                Created automatically once a buyer confirms they've received your item.
              </p>
            </div>

            {payouts.length === 0 ? (
              <div className="py-14 px-5 text-center">
                <div className="size-14 rounded-full bg-[#E8CEB0]/35 flex items-center justify-center mx-auto mb-4">
                  <Receipt className="size-7 text-[#B66B44]" />
                </div>
                <p className="font-serif text-xl font-medium">No payouts yet</p>
                <p className="text-sm text-[#211000]/55 font-medium mt-1 max-w-sm mx-auto">
                  When a buyer confirms receipt of your item, a payout will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#211000]/6">
                {payouts.map((payout) => (
                  <PayoutRow key={payout.id} payout={payout} onReportIssue={() => setIssueTarget(payout)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {bankModalOpen && (
          <BankAccountModal
            existing={profile}
            onClose={() => setBankModalOpen(false)}
            onSave={saveBankDetails}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {issueTarget && (
          <ReportIssueModal
            payout={issueTarget}
            onClose={() => setIssueTarget(null)}
            onSubmit={async (description) => {
              try {
                const res = await authedFetch(`/api/payouts/${issueTarget.id}/report`, {
                  method: "POST",
                  body: JSON.stringify({ description }),
                });
                const data = await res.json();
                if (!res.ok) {
                  setToast(data.message || "Couldn't submit report.");
                  return;
                }
                setPayouts((prev) => prev.map((p) => (p.id === issueTarget.id ? data.payout : p)));
                setToast("Issue reported — our team will follow up.");
              } catch (err) {
                console.error(err);
                setToast("Couldn't reach the server. Please try again.");
              } finally {
                setIssueTarget(null);
              }
            }}
          />
        )}
      </AnimatePresence>

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
    </div>
  );
}

function PayoutRow({ payout, onReportIssue }: { payout: any; onReportIssue: () => void }) {
  const isPaid = payout.status === "paid";

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold">{payout.itemTitle}</p>
          <p className="text-[11px] text-[#211000]/55 font-medium mt-1">
            Gross {formatNaira(Number(payout.grossAmount))} · {payout.feePercent}% fee (
            {formatNaira(Number(payout.feeAmount))})
          </p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
            isPaid ? "bg-[#5F7161]/10 text-[#5F7161]" : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {isPaid ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
          {isPaid ? "Paid" : "Pending"}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-lg font-bold text-[#5F7161]">{formatNaira(Number(payout.netAmount))}</p>
        <div className="flex items-center gap-2">
          {isPaid && payout.receiptUrl && (
            
              <a href={payout.receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#211000]/10 px-3 py-2 text-xs font-bold hover:border-[#B66B44]/40 transition-colors"
            >
              <Receipt className="size-3.5" />
              View receipt
            </a>
          )}
          {isPaid && !payout.issueReported && (
            <button
              onClick={onReportIssue}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-200 text-red-500 px-3 py-2 text-xs font-bold hover:bg-red-50 transition-colors"
            >
              <ShieldAlert className="size-3.5" />
              Report an issue
            </button>
          )}
          {payout.issueReported && (
            <span className="text-[11px] font-bold text-red-500">
              {payout.issueStatus === "resolved" ? "Issue resolved" : "Issue reported"}
            </span>
          )}
        </div>
      </div>

      {payout.paidAt && (
        <p className="text-[10px] text-[#211000]/40 font-medium mt-2">
          Paid {new Date(payout.paidAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function BankAccountModal({
  existing,
  onClose,
  onSave,
}: {
  existing: any | null;
  onClose: () => void;
  onSave: (details: { bankName: string; accountNumber: string; accountName: string }) => Promise<void>;
}) {
  const [bankName, setBankName] = useState(existing?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(existing?.accountNumber || "");
  const [accountName, setAccountName] = useState(existing?.accountName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!bankName || !accountNumber || !accountName) {
      setError("Please fill all fields.");
      return;
    }
    if (!/^\d{10}$/.test(accountNumber)) {
      setError("Account number must be 10 digits.");
      return;
    }
    setLoading(true);
    try {
      await onSave({ bankName, accountNumber, accountName });
    } catch (err: any) {
      setError(err.message || "Couldn't save bank details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="text-center mb-6">
        <div className="size-14 rounded-full bg-[#B66B44]/10 text-[#B66B44] grid place-items-center mx-auto mb-4">
          <Landmark className="size-7" />
        </div>
        <h2 className="font-serif text-2xl font-medium">{existing?.bankName ? "Update payout account" : "Add payout account"}</h2>
        <p className="text-sm text-[#211000]/55 font-medium mt-1">This account will receive your payouts.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-red-700 font-medium">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/55 block mb-2">Bank</label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/8 px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#B66B44]"
          >
            <option value="">Select bank</option>
            {BANKS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <ModalField
          label="Account number"
          value={accountNumber}
          onChange={(v) => setAccountNumber(v.replace(/\D/g, "").slice(0, 10))}
          placeholder="0123456789"
        />
        <ModalField label="Account name" value={accountName} onChange={setAccountName} placeholder="Your account name" />
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="rounded-full border border-[#211000]/8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#B66B44]/10 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-60 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save account"
          )}
        </button>
      </div>
    </Modal>
  );
}

function ReportIssueModal({
  payout,
  onClose,
  onSubmit,
}: {
  payout: any;
  onClose: () => void;
  onSubmit: (description: string) => void;
}) {
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <Modal onClose={onClose}>
      <div className="text-center mb-6">
        <div className="size-14 rounded-full bg-red-50 text-red-500 grid place-items-center mx-auto mb-4">
          <ShieldAlert className="size-7" />
        </div>
        <h2 className="font-serif text-2xl font-medium">Report a payout issue</h2>
        <p className="text-sm text-[#211000]/55 font-medium mt-1">{payout.itemTitle}</p>
      </div>

      <textarea
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Tell us what's wrong — e.g. wrong amount, never received the transfer..."
        className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all resize-none"
      />
      <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">{description.length} characters (minimum 10)</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={onClose}
          className="rounded-full border border-[#211000]/8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#B66B44]/10 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            setSubmitting(true);
            await onSubmit(description.trim());
            setSubmitting(false);
          }}
          disabled={description.trim().length < 10 || submitting}
          className="rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          {submitting ? "Submitting…" : "Submit report"}
        </button>
      </div>
    </Modal>
  );
}

function ModalField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/55 block mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/8 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all"
      />
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-0 sm:px-4 bg-[#211000]/45 backdrop-blur-sm"
    >
      <button className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full sm:max-w-md bg-[#FAF4EC] text-[#211000] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#211000]/8 p-6 sm:p-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 size-9 rounded-full hover:bg-[#B66B44]/10 grid place-items-center">
          <X className="size-4 text-[#211000]/55" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}