"use client";

import Link from "next/link";
import { useModal } from "@/context/ModalContext";
import { Home, Gift, Wallet, User, Gamepad2 } from "lucide-react";

export default function FloatingFooter() {
  const { openModal } = useModal();

  const handleAction = (modalType) => {
    openModal(modalType);
    setDropdownOpen(false);
  };
  return (
    <div className="md:hidden shadow-yellow-500 flex fixed bottom-5 left-1/2 z-50 w-[90%] max-w-2xl -translate-x-1/2 items-center justify-between rounded-2xl border border-yellow-500 bg-[#06191b]/35 px-6 py-3 shadow-md backdrop-blur-xl">
      {/* Games */}
      <Link
        href="/hot"
        className="text-yellow-500 transition hover:text-cyan-400"
      >
        <Gamepad2 size={21} />
      </Link>

      {/* Bonus */}
      <button
        onClick={() => handleAction("পুরস্কার কেন্দ্র")}
        className=" text-yellow-500  transition hover:text-cyan-400"
      >
        <Gift size={21} />
      </button>

      <div></div>

      {/* Home */}
      <Link
        href="/"
        className=" absolute left-[46%] bg-yellow-400 top-[-8px] text-black border border-yellow-500 p-2 rounded-full transition hover:text-cyan-400"
      >
        <Home size={21} />
      </Link>

      {/* Wallet */}
      <button
        onClick={() => handleAction("ডিপোজিট")}
        className=" text-yellow-500 transition hover:text-cyan-400"
      >
        <Wallet size={21} />
      </button>

      {/* Profile */}
      <button
        onClick={() => handleAction("আমার অ্যাকাউন্ট")}
        className=" text-yellow-500 transition hover:text-cyan-400"
      >
        <User size={21} />
      </button>

    </div>
  );
}