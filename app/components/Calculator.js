"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { getCountryList } from "../lib/lifeExpectancy";
import ShareCard from "./ShareCard";

const countries = getCountryList();

export default function Calculator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { profile, lifeData, updateProfile, mounted, isDemo } = useUser();

  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("1");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("average");
  const [showDetails, setShowDetails] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  // Sync from saved profile (including demo profile)
  useEffect(() => {
    if (mounted && profile) {
      if (profile.birthYear) setBirthYear(String(profile.birthYear));
      if (profile.birthMonth) setBirthMonth(String(profile.birthMonth));
      if (profile.countryCode) setCountry(profile.countryCode);
      if (profile.gender) setGender(profile.gender);
      // Auto-show demo results so first-time visitors see the full calculator
      if (profile.isDemo) setShowDetails(true);
    }
  }, [mounted, profile]);

  const handleCalculate = () => {
    const year = parseInt(birthYear);
    if (!year || year < 1900 || year > new Date().getFullYear()) return;
    updateProfile({
      birthYear: year,
      birthMonth: parseInt(birthMonth) || 1,
      countryCode: country || null,
      gender,
    });
    setShowDetails(true);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <section className="calculator-section" id="calculator" ref={ref}>
      <div className="section-inner">
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Your Timeline
        </motion.div>
        <motion.h2
          className="section-heading"
          style={{ textAlign: "center" }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          How many weeks do you have left?
        </motion.h2>
        <motion.p
          className="section-body"
          style={{ textAlign: "center", margin: "0 auto 16px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          Personalize your experience. Your data stays on your device.
        </motion.p>

        <motion.div
          className="calculator-card"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          {/* Birth year + month row */}
          <div className="calc-row">
            <div className="calc-input-group" style={{ flex: 2 }}>
              <label className="calc-label" htmlFor="birth-year">
                Birth Year
              </label>
              <input
                id="birth-year"
                className="calc-input"
                type="number"
                placeholder="e.g. 1990"
                min="1900"
                max={new Date().getFullYear()}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
              />
            </div>
            <div className="calc-input-group" style={{ flex: 2 }}>
              <label className="calc-label" htmlFor="birth-month">
                Month
              </label>
              <select
                id="birth-month"
                className="calc-input calc-select"
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Country + Gender row */}
          <div className="calc-row">
            <div className="calc-input-group" style={{ flex: 3 }}>
              <label className="calc-label" htmlFor="country">
                Country
                <span className="calc-label-hint"> (adjusts life expectancy)</span>
              </label>
              <select
                id="country"
                className="calc-input calc-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Global average (80 years)</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="calc-input-group" style={{ flex: 2 }}>
              <label className="calc-label">Gender (optional)</label>
              <div className="calc-gender-row">
                {[
                  { key: "average", label: "Any" },
                  { key: "male", label: "Male" },
                  { key: "female", label: "Female" },
                ].map((g) => (
                  <button
                    key={g.key}
                    type="button"
                    className={`calc-gender-btn ${gender === g.key ? "active" : ""}`}
                    onClick={() => setGender(g.key)}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className="calc-submit-btn"
            onClick={handleCalculate}
            disabled={!birthYear}
          >
            Calculate My Weeks
          </button>

          {/* Results */}
          <AnimatePresence mode="wait">
            {showDetails && lifeData && (
              <motion.div
                className="calc-results"
                key={`${lifeData.remaining}-${lifeData.totalWeeks}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="calc-result-hero">
                  <div className="calc-result-number">
                    {lifeData.remaining.toLocaleString()}
                  </div>
                  <div className="calc-result-label">weeks remaining</div>
                </div>

                {/* Progress bar */}
                <div className="calc-progress-container">
                  <div className="calc-progress-bar">
                    <motion.div
                      className="calc-progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${lifeData.percentLived}%` }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    />
                  </div>
                  <div className="calc-progress-labels">
                    <span>{lifeData.ageWeeks.toLocaleString()} lived</span>
                    <span>{lifeData.percentLived}%</span>
                    <span>{lifeData.remaining.toLocaleString()} left</span>
                  </div>
                </div>

                {/* Stat grid */}
                <div className="calc-stat-grid">
                  <div className="calc-mini-stat">
                    <span className="calc-mini-value">{lifeData.totalWeeks.toLocaleString()}</span>
                    <span className="calc-mini-label">Total Weeks</span>
                  </div>
                  <div className="calc-mini-stat">
                    <span className="calc-mini-value">{lifeData.lifeExpYears}</span>
                    <span className="calc-mini-label">Life Expectancy{lifeData.countryName ? ` (${lifeData.countryName})` : ""}</span>
                  </div>
                  <div className="calc-mini-stat">
                    <span className="calc-mini-value">{lifeData.ageYears}</span>
                    <span className="calc-mini-label">Current Age</span>
                  </div>
                  <div className="calc-mini-stat">
                    <span className="calc-mini-value">{lifeData.remainingYears}</span>
                    <span className="calc-mini-label">Years Left</span>
                  </div>
                </div>

                <p className="calc-note">
                  Based on {lifeData.countryName
                    ? `WHO data for ${lifeData.countryName}`
                    : "global average"}{gender !== "average" ? ` (${gender})` : ""}. Life expectancy: {lifeData.lifeExpYears} years.
                </p>

                {isDemo && (
                  <p className="calc-demo-hint">
                    ✦ Demo preview (Alex, born Mar 1992, US) — enter your own details above to personalize.
                  </p>
                )}

                <button
                  className="calc-share-btn"
                  onClick={() => setShowShareCard(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                  Share my timeline
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <ShareCard open={showShareCard} onClose={() => setShowShareCard(false)} />
    </section>
  );
}
