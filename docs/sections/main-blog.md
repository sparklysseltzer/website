# Blog

Source: `sections/main-blog.liquid`, `snippets/article-card.liquid`, `snippets/article-list-schema.liquid`, `assets/blog.css`.
Template: existing `templates/blog.json` (unchanged).

The News listing uses Shopify's native blog title as its only H1, the shared page-heading typography, and the same article cards as Blog teaser and related posts. All published articles are accessible through native pagination. Date, featured image, title and a 28-word excerpt/content fallback come from each article. Images use responsive CDN widths and focal points; missing images have a neutral media area. Card links are fully usable without JavaScript.

The Content group retains `heading_font` (Erode default, Newake optional) and `articles_per_page` (3–24 in steps of three, default nine). Visibility follows the shared final group. Existing setting IDs and templates are preserved. One/two/three columns at phone/tablet/desktop use shared spacing, Large radius and Card typography; body stays Maison Neue.

Each page emits an ItemList containing only that page's rendered posts with pagination-adjusted positions and public-domain article URLs. It does not invent popularity or rank articles by unmeasured readership. No tag filters, separate blog selector, comments, reading-time estimates or popularity controls are introduced.

Verification (2026-09-15): nine real articles per page at desktop/phone, no horizontal overflow, native page-two URL loads the next nine articles and ItemList positions start at 10. Teaser cards and listing cards share the same renderer; no synthetic content or popularity list was added.
