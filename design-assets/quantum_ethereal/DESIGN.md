---
name: Quantum Ethereal
colors:
  surface: '#f4fafd'
  surface-dim: '#d4dbdd'
  surface-bright: '#f4fafd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef5f7'
  surface-container: '#e8eff1'
  surface-container-high: '#e2e9ec'
  surface-container-highest: '#dde4e6'
  on-surface: '#161d1f'
  on-surface-variant: '#454651'
  inverse-surface: '#2b3234'
  inverse-on-surface: '#ebf2f4'
  outline: '#767683'
  outline-variant: '#c6c5d3'
  surface-tint: '#4858ab'
  primary: '#4352a5'
  on-primary: '#ffffff'
  primary-container: '#5c6bc0'
  on-primary-container: '#f8f6ff'
  inverse-primary: '#bac3ff'
  secondary: '#466557'
  on-secondary: '#ffffff'
  secondary-container: '#c8ead8'
  on-secondary-container: '#4c6b5d'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca730'
  on-tertiary-container: '#4f3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bac3ff'
  on-primary-fixed: '#00105b'
  on-primary-fixed-variant: '#2f3f92'
  secondary-fixed: '#c8ead8'
  secondary-fixed-dim: '#adcebd'
  on-secondary-fixed: '#022016'
  on-secondary-fixed-variant: '#2f4d40'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f4fafd'
  on-background: '#161d1f'
  surface-variant: '#dde4e6'
typography:
  h1:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  author-accent:
    fontFamily: Sora
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system focuses on a high-end, intellectual atmosphere that balances technical precision with human warmth. It is designed for users who spend extended periods within the interface, prioritizing visual comfort and cognitive ease.

The aesthetic blends **Modern Minimalism** with **Subtle Glassmorphism**. The interface feels "airy" through the use of expansive whitespace and soft, layered translucency. It avoids harsh transitions, opting instead for a tactile, layered feel where elements appear to float gently above a warm, off-white base. The emotional response is one of calm, focus, and sophisticated reliability.

## Colors
The palette is rooted in low-strain "eye-acceptable" tones. 

- **Primary (Indigo):** Used for primary actions and brand presence. It is muted to prevent visual vibration against the warm background.
- **Secondary (Sage):** Provides a calming contrast for success states or secondary emphasis.
- **Tertiary (Gold):** Reserved exclusively for author names and specific editorial highlights, adding a premium "ink-on-paper" feel.
- **Neutral (Charcoal):** Softened from pure black to #2D3436 to ensure high legibility while maintaining a soft visual profile.
- **Surface Strategy:** The base layer is #F8F9FA. Elevated containers use pure white (#FFFFFF) to create a clear but gentle hierarchy.

## Typography
This design system employs a dual-font strategy. **Sora** is utilized for headlines to provide a modern, geometric personality. **Inter** is used for all body text and UI labels to ensure maximum functional readability and a systematic feel.

- **Headlines:** Use tighter letter spacing and generous line heights to maintain a professional editorial look.
- **Body Text:** Set with a slightly increased line height (1.6) to prevent fatigue during long-form reading.
- **Author Names:** Specifically styled with Sora in a semi-bold weight and the muted gold accent color to distinguish contributors within the layout.

## Layout & Spacing
The design system utilizes a **Fluid Grid** model with a 12-column structure for desktop and a 4-column structure for mobile. 

- **The 8px Rhythm:** All spacing between elements (margins, padding, gaps) must be a multiple of 8px.
- **Airy Composition:** Use 64px or larger vertical gaps between major sections to emphasize the "elegant and airy" brand promise. 
- **Containment:** Content should be centered with a max-width of 1280px to prevent excessive line lengths on wide monitors, maintaining readability.

## Elevation & Depth
Hierarchy is established through **Glassmorphism** and soft, ambient shadows rather than heavy lines.

- **Level 0 (Base):** The #F8F9FA surface.
- **Level 1 (Floating Cards):** Pure white surfaces with a very diffused 15% opacity shadow (Blur: 20px, Y: 4px) in the primary indigo tint.
- **Level 2 (Overlays/Navigation):** Semi-transparent white (80% opacity) with a 12px backdrop blur. This creates the "glass" effect that allows background colors to bleed through softly.
- **Outlines:** Use ultra-thin (1px) borders in #E9ECEF only when necessary for structural definition on white-on-white areas.

## Shapes
Shapes are defined by "Soft-Roundness." The goal is to eliminate sharp points that create visual tension, replacing them with approachable, organic curves.

- **Standard Elements:** Use a 0.5rem (8px) radius for buttons and input fields.
- **Large Containers:** Use 1rem (16px) for cards and modals to emphasize the "soft" aesthetic.
- **Interactive States:** On hover, shapes should not change their radius, but rather increase shadow depth to imply physical lift.

## Components
- **Buttons:** Primary buttons use a solid indigo fill with white text. Secondary buttons use a ghost style with a 1px indigo border or a soft sage tint.
- **Input Fields:** Fields are pure white with a subtle #E9ECEF border. On focus, the border transitions to a soft indigo with a 4px outer glow (0.1 opacity).
- **Cards:** Cards should always utilize the Level 1 elevation (soft shadow) and the 1rem corner radius. Backgrounds for cards can occasionally use the glassmorphic blur effect if positioned over decorative background elements.
- **Chips:** Small, pill-shaped elements with a 12px font size. Use secondary sage-green backgrounds at 10% opacity for a subtle, professional look.
- **Navigation:** Top navigation bars should implement the backdrop blur (glassmorphism) to feel integrated with the content as the user scrolls.