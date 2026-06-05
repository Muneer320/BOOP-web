# Submission Evidence Package

## Required Screenshots, Recordings, and Comparisons

---

### Priority Ranking

| Tier | Description | Count |
|------|-------------|-------|
| 🔴 Essential | Must-have for judging | 13 items |
| 🟡 Strongly Recommended | Strongly strengthens submission | 10 items |
| 🟢 Optional | Nice to have | 7 items |

---

## 🔴 Essential (13 items)

### Screenshots

| # | Asset | Location | What to Capture |
|---|-------|----------|-----------------|
| 1 | **Home Page - Before** | `assets/before/screenshots/home-before.jpeg` | Full hero, features grid, how-it-works section |
| 2 | **Home Page - After** | `assets/after/screenshots/home-after.jpeg` | Full hero with badge, SVG feature icons, newspaper divider, steps with connectors |
| 3 | **Before/After Home Side-by-Side** | `assets/comparisons/home-compare.png` | Split view or overlaid animation showing the transformation |
| 4 | **Puzzle Creator Form - Before** | `assets/before/screenshots/creator-before.jpeg` | Step 1 form with blue theme, basic inputs, "Loading..." state visible |
| 5 | **Puzzle Creator Form - After** | `assets/after/screenshots/creator-after.jpeg` | Step 1 with tooltips, PuzzleDetails sidebar, vintage styling |
| 6 | **Play Feature - Start Screen** | `assets/after/screenshots/play-start.jpeg` | 6 mode cards, word source tabs, mode descriptions |
| 7 | **Play Feature - Active Game** | `assets/after/screenshots/play-active.jpeg` | Grid with letters, word list, timer, hint buttons |
| 8 | **Play Feature - Complete Screen** | `assets/after/screenshots/play-complete.jpeg` | Celebration, timer stopped, poster download, share buttons |
| 9 | **Dark Mode** | `assets/after/screenshots/dark-mode.jpeg` | Home page in dark mode, showing warm dark theme, toggle visible |
| 10 | **Mobile View** | `assets/after/screenshots/mobile-play.jpeg` | Play feature on mobile viewport, showing touch-optimized grid |

### Recordings

| # | Asset | Location | What to Capture |
|---|-------|----------|-----------------|
| 11 | **Generation Flow** | `assets/after/recordings/generation-flow.mp4` | Full create → generate → progress animation → complete → download flow (30-45 seconds) |
| 12 | **Play Through** | `assets/after/recordings/play-through.mp4` | Select mode → select words → play → use hints → complete → share (60-90 seconds) |

### GIF

| # | Asset | Location | What to Capture |
|---|-------|----------|-----------------|
| 13 | **Progress Animation** | `assets/after/outputs/progress-animation.gif` | The 8-step 3D slot-machine progress stepper during generation (looping) |

---

## 🟡 Strongly Recommended (10 items)

### Screenshots

| # | Asset | Location | What to Capture |
|---|-------|----------|-----------------|
| 14 | **About Page - Before** | `assets/before/screenshots/about-before.jpeg` | About page showing old styling |
| 15 | **About Page - After** | `assets/after/screenshots/about-after.jpeg` | Updated About page with new styling and play feature mentioned |
| 16 | **Creator Step 2 (Word Selection)** | `assets/after/screenshots/creator-words.jpeg` | Expandle topic cards, custom words input, file upload |
| 17 | **Creator Step 3 (Customize)** | `assets/after/screenshots/creator-customize.jpeg` | Image uploads with preview thumbnails |
| 18 | **Loading States - Skeleton** | `assets/after/screenshots/loading-skeleton.jpeg` | SkeletonForm/skeleton cards with shimmer animation |
| 19 | **404 Page** | `assets/after/screenshots/404-page.jpeg` | Custom NotFound with navigation links |
| 20 | **Responsive Header** | `assets/after/screenshots/mobile-header.mp4` | Hamburger menu open showing nav links + ThemeToggle |
| 21 | **Poster Download** | `assets/after/screenshots/poster-download.jpeg` | The generated poster PNG with grid, words, solve time |

### GIFs

| # | Asset | Location | What to Capture |
|---|-------|----------|-----------------|
| 22 | **Touch Drag Selection** | `assets/after/outputs/touch-drag.gif` | Mobile drag to select cells in puzzle game |
| 23 | **Dark Mode Toggle** | `assets/after/outputs/dark-mode-toggle.gif` | Toggling dark/light mode with transition animation |

---

## 🟢 Optional (7 items)

### Screenshots

| # | Asset | Location | What to Capture |
|---|-------|----------|-----------------|
| 24 | **Legal Page (Before)** | `assets/before/screenshots/legal-before.jpeg` | Privacy Policy or Terms of Service with old inline rendering |
| 25 | **Legal Page (After)** | `assets/after/screenshots/legal-after.jpeg` | Same page with new consistent styling |
| 26 | **PuzzlePreview Component** | `assets/after/screenshots/puzzle-preview.jpeg` | The SVG preview + PuzzleDetails panel in creator |
| 27 | **Tooltip** | `assets/after/screenshots/tooltip.jpeg` | Bonus mode tooltip visible |
| 28 | **GenerationStatus Toast** | `assets/after/screenshots/toast-notification.jpeg` | The floating status notification (generating/complete) |
| 29 | **Hint Cooldown** | `assets/after/screenshots/hint-cooldown.jpeg` | Cooldown progress bars on hint buttons |
| 30 | **Circular Bonus Grid** | `assets/after/screenshots/bonus-grid.jpeg` | Play mode with circular grid mask |

### Recordings

| # | Asset | Location | What to Capture |
|---|-------|----------|-----------------|
| 31 | **Full Site Tour** | `assets/after/recordings/full-site-tour.mp4` | Walk through all pages: Home → Create → Play → About → Legal → 404 (2-3 minutes) |
| 32 | **Backend API Testing** | `assets/after/recordings/api-testing.mp4` | Testing endpoints via Swagger UI or HTTP client showing rate limiting, validation, etc. |

---

### Directory Structure After Collection

```
FinishUpathon/
├── assets/
│   ├── after/
│   │   ├── outputs/
│   │   │   ├── progress-animation.gif
│   │   │   ├── touch-drag.gif
│   │   │   ├── dark-mode-toggle.gif
│   │   │   └── sample-puzzle.pdf
│   │   ├── recordings/
│   │   │   ├── generation-flow.mp4
│   │   │   ├── play-through.mp4
│   │   │   ├── full-site-tour.mp4
│   │   │   └── api-testing.mp4
│   │   └── screenshots/
│   │       ├── home-after.jpeg
│   │       ├── creator-after.jpeg
│   │       ├── creator-words.jpeg
│   │       ├── creator-customize.jpeg
│   │       ├── play-start.jpeg
│   │       ├── play-active.jpeg
│   │       ├── play-complete.jpeg
│   │       ├── dark-mode.jpeg
│   │       ├── mobile-play.jpeg
│   │       ├── about-after.jpeg
│   │       ├── loading-skeleton.jpeg
│   │       ├── 404-page.jpeg
│   │       ├── mobile-header.jpeg
│   │       ├── poster-download.jpeg
│   │       ├── legal-after.jpeg
│   │       ├── puzzle-preview.jpeg
│   │       ├── tooltip.jpeg
│   │       ├── toast-notification.jpeg
│   │       ├── hint-cooldown.jpeg
│   │       └── bonus-grid.jpeg
│   ├── before/
│   │   ├── outputs/
│   │   │   └── sample-puzzle.pdf (from before)
│   │   ├── recordings/
│   │   │   ├── Before_Website_Tour_I.mp4 (existing)
│   │   │   └── Before_Website_Tour_II.mp4 (existing)
│   │   └── screenshots/
│   │       ├── home-before.jpeg
│   │       ├── creator-before.jpeg
│   │       ├── about-before.jpeg
│   │       ├── legal-before.jpeg
│   │       └── (existing *.jpeg files)
│   └── comparisons/
│       ├── home-compare.png (side-by-side or overlay)
│       ├── creator-compare.png
│       └── mobile-compare.png
├── docs/
│   ├── 01-BEFORE_AFTER_COMPARISON_PLAN.md (existing)
│   ├── 02-COPILOT_USAGE_PLAN.md (existing)
│   ├── 03-PROJECT_EVOLUTION_STORY.md
│   ├── 04-SUBMISSION_EVIDENCE_PACKAGE.md
│   └── 05-DEV_ARTICLE_OUTLINE.md
├── reports/
│   ├── 01-FULL_PROJECT_AUDIT.md → 14-FINAL_EXECUTIVE_SUMMARY.md (existing + new)
└── README.md (existing)
```

---

### Screenshot Capture Guidelines

For consistency across all screenshots:

1. **Resolution**: 1920×1080 for desktop, 375×812 for mobile (iPhone X)
2. **Browser**: Chrome or Firefox with default zoom (100%)
3. **Theme**: Light mode for primary screenshots, dark mode for #9
4. **Format**: JPEG for screenshots (good quality, smaller size), PNG for comparisons
5. **No cropping**: Show full-page except where detail requires close-up
6. **Consistent state**: Use same data/configuration across before/after comparisons
7. **Before site note**: If the before Vercel preview (http 401) remains inaccessible, capture before screenshots by running `git checkout finishupathon-before && npm start` locally

### Recording Guidelines

1. **Resolution**: 1920×1080 at 30fps
2. **Duration**: Keep under 90 seconds per recording
3. **Format**: MP4 with H.264 codec
4. **Audio**: Optional voiceover or background music for the final submission video
5. **Mouse cursor**: Show cursor movements for clarity
6. **Highlight key interactions**: Pause briefly on important states (progress steps, completion, etc.)
7. **Before site**: Capture before-version recordings by running locally from the before branch
