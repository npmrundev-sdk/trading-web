"use client";

import React from "react";
import { TrendingUp, Loader2 } from "lucide-react";

/**
 * BuyButton (green)
 *
 * Props:
 *   onClick   (function)  click handler
 *   disabled  (boolean)   true while a trade is running / input is invalid
 *   loading   (boolean)   true while this button's request is being sent
 *   label     (string)    default "Buy"
 */
export default function BuyButton({
  onClick,
  disabled = false,
  loading = false,
  label = "Buy",
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-base font-semibold text-white transition-colors hover:bg-emerald-400 active:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:hover:bg-slate-800"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      ) : (
        <TrendingUp className="h-5 w-5" aria-hidden="true" />
      )}
      <span>{label}</span>
    </button>
  );
}