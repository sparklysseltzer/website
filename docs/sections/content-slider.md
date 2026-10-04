# Content Slider

## Purpose and ownership

A horizontally scrollable row of cards for crosslinking or benefit explanations, based on Figma `12596:24782` and `12596:24783`. All content is owned by section-local **Card** blocks in the Theme Editor; no metaobjects, store-data setup or hidden global content. Up to 20 reorderable/removable blocks. Two add-section presets select the initial layout/font; switching layout preserves every saved block value.

No saved templates are modified. Add **Content Slider — Crosslinks** or **Content Slider — Benefits** under Brand storytelling. Each preset supplies five empty starter cards with a neutral English title. Merchant images, illustrations, copy and URLs remain explicitly chosen; the Figma crosslink image slots are empty placeholders, and its benefit artwork/copy illustrate editable media/content slots rather than a mandatory fixed campaign.

## Editor field map

- Layout → **Card layout**: Crosslinks or Benefits.
- Heading → **Show heading**; only when on, **Heading** appears.
- Typography → **Heading font** (Newake/Erode) for section and cards. **Uppercase card titles** appears only for Newake and is ignored for Erode; the section heading preserves authored case.
- Visibility → independent mobile/desktop toggles, no dependent inputs.
- Section background → Default/Transparent/Custom Color; only Custom Color exposes Color.
- Each Card block: Media, Content, then Appearance. **Background color** is available in both layouts; clearing it restores the shared layout default. It colors the card surface beneath any image; full-cover photos and the readability gradient remain above it. No additional mode or dependent fields. Crosslinks shows **Image**, **Title**, **Link**. Benefits shows **Illustration**, **Title**, **Short text**, with image/link hidden. Every dependent field has its own `visible_if`.

Crosslinks uses a single whole-card anchor only with a URL and nonblank title; otherwise a noninteractive article. Benefits always renders an article, even if a link remains saved from the other layout. No nested buttons or decorative fake links. Heading hierarchy uses H2 for section heading/H3 for cards, or H2 for cards when the section heading is absent. Empty media preserves its design slot. Long titles/text grow the equal-height row instead of clipping copy.

## Design system

Reuses the existing 1400px panel composition width inside page gutters, Large panel radius (including mobile scaling), shared panel shadow and neutral muted/warm surfaces. Desktop Crosslinks cards are 360px wide, Benefits 320px, with 20px gaps and a 500px minimum height; phone widths cap at 82vw to expose the next card. Selected crosslink images use Shopify responsive CDN delivery/focal points and cover the entire card. A bottom-heavy black gradient fades upward to transparent beneath white titles. One outer rounded clip and 1px image overscan prevent edge fringes; media and gradient remain separate from the shared panel shadow. Benefit illustrations are contained above the copy. No bundled illustration defaults or runtime remote assets.

Typography: Section heading, Card titles, Body description. Shared font-specific leading/tracking/casing; no local size or leading exceptions. Card titles are centered for Crosslinks, left-aligned for Benefits. The shared button sweep and existing Untitled UI arrow icon drive circular previous/next controls; 72px desktop, 48px phone. Text is not adjacent to icons, so no Newake optical shift is needed here.

## Interaction and resilience

Native overflow and scroll snap support touch, trackpad and keyboard without JavaScript. The track is named and keyboard-focusable. Enhancement adds previous/next card navigation with smooth scrolling (instant for reduced motion). Arrows use `aria-disabled` at boundaries and stay focusable so focus is not lost; inactive actions do nothing. Controls are hidden when everything fits and by default without JavaScript. No autoplay or wheel interception. Linked-card media zoom uses shared Slow motion on hover/keyboard focus and is removed under reduced motion.

ResizeObserver updates boundaries after resize/reflow. Shopify block selection scrolls the selected block into view without moving the page vertically. Custom-element disconnect cancels listeners, observer and pending frames; section replacement upgrades normally. RTL uses the opposite scroll direction. The shared `offer-cards-motion` controller scrubs heading/card opacity and upward travel reversibly with vertical page scroll. Horizontal rows use stationary list-item geometry and a bounded left-to-right stagger (at most three delay steps), so later cards cannot remain hidden. Media parallax is deliberately omitted to preserve image-cover edges. Keyboard-focused cards reveal immediately; reduced motion, unavailable JavaScript and disconnected/replaced sections restore static content. The Studio uses the same wrapper.

## Structured data

Crosslinks and general marketing benefits are not distinct typed entities. No honest Product, Offer, Review or FAQ mapping exists for arbitrary merchant copy. Semantic list/articles/links are sufficient; no duplicate Organization or invented benefit JSON-LD is emitted.

## Review contracts

The section and its local card schema are registered in `tests/editor-schema-contracts.json`. The schema gate now checks explicitly registered local-block visibility/grouping and both layout scenarios. A mutation test catches a link field shown in the wrong mode. Existing legacy schema inventory is unchanged.

## Preview and verification

[Design Studio — Content Slider](http://127.0.0.1:9293/#ContentSlider) shows both layouts using the actual CSS/custom element, with existing local artwork and clearly identified preview copy. These fixtures do not populate Shopify blocks or represent saved merchant content.

Checked both layouts at 1600px and 390px, Newake uppercase/Erode authored casing, contain/cover media, shared corner radii, no document overflow, 48px phone arrow targets, next-card navigation and boundary states. A single fitting card hides controls. Native keyboard scrolling and visible focus work; Theme Editor block-selection events reveal the selected card. With all JavaScript blocked, both card lists and links remain available, native keyboard scrolling works and inert controls remain hidden. The actual empty Shopify section is also inspected through the Section Rendering API; populated visual checks use studio fixtures, not a saved editor placement. Conditional settings are verified by the registered schema cases, not claimed as a manual Shopify editor inspection.

## Mouse dragging

Enhanced overflowing tracks support primary-button mouse dragging on images, text or gaps. A 6px horizontal threshold separates a drag from a normal link click; vertical gestures are not claimed. Pointer capture keeps active dragging working outside the track. Native image/link drag previews are suppressed during the gesture. Only a completed drag suppresses its following pointer click; ordinary and keyboard link activation remain available. Native touch/pen scrolling is untouched. Grab/grabbing cursors indicate the interaction, native snapping stays disabled during dragging and a release glide, then resumes only after the nearest card boundary is reached. Cancellation, lost capture and disconnect clean up gesture state/listeners. No inertia loop or autoplay is introduced.

The horizontal scrollbar is visually hidden in Firefox and WebKit/Blink. Native overflow remains enabled, preserving touch, trackpad and keyboard navigation without JavaScript.

Drag/cover verification: real mouse movement advanced the track by 238px, then native snapping settled at 380px. The drag produced zero card activations; the next ordinary click activated exactly once. Checked pointer-cancel cleanup and that touch pointers are not claimed by mouse dragging. Desktop/phone screenshots confirm full-cover photos, white bottom titles, gradient contrast, rounded clipping, no horizontal document overflow and the hidden scrollbar. Keyboard track focus remains visible. Full repository, JS syntax, JSON and whitespace checks passed; test browser closed.

## Smooth drag release

Mouse release selects the nearest card start (including the clamped final edge) and glides there using shared Slow duration/easing. Native snapping stays disabled throughout settlement, avoiding a one-frame jump before animation. New mouse drags interrupt at the current position; navigation, wheel/keyboard input, motion-preference changes and disconnect cancel pending settlement. Reduced motion settles immediately. No velocity/inertia loop is used.

Settlement verification: a real mouse release retained its exact 238px release position in the first frame, then progressed through 311/360/375/379px before settling at 380px; restoring native snapping caused no further displacement. At phone width, the Benefits row eased from 160px through 273px to its 314px boundary. Reduced motion settled without an animation. Re-grabbing preserved the current position and canceled the previous animation; disconnect cleaned up pending settlement. Full checks, syntax, JSON and whitespace passed; headless browser closed.

## Viewport bleed variant

**Layout → Slider width** selects Contained (default, including existing placements) or Viewport bleed. It has no dependent fields and is independent of Card layout. In Viewport bleed, the heading and arrows keep the normal container alignment. The scrolling track spans the viewport; initial leading padding aligns the first card with the content container. That padding scrolls away while dragging, so cards can pass the viewport edge; settled cards retain the shared page gutter instead of resting flush against the viewport. The first card retains a special start snap position to restore the original inset. The final card retains the same trailing page gutter.

CSS provides a centered-container no-JavaScript fallback. Enhancement measures the real content inset and scrollbar-excluding viewport width on setup/resize/width-mode changes, supporting the narrower Studio host as well as storefront page gutters. Shared dragging/release settlement includes each card's scroll margin when finding snap positions. No content JSON or preset defaults change. The Design Studio width selector previews both layouts with the real component.

Historical viewport variant verification (the flush-edge snap was superseded by Ananotes 172): at 1600px the track measured exactly 0–1600px while its first card aligned with the 224px studio content inset. After stepping, cards passed the left viewport edge and the last card ended at 1600px. At 390px the initial inset was 36px; the next card settled at the left edge (subpixel rounding below .3px). The default contained width remained unchanged when switching back. The unenhanced variant preserves initial alignment with ordinary native scrolling; native snap is enabled only after measured geometry is ready, avoiding a browser-initiated initial snap into the inset. No page overflow was observed.

## Image blending

Each Card exposes **Appearance → Blend with background**, off by default and available in both layouts without dependent fields. It applies Multiply to the active image/illustration layer, blending white pixels into the custom card background or shared default. Colored pixels can darken; this is a presentation option, not destructive background removal. Each card isolates blending so adjacent cards and section backgrounds cannot affect the image. Copy and the crosslink readability gradient remain separate, unblended layers. Native CSS works without JavaScript and preserves cover/contain geometry, clipping, hover zoom and reduced-motion behavior. Saved blocks and presets remain unchanged.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Editorial**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Ananotes 172 (2026-10-04): viewport bleed now uses shared page gutters for settled leading/trailing alignment. The first card’s scroll margin offsets only the additional container inset, preserving its initial editorial alignment. Native snap, arrow scrolling, editor selection and drag settling share the same scroll-padding geometry; free dragging still reaches the viewport edge.

Ananotes follow-up (2026-10-04): verified the shared entrance stagger on the actual homepage at 1600px and 390px. Intermediate desktop card opacities progressed from .92 through .62 left-to-right, settled at 1, and scrubbed back to 0 when scrolling upward. Keyboard focus reveals its linked card immediately. Reduced motion cancels every card animation and restores opacity 1. No document overflow; test browser closed.
