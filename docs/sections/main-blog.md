# Blog

Source: `sections/main-blog.liquid`, `snippets/article-card.liquid`, `snippets/article-list-schema.liquid`, `assets/blog.css`.
Template: existing `templates/blog.json` (unchanged).

The News listing uses Shopify's native blog title as its only H1, the shared page-heading typography, and the same article cards as Blog teaser and related posts. All published articles are accessible through native pagination. Date, featured image, title and a 28-word excerpt/content fallback come from each article. Images use responsive CDN widths and focal points; missing images have a neutral media area. Card links are fully usable without JavaScript.

The Content group retains `heading_font` (Erode default, Newake optional) and `articles_per_page` (3–24 in steps of three, default nine). Visibility follows Content; Section background is the final group. Existing setting IDs and templates are preserved. One/two/three columns at phone/tablet/desktop use shared spacing, Large radius and Card typography; body stays Maison Neue.

Each page emits an ItemList containing only that page's rendered posts with pagination-adjusted positions and public-domain article URLs. It does not invent popularity or rank articles by unmeasured readership. No tag filters, separate blog selector, comments, reading-time estimates or popularity controls are introduced.

Verification (2026-09-15): nine real articles per page at desktop/phone, no horizontal overflow, native page-two URL loads the next nine articles and ItemList positions start at 10. Teaser cards and listing cards share the same renderer; no synthetic content or popularity list was added.

## Section background

**Section background** is the final group: Default, Transparent, or Custom Color. Only Custom Color shows the picker; Clear means transparent. New add-section presets start transparent; existing saved placements retain their original appearance until a color is chosen. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.
