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
  { period: 21600, amp: 0.03 },
  { period: 3600, amp: 0.018 },
  { period: 600, amp: 0.01 },
  { period: 120, amp: 0.006 },
  { period: 30, amp: 0.004 },
  { period: 8, amp: 0.0025 },
  { period: 3, amp: 0.0015 },
  { period: 1, amp: 0.0012 },
];

const round2 = (n) => Math.round(n * 100) / 100;

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h | 0;
}

const SEED = hashString(process.env.PRICE_SEED || "ekhalo-test-price-seed");
const SEEDS = OCTAVES.map((_, k) => (SEED + k * 7919) | 0);

/** integer hash -> number in [0, 1) */
function hash(n, seed) {
  let h = Math.imul((n | 0) ^ seed, 0x9e3779b1);
  h ^= h >>> 15;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

const smooth = (t) => t * t * (3 - 2 * t);

/** smooth noise in [-1, 1] */
function noise(x, seed) {
  const i = Math.floor(x);
  const f = x - i;
  const a = hash(i, seed);
  const b = hash(i + 1, seed);
  return (a + (b - a) * smooth(f)) * 2 - 1;
}

function priceAtSecond(sec) {
  let move = 0;
  for (let k = 0; k < OCTAVES.length; k++) {
    move += OCTAVES[k].amp * noise(sec / OCTAVES[k].period, SEEDS[k]);
  }
  return round2(BASE_PRICE * (1 + move));
}

/** price at a unix time in milliseconds */
export function getPriceAt(ms) {
  return priceAtSecond(Math.floor(ms / 1000));
}

/** one candle made of every second from startSec to endSec (inclusive) */
function candleFor(startSec, endSec) {
  let open = 0;
  let close = 0;
  let high = -Infinity;
  let low = Infinity;

  for (let s = startSec; s <= endSec; s++) {
    const p = priceAtSecond(s);
    if (s === startSec) open = p;
    close = p;
    if (p > high) high = p;
    if (p < low) low = p;
  }

  return { time: startSec, open, high, low, close };
}

/** the candle of the current minute (changes every second) */
export function getLiveCandle(ms) {
  const nowSec = Math.floor(ms / 1000);
  const start = nowSec - (nowSec % CANDLE_SEC);
  return candleFor(start, nowSec);
}

/* ---------- 1 week history (finished candles are cached in memory) ---------- */
const cache = { completed: [], next: 0 };

export function getHistory(ms) {
  const nowSec = Math.floor(ms / 1000);
  const curStart = nowSec - (nowSec % CANDLE_SEC);
  const first = curStart - HISTORY_SEC;

  // first call, or cache is too old -> rebuild from scratch
  if (cache.next < first) {
    cache.completed = [];
    cache.next = first;
  }

  // add the minutes that finished since last time
  while (cache.next < curStart) {
    cache.completed.push(candleFor(cache.next, cache.next + CANDLE_SEC - 1));
    cache.next += CANDLE_SEC;
  }

  // drop candles older than 1 week
  while (cache.completed.length && cache.completed[0].time < first) {
    cache.completed.shift();
  }

  return [...cache.completed, candleFor(curStart, nowSec)];
}