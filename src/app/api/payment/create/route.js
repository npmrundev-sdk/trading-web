
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/components/lib/Firebaseadmin";
import { FieldValue } from "firebase-admin/firestore";

// ==========================================
// CONFIG
// ==========================================

const OAZPAY_URL =
  "https://api.oazpay.com/api/v1/payment/get-payment-url";

const BANK_CONFIG = {
  Bkash: {
    name: "bKash",
    gatewayBank: "BKASH",
  },
  Nagad: {
    name: "Nagad",
    gatewayBank: "NAGAD",
  },
};

const PAYMENT_TYPES = {
  PAYMENT: "Payment",
  SEND_MONEY: "Send Money",
  CASH_OUT: "Cash Out",
};

// ==========================================
// GET AUTHENTICATED USER
// ==========================================

async function getAuthenticatedUser(request) {
  const authorization = request.headers.get("authorization") || "";

  if (!authorization.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  return await adminAuth.verifyIdToken(token);
}

// ==========================================
// EXTRACT PAYMENT ID
// ==========================================

function extractPaymentId(paymentUrl) {
  try {
    const url = new URL(paymentUrl);
    const token = url.searchParams.get("token");

    if (!token) return null;

    const payload = token.split(".")[1];

    if (!payload) return null;

    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    return decoded?.id || null;
  } catch {
    return null;
  }
}

// ==========================================
// POST
// ==========================================

export async function POST(request) {
  let transactionRef = null;

  try {
    // 1. Authentication
    const decodedUser = await getAuthenticatedUser(request);
    const uid = decodedUser.uid;

    // 2. Request data
    const body = await request.json();

    const amount = Number(body.amount);
    const bank = body.bank;
    const paymentType = body.type;

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isSafeInteger(Math.round(amount * 100))
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid payment amount." },
        { status: 400 }
      );
    }

    if (!BANK_CONFIG[bank]) {
      return NextResponse.json(
        { success: false, message: "Invalid payment bank." },
        { status: 400 }
      );
    }

    if (!PAYMENT_TYPES[paymentType]) {
      return NextResponse.json(
        { success: false, message: "Invalid payment type." },
        { status: 400 }
      );
    }

    // 3. Check environment variables
    const name = process.env.OAZPAY_NAME;
    const password = process.env.OAZPAY_PASSWORD;
    const callbackUrl = process.env.OAZPAY_CALLBACK_URL;

    if (!name || !password || !callbackUrl) {
      console.error("OazPay environment variables are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Payment service is not configured.",
        },
        { status: 500 }
      );
    }

    // 4. Check bank active status from Firestore
    const bankSnapshot = await adminDb
      .collection("bankAccounts")
      .where("bankType", "==", bank)
      .limit(1)
      .get();

    if (bankSnapshot.empty) {
      return NextResponse.json(
        {
          success: false,
          message: "This bank is currently unavailable.",
        },
        { status: 400 }
      );
    }

    const bankData = bankSnapshot.docs[0].data();

    const hasActiveAccount =
      Array.isArray(bankData.accounts) &&
      bankData.accounts.some(
        (account) => account.status === true
      );

    if (!hasActiveAccount) {
      return NextResponse.json(
        {
          success: false,
          message: "This bank is currently inactive.",
        },
        { status: 400 }
      );
    }

    // 5. Get user details from trusted Firestore
    const userRef = adminDb.collection("users").doc(uid);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    const userData = userSnapshot.data();

    // 6. Create pending transaction first
    transactionRef = adminDb.collection("transactions").doc();

    await transactionRef.set({
      uid,
      userID: userData.userID || "",
      email: decodedUser.email || userData.email || "",

      type: "deposit",
      amount,

      bank,
      bankName: BANK_CONFIG[bank].name,

      method: PAYMENT_TYPES[paymentType],
      paymentMethod: PAYMENT_TYPES[paymentType],

      receivingNumber: "",
      transactionID: "",

      paymentId: "",
      paymentType,
      source: "oazpay",

      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });

    // 7. Create OazPay payment
    const gatewayResponse = await fetch(OAZPAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        name,
        password,
        call_back_url: callbackUrl,
        type: paymentType,
        bank: BANK_CONFIG[bank].gatewayBank,
      }),
      cache: "no-store",
    });

    const gatewayData = await gatewayResponse.json();

    const paymentUrl = gatewayData?.data?.paymentUrl;

    if (
      !gatewayResponse.ok ||
      !gatewayData?.success ||
      !paymentUrl
    ) {
      await transactionRef.update({
        status: "failed",
        gatewayMessage:
          gatewayData?.message || "Payment initialization failed.",
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        {
          success: false,
          message:
            gatewayData?.message ||
            "Failed to initialize OazPay payment.",
        },
        { status: 502 }
      );
    }

    // 8. Extract payment ID
    const paymentId = extractPaymentId(paymentUrl);

    if (!paymentId) {
      await transactionRef.update({
        status: "failed",
        gatewayMessage: "Could not extract payment ID.",
        updatedAt: FieldValue.serverTimestamp(),
      });

      return NextResponse.json(
        {
          success: false,
          message: "Could not read payment ID from OazPay.",
        },
        { status: 502 }
      );
    }

    // 9. Save gateway payment details
    await transactionRef.update({
      paymentId,
      transactionID: paymentId,
      paymentUrl,
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 10. Return payment URL
    return NextResponse.json({
      success: true,
      message: "Payment created successfully.",
      paymentUrl,
      paymentId,
      transactionId: transactionRef.id,
    });
  } catch (error) {
    console.error("OazPay create API error:", error);

    if (transactionRef) {
      try {
        await transactionRef.update({
          status: "failed",
          updatedAt: FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
        console.error("Transaction update error:", updateError);
      }
    }

    if (error.message === "UNAUTHORIZED" ||
        error.code === "auth/id-token-expired" ||
        error.code === "auth/argument-error" ||
        error.code === "auth/invalid-id-token") {
      return NextResponse.json(
        { success: false, message: "Please login again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create payment. Please try again.",
      },
      { status: 500 }
    );
  }
}
