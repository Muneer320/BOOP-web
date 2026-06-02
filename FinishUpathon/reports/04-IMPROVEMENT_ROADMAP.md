# BOOP Web — Improvement Roadmap

**Date:** 2026-06-02 | **Goal:** Maximize Finish-Up-A-Thon impression

---

## HIGH IMPACT — Strong Presentation Value

| # | Improvement | Complexity | Visual Impact | Challenge Value |
|---|-------------|------------|---------------|-----------------|
| 1 | **Live Puzzle Preview** (SVG/Canvas before download) | High | ★★★★★ | ★★★★★ |
| 2 | **Image Upload Previews** (thumbnails after upload) | Low | ★★★★☆ | ★★★★☆ |
| 3 | **Dark Mode Toggle** (persistent theme switch) | Medium | ★★★★☆ | ★★★★☆ |
| 4 | **Skeleton Loading States** (replace "Loading..." text) | Low | ★★★★☆ | ★★★★☆ |
| 5 | **Page Transitions** (between routes and form steps) | Medium | ★★★★☆ | ★★★★☆ |
| 6 | **Generation Progress Bar** (percentage/steps) | Medium | ★★★☆☆ | ★★★★★ |
| 7 | **Success Screen Redesign** (download btn + preview) | Low | ★★★★★ | ★★★★☆ |
| 8 | **Animated Logo / Brand Refresh** (letter grid effect) | Medium | ★★★★☆ | ★★★★☆ |

## MEDIUM IMPACT — Solid Enhancements

| # | Improvement | Complexity | Visual Impact |
|---|-------------|------------|---------------|
| 9 | Route-based code splitting (React.lazy) | Low | ☆☆☆☆☆ |
| 10 | Fix download filename inconsistency | Low | ★★☆☆☆ |
| 11 | TypeScript migration (incremental) | High | ☆☆☆☆☆ |
| 12 | Add tooltips/help for bonus modes | Low | ★★★☆☆ |
| 13 | Active nav indicator | Low | ★★☆☆☆ |
| 14 | Larger touch targets (mobile) | Low | ★★★☆☆ |
| 15 | Add keyboard shortcuts | Low | ★★☆☆☆ |
| 16 | Bulk paste for custom words | Medium | ★★★☆☆ |
| 17 | Improve mobile progress bar | Low | ★★☆☆☆ |

## LOW IMPACT — Polish

| # | Improvement | Complexity |
|---|-------------|------------|
| 18 | Fix App.test.js | Low |
| 19 | Update manifest.json | Low |
| 20 | Remove unused react-dropzone | Low |
| 21 | Add favicon variants | Low |
| 22 | Add skip-to-content link | Low |
| 23 | Add ARIA attributes | Medium |
| 24 | Add Prettier config | Low |
| 25 | Extract legal pages to Markdown | Medium |

## AVOID — Overscoped for Challenge

| Item | Reason |
|------|--------|
| Database migration | No visual payoff, too risky |
| Full auth system | Over-engineered for current use |
| WebSocket real-time gen | Significant backend changes |
| CRA → Vite migration | Risky during challenge |
| Full WCAG 2.1 compliance | Noble but too broad |

## Suggested Challenge Approach

### Phase 1 (Foundation — ~30% time)
1. Code splitting + performance fixes
2. Fix critical bugs (parseInt, download filename, CORS)
3. Skeleton loading states

### Phase 2 (Visual Transformation — ~50% time)
4. **Puzzle preview** — biggest UX gap
5. **Dark mode** — strong before/after
6. **Image previews** — quick win
7. **Success page redesign** — closes the loop

### Phase 3 (Polish — ~20% time)
8. Page transitions
9. Tooltips & help text
10. Active nav indicator
11. Favicon & manifest updates
