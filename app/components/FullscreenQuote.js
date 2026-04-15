"use client";

import { motion } from "framer-motion";

export default function FullscreenQuote() {
  return (
    <section className="fullscreen-quote">
      <div className="fullscreen-quote-bg" />
      <motion.div
        className="quote-block"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
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
