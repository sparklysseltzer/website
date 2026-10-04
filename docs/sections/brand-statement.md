# Brand statement

A reusable Brand storytelling section, based on Figma `12596:24781`. Add **Brand statement** anywhere a short brand introduction fits. It is not automatically inserted into saved templates.

## Content and layout

The merchant requested fixed, code-maintained German copy and artwork. `sections/brand-statement.liquid` owns three semantic paragraphs and marks their language as German. This intentional fixed-language composition is not reusable form/UI copy. A future language version should translate the complete composition, including artwork placement.

Uses Narrow width (800px), Section typography, Erode Bold, shared Erode leading/tracking, authored casing, centered text and shared section spacing. No local font-size or line-height overrides. Figma's custom leading is normalized to the design system.

Decorative inline artwork uses a white cross on a red disc (derived from the bundled Swiss mark geometry), Yuzu Soda and Holunder Seltzer cans, and the existing green Soda leaf artwork. All are hidden from assistive technology with empty image alternatives. They are not buttons or additional product claims. The freshness badge reuses `soda-reason-leaf.svg`. No remote runtime assets or dependencies.

## Motion and resilience

Every word and inline artwork scrubs directly with its own vertical position. Reveal starts around 94% of viewport height and finishes around 62%, with a small left-to-right offset (up to 4% of viewport height). Scrolling down clears/fades in; scrolling up reverses the same blur/opacity/lift and artwork rotation/scale. Paused Web Animations use shared entrance easing and a normalized 1000-unit timeline, not a timed playback. Blur remains bounded to individual words/artwork (8px).

All targets are initialized together, including later paragraphs below the viewport. Their positions are applied synchronously before paint; no paragraph is left clear and then hidden by a later intersection trigger. Word positions use untransformed layout offsets inside the positioned section, avoiding feedback from animated transforms. Scroll work is coalesced into one requested frame, with no continuous loop; unchanged progress does not rewrite animations. ResizeObserver, window resize and pageshow reconcile wrapping, font/layout changes and restored scroll positions.

Server-rendered text remains visible without JavaScript. Reduced motion cancels all effects and exposes the complete copy; toggling motion back on restores the current scroll state. Disconnect cancels animations, pending frames and observers/listeners. Reconnection and Shopify section replacement initialize at the current position rather than playing an entrance sequence.

America.gov's live reference was blocked by its security challenge during review; exact reference timing could not be verified. The supplied screenshot, Figma and requested blur/fade behavior informed this implementation.

## Editor contract

Fixed content needs no text, icon or animation settings. **Visibility** exposes independent mobile/desktop toggles with no dependent fields. **Section background** follows the standard Default / Transparent / Custom Color control; only Custom Color shows Color. New placements use Transparent. All field IDs and mode cases are registered in the editor schema contracts.

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
