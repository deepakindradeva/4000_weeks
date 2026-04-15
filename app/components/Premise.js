"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useUser } from "../context/UserContext";

const DECADE_COLORS = [
  "#64d2ff", // 0-9
  "#2997ff", // 10-19
  "#5e5ce6", // 20-29
  "#bf5af2", // 30-39
  "#ff375f", // 40-49
  "#ff6b35", // 50-59
  "#e8c547", // 60-69
  "#30d5c8", // 70-79
  "#a1a1a6", // 80-89
  "#6e6e73", // 90+
];

function getDecadeColor(weekIndex) {
  const year = Math.floor(weekIndex / 52.1429);
  const decade = Math.min(Math.floor(year / 10), DECADE_COLORS.length - 1);
  return DECADE_COLORS[decade];
}

function WeekGrid() {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });
  const { lifeData, hasProfile } = useUser();

  const totalWeeks = hasProfile && lifeData ? lifeData.totalWeeks : 4160; // 80yrs default
  const livedWeeks = hasProfile && lifeData ? lifeData.ageWeeks : 1560;
  const displayWeeks = Math.min(totalWeeks, 5000); // cap for performance

  const dots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < displayWeeks; i++) {
      const isLived = i < livedWeeks;
      const isCurrent = i === livedWeeks;
      let className = "week-dot";
      if (isLived) className += " lived";
      if (isCurrent) className += " current";

      const style = {
        transitionDelay: isInView ? `${Math.min(i * 0.2, 800)}ms` : "0ms",
        opacity: isInView ? undefined : 0,
      };

      if (isLived) {
        style.background = getDecadeColor(i);
        style.opacity = isInView ? 0.6 : 0;
      }

      arr.push(<div key={i} className={className} style={style} />);
    }
    return arr;
  }, [isInView, displayWeeks, livedWeeks]);

  return (
    <div className="week-grid-container" ref={gridRef}>
      <div className="week-grid-label">
        {hasProfile
          ? `Your life in weeks — ${totalWeeks.toLocaleString()} total`
          : "Each dot is one week of an 80-year life"}
      </div>
      <div className="week-grid">{dots}</div>

      {/* Decade legend */}
      {hasProfile && (
        <div className="week-grid-legend">
          {DECADE_COLORS.slice(0, Math.ceil((lifeData?.lifeExpYears || 80) / 10)).map(
            (color, i) => (
              <div key={i} className="week-legend-item">
                <span
                  className="week-legend-dot"
                  style={{ background: color }}
                />
                <span className="week-legend-label">{i * 10}s</span>
              </div>
            )
          )}
        </div>
      )}

      <div className="week-grid-stats">
        <div className="week-stat">
          <div
            className="week-stat-value"
            style={{ color: "var(--color-accent)" }}
          >
            {livedWeeks.toLocaleString()}
          </div>
          <div className="week-stat-label">Weeks lived</div>
        </div>
        <div className="week-stat">
          <div
            className="week-stat-value"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {(totalWeeks - livedWeeks).toLocaleString()}
          </div>
          <div className="week-stat-label">Weeks remaining</div>
        </div>
        {hasProfile && lifeData && (
          <div className="week-stat">
            <div
              className="week-stat-value"
              style={{ color: "var(--color-accent-warm)" }}
            >
              {lifeData.percentLived}%
            </div>
            <div className="week-stat-label">Complete</div>
          </div>
        )}
      </div>

      {!hasProfile && (
        <div className="week-grid-cta">
          <a href="#calculator" className="week-grid-cta-link">
            Enter your birth year to personalize this grid ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function Premise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section premise" id="premise">
      <div className="section-inner" ref={ref}>
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          The Premise
        </motion.div>
        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.15,
          }}
        >
          Your life is not a resource to be optimized. It&apos;s the only time
          you&apos;ll ever get.
        </motion.h2>
        <motion.p
          className="section-body"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.3,
          }}
        >
          Before clocks existed, life revolved around tasks—the rhythms of
          existence emerged organically. But once we could measure time, we
          started treating it as something to spend, save, and waste. The
          trouble with mastering your time is that time ends up mastering you.
        </motion.p>

        <WeekGrid />
      </div>
    </section>
  );
}
