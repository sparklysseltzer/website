# Split Image-Text

Source: `sections/split-image-text.liquid`

## Purpose

Split Image-Text owns the approved side-by-side editorial composition with a media panel and a solid-color content panel. It is available as a section preset but is not currently placed in a JSON template. Full-background image compositions belong to the separate [Poster](poster.md) section.

## Merchant controls

- left/right image placement, image width, and minimum height;
- Shopify image or bundled team-portrait fallback;
- image alternative text, anchor, and horizontal/vertical offsets;
- optional heading (`h2` or `h3`), rich text, tick-list blocks, and linked action;
- automatic/dark/light button treatment;
- panel and text colors.

Heading, subtext, and action fields are conditionally visible only while their corresponding display toggle is enabled. Headers divide layout, media, content, and appearance controls.

## Rendering and motion

Shopify-selected media replaces the fallback and renders responsively with intrinsic dimensions. The image and content form two desktop columns and stack media-first on phones. The shared `poster-motion` controller adds reversible scroll-scrubbed content reveals and clipped-media parallax. The static final composition is the server-rendered default; JavaScript and motion are skipped for reduced-motion users.

## Accessibility and limits

The selected heading level preserves page hierarchy, decorative tick icons are hidden from assistive technology, and the action renders only with both label and URL. Editors must supply meaningful image alternative text when the image conveys content. Video, multiple actions, app blocks, and per-breakpoint art direction are not implemented.
