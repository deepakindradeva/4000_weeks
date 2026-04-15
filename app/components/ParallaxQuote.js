"use client";

import { motion } from "framer-motion";

export default function ParallaxQuote({ quote, highlight, attribution }) {
  const parts = quote.split(highlight);

  return (
    <div className="parallax-section">
      <motion.div
        className="parallax-content"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
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
  );
}
