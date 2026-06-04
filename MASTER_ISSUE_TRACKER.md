# Master Issue Tracker — BOOP 3.0 Audit

## Priority Key
- **P0** — Must fix before submission (blocks polish, breaks UX, looks amateur)
- **P1** — Strongly recommended (noticeable quality gap)
- **P2** — Nice to have (improves experience)
- **P3** — Ignore / defer

---

## P0 — Must Fix Before Submission

| # | Issue | File(s) | Effort | Impact |
|---|-------|---------|--------|--------|
| 1 | **`/templates` route links to nowhere** — Header nav has "Templates" link to `/templates` but App.js has no route for it. Clicking it hits 404. Breaks navigation. | `Header.js`, `App.js` | Low | Breaks nav trust |
| 2 | **`index.html` loads old Nunito font** — The Google Fonts `<link>` loads Nunito (the old design system font) while `index.css` imports Playfair Display, Source Serif 4, Inter, JetBrains Mono via `@import`. Nunito is never used but still downloaded (~30KB). Dead font weight. | `public/index.html` | Low | Performance, professionalism |
| 3 | **`PuzzleGame.js` poster canvas uses wrong theme colors** — The canvas poster (`renderPosterCanvas`) uses dark blue/purple colors (`#16213e`, `#0f172a`, `#1e293b`) that clash completely with BOOP's warm paper/ink editorial palette. | `PuzzleGame.js` | Medium | Design consistency, identity |
| 4 | **`GenerationProgress.js` is unused dead code** — Component exists but is not imported anywhere. Confuses codebase navigation. Either remove or wire in. | `GenerationProgress.js` | Low | Cleanliness |
| 5 | **`PuzzleCreator.js` — title validation error never clears** — When user types valid chars after invalid chars, error state is set to null but then immediately re-evaluated. The error flash/clear UX is janky on every keystroke. Better to validate on blur or submit. | `PuzzleCreator.js` | Low | UX polish |
| 6 | **No loading state for puzzle generation in `PuzzleGame.js`** — After clicking "Start Game", the loading spinner appears but there is no visible progress indicator beyond a spinner and text. User doesn't know if generation is progressing or stuck. | `PuzzleGame.js` | Medium | Trust, UX |
| 7 | **`Logo.svg` used as favicon, but `meta[theme-color]` is blue (`#4a6fa5`)** — Theme color doesn't match BOOP's green (#3D6B3D). On mobile, the browser chrome will show blue. | `public/index.html` | Low | Brand consistency |
| 8 | **No visual feedback when puzzle generation starts on creator page** — The LoadingOverlay appears but the button text changes from "Generate" to "Generating..." — however, if the user clicks again rapidly, there's no debounce protection visible. | `PuzzleCreator.js` | Low | UX robustness |

---

## P1 — Strongly Recommended

| # | Issue | File(s) | Effort | Impact |
|---|-------|---------|--------|--------|
| 9 | **`Tooltip.css` uses hardcoded `white` and `--dark` instead of theme variables** — Tooltip tooltip-text uses `background: var(--dark)` and `color: white`. `--dark` maps to `--ink` which in dark mode is `#E2D8C8` (warm light). White on warm light is still readable but inconsistent. | `Tooltip.css` | Low | Dark mode polish |
| 10 | **Theme toggle icon is inverted from common convention** — `darkMode ? <sun> : <moon>`. Shows sun when dark (implies "click to go light") and moon when light (implies "click to go dark"). Convention is: moon = dark mode active, sun = light mode active. | `ThemeToggle.js` | Low | UX familiarity |
| 11 | **PuzzlePreview grid regenerates randomly on page nav** — `genGrid()` in `useMemo` re-runs every time `page` changes, so the preview grid letters change each time you flip pages. Makes the preview look unstable. | `PuzzlePreview.js` | Low | UX polish |
| 12 | **`FileUploader.js` preview image alt text is unhelpful** — `alt="Preview"` should describe the image or be empty with `role="presentation"`. | `FileUploader.js` | Low | Accessibility |
| 13 | **No `route` for `/templates`** — Even if we remove the nav link, the lack of a templates page is a gap. Add a placeholder or remove the link entirely. | `App.js` | Low | Navigation integrity |
| 14 | **PuzzleGame shadow on `.card` in loading state doesn't match design system** — Uses `<div className="card">` which gets `box-shadow: var(--shadow-sm)` but loading state has no cards elsewhere in the app matching this style. | `PuzzleGame.js` | Low | Consistency |
| 15 | **No `aria-live` region for loading/status announcements** — Screen readers won't announce generation progress or status changes. | `LoadingOverlay.js`, `GenerationStatus.js` | Medium | Accessibility |
| 16 | **`HeroLetterGrid.js` canvas text hardcodes color `rgba(44, 24, 16, ...)`** — This is the light-mode `--ink` color. In dark mode, `--ink` is `#E2D8C8` (warm light), but the canvas will still render in dark brown. | `HeroLetterGrid.js` | Low | Dark mode consistency |
| 17 | **No reduced-motion alternative for HeroLetterGrid animation** — The canvas animation runs continuously. With `prefers-reduced-motion: reduce`, animations should be stopped or shown static. | `HeroLetterGrid.js` | Low | Accessibility |
| 18 | **`PuzzleGame.js` hint system cooldowns not communicated clearly** — Hints unlock after 60s, full solution after 120s. The progress bar is good, but there's no explanation of *why* the user has to wait. | `PuzzleGame.js` | Low | UX clarity |

---

## P2 — Nice to Have

| # | Issue | File(s) | Effort | Impact |
|---|-------|---------|--------|--------|
| 19 | **`App.js` fires wake-up API call on every mount** — `apiService.checkStatus()` runs on every app render. If the API is down, it logs an error to console. This is a debug artifact. | `App.js` | Low | Cleanliness |
| 20 | **Footer heading hierarchy skips levels** — `h3` for brand logo, `h4` for nav headings. This is non-standard. | `Footer.js` | Low | Semantics |
| 21 | **`PuzzleGame.js` uses inline `style={{ cursor: "pointer" }}`** — Should use CSS class. | `PuzzleGame.js` | Low | Code quality |
| 22 | **No `loading="lazy"` on images** — Logo and upload preview images could defer loading. | `Header.js`, `FileUploader.js` | Low | Performance |
| 23 | **`PuzzleGame.js` forceTick interval runs during play** — `forceTick(t => t + 1)` every 200ms for cooldown UI updates. Could use a ref-based approach. | `PuzzleGame.js` | Medium | Performance |
| 24 | **`GenerationProgress.js` has duplicated progress step logic** — Both `LoadingOverlay.js` and `GenerationProgress.js` define their own progress step arrays. Consolidate. | Both files | Medium | Maintainability |
| 25 | **Legal pages use `LegalPage.js` with section-based rendering** — Well-structured, but the `termsData.js` file is extremely long (1000+ lines of legal text in JS). Consider JSON or markdown. | `data/` | High | Maintainability |

---

## P3 — Ignore / Defer

- Legal page content is standard boilerplate — fine to keep.
- `PuzzleGame.js` at 1192 lines is unwieldy but refactoring is risky before submission.
- Canvas rendering in poster uses hardcoded dark colors, but it's an export artifact — low priority.
- Skeleton loading states exist but could be more polished.
- Some components use `React.memo` inconsistently.

---

## Summary

| Priority | Count |
|----------|-------|
| P0 | 8 |
| P1 | 10 |
| P2 | 7 |
| P3 | ~10 |
| **Total** | **35+** |
