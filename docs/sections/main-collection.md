# Collection

Source: `sections/main-collection.liquid`, `snippets/catalog-products.liquid`, `snippets/catalog-product-card.liquid`, `assets/collection.css`, `assets/collection.js`.

## Shared catalog rule

**All-products and individual collection pages must use the same product card and listing logic until an explicit, documented decision approves a split.** Both call `product-card` with `card_layout: 'catalog'`; that entry point delegates to the one catalog card. Search and Featured collection retain their existing compact card mode. Product Overview remains a separate manually authored editorial teaser, not a catalog query.

The catalog uses real `collection.products`, availability/localized product URLs and Shopify prices. It respects existing `custom.hide_in_collection == true` everywhere in this listing. That field only removes the listing card: it does not unpublish the product, block its direct URL or remove it from other surfaces. On 2026-09-15 both variety packs and trial packs were marked hidden; these values were preserved pending merchant direction.

## Cards and data

Standard/general product cards use a white Surface background with a 3px Muted surface border, shared with product navigation cards (Ananotes, 2026-10-09). Explicit merchant background artwork retains precedence; Soda and Hard Seltzer artwork is unchanged.

Three columns at 990px+, two at 600–989px, one below 600px. Cards link to PDPs, without quick-add or variant assumptions. Soda uses its logo and Erode flavor title; Hard Seltzer uses its logo and established flavor artwork. General products show the teaser category/product type, Shopify price and real product title. Crossed-out prices use the secondary accent.

Background precedence reuses `product-background`: product `custom.gallery_background_image`, then validated `custom.gallery_gradient`, then the card's neutral/brand starter surface. Canonical Holunder has a green starter surface. Brand classification reuses `custom.brand_variant`; no duplicate world field.

Product **Collection Image** (`custom.collection_image`) wins for every catalog card, including known flavours and variety packs. Without it, the four known flavour cards retain the bundled transparent Product Overview artwork and two flavour SVGs; both known variety cards retain their two-cutout composition. Other products fall back to the featured product image. Collection cards never consume **Navigation Image** (`custom.teaser_image`). A selected variety image replaces the paired composition with one complete image. The existing contained-image geometry, brand titles and shared shadows remain in use. No artwork is uploaded, assigned or migrated by this change, and bundled assets remain for empty-field compatibility.

All-products groups Soda, Hard Seltzer and general cards within each server page; individual collections retain Shopify order. Hidden items are excluded by the shared `catalog-products` loop in HTML and structured data alike. Shopify pagination counts include hidden products, so an individual page can have fewer visible cards than the page-size setting, or be empty with a next-page link. Do not misrepresent those counts as visible totals.

## Filter navigation and SEO

Mobile filter sizing (Ananotes 246): below 768px, three equal columns place the current five filters in two rows. Buttons use the shared Small text role, 56px minimum height, 8px padding/gaps and 24px-high contained brand artwork. Additional merchant collections can add rows. Desktop sizing and native-link filtering behavior remain unchanged.

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

Paired Variety Pack cans lift together without scaling on hover and keyboard focus, preserving their individual rotations. Reduced motion keeps the composition static.

Ananotes 123–124: result counts/loading announcements are visually hidden; actionable fetch errors remain visible. Shared collection media uses an inset contain box (84% width, 88% height) anchored to the same bottom edge; paired cans are reduced proportionally. Navigation presentation is excluded. Original complete merchant images retain their intrinsic proportions; existing crops baked into uploads cannot be recovered by CSS.

Grounded Soda/Hard Seltzer catalog cans now render the shared `can-shadow` primitive inside an aspect-ratio-matched `can-artwork` wrapper. Wrapper sizing preserves the existing 84%/88% contained-image bounds; hover/focus moves can and shadow together. Tilted Variety Pack pairs remain floating, without an invented floor. Shared parameters live in `can-artwork.css`; card typography, image selection and structured data remain unchanged.

The shared Hard Seltzer fallback cutouts now use the merchant’s tightly trimmed 385×1000 exports (lossless WebP). Single and paired image dimensions match those files. The shared Seltzer shadow anchors its ellipse centre to the visible bottom edge; the former padded-asset calibration is removed centrally.

Shared card motion (Ananotes 158): artwork uses an 8px vertical lift over Fast duration with UI easing, without scaling. Can/shadow groups and paired artwork retain their composition. An explicit zero-translation resting transform matches the final transition geometry. Reduced motion disables the lift. This is shared with navigation cards through `catalog-card.css`.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Rounded surfaces use the shared [panel shadow](../design-system.md#panel-shadows); nested surfaces suppress the additional shadow. Existing layout, focus and motion behavior is preserved.

Shadow rollout: catalog grids preserve their overflow clipping with a 2rem overflow-clip margin so edge-card shadows can paint. All-products, default and branded collections reuse the same card/grid styling.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Page**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.

TASK-013 verification (2026-10-08): definitions provisioned and read back through Admin GraphQL; all 20 product image assignments remained unchanged. Local Liquid render fixtures covered 35 selection cases across known flavours, both variety packs, general products, compact cards and navigation. The local engine normalized Shopify blank assignments for compatibility and stubbed CDN filters; populated Collection Image was not tested by modifying a real product. Actual Shopify-rendered empty-field catalog and header images were checked at 1440px/390px; CollectionPage JSON-LD parsed and continues describing the same listed product identities/URLs without image properties. No additional Product entities are emitted for this image-source change. Full checks passed.

Per-product shadow control (2026-10-08): Product boolean `custom.hide_card_shadow` (**Hide shadow for nav item and collection card**) suppresses only generated floor-shadow markup when true. Unset/false preserves the existing appearance. The shared artwork wrapper, image geometry, hover/focus behavior and outer card panel shadow remain. See [merchant content](../merchant-content.md#per-product-card-shadow). No product values, schema or structured data changes.

Catalog background edge (sparklys.ch Ananotes 11, 2026-10-09): the Variety Pack source background contains a dark final pixel column (sampled at mid-height). Shared catalog background layers extend 2px beyond the card’s existing rounded clip to crop export edges and avoid fractional coverage gaps. No image migration, product preference or merchant asset changes.

Edge verification at 2104px: the rightmost card-edge pixel at mid-height changed from RGB 138/189/128 to 166/239/154, matching the surrounding green instead of the exported dark stripe. Rounded clipping and card artwork remain intact.
