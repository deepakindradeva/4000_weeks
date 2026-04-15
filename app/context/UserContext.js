"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { calculateLifeData } from "../lib/lifeExpectancy";
import { DEMO_PROFILE } from "../lib/dummyData";

const STORAGE_KEY = "4000weeks_user_profile";

const UserContext = createContext(null);

function loadProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProfile(profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [lifeData, setLifeData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = loadProfile();
    if (saved) {
      setProfile(saved);
      setLifeData(calculateLifeData(saved));
    } else {
      // First-time visitor: show demo profile so the full UI is visible
      setProfile(DEMO_PROFILE);
      setLifeData(calculateLifeData(DEMO_PROFILE));
    }
  }, []);

  const updateProfile = useCallback((data) => {
    // Strip isDemo flag when the user saves their real data
    const newProfile = { ...profile, ...data, isDemo: false };
    setProfile(newProfile);
    saveProfile(newProfile);
    setLifeData(calculateLifeData(newProfile));
  }, [profile]);

  const clearProfile = useCallback(() => {
    setProfile(DEMO_PROFILE);
    setLifeData(calculateLifeData(DEMO_PROFILE));
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const isDemo = !!profile?.isDemo;

  return (
    <UserContext.Provider
      value={{
        profile,
        lifeData,
        updateProfile,
        clearProfile,
        mounted,
        hasProfile: !!profile?.birthYear,
        isDemo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
