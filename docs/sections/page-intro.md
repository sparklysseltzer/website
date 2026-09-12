# Page intro

Source: `sections/page-intro.liquid`, `snippets/page-intro.liquid`, `assets/page-content.css`.

Preset: **Page intro**, under Brand storytelling, available only on Page templates, limited to one instance per template. The new `page.editorial.json` is an intro-only starting composition; duplicate it for pages needing different sections. The approved 2026-09-12 follow-up migrates the existing development `page.about` and `page.retail` templates from Main page to Page intro, retaining the `main` IDs, order, settings and every other section/block. Latest saved development JSON was pulled and compared before the two type-only edits. The default `page.json` keeps Main page; `page.faq` keeps its dedicated FAQ directory; `page.editorial` already uses Page intro. No page assignments or shared/live theme content are changed.

## Content ownership

| Element | Source |
| --- | --- |
| Small label | `page.title`, only when a custom heading exists |
| H1 | `page.metafields.custom.intro_heading.value`, falling back to `page.title` |
| Introduction | `page.metafields.custom.intro_text.value`; omitted, including its spacing, when blank |

Both fields are optional Page-owned `multi_line_text_field` definitions. They render escaped text with preserved line breaks, not merchant HTML. They were created and pinned in Shopify on 2026-09-12. Their labels/help are English; populated merchant source content is German and translations belong to Translate & Adapt. No placeholder content is written to pages.

The section does not render the page body. Use the default Page section for title/intro/body pages. Do not combine Page intro with Main page, FAQ directory, or another H1-owning section. Additional editorial section headings must start at H2. Template composition must retain one visible H1 at every breakpoint.

## Presentation

Centered 800px maximum content width; shared Display H1 and Body introduction with compact body leading. Heading family/weight/leading follow the existing page brand context. The Figma reference happens to use Erode; general pages retain the established Newake identity, while Soda pages use Erode. No new typography exception.

The faint decorative Arc is the exact exported SVG from Figma file `wU2QCDnknQPBZd4hacOOjq`, node `9591:18260` (Hero 2nd), stored as `assets/page-intro-arc.svg`. It has empty alt text, no interaction, and scales within the viewport. The surface-to-transparent gradient uses the current palette. Header space is already in normal layout, so padding does not repeat Figma's combined header offset.

No section JavaScript or entrance animation is required for this static content. It remains visible without JavaScript and under reduced motion. Shared breakpoint visibility applies through the existing settings; the owning section wrapper retains its editor placeholder behavior.

## Structured data

The shared renderer emits one server-rendered `WebPage` with canonical URL/ID, visible heading, optional visible intro description and active language. Less-than signs are escaped in JSON to prevent embedded markup closing the script. Both-hidden sections omit JSON-LD. Do not add a second Page intro or duplicate WebPage entity elsewhere in the same composition. Page SEO title/description settings remain independent.

## Verification

Theme Check, typography/assets checks and existing behavior suites pass. Development Shopify rendering verifies default and editorial blank-field fallback, a single H1, valid WebPage JSON-LD and the native policy CSS. Headless phone/desktop checks cover wrapping and overflow. Longer populated text is checked using temporary browser-only fixture content; no sample copy or page assignment is saved in Shopify.

Final checks also verified the `?view=editorial` development template at 390px, keyboard skip-to-main with storefront scripts blocked, and the intro's bounded layout at 320px with a 200% root font. Native policy title wrapping uses language-aware hyphenation. Strict `jq` rejects four pre-existing Shopify-generated comment headers; all 24 JSON documents parse after removing those headers in memory, without editing authoritative files.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).
