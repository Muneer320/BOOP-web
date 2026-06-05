# BOOP 3.0 — Visual Evolution Plan

## From "Functional Student Project" to "Premium Publishing Workshop"

---

## 1. Evolution Principle

Design is like printing: "start with what works, refine the press."

The current design has the right soul. It has warm paper tones, serif personality, and puzzle-book identity. The problem is execution — inconsistent spacing, arbitrary type choices, rough edges.

This plan refines what exists rather than replacing it.

---

## 2. Color Palette — Refined Evolution

### Current Light Mode

```
--primary: #3a6b35       (forest green)
--secondary: #c4956a     (warm gold/tan)
--accent: #8b3a3a        (deep red)
--light: #f5f0e8         (cream)
--dark: #2c1810          (warm brown-black)
--bg-primary: #faf7f0    (paper)
--bg-secondary: #f5f0e8  (aged paper)
--text-primary: #2c1810  (ink)
--text-secondary: #6b5a48 (faded ink)
--border-color: #d4c9b8  (aged border)
--card-bg: #fdfaf4       (white paper)
```

### Refined Light Mode

| Token | Old | New | Why |
|---|---|---|---|
| `--primary` | `#3a6b35` | `#3D6B3D` | Slightly richer green, better readability |
| `--primary-dark` | `#2d5029` | `#2A4F2A` | Deeper, more printable |
| `--secondary` | `#c4956a` | `#C49464` | Warmer gold, less washed out |
| `--accent` | `#8b3a3a` | `#8B3A3A` | Keep — rich ink red |
| `--paper` | `#faf7f0` | `#FAF6EF` | True paper tone |
| `--paper-light` | `#fdfaf4` | `#FDFAF5` | Slightly warmer white paper |
| `--paper-dark` | `#f5f0e8` | `#F2ECE0` | Aged paper, more character |
| `--ink` | `#2c1810` | `#2C1810` | Keep — warm black |
| `--ink-light` | `#6b5a48` | `#6F5E4E` | Slightly richer faded ink |
| `--ink-faded` | — | `#A09080` | New: for placeholder, disabled |
| `--border` | `#d4c9b8` | `#D4C9B8` | Keep |
| `--border-light` | — | `#E5DDD0` | New: subtler borders |
| `--success` | `#4a7c3a` | `#4A7C3A` | Keep |
| `--warning` | `#b8860b` | `#B8860B` | Keep |
| `--error` | `#8b3a3a` | `#8B3A3A` | Keep (shared with accent) |

### Refined Dark Mode

| Token | Old | New | Why |
|---|---|---|---|
| `--primary` | `#6b9e5e` | `#73A868` | Brighter, more visible |
| `--paper` | `#1f1b16` | `#201C17` | Warm dark (not cold gray) |
| `--paper-light` | `#25201a` | `#28231D` | Card surface, warm |
| `--paper-dark` | `#1a1814` | `#1C1915` | Deeper background |
| `--ink` | `#e0d8cc` | `#E2D8C8` | Warm off-white |
| `--ink-light` | `#bcab95` | `#BFB09C` | Subtle ink |
| `--border` | `#3a3228` | `#3E352B` | Slightly lighter for visibility |

### Key Change Summary
- Went from "bg-primary" / "bg-secondary" naming to "paper" / "paper-light" / "paper-dark" — reinforces the print metaphor
- Colors refined for consistency, not replaced
- Warmth preserved in both light and dark modes
- Green and gold tones kept as brand identifiers

---

## 3. Typography — Refined Pairing

### Current
```
--font-heading: Georgia, "Times New Roman", "Palatino Linotype", serif;
--font-body: "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif;
--font-mono: "Courier New", "Lucida Console", monospace;
--font-ui: "Trebuchet MS", "Lucida Grande", "Segoe UI", sans-serif;
```

### Refined
```
--font-display: "Playfair Display", Georgia, "Times New Roman", serif;
--font-body: "Source Serif 4", Georgia, "Palatino Linotype", serif;
--font-ui: "Inter", "Segoe UI", system-ui, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", "Courier New", monospace;
```

### Type Scale

| Level | Size | Weight | Line Height | Font | Usage |
|---|---|---|---|---|---|
| Display | clamp(2.5rem, 5vw, 4rem) | 700 | 1.05 | display | Hero headline |
| h1 | 2.25rem (36px) | 700 | 1.15 | display | Major section titles |
| h2 | 1.75rem (28px) | 700 | 1.2 | display | Section titles |
| h3 | 1.35rem (22px) | 600 | 1.3 | display / body | Card titles |
| h4 | 1.125rem (18px) | 600 | 1.35 | body | Subtitles |
| body-lg | 1.125rem (18px) | 400 | 1.6 | body | Featured/hero text |
| body | 1rem (16px) | 400 | 1.6 | body | Body paragraphs |
| body-sm | 0.875rem (14px) | 400 | 1.55 | body | Captions, form labels |
| caption | 0.75rem (12px) | 500 | 1.4 | ui | Small labels, badges |
| overline | 0.6875rem (11px) | 700 | 1 | ui | Uppercase section labels |
| button | 0.8125rem (13px) | 600 | 1 | ui | Button text |

### Key Decisions
- **Display serif (Playfair Display)** for hero headings and major titles — provides the premium editorial feel
- **Readable serif (Source Serif 4)** for body text — retains the book feel with better readability than Palatino
- **Sans-serif (Inter)** for UI — keeps the interface modern, fast, and scannable
- **All-caps retained** for buttons and labels — editorial convention
- **Monospace updated** for better puzzle grid rendering
- Google Fonts for Playfair Display, Source Serif 4, Inter, JetBrains Mono

---

## 4. Spacing — From Ad-Hoc to Intentional

### Current
Inconsistent padding, arbitrary gaps, no system.

### Refined (8px Grid)

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon gaps, micro adjustments |
| `--space-2` | 8px | Tight spacing, inline elements |
| `--space-3` | 12px | Button padding, small gaps |
| `--space-4` | 16px | Card padding, form spacing |
| `--space-5` | 24px | Component gaps, section padding |
| `--space-6` | 32px | Large component gaps |
| `--space-8` | 48px | Section margins |
| `--space-10` | 64px | Major section gaps |
| `--space-12` | 80px | Page-level spacing |
| `--space-16` | 96px | Maximum content spacing |

---

## 5. Borders — Refining the Double

The double border is BOOP's signature detail. It must stay but be refined.

### Current
```css
.card {
  border: 2px solid var(--border-color);
}
.card::before {
  content: "";
  position: absolute;
  top: 4px; left: 4px; right: -4px; bottom: -4px;
  border: 1px solid var(--border-color);
  opacity: 0.3;
}
```

### Refined
```css
.card {
  border: 2px solid var(--border);
  box-shadow: var(--shadow-sm);
  position: relative;
}
.card::before {
  content: "";
  position: absolute;
  inset: -6px;
  border: 1px solid var(--border);
  opacity: 0.25;
  pointer-events: none;
}
```

Changes: Consistent `inset` syntax, negative offset outward, cleaner code.

### Border Radius
- Cards: `4px` (subtle, like paper corners)
- Buttons: `2px` (sharp, print-like)
- Inputs: `2px` (sharp, like forms on paper)
- Modals: `6px` (slightly softer, elevated element)
- Badges: `2px`
- **Keep radius minimal** — rounded corners contradict the print/publishing feel

---

## 6. Shadows — Print-Inspired Depth

### Current
```css
--shadow: 0 2px 8px rgba(44, 24, 16, 0.12);
--shadow-lg: 0 8px 32px rgba(44, 24, 16, 0.15);
```

### Refined
```css
--shadow-sm: 0 1px 3px rgba(44, 24, 16, 0.08);
--shadow-md: 0 4px 12px rgba(44, 24, 16, 0.1);
--shadow-lg: 0 8px 24px rgba(44, 24, 16, 0.12);
--shadow-xl: 0 16px 48px rgba(44, 24, 16, 0.15);
```

Shadows use warm black `#2c1810` as the color base — consistent with the ink tone. This keeps shadows feeling warm and paper-like rather than cold and digital.

---

## 7. Paper Texture — Adding the Tactile Element

### Background
Add a very subtle paper texture to page backgrounds:

```css
body {
  background-color: var(--paper);
  background-image: url("data:image/svg+xml,...subtle-noise-filter...");
  background-repeat: repeat;
  background-size: 200px 200px;
  background-blend-mode: multiply;
  opacity: 0.03; /* barely visible */
}
```

The texture must be subtle enough that users don't consciously notice it, but its absence would be felt.

### Alternative Approach (CSS Only)
If SVG noise is unavailable, use a subtle radial gradient overlay:
```css
background-image: 
  radial-gradient(ellipse at 20% 50%, rgba(196, 149, 106, 0.04) 0%, transparent 50%),
  radial-gradient(ellipse at 80% 50%, rgba(58, 107, 53, 0.03) 0%, transparent 50%);
```

---

## 8. Component Styles — Refined

### Cards

| Property | Current | Refined |
|---|---|---|
| Background | `var(--card-bg)` | `var(--paper-light)` |
| Border | 2px solid `var(--border-color)` | 2px solid `var(--border)` |
| Double border | `::before` offset | `::before` with `inset: -6px` |
| Radius | none | 4px |
| Shadow | `var(--shadow)` | `var(--shadow-sm)` |
| Padding | 1.5rem | `var(--space-5)` |
| Hover | translateY(-3px) | translateY(-2px), border to primary |

### Buttons

| Property | Current | Refined |
|---|---|---|
| Font | Trebuchet MS, all-caps | Inter, all-caps |
| Size | 0.85rem | 0.8125rem (13px) |
| Padding | 0.55rem 1.25rem | var(--space-3) var(--space-5) |
| Border | 2px solid | 1.5px solid |
| Radius | none | 2px |
| Primary bg | `#3a6b35` | `var(--primary)` |
| Primary text | `#fdfaf4` | `var(--paper-light)` |
| Hover | darken | darken 8% |

### Inputs

| Property | Current | Refined |
|---|---|---|
| Background | `var(--bg-primary)` | `var(--paper)` |
| Border | 2px solid | 1.5px solid |
| Radius | none | 2px |
| Padding | 0.5rem 0.75rem | var(--space-3) var(--space-4) |
| Focus | green border + green glow | primary border + primary glow (at 10%) |
| Font | Palatino serif | Inter (UI consistency) |

Note: Body text in inputs changes to font-body for readability when appropriate (long-form text entry). Short inputs (search, title, numbers) use font-ui.

### Dividers

| Type | Current | Refined |
|---|---|---|
| Major divider | Repeating dashed (`newspaper-divider`) | Keep but refined — use primary green tone |
| Section ornament | `★` character | Use SVG ornamental divider (floral, typographic) |
| Subtle divider | None | Thin 1px border with `var(--border-light)` |

### Progress Steps (Wizard)

| Property | Current | Refined |
|---|---|---|
| Step circle | 40px, round | 44px, square with 4px radius |
| Active | Green fill, white text | Primary fill, white text, slight lift |
| Completed | Same as inactive | Show checkmark, primary border |
| Connector line | 2px gray line | 1.5px, border color |
| Label | Below circle | Below circle, font-ui, all-caps |

---

## 9. Dark Mode — Warmth Preserved

Current dark mode is actually quite good — warm brown-based rather than cool gray. The refinement:

| Principle | Application |
|---|---|
| No pure blacks | Darkest surface `#1C1915` (warm) |
| No pure whites | Lightest text `#E2D8C8` (warm) |
| Green shifts brighter | `#73A868` for readability on dark |
| Paper metaphor preserved | "Aged dark paper" not "dark mode" |
| Shadows use warm black | `rgba(0, 0, 0, 0.4)` with warm tint |

---

## 10. Evolution Visual Summary

```
CURRENT                     →     EVOLVED
─────────────────────────────────────────────
Warm palette (muddy)        →     Warm palette (intentional)
Serif everywhere            →     Serif display + serif body + sans UI
Trebuchet MS for UI         →     Inter for UI
Inconsistent spacing        →     8px grid system
Double border (messy)       →     Double border (refined)
No radius                   →     Subtle 2-4px radius
Soft shadow                 →     Print-inspired layered shadows
Mixed fonts (system)        →     Curated Google Fonts pairing
Background grid pattern     →     Subtle paper texture
Basic inputs                →     Editorial form design
Logo: img + text            →     Refined logo lockup
Loading: random grid        →     Book-assembly progress
Success: checkmark          →     Page-reveal celebration
```

---

## 11. What Stays Visually the Same

Recognizability matters. These elements should be visually familiar even after the redesign:

- Green + gold + cream as the dominant color story
- Double borders on cards
- Ornamental section dividers
- All-caps button labels
- Circular/boxed step indicators
- The general "handcrafted" feel
- Puzzle grid as a visual motif
- Warm dark mode

Users of the current site should feel like BOOP got better, not different.
