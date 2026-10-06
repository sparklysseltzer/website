# Image and text panel

Source: `sections/split-image-text.liquid`

## Purpose

Image and text panel owns the approved side-by-side editorial composition with a media panel and a solid-color content panel. It is available as a reusable section preset. Full-background image compositions belong to the separate [Poster](poster.md) section.

## Merchant controls

- left/right/top image placement; image width and side-by-side minimum height appear only for Left/Right;
- optional Shopify image and image alternative text;
- optional heading (`h2` or `h3`), rich text, tick-list blocks, and linked action;
- automatic/dark/light button treatment;
- panel and text colors.

Heading, subtext, and action fields are conditionally visible only while their corresponding display toggle is enabled. Headers divide layout, media, content, and appearance controls.

The preset uses `#` as its initial action URL, and the renderer applies the same fallback to older blank instances, so an enabled button remains visible until the merchant selects its destination.

## Rendering and motion

The inner image/content surface is centered at a maximum 87.5rem/1400px width, matching Poster and USP while retaining the shared page gutters and section rhythm.

The bundled team portrait renders automatically while the image picker is blank. Shopify-selected media replaces it, renders responsively with intrinsic dimensions, and uses the focal point saved in Shopify; the section exposes no duplicate crop controls. The source-controlled fallback uses a centered crop. The image and content form two desktop columns and stack media-first on phones. The shared `poster-motion` controller adds reversible scroll-scrubbed content reveals and clipped-media parallax. The static final composition is the server-rendered default; JavaScript and motion are skipped for reduced-motion users.

## Accessibility and limits

The selected heading level preserves page hierarchy, decorative tick icons are hidden from assistive technology, and the action renders when enabled with a non-empty label. Editors must replace the `#` placeholder with a meaningful destination and supply useful image alternative text when the image conveys content. Video, multiple actions, app blocks, and per-breakpoint art direction are not implemented.

## Typography roles

Section heading; body copy and tick-list text; UI actions.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

## Top image and two-column text

Top matches Figma `10989:45021`/`10989:45022`: a full-width banner over an enclosed content panel, using the shared content width (Editorial defaults to 1400px). Its independent image-height control replaces image width; phones cap the banner height to 70vw. New placements default to a white panel; existing saved colors remain authoritative. Top mode can show one or two text columns. The original heading/rich text/list/action form the first column; Second heading and Second text form the second. Both use the selected semantic heading level and font. Columns stack on phones. A blank Top image uses `editorial-soda-banner.webp` (1600×948); Left/Right retain the existing team portrait. Shared scroll motion and reduced-motion behavior remain unchanged.

## Editor dependency contract

Layout groups image side, relevant height/width and text-column controls. Image comes next, followed by Content, the conditional Second text column group, Button, Appearance and Visibility. Side layouts hide Top height/text-column fields; Top hides side width/minimum height. Two text columns exposes both secondary fields and keeps Heading level available even when the first heading is disabled. All dependent fields carry their own conditions; conditional headers alone do not hide fields.

Editor naming (2026-09-12): **Image and text panel**. Display names only; internal IDs, saved settings and rendering are unchanged.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Rounded surfaces use the shared [panel shadow](../design-system.md#panel-shadows); nested surfaces suppress the additional shadow. Existing layout, focus and motion behavior is preserved.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Editorial**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Full-width selected media uses the shared `content-image-sizes` hint for Narrow/Editorial/Page, so a wider selection is not capped to the old source size. Split media retains its side-by-side hint except in stacked/Narrow layouts.

## Nested column blocks

New panels use **Content source → Column blocks**. The section renders two fixed, editor-selectable theme blocks: **Left column** (`_panel-left-column`, static ID `left_column`) and **Right column** (`_panel-right-column`, static ID `right_column`). Each column owns its optional heading, rich text, tick list and button. Tick items (`_panel-tick`) are independent reorderable children. Heading level/font, image/layout, panel colors, container width and section visibility remain section-level controls.

Top + Two renders both columns; Top + One and side-image modes render only Left. Shopify shows its conditional-rendering cue for the Right block; its content is retained across mode changes. Columns stack on phones. Show heading/text/button independently condition their fields. Show tick list hides the list but does not delete/hide its child entries from Shopify's block tree. No additional list-container block is needed. Static column roots use `tag: null` with Shopify attributes to preserve the two-column grid; ticks use semantic list items. Existing motion hooks, heading casing, links, responsive media and no-JavaScript rendering remain shared. The content describes general prose and benefit lists, not distinct typed entities; no new JSON-LD is warranted.

### Existing-content compatibility and migration

The original section-setting IDs remain available under **Content source → Existing section content**. That is the schema default for unmigrated instances; the add-section preset explicitly chooses Column blocks. Legacy root `item` entries are supported by `blocks/item.liquid`, which intentionally has no picker preset. This makes every declared block a theme block (Shopify cannot mix section-local and theme block definitions). New panels receive only the fixed column groups and their nested tick items.

`node scripts/migrate-panel-columns.mjs <fresh-download-directory> <separate-output-directory>` produces reviewable copies of affected JSON only. It copies first/second-column text and original flags/buttons into their respective static blocks, preserves tick IDs/order/disabled state and all section settings, and is idempotent. It rejects unfamiliar root blocks or inconsistent ordering. It never uploads, edits source files, or updates Shopify. `npm run check:panel` covers preservation, unrelated content, rejection and idempotency.

Read-only inventory on 2026-10-04 found no instances in the current development theme and two legacy instances in the shared draft (home and About templates). Migration candidates were generated from fresh CLI downloads outside the repository; shared/live templates remain untouched. Before a future shared release, rerun against current editor-owned content and review the same protected-file merge as any saved-content migration. The compatibility path keeps those instances usable in the meantime.

Nested-column verification: actual Shopify section rendering produced two native column roots for Top/Two and one for Top/One, Left and Right. At 1440px the two tracks were equal; at 390px they stacked without horizontal overflow. Computed Erode casing remained `none`. Schema cases cover independent column controls and hide the legacy fields in Column blocks mode. Migration tests passed for both shared-draft candidates. No shared/live templates were written.

## Per-action new-tab option (2026-10-05)

**Open in new tab** follows the destination field and defaults off, preserving existing navigation. Existing content shows the option only in legacy content mode with Show button enabled. Each native left/right column owns the same option behind its own Show button toggle. Enabled links render native `target="_blank"` and `rel="noopener noreferrer"` and reuse the translated screen-reader new-tab announcement. No JavaScript is required. Existing IDs and saved content are preserved; the checkbox enables no further fields. Editor contracts cover enabled, disabled and inactive-content states.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.
