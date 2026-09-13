# Accordeon

Sources: `sections/faq-accordion.liquid`, `blocks/editorial-faq.liquid`, `blocks/accordion-item.liquid`, `snippets/faq-list-content.liquid`.

## Purpose and content ownership

A general content accordion, available as **Accordeon** in the section picker and inside Two-column layout Content. The historical file/type IDs stay intact so existing placements and FAQ selections continue working.

Add **Accordion item** blocks, give each a title, then add and reorder **Text**, **Image**, **Text and image**, and **Poster** blocks inside it. Text uses the existing rich-text, heading and font controls. Images reuse the existing square/custom-height controls, responsive Shopify delivery, alternative text and native focal points. Items without a title are omitted outside the editor. New placements start with one editable item; saved placements receive no automatic content migration.

Optional FAQ category and individual FAQ selections remain additive. Custom items render first, followed by category FAQs and individual FAQs, deduplicated by handle. Editors can use custom content only, FAQs only, or both. No second FAQ data model is created and no store data is modified.

## Editor dependency contract

Content groups the optional overall heading and heading font. Optional FAQs groups both resource pickers, which remain relevant in every configuration. Standalone Visibility stays last. Item blocks have only a title; nested blocks represent real content rather than field groups. All four content blocks retain their existing conditional fields. Poster supports nested Tick items; even inside Two-column layout, the deepest path is five native block levels. The section and nested block are registered with reviewed schema contracts.

## Rendering, motion and accessibility

The standalone list is 800px maximum; embedded lists fill the main column. Custom and FAQ rows share `component-faq.css`, the existing chevron and native `details`/`summary`. Item blocks use `tag: null` so details remain direct children of the shared `faq-accordion` controller. That controller provides one-open-item behavior and reversible height/opacity transitions. No new animation timings are introduced. Native disclosure works without JavaScript and reduced motion settles immediately. Scoped section/block IDs prevent collisions.

Content blocks stack with shared spacing. Text and image uses the compact embedded gap and its existing mobile image order. Poster uses the existing embedded markup, compact content padding and nested tick list. Image dimensions reserve space before loading. Overall headings use the selected heading family; summary labels and body copy remain Maison Neue. Nested Text blocks retain their own heading controls. Empty setup guidance appears only in the editor.

## Structured data

Only actual selected FAQ metaobjects emit FAQPage JSON-LD through the shared renderer. Generic accordion titles, prose and images are not automatically questions/answers and emit no FAQ structured data. Stable canonical FAQ IDs and handle deduplication remain intact. Hiding the entire section on both breakpoints suppresses its FAQ JSON-LD.

## Verification

Theme, schema, typography and commerce regression checks pass. Local preview has been restored. Check custom-only, FAQ-only and mixed lists at phone/desktop sizes during the remaining full journey QA, including keyboard, no-JavaScript and interrupted transitions.

Text and image / Poster reuse checked in the Shopify-rendered accordion at 1440px and 390px: both blocks render inside the opened item, neither viewport overflows horizontally, and Text and image stacks to one column on phone. Keyboard activation was exercised. The temporary development fixture was restored and the isolated browser closed.
