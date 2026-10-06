# Poster Slideshow

Separate media-only section in `sections/poster-slideshow.liquid`. It copies Poster’s image surface and sizing, without extending Poster’s modes or adding text overlays. Existing Poster instances are unchanged.

## Content and editor

Slides are local **Slide** blocks, ordered in the Theme Editor (maximum 12), not metaobjects. Each block selects Image or Video:

- Image shows desktop and optional mobile image pickers. Images cover the panel and respect Shopify focal points; mobile images inherit the desktop focal point when absent.
- Video shows a Shopify-hosted video picker. Playback is muted and looping. YouTube/external embeds are not supported.
- Media description stays visible for either mode and labels the slide; image alt text falls back to the image’s own description.

The new-section preset starts with two image blocks. Blank images use the existing `poster-subscription.webp` Poster fallback; blank videos show Shopify’s neutral lifestyle placeholder. There is no headline, body, CTA, media destination or typography control.

Section groups follow composition order: Layout, Size, Playback, Ambient light, Accessibility, Visibility, Section background. Width uses Narrow (800px), Editorial (1400px, default), or Page (1920px outer frame). Poster’s desktop minimum height is 420–800px (630px default); mobile is 120–800px (540px default). Heights are independent of Hero’s viewport composition and 16:9 sizing.

Automatic switching reveals Time per slide (4–15 seconds). Ambient light reveals intensity, spread and softness; defaults match Hero (40%, 24px, 40px). Custom section background reveals its color picker. Every dependent field has conditional visibility and reviewed cases in `tests/editor-schema-contracts.json`.

## Rendering and motion

Uses `component-poster.css` for the Poster surface, `hero-slider.css` and `hero-slider.js` for crossfades, ambient sampling, full-height hover arrow targets and rounded progress bars. `poster-slideshow.css` supplies only the media-only composition and Poster sizing. Shared radius/shadow tokens remain authoritative, including smaller mobile corners. Images and videos cover the clipped surface with the shared one-pixel overscan to prevent edge seams.

The shared custom element uses `data-media-only` to skip Hero headline/viewport measurement. Hover pauses slide switching without pausing the active video. Keyboard focus pauses switching; indicator Arrow Left/Right and Home/End navigation work. Selecting a slide block in the editor reveals that slide. Single-slide sections hide navigation. Inactive slides are inert and hidden from assistive technology; manual changes announce their selected slide.

Offscreen, hidden-tab and editor playback pauses. Reduced motion disables automatic switching, transitions and video autoplay, exposing native video controls for intentional playback. Without JavaScript, all slides remain visible in document order and videos have native controls. Normal enhanced playback has no native player chrome. The section’s accessible label is merchant editable.

No Schema.org entity is emitted: these generic decorative/editorial media blocks do not contain enough entity metadata to describe a truthful VideoObject or ImageObject beyond their accessible HTML.

## Verification

Schema contracts cover both media modes, three widths, autoplay, ambient light, visibility and background dependencies. On 2026-10-04, a temporary development-only static render exercised Shopify’s actual Liquid output; its temporary default was removed and the add-section preset restored. Headless Chromium at 1440×1000 and 390×844 confirmed 630px/540px media heights, no horizontal overflow, no headings, clean cover edges and full-height arrow targets. The 120px mobile height and 800/1400/1856px inner widths were also checked. Arrow clicks, keyboard End navigation, focus pause, editor block-selection events and single-slide navigation hiding passed. A hosted video fixture confirmed continued playback while hover freezes the timer, automatic advancement after resume, inactive video pause/rewind and reduced-motion manual playback with native controls. Existing Hero rendered ready with its viewport layout. Screenshots were inspected and the isolated browser closed. Full repository checks, JavaScript syntax, JSON parsing and diff whitespace checks passed. No saved template or shared-theme content migration is required.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).
