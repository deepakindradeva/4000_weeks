"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";

function WeekGrid() {
  const gridRef = useRef(null);
  const isInView = useInView(gridRef, { once: true, margin: "-100px" });

  // 4000 weeks, assume ~30 years lived (1560 weeks)
  const totalWeeks = 4000;
  const livedWeeks = 1560;

  const dots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < totalWeeks; i++) {
      let className = "week-dot";
      if (i < livedWeeks) className += " lived";
      if (i === livedWeeks) className += " current";
      arr.push(
        <div
          key={i}
          className={className}
          style={{
            transitionDelay: isInView ? `${Math.min(i * 0.3, 1200)}ms` : "0ms",
            opacity: isInView ? undefined : 0,
          }}
        />
      );
    }
    return arr;
  }, [isInView]);

  return (
    <div className="week-grid-container" ref={gridRef}>
      <div className="week-grid-label">
        Each dot is one week of an 80-year life
      </div>
      <div className="week-grid">{dots}</div>
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
      </div>
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
