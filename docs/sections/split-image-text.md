# Split Image-Text

Source: `sections/split-image-text.liquid`

## Purpose

Split Image-Text owns the approved side-by-side editorial composition with a media panel and a solid-color content panel. It is available as a reusable section preset. Full-background image compositions belong to the separate [Poster](poster.md) section.

## Merchant controls

- left/right image placement, image width, and minimum height;
- optional Shopify image and image alternative text;
- optional heading (`h2` or `h3`), rich text, tick-list blocks, and linked action;
- automatic/dark/light button treatment;
- panel and text colors.

Heading, subtext, and action fields are conditionally visible only while their corresponding display toggle is enabled. Headers divide layout, media, content, and appearance controls.

The preset uses `#` as its initial action URL, and the renderer applies the same fallback to older blank instances, so an enabled button remains visible until the merchant selects its destination.

## Rendering and motion

The inner image/content surface is centered at a maximum 87.5rem/1400px width, matching Poster and USP while retaining the shared page gutters and section rhythm.

The bundled team portrait renders automatically while the image picker is blank. Shopify-selected media replaces it, renders responsively with intrinsic dimensions, and uses the focal point saved in Shopify; the section exposes no duplicate crop controls. The source-controlled fallback uses a centered crop. The image and content form two desktop columns and stack media-first on phones. The shared `poster-motion` controller adds reversible scroll-scrubbed content reveals and clipped-media parallax. The static final composition is the server-rendered default; JavaScript and motion are skipped for reduced-motion users.

## Accessibility and limits

The selected heading level preserves page hierarchy, decorative tick icons are hidden from assistive technology, and the action renders when enabled with a non-empty label. Editors must replace the `#` placeholder with a meaningful destination and supply useful image alternative text when the image conveys content. Video, multiple actions, app blocks, and per-breakpoint art direction are not implemented.

## Typography roles

Section heading; body copy and tick-list text; UI actions.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.
