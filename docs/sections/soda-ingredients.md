# Soda Ingredients

Source: `sections/soda-ingredients.liquid`

Display headings use the centrally resolved font-specific line height from the [design system](../design-system.md); section CSS must not introduce a separate heading rhythm.

The smaller multiline ingredient titles use the shared `--line-height-heading-small-erode` token (`1`, or 32px leading at 32px desktop type). This preserves the reference's readable separation without applying the tighter large-display rhythm to card copy.

## Purpose and placement

Soda Ingredients is the six-item Soda ingredient overview from the approved composition. It remains separate from Hard Seltzer Ingredients because its photographic grid, quantity, copy, and legal-note contract are different.

## Merchant controls and defaults

The section exposes a heading, introduction, optional inline link, footnote, and up to six ingredient blocks. Each block contains an optional Shopify image, title, and text. Blank settings use localized runtime defaults; blank images use positional bundled assets named `soda-ingredient-*.webp`. Reordering a blank block changes its positional default content and image. The renderer uses `#` while the link URL is blank so the starter link stays visible until the merchant selects the real destination.

There are no image-position controls. Shopify-selected images use the native saved focal point; the source-controlled square fallbacks use their approved centered crop.

## Rendering, motion, and accessibility

Frame `8582:28778` uses black headings/introduction, brown supporting copy and links, a `#faf8f2` background, and the `#cab592` footnote. The desktop content width is 1200px plus shared gutters, with 20px gaps between illustrations and after the introductory copy. Item titles support explicit line breaks for long compound names. The legal note is constrained to 600px.

The six-column desktop grid becomes three columns on tablets and two columns on phones. Circular images remain decorative because each item has a real heading and explanation. `editorial-section-motion` supplies the shared reversible surface reveal and sequential item staggering, with a complete no-JavaScript rendering and reduced-motion path.

## Structured-data decision

The section is marketing-oriented ingredient information, not a Recipe, nutrition table, or canonical Product record. It emits no standalone JSON-LD. Any future machine-readable product ingredients belong to the product model and must remain consistent with visible product data.

## Shared typography roles

Section heading; card headings; the same body role for introduction and descriptions; small footnote.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
