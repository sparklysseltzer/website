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
