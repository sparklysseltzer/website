# Hard Seltzer Ingredients

Source: `sections/hard-seltzer-ingredients.liquid`

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

Both decorative plus signs participate in the same sequential reveal as the ingredient items, in equation order. They remain visible without JavaScript and with reduced motion.

## Structured-data decision

This is visible editorial ingredient copy, not a Recipe, nutrition model, Product offer, or another honest standalone Schema.org entity. It therefore emits no section-owned JSON-LD. Product-level ingredient facts should be represented later as part of a canonical Product data contract rather than duplicated here.

## Typography roles

Display heading; the same body role for both introduction and ingredient descriptions; symbol role for decorative plus signs. Optical heading alignment remains unchanged.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.
