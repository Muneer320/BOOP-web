# BOOP 3.0 — Mobile Experience

---

## Mobile-First Principles

1. **Tap targets are minimum 44x44px** — No exceptions
2. **Content fills the width** — No horizontal overflow
3. **Forms are single-column** — No multi-column layouts that break
4. **Touch is primary** — Hover is optional; all interactions work with tap
5. **Keyboard-aware** — Forms scroll into view when keyboard opens
6. **Thumb-friendly** — Primary actions in the bottom half of the screen

---

## Mobile Navigation

### Pattern: Bottom Tab Bar (Mobile Web)

```
┌─────────────────────────────────────────┐
│                                         │
│              MAIN CONTENT               │
│                                         │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  [Home]  [Create]  [Play]  [More ⬆]     │
└─────────────────────────────────────────┘
```

| Tab | Icon | Label |
|---|---|---|
| Home | House | Home |
| Create | Plus square | Create |
| Play | Play | Play |
| More | Dots/Hamburger | More (Templates, About, Settings) |

**Behavior:**
- Fixed bottom, always visible
- Active tab highlighted with brand color
- "Create" is the primary action (slightly larger or prominent)
- "More" opens a slide-up sheet with additional links

### Alternative: Collapsible Top Nav
If bottom tabs are not feasible, keep current hamburger pattern but:
- Full-screen overlay menu (not side drawer)
- Large touch targets
- Smooth slide-in animation
- Close on tap outside or swipe down

---

## Mobile Landing Page

### Adjustments from Desktop

| Section | Mobile Layout |
|---|---|
| Hero | Single column, visual below text |
| Social proof | Horizontal scrollable row |
| Output showcase | Single column, full-width images |
| How it works | Vertical steps (stacked) |
| Features | Single column |
| Templates | Horizontal carousel (swipeable) |
| Testimonials | Single card, swipe to next |
| Use cases | 2-column grid, then 1-column on small screens |
| FAQ | Full-width accordion |
| Final CTA | Full-width button |

### Hero Adjustments
- Headline: smaller (clamp 2rem-3rem)
- Subheadline: full width
- CTAs: stacked vertically, full width, large tap targets
- Hero visual: simplified (static or lighter animation)

---

## Mobile Create Flow

The single-page creation hub adapts to mobile by stacking vertically:

### Layout

```
┌─────────────────────────┐
│    Book Title           │
│    [My Puzzle Book]     │
├─────────────────────────┤
│    Difficulty           │
│    [Easy] [Med] [Hard]  │
├─────────────────────────┤
│    Puzzles: [12]        │
├─────────────────────────┤
│    Word Selection       │
│    [Choose Topics ▼]    │
├─────────────────────────┤
│    Live Preview         │
│    (Smaller, swipeable) │
├─────────────────────────┤
│    [GENERATE BOOK]      │
└─────────────────────────┘
```

### Key Changes on Mobile

1. **Preview is collapsible** — Shows as a thumbnail; tap to expand full-screen
2. **All sections are accordion** — Only 1-2 sections open at a time
3. **Generate button stuck to bottom** — Fixed position when scrolled down
4. **Number inputs use stepper** — +/- buttons for puzzle count
5. **File uploads use camera** — Option to take a photo for cover image
6. **Word input uses keyboard** — Auto-focus on custom word input

---

## Mobile Play Flow

### Adjustments
- **Full-screen game mode** — Content fills viewport, header hides during play
- **Touch-optimized drag** — Drag to select words; use touch events, not mouse
- **Pinch to zoom** — On small grids, allow pinch to enlarge
- **Landscape mode** — Grid expands horizontally in landscape
- **Timer visible** — Compact timer in top-right corner

### Grid Cell Size
- Minimum: 36x36px (touch target)
- Maximum: fits viewport width (usually 40-48px)
- On phones < 375px width: show fewer cells or add horizontal scroll

---

## Mobile Responsive Patterns

### Template Gallery
- Horizontal carousel with snap scrolling
- Show 1.2 cards at a time (peek at next card)
- Swipe left/right to browse
- Tap card to select/preview

### Feature Grid
- Single column, full-width cards
- Reduced padding (16px instead of 24px)
- Smaller icons (20px instead of 24px)

### Testimonials
- Single card, full width
- Swipe to next
- Dots indicator at bottom

### Tables (Puzzle Details)
- Convert to stacked cards on mobile
- Key-value pairs in vertical list
- Hide less important columns

---

## Touch Interactions

| Desktop | Mobile |
|---|---|
| Hover to show tooltip | Tap to show tooltip |
| Drag to select words | Touch-drag to select words (same event) |
| Click to expand | Tap to expand |
| Double-click | Avoid double-tap actions |
| Right-click context menu | Long-press for options |
| Scroll wheel | Touch scroll |

---

## Mobile-Specific Features

### Camera Upload
- When uploading cover/background images
- Show "Take Photo" option
- Uses native camera via `capture` attribute

### Share Sheet
- After generation complete
- "Share" button opens native share sheet
- Share PDF or link

### Haptic Feedback (Future)
- Brief vibration on generation complete
- On word found in puzzle game
- Only on devices that support it

---

## Performance Targets on Mobile

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |

### Optimization Checklist
- [ ] Code splitting for all routes
- [ ] Lazy load images below the fold
- [ ] WebP image format
- [ ] Preload critical fonts
- [ ] Minify CSS/JS
- [ ] Service worker for offline support (future)
- [ ] Reduce bundle size (remove unused imports)
- [ ] Use CSS transforms (not layout-triggering properties) for animations

---

## Mobile Testing Checklist

| Device | Screen Size | Test |
|---|---|---|
| iPhone SE | 375x667 | Minimum width, all flows work |
| iPhone 14 | 390x844 | Mainline testing |
| iPhone 14 Pro Max | 430x932 | Large phone, no layout breakage |
| Pixel 7 | 412x915 | Android testing |
| Samsung S23 | 360x780 | Samsung browser |
| iPad Mini | 768x1024 | Tablet mode |
| iPad Pro | 1024x1366 | Large tablet, landscape |

Test on:
- Chrome DevTools mobile emulation
- Physical device for touch interactions
- Low-end device for performance
- Slow network (3G throttling) for loading experience
