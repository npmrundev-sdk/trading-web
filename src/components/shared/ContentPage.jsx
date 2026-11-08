
"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/lib/firebase";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  Info,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const pageConfig = {
  about: {
    title: "About Us",
    subtitle: "Get to know more about us and what we do.",
    icon: Info,
    field: "aboutUs",
    label: "Who We Are",
  },
  terms: {
    title: "Terms & Conditions",
    subtitle: "Please read our terms before using our platform.",
    icon: FileText,
    field: "termsAndConditions",
    label: "Terms of Service",
  },
  privacy: {
    title: "Privacy & Security",
    subtitle: "Learn how we protect your information and privacy.",
    icon: ShieldCheck,
    field: "privacyAndSecurity",
    label: "Your Privacy Matters",
  },
};

export default function ContentPage({ type = "about" }) {
  const config = pageConfig[type] || pageConfig.about;
  const Icon = config.icon;

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const settingsRef = doc(db, "siteSettings", "general");
        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists()) {
          setContent(snapshot.data()?.[config.field] || "");
        }
      } catch (err) {
        console.error(`${config.title} loading error:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [config.field, config.title]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-4 py-12 text-white md:px-8 md:py-20">
      
      <div className="relative mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-bold text-zinc-400 transition-all hover:border-emerald-500/30 hover:text-emerald-400"
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-950/30">
            <Icon size={30} />
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-500">
            Information Center
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
            {config.title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500">
            {config.subtitle}
          </p>

          <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" />
        </div>

        {/* Content Card */}
        <section className="overflow-hidden rounded-[2rem] border border-white/[0.07] bg-zinc-950/80 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-6 py-5 md:px-9">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />

            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {config.label}
            </h2>
          </div>

          <div className="min-h-[300px] p-6 md:p-10">
            {loading ? (
              <div className="flex min-h-[250px] items-center justify-center">
                <div className="text-center">
                  <LoaderCircle
                    size={30}
                    className="mx-auto animate-spin text-emerald-500"
                  />
                  <p className="mt-4 text-xs font-bold text-zinc-500">
                    Loading content...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <AlertCircle size={32} className="text-red-400" />
                <p className="mt-4 text-sm font-bold text-white">
                  Unable to load content
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Please try again later.
                </p>
              </div>
            ) : content.trim() ? (
              <article className="whitespace-pre-wrap break-words text-sm leading-8 text-zinc-300 md:text-[15px] md:leading-9">
                {content}
              </article>
            ) : (
              <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                <FileText size={35} className="text-zinc-700" />
                <h3 className="mt-5 text-sm font-bold text-zinc-300">
                  Content Coming Soon
                </h3>
                <p className="mt-2 max-w-sm text-xs leading-6 text-zinc-600">
                  This section has not been published yet. Please check back
                  later.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
            Official Information • Always Stay Updated
          </p>
        </div>
      </div>
    </main>
  );
}
