# BOOP 3.0 — Component Migration Plan

---

## 1. index.css — Design System Root

**Current State:** 278 lines. CSS variables for colors, typography, basic components (buttons, cards, forms, alerts). Keyframe animations. Responsive breakpoints.

**Target State:** Complete design token system with refined palette, 4-font typography stack, 8px spacing grid, print-inspired shadows, minimal border-radius, paper texture background.

**Implementation Notes:**
- Preserve existing variable names where possible (backward compat with component CSS files)
- Add new variables with paper/ink naming convention
- Keep all existing component styles (buttons, cards, forms) — update them in place
- Replace color values, font-family values, border-radius values
- Add `@import` for Google Fonts at top
- Add paper texture via `background-image` on `body`

**Migration Strategy:** In-place edit. No file restructuring.

---

## 2. Header — Navigation Component

**Current State:** Sticky header. "BOOP Web" logo text. nav: Home, Create Puzzle, Play, About. Hamburger menu on mobile. Theme toggle in nav. Double-border bottom.

**Target State:** 
- Logo: "BOOP" wordmark (no "Web" suffix)
- Nav: Create, Play, Templates, About (remove "Home" — implied by logo)
- Refined double-border bottom (`3px double`)
- Better mobile hamburger animation
- Theme toggle positioning refined
- Background: paper color, slight shadow on scroll

**CSS Changes:**
- `.header`: Keep `border-bottom: 3px double` — use refined border color
- `.nav a`: Update font-family to Inter, keep all-caps
- `.logo-text`: Update font to Playfair Display, adjust size/weight
- `.tagline`: Keep font-ui (Inter), refine spacing
- Mobile: improve menu animation, larger touch targets

**JS Changes:**
- Remove Home from nav links
- Change "Create Puzzle" to "Create"
- Update logo text from "BOOP Web" to "BOOP"
- Keep all functionality (hamburger, scroll, escape)

---

## 3. Footer — Footer Component

**Current State:** Copyright, GitHub link, Privacy, Terms on one line.

**Target State:**
- Left: BOOP wordmark + tagline "Puzzle Book Maker"
- Center: Nav links (Create, Play, Templates, About)
- Right: Legal links + social (GitHub secondary)
- Bottom: "Made with ❤️ for puzzle lovers everywhere" (optional)

**CSS Changes:**
- 3-column grid layout
- Refine colors, typography
- Add double-border top to match header

**JS Changes:**
- Remove GitHub from primary position
- Add tagline text
- Structure as 3-column

---

## 4. Home / Landing Page

**Current State:** Hero section (two-column, text + puzzle grid), newspaper divider, features grid, how-it-works steps, CTA.

**Target State:**
- **Hero:** Full-width editorial headline in Playfair Display, animated ambient letter grid background, book mockup visual (replaces current puzzle grid), stacked CTAs, badge
- **Social Proof (new):** Stats row or testimonial snippet (mini)
- **Features:** Refined 3-column grid, better icon treatment, benefit-oriented copy
- **How-It-Works:** Refined 4-step with small illustrations, better connector lines
- **CTA:** Refined section with stronger call-to-action

**CSS Changes:**
- Hero: Grid layout preserved but visual swapped, add letter grid background animation
- Features: Refine card style, update icon boxes, add hover animation
- Steps: Refine circles, connectors, typography
- Add social proof section styles

**JS Changes:**
- Hero: Replace puzzle grid with book mockup component (or image), add ambient letter grid background component
- Features: Update copy in feature cards
- Steps: Update copy, add optional illustration containers
- Add social proof section

---

## 5. PuzzleCreator — Generator Page

**Current State:** 4-step linear wizard (Settings → Words → Customize → Download). Progress indicator at top. Preview sidebar on right. LoadingOverlay absolute overlays the form.

**Target State:** Single-page creation hub. All settings visible with collapsible sections. Live preview panel. Smart pre-filled defaults. Flattened progress states.

**CSS Changes:**
- Replace `.form-step` pattern with `.creator-layout` (flex/grid for config + preview)
- `.progress-bar` → refined step indicator (horizontal dots or compact bar)
- `.form-with-preview` → use new `.creator-config` + `.creator-preview` columns
- Refine all form styling to match new system

**JS Changes (most complex change):**
- Remove `step` state management for the 4-step pattern
- Keep sections as collapsible `<details>` or custom accordion
- Sections: Config (title, difficulty, count), Words (WordSelector), Appearance (FileUploaders)
- Preview panel: always visible, updates on any config change
- Generate button: always visible, always at bottom
- Success state: overlay or slide-in panel
- Add `useEffect` to pre-fill defaults on mount

---

## 6. PuzzlePreview — Preview Component

**Current State:** SVG mini-grid of random letters. Shows title, puzzle count badge, stats (normal/hard/grid). Decorative only — doesn't reflect actual puzzle data.

**Target State:** Live book preview component. Shows actual book structure (cover, puzzle pages, solutions). Page navigation (prev/next). Updates in real-time as user changes settings. Shows actual grid from API data or simulation.

**CSS Changes:**
- `.puzzle-preview-card` → `.book-preview` — larger, fuller layout
- Add page-flip area, navigation arrows, page number indicator
- Cover display area, spine visual
- Refine stats display

**JS Changes (second most complex):**
- Accept `formData` and `wordsData` as props (already does)
- Generate a representative preview from actual word data
- Show cover page with title, decorative border
- Show 2-3 sample puzzle pages with actual grid layout
- Page navigation state (`currentPage`)
- Real-time update logic (debounced: on settings change, regenerate preview after 500ms)
- If backend data unavailable: use smart simulation from available word data

---

## 7. WordSelector — Word Selection Component

**Current State:** Three tabs (preset, custom, file). Preset shows topic toggles from API. Custom has topic name + word input. File upload with parsing.

**Target State:** Keep all functionality. Refine styling. Better visual feedback for selected items. Smoother transitions between tabs.

**CSS Changes:**
- `.selection-type-buttons` → pill tabs or inline button group
- `.topics-grid` → refined grid gap, selected state with checkmark
- `.word-chips` → better chip styling (rounded squares, ink-like)
- Tab transitions: smooth fade/height animation

**JS Changes:** None functional. Possibly add animation classes.

---

## 8. FileUploader — File Upload Component

**Current State:** File input with label, preview thumbnail, default toggle.

**Target State:** Keep functionality. Refine styling. Add drag-and-drop visual. Better success/error feedback.

**CSS Changes:**
- `.upload-area` → dashed border with drag-active state
- `.file-label` → button-like with consistent styling
- `.upload-preview` → refined thumbnail
- Add drag-over class styling

**JS Changes:** Add drag-and-drop event handlers (onDragOver, onDrop).

---

## 9. LoadingOverlay — Generation Progress

**Current State:** Absolute overlay. 4x4 animated letter grid + 8-step progress list with slot-machine animation. Green success/error states.

**Target State:** Book assembly visualization. Clean progress bar with step label. No letter grid. Publishing-themed (pages stacking, spine forming). Optional animated book.

**CSS Changes (major):**
- Replace `.grid-spinner` with book assembly container
- `.progress-steps` → simplified step list or single progress bar
- Refine colors, fonts, spacing
- Add book-assembly CSS keyframes (cover, pages, spine)

**JS Changes:**
- Remove grid generation logic
- Keep progress polling from GenerationContext
- Simplified render: progress bar + current step + optional book visual
- Add animation states: assembling, complete, error

---

## 10. GenerationStatus — Status Bar

**Current State:** Floating bottom bar. Shows mini grid during generation, success message when complete, error when failed. Overlaps with LoadingOverlay.

**Target State:** Merge with LoadingOverlay functionality. Remove as independent component. Or refine as lightweight toast that only appears outside the creator page.

**CSS Changes:** If kept: refine to match new design system. If removed: delete file.

**JS Changes:** If kept: conditionally render only when not on `/create` page. If removed: delete import from App.js.

---

## 11. PuzzleGame — Play Mode

**Current State:** Full interactive word search. Start screen (select mode/difficulty). Play screen (grid with drag-to-select). Complete screen (stats, share). Timer, hints.

**Target State:** Keep all functionality. Refine styling. Better touch support. Improved visual feedback for found words.

**CSS Changes:**
- `.puzzle-game` → refined container, better card styling
- `.game-grid` → refined cells, better found-word highlighting
- `.game-controls` → refined button styling
- `.game-complete` → refined celebration
- Improved dark mode support

**JS Changes:** None functional. Potentially add haptic-like visual feedback on word found.

---

## 12. Skeleton — Loading Placeholders

**Current State:** Three components: Skeleton (single bar), SkeletonCard, SkeletonForm.

**Target State:** Keep structure. Update colors to use new palette variables. Add SkeletonPage for route-level loading.

**CSS Changes:** Update background color to use new gray/paper tones.

**JS Changes:** Add new `SkeletonPage` component matching main layout.

---

## 13. Tooltip — Tooltip Component

**Current State:** Wraps children, shows info icon + text on hover/focus.

**Target State:** Keep. Refine styling to match design system. Add transition animation.

**CSS Changes:** Refine colors, add fade animation, adjust positioning offset.

---

## 14. About Page

**Current State:** Static info page about BOOP project. Tech stack, features, CLI-to-web.

**Target State:** Keep content. Refine layout to match editorial design. Add branding.

**CSS Changes:** Update to use new typography, spacing, card styles.

---

## 15. NotFound (404)

**Current State:** Basic page with "404" heading, description, navigation buttons.

**Target State:** Puzzle-themed 404. Mini puzzle grid with one cell showing "404". Playful copy.

**CSS Changes:** Add puzzle grid styling. Refine alignment.

**JS Changes:** Add mini puzzle grid component inline. Update copy.
