## Tattoo shared layout policy

This document records the current agreed rules for the tattoo pages, especially the
shared sections that `overview`, `pico-laser`, and `surgery` should all follow.

### Source of truth

- `overview` is the visual reference for shared sections and shared mobile behavior.
- Shared sections should behave the same across tattoo pages unless a page explicitly needs a unique hero or page-specific feature block.
- The shared CSS entry point for these sections is:
  - `css/pages/tattoo/shared-overview-sections.css`

### Confirmed rules

#### Shared sections

- These sections should be shared in behavior and layout across tattoo pages:
  - `tattoo-summary`
  - `sec7` route / map / footer area
- Their CSS should be driven by shared rules first, with page-specific overrides only when truly necessary.

#### Mobile scaling

- Mobile behavior should keep the `800px` design ratio and scale down proportionally.
- The layout should continue scaling until the lower bound rather than switching to a separate fixed 430px layout for the shared sections.
- For the main tattoo pages, the practical minimum width policy is:
  - page structure can clamp to the viewport as needed
  - shared section proportions should remain visually consistent down to smaller mobile widths

#### Summary section

- Summary cards should keep the same card geometry across pages.
- Card descriptions should not wrap unexpectedly.
- The current shared rules keep summary title / description widths and wrapping behavior aligned across pages.

#### `sec7` route / map

- The space between the route copy and the map should be controlled by the map offset, not by an extra container gap.
- Current policy:
  - `sec7-route-inner` gap is `0`
  - the map uses `margin-top` for the visible separation
- This makes the spacing easier to keep identical across pages.

#### `sec7` hours line

- The `월~금` / `토요일` display should use span-splitting plus spacing classes, not ad hoc text spacing.
- Current shared pattern:
  - day text uses `sec7-route-hours-day--spaced`
  - time text uses `sec7-route-hours-time--spaced`
- The spacing should be driven by CSS gaps, not by repeated hard-coded spaces in HTML.

#### Footer summary

- The footer summary should stay shared across tattoo pages.
- It should not switch to a separate 430px-only layout.
- The footer text may use line chunks and chunks for consistent wrapping, but the layout should remain shared.

#### Header

- Header sizing should scale with viewport width.
- Header logo, hamburger button, and home icon should scale proportionally rather than using a separate hard snap at a smaller width.
- The effective lower bound for header scaling is `500px`.

#### `pico-laser` desktop vs mobile separation

- For `pico-laser`, desktop and mobile must be treated as separate layout layers.
- Desktop is owned by:
  - `css/pages/tattoo-pico/index.css`
- Mobile-only changes must live under:
  - `css/pages/tattoo-pico/responsive.css`
  - inside the relevant `@media` blocks
- Mobile tuning must not rewrite desktop geometry in `index.css`.
- If a selector needs a different mobile size, spacing, or layout, add that rule in `responsive.css` instead of changing the desktop source.
- The desktop reference checkpoint for the `pico-laser` sections below is:
  - `b30d8d23ef52fd5e04f750a38be0ae84556e18c3`
- In particular, these areas should preserve their desktop geometry from that checkpoint unless a desktop change is explicitly requested:
  - `pico-fractat-benefits`
  - `pico-benefit-icon`
  - `pico-fractat-recommend`
  - `pico-recommend-pill`
  - `pico-recommend-note`
- Practical rule:
  - desktop changes go to `index.css`
  - mobile changes go to `responsive.css`
  - if a mobile request changes a desktop selector in `index.css`, it should be considered a regression risk and checked against the desktop reference first

### Reverted experiments

- HTML partial/include loading was tried and reverted.
  - The repo is back to inline page markup for shared sections.
- JavaScript include loader was also reverted.
  - The project should not depend on runtime HTML injection for these sections.
- Separate 430px-only shared section layouts were removed.
  - Those rules caused the shared sections to diverge from `overview`.

### Current implementation notes

- `css/tattoo-overview.css` and `css/tattoo-pico.css` import the shared tattoo section CSS.
- `css/pages/tattoo/shared-overview-sections.css` is the main shared mobile reference for:
  - summary
  - route / map / footer
- Page-specific responsive files should only contain differences that are truly page-specific.

### Current do / do not rules

- Do use shared CSS for repeated section patterns.
- Do keep `overview` behavior as the reference when a section exists in both `overview` and `pico-laser`.
- Do keep spacing logic in CSS rather than hard-coding text spacing in HTML.
- Do keep `pico-laser` desktop geometry stable in `index.css` and isolate mobile-only tuning in `responsive.css`.
- Do not reintroduce HTML partials or JS include loaders for the shared sections.
- Do not add separate 430px fixed layouts for the shared tattoo sections unless the design intentionally diverges.
- Do not use page-specific overrides to change shared section structure unless the page truly needs it.
- Do not put mobile-only pill/grid/icon sizing changes for `pico-laser` into desktop CSS.

### Files involved

- `pages/tattoo-removal/overview.html`
- `pages/tattoo-removal/pico-laser.html`
- `pages/tattoo-removal/surgery.html`
- `css/pages/tattoo/shared-overview-sections.css`
- `css/pages/tattoo/shared-responsive.css`
- `css/pages/tattoo-overview/responsive.css`
- `css/pages/tattoo-pico/responsive.css`
- `css/pages/main/responsive.css`
