# Product overview teaser

Source: `sections/product-overview-teaser.liquid`

## Purpose and placement

Product Overview is an editorial navigation module, not a Shopify collection query. The homepage places it after the introduction and currently renders four manually authored Soda/Hard Seltzer cards plus three optional navigation pills.

## Merchant controls

The section owns a heading and optional All Products, Soda, and Hard Seltzer destinations. Each product block provides:

- optional Shopify image with an automatic slot-specific can fallback;
- title and optional whole-card URL;
- Soda or Hard Seltzer product world;
- optional alcohol badge;
- start/end background colors, title color, and image-glow color;
- image width and horizontal/vertical artwork translation.

## Starter visual system

- Soda uses optimized Yuzu and Blueberry WebP cutouts; Hard Seltzer uses the current manually exported Maracuja and Holunder WebP cutouts.
- Each card has a product-color image glow behind the can, a Figma-derived bottom-left white radial overlay above the background, and an independently colored progressive SVG floor shadow.
- Floor shadows use smooth overlapping Gaussian-blur layers; all shadows are darkened to the approved 40% treatment. Hard Seltzer shadows are 145% wide and use the approved vertical position.
- Soda artwork scales to 90% and Hard Seltzer artwork to 105% around a shared bottom origin.
- Maracuja and Holunder render their exported script-logo SVGs while retaining the merchant title in a visually hidden semantic `h3`.
- Soda line breaks are flavor-specific: `Yuzu &` / `Ginger`, and `Blueberry` / `& Pomelo`.

## Responsive collision contract

The card itself is the inline-size container. Brand marks, Soda title size, flavor SVG width, and round card arrows scale from container-query units rather than viewport width. Narrow cards lift the complete artwork, floor shadow, and image glow together by up to 32px. This prevents can/logo and title/arrow collisions while preserving a minimum 12px horizontal control gap. Every can remains on one shared visual floor at each breakpoint.

The current content bottom padding is 40px. Soda title line-height is `0.75`. Hard Seltzer logo and flavor SVG boxes overlap by 4px to form one compact lockup.

## Navigation and motion

The three top navigation pills use equal top/right/bottom padding around their arrow circles. Desktop renders four cards in one row. Below 1200px the grid becomes two columns; phones expose independent horizontal scrollers without page-level overflow.

`product-overview-motion` reuses the Offer cards scroll-scrub/parallax engine. Links, headings, badges, logos, and complete static cards remain available without JavaScript and in reduced-motion mode.

## Maintenance notes

Starter assets are assigned automatically from the canonical block identity, with block order as the fallback for newly created preset blocks; merchants never select them in the Theme Editor. A merchant-selected image replaces the corresponding can cutout but retains the card lighting/shadow system. The retained width and translation controls position complete transparent can artwork and are intentionally not crop controls. When starter exports change, update intrinsic dimensions and verify alpha bounds, shadow contact, shared floor, responsive collisions from 390px through 1600px, keyboard focus, reduced motion, and no-JavaScript rendering.

## Typography roles

Section heading; UI navigation pills; label badges. Approved artwork-like flavor titles retain their existing container-responsive exception and collision contract.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Preserved typography

This section opts out of the general editorial heading-font feature through its Shopify wrapper class `heading-font-legacy`. Its original type families, weights, tracking and line heights remain authoritative. Existing variant-based type selection and pre-existing font controls (where present) are preserved; no new global font selector is added.

## Ananotes artwork and destinations (2026-09-15)

Blank card links resolve the canonical product through `all_products`; explicit links remain authoritative. Category links fall back to the corresponding collection and all-products route. Can artwork now layers above the alcohol badge during hover.

Maracuja/Holunder can cutouts were re-exported from Figma nodes `10938:86556` and `10938:86602` (408×1011, WebP quality 90). Complete transparent script logos come from `10938:86583` and `10938:86629`; retained asset filenames preserve existing references. Only the target artwork group is retained, excluding ancestor canvas backgrounds. Collection cards and heroes share these assets and their updated intrinsic dimensions.

## Can/shadow floor calibration (2026-09-15)

The shared floor-shadow primitive owns brand positions, 0.6 brightness and flavour colours. On 2026-09-15 the merchant supplied tightly trimmed `sparklys-hard-seltzer-{maracuja,holunder}-single-can-01.png` replacements from Downloads (both 385×1000). They replace the two existing theme WebP assets using lossless conversion at original resolution; no generated pixels or additional crop. Intrinsic dimensions are updated across Product Overview, collection cards/paired artwork and Collection hero.

The former 1.5% downward compensation for transparent margins is removed from normal and hover placement. The Seltzer shadow now anchors at the merchant-calibrated floor (`top: 98.7%`) and translates upward by 48.577% of its own height, placing the SVG ellipse centre (`16.5163 / 34`) at that floor independently of can aspect ratio. Shared 145% width, 3% horizontal offset, colour/brightness and the approved 105% can scale remain unchanged. Navigation continues using merchant teaser/featured images rather than these theme fallbacks.

Shared-shadow QA: inspected real Product Overview and collection cards at 1440px/390px, plus a browser-only navigation card fixture using the shared catalog markup. Verified one global strength override changes all rendered shadow instances, the masks load from local theme assets, and reduced-motion keyboard focus keeps the artwork static. Full checks, final Theme Check and JavaScript syntax pass; JSON validates after removing Shopify generated comment headers. Browser closed.

Trimmed-asset QA: inspected Product Overview at 1600px/390px and the collection hero/grid at 1440px; confirmed 385×1000 intrinsic dimensions in rendered collection images and responsive containment at 390px. Script-blocked phone rendering retains the can/floor composition. Full checks, theme.js syntax and diff whitespace pass; all 34 JSON files validate after removing existing Shopify generated comment headers. No merchant image fields or saved template settings were changed. Test browser closed.

The merchant then supplied larger 385×1000 versions of both trimmed exports. These replace the initial 189×492 files losslessly, with intrinsic dimensions updated in every shared consumer. The bottom-edge shadow calibration remains unchanged.

Merchant refinement: the shared `--can-shadow-seltzer-top` is 98.7%; the existing mask contact translation remains unchanged. This lifts the floor slightly into the can base across all shared Seltzer shadow applications.
