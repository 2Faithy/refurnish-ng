"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Info,
  Landmark,
  Loader2,
  Lock,
  Plus,
  ShieldCheck,
  Trash2,
  Wallet,
  X,
  AlertCircle,
  Copy,
  RefreshCcw,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const ORDERS_KEY = "refurnish_orders";
const BANK_KEY = "refurnish_seller_bank_account";
const PAYOUTS_KEY = "refurnish_seller_payouts";

const PLATFORM_FEE_PERCENT = 5;

const BANKS = [
  "Access Bank",
  "GTBank",
  "Zenith Bank",
  "First Bank",
  "UBA",
  "Fidelity Bank",
  "Stanbic IBTC",
  "Sterling Bank",
  "Union Bank",
  "Wema Bank",
  "Opay",
  "PalmPay",
  "Kuda",
  "Moniepoint",
];

function makePayoutId() {
  return `RF-PAYOUT-${Date.now().toString(36).toUpperCase()}`;
}

function getOrderSubtotal(order: any) {
  if (typeof order.subtotal === "number") return order.subtotal;

  return (order.items || []).reduce((sum: number, item: any) => {
    return sum + Number(item.price || 0);
  }, 0);
}

export default function PaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [bankAccount, setBankAccount] = useState<any | null>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem(ORDERS_KEY);
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedBank = localStorage.getItem(BANK_KEY);
      if (storedBank) setBankAccount(JSON.parse(storedBank));

      const storedPayouts = localStorage.getItem(PAYOUTS_KEY);
      if (storedPayouts) setPayouts(JSON.parse(storedPayouts));
    } catch {}
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const paymentSummary = useMemo(() => {
    const completedOrders = orders.filter(
      (order) =>
        order.escrowStatus === "released" || order.status === "completed"
    );

    const escrowOrders = orders.filter(
      (order) =>
        order.escrowStatus === "funds_held" ||
        order.status === "escrow_active"
    );

    const pendingVerificationOrders = orders.filter(
      (order) =>
        order.escrowStatus === "awaiting_verification" ||
        order.status === "pending_payment_confirmation"
    );

    const grossReleased = completedOrders.reduce((sum, order) => {
      return sum + getOrderSubtotal(order);
    }, 0);

    const grossInEscrow = escrowOrders.reduce((sum, order) => {
      return sum + getOrderSubtotal(order);
    }, 0);

    const pendingVerification = pendingVerificationOrders.reduce(
      (sum, order) => sum + getOrderSubtotal(order),
      0
    );

    const platformFee = Math.round((grossReleased * PLATFORM_FEE_PERCENT) / 100);

    const totalPayoutRequested = payouts
      .filter((p) => ["pending", "processing"].includes(p.status))
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0);

    const totalPaidOut = payouts
      .filter((p) => p.status === "paid")
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0);

    const availableBalance = Math.max(
      grossReleased - platformFee - totalPayoutRequested - totalPaidOut,
      0
    );

    return {
      completedOrders,
      escrowOrders,
      grossReleased,
      grossInEscrow,
      pendingVerification,
      platformFee,
      availableBalance,
      totalPayoutRequested,
      totalPaidOut,
    };
  }, [orders, payouts]);

  const saveBankAccount = (account: any) => {
    setBankAccount(account);
    localStorage.setItem(BANK_KEY, JSON.stringify(account));
    setToast("Bank account saved");
    setBankModalOpen(false);
  };

  const requestPayout = async (amount: number) => {
    if (!bankAccount) {
      setToast("Add a bank account first");
      return;
    }

    if (amount <= 0 || amount > paymentSummary.availableBalance) {
      setToast("Invalid payout amount");
      return;
    }

    const payout = {
      id: makePayoutId(),
      amount,
      bankName: bankAccount.bankName,
      accountNumber: bankAccount.accountNumber,
      accountName: bankAccount.accountName,
      status: "pending",
      createdAt: new Date().toISOString(),
      estimatedArrival: "1-2 business days",
    };

    const next = [payout, ...payouts];
    setPayouts(next);
    localStorage.setItem(PAYOUTS_KEY, JSON.stringify(next));

    setPayoutModalOpen(false);
    setToast("Payout request submitted");
  };

  const removeBankAccount = () => {
    setBankAccount(null);
    localStorage.removeItem(BANK_KEY);
    setToast("Bank account removed");
  };

  const displayMoney = (amount: number) =>
    hideBalance ? "₦••••••" : formatNaira(amount);

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#FAF4EC)] text-[var(--text-primary,#211000)] px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-muted,rgba(33,16,0,0.55))] hover:text-[#B66B44] transition-colors mb-5"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              Seller payments
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mt-1">
              Payments & payouts
            </h1>
            <p className="text-sm text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-2 max-w-2xl">
              Track money held in escrow, view released funds, and request
              payouts to your bank account.
            </p>
          </div>

          <button
            onClick={() => setPayoutModalOpen(true)}
            disabled={!bankAccount || paymentSummary.availableBalance <= 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Wallet className="size-4" />
            Request payout
          </button>
        </div>
      </div>

      {/* Important escrow note */}
      <div className="mb-6 rounded-2xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 flex items-start gap-3">
        <ShieldCheck className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.65))] leading-relaxed font-medium">
          <strong className="text-[var(--text-primary,#211000)]">
            Payouts are only available after escrow is released.
          </strong>{" "}
          Buyer funds remain held until delivery or pickup is confirmed, or
          until the protection window closes with no dispute.
        </p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <BalanceCard
          title="Available balance"
          value={displayMoney(paymentSummary.availableBalance)}
          icon={<Wallet className="size-5" />}
          accent="#5F7161"
          action={
            <button
              onClick={() => setHideBalance((v) => !v)}
              className="size-8 rounded-full hover:bg-[#211000]/5 grid place-items-center"
            >
              {hideBalance ? (
                <Eye className="size-4 text-[var(--text-muted,rgba(33,16,0,0.45))]" />
              ) : (
                <EyeOff className="size-4 text-[var(--text-muted,rgba(33,16,0,0.45))]" />
              )}
            </button>
          }
        />

        <BalanceCard
          title="Held in escrow"
          value={displayMoney(paymentSummary.grossInEscrow)}
          icon={<ShieldCheck className="size-5" />}
          accent="#B66B44"
        />

        <BalanceCard
          title="Pending verification"
          value={displayMoney(paymentSummary.pendingVerification)}
          icon={<Clock className="size-5" />}
          accent="#ca8a04"
        />

        <BalanceCard
          title="Paid out"
          value={displayMoney(paymentSummary.totalPaidOut)}
          icon={<CheckCircle2 className="size-5" />}
          accent="#211000"
        />
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left */}
        <div className="lg:col-span-7 space-y-6">
          {/* Earnings breakdown */}
          <div className="rounded-2xl bg-[var(--card-bg,#fff)] border border-[var(--border,rgba(33,16,0,0.08))] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-serif text-xl font-medium">
                  Earnings breakdown
                </h2>
                <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-1">
                  Released funds are calculated after platform fees.
                </p>
              </div>

              <button
                onClick={() => setToast("Statement download coming soon")}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[var(--border,rgba(33,16,0,0.08))] px-4 py-2 text-xs font-bold hover:border-[#B66B44]/40 transition-colors"
              >
                <Download className="size-3.5" />
                Statement
              </button>
            </div>

            <div className="space-y-3">
              <SummaryRow
                label="Gross released earnings"
                value={displayMoney(paymentSummary.grossReleased)}
              />
              <SummaryRow
                label={`Platform fee (${PLATFORM_FEE_PERCENT}%)`}
                value={`- ${displayMoney(paymentSummary.platformFee)}`}
              />
              <SummaryRow
                label="Payouts pending"
                value={`- ${displayMoney(paymentSummary.totalPayoutRequested)}`}
              />
              <SummaryRow
                label="Already paid out"
                value={`- ${displayMoney(paymentSummary.totalPaidOut)}`}
              />

              <div className="border-t border-[var(--border,rgba(33,16,0,0.08))] pt-4 flex items-center justify-between">
                <span className="font-serif text-lg font-medium">
                  Available to withdraw
                </span>
                <span className="text-2xl font-bold text-[#5F7161]">
                  {displayMoney(paymentSummary.availableBalance)}
                </span>
              </div>
            </div>
          </div>

          {/* Released orders */}
          <div className="rounded-2xl bg-[var(--card-bg,#fff)] border border-[var(--border,rgba(33,16,0,0.08))] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-[var(--border,rgba(33,16,0,0.08))] flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-medium">
                  Released escrow orders
                </h2>
                <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-0.5">
                  Orders that have completed and are eligible for payout.
                </p>
              </div>
            </div>

            {paymentSummary.completedOrders.length === 0 ? (
              <EmptyState
                icon={<ShieldCheck className="size-7 text-[#B66B44]" />}
                title="No released funds yet"
                text="Completed orders will appear here when escrow is released."
              />
            ) : (
              <div className="divide-y divide-[var(--border,rgba(33,16,0,0.08))]">
                {paymentSummary.completedOrders.map((order) => (
                  <OrderPaymentRow key={order.id} order={order} released />
                ))}
              </div>
            )}
          </div>

          {/* Escrow orders */}
          <div className="rounded-2xl bg-[var(--card-bg,#fff)] border border-[var(--border,rgba(33,16,0,0.08))] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-[var(--border,rgba(33,16,0,0.08))]">
              <h2 className="font-serif text-xl font-medium">
                Funds still in escrow
              </h2>
              <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-0.5">
                These funds are not withdrawable yet.
              </p>
            </div>

            {paymentSummary.escrowOrders.length === 0 ? (
              <EmptyState
                icon={<Lock className="size-7 text-[#B66B44]" />}
                title="No escrow funds"
                text="When buyers pay for your items, funds held in escrow will appear here."
              />
            ) : (
              <div className="divide-y divide-[var(--border,rgba(33,16,0,0.08))]">
                {paymentSummary.escrowOrders.map((order) => (
                  <OrderPaymentRow key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-5 space-y-6">
          {/* Bank account */}
          <div className="rounded-2xl bg-[var(--card-bg,#fff)] border border-[var(--border,rgba(33,16,0,0.08))] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="font-serif text-xl font-medium">
                  Payout account
                </h2>
                <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-1">
                  Add the Nigerian bank account where seller payouts should be sent.
                </p>
              </div>

              <button
                onClick={() => setBankModalOpen(true)}
                className="size-10 rounded-full bg-[#B66B44] text-white grid place-items-center hover:bg-[#a05934] transition-colors"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {bankAccount ? (
              <div className="rounded-2xl bg-[var(--bg-primary,#FAF4EC)] border border-[var(--border,rgba(33,16,0,0.08))] p-4">
                <div className="flex items-start gap-3">
                  <div className="size-11 rounded-xl bg-[#5F7161]/10 text-[#5F7161] flex items-center justify-center shrink-0">
                    <Landmark className="size-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold">{bankAccount.bankName}</p>
                    <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-0.5">
                      {bankAccount.accountName}
                    </p>
                    <p className="text-xs font-mono font-bold mt-1">
                      {bankAccount.accountNumber}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setBankModalOpen(true)}
                    className="flex-1 rounded-full border border-[var(--border,rgba(33,16,0,0.08))] py-2.5 text-xs font-bold hover:border-[#B66B44]/40 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={removeBankAccount}
                    className="flex-1 rounded-full border border-red-200 text-red-500 py-2.5 text-xs font-bold hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#E8CEB0]/25 border border-[#E8CEB0] p-4">
                <div className="flex items-start gap-3">
                  <Info className="size-5 text-[#B66B44] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.65))] font-medium leading-relaxed">
                    You need to add a payout account before requesting seller
                    withdrawals.
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

          {/* Payout history */}
          <div className="rounded-2xl bg-[var(--card-bg,#fff)] border border-[var(--border,rgba(33,16,0,0.08))] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-[var(--border,rgba(33,16,0,0.08))]">
              <h2 className="font-serif text-xl font-medium">
                Payout history
              </h2>
              <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-0.5">
                Manual payout requests and bank transfers.
              </p>
            </div>

            {payouts.length === 0 ? (
              <EmptyState
                icon={<Wallet className="size-7 text-[#B66B44]" />}
                title="No payouts yet"
                text="Your payout requests will appear here."
              />
            ) : (
              <div className="divide-y divide-[var(--border,rgba(33,16,0,0.08))]">
                {payouts.map((payout) => (
                  <PayoutRow key={payout.id} payout={payout} />
                ))}
              </div>
            )}
          </div>

          {/* Manual payout note */}
          <div className="rounded-2xl bg-[#211000] text-[#FAF4EC] p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCcw className="size-5 text-[#E8CEB0]" />
              <h3 className="font-serif text-xl font-medium">
                Manual payout flow
              </h3>
            </div>

            <p className="text-xs text-[#FAF4EC]/65 font-medium leading-relaxed">
              Since you are not using a third-party payment processor yet,
              payout requests should be reviewed by an admin. Once approved,
              your team transfers the money to the seller’s bank account and
              marks the payout as paid.
            </p>
          </div>
        </div>
      </div>

      {/* Bank modal */}
      <AnimatePresence>
        {bankModalOpen && (
          <BankAccountModal
            existing={bankAccount}
            onClose={() => setBankModalOpen(false)}
            onSave={saveBankAccount}
          />
        )}
      </AnimatePresence>

      {/* Payout modal */}
      <AnimatePresence>
        {payoutModalOpen && (
          <PayoutModal
            available={paymentSummary.availableBalance}
            bankAccount={bankAccount}
            onClose={() => setPayoutModalOpen(false)}
            onSubmit={requestPayout}
          />
        )}
      </AnimatePresence>

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
    </div>
  );
}

/* ---------------- Components ---------------- */

function BalanceCard({
  title,
  value,
  icon,
  accent,
  action,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[var(--card-bg,#fff)] border border-[var(--border,rgba(33,16,0,0.08))] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className="size-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {icon}
        </div>
        {action}
      </div>

      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-0.5">
        {title}
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium">
        {label}
      </span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function OrderPaymentRow({
  order,
  released = false,
}: {
  order: any;
  released?: boolean;
}) {
  const amount = getOrderSubtotal(order);

  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="flex items-center gap-4 p-4 sm:p-5 hover:bg-[#B66B44]/5 transition-colors group"
    >
      <div className="size-14 rounded-xl overflow-hidden bg-[#E8CEB0]/30 shrink-0">
        {order.items?.[0]?.image ? (
          <img
            src={order.items[0].image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <Banknote className="size-5 text-[#211000]/30" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">
          {order.items?.[0]?.title || "Order"}
        </p>
        <p className="text-[11px] text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-0.5">
          {order.id} · {order.createdAt?.split("T")[0]}
        </p>

        <span
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            released
              ? "bg-[#5F7161]/10 text-[#5F7161]"
              : "bg-[#B66B44]/10 text-[#B66B44]"
          }`}
        >
          {released ? (
            <CheckCircle2 className="size-3" />
          ) : (
            <ShieldCheck className="size-3" />
          )}
          {released ? "Released" : "Held in escrow"}
        </span>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-bold">{formatNaira(amount)}</p>
        <p className="text-[10px] text-[var(--text-muted,rgba(33,16,0,0.45))] font-medium">
          Gross
        </p>
      </div>
    </Link>
  );
}

function PayoutRow({ payout }: { payout: any }) {
  const statusStyle =
    payout.status === "paid"
      ? "bg-[#5F7161]/10 text-[#5F7161]"
      : payout.status === "processing"
      ? "bg-[#B66B44]/10 text-[#B66B44]"
      : "bg-yellow-50 text-yellow-700";

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold">{formatNaira(payout.amount)}</p>
          <p className="text-[11px] text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-0.5">
            {payout.bankName} · {payout.accountNumber}
          </p>
          <p className="text-[10px] text-[var(--text-muted,rgba(33,16,0,0.45))] font-mono mt-1">
            {payout.id}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${statusStyle}`}
        >
          {payout.status}
        </span>
      </div>

      <p className="text-[11px] text-[var(--text-muted,rgba(33,16,0,0.45))] font-medium mt-3">
        Requested {new Date(payout.createdAt).toLocaleDateString()} · ETA{" "}
        {payout.estimatedArrival}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="py-12 px-5 text-center">
      <div className="size-14 rounded-full bg-[#E8CEB0]/35 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <p className="font-serif text-xl font-medium">{title}</p>
      <p className="text-sm text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-1 max-w-sm mx-auto">
        {text}
      </p>
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
  onSave: (account: any) => void;
}) {
  const [bankName, setBankName] = useState(existing?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(
    existing?.accountNumber || ""
  );
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
    await new Promise((r) => setTimeout(r, 800));

    onSave({
      bankName,
      accountNumber,
      accountName,
      updatedAt: new Date().toISOString(),
    });

    setLoading(false);
  };

  return (
    <Modal onClose={onClose}>
      <div>
        <div className="text-center mb-6">
          <div className="size-14 rounded-full bg-[#B66B44]/10 text-[#B66B44] grid place-items-center mx-auto mb-4">
            <Landmark className="size-7" />
          </div>

          <h2 className="font-serif text-2xl font-medium">
            {existing ? "Update payout account" : "Add payout account"}
          </h2>
          <p className="text-sm text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-1">
            This account will receive released escrow funds.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-red-700 font-medium">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted,rgba(33,16,0,0.55))] block mb-2">
              Bank
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full rounded-xl bg-[var(--input-bg,#FAF4EC)] border border-[var(--border,rgba(33,16,0,0.08))] px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#B66B44]"
            >
              <option value="">Select bank</option>
              {BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="Account number"
            value={accountNumber}
            onChange={(v: string) =>
              setAccountNumber(v.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="0123456789"
          />

          <Field
            label="Account name"
            value={accountName}
            onChange={setAccountName}
            placeholder="Your account name"
          />
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-[var(--border,rgba(33,16,0,0.08))] py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#B66B44]/10 transition-colors"
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
      </div>
    </Modal>
  );
}

function PayoutModal({
  available,
  bankAccount,
  onClose,
  onSubmit,
}: {
  available: number;
  bankAccount: any | null;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}) {
  const [amount, setAmount] = useState(String(available || ""));
  const [loading, setLoading] = useState(false);
  const numericAmount = Number(amount || 0);

  const submit = async () => {
    if (!bankAccount) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(numericAmount);
    setLoading(false);
  };

  return (
    <Modal onClose={onClose}>
      <div>
        <div className="text-center mb-6">
          <div className="size-14 rounded-full bg-[#5F7161]/10 text-[#5F7161] grid place-items-center mx-auto mb-4">
            <Wallet className="size-7" />
          </div>

          <h2 className="font-serif text-2xl font-medium">
            Request payout
          </h2>
          <p className="text-sm text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-1">
            Withdraw released escrow funds to your bank account.
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--bg-primary,#FAF4EC)] border border-[var(--border,rgba(33,16,0,0.08))] p-4 mb-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted,rgba(33,16,0,0.55))]">
            Available balance
          </p>
          <p className="text-2xl font-bold text-[#5F7161] mt-1">
            {formatNaira(available)}
          </p>
        </div>

        {bankAccount && (
          <div className="rounded-2xl bg-white/60 border border-[var(--border,rgba(33,16,0,0.08))] p-4 mb-5">
            <p className="text-xs font-bold">{bankAccount.bankName}</p>
            <p className="text-xs text-[var(--text-muted,rgba(33,16,0,0.55))] font-medium mt-0.5">
              {bankAccount.accountName} · {bankAccount.accountNumber}
            </p>
          </div>
        )}

        <Field
          label="Payout amount"
          value={amount}
          onChange={(v: string) => setAmount(v.replace(/\D/g, ""))}
          placeholder="0"
          prefix="₦"
        />

        {numericAmount > available && (
          <p className="mt-2 text-xs font-bold text-red-500">
            Amount exceeds your available balance.
          </p>
        )}

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="rounded-full border border-[var(--border,rgba(33,16,0,0.08))] py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#B66B44]/10 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={
              loading ||
              !bankAccount ||
              numericAmount <= 0 ||
              numericAmount > available
            }
            className="rounded-full bg-[#5F7161] hover:bg-[#4d5e50] disabled:opacity-50 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </span>
            ) : (
              "Submit request"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted,rgba(33,16,0,0.55))] block mb-2">
        {label}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-muted,rgba(33,16,0,0.55))]">
            {prefix}
          </span>
        )}

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl bg-[var(--input-bg,#FAF4EC)] border border-[var(--border,rgba(33,16,0,0.08))] ${
            prefix ? "pl-9" : "pl-4"
          } pr-4 py-3.5 text-sm font-medium placeholder:text-[var(--text-muted,rgba(33,16,0,0.35))] focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all`}
        />
      </div>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
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
        className="relative w-full sm:max-w-md bg-[var(--bg-primary,#FAF4EC)] text-[var(--text-primary,#211000)] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[var(--border,rgba(33,16,0,0.08))] p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-9 rounded-full hover:bg-[#B66B44]/10 grid place-items-center"
        >
          <X className="size-4 text-[var(--text-muted,rgba(33,16,0,0.55))]" />
        </button>

        {children}
      </motion.div>
    </motion.div>
  );
}