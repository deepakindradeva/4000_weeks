"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchWikiLifeData } from "../lib/wikipediaLife";

const FAMOUS_FIGURES_URLS = [
  "https://en.wikipedia.org/wiki/Albert_Einstein",
  "https://en.wikipedia.org/wiki/Marie_Curie",
  "https://en.wikipedia.org/wiki/Steve_Jobs",
  "https://en.wikipedia.org/wiki/Oprah_Winfrey",
  "https://en.wikipedia.org/wiki/Martin_Luther_King_Jr.",
];

export default function FamousFiguresPreview() {
  const [figures, setFigures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFigures = async () => {
      try {
        setLoading(true);
        const results = [];
        
        for (const url of FAMOUS_FIGURES_URLS) {
          try {
            const data = await fetchWikiLifeData(url);
            if (data && data.progress) {
              results.push({
                ...data,
                url,
              });
            }
          } catch (err) {
            console.error(`Failed to fetch ${url}:`, err);
            // Continue with other figures
          }
        }
        
        setFigures(results);
        setError(results.length === 0 ? "Could not load figures" : null);
      } catch (err) {
        console.error("Failed to fetch figures:", err);
        setError("Could not load figures");
      } finally {
        setLoading(false);
      }
    };

    fetchFigures();
  }, []);

  if (loading) {
    return (
      <section className="section famous-figures-section">
        <div className="section-inner">
          <div className="figures-loading">
            <div className="figures-loader-spin"></div>
            <p>Loading inspiring lives...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || figures.length === 0) {
    return null;
  }

  return (
    <section className="section famous-figures-section">
      <div className="section-inner">
        <motion.div
          className="famous-figures-intro"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}>
          <p className="famous-figures-subtitle">Their lives in weeks</p>
          <h2 className="famous-figures-title">
            See how some of history&apos;s most remarkable lives unfolded
          </h2>
        </motion.div>

        <motion.div
          className="famous-figures-grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}>
          {figures.map((figure, idx) => (
            <motion.a
              key={figure.title}
              href={figure.articleUrl}
              target="_blank"
              rel="noreferrer"
              className="famous-figure-mini-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}>
              <div className="figure-mini-image-wrap">
                {figure.thumbnail && (
                  <img
                    src={figure.thumbnail}
                    alt={figure.title}
                    className="figure-mini-image"
                  />
                )}
                <div className="figure-mini-overlay">
                  <div className="figure-mini-stats">
                    <div className="stat-item">
                      <div className="stat-value">{figure.progress?.ageYears || "—"}</div>
                      <div className="stat-label">years</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">
                        {figure.progress?.weeksLived?.toLocaleString() || "—"}
                      </div>
                      <div className="stat-label">weeks</div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="figure-mini-name">{figure.title}</h3>
              <p className="figure-mini-desc">{figure.description}</p>

              {figure.progress && (
                <div className="figure-mini-progress">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, figure.progress.progressPercent)}%`,
                      }}
                    />
                  </div>
                  <span className="progress-label">
                    {figure.progress.progressPercent.toFixed(0)}% of 4,000 weeks
                  </span>
                </div>
              )}
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="famous-figures-cta"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.25 }}>
          <p>
            Explore complete timelines, life stages, and milestones for these remarkable figures — and compare your own path.
          </p>
          <a href="#life-tracker" className="figures-link-btn">
            Explore all figures →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
