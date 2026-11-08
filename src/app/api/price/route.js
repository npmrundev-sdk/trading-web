// GET /api/price  ->  { price, candle, time }
// Public. The same price for every user (see lib/priceEngine.js).

import { NextResponse } from "next/server";
import { getPriceAt, getLiveCandle } from "@/components/lib/Priceengine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();

  return NextResponse.json(
    {
      price: getPriceAt(now),
      candle: getLiveCandle(now), // current minute candle, moves every second
      time: now,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}