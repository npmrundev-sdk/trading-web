"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Input, Select, Tag, Spin, message } from "antd";

import {
  ArrowLeft,
  History,
  TrendingUp,
  TrendingDown,
  Wallet,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CalendarDays,
  Activity,
  Hash,
  Radio,
} from "lucide-react";

import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import Pagination from "@/components/shared/Pagination.jsx";

const PAGE_SIZE = 8;

/* ---------------------------- helpers ---------------------------- */

const formatMoney = (value) =>
  `৳${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;

// "--" while a trade is still running (no exit price yet)
const formatPrice = (value) =>
  value == null
    ? "--"
    : `$${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

const formatDate = (value, fallback) => {
  try {
    let date;

    if (value?.toDate) {
      date = value.toDate();
    } else if (typeof fallback === "number") {
      date = new Date(fallback);
    } else if (typeof value === "number") {
      date = new Date(value);
    }

    if (!date || isNaN(date.getTime())) return "N/A";

    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "N/A";
  }
};

const getTime = (trade) =>
  trade.createdAt?.toMillis
    ? trade.createdAt.toMillis()
    : Number(trade.createdAtMs || 0);

/* ------------------------ small components ------------------------ */

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111827] p-4 transition hover:border-white/15 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs text-gray-400 sm:text-sm">{title}</p>
          <h2 className="mt-1.5 truncate text-xl font-bold text-white sm:mt-2 sm:text-2xl">
            {value}
          </h2>
          <p className="mt-1.5 truncate text-[11px] text-gray-500 sm:mt-2 sm:text-xs">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${color}`}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div className="absolute -bottom-8 -right-5 h-24 w-24 rounded-full bg-white/[0.02] blur-2xl" />
    </div>
  );
}

function SideBadge({ side }) {
  const isBuy = side?.toLowerCase() === "buy";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
        isBuy
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"
      }`}
    >
      {isBuy ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {side?.toUpperCase() || "N/A"}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = status?.toLowerCase();
  const isWin = s === "win";
  const isLoss = s === "loss";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isWin
          ? "bg-emerald-500/10 text-emerald-400"
          : isLoss
          ? "bg-red-500/10 text-red-400"
          : "bg-yellow-500/10 text-yellow-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isWin ? "bg-emerald-400" : isLoss ? "bg-red-400" : "bg-yellow-400"
        }`}
      />
      {status?.toUpperCase() || "UNKNOWN"}
    </span>
  );
}

function Field({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

/* ------------------------------ page ------------------------------ */

export default function TradeHistoryPage() {
  const { user, loading: authLoading } = useAuth();

  const [state, setState] = useState({ trades: [], loading: true });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sideFilter, setSideFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Live list of the logged-in user's trades (updates by itself, no refresh needed)
  useEffect(() => {
    if (!user?.uid) return;

    const tradeQuery = query(
      collection(db, "tradeHistory"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      tradeQuery,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        // newest first
        data.sort((a, b) => getTime(b) - getTime(a));

        setState({ trades: data, loading: false });
      },
      (error) => {
        console.error("Trade history error:", {
          code: error.code,
          message: error.message,
        });

        message.error(
          `Unable to load trade history: ${error.code || error.message}`
        );

        setState({ trades: [], loading: false });
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const trades = user?.uid ? state.trades : [];
  const loading = Boolean(authLoading) || (Boolean(user?.uid) && state.loading);

  // Personal statistics
  const stats = useMemo(() => {
    const wins = trades.filter((t) => t.status?.toLowerCase() === "win").length;
    const losses = trades.filter(
      (t) => t.status?.toLowerCase() === "loss"
    ).length;
    const volume = trades.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return { total: trades.length, wins, losses, volume };
  }, [trades]);

  // Search and filters
  const filteredTrades = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return trades.filter((trade) => {
      const matchesSearch =
        !searchText ||
        trade.id?.toLowerCase().includes(searchText) ||
        trade.side?.toLowerCase().includes(searchText) ||
        trade.status?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || trade.status?.toLowerCase() === statusFilter;

      const matchesSide =
        sideFilter === "all" || trade.side?.toLowerCase() === sideFilter;

      return matchesSearch && matchesStatus && matchesSide;
    });
  }, [trades, search, statusFilter, sideFilter]);

  // Pagination (page is always valid, even if the list got shorter)
  const totalPages = Math.max(1, Math.ceil(filteredTrades.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);

  const paginatedTrades = filteredTrades.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const changeSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const changeStatus = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const changeSide = (value) => {
    setSideFilter(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSideFilter("all");
    setCurrentPage(1);
  };

  const hasFilters = search || statusFilter !== "all" || sideFilter !== "all";

  /* ---------- login check ---------- */
  if (!authLoading && !user?.uid) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4 sm:p-5">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 text-center sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <History size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-white">Login Required</h2>

          <p className="mt-2 text-sm text-gray-400">
            Please login to view your personal trading history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1400px] space-y-5 px-3 pb-10 pt-4 text-white sm:space-y-6 sm:px-5 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/trade"
            title="Back to trading"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 sm:h-12 sm:w-12"
          >
            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
              My Trade History
            </h1>
            <p className="mt-0.5 text-xs text-gray-400 sm:mt-1 sm:text-sm">
              Track your personal trading activity and results.
            </p>
          </div>
        </div>

        <span className="hidden shrink-0 items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 sm:inline-flex">
          <Radio size={13} />
          Live
        </span>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Trades"
          value={stats.total.toLocaleString()}
          icon={Activity}
          color="bg-blue-500/10 text-blue-400"
          subtitle="Your total trades"
        />

        <StatCard
          title="Winning Trades"
          value={stats.wins.toLocaleString()}
          icon={TrendingUp}
          color="bg-emerald-500/10 text-emerald-400"
          subtitle="Successful trades"
        />

        <StatCard
          title="Losing Trades"
          value={stats.losses.toLocaleString()}
          icon={TrendingDown}
          color="bg-red-500/10 text-red-400"
          subtitle="Unsuccessful trades"
        />

        <StatCard
          title="Trade Volume"
          value={formatMoney(stats.volume)}
          icon={Wallet}
          color="bg-purple-500/10 text-purple-400"
          subtitle="Combined trade amount"
        />
      </div>

      {/* History */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111827]">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your Transactions</h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredTrades.length} records found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              prefix={<Search size={16} className="text-gray-500" />}
              placeholder="Search trade ID..."
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
              allowClear
              className="!h-10 !w-full sm:!w-[220px]"
            />

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <Select
                value={statusFilter}
                onChange={changeStatus}
                className="h-10 w-full sm:w-[130px]"
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Win", value: "win" },
                  { label: "Loss", value: "loss" },
                  { label: "Pending", value: "pending" },
                ]}
              />

              <Select
                value={sideFilter}
                onChange={changeSide}
                className="h-10 w-full sm:w-[120px]"
                options={[
                  { label: "All Sides", value: "all" },
                  { label: "Buy", value: "buy" },
                  { label: "Sell", value: "sell" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.07] px-4 py-3 sm:px-5">
            <span className="text-xs text-gray-500">Filters:</span>

            {search && (
              <Tag closable onClose={() => changeSearch("")}>
                Search: {search}
              </Tag>
            )}

            {statusFilter !== "all" && (
              <Tag closable onClose={() => changeStatus("all")}>
                {statusFilter}
              </Tag>
            )}

            {sideFilter !== "all" && (
              <Tag closable onClose={() => changeSide("all")}>
                {sideFilter}
              </Tag>
            )}

            <button
              onClick={resetFilters}
              className="ml-auto text-xs text-blue-400 hover:text-blue-300"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="py-20 text-center">
            <Spin size="large" />
            <p className="mt-3 text-sm text-gray-500">Loading your trades...</p>
          </div>
        ) : paginatedTrades.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
              <History size={25} className="text-gray-500" />
            </div>

            <p className="mt-4 font-medium text-gray-300">
              No trade history found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Your completed trades will appear here.
            </p>

            {hasFilters && (
              <button
                onClick={resetFilters}
                className="mt-4 text-sm text-blue-400"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table (lg and up) */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-white/[0.02] text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4 font-semibold">Trade Details</th>
                    <th className="px-5 py-4 font-semibold">Side</th>
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">Entry / Exit</th>
                    <th className="px-5 py-4 font-semibold">Payout</th>
                    <th className="px-5 py-4 font-semibold">Duration</th>
                    <th className="px-5 py-4 font-semibold">Result</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.05]">
                  {paginatedTrades.map((trade) => (
                    <tr
                      key={trade.id}
                      className="transition-colors hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                            <Hash size={17} />
                          </div>

                          <div>
                            <p className="font-mono text-xs text-gray-200">
                              {trade.id.slice(0, 12)}...
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                              <CalendarDays size={11} />
                              {formatDate(trade.createdAt, trade.createdAtMs)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <SideBadge side={trade.side} />
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">
                          {formatMoney(trade.amount)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-1.5 text-xs">
                          <p className="text-gray-300">
                            <span className="text-gray-500">In:</span>{" "}
                            {formatPrice(trade.entryPrice)}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-gray-500">Out:</span>{" "}
                            {formatPrice(trade.exitPrice)}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">
                          {formatMoney(trade.payout)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-300">
                          <Clock3 size={13} className="text-gray-500" />
                          {trade.duration ?? 0}s
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={trade.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards (below lg) */}
            <div className="divide-y divide-white/[0.05] lg:hidden">
              {paginatedTrades.map((trade) => (
                <div key={trade.id} className="space-y-3 p-4 sm:px-5">
                  <div className="flex items-center justify-between gap-2">
                    <SideBadge side={trade.side} />
                    <StatusBadge status={trade.status} />
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                    <Field label="Amount" value={formatMoney(trade.amount)} />
                    <Field label="Payout" value={formatMoney(trade.payout)} />
                    <Field
                      label="Entry price"
                      value={formatPrice(trade.entryPrice)}
                    />
                    <Field
                      label="Exit price"
                      value={formatPrice(trade.exitPrice)}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Hash size={11} />
                      {trade.id.slice(0, 12)}...
                    </span>

                    <span className="flex items-center gap-1">
                      <CalendarDays size={11} />
                      {formatDate(trade.createdAt, trade.createdAtMs)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 size={11} />
                      {trade.duration ?? 0}s
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col justify-between gap-4 border-t border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-300">
                  {(page - 1) * PAGE_SIZE + 1}
                </span>
                {" - "}
                <span className="font-semibold text-gray-300">
                  {Math.min(page * PAGE_SIZE, filteredTrades.length)}
                </span>
                {" of "}
                <span className="font-semibold text-gray-300">
                  {filteredTrades.length}
                </span>
                {" records"}
              </p>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Footer note */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
        <Activity size={18} className="mt-0.5 shrink-0 text-blue-400" />

        <div>
          <p className="text-sm font-medium text-gray-300">
            Your Personal Trading History
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Only your own trading records are displayed here. Your trade history
            is synchronized with your account.
          </p>
        </div>
      </div>
    </div>
  );
}