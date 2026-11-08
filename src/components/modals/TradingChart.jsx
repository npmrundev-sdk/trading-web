"use client";

import { useEffect, useRef, useState } from "react";

import {
  createChart,
  ColorType,
  CandlestickSeries,
} from "lightweight-charts";

import {
  getBTCPrice,
  getBTCKlines,
} from "@/components/lib/binance";

import { notification } from "antd";

import {
  doc,
  getDoc,
  runTransaction,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function TradingChart() {
  const { user } = useAuth();

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  const candleDataRef = useRef([]);
  const websocketRef = useRef(null);

  // =====================================================
  // DEMO BALANCE
  // =====================================================

  const [balance, setBalance] = useState(null);

  const [balanceLoading, setBalanceLoading] =
    useState(true);

  const [hasDemoBalance, setHasDemoBalance] =
    useState(false);

  // =====================================================
  // TRADE AMOUNT
  // =====================================================

  const [tradeAmount, setTradeAmount] =
    useState(100);

  // =====================================================
  // ACTIVE TRADE
  // =====================================================

  const [activeTrade, setActiveTrade] =
    useState(null);

  // =====================================================
  // LIVE PRICE
  // =====================================================

  const [currentPrice, setCurrentPrice] =
    useState(0);

  // =====================================================
  // LOADING
  // =====================================================

  const [isLoading, setIsLoading] =
    useState(true);

  // =====================================================
  // MARKET STATUS
  // =====================================================

  const [marketStatus, setMarketStatus] =
    useState("Connecting...");

  // =====================================================
  // TRADE STATUS
  // =====================================================

  const [tradeStatus, setTradeStatus] =
    useState("");

  const [lastTrade, setLastTrade] =
    useState(null);

  const [tradeLoading, setTradeLoading] =
    useState(false);

  const [demoLoading, setDemoLoading] =
    useState(false);

  // =====================================================
  // LOAD USER DEMO BALANCE
  // =====================================================

  useEffect(() => {
    const loadDemoBalance = async () => {
      // User not logged in
      if (!user?.uid) {
        setBalance(null);
        setHasDemoBalance(false);
        setActiveTrade(null);
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

        const balanceSnap =
          await getDoc(balanceRef);

        if (!balanceSnap.exists()) {
          setBalance(null);
          setHasDemoBalance(false);
          setActiveTrade(null);
          return;
        }

        const data = balanceSnap.data();

        // =================================================
        // DEMO BALANCE
        // =================================================

        if (
          data.demoBalance !== undefined &&
          data.demoBalance !== null
        ) {
          setBalance(
            Number(data.demoBalance || 0)
          );

          setHasDemoBalance(true);
        } else {
          setBalance(null);
          setHasDemoBalance(false);
        }

        // =================================================
        // ACTIVE TRADE
        // =================================================

        if (
          data.activeTradeAmount &&
          Number(data.activeTradeAmount) > 0
        ) {
          setActiveTrade({
            amount: Number(
              data.activeTradeAmount
            ),
            buyPrice: Number(
              data.activeTradeBuyPrice || 0
            ),
            createdAt:
              data.activeTradeCreatedAt ||
              null,
          });
        } else {
          setActiveTrade(null);
        }
      } catch (error) {
        console.error(
          "Demo balance loading error:",
          error
        );

        notification.error({
          message: "Balance Error",
          description:
            "Failed to load demo balance.",
        });
      } finally {
        setBalanceLoading(false);
      }
    };

    loadDemoBalance();
  }, [user?.uid]);

  // =====================================================
  // GET DEMO BALANCE
  // =====================================================

  const handleGetDemoBalance = async () => {
    if (!user?.uid) {
      notification.warning({
        message: "Please Login",
        description:
          "Please login first to get demo balance.",
      });

      return;
    }

    try {
      setDemoLoading(true);

      const balanceRef = doc(
        db,
        "balance",
        user.uid
      );

      await runTransaction(
        db,
        async (transaction) => {
          const balanceSnap =
            await transaction.get(
              balanceRef
            );

          if (balanceSnap.exists()) {
            const data =
              balanceSnap.data();

            // Do not give demo balance twice
            if (
              data.demoBalance !==
                undefined &&
              data.demoBalance !== null
            ) {
              throw new Error(
                "Demo balance has already been claimed."
              );
            }

            transaction.update(
              balanceRef,
              {
                demoBalance: 10000,
              }
            );
          } else {
            transaction.set(
              balanceRef,
              {
                uid: user.uid,
                demoBalance: 10000,
                updatedAt:
                  new Date(),
              }
            );
          }
        }
      );

      setBalance(10000);
      setHasDemoBalance(true);

      notification.success({
        message:
          "Demo Balance Added",
        description:
          "৳10,000 demo balance has been added to your account.",
      });
    } catch (error) {
      console.error(
        "Demo balance error:",
        error
      );

      notification.error({
        message:
          "Demo Balance Failed",
        description:
          error?.message ||
          "Unable to get demo balance.",
      });
    } finally {
      setDemoLoading(false);
    }
  };

  // =====================================================
  // CHART + BINANCE MARKET DATA
  // =====================================================

  useEffect(() => {
    if (!chartContainerRef.current)
      return;

    let mounted = true;

    // ===================================================
    // CREATE CHART
    // ===================================================

    const chart = createChart(
      chartContainerRef.current,
      {
        width:
          chartContainerRef.current
            .clientWidth,

        height: 450,

        layout: {
          background: {
            type: ColorType.Solid,
            color: "#0b1220",
          },

          textColor: "#cbd5e1",
        },

        grid: {
          vertLines: {
            color:
              "rgba(255,255,255,0.06)",
          },

          horzLines: {
            color:
              "rgba(255,255,255,0.06)",
          },
        },

        rightPriceScale: {
          borderColor:
            "rgba(255,255,255,0.1)",
        },

        timeScale: {
          borderColor:
            "rgba(255,255,255,0.1)",

          timeVisible: true,
          secondsVisible: true,
        },

        crosshair: {
          mode: 1,
        },
      }
    );

    chartRef.current = chart;

    // ===================================================
    // CANDLE SERIES
    // ===================================================

    const candleSeries =
      chart.addSeries(
        CandlestickSeries,
        {
          upColor: "#22c55e",
          downColor: "#ef4444",

          borderVisible: false,

          wickUpColor: "#22c55e",
          wickDownColor: "#ef4444",
        }
      );

    candleSeriesRef.current =
      candleSeries;

    // ===================================================
    // LOAD MARKET DATA
    // ===================================================

    const loadMarketData =
      async () => {
        try {
          setIsLoading(true);

          setMarketStatus(
            "Loading market data..."
          );

          // Historical candles
          const candles =
            await getBTCKlines(
              "1m",
              100
            );

          if (!mounted) return;

          candleDataRef.current =
            candles;

          candleSeries.setData(
            candles
          );

          chart
            .timeScale()
            .fitContent();

          // Current BTC price
          const price =
            await getBTCPrice();

          if (!mounted) return;

          setCurrentPrice(price);

          setMarketStatus("Live");
        } catch (error) {
          console.error(
            "Binance market data error:",
            error
          );

          if (mounted) {
            setMarketStatus(
              "Connection Error"
            );
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

    loadMarketData();

    // ===================================================
    // BINANCE WEBSOCKET
    // ===================================================

    const websocket =
      new WebSocket(
        "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
      );

    websocketRef.current =
      websocket;

    websocket.onopen = () => {
      if (!mounted) return;

      setMarketStatus("Live");
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

        const updatedCandle = {
          time: Math.floor(
            Number(kline.t) / 1000
          ),

          open: Number(kline.o),

          high: Number(kline.h),

          low: Number(kline.l),

          close: Number(kline.c),
        };

        const candles =
          candleDataRef.current;

        const lastCandle =
          candles[
            candles.length - 1
          ];

        if (
          lastCandle &&
          lastCandle.time ===
            updatedCandle.time
        ) {
          candles[
            candles.length - 1
          ] = updatedCandle;
        } else {
          candles.push(
            updatedCandle
          );

          if (
            candles.length > 200
          ) {
            candles.shift();
          }
        }

        candleSeries.update(
          updatedCandle
        );

        setCurrentPrice(
          updatedCandle.close
        );
      } catch (error) {
        console.error(
          "WebSocket message error:",
          error
        );
      }
    };

    websocket.onerror = (
      error
    ) => {
      console.error(
        "Binance WebSocket error:",
        error
      );

      if (mounted) {
        setMarketStatus(
          "Connection Error"
        );
      }
    };

    websocket.onclose = () => {
      if (mounted) {
        setMarketStatus(
          "Disconnected"
        );
      }
    };

    // ===================================================
    // RESIZE
    // ===================================================

    const handleResize = () => {
      if (
        !chartContainerRef.current
      ) {
        return;
      }

      chart.applyOptions({
        width:
          chartContainerRef.current
            .clientWidth,
      });
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {
      mounted = false;

      window.removeEventListener(
        "resize",
        handleResize
      );

      if (
        websocketRef.current &&
        websocketRef.current
          .readyState ===
          WebSocket.OPEN
      ) {
        websocketRef.current.close();
      }

      websocketRef.current =
        null;

      chart.remove();

      chartRef.current = null;

      candleSeriesRef.current =
        null;
    };
  }, []);

  // =====================================================
  // BUY TRADE
  // =====================================================

  const handleBuy = async () => {
    // Login check
    if (!user?.uid) {
      notification.warning({
        message: "Please Login",
        description:
          "Please login first to start trading.",
      });

      return;
    }

    // Already active trade
    if (activeTrade) {
      notification.warning({
        message:
          "Trade Already Active",
        description:
          "Please sell your current trade before buying again.",
      });

      return;
    }

    const amount =
      Number(tradeAmount);

    // Validate amount
    if (!amount || amount <= 0) {
      setTradeStatus(
        "Please enter a valid trade amount."
      );

      return;
    }

    // Price
    if (
      !currentPrice ||
      currentPrice <= 0
    ) {
      setTradeStatus(
        "Market price is not available yet."
      );

      return;
    }

    // Balance
    if (
      balance === null ||
      balance === undefined
    ) {
      setTradeStatus(
        "Please get your demo balance first."
      );

      return;
    }

    if (amount > balance) {
      setTradeStatus(
        "Insufficient demo balance!"
      );

      return;
    }

    try {
      setTradeLoading(true);

      const balanceRef = doc(
        db,
        "balance",
        user.uid
      );

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
            Number(
              data.demoBalance || 0
            );

          const existingTrade =
            Number(
              data.activeTradeAmount ||
                0
            );

          if (existingTrade > 0) {
            throw new Error(
              "You already have an active trade."
            );
          }

          if (
            amount >
            currentBalance
          ) {
            throw new Error(
              "Insufficient demo balance."
            );
          }

          transaction.update(
            balanceRef,
            {
              demoBalance:
                currentBalance -
                amount,

              activeTradeAmount:
                amount,

              activeTradeBuyPrice:
                currentPrice,

              activeTradeCreatedAt:
                new Date(),

              activeTradeStatus:
                "open",

              updatedAt:
                new Date(),
            }
          );
        }
      );

      // Update local state
      setBalance(
        (previousBalance) =>
          previousBalance -
          amount
      );

      setActiveTrade({
        amount,
        buyPrice:
          currentPrice,
        createdAt:
          new Date(),
      });

      setLastTrade({
        type: "BUY",
        amount,
        price:
          currentPrice,
      });

      setTradeStatus(
        `BUY order placed at $${currentPrice.toFixed(
          2
        )} for ৳${amount.toFixed(
          2
        )}`
      );

      notification.success({
        message:
          "BUY Successful",
        description: `৳${amount.toFixed(
          2
        )} trade opened.`,
      });
    } catch (error) {
      console.error(
        "Buy trade error:",
        error
      );

      setTradeStatus(
        error?.message ||
          "Unable to place BUY order."
      );

      notification.error({
        message: "BUY Failed",
        description:
          error?.message ||
          "Unable to place BUY order.",
      });
    } finally {
      setTradeLoading(false);
    }
  };

  // =====================================================
  // SELL TRADE
  // =====================================================

  const handleSell = async () => {
    if (!user?.uid) {
      notification.warning({
        message: "Please Login",
        description:
          "Please login first to sell your trade.",
      });

      return;
    }

    // No active trade
    if (!activeTrade) {
      notification.warning({
        message:
          "No Active Trade",
        description:
          "Please BUY first before SELL.",
      });

      return;
    }

    if (
      !currentPrice ||
      currentPrice <= 0
    ) {
      setTradeStatus(
        "Market price is not available yet."
      );

      return;
    }

    try {
      setTradeLoading(true);

      const balanceRef = doc(
        db,
        "balance",
        user.uid
      );

      // ================================================
      // DEMO RESULT
      // ================================================

      const isWin =
        Math.random() > 0.5;

      const investedAmount =
        Number(
          activeTrade.amount
        );

      let profit = 0;
      let returnAmount = 0;

      if (isWin) {
        // 80% profit
        profit =
          investedAmount * 0.8;

        returnAmount =
          investedAmount +
          profit;
      } else {
        // LOSS
        profit = 0;
        returnAmount = 0;
      }

      // ================================================
      // FIRESTORE TRANSACTION
      // ================================================

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
            Number(
              data.demoBalance || 0
            );

          const firestoreTradeAmount =
            Number(
              data.activeTradeAmount ||
                0
            );

          if (
            firestoreTradeAmount <=
            0
          ) {
            throw new Error(
              "No active trade found."
            );
          }

          transaction.update(
            balanceRef,
            {
              demoBalance:
                currentBalance +
                returnAmount,

              // Clear active trade
              activeTradeAmount: 0,

              activeTradeBuyPrice: 0,

              activeTradeCreatedAt:
                null,

              activeTradeStatus:
                "closed",

              // Last trade information
              lastTradeType:
                "SELL",

              lastTradeAmount:
                investedAmount,

              lastTradePrice:
                currentPrice,

              lastTradeResult:
                isWin
                  ? "win"
                  : "loss",

              lastTradeProfit:
                profit,

              updatedAt:
                new Date(),
            }
          );
        }
      );

      // ================================================
      // UPDATE LOCAL STATE
      // ================================================

      setBalance(
        (previousBalance) =>
          previousBalance +
          returnAmount
      );

      setActiveTrade(null);

      setLastTrade({
        type: "SELL",
        amount:
          investedAmount,
        price:
          currentPrice,
        result:
          returnAmount,
        profit,
        isWin,
      });

      if (isWin) {
        setTradeStatus(
          `Trade WIN! +৳${profit.toFixed(
            2
          )} profit`
        );

        notification.success({
          message:
            "Trade WIN 🎉",
          description: `You earned ৳${profit.toFixed(
            2
          )} profit.`,
        });
      } else {
        setTradeStatus(
          `Trade LOSS! -৳${investedAmount.toFixed(
            2
          )}`
        );

        notification.error({
          message:
            "Trade LOSS",
          description: `You lost ৳${investedAmount.toFixed(
            2
          )}.`,
        });
      }
    } catch (error) {
      console.error(
        "Sell trade error:",
        error
      );

      setTradeStatus(
        error?.message ||
          "Unable to sell trade."
      );

      notification.error({
        message:
          "SELL Failed",
        description:
          error?.message ||
          "Unable to sell trade.",
      });
    } finally {
      setTradeLoading(false);
    }
  };

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formattedPrice =
    currentPrice > 0
      ? currentPrice.toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )
      : "Loading...";

  // =====================================================
  // FORMAT BALANCE
  // =====================================================

  const formattedBalance =
    balance !== null
      ? balance.toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )
      : "0.00";

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="w-full">

      {/* ========================================= */}
      {/* TOP TRADING INFO */}
      {/* ========================================= */}

      <div
        className="
          mb-4
          grid
          grid-cols-1
          gap-3
          md:grid-cols-3
        "
      >

        {/* ========================================= */}
        {/* DEMO BALANCE */}
        {/* ========================================= */}

        <div
          className="
            rounded-xl
            border
            border-white/10
            bg-slate-900
            p-4
          "
        >

          <p className="text-sm text-gray-400">
            Demo Balance
          </p>

          {!user?.uid ? (
            <div className="mt-3">

              <p className="text-sm font-semibold text-yellow-400">
                Please Login
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Login to use demo trading.
              </p>

            </div>
          ) : balanceLoading ? (
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                Loading balance...
              </p>
            </div>
          ) : !hasDemoBalance ? (
            <div className="mt-3">

              <p className="text-xs text-gray-500 mb-3">
                Get ৳10,000 demo balance
                to start trading.
              </p>

              <button
                type="button"
                onClick={
                  handleGetDemoBalance
                }
                disabled={demoLoading}
                className="
                  w-full
                  rounded-lg
                  bg-yellow-400
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-black
                  transition
                  hover:bg-yellow-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {demoLoading
                  ? "Getting..."
                  : "Get ৳10,000 Demo Balance"}
              </button>

            </div>
          ) : (
            <>
              <h2
                className="
                  mt-1
                  text-2xl
                  font-bold
                  text-white
                "
              >
                ৳{formattedBalance}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Demo trading balance
              </p>
            </>
          )}

        </div>

        {/* ========================================= */}
        {/* CURRENT PRICE */}
        {/* ========================================= */}

        <div
          className="
            rounded-xl
            border
            border-white/10
            bg-slate-900
            p-4
          "
        >

          <div className="flex items-center justify-between">

            <p className="text-sm text-gray-400">
              BTC/USDT
            </p>

            <span
              className={`
                rounded-full
                px-2
                py-1
                text-xs
                font-semibold
                ${
                  marketStatus ===
                  "Live"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }
              `}
            >
              ● {marketStatus}
            </span>

          </div>

          <h2
            className="
              mt-1
              text-2xl
              font-bold
              text-green-400
            "
          >
            ${formattedPrice}
          </h2>

        </div>

        {/* ========================================= */}
        {/* ACTIVE / LAST TRADE */}
        {/* ========================================= */}

        <div
          className="
            rounded-xl
            border
            border-white/10
            bg-slate-900
            p-4
          "
        >

          <p className="text-sm text-gray-400">
            {activeTrade
              ? "Active Trade"
              : "Last Trade"}
          </p>

          {activeTrade ? (
            <>
              <h2
                className="
                  mt-1
                  text-lg
                  font-bold
                  text-green-400
                "
              >
                BUY ৳
                {activeTrade.amount.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Buy Price: $
                {activeTrade.buyPrice.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </p>

              <p className="mt-1 text-xs font-semibold text-yellow-400">
                Trade is running...
              </p>
            </>
          ) : (
            <>
              <h2
                className="
                  mt-1
                  text-lg
                  font-bold
                  text-yellow-400
                "
              >
                {lastTrade
                  ? `${lastTrade.type} ৳${lastTrade.amount.toFixed(
                      2
                    )}`
                  : "No Trade"}
              </h2>

              {lastTrade && (
                <p className="mt-1 text-xs text-gray-500">
                  Price: $
                  {lastTrade.price.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              )}
            </>
          )}

        </div>

      </div>

      {/* ========================================= */}
      {/* CHART */}
      {/* ========================================= */}

      <div
        className="
          relative
          w-full
          overflow-hidden
          rounded-2xl
          border
          border-white/10
          bg-[#0b1220]
        "
      >

        {isLoading && (
          <div
            className="
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
              bg-[#0b1220]/80
              backdrop-blur-sm
            "
          >

            <div className="text-center">

              <div
                className="
                  mx-auto
                  mb-3
                  h-8
                  w-8
                  animate-spin
                  rounded-full
                  border-2
                  border-white/20
                  border-t-green-400
                "
              />

              <p className="text-sm text-gray-400">
                Loading BTC/USDT market data...
              </p>

            </div>

          </div>
        )}

        <div
          ref={chartContainerRef}
          className="w-full"
        />

      </div>

      {/* ========================================= */}
      {/* TRADE PANEL */}
      {/* ========================================= */}

      <div
        className="
          mt-5
          rounded-2xl
          border
          border-white/10
          bg-slate-900
          p-5
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
          "
        >

          {/* ========================================= */}
          {/* TRADE AMOUNT */}
          {/* ========================================= */}

          <div className="flex-1">

            <label
              className="
                mb-2
                block
                text-sm
                text-gray-400
              "
            >
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
                !user?.uid ||
                !!activeTrade ||
                tradeLoading
              }
              placeholder="Enter amount"
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
                placeholder:text-gray-500
                focus:border-yellow-400
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />

          </div>

          {/* ========================================= */}
          {/* BUY */}
          {/* ========================================= */}

          <button
            type="button"
            onClick={handleBuy}
            disabled={
              !user?.uid ||
              balance === null ||
              balanceLoading ||
              !hasDemoBalance ||
              isLoading ||
              !currentPrice ||
              !!activeTrade ||
              tradeLoading
            }
            className="
              h-12
              flex-1
              rounded-xl
              bg-green-500
              px-8
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
              : "BUY"}
          </button>

          {/* ========================================= */}
          {/* SELL */}
          {/* ========================================= */}

          <button
            type="button"
            onClick={handleSell}
            disabled={
              !user?.uid ||
              isLoading ||
              !currentPrice ||
              !activeTrade ||
              tradeLoading
            }
            className="
              h-12
              flex-1
              rounded-xl
              bg-red-500
              px-8
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
              ? "SELL"
              : "SELL DISABLED"}
          </button>

        </div>

        {/* ========================================= */}
        {/* ACTIVE TRADE NOTICE */}
        {/* ========================================= */}

        {activeTrade && (
          <div
            className="
              mt-4
              rounded-xl
              border
              border-green-500/20
              bg-green-500/10
              p-3
              text-center
            "
          >

            <p className="text-sm font-semibold text-green-400">
              Active Trade: ৳
              {activeTrade.amount.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Sell this trade to unlock
              the BUY button.
            </p>

          </div>
        )}

        {/* ========================================= */}
        {/* QUICK AMOUNT */}
        {/* ========================================= */}

        <div className="mt-4">

          <p className="mb-2 text-sm text-gray-400">
            Quick Amount
          </p>

          <div className="flex flex-wrap gap-2">

            {[100, 500, 1000, 2000].map(
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
                    !user?.uid ||
                    !!activeTrade ||
                    balance === null ||
                    amount > balance ||
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

        {/* ========================================= */}
        {/* TRADE STATUS */}
        {/* ========================================= */}

        {tradeStatus && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-yellow-400/20
              bg-yellow-400/10
              p-3
              text-center
              text-sm
              font-semibold
              text-yellow-300
            "
          >
            {tradeStatus}
          </div>
        )}

      </div>

    </div>
  );
}