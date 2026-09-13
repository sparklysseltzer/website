# Two-column layout

Source: `sections/two-column.liquid`, native theme blocks in `blocks/`, and `assets/editorial-content.css`.

## Composition and editor controls

Add **Two-column layout** under Brand storytelling. Two static, editor-selectable groups keep ownership clear: **Content** and **Sidebar**. Editors add, remove and reorder children inside each group. The groups themselves keep content first and sidebar second.

Content supports Text (heading and rich text), Image, Text and image, Poster and Accordeon. Sidebar supports repeatable **Sidebar box** and **Link box**. No artificial one-box limit is imposed; Shopify's native template/block limits still apply. Native theme blocks are used instead of copying section implementations into a monolithic switch.

The desktop grid is 1200px maximum, with an 800px content column, 40px gap and 360px sidebar. Below 900px it becomes one column: all main content, then sidebar content. Shared page gutters, section spacing, font-size roles and radius tokens apply. The sidebar is not sticky.

## Sidebar box

**Box design** supplies Soda promotion, Hard Seltzer promotion, Maracuja buy reminder or Subscription teaser starting values. One shared set of overrides remains visible for every design, even when the heading/button is disabled or overlay strength is zero. Layout, content position, heading font and button style offer **Use preset**. Empty image, color, height and overlay-strength overrides use the selected design’s values. Explicit overrides take priority and persist when switching designs; clear them or select Use preset to resume following the design. Numeric height is clamped to 120–1000px and overlay strength to 0–100%; explicit zero removes the additional overlay. Heading and action copy remain shared; Show heading and Show button work for both compact and tall compositions.

Shopify cannot rewrite sibling settings when a select changes, so these are server-rendered preset defaults plus overrides, not simulated writes to the editor. Existing per-design setting IDs remain as hidden compatibility storage beneath the shared overrides, preserving saved images and appearance without rewriting templates. Those retired fields are not additional editing panels. For an existing block, clearing an override restores its saved design value. New blocks start from the supplied preset defaults. Promotion defaults have no extra overlay; Reminder and Subscription retain their exported gradients.

The separate logo field was removed at the merchant’s request. Promotion artwork now contains the logo, photo and original gradient together: full 360×180 Figma frames `10989:21455` and `10989:45019`, exported at 2× to 720×360 WebP. The action label and caret remain live, translatable HTML. Compact boxes preserve the complete 2:1 composition across breakpoints. Replacement promotion images should include their own logo. The Reminder asset is the complete masked frame `10989:37869`, exported at 2× (720×914), including texture and gradient but excluding editable heading/action. Its 360:457 aspect ratio and centered crop preserve the composition at wider sidebar sizes; minimum height remains configurable. Its additional overlay defaults to zero to avoid doubling the baked gradient. The Subscription asset is the complete masked frame `10989:37870`, exported at 2× (720×1038), with its photograph, black gradient and texture. Editable heading and action remain transparent in the temporary export. Its centered 360:519 composition replaces the source-photo crop; the additional overlay defaults to zero. Shopify image replacements use responsive delivery and native focal points. The embedded brand logo is described by the promotion image alt text. No destination renders a static box rather than an empty link.

## Link box

A separate lightweight component renders an editor-authored title, destination, background and text color with the shared chevron. `icon-editorial-chevron.svg` is the Figma/Untitled UI 24×24 chevron with its original internal whitespace, a 2px rounded stroke and a 12×6 glyph; rotating the box gives the centered right caret. Promotion actions use the same icon inside a 36px circle, with the reference 14px right inset. The entire 56px-minimum surface is the link. A blank destination renders static text. Hover changes use the shared fast transition and reduced-motion fallback; keyboard focus uses the global contract. No nested interactive controls are generated.

## Reuse, typography and structured data

Poster uses `poster-content` and the same stylesheet/motion controller as the standalone section, including native nested tick items. FAQ uses `faq-list-content`, `faq-item`, `component-faq.css` and the existing `faq-accordion` controller; see [Accordeon](faq-accordion.md). The main group supports independent heading font choices per block. Erode is the default; Newake is optional; body remains Maison Neue. Main headings use Section, sidebar headings Card, links Compact and paragraphs Body roles.

Only visible real FAQ content produces structured data. Poster, ordinary editorial text, images and navigation cards introduce no independent typed entity: there is no honest Product/Offer/Article mapping for these generic compositions. Shared mobile/desktop visibility applies to the whole section. FAQs omit JSON-LD when both visibility settings are enabled.

## Verification

2026-09-12: a temporary development template exercised nested blocks, all four Sidebar box presets, Link box, Poster with a nested tick, both heading fonts, rich-text headings and selected real FAQs. Browser checks at 320, 390, 768 and 1440px found no new layout overflow. Custom image heights resolved to 280px on mobile and 420px on desktop; left/right DOM order, Top one/two text columns and unique FAQ DOM IDs were checked. Keyboard, intermediate reversal frames, one-open-item behavior, reduced motion and native no-JavaScript disclosure passed. FAQ JSON-LD parsed with shared canonical entity IDs. Temporary templates/probes and both isolated headless sessions were removed.

## Theme Editor grouping and dependencies

Sidebar box groups Design, Image, Content, Appearance and Action. By explicit merchant request, none of its current customization controls uses conditional visibility. Retired design-specific IDs remain hidden solely to preserve previously stored settings. The shared override controls affect every preset, including compact headings, top-positioned content, custom minimum heights and dark/light arrow circles. Image dimensions describe the selected artwork independently of the chosen layout.

Link box uses Content and Appearance groups. Text uses Content, with Show heading gating the heading and heading level. Font selection stays available when rich text is present because that field can contain semantic headings. Image uses Image and Size groups; Custom height reveals desktop/mobile heights. Embedded Text and image and Accordeon share their standalone field contracts. Poster groups content, action and appearance under its content mode; its nested tick block entries cannot be conditionally hidden by the parent in Shopify, but image-only mode omits them from rendering.

The native static Content/Sidebar groups and the one-field Tick item do not need artificial field headings. Their blocks represent real editable content, not visual fieldsets. Reviewed mode cases live in `tests/editor-schema-contracts.json` and run with `npm run check:editor`.

The editor rework was verified at 390px and 1440px: hidden headings/actions are absent from rendered content; compact boxes retain their whole-card link; tall boxes suppress disabled buttons. All eight typography exclusions were checked, including variant-specific headings, small Soda card rhythms and Maison Neue Versus card titles. This earlier conditional editor behavior was superseded by the always-visible overrides below.

Preset compatibility: old per-design values remain available to the renderer under unchanged IDs. Shared overrides take priority, and no saved template data is rewritten.

2026-09-12 preset verification: full-frame promotion artwork visually checked at 360px desktop sidebar width and 358px phone width; 704px tablet boxes preserve the 2:1 ratio. Caret/circle center deltas are zero in both axes. Scoped default palettes, top/bottom placement, heights and button treatments rendered correctly for all four designs. The schema gate covers all four designs with overlays enabled/disabled and tall actions disabled. Temporary Figma export clones were removed; original frames were unchanged.

Promotion export correction: preserve every auto-layout child while exporting. Set the action row’s opacity to zero in a temporary clone; never remove or hide it, because that changes SPACE_BETWEEN layout and shifts the logo. Verify both logo instances remain at x=24, y=20 in the original 360×180 frame before exporting at 2×. Remove temporary clones after export.

Block picker previews: Sidebar box and Link box load their shared editorial stylesheet directly, so Shopify can render them in isolation without the parent Two-column layout section. The storefront and picker use the same component styles, including the caret and rounded surface.

2026-09-12 override verification: all four preset defaults plus a custom tall Soda box (Newake, top placement, orange 60% overlay, white text and dark action) rendered at 1440px and 390px without overflow. Preset heights remain 180/460/520px at the desktop sidebar width. Link box retained its colored rounded surface and caret; native keyboard focus and no-JavaScript links were checked. The schema gate now rejects hiding overlay color at zero strength and checks that all current controls stay visible across all four presets with heading/action disabled. Full checks pass. Temporary QA template and isolated browser were removed.

Editor naming (2026-09-12): **Two-column layout**. Display names only; internal IDs, saved settings and rendering are unchanged.

Editor naming (2026-09-12): **Sidebar box**; presets: **Soda promotion**, **Hard Seltzer promotion**, **Maracuja buy reminder**, **Subscription teaser**. Display names only; internal IDs, saved settings and rendering are unchanged.

Editor naming (2026-09-12): **Link box**. Display names only; internal IDs, saved settings and rendering are unchanged.

Accordeon supports titled items containing repeatable Text, Image, Text and image, and Poster blocks, with optional existing FAQs appended. Its internal `editorial-faq` type is preserved; see [Accordeon](faq-accordion.md).
