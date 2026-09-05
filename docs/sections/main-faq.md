# FAQ directory

Source: `sections/main-faq.liquid`

Display headings use the centrally resolved font-specific line height from the [design system](../design-system.md); section CSS must not introduce a separate heading rhythm.

Template: `templates/page.faq.json`

## Purpose

FAQ directory is the dedicated full FAQ page surface. Assign the `page.faq` template to the Shopify FAQ Page. The Page title becomes the only `h1`, uses the shared FAQ SVG decoration, and automatically follows the Page's `custom.product_world` heading typography.

## Data and behavior

The section server-renders every active `faq` entry available through `metaobjects.faq.values`. Active `faq_category` entries provide filter labels and membership through their ordered FAQ reference lists. Uncategorized questions remain visible under **All**. A question referenced by multiple categories is rendered once and matches every applicable filter.

`faq-directory` progressively enhances the page with:

- case- and accent-insensitive question-and-answer search;
- category buttons with `aria-pressed` state;
- a live visible-result count and empty result message;
- shareable `faq-category` and `faq-query` URL parameters;
- automatic closure of answers hidden by a filter.

The complete question and answer text exists in the initial HTML. Without JavaScript, search/filter controls are hidden and every rendered FAQ remains available through native `details` elements.

The directory emits one server-rendered Schema.org `FAQPage` JSON-LD object through the shared `faq-structured-data` snippet. Its `mainEntity` array contains the same valid FAQ entries included in the paginated page HTML; client-side search and category filters do not change or regenerate this source data. Questions or answers that are blank are omitted from both the structured representation and the reusable FAQ item markup.

The directory shares the FAQ motion contract: its panel, heading, controls, and entries reveal with reversible viewport progress, including an initial catch-up reveal when the section is already visible. Accordion answers use the shared height/fade transition while retaining native keyboard interaction and a reduced-motion path.

## Scale and limits

Shopify limits a normal metaobject-definition loop to 50 entries and permits pagination up to 250 entries. This section paginates the definition at 250 so the initial implementation can search the complete expected library on one page. If the library exceeds 250 active questions, the section exposes a translated limit notice; a future server-backed index or multi-page search contract is required before claiming complete search above that boundary.

The current full-page layout intentionally shares the reusable FAQ visual language. Its final category/search composition should be reconciled when the dedicated full FAQ Page design arrives.

## Shared typography roles

Section heading in the decorated FAQ composition; compact questions; body answers with reading line height; UI search and filter controls.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
