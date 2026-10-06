# Video

Source: `sections/video.liquid`, `assets/section-video.css`, `assets/section-video.js`.

Standalone **Video** in Brand storytelling is independently placeable from Team. Optional heading/introduction appear above a Shopify-hosted video, using Section and Card typography and shared font-specific line heights. Heading font is conditional on either text field being populated. Video width and Play automatically appear only with a selected video. Visibility and section background use the shared contracts; only Custom Color shows Color.

Width choices reuse shared design-system geometry: Narrow (`--content-width-narrow`, the existing 50rem reading width), Editorial (`--content-width-editorial`, the existing 75rem editorial width), and Page width (fills the existing page-width container, keeping its gutters). All shrink to fit phones without cropping the video. Shared large radius and subtle panel shadow apply once to the outer panel. Native aspect ratio is retained.

Native controls are never shown, as explicitly requested. A transparent full-surface native button toggles play/pause with click/tap or Enter/Space. Its translated accessible action follows actual playback events; keyboard focus uses the shared inset ring. No toolbar, timeline, volume, fullscreen or picture-in-picture control is exposed. Playback remains muted and inline. Without JavaScript the poster remains static and the inactive button stays hidden; this is the deliberate tradeoff of the control-free presentation. Optional enhancement starts muted playback once when at least 25% visible, unless reduced motion is requested; pauses offscreen/on document hide; never overrides a subsequent visitor pause. Disconnect cleans up listeners/observer. Server HTML has no autoplay attribute.

The Team page uses the published montage copied into Shopify Files as `sparklys-team-swipe.mp4` (Video `73968572105091`); original still `sparklys-team-swipe-poster.jpg` (MediaImage `73968568238467`). Shopify provides the video preview image. No remote runtime dependency. The original source headings and video selection were moved from the combined Team instance after backing up the latest development template; no live/shared template was deployed.

The decorative montage has no supplied publication date/description, so no invented VideoObject is emitted. A future editorial video entity needs honest metadata and corresponding JSON-LD in the same change.

## Verification — 2026-10-02

Actual saved width settings measured 800px Narrow, 1200px Editorial and 1376px Page width at a 1440px viewport. The restored Editorial setting shrinks to 288px at a 320px viewport. Separate Video remains rendered when Team has an empty selection. The initial version verified native controls with scripts blocked; that behavior is superseded by the control-free interaction described above. Schema dependencies are contract-tested; authenticated editor visual interaction was not performed.

Control-free verification: headless 1440px and 390px development preview confirmed `controls=false`, full-surface click play/pause, Space playback and a 3px keyboard focus ring. Reduced motion starts paused and still allows intentional playback. Accessible labels follow actual play/pause events. Phone screenshot has no toolbar or overflow. Blocking scripts leaves the static video preview, no controls and a hidden inactive button. Browser session closed; full checks, JavaScript syntax, JSON and whitespace validation passed.

## Width consolidation

The existing `content_width` setting retains its ID, default and visibility. Editorial now uses the shared 1400px role; Narrow remains 800px and Page retains the 1920px outer frame with gutters. No saved values are migrated.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).
