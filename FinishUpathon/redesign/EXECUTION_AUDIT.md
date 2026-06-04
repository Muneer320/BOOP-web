# BOOP 3.0 — Execution Audit

## Current Codebase → Planned Implementation Mapping

---

## 1. CSS / Design System

| Current File | Current State | Planned Change | Effort | Dependencies | Risk |
|---|---|---|---|---|---|
| `frontend/src/index.css` | Warm palette, serif fonts, basic design tokens | Replace CSS variables with refined palette, add paper texture, update typography stack, refine borders/shadows/radius | 2h | None | Low — pure CSS, no logic change |
| `frontend/src/App.css` | Layout, spinner, skeleton, utility classes, legal/404 | Refine spacing, update colors to new variables, add page transition | 1h | index.css update | Low |

## 2. Global Components

| Component | File(s) | Current State | Planned Change | Effort | Dependencies | Risk |
|---|---|---|---|---|---|---|
| **Header** | `Header.js`, `Header.css` | Sticky header, "BOOP Web" logo, nav with Home/Create/Play/About, hamburger menu | Refine: update logo text to "BOOP", update nav links, refine double-border styling, improve mobile menu | 2h | index.css, new logo SVG | Low |
| **Footer** | `Footer.js`, `Footer.css` | Simple footer with copyright, GitHub, legal links | Refine: better layout, move GitHub to secondary, add tagline, refine styling | 1h | index.css | Low |
| **ThemeToggle** | `ThemeToggle.js`, `ThemeToggle.css` | Sun/moon button | Keep but refine styling for new palette | 0.5h | index.css | Low |

## 3. Landing Page

| Component | File(s) | Current State | Planned Change | Effort | Dependencies | Risk |
|---|---|---|---|---|---|---|
| **Home / Landing** | `Home.js`, `Home.css` | Hero with puzzle grid + word list, features grid, how-it-works steps, CTA | Complete hero redesign (editorial headline, book mockup, ambient letter grid), refined features, better how-it-works, add social proof section | 4h | index.css, new CSS variables, hero mockup asset | Medium |
| **Hero Section** | in Home.js | Two-column: text left, puzzle grid right | New: editorial headline with serif display, animated letter grid background, book mockup visual, stacked CTAs | 2h | index.css, ambient letter grid SVG | Medium |
| **Features Section** | in Home.js, Home.css | 3-column grid with 5 feature cards | Refine: keep 3-column, update icons, better descriptions, add hover animations | 1.5h | index.css, new icon set | Low |
| **How It Works** | in Home.js, Home.css | 4-step horizontal with step circles | Refine: keep steps, refine styling, add small illustrations per step | 1h | index.css | Low |

## 4. Creation Flow

| Component | File(s) | Current State | Planned Change | Effort | Dependencies | Risk |
|---|---|---|---|---|---|---|
| **PuzzleCreator** | `PuzzleCreator.js`, `PuzzleCreator.css` | 4-step wizard with progress indicator, form panels, preview sidebar | Flatten to single-page: collapsible sections, live preview panel, smart defaults, refined progress | 6h | index.css, PuzzlePreview, all sub-components | High — most complex change |
| **PuzzlePreview** | `PuzzlePreview.js`, `PuzzlePreview.css` | SVG grid of random letters (decorative only) | Transform into live book preview: show actual puzzle content, page navigation, real-time updates | 4h | Generation context, API data | High |
| **WordSelector** | `WordSelector.js`, `WordSelector.css` | Topic toggle, custom words input, file upload | Keep logic, refine styling for new design system | 2h | index.css | Low |
| **FileUploader** | `FileUploader.js`, `FileUploader.css` | File upload with preview | Keep logic, refine styling, add better visual feedback | 1.5h | index.css | Low |
| **PuzzleDetails** | `PuzzleDetails.js`, `PuzzleDetails.css` | Sidebar summary card | Refine styling, make preview interactive | 1h | index.css | Low |
| **LoadingOverlay** | `LoadingOverlay.js`, `LoadingOverlay.css` | Animated letter grid + 8-step progress list | Simplify: book assembly visualization, clean progress indicator, remove overwhelming grid | 3h | index.css, book animation CSS | Medium |
| **GenerationStatus** | `GenerationStatus.js`, `GenerationStatus.css` | Floating bottom status bar | Unify with LoadingOverlay or refine as standalone toast | 1h | index.css | Low |

## 5. Play Mode

| Component | File(s) | Current State | Planned Change | Effort | Dependencies | Risk |
|---|---|---|---|---|---|---|
| **PuzzleGame** | `PuzzleGame.js`, `PuzzleGame.css` | Full interactive word search | Refine styling for new design system, improve touch support | 2h | index.css | Low |
| **PlayArea** | `PlayArea.js` | Wrapper component | Minimal changes | 0.5h | PuzzleGame | Low |

## 6. Other Pages

| Component | File(s) | Current State | Planned Change | Effort | Dependencies | Risk |
|---|---|---|---|---|---|---|
| **About** | `About.js`, `About.css` | Static info page | Refine styling, improve layout | 1h | index.css | Low |
| **NotFound** | `NotFound.js` | 404 with navigation | Add puzzle-themed 404 charm | 1h | index.css | Low |
| **LegalPage** | `LegalPage.js` | Structured legal renderer | Minimal styling updates | 0.5h | index.css | Low |
| **PrivacyPolicy / TermsOfService** | `pages/PrivacyPolicy.js`, `pages/TermsOfService.js` | Pass data to LegalPage | No changes needed | 0h | None | None |

## 7. Core Infrastructure

| File | Current State | Planned Change | Effort | Dependencies | Risk |
|---|---|---|---|---|---|
| `App.js` | Routes, providers, layout | Add page transition animations, refine layout | 1h | CSS | Low |
| `ThemeContext.js` | Light/dark toggle | Update dark mode colors to new palette | 0.5h | index.css | Low |
| `GenerationContext.js` | PDF generation state machine | No functional changes needed | 0h | None | None |
| `api.js` | Axios API service | No changes needed | 0h | None | None |

## 8. Assets

| Asset | Current | Planned | Effort | Dependencies | Risk |
|---|---|---|---|---|---|
| `assets/logo.png` | PNG logo | Replace with SVG wordmark | 1h | SVG asset | Low |
| `assets/logo.svg` | SVG logo | Replace with refined wordmark | 1h | SVG design | Low |
| `Logo.svg` (root) | SVG logo | Replace | 0.5h | SVG asset | Low |
| Icons | None (inline SVGs) | Add Phosphor icon library or custom SVG icon component | 2h | None | Low |
| Textures | None | Add CSS-based paper texture to backgrounds | 0.5h | index.css | Low |

---

## Summary

| Category | Files | Total Effort |
|---|---|---|
| CSS / Design System | 2 | 3h |
| Global Components | 4 | 3.5h |
| Landing Page | 1 (+ CSS) | 4h |
| Creation Flow | 6 | 16.5h |
| Play Mode | 2 | 2.5h |
| Other Pages | 4 | 2.5h |
| Core Infrastructure | 3 | 1.5h |
| Assets | 5 | 5h |
| **Total** | **27 files** | **~38h** |

## Risk Areas

1. **PuzzleCreator flattening** (6h) — highest risk due to complexity and state management changes
2. **Live PuzzlePreview** (4h) — requires coordination with backend or smart client-side simulation
3. **LoadingOverlay redesign** (3h) — needs book assembly animation which requires creative implementation
