# Article

Source: `sections/main-article.liquid`, `snippets/article-share.liquid`, `assets/article-share.js`, shared `article-card` and `blog.css`.
Template: existing `templates/article.json` (unchanged).

## Content and layout

The article owns one H1, publication date and real author, optional excerpt and responsive feature image, complete Shopify rich-text body, return-to-blog actions and three other recent posts from its owning blog. Rich text stays readable at a 48rem measure; images/video fit the viewport, tables scroll locally, and headings follow the section font. The outer image measure is 80rem. Shared Display/Card/Body roles, section padding and radii own styling. Existing content, inline media, claims and translations are not rewritten.

The old live template's signature image and signature caption are omitted; neither belonged to article.content. No broad image removal or signature guessing is applied to merchant content. Existing footer supplies newsletter/navigation. No extra newsletter copy, author signature or subscription claims are invented.

## Share

One native details summary reveals WhatsApp, Facebook, LinkedIn and email links using the canonical public URL and encoded article title. Opening channels requires the visitor's explicit click; no social SDK, tracking embed or remote runtime library loads. Copy link appears only when Clipboard API is available, reports success through the shared toast service, and selects the readonly URL field if copying is denied. The readonly URL field uses the shared rounded form-control primitive and remains usable without JavaScript.

Progressive enhancement animates height/opacity with Base/shared easing and continues from painted bounds if interrupted. Escape closes and returns focus to the summary; outside pointer closes; collapsed content is inert while exiting. Native details/channel links still work with scripts disabled. Reduced motion settles immediately. All component listeners and animations are cleaned up on removal.

## Editor and structured data

Content retains the existing heading-font ID and Erode default; Newake is optional. Visibility precedes the final Section background group. Shopify's `article | structured_data` emits the only primary Article entity, using actual article metadata; it is suppressed when hidden on both viewports. Related cards remain ordinary links, not duplicate full Article entities. Native tags, comments/forms and reading-time estimates are outside this implementation.

Verification (2026-09-15): existing Windräder article inspected at 1440px and 390px; one H1, one Article JSON-LD entity, body/media intact and no signature image. Keyboard Enter/Tab/Escape and focus restoration, open/close interruption, reduced-motion duration, canonical channel URLs and copy-success toast verified. Clipboard writes were mocked in the isolated browser to avoid replacing the user's clipboard. With scripts blocked, the complete body, native share disclosure and four channel links remain accessible; Copy stays hidden. All test browsers closed. Repository checks pass; all 34 content JSON files parse after stripping Shopify's generated leading comments (raw jq still rejects those existing comments).

## Section background

**Section background** is the final group: Default, Transparent, or Custom Color. Only Custom Color shows the picker; Clear means transparent. New add-section presets start transparent; existing saved placements retain their original appearance until a color is chosen. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Panel-shadow rollout (2026-10-01): Article hero images and related article cards use the shared panel shadow. See the [shared contract](../design-system.md#panel-shadows).

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Editorial**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).
