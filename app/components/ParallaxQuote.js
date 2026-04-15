"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxQuote({ quote, highlight, attribution }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [0.9, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [80, 0, 0, -80]);

  // Split text around highlight
  const parts = quote.split(highlight);

  return (
    <div className="parallax-section" ref={ref}>
      <div className="parallax-sticky">
        <motion.div className="parallax-content" style={{ opacity, scale, y }}>
          <p className="big-quote">
            {parts[0]}
            <span className="highlight">{highlight}</span>
            {parts[1]}
          </p>
          {attribution && (
            <p className="quote-attribution">— {attribution}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
