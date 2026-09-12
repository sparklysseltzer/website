# Main page

Source: `sections/main-page.liquid`, shared `snippets/page-intro.liquid` and `assets/page-content.css`.

Template: `templates/page.json`. The default template retains this fixed section. The approved custom-template migration replaces it with Page intro in `page.about` and `page.retail`, preserving section IDs and saved settings.

The fixed main section renders the Shopify Page title as its H1, optional `custom.intro_text` beneath it, and `page.content` as long-form reading copy. It never shows a small label and deliberately ignores `custom.intro_heading`. Empty intro/body containers are omitted. No section needs to be manually added to the default template: JSON templates render their built-in main section.

Page body HTML is merchant-owned. Use H2 and deeper headings in that editor so the template retains a single H1. Responsive media, horizontally scrollable tables and wrapping protect the reading column. Content is centered at a maximum 800px; body text remains left aligned.

Supporting pages retain `custom.brand_variant` for shared shell and heading typography. The H1 uses the shared Display role; body uses Body/reading leading and semantic heading roles. There is no JavaScript or additional entrance motion.

The shared intro renderer emits `WebPage` JSON-LD from visible content; see [Page intro](page-intro.md) for fields, escaping and entity ownership. For editorial pages use the Page intro section and the `page.editorial` starter instead of this section, avoiding two H1s or automatic body output.

## Native policies

Shopify's `/policies/...` endpoints are not Page resources and do not use `page.json` or Page metafields. Their existing Shopify-owned title and body receive matching reading-column/title styling through `page-content.css`, conditionally loaded by the layout for `page` and `policy` requests. Policy content stays under Settings → Policies; no policy copy is duplicated, modified, or moved. This is presentation only and introduces no separate policy entity or legal claims.

## Breakpoint visibility

Existing Hide on mobile / Hide on desktop settings and IDs are preserved. See the shared visibility contract in README. Keep one visible H1 at both breakpoints. Both-hidden configurations suppress this section's WebPage JSON-LD.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).
