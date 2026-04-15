"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const HOLD_SECONDS = 5;

export default function DummyAuthPage() {
  const router = useRouter();
  const { completeDummyLogin, isDummyAuthEnabled } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(HOLD_SECONDS);

  useEffect(() => {
    if (!isDummyAuthEnabled) {
      router.replace("/");
      return;
    }

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : prev));
    }, 1000);

    const complete = setTimeout(() => {
      completeDummyLogin();
      router.replace("/home");
    }, HOLD_SECONDS * 1000);

    return () => {
      clearInterval(countdown);
      clearTimeout(complete);
    };
  }, [completeDummyLogin, isDummyAuthEnabled, router]);

  return (
    <main className="dummy-auth-screen">
      <div className="dummy-auth-card">
        <div className="dummy-auth-spinner" aria-hidden="true" />
        <p className="dummy-auth-eyebrow">Demo Login Flow</p>
        <h1 className="dummy-auth-title">Signing you in with Google</h1>
        <p className="dummy-auth-subtitle">
          Simulating secure login. Redirecting to your home in {secondsLeft}s.
        </p>
      </div>
    </main>
  );
}
