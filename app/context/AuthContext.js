"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, signInWithRedirect, signOut as amplifySignOut, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);
const AUTH_ACTIVE = process.env.NEXT_PUBLIC_AUTHENTICATION_ACTIVE !== "false";
const DUMMY_AUTH_ENABLED = !AUTH_ACTIVE;

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Track initial session check so we don't flash "logged out" on page load.
  const [isLoading, setIsLoading] = useState(true);

  // Check for an existing session on mount.
  useEffect(() => {
    if (DUMMY_AUTH_ENABLED) {
      setIsLoading(false);
      return;
    }

    async function loadSession() {
      try {
        await getCurrentUser();
        const attrs = await fetchUserAttributes();
        setUser(mapCognitoUser(attrs));
      } catch {
        // No active session — user is logged out.
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  // Listen for Amplify Hub auth events (login / logout / token refresh).
  useEffect(() => {
    if (DUMMY_AUTH_ENABLED) return;

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          // The redirect callback page calls Hub, this fires after token exchange.
          fetchUserAttributes()
            .then((attrs) => setUser(mapCognitoUser(attrs)))
            .catch(() => setUser(null))
            .finally(() => setIsLoggingIn(false));
          break;
        case "signInWithRedirect_failure":
          console.error("Google sign-in failed:", payload.data);
          setIsLoggingIn(false);
          setUser(null);
          break;
        case "signedOut":
          setUser(null);
          setIsLoggingIn(false);
          break;
        default:
          break;
      }
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoggingIn(true);

    if (DUMMY_AUTH_ENABLED) {
      router.push("/auth/dummy");
      return;
    }

    // Redirect to Cognito Hosted UI → Google OAuth.
    // Control returns via the /auth/callback route.
    await signInWithRedirect({ provider: "Google" });
  }, [router]);

  const completeDummyLogin = useCallback(() => {
    setUser({
      uid: "dummy-user",
      email: "demo@4000weeks.app",
      displayName: "Demo User",
      photoURL: null,
    });
    setIsLoggingIn(false);
  }, []);

  const signOut = useCallback(async () => {
    if (DUMMY_AUTH_ENABLED) {
      setUser(null);
      setIsLoggingIn(false);
      return;
    }

    setIsLoggingIn(true);
    await amplifySignOut();
    // Hub "signedOut" event will clear the user state.
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoggingIn,
        isLoading,
        signInWithGoogle,
        completeDummyLogin,
        signOut,
        isAuthenticationActive: AUTH_ACTIVE,
        isDummyAuthEnabled: DUMMY_AUTH_ENABLED,
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

// ─── helpers ────────────────────────────────────────────────────────────────

/** Map Cognito user attributes to the shape the rest of the app expects. */
function mapCognitoUser(attrs) {
  return {
    uid: attrs.sub,
    email: attrs.email,
    displayName: attrs.name || attrs.email?.split("@")[0] || "User",
    photoURL: attrs.picture || null,
  };
}
