"use client";

import React, { useEffect, useState } from "react";

import {
  Card,
  Button,
  Tag,
  notification,
} from "antd";

import {
  Wallet,
  User,
  ArrowDownCircle,
  CheckCircle2,
} from "lucide-react";

import {
  doc,
  getDoc,
  runTransaction,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function WithdrawModal() {
  const { user } = useAuth();

  const [api, contextHolder] = notification.useNotification();

  const [balance, setBalance] = useState(0);
  const [userID, setUserID] = useState("");

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // ==========================================
  // Load User + Balance
  // ==========================================

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        setUserLoading(false);
        return;
      }

      try {
        // Get user information
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          setUserID(userData.userID || "");
        }

        // Get user balance
        const balanceRef = doc(db, "balance", user.uid);
        const balanceSnap = await getDoc(balanceRef);

        if (balanceSnap.exists()) {
          const balanceData = balanceSnap.data();

          setBalance(Number(balanceData.amount || 0));
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error("Load user data error:", error);

        api.error({
          message: "Failed to Load Data",
          description: "Unable to load your balance.",
        });
      } finally {
        setUserLoading(false);
      }
    };

    loadUserData();
  }, [user?.uid, api]);

  // ==========================================
  // Generate Transaction ID
  // ==========================================

  const generateTransactionID = () => {
    const randomNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    );

    return `TX${randomNumber}`;
  };

  // ==========================================
  // Submit Withdrawal
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check login
    if (!user?.uid) {
      api.error({
        message: "Login Required",
        description: "Please login first.",
      });

      return;
    }

    const withdrawAmount = Number(amount);

    // Validate amount
    if (
      !amount ||
      Number.isNaN(withdrawAmount) ||
      withdrawAmount <= 0
    ) {
      api.warning({
        message: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
      });

      return;
    }

    // Check available balance
    if (withdrawAmount > balance) {
      api.error({
        message: "Insufficient Balance",
        description: `Your available balance is ৳${balance.toFixed(2)}.`,
      });

      return;
    }

    // Check method
    if (!method) {
      api.warning({
        message: "Select Method",
        description: "Please select a withdrawal method.",
      });

      return;
    }

    // Check bank
    if (!bank) {
      api.warning({
        message: "Select Bank",
        description: "Please select a bank.",
      });

      return;
    }

    // Check account number
    if (!accountNumber.trim()) {
      api.warning({
        message: "Account Number Required",
        description: "Please enter your account number.",
      });

      return;
    }

    setLoading(true);

    try {
      const balanceRef = doc(db, "balance", user.uid);

      const transactionID = generateTransactionID();

      // ==========================================
      // Firebase Atomic Transaction
      // ==========================================

      await runTransaction(db, async (transaction) => {
        const balanceSnap = await transaction.get(balanceRef);

        if (!balanceSnap.exists()) {
          throw new Error("Balance account not found.");
        }

        const balanceData = balanceSnap.data();

        const currentBalance = Number(
          balanceData.amount || 0
        );

        // Double check balance
        if (withdrawAmount > currentBalance) {
          throw new Error(
            `Insufficient balance. Available balance: ৳${currentBalance.toFixed(
              2
            )}`
          );
        }

        const newBalance =
          currentBalance - withdrawAmount;

        // Update balance
        transaction.update(balanceRef, {
          amount: newBalance,
          updatedAt: serverTimestamp(),
        });

        // Create transaction document
        const transactionRef = doc(
          collection(db, "transactions")
        );

        transaction.set(transactionRef, {
          transactionID,

          // Firebase User UID
          uid: user.uid,

          // Public User ID
          userID,

          email: user.email || "",

          type: "withdraw",

          amount: withdrawAmount,

          method,

          bank,

          accountNumber: accountNumber.trim(),

          status: "pending",

          createdAt: serverTimestamp(),

          balanceBefore: currentBalance,

          balanceAfter: newBalance,
        });
      });

      // Update UI balance
      setBalance((prev) => prev - withdrawAmount);

      api.success({
        message: "Withdrawal Request Submitted",
        description: `৳${withdrawAmount.toFixed(
          2
        )} has been deducted from your balance. Transaction ID: ${transactionID}`,
        placement: "topRight",
        duration: 5,
      });

      // Reset form
      setAmount("");
      setMethod("");
      setBank("");
      setAccountNumber("");

    } catch (error) {
      console.error("Withdrawal error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      api.error({
        message: "Withdrawal Failed",
        description: errorMessage,
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <div className="mx-auto w-full max-w-3xl">
        <Card
          bordered={false}
          className="rounded-2xl !bg-[#004d4d] !text-white shadow-xl"
        >
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400">
              <ArrowDownCircle
                size={25}
                className="text-black"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Withdraw
              </h2>

              <p className="text-sm text-gray-300">
                Request a withdrawal from your balance
              </p>
            </div>
          </div>

          {/* Balance + User ID */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Balance */}
            <div className="rounded-xl border border-white/10 bg-[#003b3b] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Wallet
                  size={16}
                  className="text-yellow-400"
                />

                <span className="text-xs text-gray-400">
                  Available Balance
                </span>
              </div>

              <p className="text-2xl font-bold text-white">
                ৳
                {userLoading
                  ? "..."
                  : balance.toFixed(2)}
              </p>
            </div>

            {/* User ID */}
            <div className="rounded-xl border border-white/10 bg-[#003b3b] p-4">
              <div className="mb-2 flex items-center gap-2">
                <User
                  size={16}
                  className="text-yellow-400"
                />

                <span className="text-xs text-gray-400">
                  User ID
                </span>
              </div>

              <p className="font-semibold text-white">
                {userLoading
                  ? "Loading..."
                  : userID || "N/A"}
              </p>
            </div>

          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Amount
                </label>

                <input
                  type="number"
                  min="0.01"
                  max={balance}
                  step="0.01"
                  placeholder="৳ Enter withdrawal amount"
                  className="w-full rounded bg-yellow-300 p-2.5 text-lg font-medium text-black outline-none placeholder:text-gray-600"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                />

                <p className="mt-2 text-xs text-gray-400">
                  Maximum withdrawal: ৳
                  {balance.toFixed(2)}
                </p>
              </div>

              {/* Method */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Method
                </label>

                <select
                  value={method}
                  onChange={(e) =>
                    setMethod(e.target.value)
                  }
                  className="w-full cursor-pointer rounded bg-yellow-300 p-2.5 text-lg font-medium text-black outline-none"
                >
                  <option value="">
                    Select withdrawal method
                  </option>

                  <option value="send_money">
                    Send Money
                  </option>

                  <option value="cash_out">
                    Cash Out
                  </option>

                  <option value="payment">
                    Payment
                  </option>
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Bank */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Bank
                </label>

                <select
                  value={bank}
                  onChange={(e) =>
                    setBank(e.target.value)
                  }
                  className="w-full cursor-pointer rounded bg-yellow-300 p-2.5 text-lg font-medium text-black outline-none"
                >
                  <option value="">
                    Select bank
                  </option>

                  <option value="bkash">
                    bKash
                  </option>

                  <option value="nagad">
                    Nagad
                  </option>

                  <option value="rocket">
                    Rocket
                  </option>

                  <option value="upay">
                    Upay
                  </option>
                </select>
              </div>

              {/* Account Number */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Account Number
                </label>

                <input
                  type="text"
                  placeholder="Enter account number"
                  className="w-full rounded bg-yellow-300 p-2.5 text-lg font-medium text-black outline-none placeholder:text-gray-600"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(e.target.value)
                  }
                />
              </div>

            </div>

            {/* Status Information */}
            <div className="flex items-center gap-3 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-4">
              <CheckCircle2
                size={20}
                className="text-yellow-400"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Withdrawal Status
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Your request will remain pending until it is processed by admin.
                </p>
              </div>

              <Tag
                color="warning"
                className="ml-auto"
              >
                Pending
              </Tag>
            </div>

            {/* Submit */}
            <Button
              htmlType="submit"
              loading={loading}
              disabled={
                userLoading ||
                balance <= 0
              }
              size="large"
              icon={
                <ArrowDownCircle size={18} />
              }
              className="!h-12 !w-full !border-none !bg-yellow-400 !font-bold !text-black hover:!bg-yellow-300"
            >
              {loading
                ? "Processing..."
                : "Submit Withdrawal"}
            </Button>

          </form>
        </Card>
      </div>
    </>
  );
}