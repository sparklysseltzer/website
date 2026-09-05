# Hard Seltzer Awards

Source: `sections/hard-seltzer-awards.liquid`

Display headings use the centrally resolved font-specific line height from the [design system](../design-system.md); section CSS must not introduce a separate heading rhythm.

## Purpose and placement

Hard Seltzer Awards presents the approved award statement, three medal graphics, and a shop action. It is available under **Trust & information**.

## Merchant controls and defaults

The heading, introduction, button label/link, and three award images are editable. Each award block includes required-purpose alternative text for replacements. Blank content uses localized defaults; blank images render the bundled medal and flavor-badge pairs. The renderer uses `#` while the action URL is blank so the preset visibly demonstrates the button until its real destination is selected.

Fallback assets are the exact composed exports `seltzer-award-taste-master.webp`, `seltzer-award-master.webp`, and `seltzer-award-gold.webp`, including their flavor badge and approved shadow. Reordering blank blocks changes their positional fallback award.

The medals were re-exported from nodes `6619:25081`, `6619:25117`, and `6619:25153` at 3× resolution: 802×807, 803×807, and 803×807px. Export the isolated compositions with their full rendered bounds (including blur beyond layout bounds), transparent backgrounds, and no page grain. WebP delivery preserves lossless alpha so adjacent overlapping image boxes cannot cover another medal's shadow with a baked-in white rectangle. Never trim these exports to the medal/group layout bounds.

## Rendering, motion, and accessibility

Frame `8582:28777` uses black text on white, an 800px introduction, and a compact centered medal group. The transparent export margins overlap inside the row so the visible medals keep the approved close spacing; they must not become three widely separated grid cards. Internal heading/copy, copy/medal, and medal/action spacing is 14px. The shared section padding and Newake rhythm intentionally normalize the source frame's isolated typography/outer spacing values.

The awards form a centered three-column row on desktop and a single column on phones. Shopify-selected images render responsively; bundled transparent WebP assets are the automatic fallbacks. `editorial-section-motion` applies the shared reversible surface and sequential reveal contract. Visible text and the action remain complete without JavaScript, reduced-motion is respected, and the fallback medals have localized descriptive alternative text.

## Structured-data decision

The section does not emit Award, Product, Review, or Offer JSON-LD. It lacks the canonical product linkage and evidence fields required to make those claims as a trustworthy machine-readable entity; the visible editorial claim remains the honest representation until a product/organization structured-data model is approved.

## Shared typography roles

Display heading; body introduction; UI action.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
