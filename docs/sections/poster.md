# Poster

Source: `sections/poster.liquid`

## Purpose

Poster owns two approved editorial compositions in one content model: a full-image poster with overlaid content and a split image/text panel. It is available as a section preset but is not currently placed in a JSON template.

## Merchant controls

- poster or split layout;
- left/right split image and left/center/right poster content alignment;
- Shopify image or bundled subscription/team fallback;
- image alternative text, anchor, and horizontal/vertical offsets;
- optional heading (`h2` or `h3`), rich text, tick-list blocks, and linked action;
- automatic/dark/light button treatment;
- panel/text colors, overlay strength, split-media width, and minimum height.

The shared `--radius-panel` and `.section` rhythm remain architecture tokens rather than merchant settings.

## Rendering and motion

Shopify-selected media replaces the fallback and renders responsively with intrinsic dimensions. `poster-motion` adds reversible scroll-scrubbed surface/content reveals and clipped media parallax. The static final composition is the server-rendered default; JavaScript and motion are skipped for reduced-motion users.

## Accessibility and limits

The selected heading level preserves page hierarchy, decorative tick icons use empty alternative text, and the action renders only with both label and URL. Editors must supply meaningful image alternative text when the image conveys content. Video, multiple actions, app blocks, and per-breakpoint art direction are not implemented.
