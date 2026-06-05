# BOOP 3.0 — Landing Page Masterplan

---

## Design Philosophy

The landing page should not *describe* what BOOP does. It should *demonstrate* it.

Every pixel should build trust, create desire, and reduce friction to the first creation.

---

## Section Inventory

```
1.  HEADER / NAVIGATION
2.  HERO
3.  SOCIAL PROOF (Logos / Stats)
4.  OUTPUT SHOWCASE (What You Can Make)
5.  HOW IT WORKS (Animated workflow)
6.  FEATURES (Benefit-driven)
7.  TEMPLATES GALLERY (Quick-start inspiration)
8.  TESTIMONIALS (Social proof)
9.  USE CASES (By persona)
10. PUBLISHING SHOWCASE (Premium output examples)
11. FAQ
12. FINAL CTA
13. FOOTER
```

---

## 1. HEADER / NAVIGATION

**Purpose:** Brand reinforcement + primary navigation

**Content:**
- BOOP wordmark (left) — clickable to home
- Navigation links (right): Create, Play, Templates, About
- Theme toggle (sun/moon)

**Layout:**
- Fixed position, transparent on hero, white on scroll
- 1280px max width, centered

**Animations:**
- Sticky header slides down on scroll-up, hides on scroll-down
- Background blur on scroll (backdrop-filter: blur(12px))

**Copy:**
- No tagline in header (save for hero)

---

## 2. HERO

**Purpose:** Instant value proposition + emotional hook

**Content:**
- Badge: "Puzzle Book Generator" → "Professional Puzzle Publishing"
- Headline: "Puzzle Books, Professional-Grade."
- Subheadline: "From word list to printable book in minutes. Create beautiful, print-ready puzzle books with the click of a button."
- Primary CTA: "Create Your First Puzzle Book" (links to /create)
- Secondary CTA: "Play Online" (links to /play)
- Visual: Animated mockup of a puzzle book being built page by page, or a rotating 3D book showcase

**Layout:**
- Two-column (text left, visual right)
- Text column: 50% width
- Visual column: 50% width

**Animations:**
- Headline: Staggered letter or word reveal (fade up, 0.3s each)
- Subheadline: Fade up (0.6s delay)
- CTAs: Fade up (0.8s delay)
- Visual: Float-in from right (1s, spring easing)
- Ambient: Subtle particle/letter grid in background

**Key Details:**
- H1 must work without the visual (for accessibility, slow connections)
- CTA must be the most prominent element (use brand primary color)
- The word "Professional-Grade" should be subtly highlighted

---

## 3. SOCIAL PROOF

**Purpose:** Build trust immediately after the hero

**Content:**
- "Trusted by educators, publishers, and puzzle lovers everywhere"
- Logo bar: Mock university, school district, or generic "partner" logos (if real ones exist)
- Stat row: "12,000+ puzzles generated" / "500+ books created" / "4.8 ★ average rating"
- Alternative: "As featured on" badges (Product Hunt, GitHub Trending, etc.)

**Layout:**
- Full-width, centered text
- Row of grayscale logos (or stats) with 200px height
- Subtle divider line above and below

**Animations:**
- Logos/stats fade in on scroll (staggered, 0.1s each)

---

## 4. OUTPUT SHOWCASE

**Purpose:** Let the output sell itself

**Content:**
- Headline: "See What You Can Create"
- 3-4 mockups showing different puzzle book styles:
  1. Educational (themed puzzles, colorful)
  2. Professional KDP (bleeds, clean design)
  3. Fun/Party (events, custom words)
  4. Bonus/Solutions (the answer key section)
- Each mockup has: title, description, "Use this style" button

**Layout:**
- 2x2 grid (desktop), 1-column stack (mobile)
- Each card: full-bleed mockup image + text overlay
- Tabs or filter buttons to switch between categories

**Animations:**
- Staggered card reveal on scroll
- Hover: subtle lift (translateY(-4px) + shadow deepen)
- Click: book opens with page flip effect (shows 2-3 pages)

---

## 5. HOW IT WORKS

**Purpose:** Explain the workflow simply

**Content:**
- Headline: "Three Steps to a Published Puzzle Book"
- Step 1: "Set Your Preferences" — Choose title, difficulty, puzzle count
  - Visual: Animated settings panel
- Step 2: "Choose Your Words" — Pick topics, type words, or upload a file
  - Visual: Words flowing into a grid
- Step 3: "Download & Print" — Professional PDF ready in minutes
  - Visual: Book assembling itself, then download arrow

**Layout:**
- Horizontal 3-column (desktop), vertical (mobile)
- Each step: number + icon + title + description + mini animation
- Connected by animated dashed line

**Animations:**
- Steps reveal on scroll (horizontal progress bar fills as you scroll)
- Each step's mini animation plays when it enters viewport

---

## 6. FEATURES

**Purpose:** Detail capabilities for evaluation

**Content:**
- Headline: "Everything You Need to Create Amazing Puzzle Books"
- Feature grid:
  1. "Preset Topics" — Library of curated word lists
  2. "Custom Words" — Type or upload your own
  3. "6 Difficulty Levels" — Easy through Nightmare
  4. "PDF Export" — Print-ready, professional quality
  5. "Play Online" — Solve in your browser
  6. "Custom Covers" — Upload your own images
  7. "Multiple Grid Sizes" — From 8x8 to 20x20
  8. "Bonus Puzzles" — Add extra puzzle sections
  (Note: Replace generic icons with product-specific symbols)

**Layout:**
- 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Each card: icon (24px) + heading + description (1-2 lines)

**Animations:**
- Cards enter from alternating sides (left-right) on scroll
- Hover: subtle lift, icon color shift

---

## 7. TEMPLATES GALLERY

**Purpose:** Inspiration + quick-start conversion

**Content:**
- Headline: "Start with a Template"
- 6 template cards:
  - "Animals Word Search" (Elementary)
  - "Geography Challenge" (Education)
  - "Holiday Fun Pack" (Seasonal)
  - "Sports Spectacular" (Kids)
  - "Science Vocabulary" (STEM)
  - "Create Your Own" (Blank template)
- Each card: book cover mockup + title + difficulty + puzzle count + "Use This Template" button

**Layout:**
- 3x2 grid (desktop), 1-column (mobile)
- Carousel on tablet/mobile (swipeable)

**Animations:**
- Book covers tilt slightly on hover (3D perspective)
- Click "Use Template" → smooth transition to /create with pre-filled settings

---

## 8. TESTIMONIALS

**Purpose:** Social proof from real users

**Content:**
- Headline: "Loved by Puzzle Creators Everywhere"
- 3 testimonial cards:
  1. Educator: "My students love these! I can create themed puzzles in seconds." — Sarah, 4th Grade Teacher
  2. Publisher: "The KDP-ready export saved me hours of formatting." — Marcus, Self-Publisher
  3. Parent: "Perfect for road trips. My kids don't even realize they're learning." — Jenna, Parent
- Each card: photo (or avatar) + name + role + quote + star rating

**Layout:**
- 3-column grid (desktop), carousel (mobile)
- Cards have subtle quote marks (decorative, large)

**Animations:**
- Cards slide in from bottom on scroll
- Rotating featured testimonial (auto-rotates every 5s)

---

## 9. USE CASES

**Purpose:** Help users self-identify

**Content:**
- Headline: "Built for..."
- 4 use-case cards:
  1. "Teachers & Educators" — Classroom activities, lesson plans
  2. "Self-Publishers" — KDP books, Etsy printables
  3. "Parents" — Road trips, rainy days, homeschooling
  4. "Event Planners" — Party favors, wedding activities
- Each card: icon + heading + 3 bullet points + "Learn More" link

**Layout:**
- 4-column grid (desktop), 2x2 (tablet), 1-column (mobile)

**Animations:**
- Cards flip/tilt on hover
- Icons animate on hover (subtle bounce)

---

## 10. PUBLISHING SHOWCASE

**Purpose:** Premium positioning — show the best possible output

**Content:**
- Headline: "Professional Publishing, Simplified"
- Before/After comparison:
  - Before: A basic, ugly word search from a competitor
  - After: A beautiful BOOP puzzle book spread
- Annotated features:
  1. "Professional Cover" — With title, author, branding
  2. "Table of Contents" — Auto-generated
  3. "Clean Puzzle Pages" — Easy to read and solve
  4. "Answer Key" — Complete solutions section
  5. "Bleeds & Trim Marks" — KDP-ready

**Layout:**
- Two-column: text left, mockup right
- Alternating rows for features (mockup right, then left)
- Full-bleed section background (brand color gradient)

**Animations:**
- Before/After slider interaction (user drags to compare)
- Feature items highlight as user scrolls
- Annotations appear with connecting lines

---

## 11. FAQ

**Purpose:** Overcome objections, answer questions

**Content:**
- Headline: "Frequently Asked Questions"
- 6-8 common questions:
  1. "Is BOOP free?"
  2. "What puzzle types do you support?"
  3. "Can I sell puzzle books I create?"
  4. "Do I need an account?"
  5. "What file formats do you support?"
  6. "Can I use my own words?"
  7. "Is there a limit on puzzles per book?"
  8. "Do you have a dark mode?"
- Accordion-style: click to expand

**Layout:**
- Centered, max-width 720px
- Two-column grid for questions (optional)

**Animations:**
- Accordion expand/collapse with smooth height transition
- Questions fade in on scroll (staggered)

---

## 12. FINAL CTA

**Purpose:** Convert remaining hesitation

**Content:**
- Headline: "Ready to Create Your First Puzzle Book?"
- Subheadline: "No sign-up required. No credit card. Just a beautiful puzzle book in minutes."
- CTA: "Start Creating Free" (large, prominent)
- Secondary text: "Play online or download as PDF — your choice."

**Layout:**
- Full-width section with brand gradient background
- Large, centered text
- Massive CTA button (min 280px wide)
- Optional: "Trusted by X users" stat below CTA

**Animations:**
- Background has subtle animated gradient or particle effect
- CTA button has gentle pulse glow to draw attention
- On hover: button scales 1.02x

---

## 13. FOOTER

**Purpose:** Secondary navigation + legal + trust signals

**Content:**
- Logo + brief tagline
- Navigation: Create, Play, Templates, About
- Legal: Privacy Policy, Terms of Service
- Social/Links: GitHub, Twitter/X (if applicable)
- Copyright: "© 2026 BOOP. Open source puzzle book creator."
- "Made with ❤️ for puzzle lovers everywhere"

**Layout:**
- 3-column grid: Brand (left), Navigation (center), Legal/Social (right)
- Bottom bar: copyright

**Animations:**
- None needed (footer is the end of the journey)

---

## Page-Level Animations

| Event | Animation | Duration | Easing |
|---|---|---|---|
| Page load | Content fades in sequentially | 1.2s total | ease-out |
| Scroll reveal | Elements fade + translateY(20px) | 0.6s | ease-out |
| Section transitions | Subtle parallax on background | continuous | linear |
| CTA hover | Scale 1.02x, shadow deepen | 0.2s | ease-out |
| Card hover | Lift translateY(-4px), shadow increase | 0.3s | ease-out |

---

## Performance Notes

- Hero animation should respect prefers-reduced-motion
- Images should be lazy-loaded below the fold
- Template gallery should use responsive images (WebP)
- Total page weight target: < 1MB (excluding external fonts)
- Consider using a single, optimized hero animation vs multiple
