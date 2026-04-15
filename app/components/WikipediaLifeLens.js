"use client";

import { useMemo, useState } from "react";
import { fetchWikiLifeData } from "../lib/wikipediaLife";

const LIFE_WEEKS_CAP = 4000;
const WEEKS_PER_ROW = 52;

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
  const events = (profile?.timeline || []).slice().sort((a, b) => a.year - b.year);
  if (events.length === 0) return [];

  const startYear = events[0].year;
  const endYear = events[events.length - 1].year;
  const span = Math.max(1, endYear - startYear);

  return events.map((event) => ({
    ...event,
    position: ((event.year - startYear) / span) * 100,
  }));
}

export default function WikipediaLifeLens() {
  const [wikiUrl, setWikiUrl] = useState("");
  const [wikiProfile, setWikiProfile] = useState(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiError, setWikiError] = useState("");

  const handleAnalyzeWikipedia = async (e) => {
    e.preventDefault();
    setWikiError("");
    setWikiProfile(null);
    setWikiLoading(true);

    try {
      const data = await fetchWikiLifeData(wikiUrl.trim());
      setWikiProfile(data);
    } catch (err) {
      setWikiError(err?.message || "Could not analyze this Wikipedia profile.");
    } finally {
      setWikiLoading(false);
    }
  };

  const weekModel = useMemo(() => buildLifeWeekModel(wikiProfile), [wikiProfile]);
  const timelineRail = useMemo(() => buildTimelineRail(wikiProfile), [wikiProfile]);

  return (
    <section className="user-home-wiki">
      <div className="user-home-inner">
        <div className="user-home-section-intro">
          <h2>Wikipedia Life Lens</h2>
          <p>
            Paste any person&apos;s Wikipedia link to estimate life progress,
            extract notable milestones, and generate a quick timeline.
          </p>
        </div>

        <form className="wiki-form" onSubmit={handleAnalyzeWikipedia}>
          <input
            className="wiki-input"
            type="url"
            placeholder="https://en.wikipedia.org/wiki/..."
            value={wikiUrl}
            onChange={(e) => setWikiUrl(e.target.value)}
            required
          />
          <button className="wiki-submit" type="submit" disabled={wikiLoading}>
            {wikiLoading ? "Analyzing..." : "Analyze Profile"}
          </button>
        </form>

        {wikiError && <p className="wiki-error">{wikiError}</p>}

        {wikiProfile && (
          <div className="wiki-result">
            <div className="wiki-header">
              {wikiProfile.thumbnail && (
                <img
                  src={wikiProfile.thumbnail}
                  alt={wikiProfile.title}
                  className="wiki-avatar"
                />
              )}
              <div>
                <h3 className="wiki-title">{wikiProfile.title}</h3>
                <p className="wiki-description">{wikiProfile.description}</p>
                <a className="wiki-link" href={wikiProfile.articleUrl} target="_blank" rel="noreferrer">
                  Open Wikipedia page
                </a>
              </div>
            </div>

            {wikiProfile.progress ? (
              <div className="wiki-progress-card">
                <div className="wiki-progress-row">
                  <span>{wikiProfile.progress.weeksLived.toLocaleString()} weeks lived</span>
                  <span>{wikiProfile.progress.progressPercent.toFixed(1)}% of 4,000 weeks</span>
                </div>
                <div className="wiki-progress-track">
                  <div
                    className="wiki-progress-fill"
                    style={{ width: `${wikiProfile.progress.progressPercent}%` }}
                  />
                </div>
                <p className="wiki-progress-note">
                  {wikiProfile.progress.isComplete
                    ? "This life journey is complete."
                    : `Estimated age: ${wikiProfile.progress.ageYears} years.`}
                </p>
              </div>
            ) : (
              <p className="wiki-note">
                Life progress is unavailable because birth/death metadata was not found.
              </p>
            )}

            <div className="wiki-columns">
              <div className="wiki-column">
                <h4>Achievements Snapshot</h4>
                <ul>
                  {wikiProfile.achievements.slice(0, 5).map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="wiki-column">
                <h4>Timeline Highlights</h4>
                <ul>
                  {wikiProfile.timeline.length === 0 && (
                    <li>No timeline points were extracted from the article text.</li>
                  )}
                  {wikiProfile.timeline.map((item, idx) => (
                    <li key={`${item.year}-${idx}`}>
                      <strong>{item.year}:</strong> {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="wiki-visuals">
              <div className="wiki-visual-card">
                <h4>Visual Timeline</h4>
                {timelineRail.length > 0 ? (
                  <>
                    <div className="wiki-timeline-rail">
                      <div className="wiki-timeline-line" />
                      {timelineRail.map((item, idx) => (
                        <div
                          key={`${item.year}-${idx}`}
                          className="wiki-timeline-point"
                          style={{ left: `${item.position}%` }}
                          title={`${item.year}: ${item.text}`}
                        />
                      ))}
                    </div>
                    <div className="wiki-timeline-events">
                      {timelineRail.map((item, idx) => (
                        <div key={`${item.year}-event-${idx}`} className="wiki-timeline-event">
                          <span className="wiki-timeline-year">{item.year}</span>
                          <span className="wiki-timeline-text">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="wiki-note">No timeline data found to visualize.</p>
                )}
              </div>

              <div className="wiki-visual-card">
                <h4>Life Weeks Grid (Git-style)</h4>
                {weekModel ? (
                  <>
                    <p className="wiki-grid-legend">
                      Highlighted boxes represent notable timeline moments.
                    </p>
                    <div className="wiki-week-grid-wrap">
                      <div className="wiki-week-labels">
                        {weekModel.rowLabels.map((label, idx) => (
                          <span key={`label-${idx}`}>{label}</span>
                        ))}
                      </div>
                      <div className="wiki-week-grid">
                        {weekModel.cells.map((cell) => (
                          <div
                            key={`week-${cell.week}`}
                            className={[
                              "wiki-week-cell",
                              cell.isLived ? "lived" : "future",
                              cell.isHighlight ? "highlight" : "",
                              cell.isCurrent ? "current" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            title={`Week ${cell.week}`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="wiki-note">
                    Week-grid view requires birth-date metadata from Wikidata.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
