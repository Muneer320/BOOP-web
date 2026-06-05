# BOOP 3.0 — Design System

---

## 1. Color Palette

### Brand Colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--brand-primary` | `#4F46E5` (Indigo 600) | `#818CF8` (Indigo 400) | Primary buttons, links, active states |
| `--brand-secondary` | `#F59E0B` (Amber 500) | `#FBBF24` (Amber 400) | Accents, highlights, badges |
| `--brand-gradient` | `linear-gradient(135deg, #4F46E5, #7C3AED)` | Same | Hero backgrounds, special elements |

### Neutral Colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--white` | `#FFFFFF` | — | Surface backgrounds |
| `--bg-primary` | `#F8FAFC` | `#0F172A` | Page background |
| `--bg-secondary` | `#FFFFFF` | `#1E293B` | Card backgrounds |
| `--bg-tertiary` | `#F1F5F9` | `#334155` | Hover states, disabled |
| `--text-primary` | `#0F172A` | `#F1F5F9` | Headings |
| `--text-secondary` | `#475569` | `#94A3B8` | Body text |
| `--text-tertiary` | `#94A3B8` | `#64748B` | Labels, placeholders |
| `--border` | `#E2E8F0` | `#334155` | Dividers, borders |
| `--border-hover` | `#CBD5E1` | `#475569` | Hover borders |

### Semantic Colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--success` | `#10B981` | `#34D399` | Success states |
| `--success-bg` | `#F0FDF4` | `#022C22` | Success backgrounds |
| `--warning` | `#F59E0B` | `#FBBF24` | Warning states |
| `--warning-bg` | `#FFFBEB` | `#451A03` | Warning backgrounds |
| `--error` | `#EF4444` | `#F87171` | Error states |
| `--error-bg` | `#FEF2F2` | `#450A0A` | Error backgrounds |
| `--info` | `#3B82F6` | `#60A5FA` | Info states |
| `--info-bg` | `#EFF6FF` | `#0C1929` | Info backgrounds |

### Puzzle-Specific Colors

| Token | Value | Usage |
|---|---|---|
| `--grid-cell` | `#F8FAFC` / `#1E293B` | Puzzle grid cells |
| `--grid-cell-alt` | `#F1F5F9` / `#334155` | Alternating grid cells |
| `--grid-border` | `#CBD5E1` / `#475569` | Grid borders |
| `--word-found` | `#10B981` / `#34D399` | Found word highlight |
| `--word-hint` | `#FBBF24` | Hint highlight |
| `--selection` | `#4F46E5` at 20% | Selection highlight |

---

## 2. Typography

### Font Stacks

| Usage | Font | Fallback |
|---|---|---|
| Headings (h1-h4) | Inter | system-ui, -apple-system, sans-serif |
| Body | Inter | system-ui, -apple-system, sans-serif |
| UI (buttons, labels) | Inter | system-ui, -apple-system, sans-serif |
| Monospace (grids, code) | JetBrains Mono | "Fira Code", "Cascadia Code", monospace |

### Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| h1 | 3rem (48px) | 700 | 1.1 | -0.02em | Hero heading |
| h2 | 2.25rem (36px) | 700 | 1.2 | -0.01em | Section headings |
| h3 | 1.5rem (24px) | 600 | 1.3 | 0 | Card titles |
| h4 | 1.25rem (20px) | 600 | 1.4 | 0 | Subsection titles |
| body-lg | 1.125rem (18px) | 400 | 1.6 | 0 | Featured text |
| body | 1rem (16px) | 400 | 1.6 | 0 | Body text |
| body-sm | 0.875rem (14px) | 400 | 1.5 | 0 | Captions, metadata |
| caption | 0.75rem (12px) | 500 | 1.4 | 0.01em | Labels, timestamps |
| overline | 0.75rem (12px) | 600 | 1 | 0.08em | Section labels, badges |
| button | 0.875rem (14px) | 600 | 1 | 0.02em | Button text |

---

## 3. Spacing Scale

| Token | Value | Example |
|---|---|---|
| `--space-1` | 4px | Gap between icon and text |
| `--space-2` | 8px | Input padding, small gaps |
| `--space-3` | 12px | Button padding |
| `--space-4` | 16px | Card padding, form gaps |
| `--space-5` | 24px | Section spacing |
| `--space-6` | 32px | Component spacing |
| `--space-8` | 48px | Section margin |
| `--space-10` | 64px | Large section gaps |
| `--space-12` | 80px | Page section spacing |
| `--space-16` | 96px | Maximum content gap |

---

## 4. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 4px | Badges, small UI elements |
| `--radius-md` | 8px | Buttons, inputs, cards |
| `--radius-lg` | 12px | Modals, larger cards |
| `--radius-xl` | 16px | Containers, sections |
| `--radius-full` | 9999px | Pills, avatars, toggle knobs |

---

## 5. Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(15, 23, 42, 0.05)` | Subtle separation |
| `--shadow-sm` | `0 1px 3px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(15, 23, 42, 0.06)` | Cards, inputs |
| `--shadow-md` | `0 4px 6px rgba(15, 23, 42, 0.07), 0 2px 4px rgba(15, 23, 42, 0.06)` | Dropdowns, hover state |
| `--shadow-lg` | `0 10px 15px rgba(15, 23, 42, 0.1), 0 4px 6px rgba(15, 23, 42, 0.05)` | Modals, overlays |
| `--shadow-xl` | `0 20px 25px rgba(15, 23, 42, 0.1), 0 8px 10px rgba(15, 23, 42, 0.05)` | Full-screen overlays |
| `--shadow-brand` | `0 4px 14px rgba(79, 70, 229, 0.3)` | Primary button |

**Dark mode shadows:** Use black with adjusted opacity (generally lower opacity since dark surfaces already have depth).

---

## 6. Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `--z-base` | 1 | Content |
| `--z-sticky` | 100 | Sticky header |
| `--z-dropdown` | 200 | Dropdowns, tooltips |
| `--z-overlay` | 300 | Modals, backdrops |
| `--z-toast` | 400 | Toasts |
| `--z-loader` | 500 | Loading overlays |

---

## 7. Buttons

| Property | Primary | Secondary | Ghost | Danger |
|---|---|---|---|---|
| Height | 44px | 44px | 44px | 44px |
| Padding | 16px 24px | 16px 24px | 12px 16px | 16px 24px |
| Radius | 8px | 8px | 8px | 8px |
| Font | Inter 14px/600 | Inter 14px/600 | Inter 14px/600 | Inter 14px/600 |
| Background | brand-primary | transparent | transparent | error |
| Text color | white | text-primary | text-secondary | white |
| Border | none | 1.5px solid border | none | none |
| Hover bg | darken 10% | bg-tertiary | bg-tertiary | darken 10% |
| Focus ring | brand 2px + 4px offset | brand 2px + 4px offset | brand 2px + 4px offset | error 2px + 4px offset |

### Button Sizes

| Size | Height | Padding | Font |
|---|---|---|---|
| sm | 36px | 12px 16px | 13px |
| md (default) | 44px | 16px 24px | 14px |
| lg | 52px | 20px 32px | 16px |

---

## 8. Inputs

| Property | Value |
|---|---|
| Height | 44px |
| Padding | 12px 16px |
| Radius | 8px |
| Font | Inter 14px |
| Background | bg-primary |
| Border | 1.5px solid border |
| Text color | text-primary |
| Placeholder | text-tertiary |
| Focus border | brand-primary (2px) |
| Focus ring | brand at 15% (as box-shadow) |
| Error border | error (2px) |
| Disabled bg | bg-tertiary |

---

## 9. Cards

| Property | Default Card | Interactive Card | Featured Card |
|---|---|---|---|
| Background | bg-secondary | bg-secondary | brand-gradient |
| Padding | 24px | 24px | 24px |
| Radius | 12px | 12px | 12px |
| Border | 1px solid border | 1px solid border | none |
| Shadow | shadow-sm | shadow-sm | shadow-lg |
| Hover | — | translateY(-2px), shadow-md | translateY(-2px), shadow-xl |
| Text color | text-primary | text-primary | white |

---

## 10. Modals

| Property | Value |
|---|---|
| Padding | 32px |
| Radius | 16px |
| Background | bg-secondary |
| Shadow | shadow-xl |
| Max width | 480px (default), 640px (large) |
| Backdrop | rgba(15, 23, 42, 0.5), backdrop-blur(4px) |
| Animation | scale(0.95→1.0) + fade, 250ms |

---

## 11. Tooltips

| Property | Value |
|---|---|
| Background | text-primary (or dark surface) |
| Text color | bg-primary (contrasting) |
| Radius | 6px |
| Padding | 8px 12px |
| Font | Inter 12px/500 |
| Arrow | 4px triangle, same color as bg |
| Offset | 8px from target |
| Animation | fade + translateY(-4px), 150ms, 300ms delay |

---

## 12. Badges

| Property | Default | Success | Warning | Error | Brand |
|---|---|---|---|---|---|
| Radius | 6px | 6px | 6px | 6px | 6px |
| Padding | 4px 10px | 4px 10px | 4px 10px | 4px 10px | 4px 10px |
| Font | 12px/500 | 12px/500 | 12px/500 | 12px/500 | 12px/500 |
| Background | bg-tertiary | success-bg | warning-bg | error-bg | brand (at 10%) |
| Text | text-secondary | success | warning | error | brand-primary |

---

## 13. Navigation

### Main Nav

| Property | Desktop | Mobile |
|---|---|---|
| Height | 64px | 56px |
| Background | transparent → bg-secondary with blur on scroll | same |
| Padding | 0 24px | 0 16px |
| Logo size | 32px height | 28px height |
| Link padding | 8px 16px | 16px 24px (full width) |
| Active indicator | Bottom border (2px brand) | Left border (3px brand) |

### Tab Bar (Within pages)

| Property | Value |
|---|---|
| Height | 44px |
| Active tab | brand text + bottom border |
| Inactive tab | text-secondary, hover → text-primary |
| Padding | 0 16px |

---

## 14. Responsive Breakpoints

| Name | Width | Target |
|---|---|---|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets, small laptops |
| Desktop | 1024px - 1280px | Laptops |
| Wide | > 1280px | Large screens |

### Container Max-Width

| Breakpoint | Max width | Padding |
|---|---|---|
| Desktop+ | 1200px | 24px |
| Tablet | 100% | 24px |
| Mobile | 100% | 16px |

---

## 15. Grid System

- 12-column grid on desktop
- 8-column on tablet
- 4-column on mobile
- Column gap: 24px (desktop), 16px (mobile)

---

## 16. CSS Variable Migration (from current → new)

| Current | New |
|---|---|
| `--primary: #3a6b35` | `--brand-primary: #4F46E5` |
| `--secondary: #c4956a` | `--brand-secondary: #F59E0B` |
| `--light: #f5f0e8` | `--bg-primary: #F8FAFC` |
| `--dark: #2c1810` | `--text-primary: #0F172A` |
| `--bg-primary: #faf7f0` | `--bg-primary: #F8FAFC` |
| `--bg-secondary: #f5f0e8` | `--bg-secondary: #FFFFFF` |
| `--text-primary: #2c1810` | `--text-primary: #0F172A` |
| `--text-secondary: #6b5a48` | `--text-secondary: #475569` |
| `--border-color: #d4c9b8` | `--border: #E2E8F0` |
| `--card-bg: #fdfaf4` | `--bg-secondary: #FFFFFF` |
| `--shadow` | `--shadow-sm` |
| `--shadow-lg` | `--shadow-lg` |
| `--font-heading: Georgia, serif` | Remove (single font stack) |
| `--font-body: Palatino, serif` | `--font-sans: Inter, system-ui` |
| `--font-ui: Trebuchet MS` | (merged into font-sans) |

**Note:** This migration would be a breaking visual change. A phased approach is recommended:
1. Add new CSS variables alongside existing ones
2. Update components one at a time
3. Remove old variables when all components are migrated
