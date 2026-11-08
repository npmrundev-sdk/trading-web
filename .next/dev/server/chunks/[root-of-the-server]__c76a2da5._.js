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
"[project]/src/app/api/price/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
// GET /api/price  ->  { price, candle, time }
// Public. The same price for every user (see lib/priceEngine.js).
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_@babel+core@7.28.6_@opentelemetry+api@1.9.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Priceengine$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/lib/Priceengine.js [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
async function GET() {
    const now = Date.now();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Priceengine$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPriceAt"])(now),
        candle: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$lib$2f$Priceengine$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLiveCandle"])(now),
        time: now
    }, {
        headers: {
            "Cache-Control": "no-store"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c76a2da5._.js.map