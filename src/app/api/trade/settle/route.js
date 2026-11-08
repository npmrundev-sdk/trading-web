// POST /api/trade/settle
// Decide the result of a trade after its 30 seconds are over.
//
//   body (optional): { tradeId }
//     - with tradeId    -> settle that trade
//     - without tradeId -> settle the user's running trade (used on page load / refresh)
//
// Rules:
//   buy  wins if exitPrice >  entryPrice
//   sell wins if exitPrice <  entryPrice
//   same price (tie) counts as a loss
//   win  -> payout = amount x 2 is added to balance/{uid}.amount
//   loss -> nothing is added (the amount was already deducted when the trade was placed)
//
// Safe to call twice: the first call settles, the second one just returns the same result.

import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/components/lib/Firebaseadmin";
import { verifyUser, HttpError } from "@/components/lib/Verifyuser";
import { getPriceAt } from "@/components/lib/Priceengine";
import { PAYOUT_MULTIPLIER } from "@/components/lib/Tradeconfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BALANCE_COL = "balance";
const TRADES_COL = "tradeHistory";

const round2 = (n) => Math.round(n * 100) / 100;

/** shape ResultModal expects */
const toResult = (id, t) => ({
  tradeId: id,
  status: t.status, // "win" | "loss"
  side: t.side,
  amount: t.amount,
  payout: t.payout,
  entryPrice: t.entryPrice,
  exitPrice: t.exitPrice,
});

/** shape ActiveTradeCard expects */
const toActive = (id, t) => ({
  id,
  side: t.side,
  amount: t.amount,
  entryPrice: t.entryPrice,
  status: "pending",
  duration: t.duration,
  createdAt: t.createdAtMs,
  settleAt: t.settleAtMs,
});

export async function POST(request) {
  try {
    /* 1) who is calling? */
    const decoded = await verifyUser(request);
    const uid = decoded.uid;

    /* 2) body is optional */
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const tradeId = typeof body?.tradeId === "string" ? body.tradeId : null;

    /* 3) which trade? */
    let tradeRef;
    if (tradeId) {
      tradeRef = adminDb.collection(TRADES_COL).doc(tradeId);
    } else {
      const snap = await adminDb
        .collection(TRADES_COL)
        .where("userId", "==", uid)
        .where("status", "==", "pending")
        .limit(1)
        .get();

      if (snap.empty) {
        return NextResponse.json({ status: "none" }); // nothing is running
      }
      tradeRef = snap.docs[0].ref;
    }

    /* 4) exit price = price at the exact second the trade ends (see below) */
    const balanceRef = adminDb.doc(`${BALANCE_COL}/${uid}`);

    /* 5) settle inside ONE transaction (so it can never be paid twice) */
    const outcome = await adminDb.runTransaction(async (tx) => {
      const [tradeSnap, balanceSnap] = await Promise.all([
        tx.get(tradeRef),
        tx.get(balanceRef),
      ]);

      // same message for "missing" and "not yours" so ids can't be probed
      if (!tradeSnap.exists || tradeSnap.data().userId !== uid) {
        throw new HttpError(404, "Trade not found.");
      }
      if (!balanceSnap.exists) {
        throw new HttpError(404, "Balance account not found.");
      }

      const trade = tradeSnap.data();
      const balance = Number(balanceSnap.data().amount) || 0;

      // already settled (double call / second tab) -> return the saved result
      if (trade.status !== "pending") {
        return {
          kind: "settled",
          already: true,
          result: toResult(tradeSnap.id, trade),
          balance,
        };
      }

      // 30s not over yet (client clock slightly ahead) -> ask client to retry
      const now = Date.now();
      if (now < trade.settleAtMs) {
        return {
          kind: "pending",
          trade: toActive(tradeSnap.id, trade),
          retryAfterMs: trade.settleAtMs - now,
        };
      }

      // price at the exact second the 30s ended (not the moment this API was called)
      const exitPrice = getPriceAt(trade.settleAtMs);
      const won =
        trade.side === "buy"
          ? exitPrice > trade.entryPrice
          : exitPrice < trade.entryPrice;

      const payout = won ? round2(trade.amount * PAYOUT_MULTIPLIER) : 0;
      const newBalance = won ? round2(balance + payout) : balance;

      tx.update(tradeRef, {
        status: won ? "win" : "loss",
        exitPrice,
        payout,
        settledAt: Timestamp.fromMillis(now),
        settledAtMs: now,
      });

      if (won) {
        tx.update(balanceRef, {
          amount: newBalance,
          updatedAt: Timestamp.fromMillis(now),
        });
      }

      return {
        kind: "settled",
        already: false,
        result: toResult(tradeSnap.id, {
          ...trade,
          status: won ? "win" : "loss",
          exitPrice,
          payout,
        }),
        balance: newBalance,
      };
    });

    /* 6) response */
    if (outcome.kind === "pending") {
      return NextResponse.json(
        {
          status: "pending",
          trade: outcome.trade,
          retryAfterMs: outcome.retryAfterMs,
        },
        { status: 202 }
      );
    }

    return NextResponse.json({
      status: "settled",
      alreadySettled: outcome.already,
      result: outcome.result,
      balance: outcome.balance,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[api/trade/settle]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}