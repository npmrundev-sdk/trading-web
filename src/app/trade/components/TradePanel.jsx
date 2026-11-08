"use client";

import React, { useState } from "react";
import AmountInput from "./AmountInput";
import BuyButton from "./BuyButton";
import SellButton from "./SellButton";
import { PAYOUT_MULTIPLIER } from "@/components/lib/Tradeconfig";


const money = (n) =>
  `৳${Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * TradePanel
 * Container for: amount input + Buy / Sell buttons.
 *
 * Rules handled here:
 *  - amount must be >= minAmount and <= balance
 *  - while a trade is running (activeTrade) OR a request is being sent,
 *    both Buy and Sell are disabled (and the amount input too)
 *  - when the result arrives, activeTrade becomes null and everything unlocks
 *
 * Props:
 *   balance        (number | null)  current balance
 *   activeTrade    (object | null)  running trade, null when nothing is running
 *   onPlaceTrade   (async fn)       (side: "buy" | "sell", amount: number) => Promise
 *                                   throw an Error to show a message under the buttons
 *   minAmount      (number)         default 1
 *   quickAmounts   (number[])       default [10, 50, 100, 500]
 */
export default function TradePanel({
  balance = null,
  activeTrade = null,
  onPlaceTrade,
  minAmount = 1,
  quickAmounts = [10, 50, 100, 500],
}) {
  const [amount, setAmount] = useState("10");
  const [error, setError] = useState("");
  const [pendingSide, setPendingSide] = useState(null); // "buy" | "sell" | null

  const value = Number(amount);
  const validNumber = Number.isFinite(value) && value >= minAmount;
  const insufficient = balance != null && value > balance;

  const submitting = pendingSide !== null;
  const locked = Boolean(activeTrade) || submitting;
  const canTrade = validNumber && !insufficient && !locked;

  const handleAmountChange = (next) => {
    setAmount(next);
    if (error) setError("");
  };

  const handleTrade = async (side) => {
    if (locked) return;

    if (!validNumber) {
      setError(`Minimum amount is ${money(minAmount)}`);
      return;
    }
    if (insufficient) {
      setError("Not enough balance");
      return;
    }

    setError("");
    setPendingSide(side);
    try {
      await onPlaceTrade?.(side, value);
    } catch (err) {
      setError(err?.message || "Could not place the trade. Try again.");
    } finally {
      setPendingSide(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-white">Place a trade</h2>

      <AmountInput
        value={amount}
        onChange={handleAmountChange}
        min={minAmount}
        max={balance ?? undefined}
        quickAmounts={quickAmounts}
        disabled={locked}
      />

      {/* Payout preview */}
      <div className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2 text-sm">
        <span className="text-slate-400">If you win ({PAYOUT_MULTIPLIER}x)</span>
        <span className="font-medium tabular-nums text-emerald-400">
          {validNumber ? money(value * PAYOUT_MULTIPLIER) : "--"}
        </span>
      </div>

      {/* Buy / Sell */}
      <div className="grid grid-cols-2 gap-3">
        <BuyButton
          onClick={() => handleTrade("buy")}
          disabled={!canTrade}
          loading={pendingSide === "buy"}
        />
        <SellButton
          onClick={() => handleTrade("sell")}
          disabled={!canTrade}
          loading={pendingSide === "sell"}
        />
      </div>

      {/* Messages */}
      {error ? (
        <p role="alert" className="text-sm text-rose-400">
          {error}
        </p>
      ) : insufficient && !locked ? (
        <p className="text-sm text-rose-400">Amount is higher than your balance.</p>
      ) : activeTrade ? (
        <p className="text-sm text-slate-400">
          A trade is running. Buy and Sell unlock when the result arrives.
        </p>
      ) : null}
    </div>
  );
}