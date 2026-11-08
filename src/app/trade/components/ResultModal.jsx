"use client";

import React, { useEffect, useRef } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { PAYOUT_MULTIPLIER } from "@/components/lib/Tradeconfig";

const money = (n) =>
  `৳${Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const price = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "--";

/**
 * ResultModal
 * Popup shown when the 30s trade is settled.
 *   WIN  -> payout (amount x PAYOUT_MULTIPLIER) in green
 *   LOSS -> lost amount in red
 *
 * Props:
 *   result   (object | null)  null = modal hidden
 *       {
 *         status: "win" | "loss",
 *         side: "buy" | "sell",
 *         amount: number,       // amount the user traded
 *         payout: number,       // total returned (amount x multiplier on win, 0 on loss)
 *         entryPrice: number,
 *         exitPrice: number,
 *       }
 *   onClose  (function)       called on button / backdrop / Esc
 */
export default function ResultModal({ result = null, onClose }) {
  const closeBtnRef = useRef(null);

  const open = Boolean(result);

  // Esc to close, lock page scroll, focus the button
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!result) return null;

  const isWin = result.status === "win";
  const Icon = isWin ? CheckCircle2 : XCircle;
  const isBuy = result.side === "buy";

  const net = isWin ? result.payout - result.amount : -result.amount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm rounded-2xl border bg-slate-900 p-6 shadow-2xl ${
          isWin ? "border-emerald-500/40" : "border-rose-500/40"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Headline */}
        <div className="flex flex-col items-center text-center">
          <span
            className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ${
              isWin ? "bg-emerald-500/10" : "bg-rose-500/10"
            }`}
          >
            <Icon
              className={`h-9 w-9 ${isWin ? "text-emerald-400" : "text-rose-400"}`}
              aria-hidden="true"
            />
          </span>

          <h2
            id="result-title"
            className={`text-2xl font-bold ${
              isWin ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isWin ? "You won" : "You lost"}
          </h2>

          <p
            className={`mt-1 text-3xl font-semibold tabular-nums ${
              isWin ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isWin ? money(result.payout) : money(result.amount)}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {isWin
              ? `${PAYOUT_MULTIPLIER}x payout, profit +${money(net)}`
              : "The price moved against your trade."}
          </p>
        </div>

        {/* Details */}
        <dl className="mt-5 space-y-2 rounded-xl bg-slate-800/60 p-4 text-sm">
          <Row
            label="Your trade"
            value={isBuy ? "Buy" : "Sell"}
            valueClass={isBuy ? "text-emerald-400" : "text-rose-400"}
          />
          <Row label="Amount" value={money(result.amount)} />
          <Row label="Entry price" value={price(result.entryPrice)} />
          <Row label="Exit price" value={price(result.exitPrice)} />
        </dl>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-xl bg-slate-100 text-base font-semibold text-slate-900 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          Trade again
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = "text-white" }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className={`font-medium tabular-nums ${valueClass}`}>{value}</dd>
    </div>
  );
}