
"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";

export default function HomeTrade() {
  const { user } = useAuth();
  const { openModal } = useModal();

  return (
    <div className="relative isolate mx-auto w-full overflow-hidden rounded-2xl border border-[#253b55] bg-[#071321] shadow-xl shadow-blue-950/20">

      {/* Animated Chart Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#071321] via-[#0a1c30]/95 to-[#071321]/80" />

        {/* Chart Grid */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)",
            backgroundSize: "35px 35px",
          }}
        />

        {/* Chart SVG */}
        <svg
          viewBox="0 0 900 300"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full opacity-30"
        >
          <defs>
            <linearGradient id="tradeLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <linearGradient id="tradeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0 220 L55 190 L95 205 L145 145 L190 170 L235 115 L280 145 L330 95 L370 125 L420 75 L465 115 L510 65 L555 90 L600 45 L650 85 L700 35 L745 65 L790 25 L845 55 L900 15 L900 300 L0 300 Z"
            fill="url(#tradeFill)"
          />

          <path
            d="M0 220 L55 190 L95 205 L145 145 L190 170 L235 115 L280 145 L330 95 L370 125 L420 75 L465 115 L510 65 L555 90 L600 45 L650 85 L700 35 L745 65 L790 25 L845 55 L900 15"
            fill="none"
            stroke="url(#tradeLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1200"
            className="trade-chart-line"
          />

          <path
            d="M0 220 L55 190 L95 205 L145 145 L190 170 L235 115 L280 145 L330 95 L370 125 L420 75 L465 115 L510 65 L555 90 L600 45 L650 85 L700 35 L745 65 L790 25 L845 55 L900 15"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="5 12"
            opacity="0.5"
          />
        </svg>

        {/* Glow Effects */}
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/15 blur-[90px]" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-emerald-500/10 blur-[90px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-center md:justify-between md:p-9">

        {/* Left Content */}
        <div className="max-w-xl">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
              Trading Platform
            </span>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
            Make Your Next
            <span className="mt-1 block bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Trading Move
            </span>
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
            Explore the market, analyze price movements and take your next
            trading position from one place.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity size={14} className="text-cyan-400" />
              Live Market Interface
            </span>

            <span className="h-1 w-1 rounded-full bg-slate-600" />

            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-400" />
              Easy Trading
            </span>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="w-full shrink-0 md:w-[230px]">

          {user?.uid ? (
            <div className="space-y-3">

              <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-slate-400">
                Choose Your Direction
              </p>

              <Link
                href="/trade"
                className="group flex w-full items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3.5 text-emerald-300 transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
                    <TrendingUp size={22} />
                  </span>

                  <span>
                    <span className="block text-sm font-bold">UP</span>
                    <span className="block text-[11px] text-emerald-300/70">
                      Price goes higher
                    </span>
                  </span>
                </span>

                <ArrowUpRight
                  size={19}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/trade"
                className="group flex w-full items-center justify-between rounded-xl border border-rose-400/30 bg-rose-500/15 px-4 py-3.5 text-rose-300 transition-all duration-300 hover:border-rose-400/60 hover:bg-rose-500/25 hover:shadow-lg hover:shadow-rose-500/10"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20">
                    <TrendingDown size={22} />
                  </span>

                  <span>
                    <span className="block text-sm font-bold">DOWN</span>
                    <span className="block text-[11px] text-rose-300/70">
                      Price goes lower
                    </span>
                  </span>
                </span>

                <ArrowUpRight
                  size={19}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>

            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center shadow-2xl backdrop-blur-md">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <LockKeyhole size={23} />
              </div>

              <h3 className="mt-3 text-base font-bold text-white">
                Ready to Trade?
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                Login to access the trading platform and explore the market.
              </p>

              <button
                onClick={() => openModal("login")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                Login to Continue
                <ArrowUpRight size={17} />
              </button>

            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        .trade-chart-line {
          animation: chartFlow 7s linear infinite;
        }

        @keyframes chartFlow {
          from {
            stroke-dashoffset: 1200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
