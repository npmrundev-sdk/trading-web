"use client";

import React, { useEffect, useRef, useState } from "react";
import { notification } from "antd";
import {
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";

import {
  createChart,
  ColorType,
  CandlestickSeries,
} from "lightweight-charts";

import {
  getBTCPrice,
  getBTCKlines,
} from "@/components/lib/binance";

import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const MIN_BALANCE = 500;

export default function RealTrading() {
  const { user } = useAuth();

  // =====================================================
  // REFS
  // =====================================================

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const wsRef = useRef(null);

  // =====================================================
  // STATE
  // =====================================================

  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);

  const [tradeAmount, setTradeAmount] = useState(500);

  const [activeTrade, setActiveTrade] = useState(null);

  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeStatus, setTradeStatus] = useState("");

  const [lastTrade, setLastTrade] = useState(null);

  const [marketStatus, setMarketStatus] = useState("Connecting...");

  // =====================================================
  // FORMATTERS
  // =====================================================

  const formatMoney = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatBTCPrice = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =====================================================
  // LOAD REAL BALANCE + ACTIVE TRADE
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadBalance = async () => {
      if (!user?.uid) {
        setBalance(null);
        setActiveTrade(null);
        setLastTrade(null);
        setBalanceLoading(false);
        return;
      }

      try {
        setBalanceLoading(true);

        const balanceRef = doc(
          db,
          "balance",
          user.uid
        );

        const balanceSnap = await getDoc(balanceRef);

        if (cancelled) return;

        if (!balanceSnap.exists()) {
          setBalance(0);
          setActiveTrade(null);
          setLastTrade(null);
          return;
        }

        const data = balanceSnap.data();

        // -----------------------------------------------
        // REAL BALANCE
        // -----------------------------------------------

        const realBalance = Number(
          data.amount || 0
        );

        setBalance(realBalance);

        // -----------------------------------------------
        // ACTIVE REAL TRADE
        // -----------------------------------------------

        const activeAmount = Number(
          data.activeRealTradeAmount || 0
        );

        if (activeAmount > 0) {
          setActiveTrade({
            amount: activeAmount,

            buyPrice: Number(
              data.activeRealTradeBuyPrice || 0
            ),

            createdAt:
              data.activeRealTradeCreatedAt || null,

            status:
              data.activeRealTradeStatus || "open",
          });
        } else {
          setActiveTrade(null);
        }

        // -----------------------------------------------
        // LAST TRADE
        // -----------------------------------------------

        if (
          data.lastRealTradeAmount &&
          Number(data.lastRealTradeAmount) > 0
        ) {
          setLastTrade({
            type:
              data.lastRealTradeType || "SELL",

            amount:
              Number(data.lastRealTradeAmount) || 0,

            buyPrice:
              Number(data.lastRealTradeBuyPrice) || 0,

            sellPrice:
              Number(data.lastRealTradeSellPrice) || 0,

            settlement:
              Number(data.lastRealTradeSettlement) || 0,

            profitLoss:
              Number(data.lastRealTradeProfitLoss) || 0,

            closedAt:
              data.lastRealTradeClosedAt || null,
          });
        } else {
          setLastTrade(null);
        }
      } catch (error) {
        console.error(
          "Real balance loading error:",
          error
        );

        notification.error({
          message: "Balance Error",
          description:
            "Unable to load your real balance.",
        });
      } finally {
        if (!cancelled) {
          setBalanceLoading(false);
        }
      }
    };

    loadBalance();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  // =====================================================
  // LOAD BTC CURRENT PRICE
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadPrice = async () => {
      try {
        const price = await getBTCPrice();

        if (!mounted) return;

        const numericPrice = Number(price);

        if (Number.isFinite(numericPrice)) {
          setCurrentPrice(numericPrice);
        }
      } catch (error) {
        console.error(
          "BTC price loading error:",
          error
        );
      } finally {
        if (mounted) {
          setPriceLoading(false);
        }
      }
    };

    loadPrice();

    const interval = setInterval(
      loadPrice,
      5000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // BTC CHART
  // =====================================================

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

    let mounted = true;

    const container =
      chartContainerRef.current;

    // -----------------------------------------------
    // CREATE CHART
    // -----------------------------------------------

    const chart = createChart(
      container,
      {
        width: container.clientWidth,
        height: 420,

        layout: {
          background: {
            type: ColorType.Solid,
            color: "#0f172a",
          },

          textColor: "#94a3b8",
        },

        grid: {
          vertLines: {
            color: "rgba(148, 163, 184, 0.08)",
          },

          horzLines: {
            color: "rgba(148, 163, 184, 0.08)",
          },
        },

        rightPriceScale: {
          borderColor:
            "rgba(148, 163, 184, 0.12)",
        },

        timeScale: {
          borderColor:
            "rgba(148, 163, 184, 0.12)",

          timeVisible: true,

          secondsVisible: false,

          rightOffset: 5,

          barSpacing: 7,

          minBarSpacing: 2,
        },

        crosshair: {
          vertLine: {
            color: "rgba(148, 163, 184, 0.35)",

            width: 1,

            style: 2,
          },

          horzLine: {
            color: "rgba(148, 163, 184, 0.35)",

            width: 1,

            style: 2,
          },
        },

        handleScroll: {
          mouseWheel: true,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: true,
        },

        handleScale: {
          axisPressedMouseMove: true,
          mouseWheel: true,
          pinch: true,
        },
      }
    );

    chartRef.current = chart;

    // -----------------------------------------------
    // CANDLE SERIES
    // -----------------------------------------------

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor: "#22c55e",

          downColor: "#ef4444",

          borderUpColor: "#22c55e",

          borderDownColor: "#ef4444",

          wickUpColor: "#22c55e",

          wickDownColor: "#ef4444",
        }
      );

    candleSeriesRef.current =
      candleSeries;

    // -----------------------------------------------
    // RESPONSIVE HEIGHT
    // -----------------------------------------------

    const getChartHeight = () => {
      const width = container.clientWidth;

      if (width < 480) {
        return 300;
      }

      if (width < 640) {
        return 340;
      }

      if (width < 768) {
        return 380;
      }

      if (width < 1024) {
        return 420;
      }

      return 450;
    };

    const resizeChart = () => {
      if (!chartRef.current) {
        return;
      }

      const width =
        container.clientWidth;

      const height =
        getChartHeight();

      if (width <= 0) return;

      chartRef.current.resize(
        width,
        height
      );
    };

    resizeChart();

    // -----------------------------------------------
    // LOAD HISTORICAL CANDLES
    // -----------------------------------------------

    const loadCandles = async () => {
      try {
        setMarketStatus(
          "Loading market..."
        );

        const candles =
          await getBTCKlines(
            "1m",
            300
          );

        if (!mounted) return;

        if (
          !Array.isArray(candles) ||
          !candles.length
        ) {
          setMarketStatus(
            "No market data"
          );

          return;
        }

        const formatted =
          candles
            .map((candle) => ({
              time: Math.floor(
                Number(candle[0]) / 1000
              ),

              open: Number(candle[1]),

              high: Number(candle[2]),

              low: Number(candle[3]),

              close: Number(candle[4]),
            }))
            .filter(
              (item) =>
                Number.isFinite(item.time) &&
                Number.isFinite(item.open) &&
                Number.isFinite(item.high) &&
                Number.isFinite(item.low) &&
                Number.isFinite(item.close)
            );

        candleSeries.setData(
          formatted
        );

        chart.timeScale().fitContent();

        setMarketStatus(
          "Market Live"
        );
      } catch (error) {
        console.error(
          "Candle loading error:",
          error
        );

        setMarketStatus(
          "Market unavailable"
        );
      }
    };

    loadCandles();

    // -----------------------------------------------
    // BINANCE WEBSOCKET
    // -----------------------------------------------

    try {
      const websocket =
        new WebSocket(
          "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
        );

      wsRef.current = websocket;

      websocket.onopen = () => {
        if (!mounted) return;

        setMarketStatus(
          "Market Live"
        );
      };

      websocket.onmessage = (
        event
      ) => {
        if (!mounted) return;

        try {
          const message =
            JSON.parse(
              event.data
            );

          const kline =
            message?.k;

          if (!kline) return;

          const candle = {
            time: Math.floor(
              Number(kline.t) / 1000
            ),

            open: Number(kline.o),

            high: Number(kline.h),

            low: Number(kline.l),

            close: Number(kline.c),
          };

          if (
            !Number.isFinite(
              candle.time
            )
          ) {
            return;
          }

          candleSeries.update(
            candle
          );

          const livePrice =
            Number(kline.c);

          if (
            Number.isFinite(
              livePrice
            )
          ) {
            setCurrentPrice(
              livePrice
            );
          }
        } catch (error) {
          console.error(
            "WebSocket message error:",
            error
          );
        }
      };

      websocket.onerror = () => {
        if (!mounted) return;

        setMarketStatus(
          "Market connection error"
        );
      };

      websocket.onclose = () => {
        if (!mounted) return;

        setMarketStatus(
          "Market disconnected"
        );
      };
    } catch (error) {
      console.error(
        "WebSocket error:",
        error
      );
    }

    // -----------------------------------------------
    // RESIZE OBSERVER
    // -----------------------------------------------

    const resizeObserver =
      new ResizeObserver(() => {
        resizeChart();
      });

    resizeObserver.observe(
      container
    );

    // -----------------------------------------------
    // CLEANUP
    // -----------------------------------------------

    return () => {
      mounted = false;

      resizeObserver.disconnect();

      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (error) {
          console.error(error);
        }

        wsRef.current = null;
      }

      if (chartRef.current) {
        chartRef.current.remove();

        chartRef.current = null;
      }

      candleSeriesRef.current =
        null;
    };
  }, []);

  // =====================================================
  // BUY
  // =====================================================

  const handleBuy = async () => {
    if (!user?.uid) {
      notification.warning({
        message: "Login Required",
        description:
          "Please login first to start real trading.",
      });

      return;
    }

    if (
      balance === null ||
      balance < MIN_BALANCE
    ) {
      notification.warning({
        message:
          "Insufficient Balance",

        description:
          "Real trading করার জন্য minimum ৳500 balance থাকতে হবে।",
      });

      return;
    }

    if (activeTrade) {
      notification.warning({
        message:
          "Trade Already Active",

        description:
          "Please close your current trade first.",
      });

      return;
    }

    if (
      !currentPrice ||
      currentPrice <= 0
    ) {
      notification.warning({
        message:
          "Market Price Unavailable",

        description:
          "BTC market price is not available right now.",
      });

      return;
    }

    const amount =
      Number(tradeAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      notification.warning({
        message: "Invalid Amount",

        description:
          "Please enter a valid trading amount.",
      });

      return;
    }

    if (amount > balance) {
      notification.warning({
        message:
          "Insufficient Balance",

        description:
          `Available balance: ৳${formatMoney(
            balance
          )}`,
      });

      return;
    }

    try {
      setTradeLoading(true);
      setTradeStatus("");

      const balanceRef = doc(
        db,
        "balance",
        user.uid
      );

      const buyPrice =
        Number(currentPrice);

      const createdAt =
        new Date();

      await runTransaction(
        db,
        async (transaction) => {
          const balanceSnap =
            await transaction.get(
              balanceRef
            );

          if (
            !balanceSnap.exists()
          ) {
            throw new Error(
              "Balance account not found."
            );
          }

          const data =
            balanceSnap.data();

          const currentBalance =
            Number(data.amount || 0);

          // -------------------------------------------
          // SERVER-SIDE MINIMUM BALANCE
          // -------------------------------------------

          if (
            currentBalance <
            MIN_BALANCE
          ) {
            throw new Error(
              "Minimum ৳500 balance is required."
            );
          }

          // -------------------------------------------
          // PREVENT DOUBLE TRADE
          // -------------------------------------------

          const existingTrade =
            Number(
              data.activeRealTradeAmount ||
                0
            );

          if (
            existingTrade > 0
          ) {
            throw new Error(
              "You already have an active real trade."
            );
          }

          // -------------------------------------------
          // BALANCE CHECK
          // -------------------------------------------

          if (
            amount >
            currentBalance
          ) {
            throw new Error(
              "Insufficient real balance."
            );
          }

          // -------------------------------------------
          // BUY
          // -------------------------------------------

          transaction.update(
            balanceRef,
            {
              amount:
                currentBalance -
                amount,

              activeRealTradeAmount:
                amount,

              activeRealTradeBuyPrice:
                buyPrice,

              activeRealTradeCreatedAt:
                createdAt,

              activeRealTradeStatus:
                "open",

              updatedAt:
                new Date(),
            }
          );
        }
      );

      // -----------------------------------------------
      // UPDATE UI
      // -----------------------------------------------

      setBalance(
        (previous) =>
          Number(previous || 0) -
          amount
      );

      setActiveTrade({
        amount,

        buyPrice,

        createdAt,

        status: "open",
      });

      setTradeStatus(
        `BUY opened at BTC $${formatBTCPrice(
          buyPrice
        )}`
      );

      notification.success({
        message:
          "BUY Successful",

        description:
          `৳${formatMoney(
            amount
          )} locked at BTC price $${formatBTCPrice(
            buyPrice
          )}.`,
      });
    } catch (error) {
      console.error(
        "Real BUY error:",
        error
      );

      setTradeStatus(
        error?.message ||
          "Unable to place BUY order."
      );

      notification.error({
        message:
          "BUY Failed",

        description:
          error?.message ||
          "Unable to place BUY order.",
      });
    } finally {
      setTradeLoading(false);
    }
  };

  // =====================================================
  // SELL / CLOSE
  // =====================================================

  const handleSell = async () => {
    if (!user?.uid) {
      notification.warning({
        message: "Login Required",
        description:
          "Please login first.",
      });

      return;
    }

    if (!activeTrade) {
      notification.warning({
        message:
          "No Active Trade",

        description:
          "Please open a BUY trade first.",
      });

      return;
    }

    if (
      !currentPrice ||
      currentPrice <= 0
    ) {
      notification.warning({
        message:
          "Market Price Unavailable",

        description:
          "Current BTC price is unavailable.",
      });

      return;
    }

    try {
      setTradeLoading(true);
      setTradeStatus("");

      const balanceRef = doc(
        db,
        "balance",
        user.uid
      );

      const sellPrice =
        Number(currentPrice);

      let result = null;

      await runTransaction(
        db,
        async (transaction) => {
          const balanceSnap =
            await transaction.get(
              balanceRef
            );

          if (
            !balanceSnap.exists()
          ) {
            throw new Error(
              "Balance account not found."
            );
          }

          const data =
            balanceSnap.data();

          const currentBalance =
            Number(data.amount || 0);

          const investedAmount =
            Number(
              data.activeRealTradeAmount ||
                0
            );

          const buyPrice =
            Number(
              data.activeRealTradeBuyPrice ||
                0
            );

          if (
            investedAmount <= 0
          ) {
            throw new Error(
              "No active real trade found."
            );
          }

          if (
            buyPrice <= 0
          ) {
            throw new Error(
              "Invalid BUY price."
            );
          }

          // -------------------------------------------
          // BTC PRICE BASED P/L
          // -------------------------------------------

          const priceChange =
            (sellPrice -
              buyPrice) /
            buyPrice;

          const profitLoss =
            investedAmount *
            priceChange;

          const settlementAmount =
            investedAmount +
            profitLoss;

          const finalSettlement =
            Math.max(
              0,
              settlementAmount
            );

          // -------------------------------------------
          // UPDATE REAL BALANCE
          // -------------------------------------------

          transaction.update(
            balanceRef,
            {
              amount:
                currentBalance +
                finalSettlement,

              activeRealTradeAmount:
                0,

              activeRealTradeBuyPrice:
                null,

              activeRealTradeCreatedAt:
                null,

              activeRealTradeStatus:
                "closed",

              lastRealTradeType:
                "SELL",

              lastRealTradeAmount:
                investedAmount,

              lastRealTradeBuyPrice:
                buyPrice,

              lastRealTradeSellPrice:
                sellPrice,

              lastRealTradeSettlement:
                finalSettlement,

              lastRealTradeProfitLoss:
                profitLoss,

              lastRealTradeClosedAt:
                new Date(),

              updatedAt:
                new Date(),
            }
          );

          result = {
            investedAmount,

            buyPrice,

            sellPrice,

            profitLoss,

            settlement:
              finalSettlement,
          };
        }
      );

      // -----------------------------------------------
      // UPDATE UI BALANCE
      // -----------------------------------------------

      setBalance(
        (previous) =>
          Number(previous || 0) +
          Number(
            result.settlement
          )
      );

      setActiveTrade(null);

      setLastTrade({
        type: "SELL",

        amount:
          result.investedAmount,

        buyPrice:
          result.buyPrice,

        sellPrice:
          result.sellPrice,

        settlement:
          result.settlement,

        profitLoss:
          result.profitLoss,

        closedAt:
          new Date(),
      });

      const profit =
        result.profitLoss;

      if (profit > 0) {
        setTradeStatus(
          `Trade closed with profit ৳${formatMoney(
            profit
          )}.`
        );

        notification.success({
          message:
            "Trade Closed — Profit",

          description:
            `Profit: ৳${formatMoney(
              profit
            )}`,
        });
      } else if (profit < 0) {
        setTradeStatus(
          `Trade closed with loss ৳${formatMoney(
            Math.abs(profit)
          )}.`
        );

        notification.warning({
          message:
            "Trade Closed — Loss",

          description:
            `Loss: ৳${formatMoney(
              Math.abs(profit)
            )}`,
        });
      } else {
        setTradeStatus(
          "Trade closed with no profit or loss."
        );

        notification.success({
          message:
            "Trade Closed",

          description:
            "No profit or loss.",
        });
      }
    } catch (error) {
      console.error(
        "Real SELL error:",
        error
      );

      setTradeStatus(
        error?.message ||
          "Unable to close trade."
      );

      notification.error({
        message:
          "SELL Failed",

        description:
          error?.message ||
          "Unable to close trade.",
      });
    } finally {
      setTradeLoading(false);
    }
  };

  // =====================================================
  // QUICK AMOUNT
  // =====================================================

  const quickAmounts = [
    500,
    1000,
    2000,
    5000,
  ];

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user?.uid) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">
            Real Trading
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Real Trading ব্যবহার করতে
            প্রথমে আপনার account-এ login
            করুন।
          </p>

          <div className="mt-5 inline-flex rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-3 text-sm font-semibold text-yellow-300">
            Please Login
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // VALUES
  // =====================================================

  const formattedBalance =
    balance !== null
      ? formatMoney(balance)
      : "0.00";

  const priceChange =
    activeTrade &&
    activeTrade.buyPrice > 0 &&
    currentPrice
      ? ((currentPrice -
          activeTrade.buyPrice) /
          activeTrade.buyPrice) *
        100
      : 0;

  const estimatedPL =
    activeTrade &&
    activeTrade.buyPrice > 0 &&
    currentPrice
      ? activeTrade.amount *
        ((currentPrice -
          activeTrade.buyPrice) /
          activeTrade.buyPrice)
      : 0;

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="w-full min-w-0 space-y-5">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Real Trading
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Trade using your real account
            balance with live BTC/USDT
            market price.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              marketStatus === "Market Live"
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          />

          <span className="text-xs font-semibold text-gray-300">
            {marketStatus}
          </span>
        </div>
      </div>

      {/* ================================================= */}
      {/* TOP CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* REAL BALANCE */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <p className="text-sm text-gray-400">
            Real Balance
          </p>

          {balanceLoading ? (
            <p className="mt-2 text-sm text-gray-500">
              Loading...
            </p>
          ) : (
            <>
              <h2 className="mt-1 text-3xl font-bold text-white">
                ৳{formattedBalance}
              </h2>

              <p
                className={`mt-2 text-xs font-semibold ${
                  balance >= MIN_BALANCE
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {balance >= MIN_BALANCE
                  ? "Trading Available"
                  : "Minimum ৳500 Required"}
              </p>
            </>
          )}
        </div>

        {/* BTC PRICE */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <p className="text-sm text-gray-400">
            BTC / USDT
          </p>

          {priceLoading &&
          !currentPrice ? (
            <p className="mt-2 text-sm text-gray-500">
              Loading...
            </p>
          ) : (
            <>
              <h2 className="mt-1 text-2xl font-bold text-white">
                $
                {formatBTCPrice(
                  currentPrice
                )}
              </h2>

              <p className="mt-2 text-xs text-green-400">
                Live Market Price
              </p>
            </>
          )}
        </div>

        {/* ACTIVE TRADE */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <p className="text-sm text-gray-400">
            Trade Status
          </p>

          {activeTrade ? (
            <>
              <h2 className="mt-1 text-xl font-bold text-yellow-400">
                Active Trade
              </h2>

              <p className="mt-2 text-sm text-gray-300">
                ৳
                {formatMoney(
                  activeTrade.amount
                )}
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-1 text-xl font-bold text-green-400">
                No Active Trade
              </h2>

              <p className="mt-2 text-xs text-gray-500">
                Ready for a new trade.
              </p>
            </>
          )}
        </div>

        {/* REQUIREMENT */}

        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <p className="text-sm text-gray-400">
            Minimum Balance
          </p>

          <h2 className="mt-1 text-2xl font-bold text-yellow-400">
            ৳500
          </h2>

          <p className="mt-2 text-xs text-gray-500">
            Required to start real
            trading.
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* LIVE CHART */}
      {/* ================================================= */}

      <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
        <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-white">
              BTC / USDT
            </h2>

            <p className="text-xs text-gray-500">
              1 Minute Candlestick
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-white">
              $
              {formatBTCPrice(
                currentPrice
              )}
            </p>

            <p className="text-xs text-gray-500">
              Live Price
            </p>
          </div>
        </div>

        <div className="relative w-full min-w-0 overflow-hidden">
          <div
            ref={chartContainerRef}
            className="h-[300px] w-full min-w-0 sm:h-[340px] md:h-[380px] lg:h-[420px] xl:h-[450px]"
          />
        </div>
      </div>

      {/* ================================================= */}
      {/* ACTIVE TRADE P/L */}
      {/* ================================================= */}

      {activeTrade && (
        <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500">
                Investment
              </p>

              <p className="mt-1 font-bold text-white">
                ৳
                {formatMoney(
                  activeTrade.amount
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                BUY Price
              </p>

              <p className="mt-1 font-bold text-white">
                $
                {formatBTCPrice(
                  activeTrade.buyPrice
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Current Price
              </p>

              <p className="mt-1 font-bold text-white">
                $
                {formatBTCPrice(
                  currentPrice
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Estimated P/L
              </p>

              <p
                className={`mt-1 font-bold ${
                  estimatedPL >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {estimatedPL >= 0
                  ? "+"
                  : "-"}
                ৳
                {formatMoney(
                  Math.abs(
                    estimatedPL
                  )
                )}
              </p>

              <p
                className={`text-xs ${
                  priceChange >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {priceChange >= 0
                  ? "+"
                  : ""}
                {priceChange.toFixed(
                  2
                )}
                %
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* TRADING PANEL */}
      {/* ================================================= */}

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* AMOUNT */}

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Trade Amount
            </label>

            <input
              type="number"
              min="1"
              max={balance || 0}
              value={tradeAmount}
              onChange={(e) =>
                setTradeAmount(
                  e.target.value
                )
              }
              disabled={
                balanceLoading ||
                balance === null ||
                balance < MIN_BALANCE ||
                !!activeTrade ||
                tradeLoading
              }
              className="
                h-12
                w-full
                rounded-xl
                border
                border-white/10
                bg-slate-800
                px-4
                text-lg
                font-bold
                text-white
                outline-none
                transition
                focus:border-yellow-400
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              placeholder="Enter amount"
            />
          </div>

          {/* BUY */}

          <button
            type="button"
            onClick={handleBuy}
            disabled={
              balanceLoading ||
              balance === null ||
              balance < MIN_BALANCE ||
              !tradeAmount ||
              Number(tradeAmount) <= 0 ||
              Number(tradeAmount) >
                Number(balance) ||
              !!activeTrade ||
              tradeLoading ||
              !currentPrice
            }
            className="
              h-12
              rounded-xl
              bg-green-500
              px-6
              font-bold
              text-white
              transition
              hover:bg-green-400
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
              md:mt-7
            "
          >
            {tradeLoading &&
            !activeTrade
              ? "PROCESSING..."
              : activeTrade
              ? "BUY DISABLED"
              : balance <
                MIN_BALANCE
              ? "MIN. ৳500 REQUIRED"
              : "BUY"}
          </button>

          {/* SELL */}

          <button
            type="button"
            onClick={handleSell}
            disabled={
              !activeTrade ||
              tradeLoading ||
              !currentPrice
            }
            className="
              h-12
              rounded-xl
              bg-red-500
              px-6
              font-bold
              text-white
              transition
              hover:bg-red-400
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
              md:mt-7
            "
          >
            {tradeLoading &&
            activeTrade
              ? "PROCESSING..."
              : activeTrade
              ? "SELL / CLOSE"
              : "SELL DISABLED"}
          </button>
        </div>

        {/* QUICK AMOUNT */}

        <div className="mt-5">
          <p className="mb-2 text-sm text-gray-400">
            Quick Amount
          </p>

          <div className="flex flex-wrap gap-2">
            {quickAmounts.map(
              (amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() =>
                    setTradeAmount(
                      amount
                    )
                  }
                  disabled={
                    balanceLoading ||
                    balance === null ||
                    balance <
                      MIN_BALANCE ||
                    amount >
                      balance ||
                    !!activeTrade ||
                    tradeLoading
                  }
                  className="
                    rounded-lg
                    border
                    border-white/10
                    bg-slate-800
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:border-yellow-400
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  ৳
                  {amount.toLocaleString()}
                </button>
              )
            )}
          </div>
        </div>

        {/* ACTIVE TRADE */}

        {activeTrade && (
          <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center">
            <p className="text-sm font-semibold text-green-400">
              Active Trade: ৳
              {formatMoney(
                activeTrade.amount
              )}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              BUY Price: $
              {formatBTCPrice(
                activeTrade.buyPrice
              )}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Your trading amount is
              currently locked.
            </p>
          </div>
        )}

        {/* STATUS */}

        {tradeStatus && (
          <div className="mt-5 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-center text-sm font-semibold text-yellow-300">
            {tradeStatus}
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* LAST TRADE */}
      {/* ================================================= */}

      {lastTrade && (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white">
                Last Trade
              </h3>

              <p className="text-xs text-gray-500">
                Most recent closed trade
              </p>
            </div>

            <span
              className={`rounded-lg px-3 py-1 text-xs font-bold ${
                lastTrade.profitLoss >=
                0
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {lastTrade.profitLoss >=
              0
                ? "PROFIT"
                : "LOSS"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div>
              <p className="text-xs text-gray-500">
                Amount
              </p>

              <p className="mt-1 font-semibold text-white">
                ৳
                {formatMoney(
                  lastTrade.amount
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                BUY
              </p>

              <p className="mt-1 font-semibold text-white">
                $
                {formatBTCPrice(
                  lastTrade.buyPrice
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                SELL
              </p>

              <p className="mt-1 font-semibold text-white">
                $
                {formatBTCPrice(
                  lastTrade.sellPrice
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                P/L
              </p>

              <p
                className={`mt-1 font-semibold ${
                  lastTrade.profitLoss >=
                  0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {lastTrade.profitLoss >=
                0
                  ? "+"
                  : "-"}
                ৳
                {formatMoney(
                  Math.abs(
                    lastTrade.profitLoss
                  )
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">
                Settlement
              </p>

              <p className="mt-1 font-semibold text-white">
                ৳
                {formatMoney(
                  lastTrade.settlement
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MINIMUM BALANCE WARNING */}
      {/* ================================================= */}

      {!balanceLoading &&
        balance !== null &&
        balance < MIN_BALANCE && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <h3 className="font-bold text-red-400">
              Real Trading Unavailable
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              আপনার current balance ৳
              {formattedBalance}। Real
              Trading করতে account-এ
              minimum ৳500 balance
              থাকতে হবে।
            </p>
          </div>
        )}
    </div>
  );
}