# USP

Source: `sections/usp-section.liquid`

## Purpose and placement

USP implements the shared Soda and Hard Seltzer Figma module in one reusable section. It is currently placed after the introduction in both branded collection templates.

## Context and defaults

`Automatic — page context` is the safe default. The section resolves the existing server-side brand context through `snippets/brand-context.liquid`:

- Soda pages render the approved Soda background, Erode heading, copy, image, five icons, and labels.
- Hard Seltzer pages render the approved black/white treatment, Newake heading, copy, image, six icons, and labels.
- Unclassified pages render no storefront section in Automatic mode; the Theme Editor shows an explanatory note. Select an explicit Soda or Hard Seltzer variant when placing the section on a shared page.

This runtime resolution is intentional because Shopify section-schema defaults cannot vary by the template being previewed. Moving an Automatic instance between classified templates therefore updates its complete product-world presentation without saving a stale brand choice.

The resource's recognized `custom.brand_variant` value is the authoritative Automatic classification (`hardseltzer` normalizes to `seltzer`). Existing definitions are on Products and Pages; Collection overrides can use the same key if needed. Branded template suffixes and canonical collection membership remain fallbacks when that field is blank.

## Merchant controls

- automatic, Soda, or Hard Seltzer content variant;
- optional heading, rich text, and Shopify background-image overrides;
- automatic, Newake, or Erode heading typeface;
- automatic product-world colors or custom background/text colors;
- up to six custom USP blocks, each with an image icon and label.

Blank section-level content uses localized Figma defaults. When no custom USP blocks exist, the section renders the canonical brand collection’s `custom.usp_set` ordered items, falling back to five Soda / six Hard Seltzer defaults. Adding any custom blocks replaces that default set for the current section instance.

The Add section picker exposes separate `USP — Soda` and `USP — Hard Seltzer` presets so Shopify's generated visual previews render the correct product-world design. Both presets set an explicit starting variant; merchants can switch a placed instance back to Automatic when it should follow the resource context.

## Rendering contract

Desktop reproduces the 1400 by 630 composition inside a centered panel using the theme's large-radius token, which defaults to 30px. The exact flattened Figma media/gradient export remains the automatic decorative background when both the image picker and product `custom.usp_image` are blank; A section image override wins over product `custom.usp_image`; a Shopify-selected replacement uses its native focal point with no separate crop control. The title, description, and USP labels remain real localized HTML. Original Figma SVG layers render the icons without remote runtime assets.

Below 896px the panel stacks the cropped media above the content. Five USP items use a centered 3+2 grid; the six-item Hard Seltzer set uses 3+3; shorter custom sets are centered where necessary.

`usp-section-motion` reuses the theme's reversible scroll-progress engine. The panel reveals through the shared 48px maximum upward travel, heading and text follow in hierarchy, USP items use restrained staggering, and the clipped media moves through ±3% vertical parallax. The target state follows viewport progress in both scroll directions with the shared short catch-up response.

## Accessibility and maintenance

The title is an `h2`, the USP collection exposes list semantics, decorative images have empty alternative text, and all claims remain readable without images or JavaScript. The server-rendered final composition remains the no-JavaScript fallback, and reduced-motion mode cancels all non-essential reveals and parallax. Do not change fallback claims or icons without approved Soda/Hard Seltzer content. If either Figma composition changes, re-export the media and vector layers rather than recreating them in CSS.

## Typography roles

Display heading; body introduction; label role for all USP icon captions. Labels wrap in the existing centered responsive grid.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

## Shared product content — 2026-09-11

`usp_item` entries hold a translatable caption and optional image icon. `usp_set` entries hold an ordered item list and optional rich-text footnote. The canonical Soda and Hard Seltzer collections each select their set once through `custom.usp_set`; Automatic PDP and editorial sections consume that same set. Existing explicit section blocks remain local overrides, with their IDs preserved. Shared footnotes render only when using shared items, never alongside unrelated custom blocks.

`snippets/usp-items.liquid`, `usp-icon.liquid`, `usp-footnote.liquid` and `assets/product-usps.css` own shared rendering. Stable seeded handles select the original vector icon layers when an icon override is blank. Unchanged English seed captions use theme EN/DE translations; edited or Shopify-translated entry captions win. Empty footnotes use the approved localized Soda folate / Hard Seltzer calorie statements. A populated footnote wins and must be translated in Shopify.

For different artwork on products sharing one template, keep the section image blank and fill each product’s `custom.usp_image`. No duplicated template or section placement is needed. Explicit section images remain intentional template-wide overrides. The new image definition exists; product-specific images remain merchant content.
