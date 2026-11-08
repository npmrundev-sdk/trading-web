"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FloatingControls } from "@/components/shared/FloatingControls";
import SportGame from "./sport/SportGame";
import HotPage from "./hot/HotPage";
import Notice from "@/components/cards/Notice";
import Category from "@/components/cards/Category";
import TradingPage from "./trading-chart/TradingPage";
import HomeTrade from "@/components/cards/HomeTrade";

export default function Page() {
  const dispatch = useDispatch();
  const { list: games, loading } = useSelector((state) => state.games);

  // 🔹 group games by category
  const gamesByCategory = games.reduce((acc, game) => {
    const cat = game.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(game);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-[90vw] md:max-w-5xl overflow-x-hidden px-3 sm:px-4 mx-auto">
      <Notice />
      <HomeTrade />
      {/* <Category /> */}

      {loading && (
        <p className="text-center text-gray-400 py-10">Loading games...</p>
      )}

      
        <div className="text-teal-500">
          {/* <HotPage />
          */}
          <TradingPage />
        </div>
        
      <FloatingControls />
    </div>
  );
}
