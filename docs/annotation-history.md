# Annotation history

Archive of approved onUI fixes. Save the original comment, annotation ID, affected section, implementation summary, approval date, and commit reference before deleting an annotation from the canvas. Delete only the approved IDs, never indiscriminately clear a page that may contain new feedback.

Keep durable implementation rules in the [design system](design-system.md) and owning section documents. This history records decisions; it is not a restorable backup of onUI's complete annotation metadata.

## 2026-09-05 — Homepage visual corrections

Page: `http://127.0.0.1:9292`.

All seven fixes were approved for archival and removal by the user and removed from onUI. Implementation commits: `15048b6` (shared typography and heading rhythm), `a91aac9` (ingredient/reason compositions and award exports), and `cca30d7` (Subscription account-link spacing).

### Soda 3 Reasons — composed headline

- Annotation ID: `1788625983351-dbiuidutb`
- Original comment: “alignment not good, check with figma”
- Target: large numeral and two-line `.soda-reasons__heading` (original rectangle: x646.43, y8481.82, width502.63, height173.37).
- Fix: aligned the final text baselines and matched the reference lockup: 82px words / 62px line height beside a 192px numeral, scaling proportionally. Documented the explicitly approved composition exception without changing global display typography.
- Reference: [Soda 3 Reasons](sections/soda-three-reasons.md).

### Hard Seltzer Ingredients — headline alignment

- Annotation ID: `1788631813830-c6sz8m18n`
- Original comment: “move a bit down, vertically align to the 3”
- Target: `h2.seltzer-ingredients__heading > span:nth-of-type(2)`.
- Fix: centered the composition across breakpoints and applied a font-relative `.08em` optical offset to the words beside the outlined numeral. Kept the shared Newake line height.
- Reference: [Hard Seltzer Ingredients](sections/hard-seltzer-ingredients.md).

### Soda 3 Reasons — leaf illustration

- Annotation ID: `1788631934537-5a4fu0fpi`
- Original comment: “image is like 2 layers and wrong, export freshly from figma as one svg and correct it”
- Original target: `span.soda-reasons__leaf > img:nth-of-type(1)`.
- Fix: replaced the independently positioned layers with the complete `soda-reason-leaf.svg` export, preserving the source mask, rotation, and offsets. No grain was baked into the asset.
- Reference: [Soda 3 Reasons](sections/soda-three-reasons.md).

### Hard Seltzer Awards — cropped shadows

- Annotation ID: `1788631985886-wgow524hq`
- Original comment: “shadows of the award images are cropped in export, freshly export from figma and respect the shadows look theyre not cropped”
- Target: `div.seltzer-awards__inner.page-width`.
- Fix: re-exported all three complete medal compositions at 3× resolution with full shadow bounds and transparent backgrounds. Converted to WebP with lossless alpha and updated intrinsic dimensions. Transparent overlapping margins no longer cover adjacent shadows with white rectangles.
- Reference: [Hard Seltzer Awards](sections/hard-seltzer-awards.md).

### Soda 3 Reasons — card-title line height

- Annotation ID: `1788634787670-vj965d3ca`
- Original comment: “lineheight not good, use design token centrally for lineheight also here, make sure letters dont overlap (refer figma)”
- Target: `article.soda-reasons__item:nth-of-type(2) > h3`.
- Fix: mapped every reason-card title to the central small-Erode heading role (`--line-height-heading-small-erode: 1`), giving 32px type / 32px leading at desktop instead of tight display leading.
- References: [Design system](design-system.md), [Soda 3 Reasons](sections/soda-three-reasons.md).

### Subscription — account-link spacing in both worlds

- Annotation ID: `1788634893861-l4j5v15j1`
- Original comment: “change lineheight, use design tokens also here, refer to figma. also do it for our seltzer subscription section”
- Target: `.subscription--soda .subscription__account`; fix also applies to Hard Seltzer.
- Fix: introduced the shared `--line-height-body-compact: 1.3` role and removed the oversized visible sign-in line box. A pseudo-element preserves the 44px hit area; keyboard focus remains visible.
- Reference: [Subscription](sections/subscription.md).

### Soda Ingredients — card-title line height

- Annotation ID: `1788634999475-yrppiafbk`
- Original comment: “also here: centralized token for lineheight, dont overlap chars”
- Target: `article.soda-ingredients__item:nth-of-type(1) > h3`.
- Fix: mapped all ingredient-card titles to the same small-Erode role as Soda 3 Reasons, retaining clear multiline separation and responsive sizing.
- References: [Design system](design-system.md), [Soda Ingredients](sections/soda-ingredients.md).

### Verification

The implementation was visually checked against the relevant source frames at desktop and phone widths, including a 320px overflow check. Subscription keyboard focus and its 44px hit area were verified. Theme Check, asset budgets, JavaScript syntax, and whitespace checks passed. The raw JSON command encounters two existing Shopify-generated leading comments; all theme JSON parses after stripping those comments.
