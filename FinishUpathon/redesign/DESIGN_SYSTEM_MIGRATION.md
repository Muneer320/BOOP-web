# BOOP 3.0 — Design System Migration

## Exact CSS Variable Definitions — Ready to Copy-Paste

---

## New `index.css` Variable Definitions

Replace the current `:root` block (lines 1-26) with this:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:wght@400;500;600;700&family=Source+Serif+4:wght@400;500;600&display=swap');

:root {
  /* === Brand Colors (Warm, Print-Inspired) === */
  --primary: #3D6B3D;
  --primary-dark: #2A4F2A;
  --secondary: #C49464;
  --accent: #8B3A3A;

  /* === Paper Tones (Aged, Warm) === */
  --paper: #FAF6EF;
  --paper-light: #FDFAF5;
  --paper-dark: #F2ECE0;

  /* === Ink Tones (Warm Black/Brown) === */
  --ink: #2C1810;
  --ink-light: #6F5E4E;
  --ink-faded: #A09080;

  /* === Borders === */
  --border: #D4C9B8;
  --border-light: #E5DDD0;

  /* === Semantic Colors === */
  --success: #4A7C3A;
  --success-bg: #F0F7EE;
  --warning: #B8860B;
  --warning-bg: #FEF7E8;
  --error: #8B3A3A;
  --error-bg: #F9EEEE;

  /* === Shadows (Warm Ink-Base) === */
  --shadow-sm: 0 1px 3px rgba(44, 24, 16, 0.08);
  --shadow-md: 0 4px 12px rgba(44, 24, 16, 0.1);
  --shadow-lg: 0 8px 24px rgba(44, 24, 16, 0.12);
  --shadow-xl: 0 16px 48px rgba(44, 24, 16, 0.15);

  /* === Border Radius (Minimal, Print-Like) === */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-full: 9999px;

  /* === Spacing (8px Grid) === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-8: 48px;
  --space-10: 64px;
  --space-12: 80px;
  --space-16: 96px;

  /* === Typography === */
  --font-display: "Playfair Display", Georgia, "Times New Roman", serif;
  --font-body: "Source Serif 4", Georgia, "Palatino Linotype", serif;
  --font-ui: Inter, "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "Courier New", monospace;

  /* === Legacy Mapping (Backward Compat) === */
  --bg-primary: var(--paper);
  --bg-secondary: var(--paper-dark);
  --text-primary: var(--ink);
  --text-secondary: var(--ink-light);
  --border-color: var(--border);
  --gray-light: var(--border-light);
  --gray: var(--ink-faded);
  --card-bg: var(--paper-light);
  --overlay-bg: rgba(250, 246, 239, 0.92);
  --light: var(--paper);
  --dark: var(--ink);
  --shadow: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --font-heading: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
  --font-ui: var(--font-ui);
}
```

---

## New Dark Mode Block (Replace lines 28-49)

```css
[data-theme="dark"] {
  --primary: #73A868;
  --primary-dark: #5A8E50;
  --secondary: #C49464;
  --accent: #C96A6A;

  --paper: #201C17;
  --paper-light: #28231D;
  --paper-dark: #1C1915;

  --ink: #E2D8C8;
  --ink-light: #BFB09C;
  --ink-faded: #8A7A68;

  --border: #3E352B;
  --border-light: #2D261F;

  --success: #5A9E4A;
  --success-bg: #1A2E14;
  --warning: #D4A030;
  --warning-bg: #2D2108;
  --error: #C96A6A;
  --error-bg: #2E1414;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.45);

  /* Legacy dark overrides */
  --bg-primary: var(--paper);
  --bg-secondary: var(--paper-dark);
  --text-primary: var(--ink);
  --text-secondary: var(--ink-light);
  --border-color: var(--border);
  --gray-light: var(--border-light);
  --gray: var(--ink-faded);
  --card-bg: var(--paper-light);
  --overlay-bg: rgba(28, 25, 21, 0.92);
  --light: var(--paper);
  --dark: var(--ink);
}
```

---

## Body Styling Update (Replace lines 55-68)

```css
body {
  margin: 0;
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--paper);
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(196, 149, 106, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(61, 107, 61, 0.03) 0%, transparent 50%);
  color: var(--ink);
  line-height: 1.7;
  transition: background-color 0.3s ease, color 0.2s ease;
}
```

Changes from current:
- Remove `repeating-linear-gradient` background pattern (graph paper look)
- Replace with subtle radial gradients for warmth
- Keep warm background color
- Keep font-smoothing and transition

---

## Typography Migration Quick Reference

| Old Font Variable | New Equivalent | Visual Change |
|---|---|---|
| `--font-heading: Georgia, serif` | `--font-display: Playfair Display, serif` | More elegant, still serif |
| `--font-body: Palatino, serif` | `--font-body: Source Serif 4, serif` | More readable, still serif |
| `--font-ui: Trebuchet MS, sans-serif` | `--font-ui: Inter, sans-serif` | Modern, clean, professional |
| `--font-mono: Courier New, monospace` | `--font-mono: JetBrains Mono, monospace` | Modern monospace, better for grids |

---

## Color Migration Quick Reference

| Old Variable | Old Value | New Variable | New Value |
|---|---|---|---|
| `--primary` | `#3a6b35` | `--primary` | `#3D6B3D` |
| `--primary-dark` | `#2d5029` | `--primary-dark` | `#2A4F2A` |
| `--secondary` | `#c4956a` | `--secondary` | `#C49464` |
| `--accent` | `#8b3a3a` | `--accent` | `#8B3A3A` |
| `--light` / `--bg-primary` | `#f5f0e8` / `#faf7f0` | `--paper` | `#FAF6EF` |
| `--bg-secondary` | `#f5f0e8` | `--paper-dark` | `#F2ECE0` |
| `--card-bg` | `#fdfaf4` | `--paper-light` | `#FDFAF5` |
| `--dark` / `--text-primary` | `#2c1810` | `--ink` | `#2C1810` |
| `--text-secondary` | `#6b5a48` | `--ink-light` | `#6F5E4E` |
| `--border-color` | `#d4c9b8` | `--border` | `#D4C9B8` |

---

## Component Updates Map

### Buttons (lines 82-145 in current index.css)

**Changes:**
- `font-family: var(--font-ui)` → Inter (already uses font-ui)
- `border: 2px solid` → `border: 1.5px solid`
- Add `border-radius: var(--radius-sm)` (2px)
- `.btn-primary:hover` → use `filter: brightness(0.92)` instead of hardcoded darker hex
- `.btn-lg` padding: update to use spacing variables

### Cards (lines 148-166)

**Changes:**
- `background: var(--card-bg)` → now maps to paper-light (already correct)
- `border: 2px solid var(--border-color)` → keep 2px, will use refined color
- `border-radius: var(--radius-md)` (4px) — add this
- `.card::before` offset: keep but use `inset: -6px` syntax

### Forms (lines 168-210)

**Changes:**
- `.form-group label`: change font to Inter (font-ui)
- `.form-control`: `border: 1.5px solid`, `border-radius: var(--radius-sm)`
- `.form-control:focus`: use refined primary color
- Textarea: keep mono font

### Alerts (lines 213-232)

**Changes:**
- Add `border-radius: var(--radius-sm)`
- Use new semantic tokens (error, error-bg, etc.)

### Dividers (lines 235-246)

**Changes:**
- Keep `newspaper-divider` — it's a signature element
- Color uses `var(--border)` (already correct via current var)

---

## New CSS to Add

### Paper Texture (after body styles)

```css
/* Subtle paper texture overlay */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
  mix-blend-mode: multiply;
}
```

### Focus States (keep current, update color)

```css
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Reduced Motion (keep current — already good)

### Keyframes (keep current, add new ones)

Add these keyframes:
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pageReveal {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

@keyframes inkReveal {
  from { stroke-dashoffset: var(--dash-length); }
  to { stroke-dashoffset: 0; }
}
```

### Responsive Breakpoints (update current)

Only update color variables if needed. Layout breakpoints remain unchanged.
