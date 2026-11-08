module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/components/lib/Firebaseadmin.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "adminAuth",
    ()=>adminAuth,
    "adminDb",
    ()=>adminDb
]);
// SERVER ONLY. Never import this file in a client component.
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import, [project]/node_modules/.pnpm/firebase-admin@13.10.0_@firebase+app-compat@0.5.16_@firebase+app@0.16.0/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import, [project]/node_modules/.pnpm/firebase-admin@13.10.0_@firebase+app-compat@0.5.16_@firebase+app@0.16.0/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import, [project]/node_modules/.pnpm/firebase-admin@13.10.0_@firebase+app-compat@0.5.16_@firebase+app@0.16.0/node_modules/firebase-admin)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
// .env.local keeps the private key on one line with "\n", turn them back into real new lines
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const app = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__["getApps"])()[0] ?? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"])({
    credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__["cert"])({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey
    })
});
const adminAuth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__["getAuth"])(app);
const adminDb = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__["getFirestore"])(app);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/lib/Verifyuser.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// SERVER ONLY. Shared by every /api/* route.
//
// Verifies the logged-in user WITHOUT firebase-admin/auth.
// The browser sends its Firebase ID token ("Authorization: Bearer <token>"),
// and we ask Google "is this token valid, and whose is it?".
// The uid always comes from Google's answer, never from the browser.
/** Throw this inside a route to return a clean error to the client. */ __turbopack_context__.s([
    "HttpError",
    ()=>HttpError,
    "verifyUser",
    ()=>verifyUser
]);
class HttpError extends Error {
    constructor(status, message){
        super(message);
        this.status = status;
    }
}
// Web API key = the "apiKey" in your firebase.ts config (it is public, not a secret)
const getApiKey = ()=>(process.env.FIREBASE_WEB_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "").trim().replace(/,$/, "").replace(/^["']|["']$/g, "");
async function verifyUser(request) {
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
        res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idToken: token
            }),
            cache: "no-store"
        });
    } catch (err) {
        console.error("[verifyUser] could not reach Google:", err?.message);
        throw new HttpError(503, "Could not reach the login service. Try again.");
    }
    const data = await res.json().catch(()=>({}));
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
    return {
        uid: user.localId,
        email: user.email ?? null
    };
}
}),
"[project]/src/components/lib/Priceengine.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getHistory",
    ()=>getHistory,
    "getLiveCandle",
    ()=>getLiveCandle,
    "getPriceAt",
    ()=>getPriceAt
]);
// SERVER ONLY. Fake price engine for the test trading site.
//
// The price is a pure function of TIME:  price = f(second)
//   - every user sees exactly the same price at the same moment
//   - nothing is stored in Firestore (no reads, no writes, free plan safe)
//   - the server can ask "what was the price at second X?" at any time,
//     so a trade is settled with the exact price of its 30th second
//
// How it looks: several layers of smooth random noise added together.
//   slow layers  (hours)   -> the big trend you see in the 1 week chart
//   fast layers  (seconds) -> the quick up / down moves
//
// Optional: set PRICE_SEED in .env.local to get a different (secret) price curve.
const BASE_PRICE = 1000;
const CANDLE_SEC = 60; // 1 candle = 1 minute
const HISTORY_SEC = 7 * 24 * 60 * 60; // 1 week
// period = seconds for one "wave", amp = how strong (0.01 = 1% of base price)
const OCTAVES = [
    {
        period: 21600,
        amp: 0.03
    },
    {
        period: 3600,
        amp: 0.018
    },
    {
        period: 600,
        amp: 0.01
    },
    {
        period: 120,
        amp: 0.006
    },
    {
        period: 30,
        amp: 0.004
    },
    {
        period: 8,
        amp: 0.0025
    },
    {
        period: 3,
        amp: 0.0015
    },
    {
        period: 1,
        amp: 0.0012
    }
];
const round2 = (n)=>Math.round(n * 100) / 100;
function hashString(str) {
    let h = 2166136261;
    for(let i = 0; i < str.length; i++){
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h | 0;
}
const SEED = hashString(process.env.PRICE_SEED || "ekhalo-test-price-seed");
const SEEDS = OCTAVES.map((_, k)=>SEED + k * 7919 | 0);
/** integer hash -> number in [0, 1) */ function hash(n, seed) {
    let h = Math.imul((n | 0) ^ seed, 0x9e3779b1);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
}
const smooth = (t)=>t * t * (3 - 2 * t);
/** smooth noise in [-1, 1] */ function noise(x, seed) {
    const i = Math.floor(x);
    const f = x - i;
    const a = hash(i, seed);
    const b = hash(i + 1, seed);
    return (a + (b - a) * smooth(f)) * 2 - 1;
}
function priceAtSecond(sec) {
    let move = 0;
    for(let k = 0; k < OCTAVES.length; k++){
        move += OCTAVES[k].amp * noise(sec / OCTAVES[k].period, SEEDS[k]);
    }
    return round2(BASE_PRICE * (1 + move));
}
function getPriceAt(ms) {
    return priceAtSecond(Math.floor(ms / 1000));
}
/** one candle made of every second from startSec to endSec (inclusive) */ function candleFor(startSec, endSec) {
    let open = 0;
    let close = 0;
    let high = -Infinity;
    let low = Infinity;
    for(let s = startSec; s <= endSec; s++){
        const p = priceAtSecond(s);
        if (s === startSec) open = p;
        close = p;
        if (p > high) high = p;
        if (p < low) low = p;
    }
    return {
        time: startSec,
        open,
        high,
        low,
        close
    };
}
function getLiveCandle(ms) {
    const nowSec = Math.floor(ms / 1000);
    const start = nowSec - nowSec % CANDLE_SEC;
    return candleFor(start, nowSec);
}
/* ---------- 1 week history (finished candles are cached in memory) ---------- */ const cache = {
    completed: [],
    next: 0
};
function getHistory(ms) {
    const nowSec = Math.floor(ms / 1000);
    const curStart = nowSec - nowSec % CANDLE_SEC;
    const first = curStart - HISTORY_SEC;
    // first call, or cache is too old -> rebuild from scratch
    if (cache.next < first) {
        cache.completed = [];
        cache.next = first;
    }
    // add the minutes that finished since last time
    while(cache.next < curStart){
        cache.completed.push(candleFor(cache.next, cache.next + CANDLE_SEC - 1));
        cache.next += CANDLE_SEC;
    }
    // drop candles older than 1 week
    while(cache.completed.length && cache.completed[0].time < first){
        cache.completed.shift();
    }
    return [
        ...cache.completed,
        candleFor(curStart, nowSec)
    ];
}
}),
"[project]/src/components/lib/Tradeconfig.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Shared by the server (settle API) and the screen (TradePanel, ActiveTradeCard, ResultModal).
// Change the number here and everything updates.
//   1.8 -> bet $100, win => $180 back (profit $80)
__turbopack_context__.s([
    "PAYOUT_MULTIPLIER",
    ()=>PAYOUT_MULTIPLIER
]);
const PAYOUT_MULTIPLIER = 1.8;
}),
"[project]/src/app/api/trade/settle/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_@babel+core@7.28.6_@opentelemetry+api@1.9.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import, [project]/node_modules/.pnpm/firebase-admin@13.10.0_@firebase+app-compat@0.5.16_@firebase+app@0.16.0/node_modules/firebase-admin)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Firebaseadmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/lib/Firebaseadmin.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Verifyuser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/lib/Verifyuser.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Priceengine$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/lib/Priceengine.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Tradeconfig$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/lib/Tradeconfig.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Firebaseadmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Firebaseadmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const BALANCE_COL = "balance";
const TRADES_COL = "tradeHistory";
const round2 = (n)=>Math.round(n * 100) / 100;
/** shape ResultModal expects */ const toResult = (id, t)=>({
        tradeId: id,
        status: t.status,
        side: t.side,
        amount: t.amount,
        payout: t.payout,
        entryPrice: t.entryPrice,
        exitPrice: t.exitPrice
    });
/** shape ActiveTradeCard expects */ const toActive = (id, t)=>({
        id,
        side: t.side,
        amount: t.amount,
        entryPrice: t.entryPrice,
        status: "pending",
        duration: t.duration,
        createdAt: t.createdAtMs,
        settleAt: t.settleAtMs
    });
async function POST(request) {
    try {
        /* 1) who is calling? */ const decoded = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Verifyuser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyUser"])(request);
        const uid = decoded.uid;
        /* 2) body is optional */ let body = {};
        try {
            body = await request.json();
        } catch  {
            body = {};
        }
        const tradeId = typeof body?.tradeId === "string" ? body.tradeId : null;
        /* 3) which trade? */ let tradeRef;
        if (tradeId) {
            tradeRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Firebaseadmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"].collection(TRADES_COL).doc(tradeId);
        } else {
            const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Firebaseadmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"].collection(TRADES_COL).where("userId", "==", uid).where("status", "==", "pending").limit(1).get();
            if (snap.empty) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    status: "none"
                }); // nothing is running
            }
            tradeRef = snap.docs[0].ref;
        }
        /* 4) exit price = price at the exact second the trade ends (see below) */ const balanceRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Firebaseadmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"].doc(`${BALANCE_COL}/${uid}`);
        /* 5) settle inside ONE transaction (so it can never be paid twice) */ const outcome = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Firebaseadmin$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"].runTransaction(async (tx)=>{
            const [tradeSnap, balanceSnap] = await Promise.all([
                tx.get(tradeRef),
                tx.get(balanceRef)
            ]);
            // same message for "missing" and "not yours" so ids can't be probed
            if (!tradeSnap.exists || tradeSnap.data().userId !== uid) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Verifyuser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "Trade not found.");
            }
            if (!balanceSnap.exists) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Verifyuser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"](404, "Balance account not found.");
            }
            const trade = tradeSnap.data();
            const balance = Number(balanceSnap.data().amount) || 0;
            // already settled (double call / second tab) -> return the saved result
            if (trade.status !== "pending") {
                return {
                    kind: "settled",
                    already: true,
                    result: toResult(tradeSnap.id, trade),
                    balance
                };
            }
            // 30s not over yet (client clock slightly ahead) -> ask client to retry
            const now = Date.now();
            if (now < trade.settleAtMs) {
                return {
                    kind: "pending",
                    trade: toActive(tradeSnap.id, trade),
                    retryAfterMs: trade.settleAtMs - now
                };
            }
            // price at the exact second the 30s ended (not the moment this API was called)
            const exitPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Priceengine$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPriceAt"])(trade.settleAtMs);
            const won = trade.side === "buy" ? exitPrice > trade.entryPrice : exitPrice < trade.entryPrice;
            const payout = won ? round2(trade.amount * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Tradeconfig$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PAYOUT_MULTIPLIER"]) : 0;
            const newBalance = won ? round2(balance + payout) : balance;
            tx.update(tradeRef, {
                status: won ? "win" : "loss",
                exitPrice,
                payout,
                settledAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__["Timestamp"].fromMillis(now),
                settledAtMs: now
            });
            if (won) {
                tx.update(balanceRef, {
                    amount: newBalance,
                    updatedAt: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$firebase$2d$admin$40$13$2e$10$2e$0_$40$firebase$2b$app$2d$compat$40$0$2e$5$2e$16_$40$firebase$2b$app$40$0$2e$16$2e$0$2f$node_modules$2f$firebase$2d$admin$29$__["Timestamp"].fromMillis(now)
                });
            }
            return {
                kind: "settled",
                already: false,
                result: toResult(tradeSnap.id, {
                    ...trade,
                    status: won ? "win" : "loss",
                    exitPrice,
                    payout
                }),
                balance: newBalance
            };
        });
        /* 6) response */ if (outcome.kind === "pending") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                status: "pending",
                trade: outcome.trade,
                retryAfterMs: outcome.retryAfterMs
            }, {
                status: 202
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: "settled",
            alreadySettled: outcome.already,
            result: outcome.result,
            balance: outcome.balance
        });
    } catch (err) {
        if (err instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Verifyuser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpError"]) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: err.message
            }, {
                status: err.status
            });
        }
        console.error("[api/trade/settle]", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Something went wrong. Please try again."
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e2fdc8ec._.js.map