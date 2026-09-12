# Main article

Source: `sections/main-article.liquid`

Template: `templates/article.json`

## Rendering contract

The section renders the publication date, article title, optional responsive feature image, article body, and a localized link back to the owning blog. Content is constrained to a readable 56rem measure. Shopify owns the article URL and body content.

The image uses bounded responsive widths and intrinsic metadata. The complete article remains server-rendered and requires no JavaScript.

## Known limits

Author, tags, social sharing, comments, related articles, and article structured data are not implemented.

## Typography roles

Hero-size page title; body reading copy; shared semantic heading roles inside rich text.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).
