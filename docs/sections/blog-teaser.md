# Blog teaser

Source: `sections/blog-teaser.liquid`, `snippets/article-card.liquid`, `assets/blog.css`.

Add **Blog teaser** from the Theme Editor. It reads the existing `news` blog directly; no extra blog, metafield, copied article content or background setup is required. It is not automatically inserted into editor-owned templates.

## Content and controls

Content groups heading/font, number of latest published posts (3/6/9), date and excerpt visibility. Erode is the shared new-section default; Newake is available to match Figma `10940:88123`. Body remains Maison Neue. Blank heading/button label uses translated UI. The Action group hides the button-label setting when the blog link is disabled. Shared breakpoint visibility precedes the final Section background group. Empty blogs render no storefront teaser; the editor shows its empty-state message.

## Rendering and motion

Reuse the same article card as Blog and Article related posts: responsive 16:9 cover image with Shopify focal point, decorative library arrow in a circular surface, heading and optional excerpt. Missing images retain a neutral media surface; no fake articles or Figma demo claims. Shared Warm surface, Large radius, Section/Card font roles and standard heading leading normalize the reference. Three columns desktop, two tablet, one phone. Cards are single native links with visible keyboard focus.

The shared `editorial-section-motion` controller provides reversible reveals; card image/arrow hover uses shared duration/easing and respects reduced motion. Newake heading/button alignment uses the shared optical offset. No new animation framework.

An ItemList describes only the visible article links, with a section-specific ID; it is suppressed when both viewport visibility options are off. Full Article entities belong to detail pages, avoiding duplicate entities in teaser cards.

Verification (2026-09-15): real Section Rendering API response inspected in an isolated browser at 1440px/390px with three News articles and matching ItemList entries; no saved template changed. Teaser and listing share the same card snippet. Full Theme Check, typography and editor-schema gates passed.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Rounded surfaces use the shared [panel shadow](../design-system.md#panel-shadows); nested surfaces suppress the additional shadow. Existing layout, focus and motion behavior is preserved.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Page**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared card update (2026-10-05): article cards omit dates everywhere and reuse the shared round-arrow button with filled bubble-sweep hover/focus. The existing `show_date` setting ID remains stored for compatibility but no longer changes card output. No schema or saved-setting migration is made.

Shared article-card polish (2026-10-05): arrows start white and sweep to black; cards gain a subtle hover/keyboard-focus lift and shadow using shared timing. Reduced motion suppresses travel.

Hover refinement (2026-10-05): article-card images remain stationary; the image zoom is removed. Card elevation and the arrow bubble sweep remain.

Elevation timing refinement (2026-10-05): shared article cards now lift and settle using Slow (360ms) with UI easing, replacing the faster Base/strong ease-out combination. Position and shadow remain synchronized; interrupted transitions reverse from the current state and reduced motion still suppresses travel.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.
