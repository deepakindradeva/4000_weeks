"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { getEventStats, getReflectionStats } from "../lib/storage";
import WikipediaLifeLens from "../components/WikipediaLifeLens";
import LifeTracker from "../components/LifeTracker";
import Calculator from "../components/Calculator";

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
  const { profile } = useUser();
  const [answers, setAnswers] = useState(emptyAnswers);
  const [savedAt, setSavedAt] = useState(null);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isEditingOnboarding, setIsEditingOnboarding] = useState(false);
  const [stats, setStats] = useState({ events: 0, reflections: 0 });

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

  // Load stats for dashboard display
  useEffect(() => {
    if (typeof window === "undefined" || !onboardingComplete) return;
    try {
      const eventStats = getEventStats();
      const reflectionStats = getReflectionStats();
      setStats({
        events: eventStats.total,
        reflections: reflectionStats.total,
      });
    } catch {
      // Ignore errors
    }
  }, [onboardingComplete]);

  const completionCount = useMemo(
    () => Object.values(answers).filter((v) => v.trim().length > 0).length,
    [answers],
  );
  const isOnboardingView = !onboardingComplete || isEditingOnboarding;

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
    <main
      className={`user-home ${isOnboardingView ? "user-home--onboarding" : "user-home--returning"}`}>
      <section
        className={`user-home-hero ${isOnboardingView ? "user-home-hero--onboarding" : "user-home-hero--returning"}`}>
        <div className="user-home-hero-bg" />
        <div className="user-home-inner">
          <motion.p
            className="user-home-kicker"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            Welcome back, {user?.displayName || "friend"}
          </motion.p>
          <motion.h1
            className="user-home-title"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}>
            {isOnboardingView
              ? "Choose what matters in your finite weeks."
              : "Your finite-week dashboard is ready."}
          </motion.h1>
          <motion.p
            className="user-home-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}>
            {isOnboardingView
              ? "Inspired by Four Thousand Weeks, this page turns ideas into choices: limits, trade-offs, and intentional focus."
              : "You already completed onboarding. Review your commitments, keep them alive, and revise only when needed."}
          </motion.p>
          <motion.div
            className="user-home-meta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <span>
              {completionCount}/{QUESTIONS.length} answered
            </span>
            <span>•</span>
            <span>
              {savedAt
                ? `Saved ${new Date(savedAt).toLocaleString()}`
                : "Not saved yet"}
            </span>
          </motion.div>
          {!isOnboardingView && (
            <motion.div
              className="user-home-returning-row"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}>
              <button
                className="user-home-ghost"
                onClick={() => setIsEditingOnboarding(true)}>
                Edit onboarding answers
              </button>
              <button
                className="user-home-ghost"
                onClick={() => router.push("/")}>
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
          {isOnboardingView ? (
            <>
              <div className="user-home-section-intro">
                <h2>First-time setup</h2>
                <p>
                  Answer these once to define your direction. You can edit later
                  anytime.
                </p>
              </div>
              {QUESTIONS.map((q, idx) => (
                <motion.div
                  key={q.id}
                  className="user-question-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(idx * 0.03, 0.2),
                  }}>
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
                  <button
                    className="user-home-ghost"
                    onClick={() => setIsEditingOnboarding(false)}>
                    Cancel editing
                  </button>
                )}
                <button
                  className="user-home-ghost"
                  onClick={() => router.push("/")}>
                  Back to Main Experience
                </button>
                <button className="user-home-ghost" onClick={signOut}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="user-home-dashboard-cards">
                <div className="user-dashboard-card">
                  <p className="user-summary-label">Primary 12-week focus</p>
                  <p className="user-summary-value">
                    {answers.focus_12_weeks || "Set this in onboarding."}
                  </p>
                </div>
                <div className="user-dashboard-card">
                  <p className="user-summary-label">Intentional neglect</p>
                  <p className="user-summary-value">
                    {answers.intentional_neglect || "Set this in onboarding."}
                  </p>
                </div>
                <div className="user-dashboard-card">
                  <p className="user-summary-label">Weekly reflection ritual</p>
                  <p className="user-summary-value">
                    {answers.weekly_reflection_ritual ||
                      "Set this in onboarding."}
                  </p>
                </div>
              </div>

              <div className="dashboard-sections">
                {/* Today & This Week Section */}
                <motion.div
                  className="dashboard-section"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}>
                  <h3>Today</h3>
                  <div className="dashboard-grid-2">
                    <div className="dashboard-stat-card">
                      <p className="dashboard-stat-label">Life Moments</p>
                      <p className="dashboard-stat-value">{stats.events}</p>
                      <p className="dashboard-stat-hint">Total recorded</p>
                    </div>
                    <div className="dashboard-stat-card">
                      <p className="dashboard-stat-label">Reflections</p>
                      <p className="dashboard-stat-value">
                        {stats.reflections}
                      </p>
                      <p className="dashboard-stat-hint">Weeks explored</p>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  className="dashboard-section"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}>
                  <h3>Quick Actions</h3>
                  <div className="dashboard-actions">
                    <button
                      className="dashboard-action-btn"
                      onClick={() => router.push("/#tracker")}>
                      + Add Life Moment
                    </button>
                    <button
                      className="dashboard-action-btn"
                      onClick={() => router.push("/#tracker")}>
                      ✓ Reflect This Week
                    </button>
                    <button
                      className="dashboard-action-btn"
                      onClick={() => router.push("/#calculator")}>
                      ⏱ Check Timeline
                    </button>
                  </div>
                </motion.div>

                {/* Your Intentions */}
                <motion.div
                  className="dashboard-section"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 }}>
                  <h3>Your Intentions</h3>
                  <div className="user-home-summary-grid">
                    {QUESTIONS.filter((q) => answers[q.id]?.trim()).map((q) => (
                      <div key={q.id} className="user-summary-card">
                        <p className="user-summary-label">{q.label}</p>
                        <p className="user-summary-value">{answers[q.id]}</p>
                      </div>
                    ))}
                    {completionCount === 0 && (
                      <div className="dashboard-empty-state">
                        <p>Complete onboarding to see your intentions here</p>
                        <button
                          className="dashboard-link-btn"
                          onClick={() => setIsEditingOnboarding(true)}>
                          Start Onboarding →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="dashboard-divider" />

              {/* Integrated Components */}
              <LifeTracker />
              <Calculator />
              <WikipediaLifeLens />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
