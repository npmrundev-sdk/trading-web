// SERVER ONLY. Shared by every /api/* route.
//
// Verifies the logged-in user WITHOUT firebase-admin/auth.
// The browser sends its Firebase ID token ("Authorization: Bearer <token>"),
// and we ask Google "is this token valid, and whose is it?".
// The uid always comes from Google's answer, never from the browser.

/** Throw this inside a route to return a clean error to the client. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Web API key = the "apiKey" in your firebase.ts config (it is public, not a secret)
const getApiKey = () =>
  (process.env.FIREBASE_WEB_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "")
    .trim()
    .replace(/,$/, "")
    .replace(/^["']|["']$/g, "");

/**
 * Returns { uid, email } of the logged-in user, or throws HttpError(401).
 */
export async function verifyUser(request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw new HttpError(401, "You are not logged in.");

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error("[verifyUser] FIREBASE_WEB_API_KEY is missing");
    throw new HttpError(500, "Server setup problem: FIREBASE_WEB_API_KEY is missing.");
  }

  let res;
  try {
    res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
        cache: "no-store",
      }
    );
  } catch (err) {
    console.error("[verifyUser] could not reach Google:", err?.message);
    throw new HttpError(503, "Could not reach the login service. Try again.");
  }

  const data = await res.json().catch(() => ({}));
  const user = data?.users?.[0];

  if (!res.ok || !user?.localId) {
    const reason = data?.error?.message || `HTTP ${res.status}`;
    console.error("[verifyUser] token rejected:", reason);

    if (reason.includes("TOKEN_EXPIRED")) {
      throw new HttpError(401, "Session expired. Please log in again.");
    }
    throw new HttpError(401, `Login check failed (${reason}).`);
  }

  if (user.disabled) throw new HttpError(403, "This account is disabled.");

  return { uid: user.localId, email: user.email ?? null };
}