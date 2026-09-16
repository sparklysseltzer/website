# Design system

The implementation follows the approved visual intent while normalizing inconsistent measurements between design frames. Read this before styling a new section or changing an existing one.

For customer-facing wording, follow [Tone and voice](tone-and-voice.md). Visual emphasis does not require shouting or extra punctuation in source copy.

## Typography

### Shared fluid roles

Maison Neue Demi (registered at weight 400) is the standard body/UI face. Maison Neue Bold supplies explicitly emphasized UI such as FAQ questions. Erode Bold is the default for headings in every world. Each heading-bearing section exposes Erode/Newake selection, including rich-text headings; saved explicit choices are preserved. Semantic heading level alone does not select a visual size or override an explicit section role.

All ordinary typography uses `--font-size-*` roles defined in `assets/base.css`. Sections select a role, never an independent clamp, pixel/rem size, or mobile font-size override. The shared interpolation interval is 390–1440 CSS px at the normal 16px root. Bounds are in rem and preferred values combine rem with vw. Keep `html` at 100%; scaling the root would also scale layout dimensions. Equivalent roles must compute identically at the same viewport, independent of section width or product world.

| Role | Narrow → wide | Contract |
| --- | --- | --- |
| body / ui | 16 → 17px | Paragraphs, introductions, descriptions, benefits, answers, actions and fields |
| label | 14 → 15px | Navigation, icon labels, comparison labels, chips |
| small | 13 → 14px | Footnotes, metadata, secondary status |
| compact | 18 → 20px | FAQ questions, comparison/product names, footer card headings |
| card | 26 → 32px | Editorial card headings |
| section | 36 → 60px | Standard section headings, product titles |
| display | 44 → 76px | USP, Subscription, Hard Seltzer Ingredients/Awards headings |
| hero | 48 → 104px | Hero and general page titles |
| stat | 24 → 28px | Comparison figures |

`symbol` (40px) and `badge` (10px) are fixed root-relative roles for decorative equation separators and tiny cart counts, not body copy. Root-relative values still follow user text preferences. Size and semantic heading level are separate: an h2 may use section or display depending on its documented role.

Use `--line-height-body` (1.5) for reading copy, including FAQ answers and resource rich text; `--line-height-body-compact` (1.3) for short editorial paragraphs and benefits; `--line-height-ui` (1.2) for labels; and `--line-height-solid` (1) only for single-line controls. Heading rhythm remains font-specific below. Do not shrink labels to fit a grid; adapt wrapping and column layout. Ordinary body copy never changes size with its container width.

Approved artwork exceptions include the Soda 3 Reasons numeral lockup, Product Overview flavor lettering (including its existing container-based scaling), and the merchant-approved Swiss ID code composition described below. They are explicitly allowlisted in `scripts/check-typography.mjs`; do not extend the allowlist to bypass a layout problem. SVG logo dimensions are artwork geometry, not CSS body typography.

`npm run check:typography` rejects raw font-size values, unknown role references, local role definitions, and font shorthand bypasses outside those exceptions. It also tests body interpolation endpoints and enlarged-root behavior. Before handoff, inspect both font worlds at 320/390, tablet and 1440px, verify equal computed body sizes, and test enlarged text/zoom and wrapping. Relative units alone do not prove accessibility.

`assets/base.css` owns the heading rhythm:

| Token | Value | Use |
| --- | --- | --- |
| `--line-height-heading-newake` | `0.95` | Newake display headings |
| `--line-height-heading-erode` | `0.9` | Erode display headings |
| `--line-height-heading-small-erode` | `1` | Small multiline Erode editorial card titles |
| `--line-height-body-compact` | `1.3` | Compact editorial body/UI copy, including Subscription |
| `--letter-spacing-heading-newake` | `normal` | Newake heading tracking |
| `--letter-spacing-heading-erode` | `-0.03em` | Erode heading tracking |
| `--line-height-heading` | Resolves to the chosen font | All standard section and page headings |
| `--line-height-display-number` | `0.7` | Single oversized decorative numeral in a composed heading |
| `--line-height-flavor-lockup` | `0.75` | Approved Soda flavour compositions in Product Overview and product navigation cards |

The two font families have different optical metrics. Use one rhythm per font across sections, not a new line height per frame or viewport. Page context resolves the normal heading token; explicit font choices resolve the matching token in the central selector groups. Body-font labels and comparison product names are smaller UI text, not display headings, and retain their readable body rhythm.

Small multiline Erode card titles are a shared typographic role, not large display headings. Soda Ingredients and Soda 3 Reasons use `--line-height-heading-small-erode` through the central selector mapping: 32px type / 32px line height at desktop, matching both reference frames and avoiding collisions between ascenders and descenders. Keep this role centralized instead of adding per-section overrides. Large Erode headings and the approved numeral lockup retain their existing rhythms.

Do not enlarge visible line spacing to meet touch-target requirements. Compact standalone links may extend their hit area with a positioned pseudo-element while retaining their normal line box; keep neighboring actions outside that hit area and preserve visible keyboard focus.

New sections must use these tokens. If a heading has a special composition, first solve the layout with container width, responsive size, and spacing. Do not introduce a local line-height number to fit one screenshot. Genuine exceptions must be named and documented in the owning section reference.

Tracking follows the font too: `--font-heading-letter-spacing` resolves the appropriate central token, including explicit font overrides on mixed-world pages. Do not copy a frame's negative letter spacing onto Newake or apply one tracking value to both fonts. Standard section headings must not introduce local tracking overrides to fit the composition.

The existing Product Overview flavor lockups are an intentional exception: their approved `0.75` Soda title treatment is artwork-like lettering next to SVG flavor logos. Oversized numerals may use the display-number exception; adjacent words normally retain the standard heading rhythm.

**Approved exception — Soda 3 Reasons headline:** the numeral and two-line words form one composed lockup. Match frame `8583:28779`: Erode Bold words at 82px with 62px line height (`62 / 82`, approximately `0.7561`), a 192px numeral with normal line height, an 8px gap, and trimmed cap/alphabetic text edges. Scale the entire lockup proportionally on smaller viewports. The local `--soda-reasons-lockup-line-height` applies only to this headline, not its reason-card titles or other sections. Composition fidelity takes priority here by explicit approval; the global Erode `0.9` token stays unchanged. See [Soda 3 Reasons](sections/soda-three-reasons.md).

## Color, spacing, and shape

- Editorial headings and primary body/UI text share the Primary text role (black by default). Product-world font selection must not recolor them.
- `--color-editorial-heading` and `--color-editorial-muted` provide black and the shared brown supporting-copy color (`#786e5b`).
- Intentional variant colors stay scoped: Versus uses cream cards/brown facts for Soda and white cards/gray facts for Hard Seltzer. Green identifies the highlighted Sparklys facts, not all Sparklys text.
- `--page-width` is the shared 120rem/1920px outer-frame limit. `--page-gutter` is 1rem below 768px and 2rem from 768px.
- `.section` and its compatibility alias `.section--tight` share `--section-padding-block: clamp(2rem, 5vw, 4rem)` vertical padding (32–64px per side at the usual root). Do not introduce a looser default section gap.
- `--radius-small` and `--radius-large` map the global radius settings. Defaults are 1rem/16px for compact panels and 1.875rem/30px for editorial panels, generic cards, and collection/product media. Pills, circles, controls, and special header geometry retain purpose-specific radii.
- Shared interface colors are editable in **Theme settings → Colors — Shared / General Sparklys / Soda / Hard Seltzer** and emitted once by `layout/theme.liquid`. Section-specific color overrides and product artwork retain their own colors.
- `--page-grain-opacity` maps the global grain setting. Its schema default is 30%; saved merchant settings can differ. One document-attached `.page-grain` layer repeats `noise-3.webp` at Retina density and scrolls with the content. Judge grain in standalone preview, not the potentially scaled/overlaid Theme Editor canvas; see [Preview workflow](development.md#preview-workflow).
- Image crops and layered illustrations may retain exact source geometry when it expresses the actual artwork. They must not force page overflow or brittle text positioning.

## Iconography

[Untitled UI Icons](https://www.untitledui.com/icons) is the primary icon library for Sparklys. For every new or replaced UI icon, search this library first and reuse an existing project export where available. Do not draw a substitute or introduce another icon family when a suitable Untitled UI icon exists.

### Shared icon contract

These are design-system decisions for new icon work, not CSS custom properties or a claim that existing icons have already been migrated.

| Role | Value | Contract |
| --- | --- | --- |
| `icon.library` | Untitled UI Icons | First-choice source for interface icons |
| `icon.style` | Line | Default; use another library variant only when the approved design calls for it |
| `icon.viewBox` | `0 0 24 24` | Preserve the original SVG coordinate system |
| `icon.stroke` | 2 source units | Preserve Line geometry, rounded caps and joins; scales with the SVG |
| `icon.color` | `currentColor` | Inherit the control's semantic color and interaction state |
| `icon.size.small` | 1rem | Compact supporting icons |
| `icon.size.default` | 1.25rem | Standard inline actions |
| `icon.size.large` | 1.5rem | Standalone navigation and controls |

Icon dimensions are independent of text-size roles. A small glyph still needs a 44 by 44 CSS pixel primary interaction target. When adding a shared renderer, implement these size roles centrally in `assets/base.css`; do not scatter independent sizes across sections. Preserve explicitly approved artwork and brand/social logos as separate assets rather than forcing them into this UI icon family.

### Finding and adding icons

1. Check existing theme exports, then search the [official SVG catalog](https://www.untitledui.com/free-icons) by meaning and exact icon name. Prefer a consistent variant for repeated actions.
2. Sandro confirms the icons also exist in the Sparklys Figma file. Use the original Figma icon component to export an exact SVG when the website does not expose the needed asset or the approved frame uses a specific variant. If that file is unavailable in a session, request its link/node rather than approximating the icon. Access to the file has not been verified by this documentation change.
3. Import only the icons used by the theme, as local SVG assets or reusable Liquid rendering snippets. Preserve source geometry and use `currentColor` for monochrome inline SVGs. Do not install the React library, an icon font, a remote runtime loader, or the entire catalog.
4. Record the original icon name, variant, source URL or Figma node, and applicable license/notice alongside each imported icon or in its owning documentation. Use the project's licensed source for paid variants and retain required notices.
5. Decorative inline SVGs use `aria-hidden="true"` and `focusable="false"`. Give icon-only buttons/links a translated accessible name on the control; never rely on the glyph or a tooltip alone.
6. If the library has no suitable icon, document the exception and its source in the owning section. Existing icons migrate when deliberately updated, with visual and accessibility verification of the affected journey.

## Notifications

Temporary action feedback uses the shared toast system (`window.SparklysNotifications.show(message, { type, key })`). Use `success`, `info`, `warning`, or `error` and a stable operation key to replace repeated feedback. Never add a new in-flow success/error banner for transient feedback without documenting why it must stay beside the content.

Keep durable information in place: applied coupon badges, discount allocations, shipping eligibility and totals, form labels, validation descriptions, and search/filter result counts. These are state or context, not toast notifications. Native no-JavaScript form responses retain their inline fallback. Errors must retain a field association and visible invalid state where applicable; a toast is not a replacement for validation semantics.

Toasts appear top-center on desktop and across the top with side margins on phones. They use the Small radius, shared Small text role, existing semantic surfaces (Success green, Warning yellow, Error red), soft shadow, and Untitled UI Line status/close icons. Info uses the General Notice surface: no shared blue Info token exists, and the merchant requested reuse of existing colors. Status icons and subtle borders use the matching text role. The scrollable notification layer reserves 32px side and 36px bottom gutters for the shadow, preventing clipping at its own bounds. Close controls have 44px targets. Entry uses the Slow duration and shared easing; dismissal uses a pure opacity dissolve over the shared Slow duration, starting at the currently painted opacity. The final transparent frame is held until removal, and the notification layer stays open while a toast exits. Reduced motion is immediate. Do not steal focus. Live regions announce success/info politely and errors as alerts; temporary feedback must not be announced twice through both inline and toast regions.

Success/info/warning dismiss after five seconds of available reading time. Pause while hovered, keyboard-focused, or the document is hidden. Errors persist until dismissed or superseded. Show at most three active messages; repeated operation keys replace earlier results and identical messages reset their timer. Do not toast every background refresh or quantity update. Dismissal restores focus only if focus was inside that toast.

`assets/notifications.js` owns the shared layer and lifetime rules. Its manual native popover sits in the top layer, reparented into the active dialog so it remains interactive above modal content; a positioned layer is the fallback when Popover API is unavailable. Do not try to solve native modal layering with z-index alone. New features must use this service rather than implementing local toast timers or containers.

Current coverage: cart mutation errors and inventory notices; coupon apply/remove/rejection results; product-add success; newsletter success and server errors. Pending work uses existing busy controls, not toasts. FAQ result counts remain contextual live information. Newsletter native submission and field descriptions remain available without JavaScript.

Verification on 2026-09-08: real coupon success and rejection responses were checked on desktop and phone, including top-layer hit testing above the cart, no in-flow status height, and retained invalid-field association. Browser checks covered timed dismissal, keyboard-focus pause, duplicate replacement, the three-message cap, reparenting on modal close, and immediate reduced-motion dismissal. Newsletter response handling used a local response fixture; no real signup was submitted. Native server response markup is retained; an end-to-end newsletter delivery test remains separate.

New icons are the unmodified `check-circle`, `alert-circle`, and `info-circle` SVGs from `https://github.com/untitleduico/icons/tree/main/icons`, alongside the existing `x-close`; covered by [the retained Untitled UI license](untitled-ui-icons-license.txt). No new JSON-LD entity is appropriate for transient interface feedback.

## Focus styles

Use two shared focus treatments. Pointer/touch editing uses a subtle field-border change with the existing surface unchanged; keyboard navigation uses an immediate, clearly visible accent ring. Focus must not shift layout or use a gray input fill as its only indicator.

The shared CSS tokens are `--focus-ring-width` (3px), `--focus-ring-offset` (3px), `--focus-ring-color` (global Accent), and `--focus-field-border-color` (Primary text). Field borders transition with the Fast duration and shared easing; reduced motion disables that transition. The keyboard ring itself appears immediately.

Native `:focus-visible` remains the no-JavaScript fallback. Text inputs can match that selector even when clicked, so the shared helper in `assets/theme.js` tracks `data-focus-modality` on the root. It starts in keyboard mode; pointerdown selects pointer mode, Tab/Escape select keyboard mode, and navigation/activation keys outside editable fields select keyboard mode. Ordinary typing after a click preserves the quiet pointer treatment. Programmatic focus during cart refreshes inherits the current mode; components must not install competing modality listeners or clear focus to hide a ring.

Standard `.field__input` and `.select` controls darken their border while focused. Quantity inputs retain a transparent background; their controls use an inset ring offset of -3px so the pill does not clip the keyboard indicator. The footer newsletter retains its contrasting composite shell indicator for keyboard focus, without the outer ring on pointer focus. Native radio-chip visual indicators remain on their visible labels.

Verify pointer clicks/taps, typing after a click, Tab and Shift+Tab, keyboard activation, programmatic focus after updates, and the native fallback. Preserve distinct error states and accessible labels. New compound controls must put the keyboard indicator on the visible control without clipping or duplicating it. Scroll containers must reserve room for the full ring and offset inside their clipping boundary; place scrollbars in a separate visual gutter so scrollable content stays aligned with adjacent fixed content.

## Interactive state transitions

Smooth state transitions are the default for screen interactions, not optional polish. When implementing or changing an interaction, proactively inspect how elements enter, leave, update, and move around each other. This applies across the storefront: cart items, recommendations, progress indicators, status messages, variant changes, expandable content, and modal or panel transitions.

Follow the [motion language](architecture.md#motion-language) and shared `--motion-duration-fast`, `--motion-duration-base`, `--motion-duration-slow`, `--motion-ease`, and `--motion-ease-emphasis` tokens in `assets/base.css`. Reuse established component choreography; document a composition-specific timing in the owning section when the shared defaults are insufficient.

- Dissolve departing elements, gently reveal arrivals, and ease surviving elements into their new positions. Crossfade changed messages and interpolate progress or semantic colors when it helps users follow the update.
- Preserve visual continuity across Ajax section replacement and interrupted or repeated actions. Resume from the currently rendered state; do not restart unrelated entrance sequences or flash an intermediate state. Preserve focus and scroll position.
- Keep feedback prompt. Do not delay requests, queue unnecessary animations, or block input solely for decorative motion. Commerce values and success states remain based on Shopify-confirmed responses; failed actions must leave usable content visible.
- Prefer opacity and transforms. Animate necessary height or progress changes narrowly, without page-wide reflow, excessive travel, or new animation dependencies.
- Respect `prefers-reduced-motion`: show the final usable state immediately when motion is reduced. Temporary visual copies must be hidden from assistive technology and cleaned up after transitions.

Verify both directions, rapid repeated actions, interrupted transitions, error recovery, and reduced motion at phone and desktop sizes for the interaction being changed. Check the transition itself as well as the settled layout. This is an implementation and review requirement; do not wait for the merchant to report abrupt updates.

### Server-rendered state changes

Treat semantic transitions as part of the component contract: invalid → valid, valid → invalid, pending → resolved, absent → present and present → absent. A coupon becoming applicable should crossfade its badge and explanation, with a narrow height transition as the explanation disappears. Do not replace an error with success in a single visible frame.

Preserve stable stateful component roots through Ajax section replacement when their inputs and server-confirmed state are managed separately. Compare semantic state before animating: a repeated render or busy-button update must not replay the transition. Never paint a temporary server-only control layout between two enhanced states. Keep authoritative data updates immediate and limit outgoing copies to decoration: inert, hidden from assistive technology, without duplicate active controls, and removed when their transition completes or is superseded. Keep removals in layout long enough to fade and collapse rather than applying `display: none` first.

Review at least one intermediate animation frame, not only before/after screenshots. Include invalid-to-valid and reverse transitions, unchanged refreshes, additions/removals, slow responses, repeated changes, focus retention and reduced motion. Check the surrounding layout for a jump at animation completion. Record the checks in the owning section documentation.

## Review procedure

The initial fluid-role migration was checked in the development storefront at 320, 390, 915 and 1440px. Representative editorial body roles computed to 16, 16, 16.5 and 17px respectively; small Erode card headings shared 32px size/leading at desktop. A 200% root-text check produced 32px body text; full-site enlarged-text certification remains outstanding (the global shell still produces a small horizontal overflow at 390px with a 32px root). Do not claim that relative units alone complete accessibility testing. Standard-size phone/desktop checks showed no page overflow after wrapping the long German Versus heading.

1. Inspect the actual frame's colors, composition, media proportions, and typography.
2. Map typography, spacing, and corners to the existing system. Normalize minor designer inconsistencies instead of copying every number.
3. Preserve distinctive composition, such as comparison fact panels, without inventing a new visual pattern.
4. Verify actual font loading, resolved colors, wrapping, and overflow in desktop and phone previews. Compare the final reveal state, not an animation's partially transparent state.
5. Record deliberate exceptions in the section document and update this guide when a shared token changes.

## Cart supporting quotation

The shared cart empty state uses the existing Erode Bold family for its playful quotation, at the compact role with body-compact leading and muted editorial color. It explicitly permits synthesized italic styling (`font-synthesis: style`) to echo the legacy quotation without adding another font asset. This is supporting copy, not a heading; all Newake/Erode heading rhythm and size rules remain unchanged.

## Shipping progress

Completion meters use the existing global `--color-accent` for their fill and `--color-progress-track` (an alias of Muted surface) for their track. Do not introduce a separate progress-fill color. The cart uses a pill track and shared typography, with server-rendered values; enhanced updates smoothly interpolate confirmed progress and color and crossfade changed messages, respecting reduced motion. The cart-specific darker track and qualified Success color are documented below. No new heading or icon role is introduced.

## Theme color settings

Theme settings groups colors by ownership:

- **Colors — Shared**: primary and second accents, hover surfaces and success/error text/background pairs.
- **Colors — General Sparklys**: neutral shared-page palette, including the cart.
- **Colors — Soda**: beige/cream surfaces and warm supporting/notice text.
- **Colors — Hard Seltzer**: white/gray surfaces and neutral supporting/notice text.

Each world exposes Backgrounds, Text colors and Notice colors. The world roles are page background, surface, muted surface, supporting surface, dark surface, primary text, inverse text, secondary text, muted text, notice text and notice surface. Keep foreground/background pairs legible when editing. The shared accent continues to drive shipping progress and focus. General and Hard Seltzer notice text defaults to `#9e9e9d` (RGB 158, 158, 157). Soda preserves the merchant's saved `#D1CAB6` notice color; fresh installs retain its warm default. General and Hard Seltzer default to neutral white/gray backgrounds; Soda retains the beige page and cream supporting surface.

`snippets/color-palettes.liquid`, included in the layout's style block, emits saved palette values and binds them to semantic `--color-*` roles. Existing `brand-context` resolution sets `data-color-world` on the document: `default` maps to General, with Soda/Seltzer following the real page/product/collection context. No session or client-side world inference is needed. The theme-color metadata follows the same page background.

The second accent (`color_accent_secondary` / `--color-accent-secondary`) defaults to `#FF6600` across all worlds. Its current scope is the header cart-count circle and crossed-out original prices in product cards, the PDP (including subscription comparisons), and both cart surfaces. Original prices use full opacity so the token stays consistent. Primary accent continues to own focus, shipping progress, savings badges and other existing uses. Saved editor settings are not migrated by adding this default.

Explicit Soda sections (Ingredients, 3 Reasons, Soda Versus, Subscription, USP and product-overview cards) select Soda even on General pages. Explicit Hard Seltzer counterparts select Hard Seltzer. Unclassified sections inherit the page. `.cart-page` and `.cart-drawer` explicitly bind General in every world. Header and footer inherit page context. New world-specific sections must declare `data-color-world="soda"` or `"seltzer"`, or be added to the central selector map; shared sections should inherit.

Rebind compatibility aliases at every world boundary: editorial heading → primary text, editorial muted → muted text, progress track → muted surface. Defining aliases only at the root would freeze them to the root palette when inherited. Components consume semantic roles, never another world's raw settings. Both Versus variants use their world's Notice text for disclaimers.

The previous flat world-dependent settings have been migrated into explicit world settings, preserving saved Soda choices and common text/surface values. Shared setting IDs remain unchanged. This is a one-time saved-data migration, not an ongoing synchronization between worlds.

Photography, exported logos/SVG artwork, flavor gradients, blue Soda compositions, green comparison highlights, and explicit section color settings remain intentional exceptions. Global palettes do not recolor image pixels or override merchant-saved section colors. Physical shadows/image overlays may retain black. Button/text-link labels retain the existing difference-blend sweep effect; inspect hover/focus on edited palettes. Color controls do not enforce contrast automatically. No entity data or JSON-LD changes are introduced.

The cart shipping meter is enclosed in a centered Muted surface panel, switching to shared Success surface/text when qualified. Its track uses Surface for separation from the panel while retaining the global Accent fill. User-requested decorative 📦 / ✌️ / 🥳 emojis accompany the translated state text.

`--radius-compact` is the shared 0.5rem/8px radius for dense supporting surfaces, currently cart panels, product image tiles and applied-code rows. It complements the merchant-configured Small and Large roles without changing controls or pill geometry.

The shipping progress panel uses General Warm surface (`--color-surface-warm`, currently #f2f2f2) for a lighter neutral gray than Muted surface. The qualified state continues to use shared Success surface/text.

Cart icon exports: Untitled UI Line trash-01 and tag-01 from the official untitleduico/icons repository, original 24px viewBox and 2-unit stroke retained; local CSS masks inherit semantic colors. License: [Untitled UI terms](untitled-ui-icons-license.txt). Shared Success text default is now #287a50; Warning surface/text are merchant-configurable status tokens (#fff3cd / #664d03). Cart supporting totals use Notice text.


## Global font smoothing — approved default, 2026-09-07

Approved by the merchant after visual review, `html` applies `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` globally, inherited by storefront text including the cart drawer. Component-level duplicates have been removed; keep these declarations on `html` only unless a deliberate rendering exception is documented. Keep this as the default for all storefront typography. It affects optical rendering without changing font families, weights, sizes or heading rhythm; synthetic bold remains disabled. These nonstandard hints primarily affect macOS rendering and may be ignored elsewhere. Inspect small/light supporting text as well as bold labels on actual target devices; do not assume this fixes incorrect font loading or guarantees identical rendering across systems. Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-smooth.

Cart allocation micro-badges use the existing Badge typography role. Coupon removal uses Untitled UI Line x-close, sourced from https://github.com/untitleduico/icons/blob/main/icons/x-close.svg and covered by the retained Untitled UI license.

Cart annotation follow-up (2026-09-07): subtotal and shipping supporting rows now use the General Primary text role, superseding the earlier Notice-text treatment. Savings retains Success text and struck-through original prices retain Notice text. Tag icons inside item allocation micro-badges scale to 1.2em (12px with the 10px Badge role); other tag icons retain the shared 1rem size.

Shared button Bubble Sweep uses a translated oval (180% width, 300% height) clipped by the button, replacing the animated circular clip path. Only its transform animates, with 480ms entry, 360ms exit and `cubic-bezier(0.22, 0.61, 0.36, 1)` easing. CSS transitions reverse from the current position when interrupted. The final position covers wide, narrow and multiline buttons. Colors, permanent border, blend labels, hover/focus and reduced-motion behavior remain shared. On coarse pointers, Small buttons use an opacity fade so their unclipped 44px expanded touch target remains available. The local Design Studio provides timing, width, easing, replay and reduced-motion controls plus experimental wave and previous-circle comparisons; these experiments do not change storefront defaults.


## Newake optical alignment beside icons

Newake’s uppercase ink sits above the geometric center of its line box. Measured in the drawer at 31.09px: font ascent/descent 24px/6px, visible capital ascent/descent approximately 22.34px/0.55px, giving an ink-center offset near -1.90px. The shared `--font-optical-offset-newake: .06em` compensates downward when Newake is paired with a centered icon, currently the cart drawer title. Apply this optical role only to such lockups after visual review; it is not a global shift of headings. Keep the shared .95 line height unchanged. Selection rectangles show font boxes, not glyph bounds, and cannot establish optical alignment by themselves.

The merchant approved the drawer’s optical alignment after visual review. Proactively inspect Newake whenever it appears beside an icon, another font, a control, or other UI elements, including inside buttons. Judge visible letterforms against adjacent artwork rather than selection rectangles. Reuse the shared optical-offset role when needed, and verify the composition at phone and desktop sizes without waiting for annotation feedback. Ordinary standalone or multiline headings should not receive this adjustment automatically.

Shipping progress uses global Accent while incomplete and shared Success text green for the completed/free-shipping fill. The message retains its normal text color and the surrounding light-gray surface is unchanged.

The cart shipping track uses General Notice text (`--color-notice-text`, default #9e9e9d) as its darker unfilled gray, improving separation from the light panel. Accent and qualified Success fills are unchanged.

Free-shipping remaining messages use whole CHF rounded up; exact cents still drive eligibility, progress, prices and totals.

### Shared small buttons — 2026-09-08

`.button` uses `--button-height-regular: 3rem` and `--button-padding-regular: .75rem 1.35rem`. `.button--small` uses `--button-height-small: 2rem` (32px), `--button-padding-small: .375rem .625rem`, and the existing Small font-size role. This is deliberately smaller than the 48px Regular surface. Both share the same border, pill shape, Bubble Sweep, focus, disabled, and reduced-motion behavior. Small buttons are content-width on cart recommendation cards. On coarse pointers, a transparent pseudo-element extends the hit area by 6px above and below to at least 44px without enlarging the visible surface. Keep at least 12px between two small buttons stacked vertically so their expanded targets do not overlap. Product titles on these cards reuse `.cart-line__title` (Maison Neue Bold, Body role, compact body leading), without underlines. Variant chips use the Small font role, Compact radius, neutral color roles, and 44px hit targets; the selected chip is inverse, unavailable variants are disabled and struck through, and keyboard focus remains visible.

The recommendation heading card is removed; the aside retains its translated accessible name. Product cards start at the top of the desktop column. The native cart backdrop applies an 8px Gaussian blur alongside its existing dark scrim, animating both from transparent/unblurred over 500ms and back over 400ms with the existing slide motion. Close captures the currently rendered backdrop values to avoid a jump when interrupted during entry; reopening during exit resumes from its current backdrop. Reduced motion disables animations, and browsers without backdrop-filter retain the dark scrim.

Cart recommendation chips use compact 32px visual bounds, the existing Small type role and Compact radius. Coarse-pointer labels add hit padding to reach 44px in both dimensions; adjacent chip spacing provides separation. The shared Small purchase button can combine a dynamic price and action separated by a middle dot.

Recommendation buttons use the merchant-approved German action “Einpacken” and a single-line compact CHF price: integer francs render as `CHF 39`, fractional amounts retain their exact cents (for example `CHF 29.40`). The button reads `CHF 39 · Einpacken`; the earlier `39.-` format was rejected. This formatter is limited to recommendation buttons and their variant data; ordinary cart money remains unchanged, and other currencies retain the shared currency-aware formatter. The existing Label font role remains unchanged.

On modal entry, recommendation cards fade and slide downward from 12px above their resting position over 550ms after a 400ms delay, staggered by 90ms per card with the index capped at six so long lists are not delayed indefinitely. The main cart starts immediately. Section replacements during entry preserve the original animation timeline; ordinary cart updates do not replay it. Reduced motion shows cards immediately. Verified desktop and phone single-line labels, 104px images, compact chips, staged opacities and no replay after refresh.

## Product image fidelity

Always preserve original product image colors and transparency. Do not apply blend modes, color filters, or opacity treatments to remove or normalize embedded image backgrounds. The merchant prepares those backgrounds and transparent areas in the source assets. Do not add a dedicated background surface behind cart or recommendation product images. Backgrounds are controlled by the supplied image itself; opaque white remains white and transparent areas reveal the surrounding layout.

## Guided document entry

When a form maps to a physical document, place the real labeled controls inside the schematic at the corresponding reading positions. Do not duplicate inputs in a separate form below the image. Use shared UI type, small labels, compact control radii and the small panel radius. Decorative document art may show masked lines and abstract portraits; it is not a source of data or a functional UI icon. On phones, wrap complete field groups inside the document, preserving their reading order and 44px targets. Never make users type into tiny scaled image coordinates. Keep the entire form accessible (no aria-hidden ancestor), provide field-specific text guidance, preserve values on visual-version changes, and use the motion framework for the transition. Additional data that is not in the code zone must be labeled with its actual source location.

### Document-code input typography

Age-verification document inputs use the system stack `Courier, "Courier New", monospace`, as requested for MRZ entry. This is a functional monospace exception for input values, placeholders and adjacent fixed document-code characters; labels keep the body/UI family and sizes keep shared typography roles. No external font asset is loaded.

Swiss ID composition: use the shared Warm surface and Compact radius for its padded outer panel. The card combines the cropped upper illustration with a responsive HTML code grid; cap its width at 37.5rem on desktop and 21.25rem below 600px, constrained to available space. Reflow complete field groups without scaling typography or touch targets. Conditional full-year clarification belongs below the card within the panel. This UI guide introduces no entity content or applicable new JSON-LD.

Swiss ID code text and inputs select the shared Compact role (18–20px), while accessible labels and other document profiles retain their existing roles. Fixed code characters, filler runs and the localized example name line use Primary text. Surplus decorative fillers are clipped to their grid tracks; input controls and their keyboard rings remain unclipped.

### Swiss ID code typography exception — 2026-09-09

Explicit merchant approval decouples the Swiss ID code rows from shared typography roles. Only `.age-document[data-profile="ch-id"]` owns `--age-document-type-size` (1.5rem desktop; 1.25rem below 600px), `--age-document-type-family` (Courier stack), `--age-document-type-leading` (1.15), and input padding tokens (.25rem block, .375rem inline). Both real code inputs and decorative code characters use these tokens. All code inputs center their values consistently, including single-character controls with 44px bounds. This supersedes the earlier Compact assignment. Shared labels, modal copy, year clarification, focus, reduced-motion behavior and other profiles retain their current contract. The checker permits only `var(--age-document-type-size)` as this new font-size exception in base.css; ordinary theme type roles remain enforced.

The document-specific `--age-document-letter-spacing: .1em` applies the merchant-requested 10% tracking to fixed characters and entered values. Desktop code lines use 3:2 tracks to accommodate complete date values at 24px with tracking; narrow cards continue stacking complete groups.

Age-check annotation refinements (2026-09-09): persistent privacy notice has an approved scoped blue pair (#eaf4ff / #164b76); shared Info toast colors are unchanged. The Help pill uses white inverse text and an accent-derived surface mixed with 12% black for contrast. Untitled UI Line help-circle and arrow-left are sourced unchanged from https://github.com/untitleduico/icons/blob/main/icons/help-circle.svg and https://github.com/untitleduico/icons/blob/main/icons/arrow-left.svg, under the retained Untitled UI license. Normal document card and help image share 0 3px 8px black/6% plus 0 12px 24px -10px black/22% shadows. Document filler counts adapt to actual glyph advances and never intentionally clip a partial character.

### Passport artwork typography exception

The merchant-approved Swiss ID artwork exception also applies to TD3 passport code fields: shared document-only Courier tokens, 24px desktop / 20px phone, 0.1em tracking, centered characters and equal compact padding. Complete groups wrap at narrow card widths; ordinary theme typography remains unchanged. The card caps at 600px desktop and 340px phone and retains 44px input heights and shared focus/motion behavior.

## Form control baseline

The opt-in [form baseline](forms.md) defines reusable field and choice tokens from the approved Figma references: pill single-line controls, Large-radius textareas, rounded dropdowns, native radio circles and ticked checkboxes. `assets/forms.css` and `assets/forms.js` now style cart coupon fields and the age-check document selector; other controls remain opt-in while the merchant tunes the local studio. Use the shared focus, typography, semantic-color and motion contracts; adopt the baseline on real journeys only after review, preserving the MRZ artwork exception.

## Control outlines and field text — 2026-09-09

`--control-outline-width: 3px` is the shared permanent outline for regular/small buttons and cart quantity capsules, and the source for `--form-control-border-width`. Focus rings remain a separate accessibility role. Borderless icon actions retain their composition.

Normal input, textarea and native/enhanced dropdown values and options use `--field-font-family: var(--font-body)` and `--field-font-weight: 400`. Do not inherit bold label/container styling into editable values. Labels and button text may retain their existing emphasis. Document artwork keeps its scoped Courier family and regular weight. The local studio consumes the same tokens.

Toast close states (2026-09-09): close icons inherit the toast status color. Hover and keyboard focus use a 12% status-color mix into that toast’s surface, keeping error, warning, success and info feedback coherent. The shared Fast transition, focus ring and reduced-motion treatment remain in place.

Warning toasts use the unmodified Untitled UI Line `alert-triangle.svg` from the official icon repository, under the retained Untitled UI license. Errors retain `alert-circle`. Stock-limit adjustments use warning semantics and the existing five-second timer with hover/focus pause.

### Product detail composition — 2026-09-11

The PDP reuses Display/Section/Compact/Body/Small roles and shared form, choice, quantity and button primitives. Known Hard Seltzer flavour headings are existing SVG artwork with an accessible HTML title; this is an artwork exception, not another text-size role. Standalone Newake titles retain their shared rhythm; adjacent UI uses Maison Neue and needs no Newake optical correction.

Product frequency fields and benefit disclosures animate measured heights and opacity, resume from the current painted state on reversal, and retain native controls when JavaScript is absent. Price labels crossfade only when their text changes; authoritative values and form submission update immediately. Badge rotation has a pause toggle, visibility suspension and reduced-motion stop.

## Responsive section visibility

Section visibility uses the shared [768px visibility contract](sections/README.md#breakpoint-visibility). Hiding removes the complete Shopify wrapper from layout and focus navigation. Breakpoint changes are immediate to avoid ghost content and delayed input availability; internal reveal and interaction motion remain governed by the existing framework. Theme Editor placeholders use shared body, small-text and muted-surface roles.

## Page introductions

Plain page and native policy H1s, plus editorial Page intro H1s, select the shared Display role. Intro paragraphs use Body with compact leading; long-form page/policy copy uses Body with reading leading. All inherit the established page brand heading family, weight and line height. Decorative Arc artwork uses the exact Figma SVG; no artwork text is substituted for the accessible H1. See [Page intro](sections/page-intro.md).

### Content-to-footer spacing

`#MainContent` adds bottom padding using the shared `--section-padding-block` role (32–64px), so every page has a consistent buffer before the footer even when its final section has no outer spacing. This belongs to the page content and uses its background. Existing section padding remains internal to each composition; footer padding remains internal to the footer. No responsive visibility, motion, semantics or commerce behavior changes.

## Page background ownership — 2026-09-12

The document background is separate from brand section palettes. `layout/theme.liquid` resolves one `--color-page-background` and the matching `theme-color` metadata server-side:

- Default, including ordinary pages, policies, cart and search: `#F2F0E9`.
- Homepage and all collection pages (including Soda, Hard Seltzer and unclassified collections): `#FFFFFF`.
- Every product page: existing `custom.soda_background_color`, falling back to `#FFFFFF` regardless of product world.

The root canvas and PDP section consume this same role. Transparent content and the main-content bottom buffer reveal it, so product colors extend beyond the top section. Existing palette background setting IDs/values remain intact, now labeled **Section background** to clarify their scope. Explicit section/card backgrounds, gallery gradients and intentional surfaces retain their own colors. This supersedes previous statements that brand palette background settings control the page canvas. No new metafield or saved-setting migration is needed.

## Editorial heading font selection

Erode is the default for new heading-bearing sections and theme blocks, independently of brand world. Newake remains selectable. `heading-font.liquid` scopes the choice to the Shopify section wrapper; native blocks use `data-heading-font`. Shared rules in `base.css` apply the nearest choice only to H1–H6, including rich-text headings. Legacy saved selector values remain supported. Family, weight, tracking and rhythm switch together; size roles do not change. Maison Neue remains the paragraph, field, button and ordinary UI face, with Maison Neue Bold for deliberate emphasis such as FAQ questions.

The narrowly targeted shared heading declarations override legacy component font declarations centrally; do not add competing heading-family overrides. Brand colors, background and logo selection remain independent. SVG flavour titles/logos are artwork and are not re-typeset by this control. The approved Soda 3 Reasons composed numeral lockup and small Erode card rhythm remain documented composition exceptions. Newake optical adjustment remains limited to inspected adjacent-UI compositions, and resolves to zero for Erode.

The local Design Studio loads Erode and uses this same default. Merchant images in the new editorial blocks use Shopify focal points and shared radii; Sidebar Box has Compact/Tall configurations, while Link Box remains a separate navigation primitive. Reuse the same FAQ disclosure controller for embedded and standalone lists; no independent accordion timing is introduced.

FAQ disclosures capture their currently rendered frame when reversed, and track the requested state while closing. Native `open` remains set during a closing animation so the content can animate; it is removed on completion. Reduced motion settles immediately to the requested state. Reusing the component also reuses this interruption contract.

Legacy token names `--font-heading-default` (Newake) and `--font-heading-soda` (Erode) remain family aliases for compatibility; neither now decides the default based on brand world. The `--heading-choice-*` roles are the authoritative heading selection contract.

## Merchandising typography exclusions

Product overview teaser, Offer cards, USP (both variants), Subscription (both variants), Versus (both variants), Soda 3 Reasons, Soda Ingredients, Hard Seltzer Ingredients and Hard Seltzer Awards retain their typography from before the broad heading-font rollout. Their Shopify wrapper uses `heading-font-legacy`, which excludes descendants from editorial font overrides and restores the original brand-aware inherited heading tokens. Their explicit composition styles remain authoritative, including Maison Neue comparison-card headings and Erode/Newake brand differences. Original USP/Subscription font selectors remain available with their original Automatic defaults; the newer global selector is not added to these sections.

Other editorial sections retain Erode-default heading selection, including rich-text headings. The exclusions are deliberate composition contracts, not an invitation to add broad competing `!important` rules.

### Reviewed interaction refinements (2026-09-12)

Pill buttons retain difference-blend labels; the current oval sweep and timing are defined above (updated 2026-09-14). Hover and keyboard focus share the treatment; reduced motion retains the existing immediate-state fallback. Cart line removal uses the secondary accent on hover/focus, plus one short 320ms icon nudge for fine-pointer hover; no motion under reduced motion. Payment-brand artwork uses a 5px corner radius, explicitly approved as an artwork exception rather than a card-radius token.

Footer navigation card titles are a fixed Newake composition. `.site-footer__card-heading` uses the shared Newake heading-choice mapping in every brand context, independently of editorial section font selection.

## Shared collection cards — 2026-09-15

All-products and dedicated collections must share `catalog-product-card` and `catalog-products` through the existing `product-card` entry point until a deliberate, documented split is approved. Brand identity changes artwork and heading family within that shared contract. Catalog card headings preserve the merchandising font family independently of the surrounding editorial heading choice. Use the Card role and shared font-specific leading; never introduce local type scaling to fit labels. See [Collection](sections/main-collection.md).

Collection hero ambience animates transforms of separate artwork layers, never blur radii or layout. Pause off-screen/in hidden tabs, respect reduced motion and retain a complete static composition. See [Collection hero](sections/collection-hero.md).

Main navigation uses the shared card renderer/styles with a navigation presentation (uppercase Card title role, full-bleed cover imagery and light bottom overlay, no offers). Shell motion uses Slow; the navigation pill uses its documented 480ms travel; category/accordion and panel-height changes use Base. Navigation-only choreography uses a 40ms card stagger capped at 160ms with no pill deformation; these are not new global defaults. The pill travels behind stationary difference-blended labels on a white backing, with keyboard focus separate from selection. Reduced motion removes the choreography. The [Header contract](sections/header.md#main-navigation--local-implementation-2026-09-15) owns lifecycle and verification.

The `/collections` directory follows the white collection-page background rule alongside individual collection pages. Its collection entries reuse the Poster composition and motion rather than introducing a second poster style.

## Button outline continuity

Regular buttons paint their existing border above the hover sweep using a noninteractive overlay; its width/color share the normal control tokens. `button--inverse` provides an inverse-text border on dark artwork, including light Poster actions. `button--embedded` is for actions integrated into an input shell: its permanent border uses `--button-embedded-border-color`, falling back to the shared surface color. The newsletter uses this white border at rest, throughout hover and on exit, so the button stays inset within the white input. Small buttons keep their existing expanded-hit-area pseudo-element. Verify outline contrast before, during and after hover/focus; the sweep must not obscure it.

Embedded action refinement (Ananotes 128): the white shell-colored outer border is paired with a permanent foreground inner ring (`--button-embedded-inner-border-color`). At rest that inner ring merges with the black fill; during the white sweep it provides the missing contrast. Both rings use the shared control outline width and paint above the sweep.

Navigation pill composition exception (Ananotes 129): interpolate the absolutely positioned pill's width/height alongside translation rather than scaling a fixed rectangle, preserving circular endcaps. This decorative box does not participate in layout. Keep it above the white navigation backing and below the blended labels. A 140ms exit grace period bridges short pointer gaps, followed by a Fast fade; reentry continues from the current painted bounds. Reduced motion settles immediately.

Navigation category highlights reuse the root navigation travel duration (480ms) and shared easing, with a lighter hover surface than the selected category. Pointer hover is decorative and never changes expanded content. Root labels blend with the actual header surface, not a separate white rectangle. Carets retain the library's padded 24-unit viewBox so intrinsic tight crops cannot enlarge or distort the glyph.

## Shared can floor shadows

Use `snippets/can-shadow.liquid` and `assets/can-artwork.css` for every grounded Soda/Hard Seltzer can composition. This extracts the approved Product Overview treatment: directional shadow with progressively blurred layers, flavour-aware colour and the existing 0.6 brightness. It is not a card box-shadow or an all-around image drop-shadow.

`can-artwork.css` is the single tuning point for strength, brightness, flavour colours, brand-relative position and width. The two existing SVG masks (`shadow-soda.svg`, `shadow-seltzer.svg`) own each brand's progressive blur geometry; flavour variants share those masks and receive colour in CSS. Do not add per-section shadow copies, filters or fixed pixel offsets. Pass the brand and artwork/product identity to the snippet; keep its aria-hidden, pointer-transparent output beneath the image in a wrapper matching the contained image's aspect ratio. Animate the complete image/shadow wrapper so the can remains in contact with its shadow. Reduced motion keeps the group static.

Product Overview, grounded shared collection cards and drink-product navigation cards use this primitive. Their layout/placement remains owned by each composition; Product Overview no longer needs the former Seltzer transparent-margin correction after the tightly trimmed asset replacement. The Seltzer mask anchors its ellipse centre through the shared contact token, with the merchant-approved top position at 98.7% of the artwork height. Floating hero cans and the tilted paired-can collection artwork have no ground plane and intentionally omit floor shadows. Complete promotional photos/PDP gallery photography retain their own lighting. An opaque upload or a shadow baked into an image cannot be removed or calibrated by this primitive; use a transparent, closely bounded can image for independently adjustable lighting. Navigation still prefers the merchant teaser image, then the first gallery image.

Product navigation Soda logos and flavour titles are an artwork composition: reuse `--line-height-flavor-lockup` (0.75) beside the logo, with the regular shared Card font-size. The centered group fits its visible title width rather than reserving an empty flexible text column. This named composition exception does not change editorial heading rhythm or introduce a new font-size role.

Uploaded navigation artwork can opt into `can-artwork[data-auto-fit]`: the shared helper measures visible alpha bounds once on load, then sizes the complete image and its floor wrapper together. This avoids per-product pixel offsets for padded merchant uploads. Opaque images and failed/unavailable alpha inspection retain their own lighting with no synthetic floor. CSS sizing remains responsive; reduced-motion treatment still applies to the whole group.

Navigation review 143–148: root carets use the shared padded Untitled UI asset at 16px; the resting desktop pill returns to the current Shopify menu ancestor after transient hover/focus. The pill has one painted surface and device-pixel-aligned settled bounds, retaining smooth interrupted motion. Product name wrapping and full-image containment follow the Header contract.

**Approved composition exception — Soda collection hero (Ananotes 149):** Figma `8734:14210` uses Erode Bold at 75px with 62px leading. The hero retains the shared Display size and applies `--soda-hero-heading-leading: calc(62 / 75)` only for its Soda/Erode composition. General Erode remains 0.9 and explicit Newake uses its normal rhythm.

Ananotes September 16: the cart drawer title always uses the central Newake heading mapping and optical offset, regardless of surrounding editorial font choices. Notifications are horizontally centered in the viewport using symmetric fixed insets and automatic margins, preserving the native top-layer host, mobile gutters, timers and accessible announcements. Product Overview uses a non-scrolling 2×2 compact grid; its existing artwork exception retains brand/flavour lettering, with the shared Compact role on phones.
