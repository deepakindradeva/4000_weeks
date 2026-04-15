"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const tools = [
  {
    title: "Fixed-Volume Productivity",
    desc: "Set hard time limits for work. Don't let it expand to fill every hour.",
    icon: "⏱",
    color: "#2997ff",
  },
  {
    title: "Serialize, Don't Parallelize",
    desc: "One big project at a time. Juggling splits focus — and life.",
    icon: "🎯",
    color: "#bf5af2",
  },
  {
    title: "Embrace Boring Technology",
    desc: "Single-purpose tools win. The best tech doesn't tempt you away.",
    icon: "🔧",
    color: "#30d5c8",
  },
  {
    title: "Decide What to Fail At",
    desc: "Strategically underperform in less-important areas so you can excel where it counts.",
    icon: "✂️",
    color: "#ff375f",
    wide: true,
  },
  {
    title: "Keep a 'Done' List",
    desc: "Track completions, not just tasks left. Progress compounds.",
    icon: "✅",
    color: "#e8c547",
  },
  {
    title: "Consolidate Your Caring",
    desc: "You can't care equally about everything. Choose deliberately.",
    icon: "💎",
    color: "#ff6b35",
  },
  {
    title: "Find Novelty in the Mundane",
    desc: "Pay close attention. The extraordinary hides inside the ordinary.",
    icon: "👁",
    color: "#64d2ff",
  },
  {
    title: "Be a Researcher in Relationships",
    desc: "Approach people with genuine curiosity — as if meeting them fresh.",
    icon: "🧪",
    color: "#5e5ce6",
  },
  {
    title: "Cultivate Instant Generosity",
    desc: "When a generous impulse arrives, act on it now. Not later.",
    icon: "🎁",
    color: "#30d5c8",
  },
  {
    title: "Practice Doing Nothing",
    desc: "Sometimes the most radical act is to simply stop and be present with your finite life.",
    icon: "🌿",
    color: "#a8e6cf",
    wide: true,
  },
];

export default function Tools() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="section tools-section" id="tools" ref={ref}>
      <div className="section-inner">
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          The Appendix
        </motion.div>
        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          Ten tools for embracing your finitude.
        </motion.h2>
        <motion.p
          className="section-body"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          Accept limited time → be intentional about what actually matters.
        </motion.p>

        <div className="tools-grid">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              className={`tool-card${tool.wide ? " tool-card--wide" : ""}`}
              style={{ "--tool-color": tool.color }}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.35 + i * 0.06,
              }}
            >
              <div className="tool-card-top">
                <span className="tool-card-icon">{tool.icon}</span>
                <span className="tool-card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="tool-card-title">{tool.title}</h3>
              <p className="tool-card-desc">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
