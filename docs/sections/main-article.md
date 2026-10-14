# Article

Source: `sections/main-article.liquid`, `snippets/article-share.liquid`, `assets/article-share.js`, shared `article-card` and `blog.css`.
Template: existing `templates/article.json` (unchanged).

## Content and layout

The article owns one H1, publication date without a visible author, optional excerpt and responsive feature image, complete Shopify rich-text body, a footer return-to-blog action and three other recent posts from its owning blog. Rich text stays readable at a 48rem measure; images/video fit the viewport, tables scroll locally, and headings follow the section font. The outer image measure is 80rem. Shared Display/Card/Body roles, section padding and radii own styling. Existing content, inline media, claims and translations are not rewritten.

The old live template's signature image and signature caption are omitted; neither belonged to article.content. No broad image removal or signature guessing is applied to merchant content. Existing footer supplies newsletter/navigation. No extra newsletter copy, author signature or subscription claims are invented.

## Share

The share-icon summary uses the native Web Share API on phone-width or coarse-pointer devices when available, passing the article title and canonical URL. Cancellation leaves the page unchanged; other failures fall back to the channel chooser. Desktop and unsupported devices open a native modal dialog with WhatsApp, Facebook, LinkedIn and email links using the canonical public URL and encoded article title. Opening channels requires the visitor's explicit click; no social SDK, tracking embed or remote runtime library loads. Copy link appears only when Clipboard API is available, reports success through the shared toast service, and selects the readonly URL field if copying is denied. The readonly URL field uses the shared rounded form-control primitive and remains usable without JavaScript.

Progressive enhancement moves the existing disclosure content into a labelled native dialog, animating opacity and an 8px offset with Base/shared easing. Escape, the close button and backdrop clicks dismiss it and return focus to the summary; native modal semantics contain keyboard focus. A bounded timer ensures dismissal completes even when background tabs defer animation-finish events. Native details/channel links still work with scripts disabled. Reduced motion settles immediately. All component listeners and animations are cleaned up on removal.

## Editor and structured data

Content retains the existing heading-font ID and Erode default; Newake is optional. Visibility precedes the final Section background group. Shopify's `article | structured_data` emits the only primary Article entity, using actual article metadata; it is suppressed when hidden on both viewports. Related cards remain ordinary links, not duplicate full Article entities. Native tags, comments/forms and reading-time estimates are outside this implementation.

Verification (2026-09-15): existing Windräder article inspected at 1440px and 390px; one H1, one Article JSON-LD entity, body/media intact and no signature image. Keyboard Enter/Tab/Escape and focus restoration, open/close interruption, reduced-motion duration, canonical channel URLs and copy-success toast verified. Clipboard writes were mocked in the isolated browser to avoid replacing the user's clipboard. With scripts blocked, the complete body, native share disclosure and four channel links remain accessible; Copy stays hidden. All test browsers closed. Repository checks pass; all 34 content JSON files parse after stripping Shopify's generated leading comments (raw jq still rejects those existing comments).

## Section background

**Section background** is the final group: Transparent or Colored. Colored shows Surface; only Custom color shows the picker. Clear means transparent. New/default placements start transparent. Saved color fields remain intact; retired Default modes are compatibility-only. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Panel-shadow rollout (2026-10-01): Article hero images and related article cards use the shared panel shadow. See the [shared contract](../design-system.md#panel-shadows).

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Editorial**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

## Detail refresh (2026-10-05)

The shared editorial page-intro supplies the white fade, decorative Sparklys Arc and authored H1. The top return link and visible author are omitted; the footer return/share actions remain. The feature image uses a 16:9 cover crop and rich-text images use 3:2; Shopify hero focal points are preserved. Merchant body HTML is unchanged. Related cards omit dates and use the shared filled-hover round arrows. Native Article structured data continues using Shopify metadata.

Verified on the Windräder article at 1440px/390px: one H1, Erode with no text transform, 3:2 feature image, no header links/author, intact body and no horizontal overflow. No saved templates or store content changed.

Spacing refinement (2026-10-05): the article intro uses a single 2.5rem gap before the feature image at phone and desktop sizes. The content wrapper adds no top padding, and trailing excerpt/meta margins are normalized so they do not compound the gap. Other page introductions retain their spacing.

Rich-text spacing refinement (2026-10-05): body H2 headings use 3rem top margins (previously 2rem). Body images are block elements with 2rem top/bottom margins. Direct first/last children retain the shared zero outer-margin treatment; the feature-image gap and shared typography remain unchanged.

Excerpt typography (2026-10-05): the article introduction uses the shared Compact size role (18–20px), Maison Neue body font and shared 1.5 body line height. Listing-card excerpts retain Body size.

H2 spacing correction (2026-10-05): retain the 3rem top gap and explicitly set a 1rem bottom margin, replacing the browser’s font-relative bottom margin. Adjacent paragraph margins collapse normally; headings stay closer to their following copy.

Equalized rich-text rhythm (2026-10-05): H2 bottom margins now use 2rem, matching the 2rem margins above and below body images. The H2 top margin remains 3rem. This supersedes the earlier 1rem bottom-margin correction.

Feature-image ratio refinement (2026-10-05): the main article image uses 16:9 at every viewport, preserving its Shopify focal point. Body images remain 3:2.

Shared article-card polish (2026-10-05): arrows start white and sweep to black; cards gain a subtle hover/keyboard-focus lift and shadow using shared timing. Reduced motion suppresses travel.

Hover refinement (2026-10-05): article-card images remain stationary; the image zoom is removed. Card elevation and the arrow bubble sweep remain.

Elevation timing refinement (2026-10-05): shared article cards now lift and settle using Slow (360ms) with UI easing, replacing the faster Base/strong ease-out combination. Position and shadow remain synchronized; interrupted transitions reverse from the current state and reduced motion still suppresses travel.

Share and footer refinement (2026-10-05): the footer return action includes the existing left arrow and the translated label “Back to blog” / “Zurück zum Blog”. Share and copy icons use unmodified Untitled UI Line `share-07.svg` and `copy-01.svg` from https://github.com/untitleduico/icons/tree/main/icons under the retained Untitled UI license. The channel chooser uses shared surface, radius, typography, focus and motion roles. Phone and desktop layouts were inspected headlessly; native API payload, cancellation and failure fallback were checked with mocks, without sending shares or replacing the clipboard. Native operating-system sheet appearance requires a physical-device check.

Shared background surfaces (2026-10-06): Transparent / Colored. Colored exposes the Surface dropdown bound to existing shared CSS/theme color roles; only Custom color exposes the original picker. Schema default Custom preserves existing saved colors; new add-section presets select Surface. No saved content is migrated. Internal text/card colors do not auto-invert. See [Section backgrounds](../design-system.md#section-backgrounds).

## Shared heading casing

**Heading font** uses the standard two-choice Erode/Newake segmented control. **Uppercase headings** appears immediately after it only for explicit Newake and follows the font control's content visibility. On uppercases semantic headings (including rich text); off preserves authored case. Erode ignores saved uppercase. Legacy saved Automatic values remain rendering compatibility only; the editor offers Erode and Newake. See the [heading control standard](../design-system.md#editorial-heading-font-selection). Font/casing schema scenarios are registered; no saved template content or structured data changes.

## Article-owned FAQs and recipes

Articles can assign **Article FAQs** (`custom.faqs`), an ordered list referencing the existing `faq` metaobject definition. `snippets/article-faqs.liquid` renders complete, unique, storefront-readable entries after the body and before return/share actions. No assigned/usable entries means no heading, empty wrapper or FAQ stylesheet. The composition reuses `faq-heading`, `faq-item`, `component-faq.css` and the existing `faq-accordion` controller, including its native details fallback, keyboard behavior and interrupted/reduced motion. No new section settings or saved template edits are needed. The same filtered list feeds `faq-structured-data`; hiding the article at both breakpoints also suppresses its FAQ data.

Draft FAQ metaobjects remain unavailable in Liquid, including normal draft article previews. Keep them draft while reviewing unpublished copy to prevent leakage into the all-active FAQ directory. Activate approved FAQ entries when publishing the article. The directory will then include them because it deliberately exposes all active entries. The Article FAQs metafield preserves their order and references in the meantime.

Optional `custom.recipes` JSON supplies Recipe entities through `article-recipes-structured-data`. Each entry has `name`, `anchor`, `ingredients` (string array), `instructions` (string array) and `yield`; these must match the visible recipe copy and anchor in the article body. The authoring import derives both from the same reviewed source. Keep both synchronized in subsequent edits. Do not invent photographs, durations, ratings or nutrition to satisfy rich-result fields. Missing photographs mean recipe rich-result eligibility is not claimed. Shopify's native Article JSON-LD is retained separately.

The nine Soda drafts created from the merchant's October 8 source document use the existing News blog with topic tags instead of new blog containers. Each has three draft FAQ entries, SEO title/description, excerpt, internal links and internal editorial review notes. None were published. The caffeine value was confirmed by the merchant as 45 mg per 330 ml for both flavours. Founder launch year and imagery still require editorial review.

Verification: local Liquid-rendered fixtures exercised absent, incomplete and duplicate FAQ references, matching visible/FAQPage counts, both-breakpoint schema suppression, and five Recipe entities with matching visible anchors/ingredients. Headless Chromium at 390px and 1440px inspected the reused accordion; keyboard opening, reduced-motion behavior, a script-free native details fixture and phone overflow were checked. Draft references were not activated for testing. API read-back verified all nine articles unpublished and all 27 referenced FAQs draft. Full repository gates passed. Preview fixtures are isolated development evidence, not a claim that unpublished Shopify FAQs are publicly renderable.

## Editor organization (2026-10-14)

- `sections/main-article.liquid`: Layout → Headings → Visibility → Section background.

These groups supersede earlier field-order descriptions. Heading text, font and casing are adjacent where one heading is authored here; shared heading controls remain available for the content they style. Existing field IDs, defaults, options, per-field visibility and saved content are preserved. See the [configuration grouping standard](../architecture.md#theme-editor-configuration-design).
