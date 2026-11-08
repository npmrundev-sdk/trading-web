"use client";

import { useEffect, useState } from "react";

/**
 * 1 week of candles, loaded once from  GET /api/price/history
 * The API returns: { candles: [{ time (unix seconds), open, high, low, close }] }
 * Returns { candles, loading }
 */
export default function usePriceHistory() {
  const [state, setState] = useState({ candles: [], loading: true });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/price/history", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) {
          setState({
            candles: Array.isArray(data?.candles) ? data.candles : [],
            loading: false,
          });
        }
      } catch {
        if (!cancelled) setState({ candles: [], loading: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
