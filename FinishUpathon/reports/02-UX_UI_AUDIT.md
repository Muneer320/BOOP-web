# BOOP Web — UX & UI Audit

**Date:** 2026-06-02

---

## 1. User Journey Friction Points

| Step | Friction | Severity |
|------|----------|----------|
| **Homepage** | No immediate "how to start" guidance beyond CTA | Low |
| **Create Page Load** | "Loading..." bare text — no skeleton or shimmer | Medium |
| **Step 1: Settings** | Title validation is reactive but error appears globally, not inline | Medium |
| **Step 1: Settings** | No tooltips — "Bonus Normal" / "Bonus Hard" unexplained | High |
| **Step 2: Words** | No search/filter in topic grid | Low |
| **Step 2: Custom Words** | Must type 1 word at a time; no bulk paste | Medium |
| **Step 2: File Upload** | Only `.txt` format allowed; no validation feedback | Low |
| **Step 3: Images** | **No image preview after upload** — only filename shown | High |
| **Generation** | Loading overlay charming but **no progress bar/ETA** | Medium |
| **Step 4: Success** | **No download button** — only "Create Another". Download hidden in toast | High |
| **Re-download** | Toast uses **hardcoded filename** `puzzle-book.pdf` not user's title | High |

## 2. Pain Points Summary

1. **No puzzle preview** — Users can't see what they'll get before download
2. **No image preview** — Uploaded images invisible in UI
3. **Bonus mode confusing** — "Bonus Normal"/"Bonus Hard" unexplained
4. **Success screen broken** — Step 4 has no download button; only "Create Another"
5. **Download filename inconsistency** — Original uses `formData.name.pdf`, re-download uses `puzzle-book.pdf`
6. **No progress during generation** — Users don't know if 10% or 90% done
7. **Error feedback is global** — Not inline per field

## 3. Visual Consistency

- **Font:** Nunito (Google Fonts) — clean, modern
- **Colors:** Defined as CSS variables, generally consistent
- **Issues:**
  - CSS class naming uses 3 conventions (BEM-like, kebab-case, flat)
  - Card styling has inconsistent padding/shadows
  - Only danger alert style used; no info/warning/success variants
  - Some Tailwind-like classes mixed with custom CSS in legal pages

## 4. Responsive & Mobile

| Area | Status |
|------|--------|
| Hamburger menu | ✅ Works with smooth animation |
| Form stacks vertically | ✅ Good |
| Feature grid → single column | ✅ Good |
| Generation toast full-width on mobile | ✅ Acceptable |
| Touch targets | ⚠️ Could be larger |
| Swipe gestures for form steps | ❌ Not present |
| Progress bar wraps on very small screens | ⚠️ Minor |

## 5. Accessibility Issues

| Issue | Severity |
|-------|----------|
| No skip-to-content link | High |
| No `aria-expanded` on hamburger toggle | Medium |
| No keyboard nav for topic grid items | Medium |
| Color contrast: `--gray` (#6c757c) on white may fail WCAG AA | Medium |
| No screen-reader announcements for loading/status | Medium |
| No `reduced-motion` media query for animations | Low |
| No focus indicators beyond browser defaults | Medium |

## 6. Empty & Loading States

- **Initial load:** Bare "Loading..." text in card
- **Word loading:** "Loading words..." italic text
- **Generation:** Animated letter grid with cycling quotes (no progress)
- **Image upload:** "Uploading..." text only
- **No topics loaded:** Empty grid area — no illustration
- **No custom words:** Empty area with input fields only
- **No generated output:** Success icon only on step 4, no preview

## 7. Confusing Interactions

- **Word selection modes** are mutually exclusive but not clearly explained
- **Bonus puzzle counts** — Users may not understand "bonus" purpose
- **File upload toggle** "Use default" is subtle, may go unnoticed
- **Closing generation status** reloads the page (destructive, jarring)
- **No reset button** on create page; must navigate away and back

## 8. End-to-End Flow Recording Notes

**Recording file:** `assets/before/recordings/Before_Website_Tour.mp4`

| Segment | Observed |
|---------|----------|
| Open site → Hero loads with grid | ✅ Smooth |
| Click "Create Puzzle" → Page loads | ⚠️ "Loading..." text for ~2-3s (API cold start) |
| Fill settings → Navigate steps | ✅ Functional |
| Select topic → Words load | ✅ ~1s fetch |
| Upload cover image → Filename shown | ❌ No preview |
| Click Generate → LoadingOverlay appears | ✅ Charming animation |
| Wait ~18s (medium config) → PDF downloads | ❌ No progress |
| Success screen shows | ❌ No download button |
| Toast "Download Again" | ❌ Wrong filename |

**Cumulative UX Score: 5/10**
