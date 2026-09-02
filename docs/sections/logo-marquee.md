# Merchant marquee

Source: `sections/logo-marquee.liquid`

## Purpose and data source

The marquee renders an ordered `merchant_collection` metaobject whose `merchants` field references shared `merchant` records. The section owns presentation only; merchant names, URLs, and logo files remain reusable store data. See [Merchant content](../merchant-content.md).

## Merchant controls

- Merchant Collection metaobject;
- optional visible heading;
- background treatment: gray section with white cards, fully transparent section and cards, or fully white section and cards; default gray;
- 12–60 second loop duration, default 32;
- left or right direction;
- pause on pointer hover and keyboard focus.

## Rendering contract

The optional heading follows the Figma module: centered uppercase Newake, responsive up to 45px, with a 20px desktop gap above the logo track and 50px desktop section padding. When the heading is blank, the localized section label remains as a visually hidden `h2` for the section landmark.

The full-width surface uses the Figma-derived gray background with white logo cards, a fully transparent treatment, or a fully white treatment for both the section and cards. Duplicated visual groups create a seamless CSS loop. Duplicate groups are hidden from assistive technology and removed from keyboard order. A merchant URL makes only the canonical tile interactive. Missing or empty data emits no storefront section.

Shopify's Add section visual-preview mode renders a static row of neutral logo placeholders when no Merchant Collection is available. This preview-only state communicates the layout without coupling the theme preset to a store-specific metaobject ID. After placement, an empty section continues to show the localized editor instruction and emits no customer-facing marquee until a published collection is selected.

## Motion and accessibility

The animation is CSS-only. Reduced-motion mode disables the loop and exposes the canonical list as a horizontal scroller. Pause-on-interaction applies to hover and focus-within. Logo alternative text uses the merchant name.

## Operational state

The `merchant` and `merchant_collection` definitions exist on the connected store. The homepage development instance currently selects the `online-shops` collection; Merchant entries remain store-owned content.
