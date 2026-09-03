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
- Maracuja and Holunder render their exported wave-logo SVGs while retaining the merchant title in a visually hidden semantic `h3`.
- Soda line breaks are flavor-specific: `Yuzu &` / `Ginger`, and `Blueberry` / `& Pomelo`.

## Responsive collision contract

The card itself is the inline-size container. Brand marks, Soda title size, flavor SVG width, and round card arrows scale from container-query units rather than viewport width. Narrow cards lift the complete artwork, floor shadow, and image glow together by up to 32px. This prevents can/logo and title/arrow collisions while preserving a minimum 12px horizontal control gap. Every can remains on one shared visual floor at each breakpoint.

The current content bottom padding is 40px. Soda title line-height is `0.75`. Hard Seltzer logo and flavor SVG boxes overlap by 4px to form one compact lockup.

## Navigation and motion

The three top navigation pills use equal top/right/bottom padding around their arrow circles. Desktop renders four cards in one row. Below 1200px the grid becomes two columns; phones expose independent horizontal scrollers without page-level overflow.

`product-overview-motion` reuses the Offer Cards scroll-scrub/parallax engine. Links, headings, badges, logos, and complete static cards remain available without JavaScript and in reduced-motion mode.

## Maintenance notes

Starter assets are assigned automatically from the canonical block identity, with block order as the fallback for newly created preset blocks; merchants never select them in the Theme Editor. A merchant-selected image replaces the corresponding can cutout but retains the card lighting/shadow system. The retained width and translation controls position complete transparent can artwork and are intentionally not crop controls. When starter exports change, update intrinsic dimensions and verify alpha bounds, shadow contact, shared floor, responsive collisions from 390px through 1600px, keyboard focus, reduced motion, and no-JavaScript rendering.
