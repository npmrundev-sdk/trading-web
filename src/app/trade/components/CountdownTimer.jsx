"use client";

import React, { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";

/**
 * CountdownTimer
 * Counts down to a fixed end time (real clock based, so it stays correct
 * even if the tab was in the background or the page was refreshed).
 *
 * Props:
 *   endsAt      (number)    unix milliseconds when the countdown finishes
 *   duration    (number)    total seconds, only used for the progress bar. Default 30
 *   onComplete  (function)  called ONE time when the countdown reaches 0
 *
 * Tip: give it a `key` (e.g. trade id) so it resets for every new trade.
 */
export default function CountdownTimer({
  endsAt,
  duration = 30,
  onComplete,
}) {
  const [remainingMs, setRemainingMs] = useState(null); // null = not measured yet

  const onCompleteRef = useRef(onComplete);
  const firedRef = useRef(false);

  // always call the newest onComplete without restarting the interval
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (typeof endsAt !== "number") return;

    firedRef.current = false;

    const tick = () => {
      const left = Math.max(0, endsAt - Date.now());
      setRemainingMs(left);

      if (left === 0 && !firedRef.current) {
        firedRef.current = true;
        clearInterval(id);
        onCompleteRef.current?.();
      }
    };

    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [endsAt]);

  const measured = remainingMs !== null;
  const done = measured && remainingMs === 0;
  const seconds = measured ? Math.ceil(remainingMs / 1000) : null;
  const percent = measured
    ? Math.min(100, (remainingMs / (duration * 1000)) * 100)
    : 100;
  const urgent = measured && !done && seconds <= 5;

  return (
    <div role="timer" aria-live="off" className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-slate-400">
          <Timer className="h-4 w-4" aria-hidden="true" />
          {done ? "Calculating result..." : "Result in"}
        </span>

        <span
          className={`font-semibold tabular-nums ${
            urgent ? "text-amber-400" : "text-white"
          }`}
        >
          {measured ? `${seconds}s` : "--"}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
            urgent ? "bg-amber-400" : "bg-sky-400"
          } ${done ? "animate-pulse" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}