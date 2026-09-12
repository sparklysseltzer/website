# Main collection

Source: `sections/main-collection.liquid`

Templates: `templates/collection.json`, `templates/collection.soda.json`, `templates/collection.seltzer.json`

## Merchant controls

- show or visually hide the collection title and description;
- paginate 8 to 32 products in steps of four, default 16.

## Rendering contract

The section is the authoritative catalog surface for ordinary and branded collection templates. It renders `collection.products` through `snippets/product-card.liquid`, an empty-state locale string, and shared pagination. When the visible header is disabled, the collection title remains as a visually hidden `h1`.

Soda and Hard Seltzer collection templates place editorial Hero and Rich text sections around this same native product grid; they do not duplicate the catalog on regular Pages.

## Known gaps

Sorting, filtering, active-filter state, merchandising badges, quick add, and richer collection SEO presentation are not implemented.

## Typography roles

Hero-size page title; body description; compact product-card names.

Crossed-out original prices use the shared second accent (`--color-accent-secondary`, default `#FF6600`), including subscription comparisons where rendered. Price calculations and discount eligibility are unchanged.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).
