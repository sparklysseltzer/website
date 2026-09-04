# FAQ

Source: `sections/faq.liquid`

## Purpose

FAQ is a reusable, centrally managed accordion for editorial, collection, and product templates. A placement can render an explicitly ordered list of FAQ entries, the ordered list owned by one FAQ Category, or both sources together. Questions and answers remain Shopify metaobject content rather than being copied into template blocks.

## Data and merchant controls

The section consumes the merchant-owned `faq` and `faq_category` definitions documented in [Merchant content](../merchant-content.md). Its two optional pickers are additive:

- **FAQs** renders an explicitly ordered native `metaobject_list` selection, up to 20 entries;
- **FAQ Category** renders the category's ordered `faqs` reference list;
- when both are set, category entries render first and individually selected entries follow. An FAQ present in both sources renders only once.

The additive contract avoids a source-mode control and works within Shopify's current section-schema limitation: `visible_if` is not accepted on `metaobject` or `metaobject_list` settings. Heading and closing-copy fields can override the translated runtime defaults. The closing link is enabled by default with `#` as its visible setup placeholder and must receive a meaningful destination before launch.

## Rendering and motion

The composition follows the supplied FAQ section: an 800px centered content column, exact exported two-part SVG heading decoration, 16px white accordion cards, 12px item gaps, and centered closing copy/link. The decoration is hidden from assistive technology and the heading remains real text. Its `h2` automatically uses Erode in the Soda product world and Newake in the general and Hard Seltzer worlds through the global heading tokens.

Each entry uses native `details`/`summary`; `faq-accordion` progressively enhances the group to keep one answer open at a time and animates answer height, opacity, and restrained upward travel. Rich-text answers render through `metafield_tag`, including links and paragraphs. `faq-section-motion` reuses the reversible viewport-progress framework for the panel, heading, entries, and closing link. It starts an already-visible section from its entrance state and catches up to the current scroll-derived target, so above-the-fold placements do not silently skip their reveal. Both controllers respect reduced motion. Without JavaScript, all questions remain operable and multiple answers may remain open.

The section also renders server-side `FAQPage` JSON-LD through the shared `faq-structured-data` snippet. Its `mainEntity` array follows the visible category-first ordering, appends individually selected entries, and applies the same handle-based duplicate suppression as the accordion. Entries without both a question and a non-empty answer are omitted. Rich-text answers are reduced to truthful plain text for the Schema.org `Answer.text` property; visual preview placeholders and Theme Editor setup messages never enter the structured data.

## Empty and preview states

Add-section visual preview mode renders four neutral sample rows so the picker shows the section's shape without requiring store-specific metaobject IDs. A placed empty section shows an English setup instruction only inside the Theme Editor and emits nothing on the customer storefront.

## Limits

The reusable selected list is capped at 20 entries to keep the section editorially focused. Use the dedicated [FAQ directory](main-faq.md) when every published FAQ must be discoverable. Individual FAQ webpages are not implemented.
