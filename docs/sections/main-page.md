# Main page

Source: `sections/main-page.liquid`, shared `snippets/page-intro.liquid` and `assets/page-content.css`.

Template: `templates/page.json`. The default template retains this fixed section. The approved custom-template migration replaces it with Page intro in `page.about` and `page.retail`, preserving section IDs and saved settings.

Main page has no `presets`, so the Theme Editor does not expose the same removal/add controls as the reusable Page intro. For composed editorial pages, use a dedicated template with Page intro (Contact uses `page.kontakt`) rather than stacking both H1 owners. As an immediate existing-template workaround, enable both Hide on mobile and Hide on desktop on Main page; this also hides its Page body and suppresses its JSON-LD. Keep Page intro visible at both widths. Do not remove Main page globally or change a shared template without checking all assigned Pages.

The fixed main section uses the same editorial header as Page intro: decorative Arc, centered heading and introduction, shared spacing, background and font controls. H1 reads `custom.intro_heading`, falling back to `page.title`; a populated custom heading shows `page.title` as a small label. `custom.intro_text` appears beneath it and `page.content` remains long-form reading copy below. Empty intro/body containers are omitted; a page without body copy has no additional body padding. No second intro needs to be added to the default template. Existing section IDs, settings and Page content are preserved; saved templates are not rewritten by this code change.

Page body HTML is merchant-owned. Use H2 and deeper headings in that editor so the template retains a single H1. Responsive media, horizontally scrollable tables and wrapping protect the reading column. Content is centered at a maximum 800px; body text remains left aligned.

Supporting pages retain `custom.brand_variant` for shared shell and heading typography. The H1 uses the shared Display role; body uses Body/reading leading and semantic heading roles. There is no JavaScript or additional entrance motion.

The shared intro renderer emits `WebPage` JSON-LD from visible content (`ContactPage` on the contact template); see [Page intro](page-intro.md) for fields, escaping and entity ownership. Main page and Page intro now share header design; use the standalone Page intro in a dedicated template when no automatic Page body is wanted. Never stack both H1 owners.

## Native policies

Shopify's `/policies/...` endpoints are not Page resources and do not use `page.json` or Page metafields. Their existing Shopify-owned title and body receive matching reading-column/title styling through `page-content.css`, conditionally loaded by the layout for `page` and `policy` requests. Policy content stays under Settings → Policies; no policy copy is duplicated, modified, or moved. This is presentation only and introduces no separate policy entity or legal claims.

## Breakpoint visibility

Existing Hide on mobile / Hide on desktop settings and IDs are preserved. See the shared visibility contract in README. Keep one visible H1 at both breakpoints. Both-hidden configurations suppress this section's WebPage JSON-LD.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

The **Heading font** group also exposes **Uppercase headings**, default false and visible only for Newake. It sets the shared heading casing role without changing stored text. When switching to Erode, a retained true value is ignored and authored casing wins. Body/UI text and the small label are unaffected. Schema contracts cover Newake off/on, Erode with stale uppercase enabled, both visibility flags and all canvas modes. Content guidance, Visibility and Section background follow in composition order.

Verification on 2026-10-01: development rendering at 390px/1440px checked Newake authored/uppercase and Erode with a retained true uppercase value. Computed font/casing, artwork, one H1, unchanged source text and no overflow passed. Blank-body rendering has zero extra body padding. The existing About page retains its Page-body HTML below the new shared intro. The unassigned editorial QA template was restored to its recorded original test composition after a watcher echo interrupted the remaining standalone-intro checks. Standalone Page intro's Erode rendering is covered by the Contact page; both sections call the same reviewed font renderer. Full authenticated Theme Editor interaction is not claimed.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Narrow**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.
