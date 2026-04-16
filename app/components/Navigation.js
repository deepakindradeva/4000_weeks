"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navigation() {
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const { user, isLoggedIn, isLoggingIn, signInWithGoogle, signOut } =
    useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showUserMenu]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <motion.nav
        className="nav"
        initial={{ y: -52 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}>
        <div className="nav-content">
          <div className="nav-brand">
            4,000 Weeks <span>— Oliver Burkeman</span>
          </div>
          <div className="nav-right">
            <ul className="nav-links">
              <li>
                <a href="#premise">The Premise</a>
              </li>
              <li>
                <a href="#ideas">Key Ideas</a>
              </li>
              <li>
                <a href="#tools">10 Tools</a>
              </li>
              <li>
                <a href="#figures">Famous People</a>
              </li>
            </ul>

            {/* Mobile hamburger */}
            <button
              className="nav-mobile-toggle"
              onClick={() => setShowMobileMenu((prev) => !prev)}
              aria-label="Toggle mobile menu">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Auth button area */}
            {isLoggedIn ? (
              <div className="nav-user-area" ref={menuRef}>
                <button
                  className="nav-avatar-btn"
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  aria-label="User menu"
                  id="nav-user-menu-toggle">
                  <div className="nav-avatar">
                    {getInitials(user.displayName)}
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="nav-user-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                      <div className="nav-dropdown-header">
                        <div className="nav-dropdown-avatar">
                          {getInitials(user.displayName)}
                        </div>
                        <div className="nav-dropdown-info">
                          <span className="nav-dropdown-name">
                            {user.displayName}
                          </span>
                          <span className="nav-dropdown-email">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <div className="nav-dropdown-divider" />
                      <button
                        className="nav-dropdown-item nav-dropdown-signout"
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        id="nav-sign-out-btn">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                className="nav-google-btn"
                onClick={signInWithGoogle}
                disabled={isLoggingIn}
                id="nav-google-sign-in-btn">
                {isLoggingIn ? (
                  <div className="nav-google-spinner" />
                ) : (
                  <svg
                    className="nav-google-icon"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>{isLoggingIn ? "Signing in…" : "Sign in"}</span>
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="nav-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}>
            <ul className="nav-mobile-links">
              <li>
                <a href="#premise" onClick={() => setShowMobileMenu(false)}>
                  The Premise
                </a>
              </li>
              <li>
                <a href="#ideas" onClick={() => setShowMobileMenu(false)}>
                  Key Ideas
                </a>
              </li>
              <li>
                <a href="#tools" onClick={() => setShowMobileMenu(false)}>
                  10 Tools
                </a>
              </li>
              <li>
                <a href="#figures" onClick={() => setShowMobileMenu(false)}>
                  Famous People
                </a>
              </li>
            </ul>
            {!isLoggedIn && (
              <button
                className="nav-mobile-signin"
                onClick={() => {
                  signInWithGoogle();
                  setShowMobileMenu(false);
                }}
                disabled={isLoggingIn}>
                Sign in with Google
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <motion.div
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
      />
    </>
  );
}
