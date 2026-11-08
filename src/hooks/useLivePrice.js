"use client";

import { useEffect, useState } from "react";

/**
 * Live price. Polls  GET /api/price  every second (paused while the tab is hidden).
 *
 * The API returns: { price: number, candle: { time, open, high, low, close } }
 * Returns { price, candle }
 */
export default function useLivePrice(intervalMs = 1000) {
  const [state, setState] = useState({ price: null, candle: null });

  useEffect(() => {
    let cancelled = false;
    let busy = false;

    const tick = async () => {
      if (busy || document.hidden) return;
      busy = true;
      try {
        const res = await fetch("/api/price", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Number.isFinite(data?.price)) {
          setState({ price: data.price, candle: data.candle ?? null });
        }
      } catch {
        // network hiccup, next tick will try again
      } finally {
        busy = false;
      }
    };

    tick();
    const id = setInterval(tick, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return state;
}
