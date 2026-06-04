# BOOP 3.0 — Interaction Guidelines

---

## Design Principles for Interactions

1. **Predictable** — Users should know what will happen before they click
2. **Forgiving** — Mistakes should be easy to undo
3. **Informative** — Every interaction gives clear feedback
4. **Efficient** — Reduce effort, not functionality
5. **Delightful** — Even mundane actions can feel good

---

## Buttons

### Primary Button
```
┌──────────────────────────────┐
│   Create Puzzle Book         │
└──────────────────────────────┘
```

| State | Visual |
|---|---|
| Default | Brand primary fill, white text, 8px radius |
| Hover | Darken by 10%, subtle shadow increase |
| Active | Scale 0.97x |
| Focus | Focus ring (2px brand, 4px offset) |
| Loading | Replace text with spinner, disable |
| Disabled | 50% opacity, no shadow, cursor not-allowed |

**Interaction notes:**
- Minimum touch target: 44px height
- Loading state should appear within 200ms of click
- Disabled buttons should include tooltip explaining why

### Secondary Button
```
┌──────────────────────────────┐
│   Play Online                │
└──────────────────────────────┘
```

| State | Visual |
|---|---|
| Default | Transparent bg, 2px border (border-color), text color |
| Hover | 5% brand color bg, brand border |
| Active | Scale 0.97x |
| Focus | Focus ring |

### Ghost Button
```
┌──────────────────────────────┐
│   Cancel                     │
└──────────────────────────────┘
```

| State | Visual |
|---|---|
| Default | Transparent, text-secondary color |
| Hover | 5% gray background |
| Active | Scale 0.97x |

### Icon Button
- Default: 36x36px, transparent, subtle hover background
- Active states match ghost button
- Tooltip on hover (if no visible label)

---

## Cards

| State | Visual |
|---|---|
| Default | White bg, subtle border, 12px radius, soft shadow |
| Hover | Lift 2px, deeper shadow, slight border color shift |
| Selected | Brand border, brand shadow |
| Focus | Focus ring |

**Interaction notes:**
- Entire card should be clickable (not just text)
- Cursor: pointer on hover
- Transition: all 0.2s ease

---

## Form Inputs

| State | Visual |
|---|---|
| Default | 1px solid border, 8px radius, 44px height |
| Focus | 2px brand border, subtle brand glow |
| Hover | Slightly darker border |
| Error | 2px error border, error icon on right |
| Success | 2px success border, check icon on right |
| Disabled | 50% opacity, gray background |
| Filled | Default state with content |

**Interaction notes:**
- Labels float above on focus (or always visible)
- Error messages appear inline below the field
- Character count for text fields when applicable
- Password fields have show/hide toggle

### Input Types

```
Text Input:    [________________________]
Number Input:  [____]  (with +/- buttons for touch)
Select:        [Dropdown ▼]  (custom styled)
Textarea:      [________________________]
               [________________________]
File Upload:   [Drop file here or click to browse]
Toggle:        [●──○] or [○──●]
Radio:         ○ Option 1  ● Option 2
Checkbox:      ☐ Option 1  ☑ Option 2
```

---

## Dropdowns / Select Menus

| State | Visual |
|---|---|
| Closed | Looks like input, shows selected value or placeholder |
| Open | List overlays content below, 8px radius, max 6 items visible, scroll if more |
| Hover (item) | 5% brand background |
| Selected (item) | Brand checkmark + brand text |
| Search | Filter field at top of dropdown for 8+ options |

**Interaction notes:**
- Close on click outside
- Close on Escape key
- Keyboard navigation (arrow up/down, enter to select)
- Animate height on open/close (max-height transition, 200ms)

---

## Upload Interactions

| State | Visual |
|---|---|
| Default | Dashed border box, cloud upload icon, "Browse" button |
| Drag Over | Brand dashed border, brand bg at 10%, "Drop here" text |
| Uploading | Progress bar (animated), filename shown, cancel button |
| Success | Green check, filename, thumbnail (if image) |
| Error | Red border, error message, retry button |
| Empty | Same as default |

**Interaction notes:**
- Accept common image types (PNG, JPG, WebP)
- Show preview after upload (thumbnail, 80x80px)
- Clear button to remove uploaded file
- File size limit shown before upload

---

## Generation Progress

| State | Visual |
|---|---|
| Idle | "Generate Puzzle Book" button is primary CTA |
| Starting | Button becomes "Starting..." with spinner (brief) |
| In Progress | Progress bar (determinate) + animated page count + current step label |
| Almost Done | Bar reaches 95%, "Finalizing your book..." |
| Complete | Success animation, download button appears |
| Error | Red bar, error message, retry button |

**Interaction notes:**
- Show estimated time remaining (if measurable)
- Allow cancellation (X button or "Cancel" link)
- Progress should be smooth, not jumpy
- Use real generation steps for progress (not fake)

---

## Notifications / Toasts

| Type | Visual | Duration |
|---|---|---|
| Success | Green bar with check icon, top-right | Auto-dismiss after 4s |
| Error | Red bar with X icon, top-right | Manual dismiss only |
| Warning | Amber bar with warning icon, top-right | Auto-dismiss after 6s |
| Info | Blue bar with info icon, top-right | Auto-dismiss after 4s |

**Interaction notes:**
- Stack multiple toasts with 8px gap
- Slide in from right, fade out
- Click to dismiss (any toast)
- Max 3 visible at once

---

## Success States

**After generation completes:**
1. Brief celebration animation (0.5s)
2. Show book preview (flip through pages)
3. Primary CTA: "Download PDF"
4. Secondary: "Share", "Create Another", "Edit Settings"
5. Stats: Generation time, puzzle count, page count

**Other success states:**
- File upload: Green check + thumbnail
- Form submit: Subtle success indicator on button
- Copy to clipboard: Brief "Copied!" tooltip

---

## Error States

**Principles:**
- Never show raw error codes to users
- Explain what happened in plain language
- Suggest the next action
- Log technical details to console

| Scenario | Message | Action |
|---|---|---|
| Generation failed | "Something went wrong while generating your book. Don't worry — your settings are saved." | "Try Again" button |
| Upload failed | "We couldn't upload this file. It may be too large or an unsupported format." | "Choose Different File" button |
| Network error | "Connection lost. Check your internet and try again." | "Retry" button |
| Validation error | Inline message below the field | Fix the field |

---

## Empty States

| Context | Message | Illustration | Action |
|---|---|---|---|
| No puzzles generated | "Ready to create your first puzzle book?" | Empty book illustration | "Create Your First" button |
| No templates selected | "Choose a template to get started." | Grid with question marks | "Browse Templates" button |
| No words selected | "Add some words to generate puzzles." | Empty grid | "Choose Topics" button |
| No search results | "No results found for your search." | Magnifying glass with X | "Clear filters" link |
| No play history | "No puzzles played yet." | Empty game board | "Play Now" button |

---

## Loading States

| Context | Pattern | Duration |
|---|---|---|
| Page transition | Skeleton screen (matching page layout) | Until loaded |
| Data fetch | Skeleton cards or rows | Until loaded |
| Image load | Placeholder with blur-up | Until loaded |
| Generation | Progress bar + step label | Progress-driven |
| File processing | Spinner + filename | Until processed |

**Skeleton pattern:**
- Match the shape of the content being loaded
- Use shimmer animation (linear gradient sweep)
- Gray color with subtle animation
- Avoid spinner-only loading states

---

## Summary: Interaction Speed Targets

| Interaction | Target Response |
|---|---|
| Button click -> visual feedback | < 100ms |
| Form field focus | < 50ms |
| Dropdown open | < 150ms |
| Upload start -> progress visible | < 200ms |
| Generation step change -> UI update | < 500ms |
| Error display | < 300ms |
| Toast appear | < 200ms |
| Page transition (initial load) | < 2s |
| Page transition (subsequent/SPA) | < 500ms |
