"use client";

import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  UserPlus,
  Users,
} from "lucide-react";

import { useState } from "react";
import { notification } from "antd";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { auth, db } from "@/components/lib/firebase";


// ==========================================
// PHONE TO INTERNAL EMAIL
// ==========================================

const PHONE_EMAIL_DOMAIN = "phone.yourapp.internal";

const phoneToEmail = (phoneNumber) => {
  const cleanPhone = phoneNumber.replace(/\D/g, "");

  return `${cleanPhone}@${PHONE_EMAIL_DOMAIN}`;
};


// ==========================================
// VALIDATE BANGLADESH PHONE
// ==========================================

const normalizePhone = (phoneNumber) => {
  let phone = phoneNumber.replace(/\D/g, "");

  // +8801XXXXXXXXX
  if (phone.startsWith("880")) {
    phone = phone.substring(2);
  }

  // 01XXXXXXXXX
  if (!phone.startsWith("01")) {
    return null;
  }

  if (phone.length !== 11) {
    return null;
  }

  return phone;
};


// ==========================================
// EMAIL VALIDATION
// ==========================================

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};


// ==========================================
// COMPONENT
// ==========================================

export default function AuthModal({ open, onClose }) {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState("login");

  const [showPass, setShowPass] =
    useState(false);

  const [loginType, setLoginType] =
    useState("email");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [referralUserID, setReferralUserID] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [api, contextHolder] =
    notification.useNotification();


  if (!open) return null;


  // ==========================================
  // GENERATE 8 DIGIT USER ID
  // ==========================================

  const generateUserID = () => {
    return String(
      Math.floor(
        10000000 +
        Math.random() * 90000000
      )
    );
  };


  // ==========================================
  // CREATE UNIQUE USER ID
  // ==========================================

  const createUniqueUserID = async (
    transaction
  ) => {
    let attempts = 0;

    while (attempts < 20) {
      const newUserID =
        generateUserID();

      const userIDRef = doc(
        db,
        "userIDs",
        newUserID
      );

      const existing =
        await transaction.get(
          userIDRef
        );

      if (!existing.exists()) {
        transaction.set(userIDRef, {
          userID: newUserID,
          createdAt:
            serverTimestamp(),
        });

        return newUserID;
      }

      attempts++;
    }

    throw new Error(
      "Unable to generate a unique User ID. Please try again."
    );
  };


  // ==========================================
  // FIND REFERRER
  // ==========================================

  const findReferrer = async (
    userID
  ) => {
    const usersQuery = query(
      collection(db, "users"),
      where(
        "userID",
        "==",
        userID
      )
    );

    const snapshot =
      await getDocs(usersQuery);

    if (snapshot.empty) {
      return null;
    }

    const referrerDoc =
      snapshot.docs[0];

    return {
      uid: referrerDoc.id,
      ...referrerDoc.data(),
    };
  };


  // ==========================================
  // GET AUTH EMAIL
  // ==========================================

  const getAuthEmail = () => {
    if (loginType === "email") {
      const cleanEmail =
        email.trim().toLowerCase();

      if (!cleanEmail) {
        throw new Error(
          "Email address is required."
        );
      }

      if (!isValidEmail(cleanEmail)) {
        throw new Error(
          "Please enter a valid email address."
        );
      }

      return {
        authEmail: cleanEmail,
        realEmail: cleanEmail,
        realPhone: "",
      };
    }


    const normalizedPhone =
      normalizePhone(phone);

    if (!normalizedPhone) {
      throw new Error(
        "Please enter a valid 11 digit Bangladesh phone number."
      );
    }

    return {
      authEmail:
        phoneToEmail(normalizedPhone),

      realEmail: "",

      realPhone:
        `+88${normalizedPhone}`,
    };
  };


  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async () => {
    if (!password) {
      api.error({
        message: "Login Error",
        description:
          "Password is required.",
      });

      return;
    }

    setLoading(true);

    try {
      const {
        authEmail,
      } = getAuthEmail();


      // ======================================
      // FIREBASE LOGIN
      // ======================================

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          authEmail,
          password
        );

      const firebaseUser =
        userCredential.user;


      // ======================================
      // GET USER PROFILE
      // ======================================

      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const userSnapshot =
        await getDocs(
          query(
            collection(db, "users"),
            where(
              "uid",
              "==",
              firebaseUser.uid
            )
          )
        );


      if (userSnapshot.empty) {
        await signOut(auth);

        api.error({
          message: "Account Error",
          description:
            "User profile was not found.",
        });

        return;
      }


      const userData =
        userSnapshot.docs[0].data();


      // ======================================
      // STATUS CHECK
      // ======================================

      if (
        userData.status !== "active"
      ) {
        await signOut(auth);

        api.error({
          message: "Account Inactive",
          description:
            "Your account is currently inactive. Please contact support.",
        });

        return;
      }


      // ======================================
      // SUCCESS
      // ======================================

      api.success({
        message:
          "Login Successful",
        description:
          "Welcome back!",
      });


      setEmail("");
      setPhone("");
      setPassword("");


      onClose();


      // ======================================
      // REDIRECT
      // ======================================

      if (
        userData.roll === "admin"
      ) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      let message =
        error?.message ||
        "Authentication failed.";


      if (
        error?.code ===
        "auth/invalid-credential"
      ) {
        message =
          "Invalid email/phone or password.";
      }

      if (
        error?.code ===
        "auth/user-not-found"
      ) {
        message =
          "No account found.";
      }

      if (
        error?.code ===
        "auth/wrong-password"
      ) {
        message =
          "Incorrect password.";
      }


      api.error({
        message:
          "Login Failed",
        description:
          message,
      });

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // SIGNUP
  // ==========================================

  const handleSignup = async () => {
    if (!password) {
      api.error({
        message: "Signup Error",
        description:
          "Password is required.",
      });

      return;
    }

    if (password.length < 6) {
      api.error({
        message: "Signup Error",
        description:
          "Password must be at least 6 characters.",
      });

      return;
    }

    setLoading(true);

    try {

      // ======================================
      // GET AUTH EMAIL / PHONE
      // ======================================

      const {
        authEmail,
        realEmail,
        realPhone,
      } = getAuthEmail();


      // ======================================
      // REFERRAL
      // ======================================

      const cleanReferralID =
        referralUserID.trim();

      let referrer = null;

      if (cleanReferralID) {
        referrer =
          await findReferrer(
            cleanReferralID
          );

        if (!referrer) {
          api.error({
            message:
              "Invalid Referral ID",
            description:
              "No user was found with this Referral User ID.",
          });

          setLoading(false);

          return;
        }
      }


      // ======================================
      // CREATE FIREBASE ACCOUNT
      // ======================================

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          authEmail,
          password
        );

      const firebaseUser =
        userCredential.user;

      const uid =
        firebaseUser.uid;


      // ======================================
      // FIRESTORE REFERENCES
      // ======================================

      const userRef = doc(
        db,
        "users",
        uid
      );

      const balanceRef = doc(
        db,
        "balance",
        uid
      );

      const activityRef = doc(
        db,
        "activity",
        uid
      );

      const othersRef = doc(
        db,
        "others",
        uid
      );


      // ======================================
      // CREATE USER DATA
      // ======================================

      let newUserID = "";


      await runTransaction(
        db,
        async (transaction) => {

          newUserID =
            await createUniqueUserID(
              transaction
            );


          // ==================================
          // USERS
          // ==================================

          const userData = {
            uid,

            userID:
              newUserID,

            // Real Email
            email:
              realEmail,

            // Real Phone
            phone:
              realPhone,

            // Internal Firebase Email
            authEmail,

            name: "",

            roll:
              "user",

            status:
              "active",

            createdAt:
              serverTimestamp(),
          };


          // ==================================
          // REFERRAL
          // ==================================

          if (referrer) {
            userData.referredByUid =
              referrer.uid;

            userData.referredByUserID =
              referrer.userID;
          }


          transaction.set(
            userRef,
            userData
          );


          // ==================================
          // BALANCE
          // ==================================

          transaction.set(
            balanceRef,
            {
              uid,

              amount: 0,

              updatedAt:
                serverTimestamp(),
            }
          );


          // ==================================
          // ACTIVITY
          // ==================================

          transaction.set(
            activityRef,
            {
              uid,

              lastLogin:
                null,

              totalGames:
                0,

              createdAt:
                serverTimestamp(),
            }
          );


          // ==================================
          // OTHERS
          // ==================================

          transaction.set(
            othersRef,
            {
              uid,

              vipLevel:
                0,

              bonus:
                0,

              referralCode:
                newUserID,
            }
          );

        }
      );


      // ======================================
      // SIGNUP SUCCESS
      // ======================================

      api.success({
        message:
          "Signup Successful",

        description:
          `Your User ID is ${newUserID}`,
      });


      setEmail("");
      setPhone("");
      setPassword("");
      setReferralUserID("");


      onClose();

      router.replace("/");

    } catch (error) {
      console.error(
        "Signup error:",
        error
      );


      let message =
        error?.message ||
        "Something went wrong.";


      if (
        error?.code ===
        "auth/email-already-in-use"
      ) {
        message =
          loginType === "phone"
            ? "This phone number is already registered."
            : "This email is already registered.";
      }


      api.error({
        message:
          "Signup Failed",
        description:
          message,
      });

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async () => {
    if (activeTab === "login") {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };


  return (
    <>
      {contextHolder}

      <div className="fixed inset-0 z-50 flex items-center justify-center">

        {/* OVERLAY */}

        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={
            loading
              ? undefined
              : onClose
          }
        />


        {/* MODAL */}

        <div className="relative z-10 w-[400px] max-w-[calc(100%-24px)] rounded-2xl bg-[#043d3b] p-6 text-white shadow-2xl">


          {/* CLOSE */}

          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-3 top-3 text-yellow-400 transition hover:rotate-90 disabled:opacity-50"
          >
            <X />
          </button>


          {/* LOGIN / SIGNUP */}

          <div className="mb-6 flex justify-center">

            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setReferralUserID("");
              }}
              className={`rounded-l-lg px-6 py-2 font-semibold ${
                activeTab === "login"
                  ? "bg-yellow-400 text-black"
                  : "bg-[#022b2a] text-gray-300"
              }`}
            >
              Login
            </button>


            <button
              type="button"
              onClick={() =>
                setActiveTab("signup")
              }
              className={`rounded-r-lg px-6 py-2 font-semibold ${
                activeTab === "signup"
                  ? "bg-yellow-400 text-black"
                  : "bg-[#022b2a] text-gray-300"
              }`}
            >
              Signup
            </button>

          </div>


          {/* EMAIL / PHONE SWITCH */}

          <div className="mb-4 grid grid-cols-2 gap-2">

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setLoginType("email")
              }
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                loginType === "email"
                  ? "bg-yellow-400 text-black"
                  : "bg-[#022b2a] text-gray-300"
              }`}
            >
              Email
            </button>


            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setLoginType("phone")
              }
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                loginType === "phone"
                  ? "bg-yellow-400 text-black"
                  : "bg-[#022b2a] text-gray-300"
              }`}
            >
              Phone Number
            </button>

          </div>


          {/* EMAIL INPUT */}

          {loginType === "email" && (

            <div className="relative mb-4">

              <Mail
                className="absolute left-3 top-3 text-yellow-400"
                size={18}
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-lg bg-[#022b2a] py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-yellow-400"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={loading}
              />

            </div>

          )}


          {/* PHONE INPUT */}

          {loginType === "phone" && (

            <div className="relative mb-4">

              <Phone
                className="absolute left-3 top-3 text-yellow-400"
                size={18}
              />

              <input
                type="tel"
                inputMode="numeric"
                placeholder="01XXXXXXXXX"
                maxLength={14}
                className="w-full rounded-lg bg-[#022b2a] py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-yellow-400"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                disabled={loading}
              />

            </div>

          )}


          {/* PASSWORD */}

          <div className="relative mb-4">

            <Lock
              className="absolute left-3 top-3 text-yellow-400"
              size={18}
            />

            <input
              type={
                showPass
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              className="w-full rounded-lg bg-[#022b2a] py-2 pl-10 pr-10 outline-none focus:ring-2 focus:ring-yellow-400"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              disabled={loading}
            />


            <button
              type="button"
              onClick={() =>
                setShowPass(!showPass)
              }
              className="absolute right-3 top-2.5 text-gray-300"
              disabled={loading}
            >

              {showPass ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}

            </button>

          </div>


          {/* REFERRAL */}

          {activeTab === "signup" && (

            <div className="mb-4">

              <div className="relative">

                <Users
                  className="absolute left-3 top-3 text-yellow-400"
                  size={18}
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="Referral User ID (Optional)"
                  className="w-full rounded-lg bg-[#022b2a] py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-yellow-400"
                  value={referralUserID}
                  onChange={(e) =>
                    setReferralUserID(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  disabled={loading}
                />

              </div>

              <p className="mt-1.5 text-[11px] text-gray-400">
                Enter the 8-digit User ID of the person who referred you.
              </p>

            </div>

          )}


          {/* SUBMIT */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mb-4 w-full rounded-lg bg-yellow-400 py-2 font-bold text-black hover:opacity-90 disabled:opacity-60"
          >

            {loading
              ? "Processing..."
              : activeTab === "login"
              ? "লগইন"
              : "নিবন্ধন"}

          </button>


          {/* INFO */}

          <p className="text-center text-xs text-gray-400">
            {loginType === "phone"
              ? "Use your phone number and password to login without OTP."
              : "Use your email address and password to continue."}
          </p>

        </div>

      </div>
    </>
  );
}