"use client";
import { useState, useEffect } from "react";
import { useModal } from "@/context/ModalContext";

import { Instagram, Facebook, Send, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


import Logo1 from "../../../public/assets/logo/PG-COLOR.png";
import Logo9 from "../../../public/assets/logo/BNG-COLOR.png";
import Logo2 from "../../../public/assets/logo/PP-COLOR.png";
import Logo3 from "../../../public/assets/logo/JL-COLOR.png";
import Logo4 from "../../../public/assets/logo/SPB-COLOR.png";
import Logo5 from "../../../public/assets/logo/FC-COLOR.png";
import Logo6 from "../../../public/assets/logo/TPG-COLOR.png";
import Logo7 from "../../../public/assets/logo/AE-COLOR.png";
import Logo8 from "../../../public/assets/logo/CG-COLOR.png";
import Logo10 from "../../../public/assets/logo/MG-COLOR.png";
import Logo11 from "../../../public/assets/logo/NE-COLOR.png";
import Logo12 from "../../../public/assets/logo/JDB-COLOR.png";
import Logo13 from "../../../public/assets/logo/GPI-COLOR.png";
import Logo14 from "../../../public/assets/logo/BOM-COLOR.png";
import Logo15 from "../../../public/assets/logo/MA-COLOR.png";
import Logo16 from "../../../public/assets/logo/JK-COLOR.png";
import Logo17 from "../../../public/assets/logo/SG-COLOR.png";
import Logo18 from "../../../public/assets/logo/AMBS-COLOR.png";
import Logo19 from "../../../public/assets/logo/FTG-COLOR.png";
import Logo20 from "../../../public/assets/logo/KA-COLOR.png";
import Logo21 from "../../../public/assets/logo/PS-COLOR.png";
import Logo22 from "../../../public/assets/logo/YB-COLOR.png";
import Logo23 from "../../../public/assets/logo/FP-COLOR.png";
import Logo24 from "../../../public/assets/logo/BTG-COLOR.png";
import Logo25 from "../../../public/assets/logo/NLC-COLOR.png";
import Logo26 from "../../../public/assets/logo/RT-COLOR.png";
import Logo27 from "../../../public/assets/logo/MAS-COLOR.png";
import Logo28 from "../../../public/assets/logo/BT-COLOR.png";


const Footer = () => {

  const { openModal } = useModal();

  const handleAction = (modalType) => {
    openModal(modalType);
    setDropdownOpen(false);
  };

  return (
    <footer className="bg-[#003d33] text-white mt-5 border-t border-white/40 py-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-gray-600 pb-5 md:pb-10">
          {/* Column 1: Help Center */}
          <div className="hidden md:block">
            <h3 className="text-[#ffb400] text-xl font-bold mb-4">
              সাহায্য কেন্দ্র
            </h3>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link href="/about" className="hover:text-[#16ff00]">
                  About US
                </Link>
              </li>
              <li>
                <button onClick={() => handleAction("ডিপোজিট")} className="hover:text-[#16ff00]">
                  Deposit
                </button>
              </li>
              <li>
                <button onClick={() => handleAction("উত্তোলন")} className="hover:text-[#16ff00]">
                  Withdrawal
                </button>
              </li>
              <li>
                <Link href="/hot" className="hover:text-[#16ff00]">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#16ff00]">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#16ff00]">
                  Privacy and Security
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-[#16ff00]">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          {/* <div>
            <h3 className="text-[#ffb400] text-xl font-bold mb-4">
              গেম সেন্টার
            </h3>

            <ul className="grid-cols-3 gap-2 text-sm font-medium grid md:grid-cols-1 md:gap-2">
              <li className="shrink-0">
                <Link href="/hot" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  গরম খেলা
                </Link>
              </li>

              <li className="shrink-0">
                <Link href="#" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  প্রিয় আইটেমস
                </Link>
              </li>

              <li className="shrink-0">
                <Link href="#" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  স্লট
                </Link>
              </li>

              <li className="shrink-0">
                <Link href="#" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  লাইভ
                </Link>
              </li>

              <li className="shrink-0">
                <Link href="#" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  স্পোর্টস
                </Link>
              </li>

              <li className="shrink-0">
                <Link href="#" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  ই-স্পোর্টস
                </Link>
              </li>

              <li className="shrink-0">
                <Link href="#" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  পোকার
                </Link>
              </li>

              <li className="shrink-0">
                <Link href="#" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  ফিশিং
                </Link>
              </li>

              <li className="shrink-0">
                <Link href="#" className="block rounded-lg border border-cyan-400/30 bg-transparent px-3 py-2 text-center text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-left md:text-white">
                  লটারি
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Column 3 & 4: Brand & Socials */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
              <div className="flex-shrink-0 flex gap-5">
                <Image
                  src="/Ekhalo.png"
                  alt="TK999"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />

                <div className="flex md:hidden gap-3 mt-2 sm:mt-0">
                  {/* <SocialIcon color="bg-blue-600">
                    <Facebook size={18} />
                  </SocialIcon>
                  <SocialIcon color="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                    <Instagram size={18} />
                  </SocialIcon>
                  <SocialIcon color="bg-sky-500">
                    <Send size={18} />
                  </SocialIcon>
                  <SocialIcon color="bg-green-500">
                    <MessageCircle size={18} />
                  </SocialIcon> */}
                  <div className="border-2 border-red-500 text-red-500 rounded-full w-9 h-9 flex items-center justify-center font-bold text-xs">
                    18+
                  </div>
                </div>
              </div>
              <p className="text-xs text-justify leading-relaxed text-gray-300">
                Our Website is an innovative online sportsbook and casino.
                Offering a wide variety of sports and betting markets with high
                odds, we make sure to bring you the best online experience ever!
              </p>
            </div>

            {/* Action Buttons & Socials */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center lg:justify-start">
              <div className="grid grid-cols-2 gap-5">
                <button
                  onClick={() => handleAction("বিনিয়োগ পরিকল্পনা")}
                  className="w-full sm:w-auto bg-[#005c53] border border-cyan-500 text-cyan-400 px-8 py-2 rounded-md font-bold hover:bg-cyan-900 transition-all">
                  অংশীদার
                </button>
                <button className="w-full sm:w-auto bg-[#005c53] border border-yellow-500 text-yellow-500 px-6 py-2 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-yellow-900 transition-all">
                  <span className="bg-yellow-500 text-[#003d33] rounded-full p-1 text-[10px]">
                    💬
                  </span>
                  লাইভ চ্যাট
                </button>
              </div>

              <div className="md:flex hidden gap-3 mt-2 sm:mt-0">
                {/* <SocialIcon color="bg-blue-600">
                  <Facebook size={18} />
                </SocialIcon>
                <SocialIcon color="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                  <Instagram size={18} />
                </SocialIcon>
                <SocialIcon color="bg-sky-500">
                  <Send size={18} />
                </SocialIcon>
                <SocialIcon color="bg-green-500">
                  <MessageCircle size={18} />
                </SocialIcon> */}
                <div className="border-2 border-red-500 text-red-500 rounded-full w-9 h-9 flex items-center justify-center font-bold text-xs">
                  18+
                </div>
              </div>
            </div>

            <div className="md:grid hidden grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-0 pb-2">
              <BrandLogo bgUrl={Logo1} />
              <BrandLogo bgUrl={Logo2} />
              <BrandLogo bgUrl={Logo3} />
              <BrandLogo bgUrl={Logo4} />
              <BrandLogo bgUrl={Logo5} />
              <BrandLogo bgUrl={Logo6} />
              <BrandLogo bgUrl={Logo7} />
              <BrandLogo bgUrl={Logo8} />
              <BrandLogo bgUrl={Logo9} />
              <BrandLogo bgUrl={Logo10} />
              <BrandLogo bgUrl={Logo11} />
              <BrandLogo bgUrl={Logo12} />
              <BrandLogo bgUrl={Logo13} />
              <BrandLogo bgUrl={Logo14} />
              <BrandLogo bgUrl={Logo15} />
              <BrandLogo bgUrl={Logo16} />
              <BrandLogo bgUrl={Logo17} />
              <BrandLogo bgUrl={Logo18} />
              <BrandLogo bgUrl={Logo19} />
              <BrandLogo bgUrl={Logo20} />
              <BrandLogo bgUrl={Logo21} />
              <BrandLogo bgUrl={Logo22} />
              <BrandLogo bgUrl={Logo23} />
              <BrandLogo bgUrl={Logo24} />
              <BrandLogo bgUrl={Logo25} />
              <BrandLogo bgUrl={Logo26} />
              <BrandLogo bgUrl={Logo27} />
              <BrandLogo bgUrl={Logo28} />
            </div>
          </div>
        </div>


        <div className="grid md:hidden border-b border-gray-600 grid-cols-7 mt-3 gap-0 pb-2">
          <BrandLogo bgUrl={Logo1} />
          <BrandLogo bgUrl={Logo2} />
          <BrandLogo bgUrl={Logo3} />
          <BrandLogo bgUrl={Logo4} />
          <BrandLogo bgUrl={Logo5} />
          <BrandLogo bgUrl={Logo6} />
          <BrandLogo bgUrl={Logo7} />
          <BrandLogo bgUrl={Logo8} />
          <BrandLogo bgUrl={Logo9} />
          <BrandLogo bgUrl={Logo10} />
          <BrandLogo bgUrl={Logo11} />
          <BrandLogo bgUrl={Logo12} />
          <BrandLogo bgUrl={Logo13} />
          <BrandLogo bgUrl={Logo14} />
          <BrandLogo bgUrl={Logo15} />
          <BrandLogo bgUrl={Logo16} />
          <BrandLogo bgUrl={Logo17} />
          <BrandLogo bgUrl={Logo18} />
          <BrandLogo bgUrl={Logo19} />
          <BrandLogo bgUrl={Logo20} />
          <BrandLogo bgUrl={Logo21} />
          <BrandLogo bgUrl={Logo22} />
          <BrandLogo bgUrl={Logo23} />
          <BrandLogo bgUrl={Logo24} />
          <BrandLogo bgUrl={Logo25} />
          <BrandLogo bgUrl={Logo26} />
          <BrandLogo bgUrl={Logo27} />
          <BrandLogo bgUrl={Logo28} />
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-[10px] opacity-40 space-y-2 md:space-y-0 text-center">
          <p>© 2026 ekhalo All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ children, color }) => (
  <Link
    href="#"
    className={`${color} w-9 h-9 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`}
  >
    {children}
  </Link>
);

const BrandLogo = ({ bgUrl }) => (
  <div className="flex h-6 sm:h-12 md:h-8 md:mb-4 w-full items-center justify-center">
    <img
      src={typeof bgUrl === "string" ? bgUrl : bgUrl?.src}
      alt="Brand Logo"
      className="h-full w-full object-contain"
    />
  </div>
);

export default Footer;
