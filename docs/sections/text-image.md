# Text and image

Sources: `sections/text-image.liquid`, `blocks/editorial-text-image.liquid`, `snippets/text-image-content.liquid`, `snippets/editorial-copy.liquid`, `snippets/editorial-image.liquid` and `assets/editorial-content.css`.

## Controls and layout

Matches Figma `10989:45023` and `10989:45024`. Available under Brand storytelling, and as a Content block in Two-column layout. This is an open composition on the page canvas, unlike Image and text panel's enclosed panel. Desktop uses two equal columns within 1200px, separated by 60px (32px when embedded). Below 900px it stacks in DOM order: Image left places the image before text; Image right places it after text. Reading, keyboard and visual order agree.

Editors set image side, Shopify image/alternative text, H2/H3 heading, rich text, optional linked action and heading font. Erode is the default, Newake optional; rich-text headings follow that choice while body remains Maison Neue. Sizes use Section and Body roles, with shared button typography.

The default image is square, cover cropped and rounded with the shared large radius. Custom height reveals separate desktop/mobile height controls. Shopify images use bounded responsive widths, intrinsic dimensions and the Shopify focal point. Blank pickers use `editorial-soda-banner.webp` (1600×948), optimized from the Figma source photograph. Supply alt text for meaningful imagery; leave decorative imagery empty.

## Behavior and scope

Content, image and action are server-rendered and work without JavaScript. There is no new entrance animation or interactive state beyond the shared button states. Section visibility follows the shared contract. This generic editorial composition emits no standalone Article/Product/Offer entity: it does not imply such a content model. Rich-text authors must keep their heading hierarchy appropriate to the page.

## Editor dependency contract

Groups follow Layout → Image → Content → Button → Visibility (the embedded block omits section visibility). Square hides desktop/mobile height controls; Custom exposes both. Show heading gates heading copy and level, while a populated rich-text field keeps heading-font selection relevant. Show button gates label, destination and style and also suppresses the rendered action. Hiding fields preserves saved values. Both standalone and embedded schemas have reviewed mode cases in the editor contract registry.

## Accordion reuse

The existing native block is also available inside Accordeon items, retaining its settings, conditional fields, image handling and responsive behavior. Accordion placements use the same compact embedded spacing as Two-column layout. No duplicate content model or structured data is introduced.
