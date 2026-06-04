# BOOP 3.0 — Motion Design System

---

## Motion Philosophy

Movement in BOOP should feel **purposeful, not decorative**. Every animation should serve one of these goals:

1. **Guide attention** — Show users where to look next
2. **Provide feedback** — Confirm actions and state changes
3. **Create continuity** — Smooth transitions between states
4. **Express personality** — Make interactions feel human
5. **Reduce perceived wait time** — Make loading feel faster

---

## Motion Principles

| Principle | Description |
|---|---|
| **Fast** | Animations should feel instant, not sluggish. Default: 200-300ms |
| **Natural** | Use easing curves that mimic physics (ease-out for entrances, ease-in for exits) |
| **Subtle** | If the user notices the animation over the content, it's too much |
| **Consistent** | Same duration/easing for same types of transitions |
| **Respectful** | Respect `prefers-reduced-motion` |

---

## Duration Guidelines

| Context | Duration | Example |
|---|---|---|
| Micro-interactions | 100-150ms | Button hover, checkbox toggle |
| UI transitions | 200-300ms | Card expand, dropdown open |
| Page transitions | 300-500ms | Route change content fade |
| Scroll reveals | 400-600ms | Element entering viewport |
| Loading states | 600-1200ms | Skeleton shimmer cycle |
| Celebrations | 500-1000ms | Success confetti, completion |
| Ambient | 2000-4000ms | Background gradient animation |

---

## Easing Curves

| Name | Cubic Bezier | Use Case |
|---|---|---|
| **Ease Out** | `cubic-bezier(0.16, 1, 0.3, 1)` | Default for elements entering |
| **Ease In** | `cubic-bezier(0.4, 0, 0.68, 0.06)` | Elements exiting |
| **Ease In Out** | `cubic-bezier(0.65, 0, 0.35, 1)` | Transitions between states |
| **Spring** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Celebrations, playful moments |
| **Linear** | `cubic-bezier(0, 0, 1, 1)` | Progress bars, continuous animations |

---

## Page Transitions

### Route Change
- **What:** Content fades out, new content fades in
- **How:** Fade + subtle translateY (10px)
- **Duration:** 300ms each direction
- **Easing:** Ease-out for entrance, ease-in for exit
- **Trigger:** Route change in React Router

### Content Sections (Scroll)
- **What:** Elements animate in as they enter viewport
- **How:** Fade + translateY(20px), staggered within section
- **Duration:** 500ms per element, 80ms stagger delay
- **Easing:** Ease-out
- **Trigger:** Intersection Observer

### Section Backgrounds
- **What:** Subtle parallax or color shift as user scrolls
- **How:** Transform or background-position change
- **Duration:** Continuous (linked to scroll position)
- **Scale:** Very subtle (5-10px movement)

---

## Hover States

### Buttons
- **What:** Background color shift, shadow deepen
- **Duration:** 150ms
- **Easing:** Ease-out
- **Extra:** Primary buttons also scale 1.02x on hover

### Cards
- **What:** Lift (translateY -3px), shadow deepen
- **Duration:** 250ms
- **Easing:** Ease-out
- **Extra:** Border color shifts to brand color

### Links
- **What:** Underline slide in (from left or center)
- **Duration:** 200ms
- **Easing:** Ease-out

### Puzzle Elements (Preview)
- **What:** Cell background color shift
- **Duration:** 150ms
- **Easing:** Ease-out

---

## Loading Animations

### Page Load / Skeleton
- **What:** Shimmer effect across skeleton shapes
- **How:** Linear gradient moving left to right
- **Duration:** 1.5s cycle, repeats 3-4 times
- **Easing:** Linear
- **Colors:** Start at skeleton-bg, sweep to skeleton-highlight, back to skeleton-bg

### Generation Progress
- **What:** Progress bar filling from left to right
- **How:** Smooth width transition based on progress %
- **Duration:** Step changes animate over 400ms
- **Easing:** Ease-out
- **Extra:** Pulse effect at the leading edge of the bar

### Button Loading
- **What:** Spinner replaces text
- **How:** 360deg rotation
- **Duration:** 600ms per rotation
- **Easing:** Linear

### File Upload
- **What:** Progress bar + pulsing upload icon
- **How:** Bar fills based on upload progress, icon pulses gently
- **Duration:** Real-time (based on upload)

---

## Card Reveals

### Grid of Cards (Features, Templates)
- **What:** Cards fade in one by one from bottom
- **Stagger:** 60ms between each card
- **Direction:** Left to right, top to bottom
- **Duration:** 400ms per card
- **Easing:** Ease-out

### Single Card (Testimonial, Step)
- **What:** Card slides in and fades
- **Duration:** 500ms
- **Easing:** Ease-out (with slight spring for personality)

---

## Success Celebrations

### Generation Complete
**Level 1 — Subtle (default)**
- **What:** Button text changes to "Complete!", checkmark appears
- **Duration:** 300ms
- **Easing:** Spring

**Level 2 — Default**
- **What:** Checkmark circle draws, button transforms, success banner appears
- **Duration:** 600ms total
- **Sequence:**
  1. Button color shifts to success (200ms)
  2. Checkmark circle draws (300ms, ease-out)
  3. Success banner slides in from bottom (400ms)
  4. Download button pulses gently (continuous, subtle)

**Level 3 — Celebration (for completions under 30s)**
- **What:** Same as Level 2 + confetti burst
- **Duration:** 1000ms active + 2000ms settling
- **Confetti:** 30 small squares in brand colors, random positions, fall down with rotation
- **Easing:** Gravity-based (ease-in on way down)

---

## Microinteractions

### Theme Toggle
- **What:** Icon rotates 360deg, sun becomes moon (or vice versa)
- **Duration:** 400ms
- **Easing:** Spring (bouncy)
- **Color:** Background transitions smoothly via CSS variable change

### Copy to Clipboard
- **What:** Button text briefly changes to "Copied!" + checkmark
- **Duration:** 200ms show, 2000ms hold, 200ms revert

### Toggle / Switch
- **What:** Knob slides left/right, background color transitions
- **Duration:** 200ms
- **Easing:** Spring

### Accordion (FAQ)
- **What:** Content expands/collapses with smooth height transition
- **Duration:** 250ms
- **Easing:** Ease-out
- **Extra:** Chevron rotates 180deg on open

### Progress Step
- **What:** Step number background fills in, checkmark draws
- **Duration:** 300ms per step
- **Easing:** Ease-out

### Tooltip
- **What:** Fades in + slight translateY(-4px)
- **Duration:** 150ms
- **Easing:** Ease-out
- **Delay:** 300ms before showing (avoids flicker on quick hovers)

---

## State Transitions

### Error → Normal
- **What:** Shake animation (left-right) on the error container
- **Duration:** 400ms
- **Easing:** Ease-in-out
- **Then:** 200ms pause + revert to normal state

### Empty → Filled
- **What:** Content fades in smoothly
- **Duration:** 300ms
- **Easing:** Ease-out

### Modal Open
- **What:** Backdrop fades in (200ms), modal scales from 0.95 to 1.0 with fade (250ms)
- **Easing:** Ease-out for modal, linear for backdrop

### Modal Close
- **What:** Modal scales to 0.95 + fades out (150ms), backdrop fades out (150ms)
- **Easing:** Ease-in

---

## Reduced Motion Support

When `prefers-reduced-motion: reduce` is detected:

- **Disable:** All scroll-triggered animations
- **Disable:** Parallax effects
- **Disable:** Confetti celebrations
- **Disable:** Skeleton shimmer (show static skeleton)
- **Disable:** Hover animations (lift, shake)
- **Keep:** Progress bar updates (functional, not decorative)
- **Keep:** Modal transitions (opacity-only, no scale)
- **Keep:** Toast appear/disappear (opacity-only)

Implementation:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Animation Implementation Patterns

### CSS Transitions (Preferred for state changes)
```css
.element {
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

### CSS Animations (For keyframe-based)
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Intersection Observer (For scroll reveals)
```javascript
// Use Intersection Observer API
// Add class to trigger animation when element enters viewport
```

### React Transition Group (For mount/unmount animations)
```javascript
// Use for modals, toasts, dropdowns
// CSSTransition for enter/exit animations
```

### Framer Motion (Optional, for complex animations)
- Staggered reveals
- Layout animations
- Drag interactions
- Gesture-based animations

**Recommendation:** Start with CSS transitions and animations. They cover 90% of needs without adding dependencies. Add Framer Motion only for complex gesture-based interactions.
