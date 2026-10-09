# Press marquee

Source: `sections/press-marquee.liquid`, shared `snippets/logo-marquee-content.liquid` and `assets/logo-marquee.css`.

Select an ordered list of up to 50 active **Press** entries. Name and Logo are store-owned; appearance stays section-owned. This is the Merchant marquee's renderer and CSS, not a second animation implementation. A separate section keeps the native Press picker clear without a source toggle that cannot hide incompatible resource pickers.

Content: optional Heading, conditional Heading font, Press entries. Motion: loop duration (12–60s), direction and hover/focus pause. Visibility and Section background follow shared contracts, with Color conditional on Custom. Logo boxes are off by default; enabling them restores the shared radius/shadow. Empty placements render only editor guidance; picker previews show neutral static logos. All logos are noninteractive, regardless of the stored Link. Draft entries are unavailable through Liquid. Logos do not enter the keyboard order; repeated lists are hidden from accessibility. Reduced motion shows a horizontally scrollable canonical list. Typography and casing use shared roles.

The first page placement contains all nine distinct publications from the original page. The marquee presents publication recognition only; stored links remain available to other surfaces and are not changed. Logos are not claims of endorsement or duplicate Organization entities. The article section owns the ItemList structured data.

Verification (2026-10-02): all nine original logos loaded on the development press page; repeated links are outside keyboard order. Reduced motion disables animation and hides duplicate lists. Empty saved selection omits the storefront marquee. Shared merchant regression checks used the existing Soda and Seltzer template views (`?view=soda`/`?view=seltzer`): both retain six canonical tiles, the shared stylesheet loads, and phone tiles remain 172px with no overflow. These explicit views do not change collection assignments. Press selections restored; all task browsers closed.

## Logo boxes — 2026-10-02

**Appearance → Show logo boxes** independently controls rounded logo panels and their shared shadow. Merchant marquee defaults on to preserve existing treatments; Press marquee defaults off. Off removes tile background, radius and shadow, while retaining logo dimensions, spacing, link targets and visible keyboard focus. On retains the existing tile color treatment, including transparent legacy treatments. Section background, motion and resource selection remain independent; the checkbox enables no additional fields. Both on/off modes are registered in the editor contracts. Saved IDs and content are preserved.

Verified desktop Press default renders transparent tiles with no shadow; 390px screenshot confirms logos only and no overflow. Merchant Soda template retains boxed tiles by default. Browser-only class toggles verified both shared CSS treatments (including no shadow/background in unboxed Merchant mode) and retained a 3px keyboard ring; no saved content was changed for testing. Editor schema contracts and full repository checks pass. Test browser closed.

## Shared content width

**Layout → Heading width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Page**. The existing `content_width` ID is retained and visible only when the optional heading is populated. It constrains the heading with mobile gutters; the logo track always spans the viewport. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Viewport and visual-only refinement (2026-10-05): Press passes `link_logos: false` and `full_bleed: true` to the shared renderer. All canonical and duplicate logo tiles render as noninteractive elements; logo alt text and hidden duplicate groups remain. The track removes horizontal gutters and width caps while retaining its continuous loop and reduced-motion scroller. Merchant marquees retain their links and existing width behavior. Schema review: heading font and heading width depend on nonblank Heading; Custom background alone enables Color; direction, pause, logo boxes and breakpoint visibility enable no additional fields. Stored IDs, defaults and data remain unchanged. No new structured-data entity is appropriate for this visual recognition row; Press articles retains its existing ItemList.

Verification (2026-10-05): development Press page has nine canonical logos and zero anchors. Track bounds match 0–390px, 0–1440px and 0–2200px at the tested viewport widths, with no horizontal document overflow; phone screenshot confirms logos enter/exit at screen edges. Full repository checks and reviewed heading-width visibility contracts pass.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared marquee controls (2026-10-06)

Both Merchant and Press use the same renderer, full-viewport track, and appearance settings. **Link logos** defaults off; enabled entries with a URL become links, while missing URLs remain noninteractive. Duplicate links remain outside keyboard order and repeated lists stay aria-hidden. Source metaobjects and stored URLs are untouched. **Show logo boxes** defaults off and exposes **Box surface** only when enabled: Transparent, White (`--color-surface`) or Soda beige (`--color-soda-surface-warm`). White is the box default. The shared roles follow Theme settings; the unboxed treatment always removes background, radius and shadow. Canvas color remains independent. This supersedes legacy card/background coupling and Press-only noninteractive behavior above.

**Heading width** and **Heading font** appear only for a populated heading; width no longer constrains the logo track. Existing setting IDs are preserved. Resource controls remain separate per section, while these presentation contracts are identical. Links and decorative panels introduce no new Schema.org entity; existing data ownership remains unchanged.

Verification: live development Merchant (Soda template view) and Press tracks span 0–390px and 0–1440px with zero default logo links and no document overflow. Shared Liquid fixtures cover all 12 combinations of link/box state and box surface, including missing URLs and duplicate tab exclusion. Browser surface probes confirmed transparent, white and beige, live inheritance when the Soda surface variable changes, and the unboxed override. Reduced motion stops the loop and hides duplicates. Schema contracts and full checks pass; browser closed.


Shared marquee scroll reveal (2026-10-06): uses the same editorial controller as Merchant marquee while keeping the independent logo loop. Reduced-motion and no-JavaScript content remains visible.

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.


## Bounded viewport edges (2026-10-08)

Follows the shared [bounded viewport rail contract](../design-system.md#bounded-viewport-rails-2026-10-08): centered 2600px maximum. Only viewports wider than 2600px receive transparent edge fades into the actual canvas, with visible keyboard focus and forced-colors fallback. At or below 2600px, no edge mask or fade clearance is applied. This supersedes earlier unlimited viewport-width notes. Existing schema, content, data sources and motion timing remain unchanged.

The shared visible viewport is capped; the repeated moving lists keep their intrinsic width and continuous loop. Reduced motion hides duplicates and adds horizontal end padding so the first and last canonical logos clear the fade.
