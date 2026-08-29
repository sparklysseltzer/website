# Merchant marquee

Source: `sections/logo-marquee.liquid`

## Purpose and data source

The marquee renders an ordered `merchant_collection` metaobject whose `merchants` field references shared `merchant` records. The section owns presentation only; merchant names, URLs, and logo files remain reusable store data. See [Merchant content](../merchant-content.md).

## Merchant controls

- Merchant Collection metaobject;
- 12–80 second loop duration, default 32;
- left or right direction;
- pause on pointer hover and keyboard focus.

## Rendering contract

The full-width gray surface contains white logo tiles and duplicated visual groups for a seamless CSS loop. Duplicate groups are hidden from assistive technology and removed from keyboard order. A merchant URL makes only the canonical tile interactive. Missing or empty data emits no storefront section.

## Motion and accessibility

The animation is CSS-only. Reduced-motion mode disables the loop and exposes the canonical list as a horizontal scroller. Pause-on-interaction applies to hover and focus-within. Logo alternative text uses the merchant name.

## Operational state

The `merchant` and `merchant_collection` definitions exist on the connected store. Approved Merchant entries and a selected collection are still required for final storefront content.
