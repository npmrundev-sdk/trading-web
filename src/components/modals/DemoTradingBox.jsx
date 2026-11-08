"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { useModal } from "@/context/ModalContext";

export default function RealTradingBox() {
  const { user } = useAuth();
  const { openModal } = useModal();

  const isLoggedIn = !!user;

  const handleLoginClick = () => {
    openModal("login");
  };

  return (
    <div className="relative mb-5 overflow-hidden rounded-xl border border-cyan-400/20 bg-gradient-to-r from-[#071a2b] via-[#09243a] to-[#071a2b] px-4 py-3 shadow-lg shadow-cyan-500/5">
      
      {/* Glow */}
      <div className="absolute -left-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-2xl" />

      <div className="absolute -right-10 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full bg-blue-500/10 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Left */}
        <div className="flex items-center gap-3">

          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white sm:text-base">
                Real Trading
              </h2>

              <span className="rounded-full bg-green-400/10 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                LIVE
              </span>
            </div>

            <p className="mt-0.5 text-xs text-gray-400">
              আপনি যদি Real Trading উপভোগ করতে চান,
              তাহলে এখান থেকে Trade করুন।
            </p>
          </div>
        </div>

        {/* Button */}
        {isLoggedIn ? (
          <Link
            href="/trade"
            className="
              group
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              px-4
              py-2
              text-xs
              font-bold
              text-white
              shadow-md
              shadow-cyan-500/10
              transition-all
              duration-300
              hover:scale-[1.03]
              hover:shadow-cyan-500/25
              sm:px-5
            "
          >
            Start Real Trading

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                group-hover:translate-x-1
              "
            />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleLoginClick}
            className="
              group
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-gradient-to-r
              from-yellow-400
              to-orange-500
              px-4
              py-2
              text-xs
              font-bold
              text-black
              shadow-md
              shadow-yellow-500/10
              transition-all
              duration-300
              hover:scale-[1.03]
              hover:shadow-yellow-500/25
              sm:px-5
            "
          >
            <LogIn className="h-4 w-4" />

            Please Login

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                group-hover:translate-x-1
              "
            />
          </button>
        )}
      </div>
    </div>
  );
}