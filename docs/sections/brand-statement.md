# Brand statement

Figma rhythm (2026-10-10): frame `12596:24781`, text node `11710:43785`, specifies Erode Semibold at 75px with 62px line height and −3% tracking. The statement uses shared `--line-height-heading-erode-semibold` (62/75) and the existing shared −0.03em Erode tracking at all sizes. Mobile proportional fitting and its approved line breaks remain; other sections' heading rhythm is unchanged.

Font refinement (2026-10-10): the statement uses the supplied Erode Semibold face at weight 600 on all viewports. Shared size, leading, tracking, authored casing, inline artwork and mobile composition fitting remain in place; font-load completion recalculates wrapping and the fit. A mobile-only break before “mit Better-for-You-Ansatz.” preserves the approved first-paragraph composition despite the narrower Semibold metrics. See the design system's Erode weight registration.

A reusable Brand storytelling section, based on Figma `12596:24781`. Add **Brand statement** anywhere a short brand introduction fits. It is not automatically inserted into saved templates.

## Content and layout

The section exposes three source paragraph fields in the Theme Editor. German is the store's primary content language. English and future translations belong in Shopify Translate & Adapt; Liquid reads the same section setting and Shopify supplies the localized value. The section inherits the document language. Existing `paragraph_1_de`, `paragraph_2_de`, and `paragraph_3_de` IDs are retained to preserve saved source text; the suffix is historical and does not control rendering language. Separate English fields and manual locale switching were removed. No saved content or translations are migrated by this code change.

The first `*` inserts the paragraph's assigned illustration (Swiss, cans, freshness); removing it hides that artwork. Subsequent markers remain literal. Blank text hides the paragraph. Text is escaped and authored line breaks render as `<br>`. Translate & Adapt translations can position their own `*` and line breaks. English translations must be entered/published in Shopify; German defaults alone do not create English translations. No rich HTML is accepted. The former hardcoded mobile-only break is removed so edited text wraps naturally.

Uses Narrow width (800px), Title typography on phones, and Display typography from 768px upward. At widths above 1200px, its text frame grows to 75rem (1200px at the standard root) to give the full statement more natural line breaks. Outer gutters remain outside this text width; the shared desktop root scaling still applies. This supersedes the earlier 832px desktop refinement. Erode Bold, shared Erode leading/tracking, authored casing, centered text and shared section spacing remain. It uses shared typography roles without local font-size or line-height values. Figma's custom leading is normalized to the design system.

Decorative inline artwork uses a white cross on a red disc (derived from the bundled Swiss mark geometry), Yuzu Soda and Holunder Seltzer cans, and the existing green Soda leaf artwork. All are hidden from assistive technology with empty image alternatives. They are not buttons or additional product claims. The freshness badge reuses `soda-reason-leaf.svg`. No remote runtime assets or dependencies.

## Motion and resilience

Every word scrubs directly with its vertical position. Inline artwork shares the timing of the nearest word on its wrapped line; its zero-height baseline anchor is never treated as a text-top coordinate. Reveal starts around 94% of viewport height and finishes around 62%, with a small left-to-right offset (up to 4% of viewport height). Scrolling down clears/fades in; scrolling up reverses the same blur/opacity/lift and artwork rotation/scale. Paused Web Animations use shared entrance easing and a normalized 1000-unit timeline, not a timed playback. Blur remains bounded to individual words/artwork (8px).

All targets are initialized together, including later paragraphs below the viewport. Their positions are applied synchronously before paint; no paragraph is left clear and then hidden by a later intersection trigger. Word positions use untransformed layout offsets inside the positioned section, avoiding feedback from animated transforms. Wrapping geometry and badge-to-word matches are measured together at setup/layout changes, then cached; scroll frames read only the section position and update changed animation progress. Resize, pageshow and font-loading completion invalidate the cache. Scroll work is coalesced into one requested frame, with no continuous loop; unchanged progress does not rewrite animations. ResizeObserver, window resize and pageshow reconcile wrapping, font/layout changes and restored scroll positions.

Server-rendered text remains visible without JavaScript. Reduced motion cancels all effects and exposes the complete copy; toggling motion back on restores the current scroll state. Disconnect cancels animations, pending frames and observers/listeners. Reconnection and Shopify section replacement initialize at the current position rather than playing an entrance sequence.

America.gov's live reference was blocked by its security challenge during review; exact reference timing could not be verified. The supplied screenshot, Figma and requested blur/fade behavior informed this implementation.

## Editor contract

Paragraphs exposes three always-visible source textarea fields with marker/line-break and Translate & Adapt help. Illustrations exposes the two existing optional image pickers. No new toggles or conditional dependencies. **Visibility** exposes independent mobile/desktop toggles with no dependent fields. **Section background** follows the standard Default / Transparent / White / Surface beige / Custom color control; only Custom Color shows Color. New placements use Transparent. All field IDs and mode cases are registered in the editor schema contracts.

## Structured data

This is introductory brand prose, not a new entity. The existing site Organization owns brand identity; emitting another entity here would duplicate it. No additional JSON-LD.

## Initial verification (2026-10-04, before scrub refinement)

The actual Shopify-rendered section was loaded through the Section Rendering API into an isolated storefront browser without modifying saved templates. Reviewed desktop (1440px) and phone (390px) layouts, intermediate blur/opacity frames, settled copy, Erode/authored casing, no horizontal overflow, reduced-motion immediate visibility, and the unenhanced section with its JavaScript omitted. Server-rendered word wrappers keep the measured section height unchanged when enhancement starts. Finished animation count returns to zero; disconnect/reconnect preserves the revealed state. There are no section-specific keyboard controls. Full repository checks, JavaScript syntax, theme JSON parsing and whitespace checks passed. All test browsers were closed.

## Scrub refinement verification (2026-10-04)

Replaced the one-shot entrance after merchant feedback about later paragraphs appearing clear before their trigger. Tested the actual section at 1440×1000 and 390×844, moving down and back up through seven positions. Matching positions produced identical opacity/blur in both directions (0 → intermediate → 1 → intermediate → 0); later paragraphs remained at zero until their own reveal range. Reviewed intermediate desktop/phone screenshots and confirmed no overflow. Reduced-motion changes canceled all 26 effects and exposed all words; switching back restored scrubbing. Disconnect/reconnect preserved all measured progress values. Repository checks, JavaScript syntax, theme JSON and whitespace checks passed; isolated browsers closed. No saved template or schema changes.

## Inline artwork alignment (2026-10-04)

Artwork uses a zero-height baseline anchor and absolutely positioned inner artwork, so it cannot enlarge the shared Erode line box or push following lines down. The Swiss badge is a white cross on red (`brand-statement-swiss.svg`), derived from the existing Swiss mark path. Shared font size and leading remain unchanged.

The can pair shares a warm neutral circular badge, with contained tilted artwork and a single circular clip. Its absolute inner surface retains the zero-height anchor, so the larger decorative disc does not change text leading.

Verified the final Swiss/can/leaf badges at 1440px and 390px. Hiding the absolute artwork leaves every word's layout position identical at both widths, confirming that the badges do not alter leading. Reviewed screenshots, circular can containment and freshness artwork; no horizontal overflow. Full repository, syntax, JSON and whitespace checks passed; isolated browser closed.

Text size reduced to the shared Section role (36–60px) at merchant request; inline artwork scales with the text. Shared leading and width remain unchanged.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Narrow**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Ananotes 176 (2026-10-04): corrected badge timing to use the nearest word on the same wrapped line instead of its zero-height baseline anchor. At 1600px and 390px, all three badges matched their neighboring text opacity exactly at intermediate scroll positions in both directions, with no overflow. Full checks passed; isolated browser closed.

Scroll performance correction: cached geometry preserves exact word/badge timing at 1600px and 390px in both scroll directions. A repeatable 200-frame headless Chromium scroll from Offer Cards to Content Slider measured Brand statement script time at about 85ms before / 4ms after caching. The after run had a maximum 16.8ms frame interval and no intervals above 33ms. These are local diagnostic results, not a cross-device performance guarantee. Reduced motion still cancels all effects.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

Size increase (Ananotes, 2026-10-09): the statement now uses shared Display typography (44–76px before large-screen scaling), replacing Section. Inline artwork scales in em with the text. Existing content-width selection, Erode rhythm, authored case and scrub animation remain unchanged.

Size verification: 76px at 1607px and 44px at 390px, with inline artwork scaling proportionally and no horizontal overflow. Reduced-motion desktop/phone screenshots were inspected. Full checks, JavaScript syntax, JSON parsing and whitespace checks pass.

Mobile size refinement (Ananotes 226, 2026-10-09): phones below 768px use shared Section typography again (36px at 390px), while tablet/desktop retain Display. Inline artwork follows the selected role through em sizing. This is an approved responsive composition choice, not a local size clamp or a change to shared role values.

Desktop width refinement (Ananotes 225, 2026-10-09): above 1200px, the section frame and text width expand by 32px, from 800px to 832px. At 1200px and below the shared Narrow width and normal mobile gutters remain. At 1440px the second paragraph moved from five lines to four, and the rendered statement measured 832px with no page overflow; at 1200px it remained 800px. At 390px it measured 358px with 36px type and no page overflow. Reduced-motion rendering kept all copy and artwork visible.

Ananotes 242 (2026-10-09): mobile statement text uses the smaller shared Title role, retaining the existing Display role from 768px, authored casing and shared leading. Verified the three paragraphs and inline artwork at 390px.

Ananotes 249 (2026-10-09): supersedes the mobile Title role with shared Card typography (26px at 390px), following the request for another size reduction. Tablet/desktop Display typography, authored casing, shared leading and proportionate inline artwork remain unchanged.

Mobile composition scaling (2026-10-09): the merchant approved those line breaks and requested the largest proportional presentation that preserves them. The original wrapping canvas and shared Card role remain; a wrapper scales text and artwork together to fit the longest rendered line inside 8px phone gutters, with 2px measurement clearance. Extra block space reserves the scaled height. Layout/font changes recompute the fit, while scroll frames only update the existing reveal. Reveal coordinates account for the composition scale. Reduced motion retains the size treatment with all text visible; without JavaScript the approved unscaled wrapping remains. Tablet/desktop are unscaled. At 390px the composition grows about 14.5% (26px text appears about 29.8px), with identical word positions in each line.

## Can composition studies (2026-10-10)

The Swiss artwork is lowered by a further .06em for optical alignment. The inline can anchor keeps its existing 1.15em width and zero-height line box, preserving text wrapping. Its neutral circular background and clipping are removed. Four transparent product assets (Yuzu, Blueberry, Holunder and Maracuja) form a compact overlapping fan. This supersedes the circular two-can treatment above. Storefront cans continue to share their neighboring text's scroll reveal; exploratory pointer effects remain in the studio.

Design Studio → Sections → Brand statement (`#BrandStatement`) provides four ready-to-go presets: four floating cans, an upright staggered quartet, a Soda pop-up pair, and a mixed Soda/Seltzer duet. Individual product toggles, composition, scale, spread, tilt, duration, stagger and interaction controls can be mixed and exported as JSON. The preview reuses the section's word/artwork markup and shared CSS. Its replay is a timed demonstration synchronized to the surrounding words, not a replacement for the storefront's scroll-scrub controller. A keyboard/touch button provides the same composition interaction as clicking the artwork. System or simulated reduced motion cancels replay and disables interaction motion. No Theme Editor schema or saved content changes.

Verification: inspected storefront screenshots at 390×844 and 1440×1000 with transparent four-can artwork and lowered Swiss mark, with no horizontal overflow. Studio preset counts are 4/4/2/2; intermediate upright-can opacity values confirm staggered reveal. System reduced motion cancels all preview animations. Mobile inspector Escape closes it and returns focus to its trigger. Clipboard access was unavailable in the isolated browser; the visible JSON/manual-copy fallback was verified. `npm run check` exited 0; JavaScript syntax, all 33 theme JSON files (generated leading comments stripped only in memory), and whitespace gates passed. Isolated browsers were closed. Safari and physical-device checks were not performed.

Product artwork source correction (2026-10-10): each can now reads its canonical product's `custom.collection_image`, matching collection cards, with `custom.teaser_image` as the secondary source. `brand-statement-can` renders responsive Shopify CDN images. If neither field is populated, the section uses the current collection-artwork snapshot in `brand-statement-can-{yuzu,blueberry,holunder,maracuja}.png`, rather than the older overview WebPs. The Studio uses those same local snapshots. Source files: `product-overview-soda-yuzu-ginger.png` (v1791477188), `product-overview-soda-blueberry-pomelo.png` (v1791477212), `product-overview-seltzer-holunder.png` (v1791413357), `product-overview-seltzer-maracuja.png` (v1791413333), downloaded unchanged from the development storefront's rendered collection cards. Future product image edits update the storefront directly; Studio snapshots must be refreshed separately. No product records or saved content were modified.

Can optical alignment: the shared can composition anchor sits at `bottom: -.22em`, lowering the complete group by .12em in both storefront and Studio while retaining its zero-height inline box and text wrapping.

Can order is Seltzer first, Soda last: Maracuja, Holunder, Blueberry, Yuzu. Studio product selection and reveal stagger follow this same order; the Soda-only preset still selects Yuzu and Blueberry.

Selected storefront composition (2026-10-10): fan, scale 103%, spread 102%, tilt 20 degrees, ordered Maracuja/Holunder/Blueberry/Yuzu. Studio's floating preset matches. Four can reveals use duration 700 and delays 0/60/120/180 on the existing reversible scroll timeline (880 total units), retaining text-linked scrubbing rather than introducing timed autoplay. The generic badge reveal is disabled for the cans to avoid compounding transforms. Mouse interaction is disabled in the selected configuration and removed from the storefront. Studio defaults to None; alternative interaction controls remain available for exploration. Reduced motion and disconnect cancel all can effects. Static CSS matches the selected composition without JavaScript.

## Optional editorial illustrations (2026-10-10)

The Illustrations group exposes `swiss_illustration` and `freshness_illustration` image pickers, in composition order. Both are always available; no new modes or dependent controls. Blank Swiss artwork uses `brand-statement-swiss.svg`; blank freshness artwork now uses `brand-statement-water-drop.svg`. Selected Shopify images render with responsive `image_url`/`image_tag` and empty alt inside the existing decorative, aria-hidden anchors. Custom freshness artwork removes the leaf's circular background and padding. These are decorative editorial illustrations, not UI icons or new claims. No saved settings are changed. Existing Layout, Visibility and Background controls retain their IDs, defaults and dependency rules; the editor schema contract includes the additive fields.

Studio options reuse the existing real-fruit USP illustration (`usp-soda-fruit-mark.svg`) on lime, yellow, ice-blue or pink circles, plus its original ring (`usp-soda-fruit-base.svg`) and the current leaf for comparison. No new illustrations are introduced. The label beneath the USP is omitted because the statement already supplies the text. A selector and thumbnail buttons swap the artwork in context; configuration export includes the treatment. The existing blue water-drop composition (`water-blob.svg` with `water-icon.svg`) is also available and is the Studio comparison default; the storefront fallback remains the leaf until a treatment is selected. The previously drawn alternatives were removed. No additional structured data applies to decorative artwork.

Freshness comparison also includes the existing Hard Seltzer ingredients water illustration, reusing `water-blob.svg` and `water-icon.svg` together. It is the Studio default for comparison; fruit badge options and the current leaf remain selectable.

Additional freshness option: **Water · single drop**, exported unchanged as SVG from Sparklys Web Figma node `15066:25244` (Frame 48096456, 130×189). Asset: `brand-statement-water-drop.svg`. The original cyan drop and black wave emblem are preserved, with no added circle. Available in the Studio selector/gallery and shown initially for review; storefront fallback remains unchanged.

Editable defaults (2026-10-10): the selected water-drop artwork and fan configuration (Maracuja, Holunder, Blueberry, Yuzu; scale 103%, spread 102%, tilt 20°, 700/60 reveal rhythm, no pointer interaction) now apply to the storefront. Default positions are cans before “Getränken,” / “drinks,” and the drop after “erfrischend” / “refreshing”. Shopify owns translations of the three source fields; no language-specific alternate fields or starter-text matching are used. No settings_data or saved templates are migrated.

Large-screen wrapping: above 1200px, paragraph 2 has a centered 13.5em text measure. This makes the current German copy wrap before “klassischen” without inserting language-specific breaks or changing typography. Paragraph identity is explicit so hiding another paragraph does not change the target. Smaller viewports retain their existing width.
