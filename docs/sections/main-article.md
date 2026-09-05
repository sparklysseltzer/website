# Main article

Source: `sections/main-article.liquid`

Template: `templates/article.json`

## Rendering contract

The section renders the publication date, article title, optional responsive feature image, article body, and a localized link back to the owning blog. Content is constrained to a readable 56rem measure. Shopify owns the article URL and body content.

The image uses bounded responsive widths and intrinsic metadata. The complete article remains server-rendered and requires no JavaScript.

## Known limits

Author, tags, social sharing, comments, related articles, and article structured data are not implemented.

## Shared typography roles

Hero-size page title; body reading copy; shared semantic heading roles inside rich text.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
