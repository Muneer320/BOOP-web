# BOOP 3.0 — Information Architecture

---

## Current Flow

```
Landing (/) → Create (/create) → GAME -> PDF
              About (/about)
              Play (/play)
              Privacy (/privacy-policy)
              Terms (/terms-of-service)
              404 (catch-all)
```

### Current Pages Audit

| Page | Exists? | Purpose | Verdict |
|---|---|---|---|
| Home (`/`) | Yes | Landing page, hero, features, how-it-works | **REDESIGN** — needs complete overhaul |
| Create (`/create`) | Yes | 4-step puzzle generation wizard | **REDESIGN** — flatten, modernize |
| Play (`/play`) | Yes | Interactive word search game | **IMPROVE** — UI polish, add features |
| About (`/about`) | Yes | Project info, tech stack | **REDESIGN** — make it a showcase, not an info page |
| Privacy Policy (`/privacy-policy`) | Yes | Legal content | **KEEP** — necessary, keep simple |
| Terms of Service (`/terms-of-service`) | Yes | Legal content | **KEEP** — necessary, keep simple |
| 404 (`*`) | Yes | Catch-all not-found | **IMPROVE** — add charm, navigation |
| Dashboard | No | User hub for managing creations | **ADD** — critical for returning users |
| Templates | No | Browse template gallery | **ADD** — quick-start for new users |
| Puzzle Preview | No | Full book preview before download | **ADD** — reduce uncertainty |

---

## Proposed Flow (Immediate)

```
                    ┌─────────────────────────────────────┐
                    │              HEADER                  │
                    │  [BOOP]  Create  Play  Templates     │
                    └─────────────────────────────────────┘
                                         │
     ┌─────────────┬────────────────────┬─┴──────────┬─────────────┐
     ▼             ▼                    ▼            ▼             ▼
  Landing (/)   Create (/create)    Play (/play)  Templates     About (/about)
  (Hero,         (Single-page        (Interactive  (/templates)  (Showcase,
   Features,      creation hub,       puzzle game)  (Gallery of    Team, Story,
   Showcase,      real-time                          puzzle book   Tech)
   Testimonials)  preview)                           templates)
                                         │
     ┌─────────────┬────────────────────┬┘
     ▼             ▼                    ▼
  Privacy        Terms                404
  (/privacy)     (/terms)             (Charming not-found)
```

---

## Ideal Flow (Future)

```
                    ┌─────────────────────────────────────┐
                    │         HEADER (Authenticated)       │
                    │  [BOOP]  Dashboard  Create  Library  │
                    └─────────────────────────────────────┘
                                         │
     ┌─────────────┬────────────────────┬─┴──────────┬─────────────┐
     ▼             ▼                    ▼            ▼             ▼
  Landing (/)   Dashboard            Create        Library       Community
  (Marketing,    (/dashboard)         (/create)     (/library)    (/community)
   Sign-up)      (My Books,            (Quick-start, (Saved          (Gallery,
                 Recent, Stats)        Custom,       books,          Shared
                                       Templates)    Templates)      puzzles)
```

---

## Page-by-Page Recommendations

### Landing Page (`/`)
**Current:** Basic hero + features grid + how-it-works + CTA
**Issue:** Not compelling. No social proof. No visual showcase.
**Action:** Complete redesign (see LANDING_PAGE_MASTERPLAN.md)

### Create Page (`/create`)
**Current:** 4-step linear wizard inside a card, side panel for details
**Issues:**
- Linear flow is restrictive
- No real-time preview of the book
- "PuzzleDetails" sidebar is static and ignored
- File upload UX is confusing
- No ability to save drafts
**Action:** Redesign as a single-page creation studio with expandable sections, live preview, smart defaults, and progressive disclosure for advanced options.

### Play Page (`/play`)
**Current:** Functional puzzle game with start screen, play screen, complete screen
**Issues:**
- UI is functional but not polished
- No persistence for ongoing games
- Limited puzzle types
- No scoreboard or challenge system
**Action:** UI refresh, add local persistence, add puzzle statistics, add sharing.

### About Page (`/about`)
**Current:** Static info page about the project
**Issue:** Reads like a README, not a brand story
**Action:** Redesign as a brand showcase — story, team, technology, roadmap. Make it inspire confidence, not just convey information.

### Templates (NEW PAGE) (`/templates`)
**Purpose:** Show pre-made puzzle book templates users can start from
**Content:** Grid of template cards (theme, difficulty, page count, preview)
**Action:** Add as a low-effort, high-impact new page.

### Dashboard (NEW PAGE) (`/dashboard`)
**Purpose:** Central hub for managing creations (requires auth/browser storage)
**Content:** Recent books, saved drafts, quick-create, stats
**Priority:** Medium (requires backend work)

### Privacy / Terms
**Current:** Good implementation with structured data
**Action:** Keep as-is, maybe restyle to match new design system.

### 404 Page
**Current:** Basic page with navigation links
**Action:** Add personality — puzzle-themed 404, "These puzzles don't exist!"

---

## Navigation Restructure

### Current
```
[BOOP Web]  Home  Create Puzzle  Play  About  [Theme Toggle]
```

### Proposed (Desktop)
```
[BOOP wordmark]  Create  Play  Templates  About  [Theme Toggle]
```

### Proposed (Mobile)
```
[BOOP icon]  [Hamburger → Create, Play, Templates, About, Theme Toggle]
```

### Why Remove "Home"?
"Home" is implied by clicking the logo. Remove it to reduce clutter and emphasize CTA actions (Create, Play).

### Why Add "Templates"?
Templates reduce friction for new users. It's a top-5 action that's currently missing.

---

## Content Consolidation

| Current | Proposed | Rationale |
|---|---|---|
| 4 separate wizard steps | Single creation hub with expandable panels | Reduce clicks, show all options at once |
| PuzzleDetails sidebar | Integrated preview panel | Sidebar is ignored; preview is more useful |
| LoadingOverlay + GenerationStatus | Unified progress experience | Two progress indicators is confusing |
| Separate Privacy/Terms pages | Keep separate (legal requirement) | No change needed |
| About as README | About as brand story | Builds trust, not just info |
