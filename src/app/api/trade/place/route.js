// POST /api/trade/place
// Deduct balance + create a pending trade in `tradeHistory`.
//
// Firestore used here:
//   balance/{uid}        -> { amount, uid, updatedAt }     (already exists in your project)
//   tradeHistory/{auto}  -> one document per trade          (new collection)
//   price                -> lib/priceEngine.js              (no database needed)
//
// Everything important happens on the server: the user can only choose { side, amount }.
// Entry price, time and balance are decided here, so nothing can be faked from the browser.

import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/components/lib/Firebaseadmin";
import { verifyUser, HttpError } from "@/components/lib/Verifyuser";
import { getPriceAt } from "@/components/lib/Priceengine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BALANCE_COL = "balance";
const TRADES_COL = "tradeHistory";

const TRADE_DURATION_SEC = 30;
const MIN_AMOUNT = 1;
const MAX_AMOUNT = 10000;

const round2 = (n) => Math.round(n * 100) / 100;

export async function POST(request) {
  try {
    /* 1) who is calling? */
    const decoded = await verifyUser(request);
    const uid = decoded.uid;

    /* 2) validate input */
    let body;
    try {
      body = await request.json();
    } catch {
      throw new HttpError(400, "Invalid request.");
    }

    const side = body?.side;
    if (side !== "buy" && side !== "sell") {
      throw new HttpError(400, "Side must be buy or sell.");
    }

    const amount = round2(Number(body?.amount));
    if (!Number.isFinite(amount) || amount < MIN_AMOUNT) {
      throw new HttpError(400, `Minimum amount is $${MIN_AMOUNT}.`);
    }
    if (amount > MAX_AMOUNT) {
      throw new HttpError(400, `Maximum amount is $${MAX_AMOUNT}.`);
    }

    /* 3) entry price comes from the server price engine, never from the client */
    const now = Date.now();
    const entryPrice = getPriceAt(now);

    /* 4) one transaction: check -> deduct balance -> create trade */
    const balanceRef = adminDb.doc(`${BALANCE_COL}/${uid}`);
    const tradeRef = adminDb.collection(TRADES_COL).doc();
    const pendingQuery = adminDb
      .collection(TRADES_COL)
      .where("userId", "==", uid)
      .where("status", "==", "pending")
      .limit(1);

    const settleAtMs = now + TRADE_DURATION_SEC * 1000;

    const { newBalance } = await adminDb.runTransaction(async (tx) => {
      const balanceSnap = await tx.get(balanceRef);
      if (!balanceSnap.exists) {
        throw new HttpError(404, "Balance account not found.");
      }

      // only one running trade at a time (buy and sell both stay locked)
      const pendingSnap = await tx.get(pendingQuery);
      if (!pendingSnap.empty) {
        throw new HttpError(409, "You already have a running trade.");
      }

      const balance = Number(balanceSnap.data().amount) || 0;
      if (amount > balance) {
        throw new HttpError(400, "Not enough balance.");
      }

      const updatedBalance = round2(balance - amount);

      tx.update(balanceRef, {
        amount: updatedBalance,
        updatedAt: Timestamp.fromMillis(now),
      });

      tx.set(tradeRef, {
        userId: uid,
        userEmail: decoded.email ?? null,
        side,
        amount,
        entryPrice,
        exitPrice: null,
        status: "pending", // pending -> win | loss
        payout: 0,
        duration: TRADE_DURATION_SEC,
        createdAt: Timestamp.fromMillis(now),
        settleAt: Timestamp.fromMillis(settleAtMs),
        settledAt: null,
        createdAtMs: now,
        settleAtMs,
      });

      return { newBalance: updatedBalance };
    });

    /* 5) response, same shape the ActiveTradeCard expects */
    return NextResponse.json(
      {
        trade: {
          id: tradeRef.id,
          side,
          amount,
          entryPrice,
          status: "pending",
          duration: TRADE_DURATION_SEC,
          createdAt: now,
          settleAt: settleAtMs, // unix ms
        },
        balance: newBalance,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[api/trade/place]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}