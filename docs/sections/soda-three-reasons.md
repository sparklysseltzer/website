# Soda 3 Reasons

Source: `sections/soda-three-reasons.liquid`

Typography follows the [design system](../design-system.md), with one explicitly approved composition exception for the numeral/two-line headline described below. Reason-card titles use the shared small-Erode rhythm (`--line-height-heading-small-erode`, `1`), not the tighter display-heading rhythm.

## Purpose and placement

Soda 3 Reasons presents three approved illustrated Soda benefit statements with supporting copy and a legal footnote. It is available under **Trust & information**.

## Merchant controls and defaults

The heading, introduction, optional inline link, footnote, and three reason blocks are editable. Each block contains an optional replacement illustration, title, and text. Blank fields use localized runtime defaults; blank image pickers render positional vector fallbacks from `soda-reason-low-sugar.svg`, `soda-reason-fiber.svg`, and `soda-reason-leaf.svg`. The leaf is one complete SVG exported from `I7386:10664;7525:11532` (170×166px), preserving its internal rotation, mask, and layer offsets without CSS reconstruction or baked-in grain. Reordering blank blocks changes their positional default. The renderer uses `#` while the link URL is blank so the starter link stays visible until the merchant selects the real destination.

## Rendering, motion, and accessibility

Frame `8583:28779` uses black headings and introduction, brown (`#786e5b`) supporting copy/link, a `#f2f0e9` background, and a light `#d7d1c0` footnote. Do not infer a green text color from the Soda brand world. The desktop illustration row is 850px wide, with 250px columns and 50px gaps; artwork occupies 180px-tall boxes, and the row begins 20px after the introduction. The footnote is constrained to 600px.

The oversized numeric heading remains real text. Three desktop columns stack into one centered phone column. Shopify-selected illustrations use responsive delivery, while the original vector layers remain exact automatic fallbacks. `editorial-section-motion` provides reversible surface and staggered content reveals; the full server-rendered section works without JavaScript and reduced-motion users receive no scripted movement. Illustrations are decorative because their adjacent headings and descriptions carry the message.

### Approved headline composition exception

The headline deliberately matches Figma's 82px Erode Bold words with 62px line height, rather than the normal `0.9` Erode rhythm. The local `--soda-reasons-lockup-line-height` is `calc(62 / 82)`. At full size the numeral is 192px with normal line height and the horizontal gap is 8px. One responsive heading size (56–82px) drives the words, numeral (`192 / 82` em), and gap (`8 / 82` em), preserving their proportions on phones as well as desktop. This exception applies only to the composed headline and does not alter shared typography or reason-card titles.

The numeral and heading words align on the final text baseline, not the bottom of their differently sized font boxes. Native `text-box-trim` with `cap alphabetic` edges reproduces the reference's outer-leading trim where supported. Browsers without text-box trimming retain baseline alignment. Numeral styling targets its explicit class, not the screen-reader-only prefix.

## Structured-data decision

These are editorial benefit statements, not a supported standalone Schema.org entity. The section intentionally emits no JSON-LD and must not be represented as Review, Claim, Product, or Offer data without a future canonical data contract.

## Shared typography roles

The documented numeral headline exception is preserved. Card headings; the same body role for introduction and descriptions; small footnote.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
