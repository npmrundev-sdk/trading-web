
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/lib/firebase";
import {
  ArrowLeft,
  MessageCircleQuestion,
  Search,
  ChevronDown,
  HelpCircle,
  LoaderCircle,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const settingsRef = doc(db, "siteSettings", "general");
        const snapshot = await getDoc(settingsRef);

        if (snapshot.exists()) {
          const data = snapshot.data();

          setFaqs(
            Array.isArray(data.faqs)
              ? data.faqs.filter(
                  (faq) =>
                    faq.question?.trim() &&
                    faq.answer?.trim()
                )
              : []
          );
        }
      } catch (err) {
        console.error("FAQ loading error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  // Search
  const filteredFAQs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword)
    );
  }, [faqs, search]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-12 text-white md:px-8 md:py-20">
      
      <div className="relative mx-auto max-w-4xl">
        {/* Back */}
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
            <MessageCircleQuestion size={30} />
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-500">
            Help Center
          </span>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
            Frequently Asked Questions
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-500">
            Find answers to the most common questions about our platform.
          </p>

          <div className="mx-auto mt-7 h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500" />
        </div>

        {/* Search */}
        <div className="mb-8 rounded-2xl border border-white/[0.07] bg-zinc-950/80 p-2 shadow-xl">
          <div className="flex items-center gap-3 px-3">
            <Search size={19} className="shrink-0 text-zinc-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveIndex(null);
              }}
              placeholder="Search your questions..."
              className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* FAQ List */}
        <section className="space-y-3">
          {loading ? (
            <div className="rounded-3xl border border-white/[0.07] bg-zinc-950/70 py-20 text-center">
              <LoaderCircle
                size={30}
                className="mx-auto animate-spin text-emerald-500"
              />
              <p className="mt-4 text-xs font-bold text-zinc-500">
                Loading frequently asked questions...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/10 bg-zinc-950/70 py-20 text-center">
              <AlertCircle size={32} className="mx-auto text-red-400" />
              <p className="mt-4 text-sm font-bold text-white">
                Unable to load FAQs
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                Please try again later.
              </p>
            </div>
          ) : filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => {
              const isOpen = activeIndex === index;

              return (
                <div
                  key={index}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-emerald-500/30 bg-emerald-500/[0.04] shadow-lg shadow-emerald-950/10"
                      : "border-white/[0.07] bg-zinc-950/70 hover:border-white/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isOpen
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-zinc-900 text-zinc-500"
                        }`}
                      >
                        <HelpCircle size={18} />
                      </div>

                      <span
                        className={`text-xs font-bold leading-6 md:text-sm ${
                          isOpen ? "text-emerald-400" : "text-zinc-200"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-zinc-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-emerald-400" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-white/[0.06] px-5 pb-6 pt-4 pl-[4.5rem] md:px-6 md:pl-[4.75rem]">
                        <p className="whitespace-pre-wrap break-words text-xs leading-7 text-zinc-400 md:text-sm md:leading-8">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-white/[0.07] bg-zinc-950/70 px-5 py-20 text-center">
              <MessageCircleQuestion
                size={35}
                className="mx-auto text-zinc-700"
              />

              <h3 className="mt-5 text-sm font-bold text-zinc-300">
                {search ? "No matching questions found" : "No FAQs Available"}
              </h3>

              <p className="mt-2 text-xs text-zinc-600">
                {search
                  ? "Try searching with a different keyword."
                  : "Frequently asked questions will appear here once published."}
              </p>
            </div>
          )}
        </section>

        {/* Bottom */}
        {!loading && !error && faqs.length > 0 && (
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-zinc-950/60 px-5 py-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Total Questions
            </span>

            <span className="text-sm font-black text-emerald-400">
              {filteredFAQs.length} / {faqs.length}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
