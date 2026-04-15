"use client";

import { useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

export default function Calculator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [birthYear, setBirthYear] = useState("");

  const result = useMemo(() => {
    const year = parseInt(birthYear);
    if (!year || year < 1900 || year > 2025) return null;

    const now = new Date();
    const birth = new Date(year, 0, 1);
    const ageMs = now - birth;
    const ageWeeks = Math.floor(ageMs / (7 * 24 * 60 * 60 * 1000));
    const remaining = Math.max(0, 4000 - ageWeeks);
    const percentLived = ((ageWeeks / 4000) * 100).toFixed(1);

    return { ageWeeks, remaining, percentLived };
  }, [birthYear]);

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

        <motion.div
          className="calculator-card"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="calc-input-group">
            <label className="calc-label" htmlFor="birth-year">
              Year you were born
            </label>
            <input
              id="birth-year"
              className="calc-input"
              type="number"
              placeholder="e.g. 1990"
              min="1900"
              max="2025"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                className="calc-result"
                key={result.remaining}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="calc-result-number">
                  {result.remaining.toLocaleString()}
                </div>
                <div className="calc-result-label">weeks remaining</div>
                <div className="calc-result-sub">
                  You&apos;ve used {result.ageWeeks.toLocaleString()} weeks —{" "}
                  {result.percentLived}% of your 4,000
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
