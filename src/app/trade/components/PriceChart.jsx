"use client";

import React, { useCallback, useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  CandlestickSeries,
} from "lightweight-charts";
import { CHART_RANGES, DEFAULT_CHART_RANGE } from "./ChartToolbar";

const UP = "#34d399"; // green candle
const DOWN = "#fb7185"; // red candle
const BG = "#0f172a"; // matches slate-900 card in TradeLayout
const TEXT = "#94a3b8";
const GRID = "#1e293b";

/** time can be seconds or milliseconds -> always return seconds (UTCTimestamp) */
const toSec = (t) => (t > 1e12 ? Math.floor(t / 1000) : Math.floor(t));

/** clean + sort + remove duplicate times (lightweight-charts requires ascending unique times) */
function normalize(list = []) {
  const map = new Map();
  for (const c of list) {
    if (!c) continue;
    const time = toSec(c.time);
    map.set(time, {
      time,
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
    });
  }
  return [...map.values()].sort((a, b) => a.time - b.time);
}

/**
 * PriceChart  (lightweight-charts v5 candlestick)
 *
 * Props:
 *   data        array   history candles  [{ time, open, high, low, close }]
 *                       (time = unix seconds or ms). Keep this array stable;
 *                       it is only re-applied when the reference changes.
 *   lastCandle  object  the live / newest candle. Updates the chart without a reload.
 *   range       string  "1h" | "1d" | "1w"   (from ChartToolbar)
 *   entryPrice  number  optional - draws a dashed line at the running trade's entry price
 *   entrySide   string  "buy" | "sell" - colour of that line
 *   loading     boolean optional - shows a loading overlay
 */
export default function PriceChart({
  data = [],
  lastCandle = null,
  range = DEFAULT_CHART_RANGE,
  entryPrice = null,
  entrySide = "buy",
  loading = false,
}) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const priceLineRef = useRef(null);
  const lastTimeRef = useRef(0);
  const rangeRef = useRef(range);

  // keep the ref in sync (inside an effect, NOT during render).
  // This effect is declared before the others so it always runs first.
  useEffect(() => {
    rangeRef.current = range;
  }, [range]);

  /* ---------- show only the selected time window ---------- */
  const applyRange = useCallback(() => {
    const chart = chartRef.current;
    const last = lastTimeRef.current;
    if (!chart || !last) return;

    const cfg = CHART_RANGES.find((r) => r.key === rangeRef.current);
    const seconds = cfg ? cfg.seconds : 60 * 60 * 24 * 7;

    try {
      chart.timeScale().applyOptions({ secondsVisible: seconds <= 3600 });
      chart.timeScale().setVisibleRange({
        from: last - seconds,
        to: last + Math.max(10, Math.floor(seconds * 0.03)),
      });
    } catch {
      chart.timeScale().fitContent();
    }
  }, []);

  /* ---------- 1) create chart once ---------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true, // follows the parent size (responsive)
      layout: {
        background: { type: ColorType.Solid, color: BG },
        textColor: TEXT,
        fontSize: 12,
      },
      grid: {
        vertLines: { color: GRID },
        horzLines: { color: GRID },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: {
        borderColor: GRID,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: GRID,
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 4,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: UP,
      downColor: DOWN,
      borderUpColor: UP,
      borderDownColor: DOWN,
      wickUpColor: UP,
      wickDownColor: DOWN,
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      priceLineRef.current = null;
      lastTimeRef.current = 0;
    };
  }, []);

  /* ---------- 2) history data ---------- */
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;

    const clean = normalize(data);
    series.setData(clean);
    lastTimeRef.current = clean.length ? clean[clean.length - 1].time : 0;
    applyRange();
  }, [data, applyRange]);

  /* ---------- 3) live candle (fast up/down) ---------- */
  useEffect(() => {
    const series = seriesRef.current;
    if (!series || !lastCandle) return;

    const [candle] = normalize([lastCandle]);
    if (!candle) return;

    // chart only accepts updates for the last bar or newer
    if (lastTimeRef.current && candle.time < lastTimeRef.current) return;

    try {
      series.update(candle);
      lastTimeRef.current = candle.time;
    } catch (err) {
      console.warn("PriceChart update skipped:", err?.message);
    }
  }, [lastCandle]);

  /* ---------- 4) range button changed ---------- */
  useEffect(() => {
    applyRange();
  }, [range, applyRange]);

  /* ---------- 5) entry price line for the running trade ---------- */
  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;

    if (priceLineRef.current) {
      series.removePriceLine(priceLineRef.current);
      priceLineRef.current = null;
    }

    if (typeof entryPrice === "number" && !Number.isNaN(entryPrice)) {
      priceLineRef.current = series.createPriceLine({
        price: entryPrice,
        color: entrySide === "buy" ? UP : DOWN,
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: entrySide === "buy" ? "Buy entry" : "Sell entry",
      });
    }
  }, [entryPrice, entrySide]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 text-sm text-slate-400">
          Loading chart...
        </div>
      )}
    </div>
  );
}