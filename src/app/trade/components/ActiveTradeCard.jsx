"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { PAYOUT_MULTIPLIER } from "@/components/lib/Tradeconfig";


const money = (n) =>
  `৳${Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const price = (n) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * ActiveTradeCard
 * Shows the trade that is running right now:
 * side, amount, entry price, live price, "winning / losing" status and the 30s countdown.
 *
 * Props:
 *   trade          (object | null)
 *       {
 *         id, side: "buy" | "sell", amount: number, entryPrice: number,
 *         settleAt: number   // unix ms, when the result will be decided
 *         duration?: number  // seconds, default 30
 *       }
 *   currentPrice   (number | null)  live price from the chart feed
 *   onComplete     (function)       called once when the countdown hits 0
 *                                   (use it to call the settle API / refresh)
 *
 * Win rule (shown here as a live preview only, the server decides the real result):
 *   buy  wins if price is ABOVE entry price
 *   sell wins if price is BELOW entry price
 */
export default function ActiveTradeCard({
  trade = null,
  currentPrice = null,
  onComplete,
}) {
  if (!trade) return null;

  const isBuy = trade.side === "buy";
  const SideIcon = isBuy ? TrendingUp : TrendingDown;

  // live preview status
  let status = "waiting"; // "winning" | "losing" | "even" | "waiting"
  if (typeof currentPrice === "number") {
    if (currentPrice === trade.entryPrice) status = "even";
    else if (isBuy) status = currentPrice > trade.entryPrice ? "winning" : "losing";
    else status = currentPrice < trade.entryPrice ? "winning" : "losing";
  }

  const statusUI = {
    winning: { text: "Winning right now", cls: "bg-emerald-500/10 text-emerald-400" },
    losing: { text: "Losing right now", cls: "bg-rose-500/10 text-rose-400" },
    even: { text: "Even", cls: "bg-slate-800 text-slate-300" },
    waiting: { text: "Waiting for price", cls: "bg-slate-800 text-slate-400" },
  }[status];

  const diff =
    typeof currentPrice === "number" ? currentPrice - trade.entryPrice : null;

  return (
    <div
      className={`rounded-xl border bg-slate-900 p-4 sm:p-5 ${
        isBuy ? "border-emerald-500/30" : "border-rose-500/30"
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-400" />
          </span>
          <h3 className="text-sm font-semibold text-white">Trade running</h3>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
            isBuy
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}
        >
          <SideIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {isBuy ? "Buy" : "Sell"}
        </span>
      </div>

      {/* Details */}
      <dl className="space-y-2 text-sm">
        <Row label="Amount" value={money(trade.amount)} />
        <Row label="Entry price" value={price(trade.entryPrice)} />
        <Row
          label="Current price"
          value={typeof currentPrice === "number" ? price(currentPrice) : "--"}
          hint={
            diff == null || diff === 0
              ? null
              : `${diff > 0 ? "+" : "-"}${price(Math.abs(diff))}`
          }
          hintClass={diff > 0 ? "text-emerald-400" : "text-rose-400"}
        />
        <Row
          label={`Payout if you win (${PAYOUT_MULTIPLIER}x)`}
          value={money(trade.amount * PAYOUT_MULTIPLIER)}
        />
      </dl>

      {/* Live status */}
      <div
        className={`mt-4 rounded-lg px-3 py-2 text-center text-sm font-medium ${statusUI.cls}`}
        aria-live="polite"
      >
        {statusUI.text}
      </div>

      {/* Countdown */}
      <div className="mt-4">
        <CountdownTimer
          key={trade.id}
          endsAt={trade.settleAt}
          duration={trade.duration ?? 30}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
}

function Row({ label, value, hint, hintClass = "" }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="flex items-center gap-2 font-medium tabular-nums text-white">
        {hint && <span className={`text-xs ${hintClass}`}>{hint}</span>}
        {value}
      </dd>
    </div>
  );
}