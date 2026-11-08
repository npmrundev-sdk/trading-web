"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/components/lib/firebase";

/**
 * Live balance from  balance/{uid}.amount  (realtime, updates by itself
 * when a trade is placed or won).
 * Returns { balance, loading }
 */
export default function useBalance(uid) {
  const [state, setState] = useState({ balance: null, loading: true });

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = onSnapshot(
      doc(db, "balance", uid),
      (snap) => {
        setState({
          balance: snap.exists() ? Number(snap.data().amount) || 0 : 0,
          loading: false,
        });
      },
      (err) => {
        console.error("[useBalance]", err);
        setState({ balance: null, loading: false });
      }
    );

    return unsubscribe;
  }, [uid]);

  return uid ? state : { balance: null, loading: false };
}
