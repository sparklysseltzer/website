# Hard Seltzer awards

Source: `sections/hard-seltzer-awards.liquid`

## Purpose and placement

Hard Seltzer awards presents the approved award statement, three medal graphics, and a shop action. It is available under **Trust & information**.

## Merchant controls and defaults

The heading, introduction, button label/link, and three award images are editable. Each award block includes required-purpose alternative text for replacements. Blank content uses localized defaults; blank images render the bundled medal and flavor-badge pairs. The renderer uses `#` while the action URL is blank so the preset visibly demonstrates the button until its real destination is selected.

Fallback assets are the exact composed exports `seltzer-award-taste-master.webp`, `seltzer-award-master.webp`, and `seltzer-award-gold.webp`, including their flavor badge and approved shadow. Reordering blank blocks changes their positional fallback award.

The medals were re-exported from nodes `6619:25081`, `6619:25117`, and `6619:25153` at 3× resolution: 802×807, 803×807, and 803×807px. Export the isolated compositions with their full rendered bounds (including blur beyond layout bounds), transparent backgrounds, and no page grain. WebP delivery preserves lossless alpha so adjacent overlapping image boxes cannot cover another medal's shadow with a baked-in white rectangle. Never trim these exports to the medal/group layout bounds.

## Rendering, motion, and accessibility

Frame `8582:28777` uses black text on white, an 800px introduction, and a compact centered medal group. The transparent export margins overlap inside the row so the visible medals keep the approved close spacing; they must not become three widely separated grid cards. Internal heading/copy, copy/medal, and medal/action spacing is 14px. The shared section padding and Newake rhythm intentionally normalize the source frame's isolated typography/outer spacing values.

The awards form a centered three-column row on desktop and a single column on phones. Shopify-selected images render responsively; bundled transparent WebP assets are the automatic fallbacks. `editorial-section-motion` applies the shared reversible surface and sequential reveal contract. Visible text and the action remain complete without JavaScript, reduced-motion is respected, and the fallback medals have localized descriptive alternative text.

## Structured-data decision

The section does not emit Award, Product, Review, or Offer JSON-LD. It lacks the canonical product linkage and evidence fields required to make those claims as a trustworthy machine-readable entity; the visible editorial claim remains the honest representation until a product/organization structured-data model is approved.

## Typography roles

Display heading; body introduction; UI action.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Typography scope

Hard Seltzer awards retains its original Newake display heading, uppercase treatment, regular weight and shared heading rhythm. It opts out of the general editorial heading-font feature through `heading-font-legacy`; the added font selector is removed. Body copy remains Maison Neue. Existing content, award blocks, visibility settings and motion are unchanged.

Editor naming (2026-09-12): **Hard Seltzer awards**. Display names only; internal IDs, saved settings and rendering are unchanged.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Button and editor refinement (2026-10-06): the action now uses the shared `button__label` layer, keeping its white text above the black resting fill and changing to dark text when the primary hover/focus effect reveals the background. **Show button** defaults on; off suppresses the action and hides Button label and Button link. **Heading** is now a single-line text input with its existing ID; the renderer preserves any line breaks already saved. Section visibility remains independent and Custom background alone enables Color. No saved values or award claims change.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).


## Heading case controls (Ananotes, 2026-10-09)

The title now uses the shared Heading font selector (Erode / Newake), followed by Uppercase headings, visible only for Newake. Off preserves authored case; Erode ignores saved uppercase. Newake is the schema default, with casing off. Product Comparison presets explicitly choose Erode for Soda and Newake for Hard Seltzer. Only the section title consumes this choice, preserving comparison-card type and award artwork. This supersedes the earlier fixed-heading typography scope. No saved templates, merchant copy or store records are changed.

Schema review: existing content/layout/visibility groups remain in composition order. Product Comparison's world enables its Soda footnote and block values 4–6; featured only controls ordering. Awards' Show button enables label and link. In both, Colored enables Surface, Custom color enables the picker; breakpoint visibility and content width have no dependent fields. Heading font enables only the Newake uppercase field. Erode, normal Newake and uppercase Newake cases are registered in the editor gate.

Verification: schema mode/dependency contracts pass. Local Hard Seltzer renders use Newake with authored case at 390px and 2101px; temporary browser token overrides verified the Erode, normal Newake and uppercase Newake CSS modes at both sizes. This checks rendered styling, not a live Theme Editor session. Full checks, JSON and JavaScript validation pass.
