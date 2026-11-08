"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

/**
 * LivePriceTicker
 * Shows the current price and colours it by the last tick:
 *   green = price went up, red = price went down, grey = unchanged.
 *
 * Props:
 *   price      (number | null)  current price
 *   openPrice  (number)         optional - reference price (e.g. start of day) for the % change
 *   symbol     (string)         label, default "BTC/USD"
 *   decimals   (number)         decimal places, default 2
 */
export default function LivePriceTicker({
  price = null,
  openPrice,
  symbol = "BTC/USD",
  decimals = 2,
}) {
  const prevRef = useRef(null);
  const [direction, setDirection] = useState("flat"); // "up" | "down" | "flat"
  const [flash, setFlash] = useState(false);

  // Detect tick direction every time the price changes
  useEffect(() => {
    if (price == null) return;

    const prev = prevRef.current;
    if (prev != null && price !== prev) {
      setDirection(price > prev ? "up" : "down");
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 350);
      prevRef.current = price;
      return () => clearTimeout(t);
    }

    prevRef.current = price;
  }, [price]);

  // Loading state
  if (price == null) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-5 w-20 rounded bg-slate-800" />
        <div className="h-8 w-32 rounded bg-slate-800" />
      </div>
    );
  }

  const styles = {
    up: {
      text: "text-emerald-400",
      chip: "bg-emerald-500/10 text-emerald-400",
      flash: "bg-emerald-500/15",
      Icon: ArrowUp,
    },
    down: {
      text: "text-rose-400",
      chip: "bg-rose-500/10 text-rose-400",
      flash: "bg-rose-500/15",
      Icon: ArrowDown,
    },
    flat: {
      text: "text-slate-200",
      chip: "bg-slate-800 text-slate-400",
      flash: "bg-slate-700/30",
      Icon: Minus,
    },
  }[direction];

  const { Icon } = styles;

  const formatted = price.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // % change vs. openPrice (only if provided)
  let changePct = null;
  if (typeof openPrice === "number" && openPrice !== 0) {
    changePct = ((price - openPrice) / openPrice) * 100;
  }
  const changeUp = changePct != null && changePct >= 0;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="text-sm font-medium text-slate-400">{symbol}</span>

      <div
        className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors duration-300 ${
          flash ? styles.flash : "bg-transparent"
        }`}
        aria-live="polite"
      >
        <span
          className={`text-2xl font-semibold tabular-nums sm:text-3xl ${styles.text}`}
        >
          {formatted}
        </span>
        <Icon className={`h-5 w-5 ${styles.text}`} aria-hidden="true" />
      </div>

      {changePct != null && (
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-medium tabular-nums ${
            changeUp
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {changeUp ? "+" : ""}
          {changePct.toFixed(2)}%
        </span>
      )}
    </div>
  );
}