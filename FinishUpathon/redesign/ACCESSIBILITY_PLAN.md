# BOOP 3.0 — Accessibility Plan

---

## Standards

- Target: **WCAG 2.2 AA** (minimum)
- Stretch goal: **WCAG 2.2 AAA** for color contrast
- Follow: **WAI-ARIA Authoring Practices** for interactive elements

---

## 1. Keyboard Navigation

### Current State
- Partial: Focus-visible outlines exist
- Partial: Most form elements are keyboard-accessible
- Missing: Custom components (dropdowns, modals, tooltips) lack full keyboard support

### Required Changes

| Component | Keyboard Behavior |
|---|---|
| All interactive elements | Tab order follows visual order |
| Custom dropdowns | Arrow up/down to navigate, Enter to select, Escape to close |
| Modals | Focus trap: Tab cycles within modal, Escape closes, focus returns to trigger |
| Accordion (FAQ) | Enter/Space to toggle, Arrow keys optional |
| Tooltips | Escape to dismiss, tooltip appears on focus |
| Tabs | Arrow keys to switch tabs, Tab to enter tab panel |
| Sliders | Arrow keys to adjust, Home/End for min/max |
| Skip link | "Skip to main content" — visible on first Tab press |

### Implementation

```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Focus trap for modal -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <!-- Focusable elements only within here when open -->
</div>
```

---

## 2. Color Contrast

### Minimum Ratios

| Text Type | Normal | Large (18px+ or 14px+ bold) | AAA |
|---|---|---|---|
| Normal text | 4.5:1 | 3:1 | 7:1 |
| UI components | 3:1 | 3:1 | — |
| Decorative | No requirement | No requirement | — |

### Current Audit (Old Palette)

| Pair | Ratio | Passes AA? |
|---|---|---|
| `#3a6b35` on `#faf7f0` | 4.8:1 | ✓ |
| `#8b7d6b` on `#faf7f0` | 3.2:1 | ✗ (normal text) |
| `#c4956a` on `#fdfaf4` | 2.8:1 | ✗ |
| `#6b5a48` on `#f5f0e8` | 3.8:1 | ✗ (normal text) |

### Required Changes (New Palette)

| Pair | Ratio | Passes? |
|---|---|---|
| `#4F46E5` on `#FFFFFF` | 7.2:1 | ✓ (AAA) |
| `#475569` on `#FFFFFF` | 5.8:1 | ✓ (AA) |
| `#94A3B8` on `#FFFFFF` | 3.4:1 | ✗ (text) / ✓ (decorative) |
| `#0F172A` on `#F8FAFC` | 15.8:1 | ✓ (AAA) |
| `#475569` on `#F8FAFC` | 5.3:1 | ✓ (AA) |
| `#EF4444` on `#FFFFFF` | 4.5:1 | ✓ (AA) |

**Critical:** Ensure `text-tertiary` (`#94A3B8` light, `#64748B` dark) is only used for decorative/disabled elements, never for essential text.

---

## 3. Screen Readers

### ARIA Landmarks

```html
<header role="banner">...</header>
<nav role="navigation" aria-label="Main">...</nav>
<main role="main" id="main-content">...</main>
<footer role="contentinfo">...</footer>
```

### Dynamic Content

| Event | ARIA | Description |
|---|---|---|
| Generation progress | `role="progressbar"` + `aria-valuenow` | Announces current step |
| Error message | `role="alert"` | Immediately announced |
| Toast notification | `role="status"` + `aria-live="polite"` | Announced when appears |
| Modal opens | Focus moved to modal, `aria-hidden` on background | Screen reader confined to modal |
| Success state | `role="status"` | "Your puzzle book is ready" |
| Loading state | `aria-busy="true"` | Indicates content is loading |

### Images

```html
<!-- Decorative images -->
<img src="background.jpg" alt="" role="presentation" />

<!-- Informational images -->
<img src="cover-preview.jpg" alt="Preview of puzzle book cover with title 'Animal Word Search'" />
```

### Form Labels

All form inputs must have explicit labels:
```html
<label for="book-title">Book Title</label>
<input id="book-title" type="text" ... />

<!-- Or aria-label when visual label is not present -->
<button aria-label="Close modal">✕</button>
```

---

## 4. Motion Preferences

### Current State
- `prefers-reduced-motion` media query exists
- Reduces all animation durations to 0.01ms

### Required Changes
- Test all animations with the media query active
- Ensure no content is hidden due to animation being disabled
- Provide alternative static states for:
  - Scroll-triggered reveals (show all content immediately)
  - Skeleton loaders (show static gray blocks)
  - Confetti (just show success state without particles)
  - Page transitions (instant switch, no fade)
- Consider reduced-transparency preference for glassmorphism effects

---

## 5. Focus States

### Current State
- `:focus-visible` outlines exist with `2px solid var(--primary)`
- Basic outlines present

### Required Improvements

| Element | Focus Style |
|---|---|
| Links | 2px solid brand-primary, 2px offset |
| Buttons | 2px solid brand-primary, 4px offset |
| Inputs | 2px brand border + subtle brand glow |
| Cards | 2px dashed brand-border on card container |
| Custom dropdowns | Focus ring on trigger, highlight on focused option |

**Important:** Focus styles must have 3:1 contrast ratio against the background.

```css
:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
  border-radius: inherit; /* Match element's border-radius */
}

/* Remove default focus for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 6. Touch Targets

### Minimum Sizes

| Element | Minimum Size | Recommended |
|---|---|---|
| Buttons | 44x44px | 48x48px |
| Links in text | 44x44px (padding) | 44x44px |
| Form inputs | 44px height | 48px height |
| Icon buttons | 44x44px (with padding) | 44x44px |
| Toggle switches | 44px height | 48px height |
| Dropdown options | 44px height | 48px height |

### Spacing
- Minimum 8px gap between touch targets
- At 4px gap, provide visual separator

---

## 7. Additional Requirements

### Reading Order
- Ensure DOM order matches visual order
- CSS grid/flexbox reordering should not change screen reader order

### Zoom / Scaling
- No horizontal scroll at 200% zoom
- Text can be resized up to 200% without loss of content
- Use relative units (rem, em) for text and spacing

### Color Independence
- Never use color alone to convey information
- Error states: red border + error icon + error text
- Success states: green border + checkmark + success text
- Links: underlined in addition to color

### Reduced Data
- Respect `prefers-reduced-data` (future)
- Offer lite version of the site with fewer animations/images

---

## 8. Testing Checklist

- [ ] Navigate entire app with keyboard only (Tab, Shift+Tab, Enter, Escape, Arrow keys)
- [ ] Test with screen reader (NVDA or VoiceOver) on all pages
- [ ] Verify focus order matches visual order
- [ ] Test all color combinations with contrast checker
- [ ] Test at 200% zoom with no horizontal overflow
- [ ] Test with prefers-reduced-motion enabled
- [ ] Verify all touch targets are at least 44x44px
- [ ] Test forms with autofill
- [ ] Verify all images have appropriate alt text
- [ ] Test error and success states with screen reader
- [ ] Verify modal focus trap works correctly
- [ ] Test on mobile with accessibility services (TalkBack, VoiceOver)
