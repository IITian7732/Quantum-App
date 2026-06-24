---
name: Quantum High-Performance Interface
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#f9bd22'
  on-tertiary: '#402d00'
  tertiary-container: '#b88900'
  on-tertiary-container: '#372700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for elite productivity, targeting high-achievers who demand a disciplined, technologically advanced workspace. The personality is a blend of **Dark Futurism** and **Premium Professionalism**, evoking a sense of calm focus and boundless potential.

The aesthetic leverages **Glassmorphism** to create a sense of depth and luminosity. Interfaces should feel like sophisticated heads-up displays (HUDs), utilizing semi-transparent surfaces, intricate glowing borders, and vibrant accents against an infinite void. The emotional goal is to make the user feel like they are operating a high-end command center, where every interaction is precise, fluid, and rewarding.

Key stylistic pillars:
- **Depth through Translucency:** Layered frosted surfaces with significant backdrop blurs.
- **Chromatic Precision:** Thin, 1px glowing borders using dual-tone gradients.
- **Atmospheric Lighting:** Subdued background glows that react to user focus.

## Colors

This design system utilizes a "Deep Space" palette characterized by high-contrast accents against an ultra-dark foundation.

- **Foundations:** The primary canvas is a deep navy-to-black (`#020617`). Surfaces are built using semi-transparent layers of `#1e293b` with a 16px to 32px backdrop blur.
- **Accents:** 
    - **Electric Purple (#8b5cf6):** Represents action, ambition, and primary interaction.
    - **Cyan (#06b6d4):** Used for data visualization, secondary highlights, and successful states.
    - **Gold/Amber (#fbbf24):** Reserved for high-priority alerts, achievements, and premium "pro" features.
- **Text:** Primary text must be crisp white (#ffffff) for maximum legibility against the dark void. Secondary text uses a muted slate tint to maintain hierarchy.

## Typography

The typography strategy balances geometric strength with technical precision. 

- **Headlines:** Sora provides a bold, futuristic look. Headline-XL and Headline-LG should occasionally use a subtle text-shadow glow (`0 0 15px rgba(139, 92, 246, 0.3)`) to reinforce the neon aesthetic.
- **Body:** Geist is used for its exceptional clarity and developer-grade legibility, ensuring long-form content is easy to digest in low-light environments.
- **Technical Labels:** JetBrains Mono is used for badges, counters, and small metadata to emphasize the "calculated" and "precise" nature of the app.

## Layout & Spacing

The layout follows a **Fluid Grid** philosophy with generous negative space to prevent visual clutter in the dark theme.

- **Grid:** A 12-column system is used for desktop. Components should align to a 4px baseline grid to maintain rigorous mathematical alignment.
- **Padding:** Content containers utilize "Safe Zones" with inner padding of 24px (Desktop) and 16px (Mobile).
- **Responsive Behavior:** On mobile, side margins shrink to 16px, and multi-column card layouts stack vertically. Complex glass panels should lose their transparency and become solid dark slate on low-power devices to maintain performance while preserving the aesthetic.

## Elevation & Depth

Elevation is not communicated through traditional shadows, but through **Tonal Luminosity and Blur intensity**.

- **Level 1 (Base):** The background (`#020617`).
- **Level 2 (Panels):** `rgba(30, 41, 59, 0.4)` with a 20px backdrop-blur and a 1px border of `rgba(255, 255, 255, 0.05)`.
- **Level 3 (Modals/Popovers):** `rgba(30, 41, 59, 0.8)` with a 40px backdrop-blur. The border becomes a dual-tone gradient (`purple` to `cyan`) at 0.5 opacity.
- **The "Glow" Rule:** Instead of drop shadows, use `box-shadow: 0 0 20px rgba(139, 92, 246, 0.15)` for active elements to simulate a light source emitting from the component.

## Shapes

The shape language is dominated by **extreme rounding** and **pill shapes**, creating an aerodynamic, sleek feel.

- **Pills:** All primary buttons, tags, and search bars use the maximum radius (pill-shaped).
- **Cards:** Use a `rounded-xl` (1.5rem / 24px) radius for large layout containers to soften the technical edge of the design.
- **Icons:** Should be encased in circular or soft-square frames with 1px outlines.

## Components

### Buttons
- **Primary:** Pill-shaped with a linear gradient (Purple `#8b5cf6` to Cyan `#06b6d4`). On hover, increase the intensity of the glow and slightly scale the button (1.02x).
- **Secondary:** Outlined pill-shaped button with a 1px Cyan border and transparent background.
- **Icon Buttons:** Minimalist 1px outlines, no fill. Use subtle transition effects where the icon color shifts to gold on interaction.

### Chips & Badges
- Small, glowing pill tags. Use `JetBrains Mono` for the text. Backgrounds should be highly transparent versions of the accent colors (e.g., Purple at 10% opacity) with a solid 1px border.

### Cards
- Glass panels with a 1px gradient border. The top-left corner should have a subtle "light hit" (a brighter white-to-transparent gradient stroke).

### Input Fields
- Underlined or subtly boxed with `rgba(255, 255, 255, 0.1)`. Focus state triggers a full Cyan glow on the border and a subtle expansion of the background blur.

### Progress Bars
- Ultra-thin (4px height) with a glowing Cyan gradient fill. Background track is a dark, semi-transparent slate.