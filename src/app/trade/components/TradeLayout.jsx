"use client";

import React from "react";

export default function TradeLayout({
  ticker,
  toolbar,
  chart,
  panel,
  activeTrade,
  balance,
  children,
}) {
  return (
    <section className="w-full min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
          {/* ---------- LEFT: price + chart ---------- */}
          <div className="min-w-0 flex flex-col gap-3">
            {(ticker || toolbar) && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {ticker && <div className="min-w-0">{ticker}</div>}
                {toolbar && <div className="shrink-0">{toolbar}</div>}
              </div>
            )}

            {/* min-w-0 + fixed heights let lightweight-charts resize correctly */}
            <div className="relative min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 h-[340px] sm:h-[420px] lg:h-[560px]">
              {chart ?? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  Chart will appear here
                </div>
              )}
            </div>
          </div>

          {/* ---------- RIGHT: balance + panel + active trade ---------- */}
          <aside className="min-w-0 flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
            {balance && <div>{balance}</div>}

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
              {panel ?? (
                <p className="text-sm text-slate-500">Trade panel will appear here</p>
              )}
            </div>

            {activeTrade && <div>{activeTrade}</div>}
          </aside>
        </div>
      </div>

      {/* Modals / overlays */}
      {children}
    </section>
  );
}