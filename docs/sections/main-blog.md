# Main blog

Source: `sections/main-blog.liquid`

Template: `templates/blog.json`

## Merchant control

`articles_per_page` accepts 3 to 24 articles in steps of three; the default is nine.

## Rendering contract

The section renders the blog title, a responsive card grid, lazy-loaded article images, dates, linked titles, and a 28-word excerpt/content fallback. It paginates through `snippets/pagination.liquid` and uses Shopify article URLs.

## Known limits

Tag filtering, featured articles, author display, reading time, search, and richer editorial card variants are not implemented.

## Shared typography roles

Hero-size page title; card-size article headings; body excerpts.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
