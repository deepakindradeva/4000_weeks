/**
 * Demo dataset for first-time visitors.
 * Shows a fully populated UI so new users immediately understand the value
 * without needing to sign in or enter any data.
 *
 * Demo persona: Alex Morgan, born March 1992, United States, female.
 */

// Simulate today as the build date for stable offsets
const TODAY = new Date();

function daysAgo(days) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export const DEMO_PROFILE = {
  birthYear: 1992,
  birthMonth: 3, // March
  countryCode: "US",
  gender: "female",
  isDemo: true,
};

// ─── Life Milestones ──────────────────────────────────────────────────────────

export const DEMO_EVENTS = [
  {
    id: "demo_evt_01",
    title: "Graduated with honors from UC Berkeley",
    description:
      "Four years of late nights and early mornings finally paid off. Cried on stage. Zero regrets.",
    date: "2014-05-15",
    category: "education",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_02",
    title: "Started my first real job at a startup",
    description:
      "A scrappy team of eight people in a San Francisco loft. Terrifying and exhilarating in equal measure.",
    date: "2014-08-01",
    category: "career",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_03",
    title: "Backpacked Southeast Asia solo for 3 months",
    description:
      "Quit my first job to wander. Vietnam, Thailand, Cambodia, Bali. The best decision I have ever made.",
    date: "2016-07-10",
    category: "travel",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_04",
    title: "Moved to New York City — finally on my own",
    description:
      "Tiny apartment, big city, even bigger dreams. Ate ramen for two months straight. Worth it.",
    date: "2017-02-01",
    category: "personal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_05",
    title: "Met my partner, Sam",
    description:
      "At a hiking meetup of all places. He was the only one not complaining about the climb. I knew immediately.",
    date: "2018-04-14",
    category: "personal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_06",
    title: "Ran my first marathon",
    description:
      "4 hours, 22 minutes. Every single step hurt. I crossed the finish line sobbing and I would do it again tomorrow.",
    date: "2019-10-07",
    category: "health",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_07",
    title: "Started painting during lockdown",
    description:
      "Watercolors first, then acrylics. Discovered a creative part of myself I never knew existed.",
    date: "2020-04-10",
    category: "creative",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_08",
    title: "Promoted to Senior Engineer",
    description:
      "Seven years of hard work, failed projects, and late nights. Worth every single one of them.",
    date: "2021-03-01",
    category: "career",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_09",
    title: "Adopted Pixel — a rescue greyhound",
    description:
      "He thinks he is a lap dog. We are both completely, hopelessly obsessed with each other.",
    date: "2022-01-15",
    category: "personal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_10",
    title: "Turned 30 — threw a proper rooftop party",
    description:
      "50 people, a Brooklyn rooftop, and the realization that 30 is not scary at all. It is everything.",
    date: "2022-03-15",
    category: "milestone",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_11",
    title: "Bought our first home in Brooklyn",
    description:
      "A fixer-upper with original hardwood floors. The kitchen is a disaster but the light is absolutely perfect.",
    date: "2023-08-01",
    category: "milestone",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo_evt_12",
    title: "Keynote at a 500-person tech conference",
    description:
      "Terrified for three weeks beforehand. The moment I stepped on stage, the fear disappeared entirely.",
    date: daysAgo(28),
    category: "career",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─── Weekly Reflections ────────────────────────────────────────────────────────
// Week numbers for someone born March 1992, as of April 2026 ≈ week 1775

export const DEMO_REFLECTIONS = [
  {
    id: "demo_ref_01",
    weekNumber: 1775,
    oneWord: "Rooted",
    highlight: "Finally unpacked the last box in the new place",
    lesson: "A home takes time to feel like yours. Give it grace.",
    mood: 4,
    gratitude: "A Sunday morning with nowhere to be",
    prompt: "What made you feel alive?",
    createdAt: new Date(TODAY.getTime() - 3 * 86400000).toISOString(),
  },
  {
    id: "demo_ref_02",
    weekNumber: 1774,
    oneWord: "Stretched",
    highlight: "Presented the product roadmap to the entire leadership team",
    lesson: "Discomfort is the tuition you pay for growth.",
    mood: 4,
    gratitude: "Sam making dinner without being asked",
    prompt: "What would you do differently?",
    createdAt: new Date(TODAY.getTime() - 10 * 86400000).toISOString(),
  },
  {
    id: "demo_ref_03",
    weekNumber: 1773,
    oneWord: "Grateful",
    highlight: "Hiked Mount Beacon — golden hour views over the Hudson",
    lesson: "Getting offline for a weekend recharges more than any vacation.",
    mood: 5,
    gratitude: "The way Pixel sprints when he sees the leash",
    prompt: "What are you grateful for right now?",
    createdAt: new Date(TODAY.getTime() - 17 * 86400000).toISOString(),
  },
  {
    id: "demo_ref_04",
    weekNumber: 1772,
    oneWord: "Creative",
    highlight: "Finished a watercolor I had been stuck on for three months",
    lesson: "Perfectionism is just fear in a tuxedo.",
    mood: 4,
    gratitude: "The smell of paint and coffee in the morning",
    prompt: "What made you feel alive?",
    createdAt: new Date(TODAY.getTime() - 24 * 86400000).toISOString(),
  },
  {
    id: "demo_ref_05",
    weekNumber: 1771,
    oneWord: "Reflective",
    highlight: "Long call with mom — she told me about her twenties",
    lesson: "Parents had whole lives before us. Ask them about it.",
    mood: 4,
    gratitude: "Good health — easy to forget until you do not have it",
    prompt: "What mattered most this week?",
    createdAt: new Date(TODAY.getTime() - 31 * 86400000).toISOString(),
  },
  {
    id: "demo_ref_06",
    weekNumber: 1770,
    oneWord: "Tired",
    highlight: "Finally shipped the Q1 migration after weeks of late nights",
    lesson: "Rest is productive. Burnout is the enemy of everything.",
    mood: 3,
    gratitude: "The migration being done",
    prompt: "What are you avoiding?",
    createdAt: new Date(TODAY.getTime() - 38 * 86400000).toISOString(),
  },
  {
    id: "demo_ref_07",
    weekNumber: 1769,
    oneWord: "Alive",
    highlight: "Stumbled into a free jazz concert in the park by accident",
    lesson: "The best moments are not planned — leave room for them.",
    mood: 5,
    gratitude: "Living in a city full of unexpected magic",
    prompt: "What made you feel alive?",
    createdAt: new Date(TODAY.getTime() - 45 * 86400000).toISOString(),
  },
  {
    id: "demo_ref_08",
    weekNumber: 1768,
    oneWord: "Growth",
    highlight: "Had a hard but honest conversation with my manager about direction",
    lesson: "Clarity is worth the discomfort of asking for it.",
    mood: 4,
    gratitude: "A manager who actually listens",
    prompt: "What would Burkeman say about your week?",
    createdAt: new Date(TODAY.getTime() - 52 * 86400000).toISOString(),
  },
];

// Dummy user identity (matches AuthContext DUMMY_USER)
export const DEMO_USER = {
  uid: "demo_user_12345",
  displayName: "Alex Morgan",
  email: "alex.morgan@gmail.com",
  photoURL: null,
};
