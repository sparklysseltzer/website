# Main search

Source: `sections/main-search.liquid`

Template: `templates/search.json`

## Rendering contract

The locale-aware GET form submits to `routes.search_url` and preserves the current query. Completed searches render a localized result count and paginate 24 results at a time. Products reuse `snippets/product-card.liquid`; other searchable resources render a linked title and text excerpt.

The form and all results work without JavaScript.

## Known limits

Predictive search, type filters, sorting, image treatments for non-product results, and refined empty/error states are not implemented.

## Typography roles

Hero-size page title; card-size non-product result headings; compact product-card names; body excerpts; UI controls.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Product backgrounds

Shared product cards use `product-background.liquid`: optional product `custom.gallery_background_image` overrides layered `custom.gallery_gradient`. Backgrounds remain behind product photography; opaque product photos naturally conceal them. Empty or rejected fields retain the existing neutral card surface. Decorative Shopify images use responsive delivery and their native focal point; they introduce no structured-data changes.
