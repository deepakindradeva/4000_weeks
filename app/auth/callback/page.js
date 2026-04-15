"use client";

/**
 * /auth/callback
 *
 * Landing page after the Cognito Hosted UI / Google OAuth redirect.
 * Amplify automatically exchanges the authorization code for tokens when this
 * page mounts — no manual token handling needed.
 *
 * The Hub "signInWithRedirect" event fired in AuthContext will update the user
 * state and redirect the user back to home.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    // Once Amplify has resolved the session, navigate home.
    if (!isLoading) {
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, router]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        color: "#888",
      }}
    >
      Signing you in…
    </div>
  );
}
