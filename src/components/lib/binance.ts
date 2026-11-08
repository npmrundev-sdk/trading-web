// src/lib/binance.ts

const BINANCE_API = "https://api.binance.com/api/v3";

/**
 * Get current BTC/USDT price
 */
export async function getBTCPrice(): Promise<number> {
  const response = await fetch(
    `${BINANCE_API}/ticker/price?symbol=BTCUSDT`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch BTC price");
  }

  const data = await response.json();

  if (!data?.price) {
    throw new Error("Invalid BTC price response");
  }

  return Number(data.price);
}

/**
 * Get BTC/USDT candlestick data
 *
 * interval examples:
 * 1m, 3m, 5m, 15m, 30m,
 * 1h, 2h, 4h, 6h, 8h, 12h,
 * 1d, 3d, 1w
 */
export async function getBTCKlines(
  interval: string = "1m",
  limit: number = 100
) {
  const params = new URLSearchParams({
    symbol: "BTCUSDT",
    interval,
    limit: String(limit),
  });

  const response = await fetch(
    `${BINANCE_API}/klines?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch BTC candlestick data");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid BTC candlestick response");
  }

  return data.map((candle: any) => ({
    time: Math.floor(Number(candle[0]) / 1000),
    open: Number(candle[1]),
    high: Number(candle[2]),
    low: Number(candle[3]),
    close: Number(candle[4]),
  }));
}
