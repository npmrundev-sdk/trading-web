// GET /api/price/history  ->  { candles: [{ time, open, high, low, close }] }
// 1 week of 1-minute candles (time = unix seconds). Public, same for every user.

import { NextResponse } from "next/server";
import { getHistory } from "@/components/lib/Priceengine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { candles: getHistory(Date.now()) },
    { headers: { "Cache-Control": "no-store" } }
  );
}