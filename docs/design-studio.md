# Design Studio

Local URL: `http://127.0.0.1:9293/`. Start with `npm run studio`. This is a buildless HTML/CSS/vanilla-JavaScript workbench using real storefront assets, not an installed Storybook application. It writes no Shopify settings or merchant content.

## Navigation and layout

The left tree has two levels: chapter and preview. Current chapters are Typography, Colors, Layout, Motion, Atoms, Components and Sections. Overview introduces the chapters; search filters chapter/preview names. Active links and breadcrumb follow the selected hash. Browser back/forward and existing links (`#AmbientLight`, `#ContentSlider`, `#SocialButtons`, `#ButtonMotion`, `#FormPreview`) remain supported.

The center shows the selected preview and its variants. The right Configuration inspector holds that preview's existing tuner controls. Actual control nodes are moved, not copied, so IDs, listeners, form state and live bindings stay intact. Switching previews preserves local edits. Views without configuration show a short baseline explanation. Hidden views do not retain keyboard focus.

Both side panels can be opened/closed independently on desktop; preferences persist locally when storage is available. At 1000px and below they become mutually exclusive overlays, initially closed, with backdrop dismissal, Escape, focus containment and return, and inert preview content. Shared motion/reduced-motion rules apply. Without JavaScript, all previews and their original tuners remain available as an ordinary document.

## Adding a preview

1. Add a section with `data-studio-page`, stable `id`, `data-chapter`, and `data-title`. Use `data-route` only to preserve an existing nested-anchor URL (FormsPage/FormPreview).
2. Add one link under the appropriate chapter in the sidebar. Do not create deeper navigation levels.
3. Put controls inside `.studio-tuner` within the preview. The inspector relocates them at initialization while preserving existing bindings. A preview can have multiple tuner groups.
4. Use shared typography, color and motion tokens. Keep demo copy clearly distinct from saved merchant content; reuse the actual storefront renderer/CSS/JavaScript wherever practical.
5. Verify direct links, back/forward, sidebar search, desktop panel toggles, mobile keyboard/Escape, configuration bindings, and preview resize after switching views.

Typography and Colors show studio token samples, not a claim that the local palette is automatically synced from merchant settings. Content Slider's width selector demonstrates both Contained and Viewport bleed for both card layouts. Close side panels when judging a full-browser-width composition; open panels intentionally overlay the edges of a viewport-bleeding preview.

## Verification

Verified at 1600px desktop and 390px phone: all preview routes, sidebar search, independent desktop panels, mobile overlay dismissal and focus return, inspector relocation, live form-height controls, and Content Slider width switching. No horizontal document overflow or browser errors were observed. Existing slider checks cover mouse drag settling and the no-JavaScript viewport layout. Repository checks and JavaScript syntax/Shopify JSON validation pass.

Layout → Container widths previews the consolidated Narrow/Editorial/Page roles; Content Slider has separate container-width and bleed controls. These are local previews only.

Typography → Headings H1–H6 (`#Headings`) displays native heading specimens from `base.css`, their default size-role mappings, responsive ranges and live computed size/line-height/top-bottom margins. An Erode/Newake selector uses the shared heading-font contract. A separate H2 with Card sizing demonstrates semantic level independent of visual role. Specimen margins remain unmodified so browser defaults are visible; values refresh after resizing/font selection. No storefront type tokens are changed.

Components → Blog link panels (`#BlogPanels`) compares six sidebar treatments: white with trailing arrows (storefront baseline), muted gray with leading arrows, warm Soda beige with inset links, black with circular arrow cues, muted gray with an ordered index, and beige with minimal highlighted text. All reuse `assets/blog.css`, shared Newake heading choices and type/motion/radius tokens. Studio-only modifiers use existing palette defaults and never change merchant content. Shortened sample links remain in the Studio. The layout stacks on smaller viewports.

Variant 05 (gray numbered links) was selected for the storefront. Its preview uses the production `blog-sidebar--numbered` modifier; the other five remain alternatives.

Variant 05 now follows the selected black numbered treatment and “Beliebte Beiträge” title through the shared production inverse modifier.

Variant 05 follows the charcoal refinement using the existing Inverse hover palette default (#4d4d4d).

Atoms → Buttons compares Small, Regular and Large (32/48/64px minimum surfaces), including Large primary/secondary/disabled examples and the plus-icon “Mehr laden” composition, using production styles.

Components → Blog panel surfaces (`#BlogPanelSurfaces`) presents two review-only numbered variants on the same neutral canvas: A transparent with a 2px inset outline, B plain white without an outline. Their content, Newake heading, arrows, spacing and dimensions match. The storefront stays charcoal pending selection.

Surface comparison A is applied to the development storefront for review and now reuses the production `blog-sidebar--outline` modifier.

Surface comparison B (white, no outline) replaces A on the dev storefront and shares the production `blog-sidebar--white` modifier.

Panel variant styles are shared through `assets/blog-panel-variants.css`. The dev blog listing also exposes a ten-option design selector and previous/next controls; its session-only choices do not modify the saved default. Studio comparisons remain available.

Variant 04 (black with arrow circles) is now the selected storefront default and uses the production `blog-sidebar--black-circles` class. The surface comparisons remain alternatives.

The temporary listing-page panel switcher was removed after selection of variant 04. Alternatives remain accessible only through the Studio.

The latest selected sidebar is variant 01 (white with right arrows, no numbers). The listing switcher remains removed.

Transparent button default (2026-10-05): Buttons now demonstrate the transparent default and explicit `button--white` option together on a warm surface, alongside all three sizes. Both fill black on hover/focus. This supersedes the former black primary/white secondary defaults.

Button hierarchy correction (2026-10-05): primary `.button` retains a solid black resting surface and white label. Its black fill moves away during hover/focus to reveal the actual underlying surface, with a dark label. Secondary `.button--secondary` starts transparent with dark text and sweeps to black with white text. Explicit `.button--white` provides white-to-black secondary behavior. The fill lives in the animated pseudo-element, so transparency is real rather than a matching flat color. Coarse-pointer Small buttons use the same state mapping via opacity. This supersedes the all-transparent resting-state review above; Studio compares both hierarchies on a warm surface.

Round arrow buttons retain their original opaque surfaces and black hover/focus fill; they are excluded from transparent pill-button behavior.

Atoms → Text links (`#TextLinks`) documents and previews the production arrow-reveal treatment on light, dark/footer and muted surfaces, including a wrapping label. Hover and keyboard focus use Fast/200ms UI easing; reduced motion removes movement. The former background sweep is removed globally from `.text-link`.

### Brand statement studies

`#BrandStatement` includes the four-can floating fan, upright staggered quartet, Soda pop-up pair and Soda/Seltzer duet. Each preset populates the complete inspector configuration. Product selection supports zero through four cans; scale/spread/tilt compose the same fixed-width inline anchor without changing typography. Replay coordinates text and can reveals; optional pointer-follow or click fan-out can be tried with a keyboard/touch button. Reduced motion is both system-aware and manually previewable. Copy configuration exports the current JSON; the visible configuration remains available if clipboard access fails. The fixture uses actual brand statement artwork, Erode Semibold and shared statement CSS. Studio replay is timed for comparison; storefront reveal remains scroll-linked.

### Shared animation playback

Animated previews show a shared transport above the preview: Play/Pause, Replay, a keyboard-operable timeline with elapsed/total seconds, and opt-in Loop. Brand statement registers its complete text/can sequence with the transport. Button motion captures the actual pseudo-element transition keyframes and builds an enter/hold/exit cycle using the configured durations and easing. Other interaction previews capture finite CSS transitions/animations or Web Animations triggered by a preview click/change; hover or focus first to make their timeline available. Native smooth scrolling and media playback are not animation timelines and are not scrubbed by this controller.

`demos/design-system/playback.js` is studio-only. New animation studies can call `window.studioPlayback.register(pageId, { replay, reduced })` and pass their finite Web Animations to `capture(animations)`. Known interaction pages show the transport before capture; detected animations reveal it on other pages too. Do not capture the transport or inspector controls themselves. Scrubbing pauses playback and holds the chosen frame. Loop repeats the captured sequence, not the underlying commerce/navigation action. Changing configuration or route clears captured effects; hiding the tab pauses playback. System or study-specific reduced motion disables playback and exposes the static preview. Controls use native buttons/range/checkbox semantics.

Verified Brand statement pause and midpoint scrub (all animation times held at 752.5ms), looping, and Button motion's five pseudo-element effects paused at 500ms of its 1000ms cycle. System reduced motion canceled effects and disabled transport. Reviewed settled 390px layout without overflow. Repository check exited 0; JS syntax, 33 theme JSON files and whitespace checks passed. No storefront or saved-content changes.

Brand can artwork now uses local snapshots of the four products' current collection images (`assets/brand-statement-can-*.png`), replacing the older overview WebPs. See the Brand statement section document for source versions. The storefront reads product image metafields live; refresh the Studio snapshots when those merchant-owned images change.

The Brand statement freshness study reuses the existing real-fruit USP mark on lime, yellow, ice-blue and pink badges, plus its original ring and the current leaf. Select in the inspector or the labeled thumbnail gallery. No new illustration assets are used. The choice is included in exported configuration. These studies do not change saved Shopify settings or the storefront fallback. The Theme Editor image pickers remain available for merchant-owned Swiss and freshness artwork.

Freshness comparison also includes the existing Hard Seltzer ingredients water illustration, reusing `water-blob.svg` and `water-icon.svg` together. It is the Studio default for comparison; fruit badge options and the current leaf remain selectable.

Additional freshness option: **Water · single drop**, exported unchanged as SVG from Sparklys Web Figma node `15066:25244` (Frame 48096456, 130×189). Asset: `brand-statement-water-drop.svg`. The original cyan drop and black wave emblem are preserved, with no added circle. Available in the Studio selector/gallery and shown initially for review; storefront fallback remains unchanged.

Single-drop sizing: the statement preview uses a .88em-wide, 1.28em-high illustration centered within the .95em anchor, with a -.21em baseline offset. This is slightly smaller than the Swiss-badge-width version while preserving the surrounding word spacing. Comparison cards reserve a separate 7rem artwork row; images are contained within positioned badges so the tall SVG cannot overlap its label.

Inline placement at every viewport: the cans sit immediately before “Getränken,” and the freshness illustration follows “erfrischend”: “Modern, erfrischend [illustration] und unkompliziert.” This applies consistently to all selectable artwork treatments in the Studio.
