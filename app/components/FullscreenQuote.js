"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function FullscreenQuote() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.15, 0.4, 0.6, 0.85], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0.15, 0.4, 0.6, 0.85], [0.92, 1, 1, 0.95]);

  return (
    <section className="fullscreen-quote" ref={ref}>
      <div className="fullscreen-quote-bg" />
      <motion.div className="quote-block" style={{ opacity, scale }}>
        <span className="quote-mark">&ldquo;</span>
        <p className="quote-text">
          The real measure of any time management technique is whether it helps
          you neglect the right things.
        </p>
        <p className="quote-author">Oliver Burkeman</p>
      </motion.div>
    </section>
  );
}
