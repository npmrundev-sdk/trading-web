"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import { notification } from "antd";

import { useAuth } from "@/context/AuthContext";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const { user } = useAuth();

  const [activeModal, setActiveModal] =
    useState(null);

  const [api, contextHolder] =
    notification.useNotification();

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openModal = (modalName) => {
    // Login modal can always open
    if (modalName === "login") {
      setActiveModal("login");
      return;
    }

    // Other modals require login
    if (!user?.uid) {
      api.warning({
        message: "Login Required",
        description:
          "আগে লগইন করুন, তারপর এই অপশনটি ব্যবহার করুন।",
        placement: "topRight",
      });

      return;
    }

    setActiveModal(modalName);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      {contextHolder}

      <ModalContext.Provider
        value={{
          activeModal,
          openModal,
          closeModal,

          isLoginOpen:
            activeModal === "login",

          isProfileOpen:
            activeModal === "profile",

          isRewardOpen:
            activeModal === "reward",
        }}
      >
        {children}
      </ModalContext.Provider>
    </>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);

  if (!ctx) {
    throw new Error(
      "useModal must be used inside ModalProvider"
    );
  }

  return ctx;
}