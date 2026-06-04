# BOOP 3.0 — Implementation Queue

---

## Sprint 1: Highest Visual Impact (Days 1-2)

| # | Task | Files | Hours | Visual Impact | Blocker | Depends On |
|---|---|---|---|---|---|---|
| 1.1 | CSS variable migration — new palette, typography, spacing, shadows, radius | `index.css` | 2h | ★★★★★ | None | None |
| 1.2 | Paper texture background | `index.css` | 0.5h | ★★★★ | CSS variables done | 1.1 |
| 1.3 | Header redesign — logo, nav, double-border | `Header.js`, `Header.css` | 2h | ★★★★★ | CSS done, logo SVG | 1.1 |
| 1.4 | Footer redesign — layout, tagline, links | `Footer.js`, `Footer.css` | 1h | ★★★ | CSS done | 1.1 |
| 1.5 | Theme toggle styling update | `ThemeToggle.js`, `ThemeToggle.css` | 0.5h | ★★ | CSS done | 1.1 |
| 1.6 | App.css — layout, spacing, transitions | `App.css` | 1h | ★★★ | CSS done | 1.1 |

**Sprint 1 Total: 7h**

---

## Sprint 2: Highest UX Impact (Days 3-5)

| # | Task | Files | Hours | UX Impact | Blocker | Depends On |
|---|---|---|---|---|---|---|
| 2.1 | Landing page hero redesign | `Home.js`, `Home.css` | 3h | ★★★★★ | CSS done, mockup asset | 1.1 |
| 2.2 | Features section styling update | `Home.css` | 1h | ★★★ | Hero done | 2.1 |
| 2.3 | How-It-Works section refinement | `Home.js`, `Home.css` | 1h | ★★★ | Hero done | 2.1 |
| 2.4 | Add social proof section | `Home.js`, `Home.css` | 1.5h | ★★★★ | Hero done | 2.1 |
| 2.5 | PuzzleCreator — flatten to single page | `PuzzleCreator.js`, `PuzzleCreator.css` | 6h | ★★★★★ | CSS done | 1.1 |
| 2.6 | PuzzlePreview — live preview component | `PuzzlePreview.js`, `PuzzlePreview.css` | 4h | ★★★★★ | Creator structure done | 2.5 |
| 2.7 | WordSelector — styling refinement | `WordSelector.js`, `WordSelector.css` | 1.5h | ★★★ | CSS done | 1.1 |
| 2.8 | FileUploader — styling refinement | `FileUploader.js`, `FileUploader.css` | 1h | ★★ | CSS done | 1.1 |
| 2.9 | PuzzleDetails — styling refinement | `PuzzleDetails.js`, `PuzzleDetails.css` | 0.5h | ★★ | CSS done | 1.1 |

**Sprint 2 Total: 19.5h**

---

## Sprint 3: Polish & Delight (Days 6-8)

| # | Task | Files | Hours | Delight | Blocker | Depends On |
|---|---|---|---|---|---|---|
| 3.1 | LoadingOverlay redesign — book assembly | `LoadingOverlay.js`, `LoadingOverlay.css` | 3h | ★★★★★ | Creator done | 2.5 |
| 3.2 | GenerationStatus — unify or toast | `GenerationStatus.js`, `GenerationStatus.css` | 1h | ★★★ | Loader done | 3.1 |
| 3.3 | Success screen — stamp celebration | `PuzzleCreator.js`, `PuzzleCreator.css` | 2h | ★★★★★ | Creator done | 2.5 |
| 3.4 | PuzzleGame — styling refinement | `PuzzleGame.js`, `PuzzleGame.css` | 2h | ★★★ | CSS done | 1.1 |
| 3.5 | PlayArea — minimal updates | `PlayArea.js` | 0.5h | ★ | Game done | 3.4 |
| 3.6 | About page — styling update | `About.js`, `About.css` | 1h | ★★ | CSS done | 1.1 |
| 3.7 | NotFound — puzzle-themed 404 | `NotFound.js` | 1h | ★★★ | CSS done | 1.1 |
| 3.8 | Legal pages — styling | `LegalPage.js` | 0.5h | ★ | CSS done | 1.1 |
| 3.9 | Animations — scroll reveals, hover states, page transitions | `index.css`, `App.css`, components | 2h | ★★★★ | All components done | All above |
| 3.10 | Accessibility pass — focus states, ARIA, reduced motion | All | 1.5h | ★★★ | All done | All above |

**Sprint 3 Total: 14.5h**

---

## Parallel Tasks (Assets, Can Be Done During Any Sprint)

| # | Task | Hours | Dependencies |
|---|---|---|---|
| A1 | Phosphor icons integration (or inline SVG component) | 2h | None |
| A2 | Logo SVG creation/replacement | 1h | None |
| A3 | Book mockup screenshots from actual output | 1h | Backend running |
| A4 | Template mockup images | 1.5h | Backend running |
| A5 | Empty state illustrations (SVG inline components) | 3h | None |
| A6 | Step illustrations for How-It-Works | 2h | None |
| A7 | Favicon update | 0.5h | Logo done |
| A8 | Google Fonts import + preloading | 0.5h | None |

**Assets Total: 11.5h (parallel)**

---

## Grand Total

| Phase | Hours |
|---|---|
| Sprint 1: Visual | 7h |
| Sprint 2: UX | 19.5h |
| Sprint 3: Polish | 14.5h |
| Assets (parallel) | 11.5h |
| **Total estimated** | **~41h (excl. assets in parallel)** |
| **With assets** | **~52h** |
| **Calendar (assuming 6h/day)** | **8-9 days** |
