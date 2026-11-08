"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Button,
  Tag,
  notification,
  Spin,
} from "antd";

import {
  Wallet,
  User,
  CreditCard,
  Send,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Smartphone,
  Hash,
  Landmark,
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";


// ==========================================
// BANK CONFIG
// ==========================================

const BANK_CONFIG = {
  Bkash: {
    name: "bKash",
    image: "/assets/Bkash.webp",
  },

  Nagad: {
    name: "Nagad",
    image: "/assets/Nagad.webp",
  },

  Rocket: {
    name: "Rocket",
    image: "/assets/Rocket.webp",
  },

  Upay: {
    name: "Upay",
    image: "/assets/Upai.webp",
  },
};


// ==========================================
// PAYMENT METHOD LABEL
// ==========================================

const PAYMENT_METHOD_LABELS = {
  send_money: "Send Money",
  cash_out: "Cash Out",
  payment: "Payment",
};


// ==========================================
// COMPONENT
// ==========================================

export default function DepositModal() {
  const { user } = useAuth();

  const [api, contextHolder] = notification.useNotification();


  // ==========================================
  // STEP
  // ==========================================

  const [step, setStep] = useState(1);


  // ==========================================
  // USER
  // ==========================================

  const [userID, setUserID] = useState("");
  const [userLoading, setUserLoading] = useState(true);


  // ==========================================
  // BANK DATA
  // ==========================================

  const [bankAccounts, setBankAccounts] = useState([]);
  const [bankLoading, setBankLoading] = useState(true);


  // ==========================================
  // FORM
  // ==========================================

  const [bank, setBank] = useState("");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");

  const [selectedNumberIndex, setSelectedNumberIndex] =
    useState(0);

  const [trxID, setTrxID] = useState("");

  const [loading, setLoading] = useState(false);

  const [copied, setCopied] = useState(false);


  // ==========================================
  // GET USER DATA
  // ==========================================

  useEffect(() => {
    const getUserData = async () => {
      if (!user?.uid) {
        setUserLoading(false);
        return;
      }

      try {
        const userRef = doc(
          db,
          "users",
          user.uid
        );

        const userSnap =
          await getDoc(userRef);

        if (userSnap.exists()) {
          const userData =
            userSnap.data();

          setUserID(
            userData.userID || ""
          );
        } else {
          setUserID("");
        }
      } catch (error) {
        console.error(
          "Failed to load user:",
          error
        );

        api.error({
          message: "User Data Error",
          description:
            "Unable to load your User ID.",
        });
      } finally {
        setUserLoading(false);
      }
    };

    getUserData();
  }, [user?.uid]);


  // ==========================================
  // GET PAYMENT BANKS - REALTIME
  // ==========================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "bankAccounts"),

      (snapshot) => {
        const allBanks = snapshot.docs.map((bankDoc) => ({
          id: bankDoc.id,
          ...bankDoc.data(),
        }));

        console.log("All Banks:", allBanks);

        // কমপক্ষে একটি active/status true number আছে
        const activeBanks = allBanks.filter((bank) => {
          return (
            Array.isArray(bank.accounts) &&
            bank.accounts.some(
              (account) => account.status === true
            )
          );
        });

        console.log("Active Banks:", activeBanks);

        setBankAccounts(activeBanks);

        setBankLoading(false);
      },

      (error) => {
        console.error(
          "Failed to load bank accounts:",
          error
        );

        setBankAccounts([]);

        setBankLoading(false);

        api.error({
          message: "Bank Loading Failed",
          description:
            error.message ||
            "Unable to load payment banks.",
        });
      }
    );

    return () => unsubscribe();
  }, []);


  // ==========================================
  // SELECTED BANK DATA
  // ==========================================

  const selectedBankData =
    useMemo(() => {
      return bankAccounts.find(
        (item) =>
          item.bankType === bank
      );
    }, [bankAccounts, bank]);


  // ==========================================
  // AVAILABLE PAYMENT METHODS
  // ==========================================

  const availableMethods = useMemo(() => {
    if (!selectedBankData?.accounts) {
      return [];
    }

    const activeAccounts =
      selectedBankData.accounts.filter(
        (account) => account.status === true
      );

    const methods = [
      ...new Set(
        activeAccounts.map(
          (account) => account.paymentType
        )
      ),
    ];

    return methods;
  }, [selectedBankData]);


  // ==========================================
  // AVAILABLE NUMBERS
  // ==========================================

  const availableNumbers = useMemo(() => {
    if (!selectedBankData?.accounts) {
      return [];
    }

    return selectedBankData.accounts.filter(
      (account) =>
        account.status === true &&
        account.paymentType === method
    );
  }, [selectedBankData, method]);


  // ==========================================
  // SELECTED NUMBER
  // ==========================================

  const selectedNumber =
    availableNumbers[
    selectedNumberIndex
    ] || null;


  // ==========================================
  // BANK SELECT
  // ==========================================

  const handleBankSelect = (
    bankType
  ) => {
    setBank(bankType);

    setMethod("");

    setSelectedNumberIndex(0);
  };


  // ==========================================
  // PAYMENT METHOD SELECT
  // ==========================================

  const handleMethodSelect = (
    paymentMethod
  ) => {
    setMethod(paymentMethod);

    setSelectedNumberIndex(0);
  };


  // ==========================================
  // CHANGE NUMBER
  // ==========================================

  const handleChangeNumber = () => {
    if (
      availableNumbers.length <= 1
    ) {
      return;
    }

    setSelectedNumberIndex(
      (prev) => {
        if (
          prev ===
          availableNumbers.length - 1
        ) {
          return 0;
        }

        return prev + 1;
      }
    );
  };


  // ==========================================
  // COPY NUMBER
  // ==========================================

  const handleCopyNumber =
    async () => {
      if (
        !selectedNumber?.number
      ) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          selectedNumber.number
        );

        setCopied(true);

        api.success({
          message: "Copied Successfully",
          description:
            "Payment number copied successfully.",
        });

        setTimeout(() => {
          setCopied(false);
        }, 2000);

      } catch (error) {
        console.error(error);

        api.error({
          message: "Copy Failed",
          description:
            "Unable to copy payment number.",
        });
      }
    };


  // ==========================================
  // NEXT STEP
  // ==========================================

  const handleNext = () => {
    if (!bank) {
      api.warning({
        message: "Select Bank",
        description:
          "Please select a payment bank.",
      });

      return;
    }

    if (!method) {
      api.warning({
        message:
          "Select Payment Method",
        description:
          "Please select a payment method.",
      });

      return;
    }

    const numericAmount =
      Number(amount);

    if (
      !amount ||
      Number.isNaN(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      api.warning({
        message: "Invalid Amount",
        description:
          "Please enter a valid deposit amount.",
      });

      return;
    }

    if (
      availableNumbers.length === 0
    ) {
      api.error({
        message:
          "Payment Number Not Available",
        description:
          "No active payment number is available.",
      });

      return;
    }

    setStep(2);
  };


  // ==========================================
  // PREVIOUS STEP
  // ==========================================

  const handlePrevious = () => {
    setStep(1);
  };


  // ==========================================
  // SUBMIT DEPOSIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      api.error({
        message: "Login Required",
        description: "Please login first.",
      });

      return;
    }

    if (!userID) {
      api.error({
        message: "User ID Not Found",
        description:
          "Your User ID could not be found.",
      });

      return;
    }

    if (!selectedNumber) {
      api.error({
        message: "Payment Number Error",
        description:
          "Please select a valid payment number.",
      });

      return;
    }

    // TRX ID must never be null or empty
    const finalTrxID = trxID.trim();

    if (!finalTrxID) {
      api.warning({
        message: "TRX ID Required",
        description: "Please enter your transaction ID.",
      });

      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        userID: userID,
        email: user.email || "",

        type: "deposit",

        bank: bank,

        bankName: BANK_CONFIG[bank]?.name || bank,

        method: method,

        paymentMethod:
          PAYMENT_METHOD_LABELS[method] || method,

        amount: Number(amount),

        receivingNumber: selectedNumber.number || "",

        // User entered TRX ID
        transactionID: finalTrxID,

        status: "pending",

        createdAt: serverTimestamp(),
      });

      api.success({
        message: "Deposit Request Submitted",
        description:
          "Your deposit request has been sent successfully.",
        placement: "topRight",
      });

      // ==========================================
      // RESET FORM
      // ==========================================

      setStep(1);

      setBank("");

      setMethod("");

      setAmount("");

      setTrxID("");

      setSelectedNumberIndex(0);

    } catch (error) {
      console.error(
        "Deposit error:",
        error
      );

      api.error({
        message: "Deposit Failed",
        description:
          error?.message ||
          "Something went wrong. Please try again.",
      });

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // BANK LOADING
  // ==========================================

  if (bankLoading) {
    return (
      <>
        {contextHolder}

        <div className="flex min-h-[300px] items-center justify-center">

          <Spin size="large" />

        </div>
      </>
    );
  }


  return (
    <>
      {contextHolder}

      <div className="mx-auto w-full max-w-4xl">

        <Card
          bordered={false}
          className="
            overflow-hidden
            !rounded-3xl
            !bg-gradient-to-br
            !from-[#004d4d]
            !via-[#003b3b]
            !to-[#002727]
            shadow-2xl
          "
        >

          {/* ================= HEADER ================= */}

          <div className="mb-8">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex h-14 w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-yellow-400
                    shadow-lg
                  "
                >

                  <Wallet
                    size={28}
                    className="text-black"
                  />

                </div>


                <div>

                  <h2 className="text-2xl font-bold text-white">
                    Deposit Balance
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Securely add funds to your account
                  </p>

                </div>

              </div>


              {/* STEP INDICATOR */}

              <div className="hidden items-center gap-2 sm:flex">

                <div
                  className={`h-3 w-3 rounded-full ${step >= 1
                    ? "bg-yellow-400"
                    : "bg-white/20"
                    }`}
                />

                <div className="h-[2px] w-10 bg-white/20" />

                <div
                  className={`h-3 w-3 rounded-full ${step === 2
                    ? "bg-yellow-400"
                    : "bg-white/20"
                    }`}
                />

              </div>

            </div>

          </div>


          {/* ================= USER INFO ================= */}

          <div
            className="
              mb-8
              grid
              grid-cols-1
              gap-4
              md:grid-cols-2
            "
          >

            {/* USER ID */}

            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-black/10
                p-4
              "
            >

              <div className="mb-2 flex items-center gap-2">

                <User
                  size={17}
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


            {/* TYPE */}

            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-black/10
                p-4
              "
            >

              <div className="mb-2 flex items-center gap-2">

                <CreditCard
                  size={17}
                  className="text-yellow-400"
                />

                <span className="text-xs text-gray-400">
                  Transaction Type
                </span>

              </div>

              <Tag color="green">
                Deposit
              </Tag>

            </div>

          </div>


          {/* ================================================= */}
          {/* STEP 1 */}
          {/* ================================================= */}

          {step === 1 && (

            <div className="space-y-7">


              {/* BANK SELECT */}

              <div>

                <div className="mb-3 flex items-center gap-2">

                  <Landmark
                    size={18}
                    className="text-yellow-400"
                  />

                  <h3 className="font-semibold text-white">
                    Select Payment Bank
                  </h3>

                </div>


                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                    sm:grid-cols-4
                  "
                >

                  {bankAccounts.map(
                    (bankItem) => {

                      const config =
                        BANK_CONFIG[
                        bankItem.bankType
                        ];

                      if (!config) {
                        return null;
                      }

                      const isSelected =
                        bank ===
                        bankItem.bankType;


                      return (

                        <button
                          key={bankItem.id}
                          type="button"
                          onClick={() =>
                            handleBankSelect(
                              bankItem.bankType
                            )
                          }
                          className={`
                            group
                            relative
                            flex
                            min-h-28
                            flex-col
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            p-4
                            transition-all
                            duration-300
                            ${isSelected
                              ? `
                                  border-yellow-400
                                  bg-yellow-400/10
                                  shadow-lg
                                  shadow-yellow-400/10
                                `
                              : `
                                  border-white/10
                                  bg-white/[0.03]
                                  hover:-translate-y-1
                                  hover:border-yellow-400/50
                                  hover:bg-white/[0.07]
                                `
                            }
                          `}
                        >

                          <div
                            className="
                              flex
                              h-14
                              w-full
                              items-center
                              justify-center
                            "
                          >

                            <img
                              src={config.image}
                              alt={config.name}
                              className="
                                max-h-12
                                max-w-[120px]
                                object-contain
                              "
                            />

                          </div>

                          <p
                            className="
                              mt-3
                              text-sm
                              font-semibold
                              text-white
                            "
                          >

                            {config.name}

                          </p>


                          {isSelected && (

                            <div
                              className="
                                absolute
                                right-2
                                top-2
                              "
                            >

                              <CheckCircle2
                                size={18}
                                className="text-yellow-400"
                              />

                            </div>

                          )}

                        </button>

                      );
                    }
                  )}

                </div>


                {bankAccounts.length === 0 && (

                  <div
                    className="
                      rounded-xl
                      border
                      border-dashed
                      border-white/20
                      p-6
                      text-center
                      text-sm
                      text-gray-400
                    "
                  >

                    No active payment bank is currently available.

                  </div>

                )}

              </div>


              {/* PAYMENT METHOD */}

              {bank && (

                <div>

                  <div className="mb-3 flex items-center gap-2">

                    <Smartphone
                      size={18}
                      className="text-yellow-400"
                    />

                    <h3 className="font-semibold text-white">
                      Select Payment Method
                    </h3>

                  </div>


                  <div
                    className="
                      grid
                      grid-cols-1
                      gap-3
                      sm:grid-cols-3
                    "
                  >

                    {availableMethods.map(
                      (paymentMethod) => {

                        const isSelected =
                          method ===
                          paymentMethod;

                        return (

                          <button
                            key={paymentMethod}
                            type="button"
                            onClick={() =>
                              handleMethodSelect(
                                paymentMethod
                              )
                            }
                            className={`
                              rounded-xl
                              border
                              px-5
                              py-4
                              text-left
                              transition-all
                              ${isSelected
                                ? `
                                    border-yellow-400
                                    bg-yellow-400
                                    text-black
                                  `
                                : `
                                    border-white/10
                                    bg-white/[0.04]
                                    text-white
                                    hover:border-yellow-400/50
                                  `
                              }
                            `}
                          >

                            <p className="font-semibold">

                              {
                                PAYMENT_METHOD_LABELS[
                                paymentMethod
                                ] ||
                                paymentMethod
                              }

                            </p>

                          </button>

                        );
                      }
                    )}

                  </div>

                </div>

              )}


              {/* AMOUNT */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-gray-200
                  "
                >
                  Deposit Amount
                </label>


                <div className="relative">

                  <span
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      font-bold
                      text-yellow-300
                    "
                  >
                    ৳
                  </span>


                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter deposit amount"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-transparent
                      px-10
                      text-lg
                      font-semibold text-yellow-300
                      outline-none placeholder:text-yellow-300
                      transition
                      focus:border-yellow-400
                      focus:ring-4
                      focus:ring-yellow-400/20
                    "
                  />

                </div>

              </div>


              {/* NEXT BUTTON */}

              <Button
                type="primary"
                size="large"
                onClick={handleNext}
                disabled={
                  bankAccounts.length === 0
                }
                className="
                  !h-14
                  !w-full
                  !rounded-xl
                  !border-none
                  !bg-yellow-400
                  !text-base
                  !font-bold
                  !text-black
                  hover:!bg-yellow-300
                "
              >

                Continue to Payment

                <ArrowRight size={18} />

              </Button>

            </div>

          )}


          {/* ================================================= */}
          {/* STEP 2 */}
          {/* ================================================= */}

          {step === 2 && (

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >


              {/* PAYMENT SUMMARY */}

              <div
                className="
                  rounded-2xl
                  border
                  border-yellow-400/20
                  bg-yellow-400/[0.05]
                  p-5
                "
              >

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-between
                  "
                >

                  <h3 className="font-semibold text-white">
                    Payment Details
                  </h3>

                  <Tag color="gold">
                    Step 2 of 2
                  </Tag>

                </div>


                <div
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-3
                  "
                >

                  <div>

                    <p className="text-xs text-gray-400">
                      Bank
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {
                        BANK_CONFIG[
                          bank
                        ]?.name
                      }
                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-400">
                      Method
                    </p>

                    <p className="mt-1 font-semibold text-white">

                      {
                        PAYMENT_METHOD_LABELS[
                        method
                        ] || method
                      }

                    </p>

                  </div>


                  <div>

                    <p className="text-xs text-gray-400">
                      Amount
                    </p>

                    <p className="mt-1 text-lg font-bold text-yellow-400">

                      ৳{" "}

                      {Number(
                        amount
                      ).toLocaleString()}

                    </p>

                  </div>

                </div>

              </div>


              {/* PAYMENT NUMBER */}

              <div>

                <div
                  className="
                    mb-3
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div>

                    <p className="font-semibold text-white">
                      Send Money To
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Use the selected payment method
                      to send the amount.
                    </p>

                  </div>


                  {availableNumbers.length > 1 && (

                    <Button
                      type="default"
                      htmlType="button"
                      onClick={
                        handleChangeNumber
                      }
                      icon={
                        <RefreshCw
                          size={16}
                        />
                      }
                    >
                      Change Number
                    </Button>

                  )}

                </div>


                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/20
                    p-6
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-between
                      gap-5
                      sm:flex-row
                    "
                  >

                    <div className="flex items-center gap-4">

                      {BANK_CONFIG[
                        bank
                      ] && (

                          <div
                            className="
                            flex
                            h-16
                            w-24
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            p-2
                          "
                          >

                            <img
                              src={
                                BANK_CONFIG[
                                  bank
                                ].image
                              }
                              alt={
                                BANK_CONFIG[
                                  bank
                                ].name
                              }
                              className="
                              max-h-12
                              max-w-full
                              object-contain
                            "
                            />

                          </div>

                        )}


                      <div>

                        <p className="text-xs text-gray-400">
                          Payment Number
                        </p>

                        <p
                          className="
                            mt-1
                            text-2xl
                            font-bold
                            tracking-wider
                            text-white
                          "
                        >

                          {
                            selectedNumber?.number ||
                            "N/A"
                          }

                        </p>


                        {availableNumbers.length > 1 && (

                          <p className="mt-1 text-xs text-yellow-400">

                            Number{" "}

                            {
                              selectedNumberIndex + 1
                            }

                            {" "}of{" "}

                            {
                              availableNumbers.length
                            }

                          </p>

                        )}

                      </div>

                    </div>


                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={
                        handleCopyNumber
                      }
                      icon={
                        copied ? (
                          <Check
                            size={16}
                          />
                        ) : (
                          <Copy
                            size={16}
                          />
                        )
                      }
                      className="
                        !border-none
                        !bg-yellow-400
                        !font-semibold
                        !text-black
                        hover:!bg-yellow-300
                      "
                    >

                      {copied
                        ? "Copied"
                        : "Copy Number"}

                    </Button>

                  </div>

                </div>

              </div>


              {/* TRX ID */}

              <div>

                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-gray-200
                  "
                >

                  <Hash
                    size={16}
                    className="text-yellow-400"
                  />

                  Transaction ID / TRX ID

                </label>


                <input
                  type="text"
                  value={trxID}
                  onChange={(e) =>
                    setTrxID(
                      e.target.value
                    )
                  }
                  placeholder="Enter your transaction ID"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-transparent
                    px-4
                    text-base
                    font-medium
                    text-yellow-300 placeholder:text-yellow-300
                    outline-none
                    transition
                    focus:border-yellow-400
                    focus:ring-4
                    focus:ring-yellow-400/20
                  "
                />

                <p className="mt-2 text-xs text-gray-400">
                  After completing your payment,
                  enter the transaction ID here.
                </p>

              </div>


              {/* STATUS */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-yellow-400/20
                  bg-yellow-400/[0.05]
                  p-4
                "
              >

                <CheckCircle2
                  size={22}
                  className="
                    shrink-0
                    text-yellow-400
                  "
                />

                <div>

                  <p className="text-sm font-semibold text-white">
                    Verification Required
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Your deposit request will remain
                    pending until verified by the admin.
                  </p>

                </div>

                <Tag
                  color="warning"
                  className="ml-auto"
                >
                  Pending
                </Tag>

              </div>


              {/* BUTTONS */}

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >

                <Button
                  type="default"
                  htmlType="button"
                  size="large"
                  onClick={
                    handlePrevious
                  }
                  className="
                    !h-12
                    !rounded-xl
                    sm:!w-1/3
                  "
                >

                  <ArrowLeft size={18} />

                  Previous

                </Button>


                <Button
                  htmlType="submit"
                  loading={loading}
                  type="primary"
                  size="large"
                  icon={
                    <Send size={18} />
                  }
                  className="
                    h-12
                    !flex-1
                    !rounded-xl
                    !border-none
                    !bg-yellow-400
                    !font-bold
                    !text-black
                    hover:!bg-yellow-300
                  "
                >

                  {loading
                    ? "Submitting..."
                    : "Submit Deposit Request"}

                </Button>

              </div>

            </form>

          )}

        </Card>

      </div>
    </>
  );
}