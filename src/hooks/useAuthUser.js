"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/components/lib/firebase";

/**
 * Current Firebase user.
 * Returns { user, loading }  ->  loading is true until Firebase knows if someone is logged in.
 */
export default function useAuthUser() {
  const [state, setState] = useState({ user: null, loading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false });
    });
    return unsubscribe;
  }, []);

  return state;
}
