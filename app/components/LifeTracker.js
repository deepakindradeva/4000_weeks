"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import {
  getEvents,
  addEvent,
  deleteEvent,
  updateEvent,
  getEventStats,
  getReflections,
  addReflection,
  deleteReflection,
  getReflectionStats,
} from "../lib/storage";
import { DEMO_EVENTS, DEMO_REFLECTIONS } from "../lib/dummyData";

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

const PROMPTS = [
  "What mattered most this week?",
  "What would you do differently?",
  "What are you avoiding?",
  "What made you feel alive?",
  "What are you grateful for right now?",
  "What would Burkeman say about your week?",
  "Did you choose quality over quantity this week?",
  "What did you intentionally neglect?",
  "What task orientation felt most natural?",
  "What finite moment did you fully embrace?",
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

function timeAgoLabel(iso) {
  const now = new Date();
  const d = new Date(iso);
  const days = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (days < 0) return `in ${Math.abs(days)} days`;
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? "s" : ""} ago`;
}

/* ═══════════════════════════════════════
   EVENT MODAL
   ═══════════════════════════════════════ */
function EventModal({ event, onSave, onClose }) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [date, setDate] = useState(
    event?.date
      ? new Date(event.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState(event?.category || "milestone");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), date, category });
  };

  return (
    <motion.div
      className="lt-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="lt-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lt-modal-header">
          <h3>{event ? "Edit Moment" : "Add a Life Moment"}</h3>
          <button className="lt-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lt-form-group">
            <label className="lt-form-label" htmlFor="lt-title">What happened?</label>
            <input
              id="lt-title"
              className="lt-form-input"
              type="text"
              placeholder="Got promoted, ran a marathon, moved to Paris…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="lt-form-group">
            <label className="lt-form-label" htmlFor="lt-desc">Details (optional)</label>
            <textarea
              id="lt-desc"
              className="lt-form-input lt-form-textarea"
              placeholder="How did it feel? Why does it matter?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="lt-form-row">
            <div className="lt-form-group" style={{ flex: 1 }}>
              <label className="lt-form-label" htmlFor="lt-date">When</label>
              <input
                id="lt-date"
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
                  onClick={() => setCategory(cat.key)}
                >
                  <span className="lt-chip-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="lt-submit-btn">
            {event ? "Save Changes" : "Add Moment"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   REFLECTION MODAL
   ═══════════════════════════════════════ */
function ReflectionModal({ weekNumber, onSave, onClose }) {
  const [oneWord, setOneWord] = useState("");
  const [highlight, setHighlight] = useState("");
  const [lesson, setLesson] = useState("");
  const [mood, setMood] = useState(3);
  const [gratitude, setGratitude] = useState("");
  const [prompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!oneWord.trim()) return;
    onSave({
      weekNumber,
      oneWord: oneWord.trim(),
      highlight: highlight.trim(),
      lesson: lesson.trim(),
      mood,
      gratitude: gratitude.trim(),
      prompt,
    });
  };

  return (
    <motion.div
      className="lt-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="lt-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lt-modal-header">
          <h3>Week {weekNumber} Reflection</h3>
          <button className="lt-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="lt-prompt-box">
          <span className="lt-prompt-icon">💭</span>
          <p className="lt-prompt-text">{prompt}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lt-form-group">
            <label className="lt-form-label">One word for this week</label>
            <input
              className="lt-form-input"
              type="text"
              placeholder="e.g. Growth, Healing, Rush, Peace…"
              value={oneWord}
              onChange={(e) => setOneWord(e.target.value)}
              autoFocus
              required
              maxLength={20}
            />
          </div>

          <div className="lt-form-group">
            <label className="lt-form-label">How was your week?</label>
            <div className="lt-mood-picker">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`lt-mood-btn ${mood === m.value ? "active" : ""}`}
                  onClick={() => setMood(m.value)}
                  aria-label={m.label}
                >
                  <span className="lt-mood-emoji">{m.emoji}</span>
                  <span className="lt-mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lt-form-group">
            <label className="lt-form-label">Best moment</label>
            <input
              className="lt-form-input"
              type="text"
              placeholder="The highlight of your week"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
            />
          </div>

          <div className="lt-form-group">
            <label className="lt-form-label">What you learned</label>
            <input
              className="lt-form-input"
              type="text"
              placeholder="A lesson, insight, or realization"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
            />
          </div>

          <div className="lt-form-group">
            <label className="lt-form-label">Grateful for</label>
            <input
              className="lt-form-input"
              type="text"
              placeholder="One thing you're thankful for"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
            />
          </div>

          <button type="submit" className="lt-submit-btn">Save Reflection</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   TIMELINE CARD
   ═══════════════════════════════════════ */
function TimelineCard({ event, onEdit, onDelete, index, isPreview }) {
  const cat = getCategoryMeta(event.category);
  return (
    <motion.div
      className="lt-timeline-card"
      style={{ "--cat-color": cat.color }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      layout
    >
      <div className="lt-card-top">
        <span
          className="lt-card-cat-pill"
          style={{ color: cat.color, background: cat.color + "1a" }}
        >
          {cat.icon} {cat.label}
        </span>
        <span className="lt-card-ago">{timeAgoLabel(event.date)}</span>
      </div>
      <h4 className="lt-card-title">{event.title}</h4>
      {event.description && <p className="lt-card-desc">{event.description}</p>}
      <div className="lt-card-footer">
        <span className="lt-card-date">{formatDate(event.date)}</span>
        {!isPreview && (
          <div className="lt-card-actions">
            <button className="lt-card-btn" onClick={() => onEdit(event)} aria-label="Edit">✎</button>
            <button className="lt-card-btn lt-card-btn-danger" onClick={() => onDelete(event.id)} aria-label="Delete">✕</button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   REFLECTION CARD
   ═══════════════════════════════════════ */
function ReflectionCard({ reflection, onDelete, index, isPreview }) {
  const moodMeta = MOODS.find((m) => m.value === reflection.mood) || MOODS[2];
  return (
    <motion.div
      className="lt-timeline-card lt-reflection-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      layout
    >
      <div className="lt-card-top">
        <span className="lt-card-cat-pill" style={{ color: "var(--color-accent-gold)", background: "rgba(232,197,71,0.1)" }}>
          📅 Week {reflection.weekNumber}
        </span>
        <span className="lt-card-ago">{formatDate(reflection.createdAt)}</span>
      </div>

      <div className="lt-ref-hero">
        <span className="lt-ref-mood-lg">{moodMeta.emoji}</span>
        <h4 className="lt-ref-word-lg">&ldquo;{reflection.oneWord}&rdquo;</h4>
      </div>

      {(reflection.highlight || reflection.lesson || reflection.gratitude) && (
        <div className="lt-ref-details">
          {reflection.highlight && (
            <div className="lt-ref-detail">
              <span className="lt-ref-detail-icon">✨</span>
              <span>{reflection.highlight}</span>
            </div>
          )}
          {reflection.lesson && (
            <div className="lt-ref-detail">
              <span className="lt-ref-detail-icon">💡</span>
              <span>{reflection.lesson}</span>
            </div>
          )}
          {reflection.gratitude && (
            <div className="lt-ref-detail">
              <span className="lt-ref-detail-icon">🙏</span>
              <span>{reflection.gratitude}</span>
            </div>
          )}
        </div>
      )}

      {!isPreview && (
        <div className="lt-card-footer" style={{ marginTop: 12 }}>
          <div />
          <div className="lt-card-actions">
            <button className="lt-card-btn lt-card-btn-danger" onClick={() => onDelete(reflection.id)} aria-label="Delete">✕</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MOOD SPARKLINE
   ═══════════════════════════════════════ */
function MoodSparkline({ data }) {
  if (!data || data.length < 2) return null;
  const width = 200;
  const height = 40;
  const maxMood = 5;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d.mood / maxMood) * height;
    return `${x},${y}`;
  });
  return (
    <div className="lt-sparkline-container">
      <span className="lt-sparkline-label">Mood trend</span>
      <svg viewBox={`0 0 ${width} ${height}`} className="lt-sparkline">
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="var(--color-accent-gold)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - (d.mood / maxMood) * height;
          return (
            <circle key={i} cx={x} cy={y} r="3" fill="var(--color-accent-gold)" />
          );
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════
   DEMO BANNER
   ═══════════════════════════════════════ */
function DemoBanner({ onSignIn, isLoggingIn }) {
  return (
    <div className="lt-demo-banner">
      <div className="lt-demo-banner-left">
        <span className="lt-demo-badge">Preview</span>
        <span className="lt-demo-text">
          You&apos;re exploring Alex&apos;s demo timeline.
        </span>
      </div>
      <button
        className="lt-demo-cta"
        onClick={onSignIn}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <span className="nav-google-spinner" style={{ width: 14, height: 14 }} />
        ) : (
          <>Track your own story ↗</>
        )}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   TRACKER CONTENT (shared by preview + real mode)
   ═══════════════════════════════════════ */
function TrackerContent({
  events,
  reflections,
  eventStats,
  refStats,
  isPreview,
  currentWeek,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onAddReflection,
  onDeleteReflection,
  filterCategory,
  setFilterCategory,
  activeTab,
  setActiveTab,
  signInWithGoogle,
  isLoggingIn,
}) {
  const filteredEvents =
    filterCategory === "all"
      ? events
      : events.filter((e) => e.category === filterCategory);

  return (
    <>
      {/* Tabs */}
      <motion.div
        className="lt-tabs"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <button
          className={`lt-tab ${activeTab === "milestones" ? "active" : ""}`}
          onClick={() => setActiveTab("milestones")}
        >
          Milestones
          {eventStats.total > 0 && <span className="lt-tab-count">{eventStats.total}</span>}
        </button>
        <button
          className={`lt-tab ${activeTab === "reflections" ? "active" : ""}`}
          onClick={() => setActiveTab("reflections")}
        >
          Weekly Reflections
          {refStats.total > 0 && <span className="lt-tab-count">{refStats.total}</span>}
        </button>
      </motion.div>

      {/* ═══ MILESTONES TAB ═══ */}
      {activeTab === "milestones" && (
        <>
          {eventStats.total > 0 && (
            <div className="lt-stats-bar">
              <div className="lt-stat">
                <span className="lt-stat-value">{eventStats.total}</span>
                <span className="lt-stat-label">Moments</span>
              </div>
              <div className="lt-stat-divider" />
              <div className="lt-stat">
                <span className="lt-stat-value">{Object.keys(eventStats.categories).length}</span>
                <span className="lt-stat-label">Categories</span>
              </div>
              {eventStats.earliest && (
                <>
                  <div className="lt-stat-divider" />
                  <div className="lt-stat">
                    <span className="lt-stat-value">{formatDate(eventStats.earliest)}</span>
                    <span className="lt-stat-label">First moment</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="lt-actions-row">
            {isPreview ? (
              <button className="lt-add-btn" onClick={signInWithGoogle} disabled={isLoggingIn}>
                <span className="lt-add-icon">+</span>
                Sign in to add your moments
              </button>
            ) : (
              <button className="lt-add-btn" onClick={onAddEvent}>
                <span className="lt-add-icon">+</span>
                Add a moment
              </button>
            )}

            {eventStats.total > 0 && (
              <div className="lt-filter-bar">
                <button
                  className={`lt-filter-chip ${filterCategory === "all" ? "active" : ""}`}
                  onClick={() => setFilterCategory("all")}
                >
                  All
                </button>
                {CATEGORIES.filter((c) => eventStats.categories[c.key]).map((cat) => (
                  <button
                    key={cat.key}
                    className={`lt-filter-chip ${filterCategory === cat.key ? "active" : ""}`}
                    style={{ "--chip-color": cat.color }}
                    onClick={() => setFilterCategory(cat.key)}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredEvents.length === 0 && (
            <div className="lt-empty">
              <div className="lt-empty-icon">✦</div>
              <p className="lt-empty-text">
                {events.length === 0
                  ? "Your timeline is empty. Add your first life moment to begin."
                  : "No moments in this category yet."}
              </p>
            </div>
          )}

          <div className="lt-timeline lt-timeline--milestones">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, i) => (
                <TimelineCard
                  key={event.id}
                  event={event}
                  index={i}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                  isPreview={isPreview}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* ═══ REFLECTIONS TAB ═══ */}
      {activeTab === "reflections" && (
        <>
          {refStats.total > 0 && (
            <div className="lt-stats-bar">
              <div className="lt-stat">
                <span className="lt-stat-value">{refStats.total}</span>
                <span className="lt-stat-label">Reflections</span>
              </div>
              <div className="lt-stat-divider" />
              <div className="lt-stat">
                <span className="lt-stat-value">
                  {MOODS.find((m) => m.value === Math.round(refStats.avgMood))?.emoji || "😐"}
                </span>
                <span className="lt-stat-label">Avg mood ({refStats.avgMood})</span>
              </div>
              {refStats.streak > 0 && (
                <>
                  <div className="lt-stat-divider" />
                  <div className="lt-stat">
                    <span className="lt-stat-value lt-streak-value">
                      🔥 {refStats.streak}
                    </span>
                    <span className="lt-stat-label">Week streak</span>
                  </div>
                </>
              )}
              {refStats.moodHistory?.length >= 2 && (
                <>
                  <div className="lt-stat-divider" />
                  <MoodSparkline data={refStats.moodHistory} />
                </>
              )}
            </div>
          )}

          <div className="lt-actions-row">
            {isPreview ? (
              <button className="lt-add-btn" onClick={signInWithGoogle} disabled={isLoggingIn}>
                <span className="lt-add-icon">✎</span>
                Sign in to reflect on your week
              </button>
            ) : (
              <button className="lt-add-btn" onClick={onAddReflection}>
                <span className="lt-add-icon">✎</span>
                Reflect on this week
              </button>
            )}
            <span className="lt-week-badge">
              {isPreview ? "Week 1,775 · Alex's current week" : `You're in week ${currentWeek.toLocaleString()}`}
            </span>
          </div>

          {reflections.length === 0 && (
            <div className="lt-empty">
              <div className="lt-empty-icon">📝</div>
              <p className="lt-empty-text">
                No reflections yet. Take a moment to reflect on your week — it takes less than a minute.
              </p>
            </div>
          )}

          <div className="lt-timeline lt-timeline--reflections">
            <AnimatePresence mode="popLayout">
              {reflections.map((r, i) => (
                <ReflectionCard
                  key={r.id}
                  reflection={r}
                  index={i}
                  onDelete={onDeleteReflection}
                  isPreview={isPreview}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   MAIN TRACKER COMPONENT
   ═══════════════════════════════════════ */
export default function LifeTracker() {
  const { lifeData } = useUser();
  const { isLoggedIn, signInWithGoogle, isLoggingIn } = useAuth();

  const [events, setEvents] = useState([]);
  const [reflections, setReflections] = useState([]);
  const [eventStats, setEventStats] = useState({ total: 0, categories: {} });
  const [refStats, setRefStats] = useState({ total: 0, avgMood: 0, streak: 0, moodHistory: [] });
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRefModal, setShowRefModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("milestones");
  const [mounted, setMounted] = useState(false);

  const currentWeek = lifeData
    ? lifeData.ageWeeks
    : Math.floor((Date.now() - new Date(1995, 0, 1)) / (7 * 24 * 60 * 60 * 1000));

  const refresh = useCallback(() => {
    setEvents(getEvents());
    setReflections(getReflections());
    setEventStats(getEventStats());
    setRefStats(getReflectionStats());
  }, []);

  useEffect(() => {
    setMounted(true);
    refresh();
  }, [refresh]);

  // Also re-read storage after sign-in (demo data gets seeded)
  useEffect(() => {
    if (isLoggedIn) refresh();
  }, [isLoggedIn, refresh]);

  const handleSaveEvent = (data) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, data);
    } else {
      addEvent(data);
    }
    setShowEventModal(false);
    setEditingEvent(null);
    refresh();
  };

  const handleSaveReflection = (data) => {
    addReflection(data);
    setShowRefModal(false);
    refresh();
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (id) => { deleteEvent(id); refresh(); };
  const handleDeleteReflection = (id) => { deleteReflection(id); refresh(); };

  if (!mounted) return null;

  // ─── Compute preview stats from demo data ────────────────────────────────
  const demoCategories = {};
  DEMO_EVENTS.forEach((e) => {
    demoCategories[e.category] = (demoCategories[e.category] || 0) + 1;
  });
  const demoEventStats = {
    total: DEMO_EVENTS.length,
    categories: demoCategories,
    earliest: DEMO_EVENTS[DEMO_EVENTS.length - 1]?.date,
  };
  const demoMoods = DEMO_REFLECTIONS.map((r) => r.mood);
  const demoAvgMood = (demoMoods.reduce((a, b) => a + b, 0) / demoMoods.length).toFixed(1);
  const demoRefStats = {
    total: DEMO_REFLECTIONS.length,
    avgMood: parseFloat(demoAvgMood),
    streak: 8, // 8 consecutive weeks in demo data
    moodHistory: DEMO_REFLECTIONS.slice().reverse().map((r) => ({
      week: r.weekNumber,
      mood: r.mood,
      word: r.oneWord,
    })),
  };

  // ─── PREVIEW MODE (not signed in) ────────────────────────────────────────
  const VP = { once: true, amount: 0.2 };

  if (!isLoggedIn) {
    return (
      <section className="section lt-section" id="life-tracker">
        <div className="section-inner">
          <motion.div
            className="section-label"
            style={{ color: "var(--color-accent-violet)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Your Story
          </motion.div>

          <motion.h2
            className="section-heading"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Track the moments that define your weeks.
          </motion.h2>

          <motion.p
            className="section-body"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Life isn&apos;t just counted in weeks—it&apos;s measured by the changes,
            achievements, and turning points along the way.
          </motion.p>

          <motion.div
            className="lt-tracker-hero"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="lt-tracker-hero-stat">
              <span className="lt-tracker-hero-num">{demoEventStats.total}</span>
              <span className="lt-tracker-hero-label">Moments logged</span>
            </div>
            <div className="lt-tracker-hero-div" />
            <div className="lt-tracker-hero-stat">
              <span className="lt-tracker-hero-num" style={{ color: "var(--color-accent-warm)" }}>🔥 {demoRefStats.streak}</span>
              <span className="lt-tracker-hero-label">Week streak</span>
            </div>
            <div className="lt-tracker-hero-div" />
            <div className="lt-tracker-hero-stat">
              <span className="lt-tracker-hero-num">{demoRefStats.total}</span>
              <span className="lt-tracker-hero-label">Reflections</span>
            </div>
            <div className="lt-tracker-hero-div" />
            <div className="lt-tracker-hero-stat">
              <span className="lt-tracker-hero-num" style={{ color: "var(--color-accent-gold)" }}>
                {MOODS.find(m => m.value === Math.round(demoRefStats.avgMood))?.emoji} {demoRefStats.avgMood}
              </span>
              <span className="lt-tracker-hero-label">Avg mood</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VP}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <DemoBanner onSignIn={signInWithGoogle} isLoggingIn={isLoggingIn} />
          </motion.div>

          <TrackerContent
            events={DEMO_EVENTS}
            reflections={DEMO_REFLECTIONS}
            eventStats={demoEventStats}
            refStats={demoRefStats}
            isPreview={true}
            currentWeek={1775}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            signInWithGoogle={signInWithGoogle}
            isLoggingIn={isLoggingIn}
          />
        </div>
      </section>
    );
  }

  // ─── REAL MODE (signed in) ────────────────────────────────────────────────
  return (
    <section className="section lt-section" id="life-tracker">
      <div className="section-inner">
        <motion.div
          className="section-label"
          style={{ color: "var(--color-accent-violet)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Your Story
        </motion.div>

        <motion.h2
          className="section-heading"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          Track the moments that define your weeks.
        </motion.h2>

        <motion.p
          className="section-body"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          Life isn&apos;t just counted in weeks—it&apos;s measured by the changes,
          achievements, and turning points along the way.
        </motion.p>

        <motion.div
          className="lt-tracker-hero"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VP}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="lt-tracker-hero-stat">
            <span className="lt-tracker-hero-num">{eventStats.total || 0}</span>
            <span className="lt-tracker-hero-label">Moments logged</span>
          </div>
          <div className="lt-tracker-hero-div" />
          <div className="lt-tracker-hero-stat">
            <span className="lt-tracker-hero-num" style={{ color: "var(--color-accent-warm)" }}>
              {refStats.streak > 0 ? `🔥 ${refStats.streak}` : "—"}
            </span>
            <span className="lt-tracker-hero-label">Week streak</span>
          </div>
          <div className="lt-tracker-hero-div" />
          <div className="lt-tracker-hero-stat">
            <span className="lt-tracker-hero-num">{refStats.total || 0}</span>
            <span className="lt-tracker-hero-label">Reflections</span>
          </div>
          <div className="lt-tracker-hero-div" />
          <div className="lt-tracker-hero-stat">
            <span className="lt-tracker-hero-num">Week {currentWeek.toLocaleString()}</span>
            <span className="lt-tracker-hero-label">You are here</span>
          </div>
        </motion.div>

        <TrackerContent
          events={events}
          reflections={reflections}
          eventStats={eventStats}
          refStats={refStats}
          isPreview={false}
          currentWeek={currentWeek}
          onAddEvent={() => { setEditingEvent(null); setShowEventModal(true); }}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onAddReflection={() => setShowRefModal(true)}
          onDeleteReflection={handleDeleteReflection}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Signed-in notice */}
        <motion.div
          className="lt-auth-teaser"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="lt-auth-icon">✓</div>
          <p>
            Signed in — your data is saved locally on this device.{" "}
            <span className="lt-auth-hint">Cloud sync coming soon.</span>
          </p>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showEventModal && (
          <EventModal
            event={editingEvent}
            onSave={handleSaveEvent}
            onClose={() => { setShowEventModal(false); setEditingEvent(null); }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRefModal && (
          <ReflectionModal
            weekNumber={currentWeek}
            onSave={handleSaveReflection}
            onClose={() => setShowRefModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
