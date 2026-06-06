---
name: Functional Freshness
colors:
  surface: '#faf9fc'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#eeedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f87'
  primary: '#022448'
  on-primary: '#ffffff'
  primary-container: '#1e3a5f'
  on-primary-container: '#8aa4cf'
  inverse-primary: '#adc8f5'
  secondary: '#555f70'
  on-secondary: '#ffffff'
  secondary-container: '#d6e0f4'
  on-secondary-container: '#5a6374'
  tertiary: '#341f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#503300'
  on-tertiary-container: '#c69b5f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#adc8f5'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#2d486d'
  secondary-fixed: '#d9e3f7'
  secondary-fixed-dim: '#bdc7da'
  on-secondary-fixed: '#121c2a'
  on-secondary-fixed-variant: '#3e4757'
  tertiary-fixed: '#ffddb2'
  tertiary-fixed-dim: '#edbf7f'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#60410c'
  background: '#faf9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e3e2e6'
typography:
  display-logo:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1280px
  gutter: 16px
---

## Brand & Style

The design system is built on a "functional-first" philosophy, prioritizing content clarity and navigational efficiency for a high-utility grocery delivery service. The aesthetic is a refined blend of **Minimalism** and **Corporate Modern**, eschewing decorative flourishes for high-information density and accessibility. 

The emotional response should be one of reliability and calm. By utilizing a light parchment background instead of stark white, the interface feels organic and approachable, while the structured layout ensures the user feels in control of their shopping experience. This design system avoids all floating effects or translucent layers, opting for a grounded, structural approach where hierarchy is defined by clear borders and purposeful typography.

## Colors

The palette is anchored by a deep **Slate Blue**, used for high-level navigation and primary text to establish authority and trust. **Leaf Green** is reserved strictly for conversion-oriented actions and positive feedback (success states), ensuring the "Buy" or "Checkout" actions are unmistakable. 

**Warm Orange** serves as a high-visibility accent for temporal or quantitative information, such as active cart counts, "Limited Time" badges, or discount highlights. Neutral surfaces utilize a warm parchment base to reduce eye strain, while interactive components sit on pure white surfaces to create subtle contrast without the need for heavy shadows.

## Typography

This design system utilizes a dual-type approach. **Plus Jakarta Sans** is used for headlines and the logo to provide a modern, slightly soft, and welcoming character. For the logo specifically, use the bold weight in all-lowercase to emphasize approachability.

**Inter** is the workhorse for all functional text, including product descriptions, pricing, and UI labels. It was chosen for its exceptional legibility at small sizes and its systematic, neutral appearance. 

Maintain strict hierarchy: use `label-bold` for category headers and `headline-md` for product names on cards. Avoid using weights below 400 to ensure readability against the parchment background.

## Layout & Spacing

The design system adheres to a strict **8px Grid System**. All margins, paddings, and component heights must be increments of 8px (or 4px for fine-tuned internal alignment). 

- **Desktop:** 12-column fluid grid within a 1280px max-width container. 24px margins.
- **Tablet:** 8-column fluid grid. 16px margins.
- **Mobile:** 4-column fluid grid. 16px margins. 

Layouts are content-first; avoid complex multi-column nested layouts. Use vertical stacking for mobile. Sidebars should be solid, fixed-width (typically 280px) and utilize the primary background color to clearly separate navigation from the product grid.

## Elevation & Depth

In alignment with the functional aesthetic, this design system minimizes the use of depth. 

- **Surfaces:** Use 1px solid `#E2E8F0` borders as the primary method of containment. 
- **Shadows:** Use a single, subtle shadow level for interactive cards and dropdowns: `box-shadow: 0 1px 2px rgba(0,0,0,0.05)`. 
- **Tonal Layers:** Depth is created through background color shifts rather than Z-index elevation. The page background is parchment (`#F9F6EE`), while active content areas (cards, modals) are pure white (`#FFFFFF`).
- **No Blurs:** Do not use backdrop blurs or glassmorphism. All surfaces must be 100% opaque.

## Shapes

The shape language is "Soft" yet disciplined. 

- **Cards & Modals:** Use a maximum corner radius of **8px**. This provides enough softness to feel modern without losing the structured, efficient feel of the grid.
- **Buttons & Inputs:** Use a corner radius of **4px**. The tighter radius distinguishes interactive elements from static containers and reinforces a "utility" feel.
- **Iconography:** Use linear icons with a 2px stroke weight and slightly rounded caps to match the typography.

## Components

### Buttons
- **Primary (Success):** Leaf Green background, white text. 4px radius. High emphasis.
- **Secondary (Action):** Slate Blue background, white text. Used for secondary navigation or filters.
- **Danger/Alert:** Warm Orange background, white text. Used for "Remove from Cart" or high-priority warnings.

### Navbar & Footer
- **Navbar:** Solid Slate Blue background. Text and icons in white. 64px height.
- **Footer:** 3-column layout. Slate Blue background. Use `body-md` for links with 50% opacity for non-hover states.

### Cards
- **Product Cards:** White background, 1px `#E2E8F0` border. Image at top, followed by 12px padding for text. Price should be in `headline-md` using the Slate Blue color.
- **Hover State:** Apply the subtle `0 1px 2px` shadow on hover to indicate interactivity; do not lift the card position.

### Form Fields
- **Inputs:** 1px solid `#E2E8F0` border, 4px radius. Use Inter `body-md`. 
- **Focus State:** 1px solid Slate Blue border. No "glow" or outer shadows.
- **Labels:** Use `label-bold` positioned above the input field with 4px spacing.

### Badges
- **Cart Count / Discounts:** Warm Orange background, white text, bold weight. Pill-shaped (fully rounded).