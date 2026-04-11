## Overview mobile local notes

Saved before resetting local changes in favor of remote Git state.

### Files changed locally

- `css/pages/tattoo-overview/responsive.css`
- `css/pages/tattoo/shared-responsive.css`
- `assets/images/sub_tatto_removal/hero_mo.png`

### Local CSS intent summary

#### `css/pages/tattoo-overview/responsive.css`

- Mobile page horizontal gutters changed from `20px + 20px` to `40px + 40px`
  - `tattoo-section-inner`, `tattoo-faq-inner`, `tattoo-hero-content` width changed to `calc(100% - 80px)`
  - `tattoo-result-card` width changed to `calc(100vw - 80px)`
- Mobile hero image was switched to `assets/images/sub_tatto_removal/hero_mo.png`
- Mobile hero overlay was removed with `display: none`
- Mobile hero content bottom padding was changed to `151px`
- Mobile `tattoo-hero-desc` was changed to:
  - `font-family: Pretendard`
  - `font-size: 30px`
  - `font-weight: 400`
  - `letter-spacing: -0.75px`
  - `margin-top: 28px`
  - `white-space: nowrap`

#### `css/pages/tattoo/shared-responsive.css`

- Mobile shared tattoo pages (`overview`, `pico-laser`, `surgery`) had:
  - hero content width changed to `calc(100% - 80px)`
  - `.tattoo-sub-hero-desc` changed to:
    - `width: auto`
    - `max-width: none`
    - `margin-top: 28px`
    - `font-weight: 400`
    - `line-height: normal`
    - `letter-spacing: -0.75px`
    - `white-space: nowrap`

### Local asset added

- `assets/images/sub_tatto_removal/hero_mo.png`
