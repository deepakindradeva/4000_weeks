"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const tools = [
  {
    title: "Fixed-Volume Productivity",
    desc: "Establish predetermined time boundaries for your daily work. Don't let work expand to fill all available time.",
  },
  {
    title: "Serialize, Don't Parallelize",
    desc: "Focus on one big project at a time. Resist the temptation to juggle multiple priorities simultaneously.",
  },
  {
    title: "Decide What to Fail At",
    desc: "Strategically choose which areas of life to underperform in, so you can excel where it matters most.",
  },
  {
    title: "Keep a 'Done' List",
    desc: "Focus on what you've already completed, not just on what's left. Celebrate progress instead of fixating on the gap.",
  },
  {
    title: "Consolidate Your Caring",
    desc: "You can't care equally about everything. Consciously choose which causes, relationships, and projects to devote your energy to.",
  },
  {
    title: "Embrace Boring Technology",
    desc: "Seek out single-purpose tools. The most productive technology is the kind that doesn't tempt you with distractions.",
  },
  {
    title: "Find Novelty in the Mundane",
    desc: "Pay more attention to every moment. The extraordinary hides in the ordinary—you just have to look for it.",
  },
  {
    title: "Be a Researcher in Relationships",
    desc: "Deliberately adopt an attitude of curiosity. Approach the people in your life as though you're discovering them for the first time.",
  },
  {
    title: "Cultivate Instant Generosity",
    desc: "Whenever a generous impulse arises, act on it immediately. Don't defer kindness to a more convenient time.",
  },
  {
    title: "Practice Doing Nothing",
    desc: "Resist the urge to fill every moment with productivity. Sometimes the most radical act is to simply be.",
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
          By accepting the truth about limited time, you can be more
          intentional about accomplishing the things that matter.
        </motion.p>

        <div className="tools-list">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              className="tool-item"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.4 + i * 0.08,
              }}
            >
              <div className="tool-number">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="tool-content">
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
