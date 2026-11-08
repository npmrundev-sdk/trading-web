"use client";

import React, { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notification } from "antd";
import { History } from "lucide-react";

import TradeLayout from "./components/TradeLayout";
import ChartToolbar, {
  CHART_RANGES,
  DEFAULT_CHART_RANGE,
} from "./components/ChartToolbar";
import LivePriceTicker from "./components/LivePriceTicker";
import BalanceCard from "./components/BalanceCard";
import TradePanel from "./components/TradePanel";
import ActiveTradeCard from "./components/ActiveTradeCard";
import ResultModal from "./components/ResultModal";

import useAuthUser from "@/hooks/useAuthUser";
import useBalance from "@/hooks/useBalance";
import useLivePrice from "@/hooks/useLivePrice";
import usePriceHistory from "@/hooks/usePriceHistory";
import useTrade from "@/hooks/useTrade";

// lightweight-charts needs the browser, so skip server rendering for the chart
const PriceChart = dynamic(() => import("./components/PriceChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-500">
      Loading chart...
    </div>
  ),
});

export default function TradePage() {
  const [range, setRange] = useState(DEFAULT_CHART_RANGE);
  const [notify, contextHolder] = notification.useNotification();

  const notifyError = useCallback(
    (message) => notify.error({ message: "Trade", description: message }),
    [notify]
  );

  /* ---------- data ---------- */
  const { user, loading: authLoading } = useAuthUser();
  const { balance } = useBalance(user?.uid);
  const { price, candle } = useLivePrice();
  const { candles, loading: historyLoading } = usePriceHistory();
  const { activeTrade, result, clearResult, placeTrade, settleRunning } =
    useTrade(user, { onError: notifyError });

  /* price at the start of the selected range, used for the % badge */
  const openPrice = useMemo(() => {
    if (!candles.length) return undefined;
    const cfg = CHART_RANGES.find((r) => r.key === range);
    const lastTime = candles[candles.length - 1].time;
    const from = lastTime - (cfg ? cfg.seconds : 0);
    const first = candles.find((c) => c.time >= from) ?? candles[0];
    return first.open;
  }, [candles, range]);

  /* ---------- auth states ---------- */
  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-slate-300">Log in to start trading.</p>
        <Link
          href="/login"
          className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
        >
          Log in
        </Link>
      </div>
    );
  }

  /* ---------- page ---------- */
  return (
    <div className="bg-slate-950 text-white">
      {contextHolder}

      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-3 pt-4 sm:px-5 lg:px-6">
        <h1 className="text-lg font-semibold">Trade</h1>
        <Link
          href="/trade/history"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          Trade History
        </Link>
      </div>

      <TradeLayout
        ticker={<LivePriceTicker price={price} openPrice={openPrice} />}
        toolbar={<ChartToolbar value={range} onChange={setRange} />}
        chart={
          <PriceChart
            data={candles}
            lastCandle={candle}
            range={range}
            entryPrice={activeTrade?.entryPrice}
            entrySide={activeTrade?.side}
            loading={historyLoading}
          />
        }
        balance={<BalanceCard balance={balance} />}
        panel={
          <TradePanel
            balance={balance}
            activeTrade={activeTrade}
            onPlaceTrade={placeTrade}
          />
        }
        activeTrade={
          activeTrade ? (
            <ActiveTradeCard
              trade={activeTrade}
              currentPrice={price}
              onComplete={settleRunning}
            />
          ) : null
        }
      >
        <ResultModal result={result} onClose={clearResult} />
      </TradeLayout>
    </div>
  );
}