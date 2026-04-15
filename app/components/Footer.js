"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer className="footer" ref={ref}>
      <div className="footer-inner">
        <motion.p
          className="footer-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          This moment is your life. Make it count.
        </motion.p>
        <motion.p
          className="footer-credit"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Based on{" "}
          <a
            href="https://www.oliverburkeman.com/books"
            target="_blank"
            rel="noopener noreferrer"
          >
            Four Thousand Weeks
          </a>{" "}
          by Oliver Burkeman
        </motion.p>
        <motion.p
          className="footer-meta"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          An interactive exploration · Not affiliated with the author
        </motion.p>
      </div>
    </footer>
  );
}
