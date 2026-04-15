"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const INTENTIONS_KEY = "4000weeks_user_intentions_v1";

const QUESTIONS = [
  {
    id: "focus_12_weeks",
    label: "What matters most in your next 12 weeks?",
    placeholder: "Name the few things that truly matter.",
    type: "textarea",
  },
  {
    id: "intentional_neglect",
    label: "What will you intentionally neglect for now?",
    placeholder: "List obligations or goals you choose to skip.",
    type: "textarea",
  },
  {
    id: "single_project",
    label: "What is the one project you will serialize first?",
    placeholder: "Pick one project to finish before starting another.",
    type: "text",
  },
  {
    id: "fixed_volume_hours",
    label: "What fixed daily work volume feels sustainable?",
    placeholder: "e.g. 4 focused hours",
    type: "text",
  },
  {
    id: "atelic_activity",
    label: "Which atelic activity will you do for its own sake?",
    placeholder: "e.g. Evening walk, sketching, reading poetry",
    type: "text",
  },
  {
    id: "relationships",
    label: "Which relationships will you prioritize this month?",
    placeholder: "Name people or communities to invest in.",
    type: "textarea",
  },
  {
    id: "boring_tech",
    label: "Which distracting technology will you make boring?",
    placeholder: "e.g. Remove social apps from phone home screen",
    type: "text",
  },
  {
    id: "weekly_reflection_ritual",
    label: "When is your weekly reflection ritual?",
    placeholder: "e.g. Sunday 8:30 PM",
    type: "text",
  },
];

function emptyAnswers() {
  return QUESTIONS.reduce((acc, q) => {
    acc[q.id] = "";
    return acc;
  }, {});
}

export default function UserHomePage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, signOut } = useAuth();
  const [answers, setAnswers] = useState(emptyAnswers);
  const [savedAt, setSavedAt] = useState(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isEditingOnboarding, setIsEditingOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(INTENTIONS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setAnswers((prev) => ({ ...prev, ...parsed.answers }));
      setSavedAt(parsed.savedAt || null);
      setOnboardingComplete(Boolean(parsed.onboardingComplete));
    } catch {
      // Ignore corrupt local data and keep defaults.
    }
  }, []);

  const completionCount = useMemo(
    () => Object.values(answers).filter((v) => v.trim().length > 0).length,
    [answers]
  );

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const payload = {
      answers,
      savedAt: new Date().toISOString(),
      userId: user?.uid || null,
      onboardingComplete: true,
    };
    localStorage.setItem(INTENTIONS_KEY, JSON.stringify(payload));
    setSavedAt(payload.savedAt);
    setOnboardingComplete(true);
    setIsEditingOnboarding(false);
  };

  if (isLoading || !isLoggedIn) return null;

  return (
    <main className="user-home">
      <section className="user-home-hero">
        <div className="user-home-hero-bg" />
        <div className="user-home-inner">
          <motion.p
            className="user-home-kicker"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome back, {user?.displayName || "friend"}
          </motion.p>
          <motion.h1
            className="user-home-title"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Choose what matters in your finite weeks.
          </motion.h1>
          <motion.p
            className="user-home-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            Inspired by Four Thousand Weeks, this page turns ideas into choices:
            limits, trade-offs, and intentional focus.
          </motion.p>
          <motion.div
            className="user-home-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span>{completionCount}/{QUESTIONS.length} answered</span>
            <span>•</span>
            <span>{savedAt ? `Saved ${new Date(savedAt).toLocaleString()}` : "Not saved yet"}</span>
          </motion.div>
          {onboardingComplete && !isEditingOnboarding && (
            <motion.div
              className="user-home-returning-row"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
            >
              <button className="user-home-ghost" onClick={() => setIsEditingOnboarding(true)}>
                Edit onboarding answers
              </button>
              <button className="user-home-ghost" onClick={() => router.push("/")}>
                Back to Main Experience
              </button>
              <button className="user-home-ghost" onClick={signOut}>
                Sign out
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section className="user-home-questions">
        <div className="user-home-inner">
          {!onboardingComplete || isEditingOnboarding ? (
            <>
              {QUESTIONS.map((q, idx) => (
                <motion.div
                  key={q.id}
                  className="user-question-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: Math.min(idx * 0.03, 0.2) }}
                >
                  <label className="user-question-label" htmlFor={q.id}>
                    {idx + 1}. {q.label}
                  </label>
                  {q.type === "textarea" ? (
                    <textarea
                      id={q.id}
                      className="user-question-input user-question-textarea"
                      placeholder={q.placeholder}
                      value={answers[q.id]}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <input
                      id={q.id}
                      className="user-question-input"
                      type="text"
                      placeholder={q.placeholder}
                      value={answers[q.id]}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                  )}
                </motion.div>
              ))}

              <div className="user-home-actions">
                <button className="user-home-save" onClick={handleSave}>
                  Save My Intentions
                </button>
                {onboardingComplete && (
                  <button className="user-home-ghost" onClick={() => setIsEditingOnboarding(false)}>
                    Cancel editing
                  </button>
                )}
                <button className="user-home-ghost" onClick={() => router.push("/")}>
                  Back to Main Experience
                </button>
                <button className="user-home-ghost" onClick={signOut}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="user-home-summary-grid">
              {QUESTIONS.filter((q) => answers[q.id]?.trim()).map((q) => (
                <div key={q.id} className="user-summary-card">
                  <p className="user-summary-label">{q.label}</p>
                  <p className="user-summary-value">{answers[q.id]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
