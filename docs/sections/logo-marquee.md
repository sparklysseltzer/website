# Merchant marquee

Source: `sections/logo-marquee.liquid`

## Purpose and data source

The marquee renders an ordered `merchant_collection` metaobject whose `merchants` field references shared `merchant` records. The section owns presentation only; merchant names, URLs, and logo files remain reusable store data. See [Merchant content](../merchant-content.md).

## Merchant controls

- Merchant Collection metaobject;
- optional visible heading;
- background treatment: gray section with white cards, fully transparent section and cards, or fully white section and cards; default gray;
- 12–60 second loop duration, default 32;
- left or right direction;
- pause on pointer hover and keyboard focus.

## Rendering contract

The optional heading uses the shared section-heading size role: Erode preserves authored casing; Newake retains the established uppercase treatment. When the heading is blank, the localized section label remains as a visually hidden `h2` for the section landmark.

The full-width surface uses the Figma-derived gray background with white logo cards, a fully transparent treatment, or a fully white treatment for both the section and cards. Duplicated visual groups create a seamless CSS loop. Duplicate groups are hidden from assistive technology and removed from keyboard order. A merchant URL makes only the canonical tile interactive. Missing or empty data emits no storefront section.

Shopify's Add section visual-preview mode renders a static row of neutral logo placeholders when no Merchant Collection is available. This preview-only state communicates the layout without coupling the theme preset to a store-specific metaobject ID. After placement, an empty section continues to show the localized editor instruction and emits no customer-facing marquee until a published collection is selected.

## Motion and accessibility

The animation is CSS-only. Reduced-motion mode disables the loop and exposes the canonical list as a horizontal scroller. Pause-on-interaction applies to hover and focus-within. Logo alternative text uses the merchant name.

## Operational state

The `merchant` and `merchant_collection` definitions exist on the connected store. The development Soda and Seltzer templates select the `soda-handler` and `seltzer-handler` collections; Merchant entries remain store-owned content.

## Typography roles

Section heading; card-size neutral preview wordmarks. Logo artwork dimensions are independent of font sizing.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

Editor naming (2026-09-12): **Merchant marquee**. Display names only; internal IDs, saved settings and rendering are unchanged.

Casing verification (2026-09-28): shared font-choice checks at 1440px/390px render Erode with `text-transform: none`, and a nested Newake choice retains uppercase. Home and both collection pages were scanned for Erode headings with non-normal transformations; none remained. Source copy, merchant data and logo artwork are unchanged.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.
The old `background_style` ID remains hidden compatibility storage, preserving saved gray/white/transparent treatments and logo-card colors. Only the shared background group edits the canvas. New presets select transparent legacy card treatment as well; Default restores its saved treatment.

Panel-shadow rollout (2026-10-01): Logo tiles use the shared panel shadow. The viewport reserves vertical shadow gutters with compensating margins, preserving row placement and continuous scrolling. See the [shared contract](../design-system.md#panel-shadows).

## Shared Press rendering — 2026-10-02

Markup/motion now live in `snippets/logo-marquee-content.liquid` and `assets/logo-marquee.css`, consumed by both Merchant marquee and [Press marquee](press-marquee.md). Merchant section schema, IDs, selected collection, ordering, defaults and behavior are unchanged. The shared renderer accepts a list with `name`, `url`, `logo` fields and caller-specific empty/landmark translations; it has no hidden data lookup or page logic. Only its owning sections load the stylesheet. SVG publisher logos reuse the same responsive Shopify image path.

## Logo boxes — 2026-10-02

**Appearance → Show logo boxes** independently controls rounded logo panels and their shared shadow. Merchant and Press marquees both default off for new placements. Existing saved choices remain authoritative. Off removes tile background, radius and shadow, while retaining logo dimensions, spacing, link targets and visible keyboard focus. On retains the existing tile color treatment, including transparent legacy treatments. Section background, motion and resource selection remain independent; the checkbox enables no additional fields. Both on/off modes are registered in the editor contracts. Saved IDs and content are preserved.

Verified desktop Press default renders transparent tiles with no shadow; 390px screenshot confirms logos only and no overflow. Merchant Soda template retains boxed tiles by default. Browser-only class toggles verified both shared CSS treatments (including no shadow/background in unboxed Merchant mode) and retained a 3px keyboard ring; no saved content was changed for testing. Editor schema contracts and full repository checks pass. Test browser closed.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Page**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Press-only rendering options (2026-10-05): the shared renderer accepts `link_logos: false` to omit anchors and `full_bleed: true` to remove viewport gutters. Merchant callers omit both and retain their current links, sizing and keyboard navigation.

Default refinement (2026-10-06): Show logo boxes now defaults off for Merchant marquee. The setting ID and both on/off rendering modes remain unchanged; no saved section settings are rewritten.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared marquee controls (2026-10-06)

Both Merchant and Press use the same renderer, full-viewport track, and appearance settings. **Link logos** defaults off; enabled entries with a URL become links, while missing URLs remain noninteractive. Duplicate links remain outside keyboard order and repeated lists stay aria-hidden. Source metaobjects and stored URLs are untouched. **Show logo boxes** defaults off and exposes **Box surface** only when enabled: Transparent, White (`--color-surface`) or Soda beige (`--color-soda-surface-warm`). White is the box default. The shared roles follow Theme settings; the unboxed treatment always removes background, radius and shadow. Canvas color remains independent. This supersedes legacy card/background coupling and Press-only noninteractive behavior above.

**Heading width** and **Heading font** appear only for a populated heading; width no longer constrains the logo track. Existing setting IDs are preserved. Resource controls remain separate per section, while these presentation contracts are identical. Links and decorative panels introduce no new Schema.org entity; existing data ownership remains unchanged.

Verification: live development Merchant (Soda template view) and Press tracks span 0–390px and 0–1440px with zero default logo links and no document overflow. Shared Liquid fixtures cover all 12 combinations of link/box state and box surface, including missing URLs and duplicate tab exclusion. Browser surface probes confirmed transparent, white and beige, live inheritance when the Soda surface variable changes, and the unboxed override. Reduced motion stops the loop and hides duplicates. Schema contracts and full checks pass; browser closed.


Ananotes 179 (2026-10-06): the shared Merchant/Press renderer now uses the existing editorial scroll-reveal controller for the section, heading and viewport. The inner track keeps its independent CSS loop and pause behavior. Reduced motion and no JavaScript retain static visible content; the loop itself continues without JavaScript unless reduced motion is requested.

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.


## Bounded viewport edges (2026-10-08)

Follows the shared [bounded viewport rail contract](../design-system.md#bounded-viewport-rails-2026-10-08): centered 2600px maximum. Only viewports wider than 2600px receive transparent edge fades into the actual canvas, with visible keyboard focus and forced-colors fallback. At or below 2600px, no edge mask or fade clearance is applied. This supersedes earlier unlimited viewport-width notes. Existing schema, content, data sources and motion timing remain unchanged.

The shared visible viewport is capped; the repeated moving lists keep their intrinsic width and continuous loop. Reduced motion hides duplicates and adds horizontal end padding so the first and last canonical logos clear the fade.
