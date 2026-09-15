# Poster

Source: `sections/poster.liquid`

## Purpose

Poster owns the approved full-image editorial composition, either with overlaid content or as an image-only surface. It is available as a reusable section preset. The side-by-side composition is a separate [Image and text panel](split-image-text.md) section so each Theme Editor contract stays focused.

## Merchant controls

- Poster with Content or Image only Poster layout;
- optional Shopify desktop and mobile images;
- shared image alternative text and Shopify-native focal points for selected images;
- independent desktop/mobile minimum heights;
- in Poster with Content: left/center/right content alignment, optional heading (`h2` or `h3`), rich text, tick-list blocks, linked action, automatic/dark/light button treatment, text color, and overlay color/strength.

Image-only mode hides the content, tick-item, action, and overlay fields while retaining media and size controls. Its renderer omits the overlay and complete content subtree, including configured tick-list blocks. Poster with Content reveals those controls; heading, subtext, and action fields remain conditionally visible only while their corresponding display toggle is enabled. Headers divide layout, media, content, appearance, and size controls.

Tick-list blocks render whenever at least one non-empty block exists, so the section does not duplicate that state with a separate display toggle. The preset uses `#` as its initial action URL, and the renderer applies the same fallback to older blank instances, so an enabled button remains visible until the merchant selects its destination.

The Poster surface uses the same centered 87.5rem/1400px maximum width as USP. The shared `--radius-large` token and `.section` rhythm keep both modules aligned with the theme-wide layout system.

## Rendering and motion

The bundled `poster-subscription.webp` artwork renders automatically while the desktop image picker is blank. It is a 1632 by 686 high-quality WebP with alpha preserved from the approved source export. Shopify-selected media replaces it and renders responsively with intrinsic dimensions. An optional mobile image provides true art direction through a `<picture>` element, so the browser downloads only the source that matches the viewport; when it is blank, the desktop image is reused. Each selected image's Shopify focal point controls its crop, with no separate fallback or crop selector in the section schema. `poster-motion` adds reversible scroll-scrubbed surface/content reveals and clipped-media parallax; image-only mode retains the surface and media motion without creating content reveal targets. The static final composition is the server-rendered default; JavaScript and motion are skipped for reduced-motion users.

## Accessibility and limits

The selected heading level preserves page hierarchy, decorative tick icons are hidden from assistive technology, and the action renders only when enabled with a non-empty label. Editors must replace the `#` placeholder with a meaningful destination and supply useful image alternative text when the image conveys content. Video, multiple actions, and app blocks are not implemented.

## Typography roles

Section heading; body copy and tick-list text; UI actions. Image-only mode is unchanged.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Embedded reuse

`poster-content.liquid` now owns the common markup, with `component-poster.css` loaded by either owner. The standalone section passes its existing section blocks; the native Poster block inside Two-column layout passes nested Tick item markup. Existing setting IDs, asset fallback, accessibility and `poster-motion` behavior are preserved. Embedded mode removes the outer section gutter/spacing and uses the width of its Content column.

Embedded content remains at most 36rem wide, with left/center/right placement preserved inside the narrower poster. It fills the available width on small screens.

## Editor dependency contract

Standalone and embedded versions group Layout, Image, Content, Button, Appearance, Size and (standalone) Visibility. Font selection belongs to Content, not above Layout. Image-only hides all content/action/appearance inputs; image selection and minimum heights remain relevant. Heading, subtext and button toggles independently gate their fields. Native child tick entries remain listed in Shopify even in image-only mode, but the renderer omits them.

## Accordion reuse

The existing native block is also available inside Accordeon items, retaining its settings, conditional fields, image handling and responsive behavior. Accordion placements use the same compact embedded spacing as Two-column layout. No duplicate content model or structured data is introduced.

## Collection directory reuse

`poster-content` accepts an optional `collection_resource` for the Collection list. That mode obtains the title, description, image and URL directly from Shopify, selects the existing left-content layout and light action, and disables the subscription fallback image. Standalone and editorial block callers continue to use their existing `options` contracts unchanged. See [Collection list](main-list-collections.md).

Ananotes 125: light Poster actions use the shared button--inverse border treatment so the outline remains white against artwork during the black hover sweep. Existing options, IDs and content ownership are unchanged.
