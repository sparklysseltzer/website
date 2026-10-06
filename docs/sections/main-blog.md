# Blog

Source: `sections/main-blog.liquid`, `snippets/article-card.liquid`, `snippets/article-list-schema.liquid`, `assets/blog.css`.
Template: existing `templates/blog.json` (unchanged).

The News listing uses the translated display title “The Sparklys Blog” as its only H1, the shared page-heading typography, and the same article cards as Blog teaser and related posts. All published articles are accessible through progressively enhanced pagination. Featured image, title and a 28-word excerpt/content fallback come from each article. Images use responsive CDN widths and focal points; missing images have a neutral media area. Card links are fully usable without JavaScript.

The Content group retains `heading_font` (Erode default, Newake optional) and `articles_per_page` (3–24 in steps of three, default nine). Visibility follows Content; Section background is the final group. Existing setting IDs and templates are preserved. One/two/three columns at phone/tablet/desktop use shared spacing, Large radius and Card typography; body stays Maison Neue.

Each page emits an ItemList containing only that page's rendered posts with pagination-adjusted positions and public-domain article URLs. It does not invent popularity or rank articles by unmeasured readership. No tag filters, separate blog selector, comments, reading-time estimates or popularity controls are introduced.

Verification (2026-09-15): nine real articles per page at desktop/phone, no horizontal overflow, native page-two URL loads the next nine articles and ItemList positions start at 10. Teaser cards and listing cards share the same renderer; no synthetic content or popularity list was added.

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Page**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

## Listing refresh (2026-10-05)

The first article on page one spans two of three desktop columns; the third holds five recent title links under the translated “More blog posts” heading. Tablet/phone stack the lead and panel. Shopify Liquid does not expose article hit counts, so this is explicitly a recent-post list, not a popularity ranking. No fields, tags or store records are added. The shared page-intro classes and Arc artwork supply the full-width fade header. Cards omit dates and use the shared round-arrow bubble fill on hover/keyboard focus.

`assets/blog-list.js` enhances the native next-page link labelled “Load more” / “Mehr laden”. Existing `articles_per_page` controls the initial/server batch; clicks append six posts at 768px and above or three below, buffering the rest of each server page. Final batches contain the remaining posts. Native links work with scripts blocked. Requests are serialized, abort on disconnect and preserve existing cards on failure; the shared toast exposes retry errors. Keyboard focus moves to the first new link. Additions use shared Slow height/opacity transitions; reduced motion settles immediately. The ItemList expands to exactly the appended articles, with no duplicate Article entities. Existing schemas and saved templates are unchanged.

Verified in the running dev preview at 1440px and 390px: desktop +6 and phone +3, unique URLs, Erode with authored casing, no horizontal overflow, header artwork, keyboard activation/focus, intermediate 360ms animation frame, reduced motion, failed request and retry, and native page-two navigation with external scripts blocked. Repository checks pass. Raw jq rejects existing Shopify comment headers; comment-stripped JSON validation passes.

Listing width cap (2026-10-05): the listing frame, including the lead card, sidebar and subsequent cards, is capped at the shared Editorial role (1400px usable content plus outer gutters). Narrow settings remain narrower; existing Page settings are capped without rewriting saved content. The intro background remains full width.

Listing polish (2026-10-05): display title “The Sparklys Blog” and eyebrow “News” are reusable locale strings (the requested English title is retained in German). The Shopify blog name, handle and resource URLs are unchanged. Intro-to-grid spacing is a single 2.5rem gap. Featured-card headings use Section size; ordinary cards keep Card size. All shared article cards use white circular arrows with the secondary black bubble sweep and a 4px hover/keyboard-focus lift with a stronger shadow, using shared Base timing/easing. Reduced motion disables travel/transitions. Lift uses the independent translate property to preserve existing reveal transforms.

Hover refinement (2026-10-05): article-card images remain stationary; the image zoom is removed. Card elevation and the arrow bubble sweep remain.

Sidebar refinement (2026-10-05): the list starts after the featured article and shows up to five remaining articles from the initial server batch. Its heading explicitly selects Newake through the shared font-choice contract. Underline-free title links have subtle separators, 44px minimum targets and a trailing existing Untitled UI arrow that moves with shared Base timing on hover/keyboard focus. Reduced motion disables travel. The white surface remains the baseline while six surface/link variants are reviewed in Design Studio; no popularity ranking or new fields are introduced.

Selected sidebar design (2026-10-05): variant 05 is applied to the storefront. The shared Muted surface backs Newake headings, numbered underline-free links, separators and trailing arrows. Numbers indicate list order only. The featured article remains excluded. Design Studio variant 05 now uses the exact production modifier.

Elevation timing refinement (2026-10-05): shared article cards now lift and settle using Slow (360ms) with UI easing, replacing the faster Base/strong ease-out combination. Position and shadow remain synchronized; interrupted transitions reverse from the current state and reduced motion still suppresses travel.

Inverse numbered sidebar (2026-10-05): the selected numbered panel now uses the Foreground black surface with Inverse text. Numbers, separators and arrows derive from currentColor. The requested localized heading is “Popular posts” / “Beliebte Beiträge”. This is merchant-requested display wording only: selection still uses recent articles excluding the featured entry; there is no hit-count ranking.

Sidebar surface refinement (2026-10-05): the inverse numbered panel uses the existing Inverse hover charcoal role (default #4d4d4d) instead of black. Light text, numbers, dividers and arrows are preserved.

Responsive lead/sidebar refinement (2026-10-05): the featured-card excerpt uses Compact at 768px and above; mobile retains Body as explicitly requested. The sidebar is absent from layout and keyboard navigation below 768px. Up to 49 recent-link candidates are captured before listing pagination, excluding the lead entry. Eight are available without JavaScript and on tablet. At desktop, size containment lets the featured card determine the row height; a ResizeObserver reveals only complete link rows fitting within the sidebar padding, recalculating after font loading/resizing without stretching the lead card. Hidden links are not tabbable. Observer cleanup and focus recovery handle section removal and responsive changes. No data fields or stored content change.

Load-more icon (2026-10-05): the existing Regular (48px minimum) secondary action now includes a decorative 20px Untitled UI Line plus before the translated label. It shares the label’s color-inverting sweep and does not alter the accessible name or native pagination fallback. Source: https://github.com/untitleduico/icons/blob/main/icons/plus.svg, unmodified geometry under the retained Untitled UI license. The button system currently has Regular and Small sizes, no Large variant.

Featured-card spacing (2026-10-05): title-to-excerpt gap increases from .75rem to 1.25rem, with ordinary cards retaining their existing spacing. Sidebar fitting responds to the resulting lead-card height.

Large load-more action (2026-10-05): “Mehr laden” now uses the shared `.button--large` size, 64px minimum height and Compact text, keeping the plus icon, native-link fallback and six/three incremental loading behavior. This supersedes the earlier Regular-size note.

Outline panel review (2026-10-05): the sidebar now uses a transparent surface, Foreground text and a 2px inset outline. Numbered links, dividers, arrows, desktop height fitting and mobile hiding remain unchanged. The shared modifier also powers Studio comparison A.

White panel review (2026-10-05): the selected sidebar uses the shared white Surface with dark Foreground text and no outline. Numbered links, fitting and mobile hiding remain unchanged. This replaces the outlined variant.

Development panel switcher (2026-10-05): development-role themes and Theme Editor preview expose ten sidebar designs via a labelled select plus previous/next controls above the listing. The variants restore all earlier surface/link explorations and the numbered black, charcoal, outline and white versions. Selection is kept only in sessionStorage; no schema, template, locale or merchant settings are written. White numbered remains the shipping default. Controls and variant assets are gated by `theme.role == 'development'` or `request.design_mode`; the deprecated theme object is used only for this temporary development aid, never content logic. Mobile hides both sidebar and controls. Native links and the eight-row fallback remain with scripts disabled. Switching fades out/in using shared Base timing and UI easing, cancels safely on repeated input, respects reduced motion, and reruns complete-row fitting. Observer/listener cleanup remains scoped to section lifecycle.

Selected sidebar 04 (2026-10-05): the shipping default is now black with circular arrow cues, Newake heading and unnumbered links, matching variant 04. The full treatment lives in production blog.css, independent of preview-only assets. Height fitting, featured exclusion and mobile hiding are preserved. The preview selector defaults to 04 and namespaces session preferences by the saved default so earlier white selections do not mask this change.

Preview controls removed (2026-10-05): after selection of variant 04, the listing switcher and its session controller are removed. The black arrow-circle panel is rendered directly; Studio still retains comparison styles.

Final sidebar selection (2026-10-05): variant 01, white with trailing right arrows and no numbers, replaces black arrow circles. The switcher remains removed. Newake title, adaptive fitting, featured exclusion and mobile hiding remain.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.
