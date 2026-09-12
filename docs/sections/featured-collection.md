# Featured collection

Source: `sections/featured-collection.liquid`

## Purpose and placement

Featured collection renders a merchant-selected collection preview through the shared `snippets/product-card.liquid` primitive. It is available as a reusable section preset.

## Merchant controls

- heading;
- Shopify collection;
- two to eight products, default four.

## Rendering contract

When a collection exists, the section links to `collection.url` and renders the configured number of products in collection order. When no collection is selected, four Shopify placeholder product cards keep the Theme Editor preview understandable. The section is server-rendered and requires no JavaScript.

## Known limits

The section inherits the basic shared product card and grid. It does not provide merchandising overrides, quick add, variant selection, badges, slider behavior, or per-product blocks.

## Typography roles

Section heading; compact product-card names; body prices; UI actions.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).
