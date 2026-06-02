# Before / After Comparison Plan

**Date:** 2026-06-02

---

## 1. Metrics to Compare

| Metric | Before | After Target | Tool |
|--------|--------|-------------|------|
| Lighthouse Perf (Desktop) | 65 | 85+ | Lighthouse |
| Lighthouse Perf (Mobile) | 38 | 65+ | Lighthouse |
| Lighthouse A11y | 75 | 90+ | Lighthouse |
| JS Bundle (gzipped) | 187 KB | <100 KB | Source map explorer |
| FCP (Desktop) | 1.8s | <1.2s | Lighthouse |
| LCP (Desktop) | 3.2s | <2.0s | Lighthouse |
| Generation Time (Medium) | ~18s | TBD (backend) | Console |
| Tests | 1 broken | 20+ passing | Jest |
| Puzzle Preview | None | Live SVG | Visual |
| Dark Mode | None | Full toggle | Visual |

## 2. Screenshots to Recreate (Same Conditions)

| Before (`assets/before/screenshots/`) | After (`assets/after/screenshots/`) |
|---------------------------------------|-------------------------------------|
| `Before_Web_LandingPage.jpeg` | `After_Web_LandingPage.jpeg` |
| `Before_Web_PuzzleCreationPage.jpeg` | `After_Web_PuzzleCreationPage.jpeg` |
| `Before_Web_PuzzleCreating.jpeg` | `After_Web_PuzzleCreating.jpeg` |
| `Before_Web_PuzzleLoading.jpeg` | `After_Web_PuzzleLoading.jpeg` |
| `Before_Phone_LadingPage.png` | `After_Phone_LandingPage.png` |
| `Before_Phone_LandingPageFull.jpeg` | `After_Phone_LandingPageFull.jpeg` |
| `Before_Phone_Menu.jpeg` | `After_Phone_Menu.jpeg` |
| `Before_Phone_AboutPage.jpeg` | `After_Phone_AboutPage.jpeg` |
| `Before_Phone_PuzzleGenerated.jpeg` | `After_Phone_PuzzleGenerated.jpeg` |

**Bonus after-only:** Dark mode screenshots, puzzle preview, success page redesign.

## 3. Recording to Recreate

| Before | After |
|--------|-------|
| `assets/before/recordings/Before_Website_Tour.mp4` | `assets/after/recordings/After_Website_Tour.mp4` |

Use same config (5N, 2H, 1BN, 1BH, two topics) for fair comparison.

## 4. Strongest Visual Before/After Candidates

| Feature | Before | After | Narrative |
|---------|--------|-------|-----------|
| Puzzle Preview | None | Live SVG | "From blind download to confident creation" |
| Image Uploads | Filename text | Thumbnails | "From invisible to visual" |
| Loading | "Loading..." text | Shimmer skeletons | "From 90s to modern" |
| Dark Mode | Light only | Elegant dark | "From one-size to user choice" |
| Success Page | Generic check | Rich success + preview | "From anti-climax to celebration" |
| Bundle Size | 187 KB | <100 KB | Performance transformation |

## 5. DEV.to Blog Structure

1. **The Before:** Screenshots, pain points, Lighthouse 38/100
2. **The Audit:** 24 issues across UX, perf, architecture
3. **The Strategy:** Prioritize for max impact
4. **The After:** Side-by-side comparisons + new Lighthouse scores
5. **Key Learnings:** What worked, what to improve
6. **The Numbers:** Before → After table
7. **Copilot Role:** Where AI accelerated the work
