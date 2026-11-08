"use client";

import React from "react";
import SVG from "../../../public/assets/svg/char.svg";
import Logo from "../../../public/Ekhalo.png";
import Link from "next/link";
import {
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    BarChart3,
} from "lucide-react";

export default function TradingPage() {
    return (
        <div className="mt-5 min-h-screen pb-10">
            {/* ================= Header ================= */}
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066c5]/10 text-teal-500">
                            <BarChart3 size={18} />
                        </div>

                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Trading
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Predict the next price movement
                    </p>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                    </span>

                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        Market Active
                    </span>
                </div>
            </div>

            {/* ================= Main Grid ================= */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* ================= Left Chart ================= */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                    {/* Background Glow */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#0066c5]/10 blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-400/5 blur-3xl" />

                    {/* Chart Header */}
                    <div className="relative z-10 flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066c5]/10 text-[#0066c5]">
                                <TrendingUp size={20} />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-teal-500 sm:text-base">
                                    Price Chart
                                </h2>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Live market movement
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                1 Min
                            </span>

                            <span className="rounded-lg bg-[#0066c5]/10 px-3 py-1.5 text-xs font-semibold text-[#0066c5]">
                                Live
                            </span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden p-4 sm:min-h-[480px] sm:p-6">
                        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]">
                            <div
                                className="h-full w-full"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(#0066c5 1px, transparent 1px), linear-gradient(90deg, #0066c5 1px, transparent 1px)",
                                    backgroundSize: "45px 45px",
                                }}
                            />
                        </div>

                        <div className="relative z-10 flex h-full w-full items-center justify-center">
                            <img
                                src={SVG.src}
                                alt="Trading Chart"
                                className="h-auto max-h-[400px] w-full max-w-[800px] object-contain opacity-95"
                            />
                        </div>

                        {/* Chart Label */}
                        <div className="absolute left-4 top-4 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-md sm:left-6 sm:top-6 dark:border-gray-700 dark:bg-gray-900/90">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400">
                                Current Price
                            </p>

                            <p className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">
                                ৳ 1,250.00
                            </p>
                        </div>

                        {/* Floating Spark */}
                        <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-xl border border-[#0066c5]/20 bg-white/90 text-[#0066c5] shadow-lg backdrop-blur-md dark:bg-gray-900/90">
                            <Sparkles size={18} />
                        </div>
                    </div>
                </div>

                {/* ================= Right Prediction Box ================= */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    {/* Top Gradient */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0066c5] via-blue-400 to-[#0066c5]" />

                    <div className="flex h-full flex-col p-5 sm:p-6">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-[#0066c5]/20 blur-xl" />

                                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                                    <img
                                        src={Logo.src}
                                        alt="Ekhalo"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="mt-6 text-center">
                            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#0066c5]/10 text-[#0066c5]">
                                <Sparkles size={19} />
                            </div>

                            <h2 className="text-xl font-bold text-teal-500">
                                Make Your Prediction
                            </h2>

                            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500 dark:text-gray-400">
                                Click on one of the buttons below
                                and see the result.
                            </p>
                        </div>

                        {/* Prediction Buttons */}
                        <div className="mt-7 space-y-3">
                            {/* Up */}
                            <Link
                                href="/trade"
                                className="group flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/10 dark:border-green-500/20 dark:bg-green-500/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20 transition-transform duration-300 group-hover:scale-105">
                                        <TrendingUp size={21} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            Price will go up
                                        </p>

                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                            Predict upward movement
                                        </p>
                                    </div>
                                </div>

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-green-600 shadow-sm dark:bg-gray-800">
                                    <ArrowUpRight size={18} />
                                </div>
                            </Link>

                            {/* Down */}
                            <Link
                                href="/trade"
                                className="group flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/10 dark:border-red-500/20 dark:bg-red-500/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20 transition-transform duration-300 group-hover:scale-105">
                                        <TrendingDown size={21} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            Price will go down
                                        </p>

                                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                            Predict downward movement
                                        </p>
                                    </div>
                                </div>

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow-sm dark:bg-gray-800">
                                    <ArrowDownRight size={18} />
                                </div>
                            </Link>
                        </div>

                        {/* Bottom Info */}
                        <div className="mt-auto pt-6">
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-gray-800 dark:bg-gray-800/50">
                                <p className="text-[11px] leading-5 text-gray-500 dark:text-gray-400">
                                    Predictions are based on current
                                    market movement and may change
                                    over time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}