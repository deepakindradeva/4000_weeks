"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchWikiLifeData } from "../lib/wikipediaLife";
import Perspectives from "./Perspectives";

const FAMOUS_FIGURES_URLS = [
  "https://en.wikipedia.org/wiki/Elon_Musk",
  "https://en.wikipedia.org/wiki/Oprah_Winfrey",
  "https://en.wikipedia.org/wiki/Taylor_Swift",
  "https://en.wikipedia.org/wiki/LeBron_James",
  "https://en.wikipedia.org/wiki/Bill_Gates",
];

export default function PerspectivesSection() {
  const [figures, setFigures] = useState([]);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFigures = async () => {
      try {
        setLoading(true);
        const settled = await Promise.allSettled(
          FAMOUS_FIGURES_URLS.map((url) => fetchWikiLifeData(url))
        );
        const results = settled
          .filter((r) => r.status === "fulfilled" && r.value?.progress)
          .map((r) => r.value);
        setFigures(results);
      } catch (err) {
        console.error("Failed to fetch figures:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFigures();
  }, []);

  return (
    <>
      <div id="figures" style={{ height: 0 }} />

      {/* Loading skeleton */}
      {loading && (
        <section className="section figures-selector-section">
          <div className="section-inner">
            <p className="figures-selector-intro">Loading famous figures…</p>
            <div className="figures-selector-grid">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="figure-selector-card" style={{ opacity: 0.4, pointerEvents: "none" }}>
                  <div className="figure-selector-image-wrap" style={{ background: "var(--color-border)" }} />
                  <div style={{ height: 14, width: "60%", background: "var(--color-border)", borderRadius: 6 }} />
                  <div style={{ height: 12, width: "80%", background: "var(--color-border)", borderRadius: 6 }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Famous Figures Selector */}
      {!loading && figures.length > 0 && (
        <section className="section figures-selector-section">
          <div className="section-inner">
            <motion.p
              className="figures-selector-intro"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}>
              Click on a figure to see their life in numbers:
            </motion.p>

            <motion.div
              className="figures-selector-grid"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1 }}>
              {figures.map((figure, idx) => (
                <motion.button
                  key={figure.title}
                  className={`figure-selector-card ${
                    selectedFigure?.title === figure.title ? "active" : ""
                  }`}
                  onClick={() => setSelectedFigure(figure)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -2 }}>
                  <div className="figure-selector-image-wrap">
                    {figure.thumbnail && (
                      <img
                        src={figure.thumbnail}
                        alt={figure.title}
                        className="figure-selector-image"
                      />
                    )}
                  </div>
                  <h3 className="figure-selector-name">{figure.title}</h3>
                  <p className="figure-selector-description">
                    {figure.description}
                  </p>

                  {figure.progress && (
                    <div className="figure-selector-weeks">
                      <div className="figure-weeks-bar">
                        <div
                          className="figure-weeks-fill"
                          style={{
                            width: `${Math.min(figure.progress.progressPercent, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="figure-weeks-text">
                        {figure.progress.weeksLived?.toLocaleString()} weeks
                      </p>
                    </div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Perspectives with selected figure */}
      <Perspectives selectedFigure={selectedFigure} />
    </>
  );
}
