/**
 * Storage abstraction layer for life events and weekly reflections.
 * Currently uses localStorage. Designed to swap in a cloud backend
 * (e.g. Firestore with Google Auth) later without changing component code.
 */

const EVENTS_KEY = "4000weeks_life_events";
const REFLECTIONS_KEY = "4000weeks_reflections";

// ═══════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════

function readEvents() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function getEvents() {
  return readEvents().sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function addEvent(event) {
  const events = readEvents();
  const newEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: null,
  };
  events.push(newEvent);
  writeEvents(events);
  return newEvent;
}

export function updateEvent(id, updates) {
  const events = readEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  events[idx] = {
    ...events[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeEvents(events);
  return events[idx];
}

export function deleteEvent(id) {
  const events = readEvents().filter((e) => e.id !== id);
  writeEvents(events);
}

export function getEventsByCategory(category) {
  return getEvents().filter((e) => e.category === category);
}

export function getEventStats() {
  const events = readEvents();
  const categories = {};
  events.forEach((e) => {
    categories[e.category] = (categories[e.category] || 0) + 1;
  });

  const sorted = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return {
    total: events.length,
    categories,
    earliest: sorted[0]?.date || null,
    latest: sorted[sorted.length - 1]?.date || null,
  };
}

// ═══════════════════════════════════════
// WEEKLY REFLECTIONS
// ═══════════════════════════════════════

function readReflections() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REFLECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeReflections(reflections) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
}

/**
 * Get all reflections sorted by week number (desc).
 */
export function getReflections() {
  return readReflections().sort((a, b) => b.weekNumber - a.weekNumber);
}

/**
 * Add a weekly reflection.
 * @param {Object} reflection
 * @param {number} reflection.weekNumber
 * @param {string} reflection.oneWord
 * @param {string} reflection.highlight
 * @param {string} reflection.lesson
 * @param {number} reflection.mood — 1-5
 * @param {string} reflection.gratitude
 * @param {string} reflection.prompt — the prompt shown
 */
export function addReflection(reflection) {
  const reflections = readReflections();
  const newRef = {
    ...reflection,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    userId: null,
  };
  reflections.push(newRef);
  writeReflections(reflections);
  return newRef;
}

export function updateReflection(id, updates) {
  const reflections = readReflections();
  const idx = reflections.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reflections[idx] = { ...reflections[idx], ...updates };
  writeReflections(reflections);
  return reflections[idx];
}

export function deleteReflection(id) {
  const reflections = readReflections().filter((r) => r.id !== id);
  writeReflections(reflections);
}

export function getReflectionStats() {
  const reflections = readReflections();
  if (reflections.length === 0) return { total: 0, avgMood: 0, streak: 0, moodHistory: [] };

  const moods = reflections.filter((r) => r.mood).map((r) => r.mood);
  const avgMood = moods.length
    ? (moods.reduce((s, m) => s + m, 0) / moods.length).toFixed(1)
    : 0;

  // Streak: count consecutive weeks backwards from the highest week number
  const weekNums = new Set(reflections.map((r) => r.weekNumber));
  const latest = Math.max(...weekNums);
  let streak = 0;
  let w = latest;
  while (weekNums.has(w)) { streak++; w--; }

  return {
    total: reflections.length,
    avgMood: parseFloat(avgMood),
    streak,
    moodHistory: reflections
      .sort((a, b) => a.weekNumber - b.weekNumber)
      .slice(-12)
      .map((r) => ({ week: r.weekNumber, mood: r.mood, word: r.oneWord })),
  };
}

/**
 * Seed localStorage with demo events + reflections if the stores are empty.
 * Called once on first sign-in so new users see a fully populated tracker.
 */
export function seedDemoData(events, reflections) {
  if (typeof window === "undefined") return;
  if (readEvents().length === 0) writeEvents(events);
  if (readReflections().length === 0) writeReflections(reflections);
}
