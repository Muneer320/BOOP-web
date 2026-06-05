# Remaining Known Issues — BOOP 3.0

These are P2-level issues intentionally deferred. They do not block submission but would improve quality if time permits.

---

## P2 Issues (Low Priority, Good for Future Iteration)

### 1. Wake-up API call on every mount
- **File:** `App.js`
- **Issue:** `apiService.checkStatus()` fires on every app render. If API is down, logs error to console.
- **Fix:** Remove or guard with a flag to only run once per session.
- **Effort:** 5 minutes

### 2. Footer heading hierarchy skips levels
- **File:** `Footer.js`
- **Issue:** Brand name is `<h3>`, nav headings are `<h4>` but there's no `<h2>` between them.
- **Fix:** Change branding `<h3>` to `<div>` with `.footer-logo` class, or restructure heading levels.
- **Effort:** 5 minutes

### 3. Inline styles in PuzzleGame.js should be CSS classes
- **File:** `PuzzleGame.js` (around line 883)
- **Issue:** `style={{ cursor: "pointer" }}` used instead of CSS class.
- **Effort:** 10 minutes

### 4. No `loading="lazy"` on images
- **Files:** `Header.js` (logo), `FileUploader.js` (preview thumbnail)
- **Issue:** Images could defer loading with native `loading="lazy"`.
- **Effort:** 5 minutes

### 5. `forceTick` interval for cooldown UI
- **File:** `PuzzleGame.js` (line 509)
- **Issue:** `setInterval(() => forceTick(t => t + 1), 200)` forces re-render every 200ms during play. A ref-based approach would be more efficient.
- **Effort:** 30 minutes

### 6. PuzzleGame.js is 1192 lines
- **File:** `PuzzleGame.js`
- **Issue:** Extremely large component mixing start screen, play screen, complete screen, modals, canvas rendering.
- **Fix:** Split into smaller files (e.g., `PuzzleGameStart.js`, `PuzzleGamePlay.js`, `PuzzleGameComplete.js`, `PuzzleGamePoster.js`).
- **Effort:** 2-3 hours — **risky before submission**

### 7. Legal page data is inline JavaScript
- **Files:** `data/privacyData.js`, `data/termsData.js`
- **Issue:** Thousands of lines of legal text stored as JS objects. Hard to edit, no syntax highlighting benefit.
- **Fix:** Move to JSON files or markdown.
- **Effort:** 1 hour

### 8. `--shadow-md` is defined but used inconsistently
- **File:** `index.css` and various
- **Issue:** `Home.css` feature cards use `--shadow-md` on hover, but other cards don't use the same scale.
- **Effort:** 15 minutes

### 9. No favicon set beyond SVG
- **File:** `public/`
- **Issue:** Only SVG favicon. No multi-size favicon or manifest icons for all device types.
- **Effort:** 30 minutes

### 10. No automated frontend tests
- **File:** `App.test.js` (default CRA)
- **Issue:** No custom tests exist. Risk of regression on future changes.
- **Effort:** Several hours — out of scope for submission

---

## Summary

| Category | Count |
|----------|-------|
| Remaining P2 issues | 10 |
| Known non-issues (P3) | ~5 |
| **Total remaining** | **~15** |

All P0 (8/8) and P1 (10/10) issues have been fixed.
