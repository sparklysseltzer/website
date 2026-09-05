# Main search

Source: `sections/main-search.liquid`

Template: `templates/search.json`

## Rendering contract

The locale-aware GET form submits to `routes.search_url` and preserves the current query. Completed searches render a localized result count and paginate 24 results at a time. Products reuse `snippets/product-card.liquid`; other searchable resources render a linked title and text excerpt.

The form and all results work without JavaScript.

## Known limits

Predictive search, type filters, sorting, image treatments for non-product results, and refined empty/error states are not implemented.

## Shared typography roles

Hero-size page title; card-size non-product result headings; compact product-card names; body excerpts; UI controls.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
