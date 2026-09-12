# Main collection list

Source: `sections/main-list-collections.liquid`

Template: `templates/list-collections.json`

The section renders every storefront collection except `frontpage`. Each card uses the collection image when available, the collection URL, title, and localized product count. Images are responsive and lazy-loaded. The section has no merchant settings, filtering, manual ordering, or JavaScript.

## Typography roles

Hero-size page title; card-size collection headings; body counts.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).
