"use client";

import React from "react";

/**
 * Available chart ranges.
 * `seconds` = how far back the chart should show (PriceChart can use this).
 */
export const CHART_RANGES = [
  { key: "1h", label: "1 Hour", short: "1H", seconds: 60 * 60 },
  { key: "1d", label: "1 Day", short: "1D", seconds: 60 * 60 * 24 },
  { key: "1w", label: "1 Week", short: "1W", seconds: 60 * 60 * 24 * 7 },
];

export const DEFAULT_CHART_RANGE = "1h";

/**
 * ChartToolbar
 * Range switcher: 1 hour / 1 day / 1 week.
 *
 * Props:
 *   value     (string)    selected range key: "1h" | "1d" | "1w"
 *   onChange  (function)  called with the new range key
 *   ranges    (array)     optional custom list (same shape as CHART_RANGES)
 *   disabled  (boolean)   optional, disables all buttons
 */
export default function ChartToolbar({
  value = DEFAULT_CHART_RANGE,
  onChange,
  ranges = CHART_RANGES,
  disabled = false,
}) {
  return (
    <div
      role="group"
      aria-label="Chart range"
      className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1"
    >
      {ranges.map((range) => {
        const active = range.key === value;

        return (
          <button
            key={range.key}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onChange?.(range.key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
              active
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {/* short label on mobile, full label on larger screens */}
            <span className="sm:hidden">{range.short}</span>
            <span className="hidden sm:inline">{range.label}</span>
          </button>
        );
      })}
    </div>
  );
}