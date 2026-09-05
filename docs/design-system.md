# Design system

The implementation follows the approved visual intent while normalizing inconsistent measurements between design frames. Read this before styling a new section or changing an existing one.

## Typography

### Shared fluid roles

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

- Editorial headings in the ingredient, reasons, awards, and comparison frames are black. Product-world font selection must not implicitly recolor them green.
- `--color-editorial-heading` and `--color-editorial-muted` provide black and the shared brown supporting-copy color (`#786e5b`).
- Intentional variant colors stay scoped: Versus uses cream cards/brown facts for Soda and white cards/gray facts for Hard Seltzer. Green identifies the highlighted Sparklys facts, not all Sparklys text.
- Preserve the existing shared section rhythm, page gutters, and small/large radius tokens documented in [Architecture](architecture.md). Use the matching shared token before introducing a custom measurement.
- Image crops and layered illustrations may retain exact source geometry when it expresses the actual artwork. They must not force page overflow or brittle text positioning.

## Review procedure

The initial fluid-role migration was checked in the development storefront at 320, 390, 915 and 1440px. Representative editorial body roles computed to 16, 16, 16.5 and 17px respectively; small Erode card headings shared 32px size/leading at desktop. A 200% root-text check produced 32px body text; full-site enlarged-text certification remains outstanding (the global shell still produces a small horizontal overflow at 390px with a 32px root). Do not claim that relative units alone complete accessibility testing. Standard-size phone/desktop checks showed no page overflow after wrapping the long German Versus heading.

1. Inspect the actual frame's colors, composition, media proportions, and typography.
2. Map typography, spacing, and corners to the existing system. Normalize minor designer inconsistencies instead of copying every number.
3. Preserve distinctive composition, such as comparison fact panels, without inventing a new visual pattern.
4. Verify actual font loading, resolved colors, wrapping, and overflow in desktop and phone previews. Compare the final reveal state, not an animation's partially transparent state.
5. Record deliberate exceptions in the section document and update this guide when a shared token changes.
