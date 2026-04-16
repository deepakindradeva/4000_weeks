"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWikiLifeData } from "../lib/wikipediaLife";

const LIFE_WEEKS_CAP = 4000;
const WEEKS_PER_ROW = 52;

// Life stage definitions
const LIFE_STAGES = [
  { name: "Birth", color: "#bf5af2", ageRange: [0, 0] },
  { name: "Childhood", color: "#64d2ff", ageRange: [0, 12] },
  { name: "Adolescence", color: "#a2845e", ageRange: [13, 19] },
  { name: "Early Adulthood", color: "#2997ff", ageRange: [20, 30] },
  { name: "Adulthood", color: "#30d5c8", ageRange: [31, 55] },
  { name: "Late Career", color: "#e8c547", ageRange: [56, 65] },
  { name: "Later Life", color: "#ff6b35", ageRange: [65, 120] },
];

// Tracking categories
const CATEGORIES = [
  { key: "milestone", label: "Milestone", icon: "🏆", color: "#e8c547" },
  { key: "career", label: "Career", icon: "💼", color: "#2997ff" },
  { key: "personal", label: "Personal", icon: "💜", color: "#bf5af2" },
  { key: "health", label: "Health", icon: "🏃", color: "#30d5c8" },
  { key: "education", label: "Education", icon: "📚", color: "#ff6b35" },
  { key: "travel", label: "Travel", icon: "✈️", color: "#ff375f" },
  { key: "creative", label: "Creative", icon: "🎨", color: "#64d2ff" },
];

const MOODS = [
  { value: 1, emoji: "😫", label: "Tough" },
  { value: 2, emoji: "😕", label: "Meh" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
];

function getCategoryMeta(key) {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWikiStorageKey(profileTitle) {
  return `wiki_moments_${profileTitle.replace(/\s+/g, "_").toLowerCase()}`;
}

function getWikiMoments(profileTitle) {
  if (typeof window === "undefined") return [];
  const key = getWikiStorageKey(profileTitle);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveWikiMoment(profileTitle, moment) {
  if (typeof window === "undefined") return;
  const key = getWikiStorageKey(profileTitle);
  const moments = getWikiMoments(profileTitle);
  moments.push({ ...moment, id: Date.now() });
  localStorage.setItem(key, JSON.stringify(moments));
}

function deleteWikiMoment(profileTitle, id) {
  if (typeof window === "undefined") return;
  const key = getWikiStorageKey(profileTitle);
  const moments = getWikiMoments(profileTitle);
  const filtered = moments.filter((m) => m.id !== id);
  localStorage.setItem(key, JSON.stringify(filtered));
}

/* ═══════════════════════════════════════
   EVENT MODAL FOR WIKIPEDIA MOMENTS
   ═══════════════════════════════════════ */
function WikiMomentModal({ profileTitle, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("milestone");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      date,
      category,
    });
    setTitle("");
    setDescription("");
    setCategory("milestone");
  };

  return (
    <motion.div
      className="lt-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}>
      <motion.div
        className="lt-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}>
        <div className="lt-modal-header">
          <h3>Log a moment inspired by {profileTitle}</h3>
          <button
            className="lt-modal-close"
            onClick={onClose}
            aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lt-form-group">
            <label className="lt-form-label" htmlFor="wm-title">
              What struck you?
            </label>
            <input
              id="wm-title"
              className="lt-form-input"
              type="text"
              placeholder="A lesson, realization, or moment inspired by their path…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="lt-form-group">
            <label className="lt-form-label" htmlFor="wm-desc">
              How does it relate?
            </label>
            <textarea
              id="wm-desc"
              className="lt-form-input lt-form-textarea"
              placeholder="Why does this matter to you?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="lt-form-row">
            <div className="lt-form-group" style={{ flex: 1 }}>
              <label className="lt-form-label" htmlFor="wm-date">
                When
              </label>
              <input
                id="wm-date"
                className="lt-form-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="lt-form-group">
            <label className="lt-form-label">Category</label>
            <div className="lt-category-picker">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`lt-category-chip ${category === cat.key ? "active" : ""}`}
                  style={{ "--chip-color": cat.color }}
                  onClick={() => setCategory(cat.key)}>
                  <span className="lt-chip-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="lt-submit-btn">
            Save Moment
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   WIKI MOMENT CARD
   ═══════════════════════════════════════ */
function WikiMomentCard({ moment, onDelete, index, profileTitle }) {
  const cat = getCategoryMeta(moment.category);
  return (
    <motion.div
      className="lt-timeline-card"
      style={{ "--cat-color": cat.color }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.04,
      }}
      layout>
      <div className="lt-card-top">
        <span
          className="lt-card-cat-pill"
          style={{ color: cat.color, background: cat.color + "1a" }}>
          {cat.icon} {cat.label}
        </span>
        <span className="lt-card-ago">{formatDate(moment.date)}</span>
      </div>
      <h4 className="lt-card-title">{moment.title}</h4>
      {moment.description && (
        <p className="lt-card-desc">{moment.description}</p>
      )}
      <div className="lt-card-footer">
        <span className="lt-card-date">{formatDate(moment.date)}</span>
        <div className="lt-card-actions">
          <button
            className="lt-card-btn lt-card-btn-danger"
            onClick={() => onDelete(moment.id)}
            aria-label="Delete">
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildLifeWeekModel(profile) {
  if (!profile?.progress?.birthDate) return null;

  const birthYear = new Date(profile.progress.birthDate).getFullYear();
  const currentWeek = clamp(profile.progress.weeksLived, 0, LIFE_WEEKS_CAP);
  const highlightedWeeks = new Set();

  for (const item of profile.timeline || []) {
    const offsetYears = item.year - birthYear;
    if (offsetYears < 0) continue;
    const weekIndex = clamp(offsetYears * WEEKS_PER_ROW, 0, LIFE_WEEKS_CAP - 1);
    highlightedWeeks.add(weekIndex);
  }

  const cells = Array.from({ length: LIFE_WEEKS_CAP }, (_, idx) => ({
    week: idx + 1,
    row: Math.floor(idx / WEEKS_PER_ROW),
    isLived: idx < currentWeek,
    isHighlight: highlightedWeeks.has(idx),
    isCurrent: idx === currentWeek - 1,
  }));

  const rowCount = Math.ceil(LIFE_WEEKS_CAP / WEEKS_PER_ROW);
  const rowLabels = Array.from({ length: rowCount }, (_, row) => {
    const age = row;
    return age % 10 === 0 ? `Age ${age}` : "";
  });

  return { cells, rowLabels };
}

function buildTimelineRail(profile) {
  const events = (profile?.timeline || [])
    .slice()
    .sort((a, b) => a.year - b.year);
  if (events.length === 0) return [];

  const startYear = events[0].year;
  const endYear = events[events.length - 1].year;
  const span = Math.max(1, endYear - startYear);

  return events.map((event) => ({
    ...event,
    position: ((event.year - startYear) / span) * 100,
  }));
}

function getLifeStage(ageYears) {
  for (const stage of LIFE_STAGES) {
    if (ageYears >= stage.ageRange[0] && ageYears <= stage.ageRange[1]) {
      return stage;
    }
  }
  return LIFE_STAGES[LIFE_STAGES.length - 1];
}

function buildDetailedTimeline(profile) {
  if (!profile?.progress?.birthDate) return [];

  const birthDate = new Date(profile.progress.birthDate);
  const endDate = profile.progress.deathDate || new Date();
  const timeline = profile.timeline || [];

  const detailedEvents = [];

  // Add birth event
  detailedEvents.push({
    year: birthDate.getFullYear(),
    age: 0,
    text: "Born",
    isMarker: true,
    isBirth: true,
  });

  // Add milestones from timeline
  for (const event of timeline) {
    const age = event.year - birthDate.getFullYear();
    if (age >= 0 && age <= profile.progress.ageYears) {
      detailedEvents.push({
        year: event.year,
        age,
        text: event.text,
        isMarker: true,
      });
    }
  }

  // Add life stage transitions
  for (const stage of LIFE_STAGES.slice(1)) {
    const stageAge = stage.ageRange[0];
    if (
      stageAge > 0 &&
      stageAge <= profile.progress.ageYears &&
      !detailedEvents.find((e) => e.age === stageAge)
    ) {
      detailedEvents.push({
        age: stageAge,
        year: birthDate.getFullYear() + stageAge,
        text: `Entered ${stage.name.toLowerCase()}`,
        isLifeStage: true,
      });
    }
  }

  // Add current age marker
  if (!profile.progress.deathDate) {
    detailedEvents.push({
      year: endDate.getFullYear(),
      age: profile.progress.ageYears,
      text: `Age ${profile.progress.ageYears} (today)`,
      isNow: true,
    });
  } else {
    detailedEvents.push({
      year: profile.progress.deathDate.getFullYear(),
      age: profile.progress.ageYears,
      text: "End of life",
      isEnd: true,
    });
  }

  return detailedEvents.sort((a, b) => a.age - b.age);
}

export default function WikipediaLifeLens() {
  const [wikiUrl, setWikiUrl] = useState("");
  const [wikiProfile, setWikiProfile] = useState(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiError, setWikiError] = useState("");
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [showMomentModal, setShowMomentModal] = useState(false);
  const [wikiMoments, setWikiMoments] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyzeWikipedia = async (e) => {
    e.preventDefault();
    setWikiError("");
    setWikiProfile(null);
    setWikiLoading(true);
    setExpandedEvent(null);

    try {
      const data = await fetchWikiLifeData(wikiUrl.trim());
      setWikiProfile(data);
      // Load moments for this profile
      if (data?.title) {
        setWikiMoments(getWikiMoments(data.title));
      }
    } catch (err) {
      setWikiError(err?.message || "Could not analyze this Wikipedia profile.");
    } finally {
      setWikiLoading(false);
    }
  };

  const handleSaveMoment = (data) => {
    if (wikiProfile?.title) {
      saveWikiMoment(wikiProfile.title, data);
      setWikiMoments(getWikiMoments(wikiProfile.title));
      setShowMomentModal(false);
    }
  };

  const handleDeleteMoment = (id) => {
    if (wikiProfile?.title) {
      deleteWikiMoment(wikiProfile.title, id);
      setWikiMoments(getWikiMoments(wikiProfile.title));
    }
  };

  const detailedTimeline = useMemo(
    () => (wikiProfile ? buildDetailedTimeline(wikiProfile) : []),
    [wikiProfile],
  );

  if (!mounted) return null;

  return (
    <section className="user-home-wiki timeline-section">
      <div className="user-home-inner">
        <motion.div
          className="user-home-section-intro"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2>Measure a Life</h2>
          <p>
            Paste a Wikipedia link to visualize someone&apos;s journey—a
            detailed path from birth to now, showing every milestone and life
            stage.
          </p>
        </motion.div>

        <motion.form
          className="wiki-form"
          onSubmit={handleAnalyzeWikipedia}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}>
          <input
            className="wiki-input"
            type="url"
            placeholder="https://en.wikipedia.org/wiki/Steve_Jobs"
            value={wikiUrl}
            onChange={(e) => setWikiUrl(e.target.value)}
            required
          />
          <button className="wiki-submit" type="submit" disabled={wikiLoading}>
            {wikiLoading ? "Reading..." : "Explore"}
          </button>
        </motion.form>

        <AnimatePresence mode="wait">
          {wikiError && (
            <motion.p
              className="wiki-error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}>
              {wikiError}
            </motion.p>
          )}

          {wikiProfile && wikiProfile.progress && (
            <motion.div
              className="wiki-result timeline-result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}>
              {/* Profile Header */}
              <motion.div
                className="timeline-profile-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}>
                <div className="timeline-header-flex">
                  {wikiProfile.thumbnail && (
                    <motion.img
                      src={wikiProfile.thumbnail}
                      alt={wikiProfile.title}
                      className="timeline-avatar"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                  <div className="timeline-header-content">
                    <h3 className="timeline-title">{wikiProfile.title}</h3>
                    <p className="timeline-description">
                      {wikiProfile.description}
                    </p>
                    <a
                      className="timeline-wiki-link"
                      href={wikiProfile.articleUrl}
                      target="_blank"
                      rel="noreferrer">
                      Read full Wikipedia page →
                    </a>
                  </div>
                </div>

                {/* Life Summary Stats */}
                <motion.div
                  className="timeline-summary"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}>
                  <div className="timeline-stat-box">
                    <div className="timeline-stat-num">
                      {new Date(wikiProfile.progress.birthDate).getFullYear()}
                    </div>
                    <div className="timeline-stat-label">Born</div>
                  </div>
                  <div className="timeline-stat-box">
                    <div className="timeline-stat-num">
                      {wikiProfile.progress.ageYears}
                    </div>
                    <div className="timeline-stat-label">Years lived</div>
                  </div>
                  <div className="timeline-stat-box">
                    <div className="timeline-stat-num">
                      {wikiProfile.progress.weeksLived.toLocaleString()}
                    </div>
                    <div className="timeline-stat-label">Weeks</div>
                  </div>
                  <div className="timeline-stat-box">
                    <div className="timeline-stat-num">
                      {wikiProfile.progress.progressPercent.toFixed(0)}%
                    </div>
                    <div className="timeline-stat-label">Of 4,000 weeks</div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Progress Bar */}
              <motion.div
                className="timeline-progress-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}>
                <div className="timeline-progress-track">
                  <motion.div
                    className="timeline-progress-fill"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${wikiProfile.progress.progressPercent}%`,
                    }}
                    transition={{
                      duration: 1.4,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.4,
                    }}
                  />
                </div>
              </motion.div>

              {/* Detailed Timeline: Birth to Now */}
              {detailedTimeline.length > 0 && (
                <motion.div
                  className="timeline-detailed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}>
                  <h4 className="timeline-section-title">
                    Journey from birth to today
                  </h4>

                  {/* Vertical Timeline with animated path */}
                  <div className="timeline-path-container">
                    {/* Animated SVG path */}
                    <svg
                      className="timeline-svg-path"
                      viewBox="0 0 60 100"
                      preserveAspectRatio="none">
                      <defs>
                        <linearGradient
                          id="pathGradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%">
                          <stop
                            offset="0%"
                            stopColor="rgba(191, 90, 242, 0.3)"
                          />
                          <stop
                            offset="50%"
                            stopColor="rgba(41, 151, 255, 0.3)"
                          />
                          <stop
                            offset="100%"
                            stopColor="rgba(48, 213, 200, 0.3)"
                          />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d={`M 30 0 ${detailedTimeline
                          .map(
                            (_, i) =>
                              `L 30 ${(i / (detailedTimeline.length - 1 || 1)) * 100}`,
                          )
                          .join(" ")}`}
                        stroke="url(#pathGradient)"
                        strokeWidth="2"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 2,
                          ease: "easeInOut",
                          delay: 0.5,
                        }}
                      />
                    </svg>

                    {/* Timeline events */}
                    <div className="timeline-events">
                      {detailedTimeline.map((event, idx) => {
                        const stage = getLifeStage(event.age);
                        const isExpanded = expandedEvent === idx;
                        return (
                          <motion.div
                            key={`${event.age}-${idx}`}
                            className={`timeline-event ${event.isBirth ? "birth-event" : ""} ${
                              event.isNow ? "now-event" : ""
                            } ${event.isEnd ? "end-event" : ""}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: 0.5 + idx * 0.08,
                              duration: 0.5,
                            }}
                            onClick={() =>
                              setExpandedEvent(isExpanded ? null : idx)
                            }
                            style={{
                              "--stage-color": stage.color,
                              "--delay-offset": idx * 0.08,
                            }}>
                            <div className="timeline-event-marker" />
                            <div className="timeline-event-content">
                              <div className="timeline-event-header">
                                <span className="timeline-event-age">
                                  Age {event.age}
                                </span>
                                <span className="timeline-event-year">
                                  {event.year}
                                </span>
                              </div>
                              <div className="timeline-event-text">
                                {event.text}
                              </div>
                              {event.isLifeStage && (
                                <span
                                  className="timeline-stage-badge"
                                  style={{
                                    background: stage.color + "20",
                                    borderColor: stage.color,
                                  }}>
                                  {stage.name}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Life Stages Overview */}
              {wikiProfile.progress && (
                <motion.div
                  className="timeline-stages"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}>
                  <h4 className="timeline-section-title">Life stages</h4>
                  <div className="timeline-stages-grid">
                    {LIFE_STAGES.slice(1).map((stage) => {
                      const ageMin = stage.ageRange[0];
                      const ageMax = Math.min(
                        stage.ageRange[1],
                        wikiProfile.progress.ageYears,
                      );
                      const stageLived = Math.max(0, ageMax - ageMin + 1);
                      const stageDuration =
                        stage.ageRange[1] - stage.ageRange[0] + 1;
                      const stagePercent = (stageLived / stageDuration) * 100;
                      const isActive = wikiProfile.progress.ageYears >= ageMin;
                      const isCurrent =
                        wikiProfile.progress.ageYears >= ageMin &&
                        wikiProfile.progress.ageYears < ageMax;

                      return (
                        <motion.div
                          key={stage.name}
                          className={`timeline-stage-item ${isActive ? "active" : ""} ${
                            isCurrent ? "current" : ""
                          }`}
                          style={{ "--stage-color": stage.color }}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.65 }}>
                          <div className="timeline-stage-name">
                            {stage.name}
                          </div>
                          <div className="timeline-stage-bar">
                            <motion.div
                              className="timeline-stage-fill"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${isActive ? stagePercent : 0}%`,
                              }}
                              transition={{
                                duration: 1,
                                delay: 0.7,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                          <div className="timeline-stage-label">
                            Ages {ageMin}-{ageMax}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                className="timeline-cta-section"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}>
                <p>
                  Now visualize your own path—track moments from birth to today.
                </p>
                <button
                  className="timeline-cta-btn"
                  onClick={() => {
                    const trackerSection =
                      document.getElementById("life-tracker");
                    trackerSection?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  Start Tracking →
                </button>
              </motion.div>

              {/* Track Moments Inspired by This Life */}
              <motion.div
                className="timeline-moments-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}>
                <h4 className="timeline-section-title">
                  Track the moments that define your weeks
                </h4>
                <p className="timeline-moments-subtitle">
                  Log insights and lessons inspired by {wikiProfile.title}
                  &apos;s path.
                </p>

                {/* Moments Hero Stats */}
                <div className="timeline-moments-hero">
                  <div className="lt-tracker-hero-stat">
                    <span className="lt-tracker-hero-num">
                      {wikiMoments.length}
                    </span>
                    <span className="lt-tracker-hero-label">
                      Moments logged
                    </span>
                  </div>
                </div>

                {/* Add Moment Button */}
                <div className="timeline-moments-actions">
                  <button
                    className="timeline-moment-add-btn"
                    onClick={() => setShowMomentModal(true)}>
                    <span>+</span> Log a moment
                  </button>
                </div>

                {/* Moments Timeline */}
                {wikiMoments.length > 0 && (
                  <div className="lt-timeline lt-timeline--milestones">
                    <AnimatePresence mode="popLayout">
                      {wikiMoments
                        .slice()
                        .reverse()
                        .map((moment, i) => (
                          <WikiMomentCard
                            key={moment.id}
                            moment={moment}
                            onDelete={handleDeleteMoment}
                            index={i}
                            profileTitle={wikiProfile.title}
                          />
                        ))}
                    </AnimatePresence>
                  </div>
                )}

                {wikiMoments.length === 0 && (
                  <div className="lt-empty">
                    <div className="lt-empty-icon">✦</div>
                    <p className="lt-empty-text">
                      Log your first moment inspired by this life to begin.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {wikiProfile && !wikiProfile.progress && (
            <motion.p
              className="wiki-note-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}>
              Birth or death dates aren&apos;t available—can&apos;t visualize
              the timeline for this profile yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showMomentModal && (
          <WikiMomentModal
            profileTitle={wikiProfile?.title || ""}
            onSave={handleSaveMoment}
            onClose={() => setShowMomentModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
