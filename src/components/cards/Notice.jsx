"use client";

import React from "react";
import { Mic } from "lucide-react";

export default function Notice() {
  const noticeText =
    "🎉🎉🎉 ekhallo × WINTK আনুষ্ঠানিকভাবে একটি কৌশলগত ব্র্যান্ড পার্টনারশিপে যুক্ত হয়েছে! 🎆🎆🎆";

  return (<div className="flex w-full border-2 border-green-700 mb-2 items-center overflow-hidden rounded-lg bg-[#143d24] px-4 py-2">

    {/* Mic Icon */}
    <div className="relative z-10 mr-4 flex shrink-0 items-center justify-center">
      <Mic className="h-5 w-5 text-yellow-400" />
    </div>

    {/* Text Slider */}
    <div className="relative flex-1 overflow-hidden">
      <div className="notice-slider whitespace-nowrap text-sm font-semibold text-white">
        {noticeText}
      </div>
    </div>

    <style jsx>{`
    .notice-slider {
      display: inline-block;
      min-width: 100%;
      animation: notice-scroll 15s linear infinite;
    }

    @keyframes notice-scroll {
      0% {
        transform: translateX(100%);
      }

      100% {
        transform: translateX(-100%);
      }
    }
  `}</style>
  </div>

  );
}
