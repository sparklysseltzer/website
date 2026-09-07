# Design system

The implementation follows the approved visual intent while normalizing inconsistent measurements between design frames. Read this before styling a new section or changing an existing one.

## Typography

### Shared fluid roles

Maison Neue Demi (registered at weight 400) is the standard body/UI face. Maison Neue Bold supplies explicitly emphasized UI such as FAQ questions. General/Hard Seltzer display headings use Newake; Soda display headings use Erode Bold. Small Soda editorial card titles also use Erode, while footer card headings deliberately use Newake in every world. Semantic heading level alone does not select a visual size or override an explicit section role.

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

Approved artwork exceptions remain the Soda 3 Reasons numeral lockup and Product Overview flavor lettering (including its existing container-based scaling). They are explicitly allowlisted in `scripts/check-typography.mjs`; do not extend the allowlist to bypass a layout problem. SVG logo dimensions are artwork geometry, not CSS body typography.

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
| `--line-height-flavor-lockup` | `0.75` | Previously approved Product Overview Soda flavor lettering |

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
- `.section` and its compatibility alias `.section--tight` share `clamp(2rem, 5vw, 4rem)` vertical padding (32–64px per side at the usual root). Do not introduce a looser default section gap.
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

Completion meters use the existing global `--color-accent` for their fill and `--color-progress-track` (an alias of Muted surface) for their track. Do not introduce a separate progress-fill color. The cart uses a pill track and label typography, with server-rendered values and no animation, respecting reduced motion. No new heading or icon role is introduced.

## Theme color settings

Theme settings groups colors by ownership:

- **Colors — Shared**: accent, hover surfaces and success/error text/background pairs.
- **Colors — General Sparklys**: neutral shared-page palette, including the cart.
- **Colors — Soda**: beige/cream surfaces and warm supporting/notice text.
- **Colors — Hard Seltzer**: white/gray surfaces and neutral supporting/notice text.

Each world exposes Backgrounds, Text colors and Notice colors. The world roles are page background, surface, muted surface, supporting surface, dark surface, primary text, inverse text, secondary text, muted text, notice text and notice surface. Keep foreground/background pairs legible when editing. The shared accent continues to drive shipping progress and focus. General and Hard Seltzer notice text defaults to `#9e9e9d` (RGB 158, 158, 157). Soda preserves the merchant's saved `#D1CAB6` notice color; fresh installs retain its warm default. General and Hard Seltzer default to neutral white/gray backgrounds; Soda retains the beige page and cream supporting surface.

`snippets/color-palettes.liquid`, included in the layout's style block, emits saved palette values and binds them to semantic `--color-*` roles. Existing `brand-context` resolution sets `data-color-world` on the document: `default` maps to General, with Soda/Seltzer following the real page/product/collection context. No session or client-side world inference is needed. The theme-color metadata follows the same page background.

Explicit Soda sections (Ingredients, 3 Reasons, Soda Versus, Subscription, USP and product-overview cards) select Soda even on General pages. Explicit Hard Seltzer counterparts select Hard Seltzer. Unclassified sections inherit the page. `.cart-page` and `.cart-drawer` explicitly bind General in every world. Header and footer inherit page context. New world-specific sections must declare `data-color-world="soda"` or `"seltzer"`, or be added to the central selector map; shared sections should inherit.

Rebind compatibility aliases at every world boundary: editorial heading → primary text, editorial muted → muted text, progress track → muted surface. Defining aliases only at the root would freeze them to the root palette when inherited. Components consume semantic roles, never another world's raw settings. Both Versus variants use their world's Notice text for disclaimers.

The previous flat world-dependent settings have been migrated into explicit world settings, preserving saved Soda choices and common text/surface values. Shared setting IDs remain unchanged. This is a one-time saved-data migration, not an ongoing synchronization between worlds.

Photography, exported logos/SVG artwork, flavor gradients, blue Soda compositions, green comparison highlights, and explicit section color settings remain intentional exceptions. Global palettes do not recolor image pixels or override merchant-saved section colors. Physical shadows/image overlays may retain black. Button/text-link labels retain the existing difference-blend sweep effect; inspect hover/focus on edited palettes. Color controls do not enforce contrast automatically. No entity data or JSON-LD changes are introduced.

The cart shipping meter is enclosed in a centered Muted surface panel, switching to shared Success surface/text when qualified. Its track uses Surface for separation from the panel while retaining the global Accent fill. User-requested decorative 📦 / ✌️ / 🥳 emojis accompany the translated state text.

`--radius-compact` is the shared 0.5rem/8px radius for dense supporting surfaces, currently cart panels, product image tiles and applied-code rows. It complements the merchant-configured Small and Large roles without changing controls or pill geometry.

The shipping progress panel uses General Warm surface (`--color-surface-warm`, currently #f2f2f2) for a lighter neutral gray than Muted surface. The qualified state continues to use shared Success surface/text.
