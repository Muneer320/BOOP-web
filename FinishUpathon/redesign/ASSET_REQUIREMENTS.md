# BOOP 3.0 — Asset Requirements

---

## Asset Categories

| Category | Count Needed | Priority |
|---|---|---|
| Logo / Brand | 3-4 | Critical |
| Illustrations | 5-8 | High |
| Textures | 2-3 | High |
| Icons | 15-20 | Medium |
| Templates (Mockups) | 6-8 | High |
| Hero Visuals | 1-2 | Critical |
| Ornaments | 3-5 | Medium |

---

## 1. Logo Assets

### 1.1 BOOP Wordmark (Primary Logo)
- **Purpose:** Site header, landing page hero, marketing materials
- **Format:** SVG + PNG (transparent background)
- **Dimensions:** SVG (responsive), PNG at 320x80px (2x: 640x160px)
- **Style:** Bold serif or slab-serif wordmark. The letters "BOOP" should feel like a book title. Possible treatments:
  - Letter "B" has a subtle puzzle-grid corner detail
  - Letter "O"s could be slightly circular (puzzle piece hint)
  - All-caps, tight letter-spacing, premium feel
- **Placement:** Header left, footer, favicon
- **Colors:** Dark ink (`#2C1810`) on light, warm light (`#E2D8C8`) on dark
- **Reference:** Think Penguin Books, but for puzzles
- **Implementation notes:** SVG should have a `viewBox` attribute. Include a `title` tag for accessibility.

### 1.2 BOOP Icon Mark (Secondary Logo)
- **Purpose:** Favicon, mobile app icon, social media avatar
- **Format:** SVG + PNG (32x32, 64x64, 192x192, 512x512)
- **Style:** Single letter "B" with a puzzle piece integrated into the letterform
- **Placement:** Favicon, PWA icons, social cards
- **Implementation notes:** Generate favicon.ico at 16x16 and 32x32. Include `apple-touch-icon` at 180x180.

### 1.3 Wordmark + Tagline Lockup
- **Purpose:** Landing page hero, "About" page, press kit
- **Format:** SVG
- **Style:** BOOP wordmark above puzzle piece icon or divider, tagline below: "Puzzle Book Maker"
- **Placement:** Footer, about page

---

## 2. Illustrations

### 2.1 Hero Book Mockup
- **Purpose:** Landing page hero visual — shows the actual output
- **Format:** SVG or animated SVG (preferred), PNG fallback
- **Dimensions:** ~600x500px (desktop), responsive
- **Style:** An open puzzle book with pages visible, showing puzzle grids and a word list. Slight 3D perspective (isometric or pseudo-isometric). Warm, flat illustration style with subtle shading.
- **Colors:** Warm creams, greens, golds — consistent with palette
- **Animation (optional):** Pages gently riffle or words subtly appear in the grid
- **Reference:** Think editorial illustrations from The New Yorker — flat, warm, charming
- **Placement:** Landing page hero right column

### 2.2 Empty State Illustrations (5 variations)

| Name | Context | Description | Dimensions |
|---|---|---|---|
| **empty-book** | No puzzles yet | An open empty book with dotted grid lines and a pencil | 200x200px |
| **empty-words** | No words selected | A blank word list with a cursor blinking | 200x200px |
| **empty-search** | No search results | A magnifying glass over puzzle grid with no matches | 200x200px |
| **empty-play** | No game history | A puzzle grid with a "play" button overlay | 200x200px |
| **empty-templates** | No templates chosen | A stack of blank books | 200x200px |

- **Format:** SVG (inline or external), 2x PNG fallback
- **Style:** Consistent with hero illustration — flat, warm, minimal line art, 2-3 colors from palette
- **Implementation notes:** Use inline SVGs for performance. Add subtle CSS animation (gentle bounce or float) on empty state appearance.

### 2.3 Step-by-Step Illustrations (3-4)
- **Purpose:** "How It Works" section on landing page
- **Format:** SVG
- **Dimensions:** ~120x120px each
- **Style:** Step 1: Settings (gears/numbers), Step 2: Words (letter tiles), Step 3: Book output, Step 4: Download
- **Placement:** How-It-Works section

---

## 3. Textures

### 3.1 Paper Background Texture
- **Purpose:** Subtle background texture for the entire site
- **Format:** SVG filter or PNG (small tileable)
- **Dimensions:** Tileable at 200x200px minimum
- **Style:** Extremely subtle noise/grain texture. Should look like uncoated paper stock. Not visible at first glance but adds depth.
- **Opacity:** 2-5% — barely perceptible
- **Implementation options:**
  - Option A: SVG filter (`feTurbulence` + `feColorMatrix`)
  - Option B: Small PNG with CSS `background-repeat`
  - Option C: CSS-only with radial gradients
- **Placement:** Page backgrounds (`body`, `.container`)

### 3.2 Worn Edge / Aged Paper Effect
- **Purpose:** For featured cards, hero background, premium sections
- **Format:** SVG or CSS
- **Style:** Subtle darkening at edges, like aged paper
- **Implementation:** CSS `radial-gradient` at corners or `box-shadow` inset with warm dark color
- **Placement:** Featured cards, hero background, callout sections

---

## 4. Icons

### 4.1 UI Icon Set (Custom or Curated)
- **Purpose:** Navigation, buttons, feature cards, form labels
- **Count:** 15-20 icons
- **Format:** SVG (24x24px viewBox, 1.5px stroke)
- **Style:** Line icons with slightly rounded caps — consistent stroke width, no fill. Should feel "engraved" or "ink-drawn" rather than generic material design.
- **Suggested icons needed:**

| Icon | Usage |
|---|---|
| Plus | Add, create |
| Search / Grid | Puzzle search, play |
| Download | PDF download |
| Upload | File upload |
| Book / Document | Output, template |
| Pencil / Edit | Edit, customize |
| Settings / Sliders | Configure |
| Play / Arrow | Play mode, start |
| Checkmark | Success, complete |
| Close / X | Close, dismiss |
| Chevron left/right | Navigation, pagination |
| Chevron down | Dropdown, accordion |
| Menu / Hamburger | Mobile menu |
| Sun / Moon | Theme toggle |
| Copy / Duplicate | Duplicate book |
| Share | Share output |
| Trash / Delete | Remove |
| Info / Question (circle) | Tooltips |
| Warning / Alert | Errors |
| User / Profile | Account (future) |

- **Style reference:** Feather icons, Phosphor icons, or custom designed to match the editorial feel
- **Implementation notes:** Inline SVGs preferred for performance and theming (stroke inherits `currentColor`)

---

## 5. Template/Output Mockups

### 5.1 Landing Page Book Mockups (4-6)
- **Purpose:** Output showcase, template gallery, social proof
- **Format:** PNG/JPG at 2x resolution
- **Dimensions:** ~800x600px for hero mockup, ~400x300px for gallery cards
- **Style:** Professional puzzle book spreads showing:
  1. **Education theme:** Colorful, child-friendly, large grid
  2. **Professional KDP:** Clean, bleeds, minimal
  3. **Seasonal/Holiday:** Themed (Christmas, Halloween)
  4. **Custom words:** Shows personalized word list
  5. **Solutions section:** Answer key pages
  6. **Cover page:** With title, author area, decorative border
- **Placement:** Landing page showcase section, template gallery
- **Implementation notes:** Show these as device/browser mockups — framed in a subtle shadow, not flat images

### 5.2 Generation Preview Frames (2-3)
- **Purpose:** Show what generation looks like in motion
- **Format:** Short GIF (max 5 seconds, < 2MB) or animated SVG
- **Content:** A puzzle book being built — cover appearing, pages filling in, the download button appearing
- **Placement:** "How It Works" section, feature section

---

## 6. Hero Section Visuals

### 6.1 Animated Letter Grid Component
- **Purpose:** Background / ambient animation in the hero section
- **Format:** CSS + React component (no external images needed)
- **Description:** A grid of letters (like the current puzzle preview) that subtly fades and changes. Letters occasionally highlight to spell words related to puzzles.
- **Dimensions:** Full hero section background
- **Implementation:** Canvas or CSS grid with 100+ cells, random letter assignment, Opacity animation (0.1 to 0.4) + gentle color shift between palette colors
- **Key constraint:** Must respect `prefers-reduced-motion`

### 6.2 "Puzzle DNA" Graphic (Future)
- **Purpose:** Unique visual fingerprint for each generated book
- **Format:** Generated SVG inline
- **Description:** A visual hash of the puzzle book — grid positions, word counts, difficulty mix create a unique abstract pattern
- **Implementation:** Algorithm generates SVG from puzzle metadata. Color-coded, shareable.

---

## 7. Ornaments & Decorative Elements

### 7.1 Section Dividers (3 variations)
- **Purpose:** Decorative dividers between major sections
- **Format:** SVG inline
- **Style Options:**
  1. **Floral/traditional:** Small centered flower or leaf motif (print tradition)
  2. **Typographic:** "❧" (fleuron), "✦" (star), or custom letter ornament
  3. **Geometric:** Thin line with diamond or circle centerpiece
- **Placement:** Between landing page sections, feature grid breaks
- **Implementation notes:** Color should use `var(--secondary)` (gold) or `var(--primary)` (green). Max width 60px centered.

### 7.2 Decorative Border Set
- **Purpose:** Framing for featured content, callout boxes
- **Format:** CSS (no images needed)
- **Style:** Double border system (already exists) refined. Add optional single ornament at top-left corner of feature cards.

---

## 8. Motion Assets

### 8.1 Book Assembly Animation
- **Purpose:** Generation progress visualization
- **Format:** CSS 3D transforms or Lottie JSON
- **Description:** A book being assembled in real-time:
  1. Cover appears (flat, with title)
  2. Pages stack on (each page adds thickness)
  3. Spine appears on the left side
  4. Book rotates slightly to show it's complete
- **Duration:** 2-4 seconds (loopable), or progress-driven
- **Implementation:** CSS 3D with `perspective` and `transform-style: preserve-3d`. Each step corresponds to a generation progress update.

### 8.2 Page Flip Animation
- **Purpose:** Preview interaction (flip through book)
- **Format:** CSS 3D or React component
- **Description:** When user hovers/clicks a book preview, a corner peels up. When clicking, the page turns with a 3D flip effect.
- **Implementation:** CSS `rotateY` with `transform-origin: left`. JavaScript to manage page state.

### 8.3 Ink Reveal Animation
- **Purpose:** Loading state, success state
- **Format:** SVG animation or CSS
- **Description:** Text or icons that draw themselves in like ink appearing on paper. The checkmark on success, the word "BOOP" on load.
- **Implementation:** SVG `stroke-dasharray` + `stroke-dashoffset` animation (already exists for checkmark). Extend concept.

---

## 9. Font Files

### Required Webfonts (Google Fonts)

| Font | Weights | Usage |
|---|---|---|
| Playfair Display | 400, 500, 600, 700 | Display headings, hero |
| Source Serif 4 | 400, 500, 600 | Body text |
| Inter | 400, 500, 600, 700 | UI elements, buttons |
| JetBrains Mono | 400, 500, 700 | Monospace (grids, code) |

### Preloading Strategy
- Preload Playfair Display (hero above-fold)
- Preconnect to Google Fonts origin
- Use `font-display: swap` for all fonts
- Subset to latin where possible

---

## 10. Asset Priority Matrix

| Asset | Priority | Effort | Can Ship Without? |
|---|---|---|---|
| BOOP Wordmark SVG | Critical | Low | No |
| BOOP Favicon | Critical | Low | Yes (use text) |
| Hero Book Mockup | Critical | Medium | Yes (use placeholder) |
| Paper Texture | High | Low | Yes |
| UI Icon Set | High | Medium | Yes (use Phosphor) |
| Empty State Illus | High | High | Yes (use text) |
| Book Assembly Animation | Medium | High | Yes (use progress bar) |
| Page Flip Animation | Medium | High | Yes |
| Step Illus (How-It-Works) | Medium | Low | Yes (use CSS shapes) |
| Template Mockups | High | Medium | Yes |
| Dividers / Ornaments | Low | Low | Yes |
| Ink Reveal Animations | Low | Low | Yes |

---

## 11. Asset Source Recommendations

| Asset Type | Recommended Source |
|---|---|
| UI Icons | Phosphor Icons (open source, consistent stroke) |
| Illustrations | Custom — use SVG components inline |
| Textures | Generated via SVG filters (no external files needed) |
| Fonts | Google Fonts (free, well-maintained) |
| Mockups | Created from actual BOOP output screenshots |
| Animations | CSS transforms (no library needed) or Lottie for complex |
