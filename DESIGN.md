# Design Brief — Hazine

**Hazine** (خزينة — Treasury/Vault) is a professional, modern SaaS accounting platform for Algerian businesses. Designed to inspire confidence and clarity in financial management through refined, intentional visual direction.

## Visual Direction

| Dimension | Decision |
|-----------|----------|
| Tone | Confident SaaS; strategic and commanding, not traditional |
| Primary Color | Deep Emerald Green (`L: 0.38 C: 0.15 H: 160`) — growth, trust, financial strength |
| Accent Color | Warm Rust/Terracotta (`L: 0.62 C: 0.15 H: 22`) — decisiveness, Algerian desert heritage |
| Secondary Color | Soft Lavender (`L: 0.52 C: 0.12 H: 280`) — analytics and supporting data visualization |
| Neutral Palette | Cool greys with soft emerald undertone (professional, grounded) |

## Typography

| Layer | Font | Usage |
|-------|------|-------|
| Display | GeneralSans (300–900) | Headlines, nav, brand — geometric, modern, secure |
| Body | DMSans (300–700) | Content, forms, productive text — readable, neutral |
| Mono | GeistMono (400–500) | Financial numbers, code, technical content — precise |

## Shape Language

- **Border Radius:** `6px` (mid-rounded, modern but grounded)
- **Shadows:** Subtle elevation (`shadow-card` for components, `shadow-elevated` for modals)
- **Spacing:** Tight-to-breathable (data density without clutter)
- **Visual Weight:** Emerald primary, rust accent sparingly; lavender for secondary data

## Structural Zones

| Zone | Treatment |
|------|-----------|
| Header | Emerald Green with rust accent logo — brand anchor |
| Sidebar | Darker Emerald with rust-highlighted active nav — clear hierarchy |
| Content | Clean off-white with card-based layout — maximum clarity |
| Modals | Emerald header with rust border accent — elevated, intentional |
| CTAs | Rust accent for primary (submit, export, save) — decisive action |
| Data Tables | Emerald text on white, rust row hover — scannable, professional |

## Components & Patterns

- **Card Elevation:** Subtle shadows, rounded `6px`, emerald or lavender accents for data type
- **Form Inputs:** Light tinted backgrounds, emerald borders, rust focus rings
- **Buttons:** Primary (rust background, white text), Secondary (emerald outline), Tertiary (ghost)
- **Data Visualization:** Charts use emerald, rust, lavender, burnt orange, and soft blue (never rainbow)
- **Navigation:** Sidebar-first for accounting workflows; active state highlights with rust accent bar
- **States:** Hover (slight elevation + opacity shift), Focus (rust ring), Disabled (muted grey)

## Motion & Animation

- **Default Transition:** `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (smooth, professional)
- **Accent Pulse:** Subtle 2s loop for passive notifications (low-key, non-disruptive)
- **No Flash/Bounce:** Motion serves clarity, not entertainment

## Signature Detail

**Geometric Vault Mark Logo:** Abstract, modern interpretation of "خزينة" (Hazine) as a geometric vault symbol — not Arabic script, but heritage-informed geometric language. Appears in navy with gold accents in the header.

## Responsive & Accessibility

- **Mobile-First:** Design scales from `sm:` (640px) through `2xl:` (1400px)
- **Dark Mode:** Emerald-primary palette inverted intelligently; accent brightens to `L: 0.72 C: 0.16 H: 22`
- **Color Contrast:** All text meets WCAG AA+ standards on both light and dark backgrounds
- **Keyboard Navigation:** Full support; focus rings use rust accent for visibility

## Constraints

- No rainbow palettes — emerald/rust/lavender only
- No bold gradients — subtle tints and shadows for depth
- No generic "tech" palette — commitment to distinctive emerald + rust identity
- All text in French; all numbers in DZD with French locale (space separator, comma decimal)
- Label: "Conforme SCF - Loi 07-11" always visible in product
- Rust accent used sparingly for decisive action (CTAs, active states, alerts)
