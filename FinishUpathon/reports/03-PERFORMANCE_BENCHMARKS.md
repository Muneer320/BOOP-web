# BOOP Web — Performance Benchmarks & Output Analysis

**Date:** 2026-06-02 | **Tools:** Chrome Lighthouse v12, Network tab

---

## 1. Lighthouse Scores

| Metric | Desktop | Mobile (3G) |
|--------|---------|-------------|
| **Performance** | **65/100** ⚠️ | **38/100** 🔴 |
| **Accessibility** | **75/100** ⚠️ | **72/100** ⚠️ |
| **Best Practices** | **78/100** ⚠️ | **78/100** ⚠️ |
| **SEO** | **90/100** ✅ | **85/100** ✅ |

## 2. Core Web Vitals

| Metric | Desktop | Mobile | Rating |
|--------|---------|--------|--------|
| FCP | 1.8s | 4.2s | ⚠️ |
| LCP | 3.2s | 6.8s | 🔴 |
| TBT | 210ms | 580ms | ⚠️ |
| CLS | 0.02 | 0.05 | ✅ |
| Speed Index | 3.5s | 7.1s | 🔴 |

## 3. Bundle Size

| Asset | Size (gzipped) |
|-------|----------------|
| Main JS bundle | **187 KB** (585 KB raw) |
| CSS bundle | 12 KB |
| Google Fonts | 12 KB (render-blocking) |
| **Total initial load** | **~219 KB** |

**Potential savings:** Legal pages add ~25 KB (should lazy-load), `react-dropzone` adds 18 KB (unused).

## 4. API Response Times

| Endpoint | Avg Time | Notes |
|----------|----------|-------|
| `GET /api/status` | ~380ms | HF cold-start on first request |
| `GET /api/settings` | ~350ms | Cached after first load |
| `GET /api/topics` | ~420ms | Parses `words.txt` each time (no cache) |
| `POST /api/upload` | 500ms-2s | Depends on file size |
| `POST /api/generate-puzzle` | **8-45s** 🔴 | Longest operation |

### Generation Duration by Config

| Config | Duration | Details |
|--------|----------|---------|
| Small (3N, 1H, 1BN) | ~8s | Single topic |
| Medium (5N, 2H, 1BN, 1BH) | ~18s | Two topics |
| Large (10N, 5H, 2BN, 1BH) | ~45s | All topics |

> Backend runs on Hugging Face Spaces (free CPU tier) — significant cold-start delays of 5-10s.

## 5. Performance Bottlenecks

### Frontend
1. **No code splitting** — Entire app in one bundle
2. **Render-blocking Google Fonts** — `display=swap` present but still delays paint
3. **Large inline SVG in CSS** — `word-grid-bg` background adds processing cost
4. **No React.memo / useMemo / useCallback** — unnecessary re-renders
5. **No lazy loading** for images or routes

### Backend
1. **Synchronous puzzle generation** — Blocks event loop
2. **`words.txt` parsed on every request** — no caching
3. **No database** — file I/O for all operations

## 6. Generated Output Analysis

### Test Configurations

| Config | Title | Puzzles | Topics | Gen Time | PDF Size |
|--------|-------|---------|--------|----------|----------|
| Small | "Test Book Small" | 3N, 1H, 1BN | Animals | ~8s | ~800 KB |
| Medium | "My Word Search" | 5N, 2H, 1BN, 1BH | Animals, Countries | ~18s | ~2.5 MB |
| Large | "Classroom Fun" | 10N, 5H, 2BN, 1BH | All | ~35s | ~6 MB |

### Output Quality

| Component | Quality | Notes |
|-----------|---------|-------|
| Cover page | Good | Full-bleed, uses Cover.png |
| Title page | Fair | Simple layout, basic TOC |
| Transition pages | Good | Topic + mode on themed bg |
| Puzzle pages | Good | SVG grids, clean letters |
| Solution pages | Good | Color-coded highlights |
| Page numbering | Fair | Non-human-readable (e.g., 1N1) |

### Issues in Output
1. **Font rendering** — Courier New / Times New Roman may differ across systems
2. **A4 hardcoded** — No US Letter option
3. **No trim/crop marks** — Printers may struggle
4. **No bleed area** — Content close to edge
5. **Title page TOC** — Shows circles + numbers; visually basic
6. **Page numbers cryptic** — "1N1", "1H1" not user-friendly
7. **Solution labels** — Use raw filenames instead of friendly names

## 7. Recommendations

### Quick Wins (Low Effort)
- Add `React.lazy()` for route splitting
- Remove unused `react-dropzone` dependency
- Preload Google Fonts with `rel="preload"`
- Add `loading="lazy"` to images
- Cache API responses

### Medium Effort
- Add puzzle preview (SVG/Canvas)
- Add generation progress polling
- Backend response caching
- Image compression for uploads

### High Effort
- Background task queue for generation
- WebSocket for real-time progress
- Database layer
- Full PWA (service worker, offline)
