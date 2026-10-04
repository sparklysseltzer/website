# Press marquee

Source: `sections/press-marquee.liquid`, shared `snippets/logo-marquee-content.liquid` and `assets/logo-marquee.css`.

Select an ordered list of up to 50 active **Press** entries. Name, Logo and Link are store-owned; appearance stays section-owned. This is the Merchant marquee's renderer and CSS, not a second animation implementation. A separate section keeps the native Press picker clear without a source toggle that cannot hide incompatible resource pickers.

Content: optional Heading, conditional Heading font, Press entries. Motion: loop duration (12–60s), direction and hover/focus pause. Visibility and Section background follow shared contracts, with Color conditional on Custom. Logo boxes are off by default; enabling them restores the shared radius/shadow. Empty placements render only editor guidance; picker previews show neutral static logos. Missing links produce noninteractive logos. Draft entries are unavailable through Liquid. Canonical links alone enter the keyboard order; repeated lists are hidden from accessibility. Reduced motion shows a horizontally scrollable canonical list. Typography and casing use shared roles.

The first page placement contains all nine distinct publications from the original page; seven article-bearing entries link to their original article, while Watson and Swiss Drinks retain no invented destination. Editors can change Link independently from the article list. Publisher logos are navigation/recognition, not claims of endorsement or duplicate Organization entities. The article section owns the ItemList structured data.

Verification (2026-10-02): all nine original logos loaded on the development press page; repeated links are outside keyboard order. Reduced motion disables animation and hides duplicate lists. Empty saved selection omits the storefront marquee. Shared merchant regression checks used the existing Soda and Seltzer template views (`?view=soda`/`?view=seltzer`): both retain six canonical tiles, the shared stylesheet loads, and phone tiles remain 172px with no overflow. These explicit views do not change collection assignments. Press selections restored; all task browsers closed.

## Logo boxes — 2026-10-02

**Appearance → Show logo boxes** independently controls rounded logo panels and their shared shadow. Merchant marquee defaults on to preserve existing treatments; Press marquee defaults off. Off removes tile background, radius and shadow, while retaining logo dimensions, spacing, link targets and visible keyboard focus. On retains the existing tile color treatment, including transparent legacy treatments. Section background, motion and resource selection remain independent; the checkbox enables no additional fields. Both on/off modes are registered in the editor contracts. Saved IDs and content are preserved.

Verified desktop Press default renders transparent tiles with no shadow; 390px screenshot confirms logos only and no overflow. Merchant Soda template retains boxed tiles by default. Browser-only class toggles verified both shared CSS treatments (including no shadow/background in unboxed Merchant mode) and retained a 3px keyboard ring; no saved content was changed for testing. Editor schema contracts and full repository checks pass. Test browser closed.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Page**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).
