# FAQ directory

Source: `sections/main-faq.liquid`

Template: `templates/page.faq.json`

## Purpose

FAQ directory is the dedicated full FAQ page surface. Assign the `page.faq` template to the Shopify FAQ Page. The Page title becomes the only `h1`, uses the shared FAQ SVG decoration, and automatically follows the Page's `custom.brand_variant` heading typography.

## Data and behavior

The section server-renders every active `faq` entry available through `metaobjects.faq.values`. Active `faq_category` entries provide filter labels and membership through their ordered FAQ reference lists. Uncategorized questions remain visible under **All**. A question referenced by multiple categories is rendered once and matches every applicable filter.

`faq-directory` progressively enhances the page with:

- case- and accent-insensitive question-and-answer search;
- search begins at three trimmed characters after a 200ms typing pause; shorter queries apply no text filter, clearing restores category results immediately, and IME composition waits until completion;
- category buttons with `aria-pressed` state;
- a live visible-result count and empty result message;
- shareable `faq-category` and `faq-query` URL parameters;
- automatic closure of answers hidden by a filter.

The complete question and answer text exists in the initial HTML. Without JavaScript, search/filter controls are hidden and every rendered FAQ remains available through native `details` elements.

The directory emits one server-rendered Schema.org `FAQPage` JSON-LD object through the shared `faq-structured-data` snippet. Its `mainEntity` array contains the same valid FAQ entries included in the paginated page HTML; client-side search and category filters do not change or regenerate this source data. Questions or answers that are blank are omitted from both the structured representation and the reusable FAQ item markup.

The directory shares the FAQ motion contract: its panel, heading, controls, and entries reveal with reversible viewport progress, including an initial catch-up reveal when the section is already visible. Accordion answers use the shared height/fade transition while retaining native keyboard interaction and a reduced-motion path.

## Search and category motion

Changed result sets briefly fade upward (6px), then the matching list fades in from 8px below using the shared base duration/easing. Empty results receive the same entrance. Category pills transition their foreground/background with the fast token. Initial URL restoration is immediate, unchanged matches do not replay motion, and every new input cancels the preceding transition so stale searches cannot overwrite newer results. Reduced-motion changes settle immediately; disconnecting cancels pending work. Focus stays on the search/category control and the live count updates with the actual rendered result set. Hidden entries close and cancel any outstanding answer animation. The list owns this interaction animation separately from the existing section scroll reveals; server HTML and JSON-LD are unchanged.

## Scale and limits

Shopify limits a normal metaobject-definition loop to 50 entries and permits pagination up to 250 entries. This section paginates the definition at 250 so the initial implementation can search the complete expected library on one page. If the library exceeds 250 active questions, the section exposes a translated limit notice; a future server-backed index or multi-page search contract is required before claiming complete search above that boundary.

The current full-page layout intentionally shares the reusable FAQ visual language. Its final category/search composition should be reconciled when the dedicated full FAQ Page design arrives.

## Typography roles

Section heading in the decorated FAQ composition; compact questions; body answers with reading line height; UI search and filter controls.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Interrupted disclosure motion

The shared controller tracks the intended open state separately from the native `open` attribute during closing. Reversing a toggle captures the currently rendered answer height, opacity and transform before cancellation, then continues from that frame. Switching to reduced motion settles each item to its requested state and clears the animation. No alternate timings are introduced by embedded use.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Panel-shadow rollout (2026-10-01): FAQ items inherit the shared panel shadow and suppress nested panel shadows. See the [shared contract](../design-system.md#panel-shadows).

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Narrow**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).
