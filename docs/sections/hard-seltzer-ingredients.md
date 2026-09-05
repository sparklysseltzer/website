# Hard Seltzer Ingredients

Source: `sections/hard-seltzer-ingredients.liquid`

Display headings use the centrally resolved font-specific line height from the [design system](../design-system.md); section CSS must not introduce a separate heading rhythm.

## Purpose and placement

Hard Seltzer Ingredients reproduces the approved three-part ingredient story as a focused Hard Seltzer editorial section. It is available under **Trust & information** and is not combined with Soda Ingredients because the two compositions and content models are materially different.

## Merchant controls and defaults

The section exposes only its heading, introduction, and up to three ingredient blocks. Each block has an optional replacement illustration and text. Blank settings use localized English/German runtime defaults; blank image pickers automatically render the bundled vector composition in the current block position. There is no fallback selector, crop control, color control, or product-world switch.

Bundled assets are `heading-three.svg`, `base-blob.svg`, `base-ring.svg`, `base-icon-a.svg` through `base-icon-d.svg`, `water-blob.svg`, `water-icon.svg`, `flavor-blob.svg`, and `flavor-icon.svg`. Reordering a blank block also changes which positional fallback illustration and default copy it receives.

## Rendering, motion, and accessibility

Ingredient descriptions use the standard Maison Neue Demi body font (`--font-body`, registered at CSS weight `400`), not Maison Neue Bold. Keep the normal body weight rather than introducing an emphasized font for these paragraphs.

Frame `8582:28776` uses black text on white. The desktop equation is a compact 716px composition with approximately 230px item columns and narrow plus-sign slots. The 109px symbols sit above the copy while decorative color shapes extend beyond their boxes; the artwork does not enlarge the text grid. Localized copy and the shared Newake rhythm remain responsive instead of reproducing the frame's fixed text heights.

Desktop uses one centered heading and a three-item equation separated by decorative plus signs. Phone layouts stack the items and separators vertically. Merchant-selected images use Shopify responsive image rendering; the source-controlled SVGs remain exact theme-asset fallbacks.

The heading's visible uppercase text is optically centered beside the numeral at every breakpoint. A font-relative `top: .08em` adjustment compensates for Newake's asymmetric font box (about 6px at desktop), without changing the shared line height. Native cap trimming was tested but moves this particular font's visible lettering upward; do not substitute it for the measured optical alignment against the outlined numeral.

`editorial-section-motion` applies the shared reversible surface reveal and sequential content staggering. The server-rendered final state remains complete without JavaScript, and reduced-motion users receive no scripted animation. The heading is an `h2`, the items expose list semantics, and all illustration layers are decorative because the adjacent text carries their meaning.

## Structured-data decision

This is visible editorial ingredient copy, not a Recipe, nutrition model, Product offer, or another honest standalone Schema.org entity. It therefore emits no section-owned JSON-LD. Product-level ingredient facts should be represented later as part of a canonical Product data contract rather than duplicated here.

## Shared typography roles

Display heading; the same body role for both introduction and ingredient descriptions; symbol role for decorative plus signs. Optical heading alignment remains unchanged.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
