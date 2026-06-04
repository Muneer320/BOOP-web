# BOOP 3.0 — Asset Implementation Plan

---

## Asset Priority

| Priority | Asset | Must Have for Challenge? |
|---|---|---|
| **P0: Critical** | Logo SVG wordmark | Yes — shows in header, favicon |
| **P0: Critical** | Ambient letter grid animation | Yes — hero background |
| **P1: High** | Book mockup (hero visual) | Yes — replaces puzzle grid |
| **P1: High** | Empty state illustrations | Yes — professional polish |
| **P1: High** | Paper texture CSS | Yes — foundation of the aesthetic |
| **P2: Medium** | Phosphor icon set integration | Yes — needed for feature cards |
| **P2: Medium** | Book mockup screenshots | Yes — landing page showcase |
| **P3: Low** | Step illustrations | Nice — can use CSS icons as fallback |
| **P3: Low** | Ornamental dividers | Nice — can use current |
| **P3: Low** | Favicon | Nice — can use text fallback |

---

## P0: Critical Assets — Can Be Generated Immediately

### Asset 1: Logo SVG Wordmark

**Dimensions:** viewBox="0 0 200 60"
**Format:** Inline SVG in Header component
**Implementation:** Create as React component or SVG file

Prompt for generating BOOP wordmark:
```
Create an SVG wordmark for "BOOP" — a puzzle book publishing platform.
Style: Bold serif (like Playfair Display), all-caps, warm ink color (#2C1810).
The letter "B" should have a subtle puzzle-grid detail integrated into its design.
The "O"s should be slightly rounded.
Dimensions: 200x60, viewBox="0 0 200 60".
No background, pure vector.
Make it feel like a premium book publisher logo, not a tech startup.
```

**Where used:** Header.js (replace logo img + text block), Footer.js
**Fallback:** Use the current logo with "BOOP" text only

### Asset 2: Ambient Letter Grid Animation

**Implementation:** React component (no external assets needed)
**Where used:** Home.js hero section background

Create `components/HeroLetterGrid.js`:

```jsx
import React, { useEffect, useRef } from 'react';

const GRID_COLS = 30;
const GRID_ROWS = 12;

const HeroLetterGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const grid = Array.from({ length: GRID_ROWS }, () =>
      Array.from({ length: GRID_COLS }, () => ({
        char: letters[Math.floor(Math.random() * 26)],
        opacity: Math.random() * 0.08 + 0.02,
        speed: Math.random() * 0.005 + 0.002,
        phase: Math.random() * Math.PI * 2,
      }))
    );

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cellW = canvas.width / GRID_COLS;
      const cellH = canvas.height / GRID_ROWS;

      grid.forEach((row, ri) => {
        row.forEach((cell, ci) => {
          const flicker = Math.sin(time * cell.speed + cell.phase) * 0.04 + 0.05;
          ctx.fillStyle = `rgba(44, 24, 16, ${flicker})`;
          ctx.font = `${cellH * 0.7}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(cell.char, ci * cellW + cellW / 2, ri * cellH + cellH / 2);
        });
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-letter-grid"
      aria-hidden="true"
    />
  );
};

export default HeroLetterGrid;
```

**CSS:**
```css
.hero-letter-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}
```

---

## P1: High Priority — Can Use Fallbacks

### Asset 3: Book Mockup (Hero Visual)

**Fallback:** Use actual generated puzzle book screenshots. Generate a puzzle book with sample data, export as PDF, take screenshots of the pages. Use the best 1-2 spreads as the hero visual image.

**Implementation:**
1. Run the backend locally
2. Generate a sample puzzle book (8 puzzles, "Animals" topic)
3. Open the PDF
4. Take screenshots of:
   - Cover page (full spread)
   - A puzzle page (showing the grid)
5. Save as `public/assets/hero-book-cover.png` and `.webp`
6. Display in Home.js hero as `<img>` with proper styling

**Dimensions:** 800x600px (2x for retina: 1600x1200px)
**Format:** WebP with PNG fallback
**Placement:** Hero section right column, inside a styled book frame

**If backend is unavailable:** Use CSS to create a stylized book placeholder:
```jsx
<div className="book-mockup">
  <div className="book-cover">
    <div className="book-title">Sample Puzzle Book</div>
    <div className="book-subtitle">Word Search</div>
  </div>
  <div className="book-pages">
    <div className="book-page"></div>
    <div className="book-page"></div>
  </div>
</div>
```

### Asset 4: Empty State Illustrations

**Implementation:** Inline SVG React components (no assets to download)

Create `components/EmptyStates.js`:

```jsx
const EmptyBook = () => (
  <svg viewBox="0 0 120 120" fill="none" className="empty-state-illustration">
    {/* Open book shape */}
    <path d="M10 30 L60 20 L110 30 L110 100 L60 90 L10 100 Z"
      fill="var(--paper-light)" stroke="var(--border)" strokeWidth="1.5"/>
    {/* Dotted grid lines on pages */}
    <line x1="35" y1="40" x2="35" y2="80" stroke="var(--border-light)" strokeDasharray="3 3"/>
    <line x1="85" y1="40" x2="85" y2="80" stroke="var(--border-light)" strokeDasharray="3 3"/>
    <line x1="25" y1="55" x2="50" y2="50" stroke="var(--border-light)" strokeDasharray="2 2"/>
    <line x1="25" y1="65" x2="50" y2="60" stroke="var(--border-light)" strokeDasharray="2 2"/>
    <line x1="70" y1="50" x2="95" y2="55" stroke="var(--border-light)" strokeDasharray="2 2"/>
    <line x1="70" y1="60" x2="95" y2="65" stroke="var(--border-light)" strokeDasharray="2 2"/>
    {/* Pencil */}
    <line x1="100" y1="15" x2="115" y2="5" stroke="var(--secondary)" strokeWidth="2"/>
    <polygon points="115,5 118,8 114,10" fill="var(--secondary)"/>
  </svg>
);
```

**Where used:** PuzzleCreator empty states, template gallery, search results
**Style:** Same warm, minimal line-art style as the book mockup

### Asset 5: Paper Texture CSS

**Implementation:** Added to `index.css` body (see DESIGN_SYSTEM_MIGRATION.md). Uses SVG filter for noise texture. No external files needed.

---

## P2: Medium Priority

### Asset 6: Phosphor Icons

**Implementation:** Install via npm or use inline SVGs

```bash
npm install @phosphor-icons/react
```

**Where used:** Feature cards, navigation, buttons, empty states

Alternative (lighter): Create a minimal SVG icon component for the 6-8 icons needed:
- Book, Pencil, Download, Upload, Grid, Gear, Check, Close

If using inline SVGs, use the same viewBox (24x24) and stroke-width (1.5) consistently.

### Asset 7: Book Mockup Screenshots

**When to create:** After backend is running (during implementation)
**Where used:** Landing page showcase section, template gallery

---

## External Generation Prompts

If the developer wants to generate premium assets externally (Figma, Illustrator, etc.):

### Hero Book Mockup Prompt

```
Design a premium editorial illustration of an open puzzle book.
Style: Flat illustration with warm, muted colors (cream, forest green, gold).
The book is open at a slight angle, showing puzzle grids on both pages.
Subtle shadows, paper texture feel, no outlines.
The cover visible behind shows "PUZZLE BOOK" title.
Think editorial illustration for a premium magazine — warm, inviting, craft-focused.
Dimensions: 800x600px at 2x resolution.
Format: PNG with transparent background, or vector.
```

### Logo Design Prompt

```
Design a wordmark logo for "BOOP" — a puzzle book publishing platform.
The style should be premium editorial publishing, not tech startup.
Bold serif typeface, similar to Playfair Display or Chronicle.
All-caps, warm ink color, tight letter-spacing.
The "B" should have a subtle puzzle-grid detail built into the letterform.
The "O"s should feel slightly rounded / inclusive.
Tagline option: "PUZZLE BOOK MAKER" set in small caps beneath.
The logo should feel like it belongs on a book spine.
Format: SVG vector.
```

---

## Asset File Structure

```
frontend/
  public/
    assets/
      hero-book-cover.webp       (hero mockup)
      hero-book-cover.png        (fallback)
      og-image.png               (social sharing card)
  src/
    assets/
      logo.svg                   (wordmark SVG)
      logo.png                   (fallback PNG)
    components/
      HeroLetterGrid.js          (animated background)
      EmptyStates.js             (SVG empty state components)
      Icons.js                   (inline SVG icon components)
```

---

## Implementation Order for Assets

| Step | Asset | Can Implement Without External Tools? |
|---|---|---|
| 1 | Paper texture CSS | Yes — SVG filter in CSS |
| 2 | Ambient letter grid | Yes — pure React component |
| 3 | Empty state SVGs | Yes — create as inline components |
| 4 | Phosphor icons | Yes — npm package |
| 5 | Logo SVG | Create in code or use text fallback |
| 6 | Book mockup | Screenshot from generated output |
| 7 | Step illustrations | Use icons as fallback |
