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

// Pre-loaded inspiring figures
const INSPIRING_FIGURES = [
  {
    title: "Maya Angelou",
    description: "American poet, memoirist, and civil rights activist",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Maya_Angelou_1994.jpg/220px-Maya_Angelou_1994.jpg",
    articleUrl: "https://en.wikipedia.org/wiki/Maya_Angelou",
    achievements: [
      "Author of 'I Know Why the Caged Bird Sings'",
      "Won the National Medal of Arts",
      "Served as a civil rights activist and poet",
    ],
    timeline: [
      { year: 1928, text: "Born in St. Louis, Missouri" },
      { year: 1952, text: "Began career as a professional dancer" },
      { year: 1969, text: "Published 'I Know Why the Caged Bird Sings'" },
      { year: 1981, text: "Became professor at Wake Forest University" },
      { year: 2000, text: "Received the National Medal of Arts" },
    ],
    progress: {
      birthDate: new Date("1928-04-04"),
      deathDate: new Date("2014-05-28"),
      weeksLived: 4472,
      progressPercent: 111.8,
      isComplete: true,
      ageYears: 86,
    },
  },
  {
    title: "Nelson Mandela",
    description:
      "South African anti-apartheid revolutionary and first Black president",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Nelson_Mandela-2008_%28edit%29.jpg/220px-Nelson_Mandela-2008_%28edit%29.jpg",
    articleUrl: "https://en.wikipedia.org/wiki/Nelson_Mandela",
    achievements: [
      "Led South Africa's anti-apartheid movement",
      "Became first Black president of South Africa",
      "Won the Nobel Peace Prize",
    ],
    timeline: [
      { year: 1918, text: "Born in Umtata, South Africa" },
      { year: 1944, text: "Joined the African National Congress" },
      { year: 1962, text: "Arrested and imprisoned" },
      { year: 1990, text: "Released after 27 years in prison" },
      { year: 1994, text: "Elected first Black president of South Africa" },
    ],
    progress: {
      birthDate: new Date("1918-07-18"),
      deathDate: new Date("2013-12-05"),
      weeksLived: 4948,
      progressPercent: 123.7,
      isComplete: true,
      ageYears: 95,
    },
  },
  {
    title: "Marie Curie",
    description:
      "Polish physicist and chemist, pioneer of radioactivity research",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/220px-Marie_Curie_c._1920s.jpg",
    articleUrl: "https://en.wikipedia.org/wiki/Marie_Curie",
    achievements: [
      "First woman to win a Nobel Prize",
      "First person to win Nobel Prizes in two fields",
      "Discovered polonium and radium",
    ],
    timeline: [
      { year: 1867, text: "Born in Warsaw, Poland" },
      { year: 1891, text: "Enrolled at the University of Paris" },
      { year: 1903, text: "Won first Nobel Prize in Physics" },
      { year: 1911, text: "Won Nobel Prize in Chemistry" },
      { year: 1934, text: "Published her autobiography" },
    ],
    progress: {
      birthDate: new Date("1867-11-24"),
      deathDate: new Date("1934-07-04"),
      weeksLived: 3473,
      progressPercent: 86.8,
      isComplete: true,
      ageYears: 66,
    },
  },
  {
    title: "Steve Jobs",
    description:
      "Co-founder of Apple Computer and pioneer of personal computing",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/220px-Camponotus_flavomarginatus_ant.jpg",
    articleUrl: "https://en.wikipedia.org/wiki/Steve_Jobs",
    achievements: [
      "Co-founded Apple Computer with Steve Wozniak",
      "Introduced the Macintosh, iMac, iPhone, and iPad",
      "Revolutionized personal computing and digital media",
    ],
    timeline: [
      { year: 1955, text: "Born in Los Angeles, California" },
      { year: 1976, text: "Co-founded Apple Computer" },
      { year: 1984, text: "Introduced the Macintosh" },
      { year: 2001, text: "Unveiled the iPod" },
      { year: 2007, text: "Unveiled the iPhone" },
    ],
    progress: {
      birthDate: new Date("1955-02-24"),
      deathDate: new Date("2011-10-05"),
      weeksLived: 2938,
      progressPercent: 73.5,
      isComplete: true,
      ageYears: 56,
    },
  },
  {
    title: "Frida Kahlo",
    description: "Mexican artist known for self-portraits and surrealist art",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/220px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg",
    articleUrl: "https://en.wikipedia.org/wiki/Frida_Kahlo",
    achievements: [
      "Created iconic surrealist and self-portrait paintings",
      "Known for exploring pain, identity, and politics in art",
      "Became a symbol of Mexican culture and feminism",
    ],
    timeline: [
      { year: 1907, text: "Born in Coyoacán, Mexico City" },
      { year: 1925, text: "Survived a severe bus accident" },
      { year: 1929, text: "Married muralist Diego Rivera" },
      { year: 1938, text: "First solo exhibition in New York" },
      { year: 1954, text: "Last exhibition of her work during lifetime" },
    ],
    progress: {
      birthDate: new Date("1907-07-06"),
      deathDate: new Date("1954-07-13"),
      weeksLived: 2444,
      progressPercent: 61.1,
      isComplete: true,
      ageYears: 47,
    },
  },
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

  const handleSelectFigure = async (figure) => {
    setWikiError("");
    setWikiProfile(null);
    setWikiLoading(true);
    setExpandedEvent(null);

    try {
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setWikiProfile(figure);
      // Load moments for this profile
      if (figure?.title) {
        setWikiMoments(getWikiMoments(figure.title));
      }
    } catch (err) {
      setWikiError("Could not load this profile.");
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
            Explore inspiring life journeys—visualize the path from birth to now
            for remarkable figures who shaped the world.
          </p>
        </motion.div>

        {/* Figure Selection Grid */}
        {!wikiProfile && (
          <motion.div
            className="wiki-figures-grid"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            {INSPIRING_FIGURES.map((figure, idx) => (
              <motion.button
                key={figure.title}
                className="wiki-figure-card"
                onClick={() => handleSelectFigure(figure)}
                disabled={wikiLoading}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                whileTap={{ y: 0 }}>
                <div className="wiki-figure-image-wrap">
                  <img
                    src={figure.thumbnail}
                    alt={figure.title}
                    className="wiki-figure-image"
                  />
                  <div className="wiki-figure-overlay">
                    <span className="wiki-figure-cta">View Timeline →</span>
                  </div>
                </div>
                <h3 className="wiki-figure-name">{figure.title}</h3>
                <p className="wiki-figure-desc">{figure.description}</p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {wikiLoading && (
          <motion.div
            className="wiki-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            <div className="wiki-loader-spin"></div>
            <p>Loading timeline...</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {wikiProfile && wikiProfile.progress && (
            <motion.div
              className="wiki-result timeline-result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}>
              {/* Back Button */}
              <motion.button
                className="wiki-back-btn"
                onClick={() => {
                  setWikiProfile(null);
                  setWikiMoments([]);
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}>
                ← Back to figures
              </motion.button>

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
