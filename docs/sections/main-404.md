# Main 404

Source: `sections/main-404.liquid`

Template: `templates/404.json`

The section renders localized 404 eyebrow, title, explanation, and a primary link to `routes.root_url`. It has no merchant settings or JavaScript. All reusable customer-facing text comes from the locale files.

## Typography roles

Hero-size title; body explanation; small eyebrow; UI action.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).
