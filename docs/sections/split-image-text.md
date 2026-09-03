# Split Image-Text

Source: `sections/split-image-text.liquid`

## Purpose

Split Image-Text owns the approved side-by-side editorial composition with a media panel and a solid-color content panel. It is available as a section preset but is not currently placed in a JSON template. Full-background image compositions belong to the separate [Poster](poster.md) section.

## Merchant controls

- left/right image placement, image width, and minimum height;
- optional Shopify image and image alternative text;
- optional heading (`h2` or `h3`), rich text, tick-list blocks, and linked action;
- automatic/dark/light button treatment;
- panel and text colors.

Heading, subtext, and action fields are conditionally visible only while their corresponding display toggle is enabled. Headers divide layout, media, content, and appearance controls.

The preset uses `#` as its initial action URL, and the renderer applies the same fallback to older blank instances, so an enabled button remains visible until the merchant selects its destination.

## Rendering and motion

The bundled team portrait renders automatically while the image picker is blank. Shopify-selected media replaces it, renders responsively with intrinsic dimensions, and uses the focal point saved in Shopify; the section exposes no duplicate crop controls. The source-controlled fallback uses a centered crop. The image and content form two desktop columns and stack media-first on phones. The shared `poster-motion` controller adds reversible scroll-scrubbed content reveals and clipped-media parallax. The static final composition is the server-rendered default; JavaScript and motion are skipped for reduced-motion users.

## Accessibility and limits

The selected heading level preserves page hierarchy, decorative tick icons are hidden from assistive technology, and the action renders when enabled with a non-empty label. Editors must replace the `#` placeholder with a meaningful destination and supply useful image alternative text when the image conveys content. Video, multiple actions, app blocks, and per-breakpoint art direction are not implemented.
