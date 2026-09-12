# FAQ accordion

Sources: `sections/faq-accordion.liquid`, `blocks/editorial-faq.liquid`, `snippets/faq-list-content.liquid`.

## Purpose and content ownership

A plain accordion matching Figma `10989:45020`, available as a standalone Trust & information section and inside 2 column Content. It deliberately omits the existing decorated FAQ section's heading artwork and closing contact callout. Questions and answers reuse existing `faq` metaobjects; no second FAQ model is created.

Editors choose up to 20 individual FAQs, one FAQ Category, or both. Category entries render first, individual selections follow, and handles are deduplicated. An optional heading is H2. The heading font control affects the heading and semantic headings inside answers; Erode defaults, Newake is selectable, and questions/paragraphs remain Maison Neue. Section, Compact and Body roles are retained.

## Rendering, motion and accessibility

The standalone list is 800px maximum; an embedded list fills the main column. Existing white rounded rows, spacing, chevron assets and `details`/`summary` markup come from `faq-item` and `component-faq.css`. Existing `faq-accordion` provides reversible height/opacity transitions and one-open-item behavior with JavaScript. Native disclosure remains functional without JavaScript; reduced motion skips the enhancement animation. Each placement supplies a unique section/block scope for DOM IDs.

Empty configurations show an English setup message only in the Theme Editor. They do not create sample customer content or structured data. Pickers do not create or modify metaobjects.

Real question/answer pairs emit server-rendered FAQPage JSON-LD through the existing shared renderer. Handle deduplication applies within each selection. Stable canonical-page FAQPage and Question `@id` values identify repeated entities across independently rendered placements; graph consumers can merge those references instead of treating them as different pages/questions. Empty answers are excluded. Both visibility settings enabled suppresses JSON-LD; one breakpoint hidden still leaves the content accessible at the other.

## Interrupted disclosure motion

The shared controller tracks the intended open state separately from the native `open` attribute during closing. Reversing a toggle captures the currently rendered answer height, opacity and transform before cancellation, then continues from that frame. Switching to reduced motion settles each item to its requested state and clears the animation. No alternate timings are introduced by embedded use.

## Editor dependency contract

Content groups the optional heading and font choice; FAQs groups the category and individual selection; standalone Visibility remains last. Both pickers remain additive and relevant in every configuration, avoiding unsupported resource-picker conditions. Font choice also applies to headings inside selected FAQ answers, so it does not disappear merely because the optional section heading is blank.
