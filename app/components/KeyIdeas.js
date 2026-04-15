"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ideas = [
  {
    icon: "⏳",
    gradient: "linear-gradient(135deg, rgba(41,151,255,0.15), rgba(41,151,255,0.05))",
    title: "The Efficiency Trap",
    desc: "Becoming more efficient won't give you the feeling of having \"enough time.\" The demands will simply increase to offset any benefits. The faster you go, the more there is to do.",
  },
  {
    icon: "🚪",
    gradient: "linear-gradient(135deg, rgba(191,90,242,0.15), rgba(191,90,242,0.05))",
    title: "The Joy of Missing Out",
    desc: "Every decision closes off countless other choices. That's not a tragedy—it's what makes your choices meaningful. If you didn't have to miss out, nothing would matter.",
  },
  {
    icon: "🌊",
    gradient: "linear-gradient(135deg, rgba(48,213,200,0.15), rgba(48,213,200,0.05))",
    title: "Embrace Limitation",
    desc: "Distraction is not about willpower—it's about fleeing the discomfort of confronting finitude. Instead of fighting it, acknowledge and accept these feelings.",
  },
  {
    icon: "⚡",
    gradient: "linear-gradient(135deg, rgba(232,197,71,0.15), rgba(232,197,71,0.05))",
    title: "Cosmic Insignificance Therapy",
    desc: "What you do with your life doesn't matter all that much—and that's liberating. You get to focus on things that matter to you, right now, in this moment.",
  },
  {
    icon: "🎯",
    gradient: "linear-gradient(135deg, rgba(255,55,95,0.15), rgba(255,55,95,0.05))",
    title: "Choose to Settle",
    desc: "To live life to the fullest, you must choose. The problem isn't committing to the wrong choice—it's refusing to commit at all, keeping every option alive indefinitely.",
  },
  {
    icon: "🕊️",
    gradient: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.05))",
    title: "Atelic Activities",
    desc: "Not every activity needs a goal. Some things are worth doing for their own sake—not as a means to an end, but as ends in themselves. Rediscover purposeless joy.",
  },
];

export default function KeyIdeas() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="section pillars" id="ideas" ref={ref}>
      <div className="section-inner">
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Key Ideas
        </motion.div>
        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          Six ideas that will change how you think about time.
        </motion.h2>

        <motion.div
          className="pillars-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {ideas.map((idea, i) => (
            <motion.div key={i} className="pillar-card" variants={cardVariants}>
              <div
                className="pillar-icon"
                style={{ background: idea.gradient }}
              >
                {idea.icon}
              </div>
              <h3 className="pillar-card-title">{idea.title}</h3>
              <p className="pillar-card-desc">{idea.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
