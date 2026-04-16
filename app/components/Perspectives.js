"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

const PERSPECTIVES = [
  {
    key: "summersLeft",
    icon: "☀️",
    label: "Summers Left",
    suffix: "",
    color: "#e8c547",
    detail: "Each one is a chance to swim, travel, or sit in the sun with someone you love.",
  },
  {
    key: "sunrisesLeft",
    icon: "🌅",
    label: "Sunrises Left",
    suffix: "",
    color: "#ff6b35",
    detail: "How many will you actually watch?",
  },
  {
    key: "booksLeft",
    icon: "📖",
    label: "Books You Could Read",
    suffix: "",
    color: "#2997ff",
    detail: "At one book every two weeks — the average reader's pace.",
  },
  {
    key: "conversationsWithParents",
    icon: "👨‍👩‍👧",
    label: "Conversations with Parents",
    suffix: "",
    color: "#bf5af2",
    detail: "If you see them ~10 times a year. Inspired by Wait But Why.",
  },
  {
    key: "fullMoonsLeft",
    icon: "🌕",
    label: "Full Moons Left",
    suffix: "",
    color: "#64d2ff",
    detail: "Each one marks ~4 weeks of your finite existence.",
  },
  {
    key: "mealsLeft",
    icon: "🍽️",
    label: "Meals Left",
    suffix: "",
    color: "#30d5c8",
    detail: "Three meals a day × seven days × remaining weeks.",
  },
  {
    key: "weekendsLeft",
    icon: "🛋️",
    label: "Weekends Left",
    suffix: "",
    color: "#ff375f",
    detail: "Each one is roughly 0.025% of the weekends in an 80-year life.",
  },
  {
    key: "birthdaysLeft",
    icon: "🎂",
    label: "Birthdays Left",
    suffix: "",
    color: "#e8c547",
    detail: "Each one is not just a celebration — it's a milestone of finite time.",
  },
];

// Ideal dummy data shown to logged-out users (based on a 30-year-old, 80-year life expectancy)
const DUMMY_PERSPECTIVE_DATA = {
  summersLeft: 50,
  sunrisesLeft: 2600,
  booksLeft: 1300,
  conversationsWithParents: 500,
  fullMoonsLeft: 650,
  mealsLeft: 54600,
  weekendsLeft: 2600,
  birthdaysLeft: 50,
};

function calculatePerspectivesFromFigure(figure) {
  if (!figure?.progress) return null;

  const progress = figure.progress;
  const weeksLived = progress.weeksLived || 0;
  
  // For deceased: all metrics are 0
  if (progress.isComplete) {
    return {
      summersLeft: 0,
      sunrisesLeft: 0,
      booksLeft: 0,
      conversationsWithParents: 0,
      fullMoonsLeft: 0,
      mealsLeft: 0,
      weekendsLeft: 0,
      birthdaysLeft: 0,
    };
  }

  // For living: calculate remaining based on assumed 85-year lifespan
  const assumedLifespan = 85;
  const yearsRemaining = Math.max(0, assumedLifespan - (progress.ageYears || 0));
  const weeksRemaining = Math.max(0, yearsRemaining * 52);

  return {
    summersLeft: Math.max(0, yearsRemaining),
    sunrisesLeft: Math.max(0, Math.round(weeksRemaining * 7)),
    booksLeft: Math.max(0, Math.round(weeksRemaining / 2)),
    conversationsWithParents: Math.max(0, Math.round(yearsRemaining * 10)),
    fullMoonsLeft: Math.max(0, Math.round(weeksRemaining / 4)),
    mealsLeft: Math.max(0, Math.round(weeksRemaining * 21)),
    weekendsLeft: Math.max(0, Math.round(weeksRemaining)),
    birthdaysLeft: Math.max(0, Math.round(yearsRemaining)),
  };
}

function PerspectiveCard({ perspective, value, index, isInView }) {
  return (
    <motion.div
      className="persp-card"
      style={{ "--persp-color": perspective.color }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1 + index * 0.08,
      }}
    >
      <div className="persp-card-inner">
        <div className="persp-icon">{perspective.icon}</div>
        <div
          className="persp-value"
          style={{ color: perspective.color }}
        >
          {value != null ? value.toLocaleString() : "—"}
        </div>
        <div className="persp-label">{perspective.label}</div>
        <p className="persp-detail">{perspective.detail}</p>
      </div>
    </motion.div>
  );
}

export default function Perspectives({ selectedFigure }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { lifeData, hasProfile } = useUser();
  const { isLoggedIn } = useAuth();

  // Calculate data based on selectedFigure or use user's data
  const displayData = useMemo(() => {
    if (selectedFigure) {
      return calculatePerspectivesFromFigure(selectedFigure);
    }
    if (isLoggedIn && hasProfile && lifeData) {
      return lifeData;
    }
    return DUMMY_PERSPECTIVE_DATA;
  }, [selectedFigure, isLoggedIn, hasProfile, lifeData]);

  const isUsingDummy = !selectedFigure && (!isLoggedIn || !hasProfile || !lifeData);
  const isShowingFigure = !!selectedFigure;

  return (
    <section className="section persp-section" id="perspectives" ref={ref}>
      <div className="section-inner">
        <motion.div
          className="section-label"
          style={{ color: "var(--color-accent-warm)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Time Reframed
        </motion.div>

        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          {isShowingFigure ? `${selectedFigure.title}'s Time` : "Numbers don't move us. Meaning does."}
        </motion.h2>

        <motion.p
          className="section-body"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          {isShowingFigure
            ? `Here's how ${selectedFigure.title}'s life breaks down into moments that matter. ${selectedFigure.progress?.isComplete ? "A completed life." : "Their remaining time, if they live to 85."}`
            : isUsingDummy
            ? "Based on the average 30-year-old. Sign in and enter your birth year to see your own numbers."
            : "Here's your remaining time, translated into moments that matter."}
        </motion.p>

        <div className="persp-grid">
          {PERSPECTIVES.map((p, i) => (
            <PerspectiveCard
              key={p.key}
              perspective={p}
              value={displayData ? displayData[p.key] : null}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>

        {isUsingDummy && (
          <motion.div
            className="persp-cta"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a href="#calculator" className="persp-cta-btn">
              Personalize your numbers ↗
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

