"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { seedDemoData } from "../lib/storage";
import { DEMO_EVENTS, DEMO_REFLECTIONS, DEMO_USER } from "../lib/dummyData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    setIsLoggingIn(true);
    // Simulate network delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setUser(DEMO_USER);
    // Seed the tracker with demo data so new users see a full timeline immediately
    seedDemoData(DEMO_EVENTS, DEMO_REFLECTIONS);
    setIsLoggingIn(false);
  }, []);

  const signOut = useCallback(async () => {
    setIsLoggingIn(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setUser(null);
    setIsLoggingIn(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoggingIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
