# Collection

Source: `sections/main-collection.liquid`, `snippets/catalog-products.liquid`, `snippets/catalog-product-card.liquid`, `assets/collection.css`, `assets/collection.js`.

## Shared catalog rule

**All-products and individual collection pages must use the same product card and listing logic until an explicit, documented decision approves a split.** Both call `product-card` with `card_layout: 'catalog'`; that entry point delegates to the one catalog card. Search and Featured collection retain their existing compact card mode. Product Overview remains a separate manually authored editorial teaser, not a catalog query.

The catalog uses real `collection.products`, availability/localized product URLs and Shopify prices. It respects existing `custom.hide_in_collection == true` everywhere in this listing. That field only removes the listing card: it does not unpublish the product, block its direct URL or remove it from other surfaces. On 2026-09-15 both variety packs and trial packs were marked hidden; these values were preserved pending merchant direction.

## Cards and data

Three columns at 990px+, two at 600–989px, one below 600px. Cards link to PDPs, without quick-add or variant assumptions. Soda uses its logo and Erode flavor title; Hard Seltzer uses its logo and established flavor artwork. General products show the teaser category/product type, Shopify price and real product title. Crossed-out prices use the secondary accent.

Background precedence reuses `product-background`: product `custom.gallery_background_image`, then validated `custom.gallery_gradient`, then the card's neutral/brand starter surface. Canonical Holunder has a green starter surface. Brand classification reuses `custom.brand_variant`; no duplicate world field.

The four known flavor cards reuse the approved transparent Product Overview artwork and two flavor SVGs. Both known variety cards compose two existing cutouts. Other products use existing `custom.teaser_image` or featured image. These fixed starter flavor exports are theme-owned; changing a known flavor's teaser metafield does not currently replace that cutout. A dedicated merchant override for those four cutouts is a future enhancement if required.

All-products groups Soda, Hard Seltzer and general cards within each server page; individual collections retain Shopify order. Hidden items are excluded by the shared `catalog-products` loop in HTML and structured data alike. Shopify pagination counts include hidden products, so an individual page can have fewer visible cards than the page-size setting, or be empty with a next-page link. Do not misrepresent those counts as visible totals.

## Filter navigation and SEO

Filters appear only on `/collections/all`. Every nonempty storefront collection is eligible unless its new `custom.hide_in_filter_navigation` boolean is true. Empty/false means visible. The current store has separate Clothing and Accessories collections, so the initial navigation has five buttons including All; no collections were merged or automatically hidden. Soda/Hard Seltzer appear first; other collections use Shopify's iteration order.

Filters are native collection links enhanced in place by `collection-catalog`. Standard clicks filter cards by their actual collection memberships; modifier clicks and no-JavaScript navigation retain the real collection destination. On first filtering, remaining server-rendered pages are fetched through Section Rendering and cached, so filtering is not limited to the first page. Fetches are same-origin; failure preserves the current cards and offers retry guidance. No Admin token or Storefront token is shipped to the browser.

The chosen filter uses `#collection=handle`, with Back/Forward restoration. It is UI state, not an indexable landing page. Canonical metadata stays on the underlying all-products resource. Dedicated collection URLs own their SEO content and remain crawlable through native links. This follows [Google's faceted-navigation guidance](https://developers.google.com/crawling/docs/faceted-navigation): filter fragments are appropriate when those filtered views should not become separate search destinations.

Server-rendered `CollectionPage` with `ItemList` describes only listed, non-hidden products on that server page. No product offers or claims are invented. The filter's client-only state does not replace the server-page JSON-LD. Product detail pages retain ownership of complete Product/Offer entities.

## Motion and accessibility

Changes fade out over 120ms, then fade/translate in over 260ms while easing grid height. The focused filter remains mounted; active state and result count update together. Requests and animations have a latest-selection guard, repeated settled selections do not replay, and reduced motion applies final states immediately. Hidden cards leave the tab order/accessibility tree. Core links, complete initial cards, pagination and JSON-LD are available without the enhancement script.

## Editor and template ownership

Content controls cover the separate hero/H1 ownership, standalone header visibility, heading font and optional product-list heading. Products controls cover pagination and the all-products filter toggle. Header visibility is conditional on the hero ownership setting; the all-products page always supplies its own H1. Visibility controls use the shared contract. Schema scenarios are registered in `tests/editor-schema-contracts.json`.

Local `collection.json`, `.soda.json` and `.seltzer.json` are development compositions. They pair Collection hero and Collection, then reuse existing Merchant marquee, ingredients, comparison, subscription, FAQ, benefits/awards and Two-column layout sections. Two-column text/link boxes provide clearly marked preview SEO content and real crosslinks. The merchant marquee references the existing Soda/Hard Seltzer merchant groups and FAQ uses the matching existing category. Replace preview editorial copy before launch. No shared editorial template was overwritten and no collection template suffix was changed in Shopify; use `?view=soda` / `?view=seltzer` for local review until the go-live assignment plan is applied.

## Verification — 2026-09-15

Theme Check, editor schema and typography gates; desktop 1440px and phone 390px; correct filter membership/counts (13 total, 2 Soda, 2 Hard Seltzer, 6 Clothing, 3 Accessories); rapid selection and Back restoration; enhancement-blocked native links; unique H1; JSON-LD parsing; ambient pause and reduced-motion behavior. An 8-product temporary page-size fixture verified fetching the remaining pages and filtering all 13 visible products; a simulated failed page request retained the original cards and cleared loading state. The final 24-product fixture was restored. English was not published.

Shared card styling now lives in `assets/catalog-card.css` and is available on every header-bearing page. The header uses the same renderer with a documented `navigation` presentation: direct merchant imagery and Navigation titles, without prices or bundled cutout reconstruction. Collection rendering and filtering stay unchanged. See [Header](header.md).

Paired Variety Pack cans now lift and scale together on hover and keyboard focus, preserving their individual rotations. Reduced motion keeps the composition static.

Ananotes 123–124: result counts/loading announcements are visually hidden; actionable fetch errors remain visible. Shared collection media uses an inset contain box (84% width, 88% height) anchored to the same bottom edge; paired cans are reduced proportionally. Navigation presentation is excluded. Original complete merchant images retain their intrinsic proportions; existing crops baked into uploads cannot be recovered by CSS.

Grounded Soda/Hard Seltzer catalog cans now render the shared `can-shadow` primitive inside an aspect-ratio-matched `can-artwork` wrapper. Wrapper sizing preserves the existing 84%/88% contained-image bounds; hover/focus moves can and shadow together. Tilted Variety Pack pairs remain floating, without an invented floor. Shared parameters live in `can-artwork.css`; card typography, image selection and structured data remain unchanged.

The shared Hard Seltzer fallback cutouts now use the merchant’s tightly trimmed 385×1000 exports (lossless WebP). Single and paired image dimensions match those files. The shared Seltzer shadow anchors its ellipse centre to the visible bottom edge; the former padded-asset calibration is removed centrally.
