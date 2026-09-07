# Soda Ingredients

Source: `sections/soda-ingredients.liquid`

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

## Typography roles

Section heading; card headings; the same body role for introduction and descriptions; small footnote.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Ananotes correction — notice text

The legal footnote uses `--color-notice-text` (Theme settings → Colors → Notice text), independently of ordinary muted supporting copy.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.
