"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const targetCount = 4000;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetCount / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.section className="hero" ref={ref} style={{ opacity, scale }}>
      <div className="hero-bg-gradient" />

      <motion.div
        className="hero-counter-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="hero-counter">{count.toLocaleString()}</div>
        <div className="hero-counter-label">Weeks</div>
      </motion.div>

      <motion.h1
        className="hero-title"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
      >
        Time Management for <em>Mortals</em>
      </motion.h1>

      <motion.p
        className="hero-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
      >
        The average human lifespan is absurdly, terrifyingly, insultingly
        short. Assuming you live to be eighty, you&apos;ll have had about four
        thousand weeks.
      </motion.p>

      <motion.div
        className="hero-cta-row"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <a href="#calculator" className="hero-cta-primary">
          Count my weeks →
        </a>
        <a href="#life-tracker" className="hero-cta-secondary">
          See the demo
        </a>
      </motion.div>

      <motion.div
        className="hero-social-proof"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <span className="hero-proof-dots">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="hero-proof-dot" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
        <span className="hero-proof-text">Join <strong>12,000+</strong> people who&apos;ve counted their weeks</span>
      </motion.div>

      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>Scroll</span>
        <div className="scroll-line" />
      </motion.div>
    </motion.section>
  );
}
