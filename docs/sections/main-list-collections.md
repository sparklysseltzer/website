# Collection list

Source: `sections/main-list-collections.liquid`
Template: `templates/list-collections.json`
Route: `/collections`

## Rendering and content

Lists storefront collections in the merchant-requested order: Soda, Hard Seltzer, Clothing, Accessories. Additional collections follow alphabetically. Shopify pagination remains 50 per page; priority ordering applies within each fetched page (the current catalog has four collections). Missing priority collections are skipped. HTML and ItemList JSON-LD consume the same ordered array. Each item reuses `poster-content` and `component-poster.css`, with a wide rounded image, left-aligned title/description and a localized collection link. Figma reference: `4936:24671`. The all-products panel, subscription panel and FAQ area are deliberately outside this page's implementation.

Edit each collection in Shopify to maintain its title, description and collection image. The collection image is preferred, followed by Shopify's featured image. If neither exists, the poster has a plain dark surface; unrelated subscription artwork is never substituted. Native focal points control responsive cover crops. No duplicated section copy, manually selected collection list, new metafields or remote store changes are required. Images come from Shopify rather than expired Figma URLs.

The page has one localized H1 and each poster has an H2. A server-rendered CollectionPage/ItemList describes exactly the collection destinations displayed on the current pagination page. No product offers or FAQ entities are emitted.

## Styling and motion

The directory uses the shared Poster width, radius, overlay, buttons and section heading size. Desktop minimum height is 545px, phone minimum height 480px; content can expand naturally. Posters stack with a 2rem gap. The page title uses the hero role and shared section spacing. `/collections` has the same white page background as individual collection pages.

The existing Poster scroll reveal and media parallax are reused, including reduced-motion and no-JavaScript static presentation. Collection links and pagination are native anchors. Existing standalone and embedded Poster configurations retain their prior behavior.

## Editor controls

The existing Heading font selector remains authoritative (Erode default, optional Newake). It applies to headings, including rich-text headings, while body/UI copy remains Maison Neue. No schema or setting IDs changed. Existing Hide on mobile / Hide on desktop controls follow the shared visibility contract.

## Verification

Local desktop and phone checks cover collection destination links, responsive images, one H1, matching ItemList entries, reduced motion and keyboard access. Store/editor-owned template content is unchanged; deployment remains separate.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Panel-shadow rollout (2026-10-01): Every collection panel inherits the shared shadow from Poster. See the [shared contract](../design-system.md#panel-shadows).

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Editorial**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.
