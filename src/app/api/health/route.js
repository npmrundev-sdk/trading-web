// TEMPORARY: GET /api/health
// Tells you why Firebase Admin fails on Vercel. It never prints any secret value.
// DELETE THIS FILE once everything works.

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clean = (value = "") =>
  value.trim().replace(/,$/, "").replace(/^["']|["']$/g, "");

export async function GET() {
  const projectId = clean(process.env.FIREBASE_PROJECT_ID);
  const clientEmail = clean(process.env.FIREBASE_CLIENT_EMAIL);
  const key = clean(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n");

  const info = {
    hasProjectId: Boolean(projectId),
    hasClientEmail: Boolean(clientEmail),
    clientEmailLooksOk: clientEmail.endsWith(".iam.gserviceaccount.com"),
    hasPrivateKey: Boolean(key),
    keyStartsOk: key.startsWith("-----BEGIN PRIVATE KEY-----"),
    keyEndsOk: key.trimEnd().endsWith("-----END PRIVATE KEY-----"),
    keyLineCount: key ? key.split("\n").length : 0, // a good key has about 27 lines
    keyLength: key.length, // a good key is about 1600-1700 characters
    nodeVersion: process.version,
  };

  try {
    const { adminDb } = await import("@/components/lib/Firebaseadmin");
    await adminDb.doc("balance/health-check").get(); // just a read, creates nothing
    info.firebaseAdmin = "OK";
  } catch (err) {
    info.firebaseAdmin = `FAILED: ${err?.message || String(err)}`;
  }

  return NextResponse.json(info);
}