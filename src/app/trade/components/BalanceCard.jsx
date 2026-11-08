"use client";

import React, { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

/**
 * BalanceCard
 * Shows the user's current balance. When the balance changes
 * (trade placed = minus, trade won = plus) it briefly shows the
 * difference, e.g. "-$50.00" in red or "+$100.00" in green.
 *
 * Props:
 *   balance   (number | null)  current balance, null = loading
 *   currency  (string)         symbol, default "$"
 *   loading   (boolean)        optional, force loading skeleton
 */
export default function BalanceCard({
  balance = null,
  currency = "৳",
  loading = false,
}) {
  // "adjust state while rendering" pattern (no refs, no setState-in-effect)
  const [prevBalance, setPrevBalance] = useState(balance);
  const [flash, setFlash] = useState(null); // { id, delta }

  if (balance !== prevBalance) {
    setPrevBalance(balance);
    if (typeof balance === "number" && typeof prevBalance === "number") {
      setFlash({ id: `${prevBalance}->${balance}`, delta: balance - prevBalance });
    }
  }

  // hide the "+/-" chip after a moment
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2000);
    return () => clearTimeout(t);
  }, [flash]);

  const isLoading = loading || balance == null;

  const money = (n) =>
    `${currency}${Math.abs(n).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const flashUp = flash && flash.delta > 0;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
          <Wallet className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0">
          <p className="text-sm text-slate-400">Your balance</p>

          {isLoading ? (
            <div className="mt-1 h-7 w-28 animate-pulse rounded bg-slate-800" />
          ) : (
            <p
              className="truncate text-2xl font-semibold tabular-nums text-white"
              aria-live="polite"
            >
              {balance < 0 ? "-" : ""}
              {money(balance)}
            </p>
          )}
        </div>
      </div>

      {flash && flash.delta !== 0 && (
        <span
          key={flash.id}
          className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium tabular-nums ${
            flashUp
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {flashUp ? "+" : "-"}
          {money(flash.delta)}
        </span>
      )}
    </div>
  );
}