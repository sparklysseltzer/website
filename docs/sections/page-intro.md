# Page intro

Source: `sections/page-intro.liquid`, `snippets/page-intro.liquid`, `assets/page-content.css`.

Preset: **Page intro**, under Brand storytelling, available only on Page templates, limited to one instance per template. The unused intro-only Editorial starter was removed locally and from the development theme on 2026-10-01 at the merchant’s request. Page intro remains available for dedicated page compositions. The approved 2026-09-12 follow-up migrates the existing development `page.about` and `page.retail` templates from Main page to Page intro, retaining the `main` IDs, order, settings and every other section/block. Latest saved development JSON was pulled and compared before the two type-only edits. The default `page.json` keeps Main page; `page.faq` keeps its dedicated FAQ directory. No page assignments or shared/live theme content are changed.

## Content ownership

| Element | Source |
| --- | --- |
| Small label | `page.title`, only when a custom heading exists |
| H1 | `page.metafields.custom.intro_heading.value`, falling back to `page.title` |
| Introduction | `page.metafields.custom.intro_text.value`; omitted, including its spacing, when blank |

Both fields are optional Page-owned `multi_line_text_field` definitions. They render escaped text with preserved line breaks, not merchant HTML. They were created and pinned in Shopify on 2026-09-12. Their labels/help are English; populated merchant source content is German and translations belong to Translate & Adapt. No placeholder content is written to pages.

The section does not render the page body. The default Page section now uses this same editorial header design and controls, followed by the Page body. Use it for title/intro/body pages. Do not combine Page intro with Main page, FAQ directory, or another H1-owning section. Additional editorial section headings must start at H2. Template composition must retain one visible H1 at every breakpoint.

## Presentation

Centered 800px maximum content width; shared Display H1 and Body introduction with compact body leading. Heading family/weight/leading follow the existing page brand context. The Figma reference happens to use Erode; general pages retain the established Newake identity, while Soda pages use Erode. No new typography exception.

The faint decorative Arc is the exact exported SVG from Figma file `wU2QCDnknQPBZd4hacOOjq`, node `9591:18260` (Hero 2nd), stored as `assets/page-intro-arc.svg`. It has empty alt text, no interaction, and scales within the viewport. The surface-to-transparent gradient uses the current palette. Header space is already in normal layout, so padding does not repeat Figma's combined header offset.

No section JavaScript or entrance animation is required for this static content. It remains visible without JavaScript and under reduced motion. Shared breakpoint visibility applies through the existing settings; the owning section wrapper retains its editor placeholder behavior.

## Structured data

The shared renderer emits one server-rendered `WebPage` with canonical URL/ID, visible heading, optional visible intro description and active language. The `about` and `ueber-uns` templates specialize this entity to `AboutPage`. The `kontakt` template specializes this same entity to `ContactPage`; the contact form never adds a duplicate page entity. Less-than signs are escaped in JSON to prevent embedded markup closing the script. Both-hidden sections omit JSON-LD. Do not add a second Page intro or duplicate WebPage entity elsewhere in the same composition. Page SEO title/description settings remain independent.

## Verification

Theme Check, typography/assets checks and existing behavior suites pass. Development Shopify rendering verifies default and editorial blank-field fallback, a single H1, valid WebPage JSON-LD and the native policy CSS. Headless phone/desktop checks cover wrapping and overflow. Longer populated text is checked using temporary browser-only fixture content; no sample copy or page assignment is saved in Shopify.

Final checks also verified the `?view=editorial` development template at 390px, keyboard skip-to-main with storefront scripts blocked, and the intro's bounded layout at 320px with a 200% root font. Native policy title wrapping uses language-aware hyphenation. Strict `jq` rejects four pre-existing Shopify-generated comment headers; all 24 JSON documents parse after removing those headers in memory, without editing authoritative files.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

The **Heading font** group includes **Uppercase headings**, default false, with conditional visibility on the checkbox itself when Newake is chosen. It uses the shared heading casing role; stored Page text and JSON-LD remain authored text. Erode ignores a retained uppercase choice. The same control exists in Main page. Editor contracts cover Newake off/on and Erode with a stale true value; existing setting IDs are preserved.

2026-10-01 verification: Erode Page intro rendered on Contact at phone/desktop with authored casing, one H1 and valid ContactPage data. The common font renderer's Newake off/on and retained-uppercase Erode cases were rendered through Main page at both widths. Standalone Page intro's Newake modes were schema-reviewed but not separately rendered after the preview fixture sync interruption; see Main page's verification record.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Narrow**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.
