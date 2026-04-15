"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navigation() {
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className="nav"
        initial={{ y: -52 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      >
        <div className="nav-content">
          <div className="nav-brand">
            4,000 Weeks <span>— Oliver Burkeman</span>
          </div>
          <ul className="nav-links">
            <li><a href="#premise">The Premise</a></li>
            <li><a href="#ideas">Key Ideas</a></li>
            <li><a href="#tools">10 Tools</a></li>
            <li><a href="#calculator">Your Weeks</a></li>
          </ul>
        </div>
      </motion.nav>

      {/* Progress bar */}
      <motion.div
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
      />
    </>
  );
}
