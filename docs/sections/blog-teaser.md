# Blog teaser

Source: `sections/blog-teaser.liquid`, `snippets/article-card.liquid`, `assets/blog.css`.

Add **Blog teaser** from the Theme Editor. It reads the existing `news` blog directly; no extra blog, metafield, copied article content or background setup is required. It is not automatically inserted into editor-owned templates.

## Content and controls

Content groups heading/font, number of latest published posts (3/6/9), date and excerpt visibility. Erode is the shared new-section default; Newake is available to match Figma `10940:88123`. Body remains Maison Neue. Blank heading/button label uses translated UI. The Action group hides the button-label setting when the blog link is disabled. Shared breakpoint visibility precedes the final Section background group. Empty blogs render no storefront teaser; the editor shows its empty-state message.

## Rendering and motion

Reuse the same article card as Blog and Article related posts: responsive 16:9 cover image with Shopify focal point, decorative library arrow in a circular surface, heading and optional date/excerpt. Missing images retain a neutral media surface; no fake articles or Figma demo claims. Shared Warm surface, Large radius, Section/Card font roles and standard heading leading normalize the reference. Three columns desktop, two tablet, one phone. Cards are single native links with visible keyboard focus.

The shared `editorial-section-motion` controller provides reversible reveals; card image/arrow hover uses shared duration/easing and respects reduced motion. Newake heading/button alignment uses the shared optical offset. No new animation framework.

An ItemList describes only the visible article links, with a section-specific ID; it is suppressed when both viewport visibility options are off. Full Article entities belong to detail pages, avoiding duplicate entities in teaser cards.

Verification (2026-09-15): real Section Rendering API response inspected in an isolated browser at 1440px/390px with three News articles and matching ItemList entries; no saved template changed. Teaser and listing share the same card snippet. Full Theme Check, typography and editor-schema gates passed.

## Section background

**Section background** is the final group: Default, Transparent, or Custom Color. Only Custom Color shows the picker; Clear means transparent. New add-section presets start transparent; existing saved placements retain their original appearance until a color is chosen. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Rounded surfaces use the shared [panel shadow](../design-system.md#panel-shadows); nested surfaces suppress the additional shadow. Existing layout, focus and motion behavior is preserved.
