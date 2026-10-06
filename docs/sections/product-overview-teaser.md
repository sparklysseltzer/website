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

## Responsive composition

At widths above 1200px, four cards share one row with the original 335:575 composition, section heading and category-navigation pills. At 1200px and below, two cards share each row; below 320px, cards stack one per row. The compact section heading is visually hidden but remains an H2 in the accessibility tree. Category navigation is hidden entirely at these compact widths. Whole-card product links remain available.

Compact cards use 335:480 proportions with a 15rem minimum height and 100% of their grid track. A flexible media row sits above a natural-height identity row, separated by 0.5rem. The identity is left aligned. Cans use up to 90% of media-row height, retaining merchant width/offset settings and Soda 90% / Hard Seltzer 105% artwork scale. Seltzer media reserves 1rem at the top for the alcohol badge. These rules replace the earlier short centered tablet cards and prevent logo/can collisions without shrinking normal UI text.

Soda flavour lettering is approved artwork typography: compact layouts use `min(15.5cqi, 3.875rem)`, matching the wide composition rather than ordinary body/Compact text. Soda and Seltzer brand marks use 28% and 35% of card width, capped at 6.5rem and 7.5rem. Seltzer flavour SVGs use 58%, capped at 13rem. Decorative card arrows are omitted in the compact layout. Section headings preserve authored casing in all brand contexts; the section retains its `heading-font-legacy` typography contract.

The alcohol badge retains its original Label font and 0.625rem/0.75rem padding. A ResizeObserver scales the entire badge between 70% and 100% relative to a 335px card; it runs independently of reduced motion and disconnects with the section. No-JavaScript compact fallback is 70%. Top/right inset is 8px through 750px, grows smoothly to 16px around 900px, and remains 16px through 1200px. Wide desktop retains its original 12px inset and unscaled badge. The can overlaps only a small lower edge of the compact badge.

## Navigation, motion and fallbacks

Blank card links resolve the canonical product through `all_products`; explicit links remain authoritative. Category links fall back to their corresponding collection and the all-products route. No collection query or new product entity is implied by the section; destination products own their Product structured data.

`product-overview-motion` reuses the Offer cards reversible scroll reveal/parallax engine. Keyboard focus reveals the focused card. Complete static cards, headings and native links remain usable without JavaScript and under reduced motion. The intermittent report of missing scroll-reveal sections remains unconfirmed: the existing user tab showed all cards when inspected, without reload; no fix has been claimed for that report.

## Assets and styling

Fallback assets follow canonical block identity, with block order as fallback for new presets. Selected images replace the can cutout while retaining light/shadow composition. These are transparent-artwork positioning controls, not crop controls. Hard Seltzer can assets are the merchant-supplied 385×1000 lossless WebP conversions, with original script SVG logos; no generated pixels or additional crops.

The shared floor-shadow primitive owns brand positions, strength and colours. Seltzer uses 145% width, 3% horizontal offset, a 98.7% floor and contact translation derived from the SVG geometry. Cards use shared radii and panel shadows. Brand palettes, backgrounds and type roles follow the [design system](../design-system.md); flavour artwork is the documented type-size exception.

## Editor and content ownership

Layout → Content width selects Narrow (800px), Editorial (1400px) or Page (1920px outer frame), default Page. Visibility controls hide the section by breakpoint. Section background is Transparent or Colored, with Surface visible for Colored and the picker visible only for Custom color. New presets start transparent. These controls preserve saved IDs and do not migrate merchant content.

## Verification

Latest responsive checks covered 319/320/390/750/900/1200/1201/1440px: correct grid boundaries, contained labels, small positive can/logo gaps, badge scaling/insets and preserved wide layout. The hidden heading remained in the accessibility tree; mobile screenshots were inspected. Repository gates, JavaScript syntax, JSON parsing and whitespace validation passed. Test browsers were closed. This is representative coverage, not certification of every merchant artwork offset or enlarged-text combination.

## Shared arrow interaction

Circular arrows reuse `button--round-arrow` and the shared secondary-button oval sweep (240ms enter, 460ms exit). Existing section-specific circle/icon sizes, colors and shadows remain intact. Linked cards/navigation trigger the decorative arrow from parent hover and keyboard focus without adding a nested interactive control. Reduced motion follows the shared immediate-state fallback. Content Slider retains its own boundary states and native button semantics.

Filled arrow circles use zero physical border and no border-overlay pseudo-element: the oval hover/focus sweep reaches the outer circle edge. Existing circle/icon sizes, colors, shadows and separate keyboard focus indicators are preserved.

## Navigation controls (2026-10-05)

**Show navigation buttons** defaults on and controls the entire three-link navigation group. Off omits its markup and hides All products label plus all three destination fields in the editor; product cards and saved values remain. Existing responsive behavior still hides navigation at widths up to 1200px. The new-instance merchant label defaults to the requested German “Alle Produkte”; existing authored labels remain authoritative. Blank destinations use `routes.all_products_collection_url`, `collections.soda.url` and `collections['hard-seltzer'].url`, with their localized Shopify URLs. Editor help now names each automatic destination; URL fields remain optional overrides. Shopify URL schema defaults do not support arbitrary collection URLs, so canonical collection defaults remain in Liquid rather than hardcoded schema paths. Reviewed controls: navigation gates its four fields, Custom background gates Color, and width/breakpoint visibility enable no other fields. IDs, block definitions and saved content are preserved.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).


Ananotes 177 (2026-10-06): remove only the top section padding at 1200px and below, matching the existing hidden-heading/navigation breakpoint. Desktop and bottom spacing are unchanged.
