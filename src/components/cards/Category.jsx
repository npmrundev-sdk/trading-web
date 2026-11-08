"use client";

import {
    Flame,
    Users,
    Heart,
    Gift,
    Waves,
    Gamepad2,
    Dices,
    Target,
    LayoutGrid,
    CircleHelp,
    Ticket,
} from "lucide-react";

import Link from "next/link";
import React from 'react'

export default function Category() {
    const items = [
        { label: "গরম খেলা", icon: Flame, href: "/hot" },

        { label: "প্রিয় আইটেমস", icon: Heart, href: "/favorites" },
        { label: "অফার", icon: Gift, href: "/promotions" },
        { label: "স্লট", icon: LayoutGrid, href: "/slots" },
        

        { label: "লাইভ", icon: Target, href: "/live" },
       
        { label: "ই-স্পোর্টস", icon: Gamepad2, href: "/esports" },
       
        { label: "পোকার", icon: Dices, href: "/pvp" },
        { label: "ফিশিং", icon: Waves, href: "/fish" },
        { label: "লটারি", icon: Ticket, href: "/elott" },
    ];
    return (
        <div>
            <div className="md:grid hidden grid-cols-5 mt-5 md:grid-cols-9 gap-2 p-3">
                {items.map((item, i) => {
                
                    return (
                        <Link
                            key={i}
                            href={item.href}
                            className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#002d28] hover:bg-[#003d38]"
                        >
                            <item.icon className="w-6 h-6 text-yellow-400" />
                            <span className="text-[10px] text-slate-300 font-medium mt-1">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}
