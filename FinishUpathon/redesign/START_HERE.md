# BOOP 3.0 — START HERE

## Execution begins. No more planning.

---

## Day 1: Design System Migration + Global Components (5-6 hours)

### Task 1.1: CSS Variable Migration (2h)
**File:** `frontend/src/index.css`

**DO THIS:**
1. Open `frontend/src/index.css`
2. Replace the `@import` section at the top with the Google Fonts import
3. Replace the entire `:root {}` block with the new variable definitions (see DESIGN_SYSTEM_MIGRATION.md)
4. Replace the entire `[data-theme="dark"]` block with the new dark variable definitions
5. Update the `body` styling — replace the background with the new radial-gradient and remove the repeating-linear-gradient pattern
6. Add the paper texture `body::before` pseudo-element
7. Add the new keyframe animations
8. Update `.btn` — add `border-radius: var(--radius-sm)`, change border to `1.5px`
9. Update `.card` — add `border-radius: var(--radius-md)`
10. Update `.form-control` — add `border-radius: var(--radius-sm)`, change border to `1.5px`
11. Update `.alert` — add `border-radius: var(--radius-sm)`

**VERIFY:** Page reloads with warm cream background, Playfair Display headings, Inter UI text.

### Task 1.2: Header Redesign (1.5h)
**File:** `frontend/src/components/Header.js`, `Header.css`

**DO THIS:**
1. In `Header.js`: Change logo text from "BOOP Web" to "BOOP"
2. In `Header.js`: Remove "Home" from nav links
3. In `Header.js`: Change "Create Puzzle" to "Create"
4. In `Header.js`: Add "Templates" link (routes to `/templates` for now, even if 404)
5. In `Header.js`: Update tagline from "Word Search Generator" to "Puzzle Book Maker"
6. In `Header.css`: Update `.logo-text` font to `var(--font-display)`, adjust size to 1.4rem
7. In `Header.css`: Update `.tagline` font-family, letter-spacing, and color
8. In `Header.css`: Update `.nav a` styling — refined font, spacing
9. In `Header.css`: Update `.nav a.active` — use `var(--primary)` for bottom border

### Task 1.3: Footer Redesign (1h)
**File:** `frontend/src/components/Footer.js`, `Footer.css`

**DO THIS:**
1. In `Footer.js`: Add BOOP wordmark and "Puzzle Book Maker" tagline
2. In `Footer.js`: Restructure into 3 sections — brand, nav links, legal
3. In `Footer.js`: Move GitHub link to secondary position
4. In `Footer.css`: Refine with 3-column grid layout, double-border top

### Task 1.4: App.css Update (0.5h)
**File:** `frontend/src/App.css`

**DO THIS:**
1. Update `.spinner` border-top-color to `var(--primary)`
2. Keep all utility classes and layout — they still work with new variables

### Task 1.5: Theme Context Dark Mode Test (0.5h)
**File:** `frontend/src/context/ThemeContext.js`

**DO THIS:**
1. Toggle dark mode
2. Verify all dark mode colors look warm, not cold
3. Adjust `--ink`, `--paper`, `--primary` values if needed in index.css

---

## Day 2: Landing Page Redesign (5-6 hours)

### Task 2.1: Create HeroLetterGrid Component (1h)
**File:** NEW — `frontend/src/components/HeroLetterGrid.js`

**DO THIS:**
1. Create the file with the Canvas-based animated letter grid
2. Import it into `Home.js`
3. Add CSS for `.hero-letter-grid` — absolute positioning behind hero content

### Task 2.2: Hero Section Redesign (2.5h)
**File:** `frontend/src/components/Home.js`, `Home.css`

**DO THIS:**
1. In `Home.js`: Replace the hero section completely
   - New structure: `.hero` > `.container` > `.hero-content` (left) + `.hero-visual` (right)
   - Badge: "Puzzle Book Maker"
   - Headline: "From Word Lists to Beautiful Books." in Playfair Display
   - Subheadline: "Turn any word list into a professionally printed puzzle book — in minutes, not hours."
   - CTAs: "Create Your First Book" (primary) + "Play Online" (outline)
   - Visual: Book mockup (image or CSS book placeholder)
   - Background: Add `<HeroLetterGrid />` component
2. In `Home.css`: Complete hero styling rewrite
   - Grid layout for content + visual
   - Editorial typography for headline
   - Styled book mockup container
   - Button styling with new variables

### Task 2.3: Social Proof Section (1h)
**File:** `frontend/src/components/Home.js`, `Home.css`

**DO THIS:**
1. Add section between hero and features
2. Simple row: "Used by teachers, parents, and publishers to create beautiful puzzle books."
3. Optional: Add stat counters if available (puzzles generated, books created)

### Task 2.4: Features + How-It-Works Refinement (1.5h)
**File:** `frontend/src/components/Home.js`, `Home.css`

**DO THIS:**
1. Replace inline SVG icons with Phosphor icons (install `@phosphor-icons/react` or use inline SVGs)
2. Refine feature card styling in CSS — better borders, hover, spacing
3. Refine How-It-Works — better step circles, connector lines, typography
4. Update all copy to benefit-oriented language

---

## Day 3: Creation Flow Redesign — Part 1 (5-6 hours)

### Task 3.1: PuzzleCreator Single-Page Structure (4h)
**File:** `frontend/src/components/PuzzleCreator.js`, `PuzzleCreator.css`

**DO THIS:**
1. Remove the `step` state and 4-step conditional rendering pattern
2. Restructure to single-page layout:
   - Left panel (config): collapsible sections for Settings, Words, Appearance
   - Right panel (preview): `<PuzzlePreview />` component
   - Bottom: Generate button (always visible)
3. Keep all sub-components (WordSelector, FileUploader) — they remain functional
4. Smart defaults: Pre-fill title with "My Puzzle Book", difficulty Medium, 10 puzzles
5. Collapsible sections: Settings open by default, Words collapsed, Appearance collapsed
6. Generate button triggers the existing `generatePuzzle` function
7. Success shows inline in the preview panel (not a separate step)

**Simplified structure:**
```jsx
<div className="creator-layout">
  <div className="creator-config">
    <section className="config-section" id="settings">
      <h3 onClick={toggleSection}>Settings</h3>
      <div className="section-body">{/* form fields */}</div>
    </section>
    <section className="config-section" id="words">
      <h3 onClick={toggleSection}>Words</h3>
      <div className="section-body">{/* WordSelector */}</div>
    </section>
    <section className="config-section" id="appearance">
      <h3 onClick={toggleSection}>Appearance</h3>
      <div className="section-body">{/* FileUploaders */}</div>
    </section>
    <button className="btn btn-primary btn-generate" onClick={generatePuzzle}>
      Generate Puzzle Book
    </button>
  </div>
  <div className="creator-preview">
    <PuzzlePreview formData={formData} />
  </div>
</div>
```

### Task 3.2: Progress Indicator Update (1h)
**File:** `frontend/src/components/PuzzleCreator.js`, `PuzzleCreator.css`

**DO THIS:**
1. Replace the 4-step progress bar with a compact status indicator
2. Show current "mode": Configuring → Generating → Complete
3. Keep the existing LoadingOverlay for the actual generation phase

---

## Day 4: Creation Flow Redesign — Part 2 (5-6 hours)

### Task 4.1: Live PuzzlePreview (3h)
**File:** `frontend/src/components/PuzzlePreview.js`, `PuzzlePreview.css`

**DO THIS:**
1. Accept `formData` and `wordsPayload` as props
2. Generate representative preview from actual word data:
   - Title page with book title
   - 2 sample puzzle grids with actual word positions
   - Solution preview
3. Add page navigation (left/right arrows, page indicator)
4. Debounce preview regeneration (500ms after settings change)
5. If no words selected: show empty state with EmptyBook illustration
6. Style as a realistic book spread — warm background, page shadow, spine

### Task 4.2: WordSelector Styling (1h)
**File:** `frontend/src/components/WordSelector.css`

**DO THIS:**
1. Refine `.selection-type-buttons` — inline pill-style buttons
2. Refine `.topics-grid` — better grid spacing, selected state
3. Refine `.word-chip` — rounded squares with ink-like styling
4. Refine layout — consistent padding, spacing

### Task 4.3: FileUploader Styling (1h)
**File:** `frontend/src/components/FileUploader.css`

**DO THIS:**
1. Refine `.upload-area` — dashed border with better visual
2. Refine `.file-label` — button styling consistency
3. Refine `.upload-preview` — better thumbnail display

### Task 4.4: PuzzleDetails Styling (0.5h)
**File:** `frontend/src/components/PuzzleDetails.css`

**DO THIS:**
1. Refine card border, typography, spacing
2. Ensure it matches the new card style

---

## Day 5: Loading, Success, Polish (5-6 hours)

### Task 5.1: LoadingOverlay Redesign (2.5h)
**File:** `frontend/src/components/LoadingOverlay.js`, `LoadingOverlay.css`

**DO THIS:**
1. Remove the animated grid (`grid-spinner` div + related logic)
2. Replace with:
   - Book assembly visual: CSS-animated book (cover → pages → spine)
   - Or simpler: progress bar with publishing-themed step labels
3. Keep the progress polling from GenerationContext
4. Refine step labels to sound more editorial:
   - "Setting the press..." (instead of "Parsing word lists")
   - "Printing cover..." (instead of "Adding cover page")
   - "Filling pages..." (instead of "Generating puzzles")
   - "Binding book..." (instead of "Merging PDFs")
5. Clean, centered layout, minimal visual noise

### Task 5.2: GenerationStatus Refinement (1h)
**File:** `frontend/src/components/GenerationStatus.js`, `GenerationStatus.css`

**DO THIS:**
1. Remove the mini 4-letter grid from the generating state
2. Refine styling — use pill-shaped status bar at bottom
3. Ensure it doesn't overlap with overlay on creator page
4. Add condition: only show this if not on `/create` page

### Task 5.3: Success Screen Celebration (2h)
**File:** `frontend/src/components/PuzzleCreator.js` (+ success section in creator)

**DO THIS:**
1. When generation completes:
   - Show success state inline in the preview panel (not separate step)
   - Book mockup with "APPROVED FOR PRINT" stamp overlay (CSS animation)
   - Download button: prominent, primary style
   - "Create Another" button
   - Generation stats: time, puzzle count, page count
   - Share button (opens native share if available)

### Task 5.4: Final Polish (1h)
**Files:** Various

**DO THIS:**
1. Ensure all components use new CSS variables
2. Verify dark mode works on all pages
3. Test responsive layout on mobile widths
4. Verify `prefers-reduced-motion` disables animations
5. Run the app, do a full create flow, verify no regressions

---

## Day 6+: Bonus — If Time Allows

### Bonus 1: Puzzle Game Styling (2h)
**File:** `PuzzleGame.js`, `PuzzleGame.css`

**DO THIS:**
- Refine game grid cell styling
- Better found-word highlighting
- Improved dark mode support

### Bonus 2: 404 Page Charm (1h)
**File:** `NotFound.js`

**DO THIS:**
- Add mini puzzle grid with "404" embedded
- Playful copy: "These puzzles don't exist. Yet."

### Bonus 3: About Page Refinement (1h)
**File:** `About.js`, `About.css`

**DO THIS:**
- Update layout to use new card styling
- Better typography hierarchy

---

## That's It. Start Now.

1. Open `frontend/src/index.css`
2. Replace the CSS variables
3. Watch the entire app transform before your eyes
4. Move to Day 2

**The transformation is visible from the very first change.**

No more documents.

No more planning.

Code.
