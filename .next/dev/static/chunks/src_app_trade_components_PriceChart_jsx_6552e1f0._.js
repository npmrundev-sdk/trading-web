(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/trade/components/PriceChart.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PriceChart
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_@babel+core@7.28.6_@opentelemetry+api@1.9.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.1.4_@babel+core@7.28.6_@opentelemetry+api@1.9.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lightweight$2d$charts$40$5$2e$2$2e$1$2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lightweight-charts@5.2.1/node_modules/lightweight-charts/dist/lightweight-charts.development.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$trade$2f$components$2f$ChartToolbar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/trade/components/ChartToolbar.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const UP = "#34d399"; // green candle
const DOWN = "#fb7185"; // red candle
const BG = "#0f172a"; // matches slate-900 card in TradeLayout
const TEXT = "#94a3b8";
const GRID = "#1e293b";
/** time can be seconds or milliseconds -> always return seconds (UTCTimestamp) */ const toSec = (t)=>t > 1e12 ? Math.floor(t / 1000) : Math.floor(t);
/** clean + sort + remove duplicate times (lightweight-charts requires ascending unique times) */ function normalize(list = []) {
    const map = new Map();
    for (const c of list){
        if (!c) continue;
        const time = toSec(c.time);
        map.set(time, {
            time,
            open: Number(c.open),
            high: Number(c.high),
            low: Number(c.low),
            close: Number(c.close)
        });
    }
    return [
        ...map.values()
    ].sort((a, b)=>a.time - b.time);
}
function PriceChart({ data = [], lastCandle = null, range = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$trade$2f$components$2f$ChartToolbar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_CHART_RANGE"], entryPrice = null, entrySide = "buy", loading = false }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chartRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const seriesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const priceLineRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const rangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(range);
    // keep the ref in sync (inside an effect, NOT during render).
    // This effect is declared before the others so it always runs first.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PriceChart.useEffect": ()=>{
            rangeRef.current = range;
        }
    }["PriceChart.useEffect"], [
        range
    ]);
    /* ---------- show only the selected time window ---------- */ const applyRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "PriceChart.useCallback[applyRange]": ()=>{
            const chart = chartRef.current;
            const last = lastTimeRef.current;
            if (!chart || !last) return;
            const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$trade$2f$components$2f$ChartToolbar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHART_RANGES"].find({
                "PriceChart.useCallback[applyRange].cfg": (r)=>r.key === rangeRef.current
            }["PriceChart.useCallback[applyRange].cfg"]);
            const seconds = cfg ? cfg.seconds : 60 * 60 * 24 * 7;
            try {
                chart.timeScale().applyOptions({
                    secondsVisible: seconds <= 3600
                });
                chart.timeScale().setVisibleRange({
                    from: last - seconds,
                    to: last + Math.max(10, Math.floor(seconds * 0.03))
                });
            } catch  {
                chart.timeScale().fitContent();
            }
        }
    }["PriceChart.useCallback[applyRange]"], []);
    /* ---------- 1) create chart once ---------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PriceChart.useEffect": ()=>{
            const container = containerRef.current;
            if (!container) return;
            const chart = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lightweight$2d$charts$40$5$2e$2$2e$1$2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChart"])(container, {
                autoSize: true,
                layout: {
                    background: {
                        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lightweight$2d$charts$40$5$2e$2$2e$1$2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ColorType"].Solid,
                        color: BG
                    },
                    textColor: TEXT,
                    fontSize: 12
                },
                grid: {
                    vertLines: {
                        color: GRID
                    },
                    horzLines: {
                        color: GRID
                    }
                },
                crosshair: {
                    mode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lightweight$2d$charts$40$5$2e$2$2e$1$2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CrosshairMode"].Normal
                },
                rightPriceScale: {
                    borderColor: GRID,
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0.1
                    }
                },
                timeScale: {
                    borderColor: GRID,
                    timeVisible: true,
                    secondsVisible: false,
                    rightOffset: 4
                }
            });
            const series = chart.addSeries(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lightweight$2d$charts$40$5$2e$2$2e$1$2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CandlestickSeries"], {
                upColor: UP,
                downColor: DOWN,
                borderUpColor: UP,
                borderDownColor: DOWN,
                wickUpColor: UP,
                wickDownColor: DOWN,
                priceFormat: {
                    type: "price",
                    precision: 2,
                    minMove: 0.01
                }
            });
            chartRef.current = chart;
            seriesRef.current = series;
            return ({
                "PriceChart.useEffect": ()=>{
                    chart.remove();
                    chartRef.current = null;
                    seriesRef.current = null;
                    priceLineRef.current = null;
                    lastTimeRef.current = 0;
                }
            })["PriceChart.useEffect"];
        }
    }["PriceChart.useEffect"], []);
    /* ---------- 2) history data ---------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PriceChart.useEffect": ()=>{
            const series = seriesRef.current;
            if (!series) return;
            const clean = normalize(data);
            series.setData(clean);
            lastTimeRef.current = clean.length ? clean[clean.length - 1].time : 0;
            applyRange();
        }
    }["PriceChart.useEffect"], [
        data,
        applyRange
    ]);
    /* ---------- 3) live candle (fast up/down) ---------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PriceChart.useEffect": ()=>{
            const series = seriesRef.current;
            if (!series || !lastCandle) return;
            const [candle] = normalize([
                lastCandle
            ]);
            if (!candle) return;
            // chart only accepts updates for the last bar or newer
            if (lastTimeRef.current && candle.time < lastTimeRef.current) return;
            try {
                series.update(candle);
                lastTimeRef.current = candle.time;
            } catch (err) {
                console.warn("PriceChart update skipped:", err?.message);
            }
        }
    }["PriceChart.useEffect"], [
        lastCandle
    ]);
    /* ---------- 4) range button changed ---------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PriceChart.useEffect": ()=>{
            applyRange();
        }
    }["PriceChart.useEffect"], [
        range,
        applyRange
    ]);
    /* ---------- 5) entry price line for the running trade ---------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PriceChart.useEffect": ()=>{
            const series = seriesRef.current;
            if (!series) return;
            if (priceLineRef.current) {
                series.removePriceLine(priceLineRef.current);
                priceLineRef.current = null;
            }
            if (typeof entryPrice === "number" && !Number.isNaN(entryPrice)) {
                priceLineRef.current = series.createPriceLine({
                    price: entryPrice,
                    color: entrySide === "buy" ? UP : DOWN,
                    lineWidth: 2,
                    lineStyle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lightweight$2d$charts$40$5$2e$2$2e$1$2f$node_modules$2f$lightweight$2d$charts$2f$dist$2f$lightweight$2d$charts$2e$development$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineStyle"].Dashed,
                    axisLabelVisible: true,
                    title: entrySide === "buy" ? "Buy entry" : "Sell entry"
                });
            }
        }
    }["PriceChart.useEffect"], [
        entryPrice,
        entrySide
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: containerRef,
                className: "h-full w-full"
            }, void 0, false, {
                fileName: "[project]/src/app/trade/components/PriceChart.jsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$4_$40$babel$2b$core$40$7$2e$28$2e$6_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex items-center justify-center bg-slate-900/70 text-sm text-slate-400",
                children: "Loading chart..."
            }, void 0, false, {
                fileName: "[project]/src/app/trade/components/PriceChart.jsx",
                lineNumber: 206,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/trade/components/PriceChart.jsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
}
_s(PriceChart, "RmqG8noAdtABxvYhXdZ/KUOvJGE=");
_c = PriceChart;
var _c;
__turbopack_context__.k.register(_c, "PriceChart");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/trade/components/PriceChart.jsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/trade/components/PriceChart.jsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_app_trade_components_PriceChart_jsx_6552e1f0._.js.map