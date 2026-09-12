# Split Image-Text

Source: `sections/split-image-text.liquid`

## Purpose

Split Image-Text owns the approved side-by-side editorial composition with a media panel and a solid-color content panel. It is available as a reusable section preset. Full-background image compositions belong to the separate [Poster](poster.md) section.

## Merchant controls

- left/right/top image placement; image width and side-by-side minimum height appear only for Left/Right;
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

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Top image and two-column text

Top matches Figma `10989:45021`/`10989:45022`: a full-width banner over an enclosed content panel, maximum 1200px. Its independent image-height control replaces image width; phones cap the banner height to 70vw. New placements default to a white panel; existing saved colors remain authoritative. Top mode can show one or two text columns. The original heading/rich text/list/action form the first column; Second heading and Second text form the second. Both use the selected semantic heading level and font. Columns stack on phones. A blank Top image uses `editorial-soda-banner.webp` (1600×948); Left/Right retain the existing team portrait. Shared scroll motion and reduced-motion behavior remain unchanged.

## Editor dependency contract

Layout groups image side, relevant height/width and text-column controls. Image comes next, followed by Content, the conditional Second text column group, Button, Appearance and Visibility. Side layouts hide Top height/text-column fields; Top hides side width/minimum height. Two text columns exposes both secondary fields and keeps Heading level available even when the first heading is disabled. All dependent fields carry their own conditions; conditional headers alone do not hide fields.
