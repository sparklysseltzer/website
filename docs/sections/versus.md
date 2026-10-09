# Product comparison

Source: `sections/versus.liquid`

## Purpose and variants

Versus combines the structurally identical Soda and Hard Seltzer comparison designs into one section with a `Product world` switch. The Add section picker exposes **Product comparison — Soda** and **Product comparison — Hard Seltzer** presets so generated previews start with the correct typography, background, products, facts, and legal notes.

## Merchant controls and defaults

The section exposes the variant, heading, comparison basis, disclaimer, and the Soda-only footnote. Each of up to five comparison blocks exposes its title, optional replacement image, Sparklys-product flag, and three or six values depending on the selected variant. Soda-only values use conditional field visibility in the Theme Editor.

Blank text and values resolve from localized runtime defaults. Blank product images use positional bundled `versus-*.webp` artwork; some approved products are deliberate two-image compositions. Reordering blank blocks changes their positional fallback data, so the canonical Sparklys block should remain first and flagged as the Sparklys product.

## Responsive ordering and horizontal flow

The reference frames are `8583:28780` (Soda) and `8583:28781` (Hard Seltzer). The content column is 1200px plus shared page gutters. Cards use 112px media boxes, 20px internal gutters, shared stat/label typography, and discrete 8px-spaced fact rows. The first five Soda facts and first two Hard Seltzer facts receive the pale green panels on the Sparklys card. Its border is 40% green; the remaining Soda facts are brown, and Hard Seltzer facts are gray. Hard Seltzer cards are white; Soda cards are cream. Do not replace these panels with table divider lines or enlarge the media into full-card product shots.

The Soda badge uses three exact `versus-soda-badge-*.svg` layers; all comparison arrows/checks/crosses and the caffeine leaf also use exact exported SVGs. Source-controlled crop wrappers reproduce the original product cutouts without adding editor crop controls. Merchant image replacements bypass those fallback crop wrappers.

The comparison track is a native horizontal scroller whenever its cards do not fit, with scroll snapping and keyboard focus. The Sparklys card is always visually first on phones. From 750px upward it receives desktop order three, while competitors fill orders one, two, four, and five. At wide desktop widths all five cards fit in one row; narrower viewports preserve the same ordered flow through `overflow-x` instead of shrinking cards below a readable width.

The DOM stays a semantic list of articles and descriptions. There are no JavaScript-only slider controls, so touch, trackpad, mouse-wheel-assisted horizontal scrolling, keyboard focus, and no-JavaScript use remain available.

## Motion and structured data

`editorial-section-motion` applies the shared reversible panel reveal and hierarchical staggering; it does not transform the horizontal scroll position. Reduced-motion users receive the complete static layout.

The competitor cards describe illustrative beverage categories, not canonical Shopify products or offers, and the disclaimer explicitly says they are not specific brands. Emitting Product, Offer, Review, or ItemList entity data would therefore overstate the model. Versus intentionally emits no JSON-LD until comparison data has canonical entities and a validated Schema.org purpose.

## Typography roles

Section heading; body comparison basis; compact product names; label fact captions; stat figures; small notes. Desktop/mobile ordering is unchanged.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Ananotes correction — notice text

Soda comparison disclaimers and footnotes use `--color-notice-text` (Theme settings → Colors → Notice text). Hard Seltzer comparison notes also use its world-specific Notice text role.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Preserved typography

This section opts out of the general editorial heading-font feature through its Shopify wrapper class `heading-font-legacy`. Its original type families, weights, tracking and line heights remain authoritative. Existing variant-based type selection and pre-existing font controls (where present) are preserved; no new global font selector is added.

Editor naming (2026-09-12): **Product comparison**; presets: **Product comparison — Soda**, **Product comparison — Hard Seltzer**. Display names only; internal IDs, saved settings and rendering are unchanged.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Panel-shadow rollout (2026-10-01): Comparison cards use the shared panel shadow. Featured cards preserve the green inward highlight with an inset outline. The horizontal scroller reserves shadow gutters and bottom space. See the [shared contract](../design-system.md#panel-shadows).

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Editorial**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).


Ananotes 180 (2026-10-06): individual comparison cards now receive the shared staggered scroll reveal instead of animating the entire horizontal scroller as one item. Heading, basis and notes keep their existing reveal; card ordering, native horizontal scrolling, reduced-motion and no-JavaScript content remain intact.

Footnote readability (Ananotes 197 and follow-up, 2026-10-08): dedicated notes now use the [shared footnote contrast treatment](../design-system.md#footnote-contrast-ananotes-197-and-follow-up), replacing the low-contrast Notice/muted color. USP panels retain their own inherited foreground, while open notes follow the canvas. Copy, typography roles and layout are unchanged.

Mobile gutter (sparklys.ch Ananotes 5, 2026-10-08): scroll padding now matches the scroller’s inline padding. Native initial snapping and subsequent card snaps preserve the gutter instead of scrolling the first card flush against the viewport.


## Heading case controls (Ananotes, 2026-10-09)

The title now uses the shared Heading font selector (Erode / Newake), followed by Uppercase headings, visible only for Newake. Off preserves authored case; Erode ignores saved uppercase. Newake is the schema default, with casing off. Product Comparison presets explicitly choose Erode for Soda and Newake for Hard Seltzer. Only the section title consumes this choice, preserving comparison-card type and award artwork. This supersedes the earlier fixed-heading typography scope. No saved templates, merchant copy or store records are changed.

Schema review: existing content/layout/visibility groups remain in composition order. Product Comparison's world enables its Soda footnote and block values 4–6; featured only controls ordering. Awards' Show button enables label and link. In both, Colored enables Surface, Custom color enables the picker; breakpoint visibility and content width have no dependent fields. Heading font enables only the Newake uppercase field. Erode, normal Newake and uppercase Newake cases are registered in the editor gate.

Verification: schema mode/dependency contracts pass. Local Hard Seltzer renders use Newake with authored case at 390px and 2101px; temporary browser token overrides verified the Erode, normal Newake and uppercase Newake CSS modes at both sizes. This checks rendered styling, not a live Theme Editor session. Full checks, JSON and JavaScript validation pass.
