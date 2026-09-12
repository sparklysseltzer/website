# Main blog

Source: `sections/main-blog.liquid`

Template: `templates/blog.json`

## Merchant control

`articles_per_page` accepts 3 to 24 articles in steps of three; the default is nine.

## Rendering contract

The section renders the blog title, a responsive card grid, lazy-loaded article images, dates, linked titles, and a 28-word excerpt/content fallback. It paginates through `snippets/pagination.liquid` and uses Shopify article URLs.

## Known limits

Tag filtering, featured articles, author display, reading time, search, and richer editorial card variants are not implemented.

## Typography roles

Hero-size page title; card-size article headings; body excerpts.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).
