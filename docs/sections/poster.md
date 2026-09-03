# Poster

Source: `sections/poster.liquid`

## Purpose

Poster owns the approved full-image editorial composition with overlaid content. It is available as a section preset but is not currently placed in a JSON template. The side-by-side composition is a separate [Split Image-Text](split-image-text.md) section so each Theme Editor contract stays focused.

## Merchant controls

- left/center/right content alignment;
- optional Shopify desktop and mobile images;
- shared image alternative text and Shopify-native focal points for selected images;
- optional heading (`h2` or `h3`), rich text, tick-list blocks, and linked action;
- automatic/dark/light button treatment;
- text color, overlay color and strength, and independent desktop/mobile minimum heights.

Heading, subtext, and action fields are conditionally visible only while their corresponding display toggle is enabled. Headers divide media, content, and appearance controls.

Tick-list blocks render whenever at least one non-empty block exists, so the section does not duplicate that state with a separate display toggle. The preset uses `#` as its initial action URL, and the renderer applies the same fallback to older blank instances, so an enabled button remains visible until the merchant selects its destination.

The Poster surface uses the same centered 87.5rem/1400px maximum width as USP. The shared `--radius-large` token and `.section` rhythm keep both modules aligned with the theme-wide layout system.

## Rendering and motion

The bundled `poster-subscription.webp` artwork renders automatically while the desktop image picker is blank. It is a 1632 by 686 high-quality WebP with alpha preserved from the approved source export. Shopify-selected media replaces it and renders responsively with intrinsic dimensions. An optional mobile image provides true art direction through a `<picture>` element, so the browser downloads only the source that matches the viewport; when it is blank, the desktop image is reused. Each selected image's Shopify focal point controls its crop, with no separate fallback or crop selector in the section schema. `poster-motion` adds reversible scroll-scrubbed surface/content reveals and clipped-media parallax. The static final composition is the server-rendered default; JavaScript and motion are skipped for reduced-motion users.

## Accessibility and limits

The selected heading level preserves page hierarchy, decorative tick icons are hidden from assistive technology, and the action renders only when enabled with a non-empty label. Editors must replace the `#` placeholder with a meaningful destination and supply useful image alternative text when the image conveys content. Video, multiple actions, and app blocks are not implemented.
