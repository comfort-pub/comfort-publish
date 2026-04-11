## Comfort Special Mobile Policy

This document defines the mobile editing rules for `pages/comfort-intro/special.html` and its related CSS.

### Core Rules

1. Keep PC and mobile separated.
   - PC structure, spacing, and typography must not be broken by mobile changes.
   - Treat the PC side as the 1920-based desktop layout scale for this page.
   - Mobile changes must live in `responsive.css` whenever possible.
   - If HTML must change, preserve the PC layout and make the change mobile-safe.

2. Avoid unnecessary new classes.
   - Prefer reusing existing selectors and existing section-specific class names.
   - Do not add duplicate classes for the same content if an existing class can be updated.
   - If a new class is required, use it only when it prevents conflicts or is needed for mobile-only behavior.

3. Mobile breakpoint policy.
   - Use `800px` as the mobile 기준.
   - Do not add or rely on `1024px` mobile rules for this page.
   - If a rule is mobile-specific, keep it in the `max-width: 800px` block.

4. Prevent selector conflicts.
   - Use page-scoped selectors such as `.page--comfort-special` for mobile overrides.
   - Prefer one source of truth for each property.
   - Do not keep multiple competing declarations for the same element/property unless they are intentionally split by PC vs mobile.

5. Keep section-specific text separate.
   - Use section-specific classes for proof, story, value, and feature text.
   - Avoid broad generic text classes when they cause overlap between sections.

### Recommended CSS Structure

- `index.css`
  - PC defaults only
  - Base typography, layout, and component styling

- `responsive.css`
  - Mobile overrides only
  - Prefer a single mobile breakpoint of `800px` for page-specific tuning

### Editing Checklist

Before changing the page:

1. Check whether the target rule already exists.
2. Update the existing rule instead of adding a duplicate.
3. Confirm whether the rule belongs to PC or mobile.
4. Keep mobile overrides scoped to `.page--comfort-special`.
5. Verify that the final rule is not being overridden by a more specific selector.

### Goal

The goal is to make PC and mobile behave independently, reduce selector collisions, and keep the page easy to maintain.
