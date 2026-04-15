const WIKIPEDIA_HOST = "wikipedia.org";

function getWikiTitleFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes(WIKIPEDIA_HOST)) return null;
    const wikiIdx = parsed.pathname.indexOf("/wiki/");
    if (wikiIdx === -1) return null;
    const rawTitle = parsed.pathname.slice(wikiIdx + "/wiki/".length);
    if (!rawTitle) return null;
    return decodeURIComponent(rawTitle).replace(/_/g, " ");
  } catch {
    return null;
  }
}

function extractTimelineFromText(text) {
  const sentences = (text.match(/[^.!?]+[.!?]/g) || []).map((s) => s.trim());
  const withYears = [];

  for (const sentence of sentences) {
    const yearMatch = sentence.match(/\b(1[6-9]\d{2}|20\d{2}|21\d{2})\b/);
    if (!yearMatch) continue;
    withYears.push({ year: Number(yearMatch[1]), text: sentence });
  }

  const deduped = [];
  const seen = new Set();
  for (const item of withYears) {
    const key = `${item.year}-${item.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped.slice(0, 10);
}

function getClaimDate(claims, key) {
  const candidate = claims?.[key]?.[0]?.mainsnak?.datavalue?.value?.time;
  if (!candidate) return null;
  const cleaned = candidate.replace(/^\+/, "").split("T")[0];
  const parsed = new Date(cleaned);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function fetchSummary(title) {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );
  if (!response.ok) {
    throw new Error("Could not fetch this Wikipedia page summary.");
  }
  const summary = await response.json();
  if (!summary?.title || summary?.type === "disambiguation") {
    throw new Error("Please use a specific person page, not a disambiguation page.");
  }
  return summary;
}

async function fetchExtractText(title, fallbackExtract) {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(
      title
    )}&format=json&origin=*`
  );
  const json = await response.json();
  const pages = json?.query?.pages ? Object.values(json.query.pages) : [];
  return pages?.[0]?.extract || fallbackExtract || "";
}

async function fetchWikibaseItem(title) {
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${encodeURIComponent(
      title
    )}&format=json&origin=*`
  );
  const json = await response.json();
  const pageProps = json?.query?.pages ? Object.values(json.query.pages)?.[0]?.pageprops : null;
  return pageProps?.wikibase_item || null;
}

async function fetchLifeDates(wikibaseItem) {
  if (!wikibaseItem) return { birthDate: null, deathDate: null };

  const response = await fetch(
    `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikibaseItem}&format=json&props=claims&origin=*`
  );
  const json = await response.json();
  const claims = json?.entities?.[wikibaseItem]?.claims || {};
  return {
    birthDate: getClaimDate(claims, "P569"),
    deathDate: getClaimDate(claims, "P570"),
  };
}

function buildProgress(birthDate, deathDate) {
  if (!birthDate) return null;

  const endDate = deathDate || new Date();
  const weeksLived = Math.max(
    0,
    Math.floor((endDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
  );

  return {
    weeksLived,
    progressPercent: Math.min(100, (weeksLived / 4000) * 100),
    isComplete: Boolean(deathDate),
    birthDate,
    deathDate,
    ageYears: Math.floor(weeksLived / 52),
  };
}

export async function fetchWikiLifeData(url) {
  const title = getWikiTitleFromUrl(url);
  if (!title) throw new Error("Please enter a valid Wikipedia article URL.");

  const summary = await fetchSummary(title);
  const extractText = await fetchExtractText(summary.title, summary.extract);
  const wikibaseItem = await fetchWikibaseItem(summary.title);
  const { birthDate, deathDate } = await fetchLifeDates(wikibaseItem);

  const timeline = extractTimelineFromText(extractText);
  const achievements = [
    summary.description,
    ...timeline.slice(0, 3).map((item) => item.text),
  ].filter(Boolean);

  return {
    title: summary.title,
    description: summary.description || "No short description available.",
    thumbnail: summary.thumbnail?.source || null,
    articleUrl: summary.content_urls?.desktop?.page || url,
    achievements,
    timeline,
    progress: buildProgress(birthDate, deathDate),
  };
}
