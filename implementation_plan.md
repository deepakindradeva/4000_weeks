# 4,000 Weeks — Improvement Plan

A research-backed plan to transform the current site from a beautiful informational page into an engaging, personally meaningful tool that users return to and share.

## Research Findings

Based on analysis of successful life-visualization apps (Memento Mori, Life Calendar, Weeks, HabitScreen, Life Grid), viral mechanics of Wait But Why's "Life in Weeks", and underutilized content from the book:

| What works | Our gap |
|---|---|
| **Personalization** — apps that feel "yours" retain users | Our week grid is hardcoded to 30 years. Calculator only shows a number. |
| **Shareability** — beautiful, personal images drive organic growth | No way to share results or generate an image card |
| **Weekly return hooks** — journaling, prompts, check-ins | Life Tracker exists but has no prompts or reflection structure |
| **Perspective shifts** — visualizing time in different ways stuns people | We only show weeks. No "summers left", "books you'll read", "sunsets" |
| **Inclusivity** — life expectancy varies by country, gender, lifestyle | Hardcoded to 80 years globally — insensitive to real variation |
| **Richer book content** — the book has far more actionable wisdom | Only 6 ideas + 10 tools. Missing Part II entirely, Heidegger, Hofstadter, atelic activities |
| **Emotional depth** — quotes, prompts, and philosophy keep people engaged | Only 3 quotes. No rotating wisdom, no daily prompts |

---

## Proposed Changes

### 🔴 Priority 1 — High Impact, High Engagement

---

#### Feature 1: Personalized Interactive Week Grid

The static 4000-dot grid becomes **your** grid. After entering birth year + country, the grid updates to reflect your actual lived/remaining weeks using country-specific life expectancy data.

##### [MODIFY] [Calculator.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/components/Calculator.js)
- Expand from a simple birth-year input to collect: **birth year, birth month, country, gender (optional)**
- Calculate weeks using country-specific life expectancy (WHO data embedded as a static JSON)
- Show multiple result dimensions:
  - Weeks remaining
  - **Summers left** (~remaining years)
  - **Books you could read** (at 1/month pace)
  - **Sunrises remaining**
  - Percentage bar with gradient fill

##### [NEW] [lifeExpectancy.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/lib/lifeExpectancy.js)
- Static JSON dataset of life expectancy by country + gender (sourced from WHO 2024 data)
- ~195 countries with male/female/average expectancy
- Helper: `getExpectedWeeks(country, gender, birthYear)` → total weeks

##### [MODIFY] [Premise.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/components/Premise.js)
- The week grid becomes **reactive** — once the user enters their data in the Calculator, the Premise grid updates to show *their* life
- Color-code past weeks by decade for visual richness
- Add hover tooltips: "Week 1,248 — you were ~24 years old"

---

#### Feature 2: Perspective Engine — "Time Reframed"

A new section that reframes remaining time into emotionally resonant terms. This is the single most viral feature in life-calendar apps.

##### [NEW] [Perspectives.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/components/Perspectives.js)
- Once user enters their data, show a grid of perspective cards:
  - 🌅 **Sunrises left** — remaining weeks
  - ☀️ **Summers left** — remaining years
  - 📖 **Books you could read** — remaining weeks ÷ 2
  - 🎄 **Christmases left** — remaining years
  - 🌙 **Full moons left** — remaining weeks ÷ 4
  - 🎂 **Birthdays left** — remaining years
  - 🍽️ **Meals left** — remaining weeks × 21
  - 🗣️ **Conversations with parents** — if you see them ~10x/year (inspired by Wait But Why)
- Each card animates in with a staggered reveal and has a hover "expand" explaining the math
- Emotionally provocative without being morbid — framed positively

---

#### Feature 3: Weekly Reflection Journal

Transform the Life Tracker into a structured weekly reflection tool (the #1 feature that creates habitual return visits).

##### [MODIFY] [LifeTracker.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/components/LifeTracker.js)
- Add a **"Weekly Check-In"** tab alongside the existing milestone timeline
- Weekly check-in form:
  - **Week number** (auto-calculated from birth year)
  - **One word** to describe the week
  - **Highlight** — best moment
  - **Lesson** — what you learned
  - **Mood** — 5-point emoji scale (😫😕😐🙂😊)
  - **Gratitude** — one thing you're grateful for
- Mood visualization — small sparkline showing mood over recent weeks
- Prompted with a rotating philosophical question from the book

##### [MODIFY] [storage.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/lib/storage.js)
- Add `reflections` storage alongside `events`
- Shape: `{ weekNumber, oneWord, highlight, lesson, mood, gratitude, prompt, date }`

---

### 🟡 Priority 2 — Depth & Shareability

---

#### Feature 4: Shareable Life Cards

Generate beautiful, personalized images that users can share on social media. This is the #1 driver of organic growth for life-visualization apps.

##### [NEW] [ShareCard.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/components/ShareCard.js)
- After entering birth data, user can click "Create Your Card"
- Generates a dark-mode card (using HTML Canvas or html2canvas) showing:
  - Their mini week grid (personalized)
  - "I've lived X of my 4,000 weeks"
  - Remaining weeks, summers, sunrises
  - "4000weeks.app" watermark
- Download as PNG or share directly
- Card is beautiful enough to be used as a phone wallpaper

---

#### Feature 5: Expanded Philosophical Content

The book has much more to offer. Add richer, deeper content sections.

##### [NEW] [Philosophy.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/components/Philosophy.js)
- **Part I deep-dive**: Expand "Key Ideas" to include:
  - Heidegger's finitude concept — interactive "decision tree" showing how each choice closes other doors
  - The Convenience Paradox — animated visualization showing how "saving time" creates more tasks
  - Task Orientation vs. Clock Time — before/after comparison
- **Part II deep-dive**: Currently missing entirely. Add:
  - Hofstadter's Law section with interactive estimation exercise
  - Atelic Activities — what they are with examples + a "try this" prompt
  - Cosmic Insignificance Therapy — immersive scale visualization (you → city → earth → galaxy)
  - Rediscovering Patience — interactive "slow scroll" section that forces you to wait
- **Book Structure**: Add a visual table of contents / chapter map

##### [NEW] [QuoteRotator.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/components/QuoteRotator.js)
- Rotating quote component with 20+ quotes from the book + Stoic philosophers
- Shows a new quote on each visit / on a timer
- Includes quotes from: Seneca, Marcus Aurelius, Heidegger, Kieran Setiya — bridging to the broader philosophical tradition

---

#### Feature 6: Historical Timeline Context

Show worldwide events mapped to your week grid — "While you were in week 832, humans landed Perseverance on Mars."

##### [NEW] [TimelineContext.js](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/components/TimelineContext.js)
- After user enters birth year, overlay significant world events on their week timeline
- Events: moon landing, internet invention, iPhone launch, COVID, etc.
- Makes the abstract grid feel personal and real

---

### 🟢 Priority 3 — Polish & Inclusivity

---

#### Feature 7: Accessibility & Inclusivity

> [!IMPORTANT]
> The hardcoded 80-year assumption is problematic. Life expectancy varies from ~54 (Central African Republic) to ~85 (Japan). A user from Sierra Leone seeing "4000 weeks" may feel excluded rather than inspired.

##### Changes across multiple files:
- Replace hardcoded 80 years with **country-specific data** everywhere
- Add **optional gender input** (WHO data splits by gender)
- Add a **content sensitivity toggle** — some users may find mortality reminders distressing. Allow switching between "motivational" and "gentle" framing
- Ensure all interactive elements have proper **ARIA labels**
- Add **keyboard navigation** for the modal and all interactive elements
- Consider **reduced motion** preference via `prefers-reduced-motion` media query

##### [MODIFY] [globals.css](file:///Users/deepakpratimadevi/Desktop/workspace/4000_weeks/app/globals.css)
- Add `@media (prefers-reduced-motion: reduce)` block to disable all animations
- Ensure color contrast ratios meet WCAG AA for all text

---

## Open Questions

> [!IMPORTANT]
> **Scope decision needed** — This is a substantial feature set. I recommend implementing in order:
> 1. **Personalized week grid + life expectancy data** (Feature 1)
> 2. **Perspectives engine** (Feature 2)
> 3. **Weekly reflection journal** (Feature 3)
> 4. **Share cards** (Feature 4)
>
> Features 5–7 can follow in a second iteration. Do you want all of Priority 1 first, or should I pick specific features?

> [!WARNING]
> **Sensitivity consideration** — The app deals with mortality. Should we add a gentle disclaimer/toggle for users who may find this distressing? (e.g., "This experience explores themes of time and mortality. You can adjust the tone in settings.")

- Do you want to keep the site as a single scrollable page, or would you prefer **tab/section navigation** to organize the growing content?
- For the Share Card feature, should it be downloadable only or also include a direct "Share to Twitter/Instagram" flow?
- Any preference on which philosophical content from Part II you find most compelling for the expanded section?

## Verification Plan

### Automated Tests
- **Build check**: `npm run build` passes with no errors
- **Browser test**: Full scroll-through with screenshots at every section
- **Calculator test**: Verify country-specific calculations for 5 different countries
- **Storage test**: Add/edit/delete reflections, verify persistence across page reloads
- **Accessibility**: Run Lighthouse audit, verify keyboard navigation

### Manual Verification
- Test share card generation and download
- Verify responsive layout on mobile viewport
- Check `prefers-reduced-motion` behavior
