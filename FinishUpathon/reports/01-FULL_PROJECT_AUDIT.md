# BOOP Web — Full Project Audit

**Date:** 2026-06-02 | **Version:** 0.1.0

---

## 1. Executive Summary

BOOP Web is a full-stack word search puzzle book generator (React SPA + Python FastAPI). It evolved from a CLI tool and is functional end-to-end but exhibits early-stage characteristics: monolithic components, no testing culture, no code splitting, and basic UX.

## 2. Strengths

| Area | Observation |
|------|-------------|
| **Concept** | Unique product — printable puzzle book generation with custom assets |
| **End-to-end flow** | Upload → Configure → Generate → Download works reliably |
| **Puzzle algorithms** | Word placement, masking, SVG/PDF output are sophisticated |
| **PDF assembly** | Multi-step (cover, title, puzzles, solutions) is feature-rich |
| **Loading animation** | Character grid spinner adds charm during generation wait |
| **Responsive CSS** | Media queries present for mobile adaptivity |
| **MIT License** | Open-source friendly |

## 3. Weaknesses

### Architecture
- No state management library — only `useContext` for generation state
- No routing code splitting — entire app is one bundle
- No service layer — backend route handlers import core logic directly
- `PuzzleCreator.js` — 402 lines, monolithic (data fetch, state, validation, navigation, rendering)
- `WordSelector.js` — 320 lines, manages 3 input modes with complex state
- Legal pages as React components: `PrivacyPolicy.js` (589 lines), `TermsOfService.js` (1020 lines)
- No TypeScript, no ESLint beyond CRA defaults, no Prettier

### Backend
- `appendImage.py` — 581 lines with 3 versions of `append_puzzle_page` (one commented)
- `generatePuzzle.py` — 783 lines, ~250 lines of commented-out dead code (PIL functions)
- No async/await — route handlers mix `async def` with synchronous blocking calls
- No database — everything file-based (words.txt, uploads/)

### Testing
- `App.test.js` — 1 test referencing "learn react" (doesn't exist in app)
- Zero backend tests, no E2E, no integration tests

### Deployment
- Single GitHub Actions workflow (basic deploy)
- `.env*` files committed to repo despite `.gitignore` pattern

## 4. Codebase Health Score: 5.5 / 10

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Organization | 5 | Some structure but no clear architecture |
| Code Duplication | 4 | Significant in backend |
| Component Reuse | 6 | FileUploader/LoadingOverlay are good, rest is coupled |
| Naming Consistency | 6 | Generally OK but CSS has 3 different conventions |
| Architecture | 4 | Tight coupling, fat components, no service layer |
| State Management | 5 | Context used minimally, rest is local state |
| Testing Coverage | 1 | One broken test |
| Documentation | 4 | Frontend README decent, Backend README **missing** |
| Error Handling | 4 | Basic try/catch, no global handler, no error boundary |

## 5. Known Issues (24 Total)

### 🔴 Critical (5)
| # | Issue | Category | Solution |
|---|-------|----------|----------|
| C1 | Re-download uses hardcoded `puzzle-book.pdf` not user title | UX | Pass `formData.name` into GenerationContext |
| C2 | No file size limit on upload | Security | Add `max_size` validation in `files.py` |
| C3 | `parseInt(value, 5)` — radix 5 (meant 10) | Bug | Change to `Number(value)` |
| C4 | CORS allows `localhost:3000` in production | Security | Use env variable for origins |
| C5 | No path traversal protection on `os.remove` | Security | Validate filenames, use `os.path.basename` |

### 🟠 High (8)
| # | Issue | Category |
|---|-------|----------|
| H1 | App.test.js tests non-existent text | Architecture |
| H2 | No puzzle preview before download | UX |
| H3 | No image preview after upload | UX |
| H4 | Success step (step 4) has no download button | UX |
| H5 | No generation progress indicator | UX |
| H6 | "Bonus Normal"/"Bonus Hard" terminology unexplained | UX |
| H7 | manifest.json still shows "Create React App Sample" | Product |
| H8 | Backend README.md does not exist | Docs |

### 🟡 Medium (10)
| # | Issue | Category |
|---|-------|----------|
| M1 | `react-dropzone` imported but unused (18 KB) | Maintainability |
| M2 | Legal pages bloated as React components | Architecture |
| M3 | ~250 lines dead code in `generatePuzzle.py` | Maintainability |
| M4 | 3 duplicate `append_puzzle_page` versions | Architecture |
| M5 | Upload cleanup runs in daemon thread, not scheduler | Architecture |
| M6 | No consistent ESLint config | Maintainability |
| M7 | No Prettier config | Maintainability |
| M8 | No TypeScript | Architecture |
| M9 | No loading skeletons (just "Loading..." text) | UX |
| M10 | No route-based code splitting | Performance |

### 🟢 Low (8)
| # | Issue | Category |
|---|-------|----------|
| L1 | No active nav indicator | UX |
| L2 | No dark mode | UX |
| L3 | No page transitions | UX |
| L4 | No skip-to-content link | A11y |
| L5 | Limited ARIA attributes | A11y |
| L6 | No keyboard nav for topic grid | A11y |
| L7 | No favicon variants | Product |
| L8 | Footer shows only current year, no range | Product |

## 6. Technical Debt Summary

- **Dead code:** ~300 lines (PIL functions in generatePuzzle.py, commented appendImage variants)
- **Config sprawl:** Settings hardcoded in settings.py, templates from filesystem
- **Security:** CORS misconfig, no file size limits, path traversal risk
- **Monolith:** PuzzleCreator.js does everything (402 lines)

## 7. Modernization Opportunities

| Opportunity | Effort | Impact |
|-------------|--------|--------|
| React.lazy + Suspense for route splitting | Low | High |
| Extract legal pages to Markdown | Low | Medium |
| Add Tailwind CSS or CSS Modules | Medium | High |
| Add puzzle preview (canvas/SVG) | Medium | Very High |
| Add TypeScript incrementally | High | Very High |
| Migrate backend to async processing | High | High |
| Add database (SQLite for MVP) | High | High |

---

## Files Referenced in This Audit

- `frontend/src/components/PuzzleCreator.js` — 402 lines
- `frontend/src/components/WordSelector.js` — 320 lines
- `frontend/src/components/pages/PrivacyPolicy.js` — 589 lines
- `frontend/src/components/pages/TermsOfService.js` — 1020 lines
- `backend/boop/generatePuzzle.py` — 783 lines
- `backend/boop/appendImage.py` — 581 lines
- `frontend/src/App.test.js` — 1 broken test
- `frontend/public/manifest.json` — CRA defaults
