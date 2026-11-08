"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function authHeaders(user) {
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

/**
 * All trade logic for the trading page.
 *
 * useTrade(user, { onError })
 *
 * Returns:
 *   activeTrade    running trade or null      -> ActiveTradeCard / TradePanel lock
 *   result         finished trade or null     -> ResultModal
 *   clearResult    () => void                 -> close the modal
 *   placeTrade     (side, amount) => Promise  -> TradePanel onPlaceTrade (throws Error with a message)
 *   settleRunning  () => void                 -> CountdownTimer onComplete
 *
 * On page load it also asks the server "is there a running / expired trade?"
 * so a refresh (or a closed browser) never leaves a trade stuck.
 */
export default function useTrade(user, { onError } = {}) {
  const [activeTrade, setActiveTrade] = useState(null);
  const [result, setResult] = useState(null);
  const settlingRef = useRef(false);

  /* ---------- ask the server for the result ---------- */
  const settle = useCallback(
    async (tradeId) => {
      if (!user || settlingRef.current) return;
      settlingRef.current = true;

      try {
        for (let attempt = 0; attempt < 4; attempt++) {
          const { data, status } = await axios.post(
            "/api/trade/settle",
            tradeId ? { tradeId } : {},
            {
              headers: await authHeaders(user),
              validateStatus: (s) => s < 500 || s === 503,
            }
          );

          // price missing for a moment -> try again shortly
          if (status === 503) {
            await sleep(2000);
            continue;
          }

          if (status >= 400) {
            onError?.(data?.error || "Could not get the result.");
            return;
          }

          // nothing is running
          if (data.status === "none") {
            setActiveTrade(null);
            return;
          }

          // finished
          if (data.status === "settled") {
            setActiveTrade(null);
            setResult(data.result);
            return;
          }

          // still running (page refreshed, or our clock was a bit early)
          if (data.status === "pending") {
            setActiveTrade(data.trade);
            if (data.retryAfterMs > 10000) return; // timer will call us again
            await sleep(data.retryAfterMs + 200);
          }
        }

        onError?.("The result is taking longer than expected. Refresh the page.");
      } catch {
        onError?.("Network problem while getting the result.");
      } finally {
        settlingRef.current = false;
      }
    },
    [user, onError]
  );

  /* ---------- resume on page load ---------- */
  useEffect(() => {
    if (!user) return;
    settle(null);
  }, [user, settle]);

  /* ---------- place a trade ---------- */
  const placeTrade = useCallback(
    async (side, amount) => {
      if (!user) throw new Error("Please log in first.");

      try {
        const { data } = await axios.post(
          "/api/trade/place",
          { side, amount },
          { headers: await authHeaders(user) }
        );
        setActiveTrade(data.trade); // balance updates by itself (Firestore realtime)
      } catch (err) {
        throw new Error(
          err?.response?.data?.error || "Could not place the trade. Try again."
        );
      }
    },
    [user]
  );

  const activeId = activeTrade?.id ?? null;
  const settleRunning = useCallback(() => settle(activeId), [settle, activeId]);

  const clearResult = useCallback(() => setResult(null), []);

  return { activeTrade, result, clearResult, placeTrade, settleRunning };
}
