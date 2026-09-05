# Versus

Source: `sections/versus.liquid`

Display headings use the centrally resolved font-specific line height from the [design system](../design-system.md); section CSS must not introduce a separate heading rhythm.

## Purpose and variants

Versus combines the structurally identical Soda and Hard Seltzer comparison designs into one section with a `Product world` switch. The Add section picker exposes **Versus — Soda** and **Versus — Hard Seltzer** presets so generated previews start with the correct typography, background, products, facts, and legal notes.

## Merchant controls and defaults

The section exposes the variant, heading, comparison basis, disclaimer, and the Soda-only footnote. Each of up to five comparison blocks exposes its title, optional replacement image, Sparklys-product flag, and three or six values depending on the selected variant. Soda-only values use conditional field visibility in the Theme Editor.

Blank text and values resolve from localized runtime defaults. Blank product images use positional bundled `versus-*.webp` artwork; some approved products are deliberate two-image compositions. Reordering blank blocks changes their positional fallback data, so the canonical Sparklys block should remain first and flagged as the Sparklys product.

## Responsive ordering and horizontal flow

The reference frames are `8583:28780` (Soda) and `8583:28781` (Hard Seltzer). The content column is 1200px plus shared page gutters. Cards use 112px media boxes, 20px internal gutters, shared stat/label typography, and discrete 8px-spaced fact rows. The first five Soda facts and first two Hard Seltzer facts receive the pale green panels on the Sparklys card. Its border is 40% green; the remaining Soda facts are brown, and Hard Seltzer facts are gray. Hard Seltzer cards are white; Soda cards are cream. Do not replace these panels with table divider lines or enlarge the media into full-card product shots.

The Soda badge uses three exact `versus-soda-badge-*.svg` layers; all comparison arrows/checks/crosses and the caffeine leaf also use exact exported SVGs. Source-controlled crop wrappers reproduce the original product cutouts without adding editor crop controls. Merchant image replacements bypass those fallback crop wrappers.

The comparison track is a native horizontal scroller whenever its cards do not fit, with scroll snapping and keyboard focus. The Sparklys card is always visually first on phones. From 750px upward it receives desktop order three, while competitors fill orders one, two, four, and five. At wide desktop widths all five cards fit in one row; narrower viewports preserve the same ordered flow through `overflow-x` instead of shrinking cards below a readable width.

The DOM stays a semantic list of articles and descriptions. There are no JavaScript-only slider controls, so touch, trackpad, mouse-wheel-assisted horizontal scrolling, keyboard focus, and no-JavaScript use remain available.

## Motion and structured data

`editorial-section-motion` applies the shared reversible panel reveal and hierarchical staggering; it does not transform the horizontal scroll position. Reduced-motion users receive the complete static layout.

The competitor cards describe illustrative beverage categories, not canonical Shopify products or offers, and the disclaimer explicitly says they are not specific brands. Emitting Product, Offer, Review, or ItemList entity data would therefore overstate the model. Versus intentionally emits no JSON-LD until comparison data has canonical entities and a validated Schema.org purpose.

## Shared typography roles

Section heading; body comparison basis; compact product names; label fact captions; stat figures; small notes. Desktop/mobile ordering is unchanged.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
