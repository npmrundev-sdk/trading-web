"use client";

import React, { useId } from "react";

/** keep only digits and one dot, max 2 decimals */
function sanitize(raw) {
  let v = raw.replace(/[^0-9.]/g, "");
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v =
      v.slice(0, firstDot + 1) +
      v.slice(firstDot + 1).replace(/\./g, "").slice(0, 2);
  }
  // remove useless leading zeros: "007" -> "7" (but keep "0." and "0")
  v = v.replace(/^0+(?=\d)/, "");
  return v;
}

/**
 * AmountInput
 * Amount field + quick amount buttons (10, 50, 100, ...) + Max.
 *
 * Props:
 *   value         (string)    current amount, kept as a string so typing "12." works
 *   onChange      (function)  called with the new cleaned string
 *   min           (number)    optional, only used for the hint text
 *   max           (number)    optional, usually the balance. Enables the "Max" button
 *   quickAmounts  (number[])  default [10, 50, 100]
 *   disabled      (boolean)   locks the input and buttons
 */
export default function AmountInput({
  value = "",
  onChange,
  min,
  max,
  quickAmounts = [10, 50, 100],
  disabled = false,
}) {
  const inputId = useId();
  const current = Number(value);

  const maxValue =
    typeof max === "number" && max > 0 ? Math.floor(max * 100) / 100 : null;

  const chip = (active) =>
    `h-9 flex-1 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50 ${
      active
        ? "border-sky-400 bg-sky-500/10 text-sky-300"
        : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-700"
    }`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm text-slate-400">
          Amount
        </label>
        {typeof min === "number" && (
          <span className="text-xs text-slate-500">Min ৳{min}</span>
        )}
      </div>

      {/* Input */}
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          ৳
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(sanitize(e.target.value))}
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800 pl-7 pr-3 text-lg font-semibold tabular-nums text-white placeholder:text-slate-600 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Quick buttons */}
      <div className="flex gap-2">
        {quickAmounts.map((amt) => (
          <button
            key={amt}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(String(amt))}
            className={chip(current === amt)}
          >
            ৳{amt}
          </button>
        ))}

        {maxValue !== null && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(String(maxValue))}
            className={chip(current === maxValue)}
          >
            Max
          </button>
        )}
      </div>
    </div>
  );
}