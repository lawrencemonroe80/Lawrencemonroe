# LAWRENCE MONROE
## Motion & Interaction Design Framework — Release 001
**Luxury Streetwear · Modern Noir · Editorial Gallery**
*Senior Creative Direction & UI/UX Motion Engineering — production framework v2*

This document is the single source of truth for the Lawrence Monroe digital campaign experience. Everything specified here is implemented and running in this repository (see §7 Implementation Map). Motion tokens live in code at `src/motion/tokens.ts`; texture/glass utilities live in `src/index.css`.

---

## §0 — VISUAL DIRECTION

### 0.1 Canonical Palette

| Token | Hex | Role | Implementation alias |
|---|---|---|---|
| **Matte Void Black** | `#0D0D0D` | Primary ground, glass panels | `void` / `black` `#050505`, `ink` `#0A0A0A` |
| **Raw Concrete Grey** | `#888888` | Structural mid-tone, ambience washes | `concrete` / `smoke` `#9A958D`, `ash` `#303030` |
| **Bleached Paper White** | `#F4F4F0` | Type & paper sections, texture overlays | `bleach` / `paper` `#F1ECE3`, `bone` `#E7E1D7` |
| **Warm Metallic (Antique Gold)** | `#AD8A48` | Accent only — never fills >5% of viewport | `gold` (`soft` `#C4A565`, `dark` `#60471E`) |
| **Archive Red** | `#743530` | Restricted signal — "CLASSIFIED / NEXT" only | `archive.red` |

Rule of ratio: **90% void · 8% paper/concrete · 2% gold**. Gold is a scalpel, not a paint bucket.

### 0.2 Type System

| Class | Family | Usage |
|---|---|---|
| **Editorial Display** | Cormorant Garamond 700, uppercase, `leading 0.92`, tracking −0.02em | Hero wordmark, look titles |
| **Kinetic Variable** | *Archivo variable* — axes `wght 100–900`, `wdth 62–125` | Scroll-velocity distortion headlines (rest state: `wght 760 / wdth 82`) |
| **Technical Mono** | JetBrains Mono 400/600, all-caps, tracking 0.12–0.35em | Spec tags, coordinates, frame numbers, telemetry |

Micro-copy is always **uppercase, mono, ≥8px, letter-spaced**. Numbers are zero-padded (`PLATE 04`, `X 042`). Coordinates read like camera metadata (`CAM A / 35MM`, `MAG 2.8×`).

### 0.3 Imagery Treatment
- Silver-gelatin grade: `grayscale contrast-125 brightness-90`, color returns only on hover (`brightness-100`).
- Directional Rembrandt key light in capture; in-engine reinforced with top-left radial wash (`rgba(136,136,136,0.08)`).
- Every model face carries the **redaction bar** (`EditorialFaceBlur`) — brand signature, never omit.
- Frame chrome: 1px `line` borders, mono head/footer strips, gold corner registration ticks.

### 0.4 Analog Texture Stack (CSS layers, `src/index.css`)
| Layer | Utility | Recipe |
|---|---|---|
| Film grain | `.fx-grain` | SVG `feTurbulence` tile @ 7% opacity, `steps(4)` 0.9s jitter |
| VHS scanlines | `.fx-scanlines` | 1px/3px repeating gradient + 18%-height head sweep, 7s aperture ease loop |
| Scanner moiré | `.fx-moire` | 45° 1px/4px interference stripes, opacity 0→0.5 on hover |
| Chromatic aberration | `.fx-chromatic` | ±1px gold/archive-red drop-shadow split on group hover |
| Glass | `.glass-panel` | `rgba(13,13,13,.55)` + `backdrop-filter: blur(20px) saturate(120%)` |

---

## §1 — HERO & NAVIGATION ARCHITECTURE
*Implemented: `src/components/home/Section1Hero.tsx`*

### 1.1 Concept — "Photoshoot in Motion"
The hero is a **cursor-driven 3D camera rig**. The visitor's pointer is the dolly head: the stage tilts ±2.2° (rotateX/rotateY under `perspective: 1400px`) while plates at different depths translate with per-layer multipliers — multi-angle model frames shift **synchronously** in depth.

### 1.2 Depth Map

| Layer | Asset | Depth multiplier (px travel / full cursor width) | Notes |
|---|---|---|---|
| L0 Monogram + grid | `lm-monogram.svg` | 10 | 5% opacity, moves least |
| L1 CAM A — black arch, angle 2 | `/models/LM_P01_02_BLACK_BLACK_2.jpg` | 34 (×0.62 vertical) | 3/4 plate, right column |
| L2 CAM B — heather cobalt | `/models/LM_P01_02_GRAY_2.jpg` | **−48** (counter-travel) | Near-depth: travels opposite → parallax separation; rotates −3.4°→−1.8° |
| L3 CAM C — black arch, angle 1 | `/models/LM_P01_02_BLACK_BLACK.jpg` | 20 | Deep background plate |
| L4 The Piece (cutout) | `shorts-001-cutout.jpg` | 26 | Nearest object, heaviest drop shadow |
| Type block | wordmark + chips | −12 | Counter-shifts against L4 for lens separation |

### 1.3 Camera Loops & Choreography
- **Continuous micro-zoom**: every plate runs a 24s mirrored Ken Burns — `scale 1→1.07→1` with lateral pan `0%→−1.6%→+1.2%→0%`, linear, infinite. Negative `delay` offsets (−9s, −17s) desynchronize plates so the rig never moves in unison.
- **Entrance timeline** (cinematic blur ramps, `EASE.cinematicOut`):

| t (s) | Element | From → To |
|---|---|---|
| 0.15 | CAM A plate | `opacity 0, scale 1.06, blur 18px` → rest @ 62% opacity |
| 0.30 | CAM B plate | `blur 20px` → 50% opacity |
| 0.45 | CAM C plate | `blur 16px` → 40% opacity |
| 0.50–0.62 | LAWRENCE / MONROE lines | `y 42px, blur 14px` → 0 (1.2s) |
| 0.55 | Product cutout | `y 60px, blur 22px` → 0 |
| 0.85–1.05 | Badges, coordinates chip | `y 14px, blur 8px` → 0 (noirSnap) |
| 1.15 | CTA rail | `y 26px` fade-up |

- **Scroll-out** (`useScroll` on section, offset `['start start','end start']`): stage recedes `scale 1→0.955` + `blur 0→7px`; content drifts `y 0→110`; plates exit at per-depth rates (−40 … −160px); dim veil 0→0.6.
- **Live telemetry**: top-right chip streams cursor coordinates (`CUR X 0482 / Y 0377`) from the same motion values — the interface acknowledges it is being watched.

### 1.4 Navigation Architecture
- Fixed rail (z-40), transparent → graphite on scroll >40px. Left: monogram; center/right: mono links; right: cart with count.
- Full-bleed overlay menu: staggered link reveal, hovered item's campaign plate ghosts behind.
- All CTAs are **magnetic** (`<Magnetic strength 0.22–0.3>`): buttons gravitate toward the pointer up to 28% of offset, spring return.
- CTA hover fires a gold `scaleX` sweep line across the hero foot (origin-left, noirSnap).

---

## §2 — LOOKBOOK / CAMPAIGN SHOWCASE LAYOUT

### 2.1 Sticky Stacking Cards — "Plates on a Lightbox"
*Implemented: `src/components/home/SectionLookbookStack.tsx`*

Each LOOK is a `position: sticky; top: 88px` card inside a tall runway. Incoming cards slide over the stack; covered cards recede:

- **Friction falloff**: card *i* of *n* scales `1 → 1 − (n−1−i) × 0.045` across its timeline slice `[i/n, 1]` (card 1 of 3 lands at 0.91). Driven by container `scrollYProgress` (offset `['start start','end end']`), not raw scroll — the falloff inherits eased progress, reading as friction, not tracking.
- **Brightness falloff**: covered cards dim `brightness 1 → 0.45` — plates dropped off the lightbox.
- **Card anatomy** (max-w-7xl, border `line`, graphite ground):
  - Head strip: `LOOK 01` gold + subtitle mono + position `01 / 03`.
  - Left 7/12: inspectable plate (see §3.2), gradient wash toward spec column, moiré hover accent, ghost hollow numeral bleeding off the bottom-right (`26vw`, `-webkit-text-stroke 1px rgba(244,244,240,.16)`).
  - Right 5/12: serif look title, mono spec ledger (`FABRIC / PRINT / CUT / EDITION` rows, hairline dividers), price + `OPEN LOOK` CTA with `data-cursor="view"`.

### 2.2 Horizontal Speed Index — Inertia Drag Gallery
*Implemented: `src/components/home/SectionHorizontalGallery.tsx`*

- **Fling physics**: `drag="x"` with `power 0.18`, `timeConstant 280ms`, `dragElastic 0.08`, momentum bounce `90/18`.
- **Snap**: `dragTransition.modifyTarget` rounds every release target to the nearest plate boundary (`plateWidth + 24px gap`), clamped to track bounds.
- **Speed lean**: track velocity shears plates `skewX ±3.5°` via spring-smoothed `useVelocity(x)` — the archive leans into its own momentum.
- **Telemetry**: live `VELOCITY nn M/S` readout + gold progress rail (`scaleX` inverted from x).
- **Cursor contract**: track = `DRAG` pill; plate surfaces = `INSPECT` pill (innermost `data-cursor` wins).
- Six plates: two model angles (macro: fabric weave), stride study, cantilever rest, two `CLASSIFIED` archive plates (red signal, no macro — sealed).

### 2.3 Section Rhythm — Homepage v2 (Light Editorial Redux)
```
THE ENTRANCE (single mounted print, ink wordmark, paper grain)
→ THE DROP (capsule, live Square pricing — /#capsule)
→ THE STATEMENT (velocity type, one typographic moment)
→ THE NETWORK (four channel index rows + closing CTA)
```
Ground: bleached paper (#F4F4F0) with `.fx-grain-light` throughout; ink type,
hairline `line-dark` rules, gold used only as a scalpel. The heavy motion
pieces relocated to inner pages — the stacking lookbook and speed-index drag
gallery now live on `/vault`; the full product grid on `/shop`. See §8.

---

## §3 — INTERACTIVE PRODUCT GRID & DETAIL COMPONENT SPECS

### 3.1 Product Cards (`Section4ReleasedPieces`, `ShopPage`)
- Asymmetric 12-col editorial blocks, never uniform tiles; oversized ghost index numerals (`01`, `02`) at 15% opacity behind.
- Hover contract: image `brightness 90→100`, border `line→gold`, ghost numeral translates +4px (700ms cinematicOut), cursor `VIEW` state.
- Quick-add pill appears bottom-right on hover (glass, gold hairline), stops propagation.

### 3.2 Interactive Asset Inspector — macro zoom reveal
*Implemented: `src/components/common/AssetInspector.tsx`*

| Spec | Value |
|---|---|
| Trigger | Hover (pointer:fine only) over any inspectable plate |
| Lens | `min(300px, 38vw)` square, gold 60% border, spring `stiffness 400 / damping 32` follow |
| Magnification | 2.6–2.8× (per plate); lens plate = `macroImage` (fabric knit / hardware macro) or true optical zoom of the frame |
| Lens chrome | Crosshair (gold 25%), center 12px ring, 4 corner registration ticks, footer bar `X 042 / Y 068 · MAG 2.8×` |
| Spec readout | Bottom-left glass chip: mono title + 2 spec lines (e.g. `FABRIC: 480GSM COMBED COTTON`) |
| Enter/exit | `scale 0.82→1`, opacity, 400ms spring; coordinates stream at 60fps |
| Cursor | `data-cursor="inspect"` → INSPECT pill |

Optical math: the lens plate is sized `zoom×100%` and offset `left: calc(50% − originX·zoom %)` so the frame point under the cursor stays centered — a true loupe, not a stock zoom.

### 3.3 Modal Overlays — fluid scale-up through glass
*Spec implemented in `LightboxModal` (all modals share the pattern)*

| Phase | Motion |
|---|---|
| Backdrop | `opacity 0→1`, `bg-black/60` + `backdrop-filter: blur(20px)` (spec-exact), 320ms aperture ease |
| Panel | `scale 0.92→1, y 26→0, blur 10px→0` — 500ms cinematicOut; exit mirrored `scale 0.94, blur 8px` |
| Content | Image swaps crossfade `scale 1.015→1, blur 6→0` (350ms noirSnap) |
| Chrome | Close ×, prev/next chevrons, frame stamp — all mono, gold hover |

### 3.4 Custom Magnetic Cursor — state machine
*Implemented: `src/components/common/CustomCursor.tsx`*

| State | Trigger | Render |
|---|---|---|
| `default` | neutral ground | 6px gold dot (mix-blend-difference) + 26px hairline ring @32% bone |
| `link` | any `a/button/input/[role=button]` | ring 44px, gold border |
| `view` | `data-cursor="view"` | 118px pill: gold crosshair ticks + **VIEW LOOKBOOK** (or `data-cursor-label`) |
| `drag` | drag tracks | pill: **DRAG** |
| `inspect` | inspector zones | pill: **INSPECT** |

- Core dot: spring `900/50/0.1` (locked). Ring: `250/28/0.6` (heavy barrel lag).
- **Magnetic inertia**: ring squashes along its velocity vector (`scaleX 1+0.32 → scaleY 1/1.32`) and rotates into travel direction above 40px/s; blended to zero while a pill is showing so labels stay legible.
- Native cursor hidden on fine pointers only (`body.lm-cursor-active`); component fully disabled on touch/reduced-motion.

---

## §4 — MOTION & ANIMATION DESIGN TOKENS
*Source of truth: `src/motion/tokens.ts`*

### 4.1 Easings
| Token | cubic-bezier | Character | Used for |
|---|---|---|---|
| `cinematicOut` | `0.16, 1, 0.3, 1` | Dolly-out: fast attack, long silent settle | Hero, reveals, modals |
| `aperture` | `0.83, 0, 0.17, 1` | Symmetric open/close | Backdrops, enter↔exit pairs |
| `noirSnap` | `0.22, 1, 0.36, 1` | Sharp catch, hair of overshoot | Chips, badges, toggles |
| `catch` | `0.34, 1.56, 0.64, 1` | Springy mechanical | Magnetic elements |
| `shuttle` | `0, 0, 1, 1` | Linear conveyor | Marquees, telemetry |
| `friction` | `0.3, 0.05, 0.1, 1` | Heavy drag | Stack falloff |

### 4.2 Durations
`instant 120ms` · `fast 240ms` · `base 400ms` · `cinematic 800ms` · `epic 1200ms` · `ambientSlow 24s` (Ken Burns) · `ambientGlitch 7s` (VHS sweep)

### 4.3 Springs (physical hardware models)
| Token | stiffness / damping / mass | Models |
|---|---|---|
| `cursorCore` | 900 / 50 / 0.1 | Locked focus dot |
| `cursorRing` | 250 / 28 / 0.6 | Heavy lens barrel |
| `magnetic` | 180 / 14 / 0.4 | Button gravitation |
| `parallaxRig` | 60 / 20 / 1.2 | Full dolly head (hero) |
| `inspectorLens` | 400 / 32 / 0.5 | Loupe pop + follow |
| `stackSettle` | 120 / 26 / 0.9 | Card restack |
| Drag inertia | power 0.18 / τ 280ms / bounce 90/18 | Gallery fling + snap |

### 4.4 Scroll Triggers (named offsets)
| Token | Offset pair | Purpose |
|---|---|---|
| `pinned` | `['start start','end start']` | Hero exit choreography |
| `stackLifecycle` | `['start start','end end']` | Sticky stack runway |
| `driftThrough` | `['start end','end start']` | Parallax drift (contact sheet, strip) |
| `reveal` | `['start 92%','end 55%']` | Standard section reveal |

### 4.5 Velocity Distortion Map (variable font)
- Rest: `wght 760 / wdth 82` (condensed editorial cut)
- Full distortion @ 2200px/s scroll velocity: `wght 480 / wdth 125` + `skewY ±2.5°`
- Smoothing: spring `380/48/0.8` — reads as mass, returns as tape-slam settle.

### 4.6 Falloff Curves
- Stack scale: `targetScale = 1 − (n−1−i) × 0.045`
- Stack brightness: `1 → 0.45` across card slice
- Cursor squash: `1 + min(|v|,2400)/2400 × 0.32`

---

## §5 — CODE SNIPPETS (key scroll & tilt effects)

### 5.1 CSS — noir texture + glass (production, `src/index.css`)
```css
/* 35mm grain — stepped turbulence, projector cadence */
.fx-grain::after {
  content: ''; position: absolute; inset: -100%; z-index: 5;
  opacity: 0.07; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: grain-shift 0.9s steps(4) infinite;
}
@keyframes grain-shift {
  0% { transform: translate(0,0); } 25% { transform: translate(-2%,1.4%); }
  50% { transform: translate(1.6%,-1.2%); } 75% { transform: translate(-1.2%,-1.8%); }
  100% { transform: translate(0,0); }
}

/* Glassmorphism panel — spec-exact 20px blur */
.glass-panel {
  background: rgba(13, 13, 13, 0.55);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid rgba(244, 244, 240, 0.09);
}

/* Kinetic variable type — driven by scroll velocity in JS */
.font-kinetic {
  font-family: 'Archivo', sans-serif;
  font-variation-settings: 'wght' 760, 'wdth' 82;
  text-transform: uppercase; line-height: 0.9;
}
```

### 5.2 Framer Motion — hero 3D parallax rig
```tsx
// Cursor → normalized rig → per-depth layer travel
const mx = useMotionValue(0); const my = useMotionValue(0);
const rigX = useSpring(mx, SPRING.parallaxRig);   // stiffness 60 / damping 20 / mass 1.2
const rigY = useSpring(my, SPRING.parallaxRig);

const rotateY = useTransform(rigX, [-0.5, 0.5], [2.2, -2.2]);  // dolly tilt
const rotateX = useTransform(rigY, [-0.5, 0.5], [-2.2, 2.2]);
const frameBX = useTransform(rigX, [-0.5, 0.5], [48, -48]);    // counter-travel = near depth
const headlineX = useTransform(rigX, [-0.5, 0.5], [12, -12]);  // type drifts against product

<section onMouseMove={(e) => {
  const r = e.currentTarget.getBoundingClientRect();
  mx.set((e.clientX - r.left) / r.width - 0.5);
  my.set((e.clientY - r.top) / r.height - 0.5);
}} style={{ perspective: '1400px' }}>
  <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
    {/* layers, each with style={{ x: layerX, y: layerY }} */}
  </motion.div>
</section>
```

### 5.3 Framer Motion — sticky stacking cards with friction falloff
```tsx
const containerRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({
  target: containerRef, offset: ['start start', 'end end'],
});

function StackCard({ i, total, progress }) {
  const targetScale = 1 - (total - 1 - i) * 0.045;       // friction falloff
  const scale = useTransform(progress, [i * (1 / total), 1], [1, targetScale]);
  const brightness = useTransform(progress, [i * (1 / total), 1], [1, 0.45]);
  const filter = useMotionTemplate`brightness(${brightness})`;
  return (
    <div className="sticky top-[88px]">                    // slides over the stack
      <motion.article style={{ scale, filter }} className="origin-top" />
    </div>
  );
}
```

### 5.4 Framer Motion — variable-font distortion on scroll velocity
```tsx
const { scrollY } = useScroll();
const velocity = useVelocity(scrollY);
const smooth = useSpring(velocity, { stiffness: 380, damping: 48, mass: 0.8 });

const distortion = useTransform(smooth,
  (v) => Math.min(Math.abs(v), 2200) / 2200);
const weight     = useTransform(distortion, [0, 1], [760, 480]);  // wght axis
const widthAxis  = useTransform(distortion, [0, 1], [82, 125]);   // wdth axis
const fontVariationSettings =
  useMotionTemplate`'wght' ${weight}, 'wdth' ${widthAxis}`;
const skewY = useTransform(smooth, [-2200, 0, 2200], [2.5, 0, -2.5]);

<motion.span className="font-kinetic" style={{ fontVariationSettings, skewY }}>
  BUILT TO HOLD ITS FORM.
</motion.span>
```

### 5.5 Framer Motion — inertia drag with velocity shear + snap
```tsx
const x = useMotionValue(0);
const smoothV = useSpring(useVelocity(x), { stiffness: 320, damping: 46, mass: 0.7 });
const skewX = useTransform(smoothV, [-4200, 0, 4200], [3.5, 0, -3.5]); // speed lean

const snapTo = (target: number) =>
  Math.min(0, Math.max(Math.round(target / STEP) * STEP, -maxDrag));

<motion.div drag="x" style={{ x }}
  dragConstraints={{ left: -maxDrag, right: 0 }}
  dragElastic={0.08}
  dragTransition={{ power: 0.18, timeConstant: 280,
                    bounceStiffness: 90, bounceDamping: 18, modifyTarget: snapTo }}>
  <motion.div style={{ skewX }}>{/* plates */}</motion.div>
</motion.div>
```

### 5.6 Framer Motion — magnetic element
```tsx
const x = useMotionValue(0); const y = useMotionValue(0);
const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

<div onMouseMove={(e) => {
  const r = ref.current.getBoundingClientRect();
  x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
  y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
}} onMouseLeave={() => { x.set(0); y.set(0); }}>
  <motion.button style={{ x: sx, y: sy }}>ENTER RELEASE</motion.button>
</div>
```

### 5.7 CSS — Wix Studio mapping (no-code parity)
| Framer effect | Wix Studio equivalent |
|---|---|
| Hero parallax rig | Velo `onMouseIn` + `wix-animations` timeline on layers; or Corvid-driven `transform` |
| Sticky stack | Repeater sections + "Scroll Effects" scale/opacity per section (pinned containers) |
| Velocity text | `scroll` event → `font-variation-settings` via Velo (Archivo VF from Google Fonts) |
| Drag gallery | Hover-activated horizontal slideshow strip; inertia via Wix Pro Gallery momentum |
| Glass modal | Lightbox with `backdrop-filter` in custom CSS panel |
| Custom cursor | Velo `onMouseMove` on page + fixed-position container (pointer:fine guard) |

---

## §6 — ACCESSIBILITY & PERFORMANCE RULES
1. **Reduced motion**: global CSS kill-switch (`prefers-reduced-motion`) + JS guards (`useReducedMotion`) disable Ken Burns loops, cursor, and shear. Grain/VHS sweeps pinned static.
2. **Touch**: custom cursor, inspector lens, and magnetic pull are pointer:fine only. Drag track keeps `touch-pan-y` so vertical page scroll wins on mobile.
3. **Keyboard**: gallery arrow buttons replicate drag (spring-animated snaps); modals trap focus, Esc closes; all cursor-state elements remain real links/buttons.
4. **GPU budget**: only `transform` / `filter` / `opacity` animate. Full-screen `blur()` allowed only on hero exit (transient). Grain is a 300px SVG tile, not video. Springs over `setTimeout` chains everywhere.
5. **Legibility**: pill labels max-out squash during badge states; mono minimum 8px at 0.18em tracking; gold-on-void contrast for state signals only.

## §7 — IMPLEMENTATION MAP
| Feature | File |
|---|---|
| Motion tokens (§4) | `src/motion/tokens.ts` |
| Hero — light editorial v2 (§8) | `src/components/home/LightHero.tsx` |
| Capsule drop (live Square) | `src/components/home/CapsuleDrop.tsx` |
| Editorial statement (velocity type) | `src/components/home/EditorialStatement.tsx` |
| Network index rows + close | `src/components/home/NetworkLinks.tsx` |
| Velocity type (§5.4) | `src/components/common/VelocityText.tsx` |
| Sticky lookbook stack (§2.1) — now on /vault | `src/components/home/SectionLookbookStack.tsx` |
| Inertia drag gallery (§2.2) — now on /vault | `src/components/home/SectionHorizontalGallery.tsx` |
| Asset inspector (§3.2) | `src/components/common/AssetInspector.tsx` |
| Magnetic cursor + states (§3.4) | `src/components/common/CustomCursor.tsx` |
| Magnetic wrapper (§5.6) | `src/components/common/Magnetic.tsx` |
| Glass modals (§3.3) | `src/components/common/LightboxModal.tsx` |
| Textures / glass / kinetic CSS (§0.4/§5.1) | `src/index.css` |
| Variable font load | `index.html` (Archivo `wdth 62..125, wght 100..900`) |

**Type scale of one** — every duration, spring, and curve in the build traces back to §4. If a value isn't in the tokens, it doesn't ship.


---

## §8 — HOMEPAGE V2: LIGHT EDITORIAL REDUX

**Diagnosis (v1):** ~10 dense sections, all void-black, every layer
competing — multi-plate 3D rig, contact strips, stacks, drag galleries,
archive teasers stacked end to end. Scroll fatigue and visual noise.

**Prescription (v2):**
1. **Brighter ground** — bleached paper (#F4F4F0) with `.fx-grain-light`
   (the same silver-halide noise at 0.05 opacity, slower 1.4s cadence).
2. **One idea per section** — four sections, each a single gesture.
3. **Restraint over density** — one mounted print instead of four plates;
   index rows instead of image cards; hairlines instead of chrome.
4. **Motion retained, volume lowered** — gentle parallax + Ken Burns on
   the hero print, velocity type on the statement, magnetic buttons on
   the close. The marquee mechanics (sticky stack, drag gallery) moved
   to /vault where depth is expected.
5. **Adaptive chrome** — the fixed nav runs light ink/paper treatment on
   `/` and the noir treatment everywhere else; the cursor ring blends
   by difference so it reads on both grounds.

**Retired from the homepage:** the v1 3D multi-plate rig (spec preserved
in §1 as archive reference), contact sheet, object-in-motion, archive
teasers, and the duplicate product blocks. Nothing was deleted from the
system — everything either relocated or was redundant with /shop,
/vault, or /telemetry.
