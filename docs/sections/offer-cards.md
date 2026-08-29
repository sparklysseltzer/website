# Offer cards

Source: `sections/offer-cards.liquid`

## Purpose

Offer cards present up to four customer/use-case destinations. The homepage currently uses this section after Product Overview.

## Content sources

`Local to this template` stores heading, introduction, and card blocks on the section instance. `Globally synchronized` resolves the active `offer_teaser` entry with handle `global-offer-teaser` and its ordered `offer_card` references. Missing global data falls back to the preserved local instance. Per-placement heading and introduction visibility stay local. See [Shared section content](../shared-section-content.md).

## Card contract

Each card supports a Shopify image or one of four bundled Figma fallbacks, title, optional whole-card URL, desktop subtitle, and up to five plain-text chips. A URL produces one semantic linked card; no URL produces a non-interactive article. Chips are intentionally not links.

## Motion and accessibility

`offer-cards-motion` creates reversible scroll-scrubbed header/card reveals and restrained media parallax with native Web Animations. Desktop hover/focus zooms linked media. Without JavaScript or with reduced motion, the complete static content remains visible. Keyboard focus receives the same meaningful linked-card state as pointer hover.

## Known limits

Global definitions and starter entries exist on the development store but require production workflow and translation verification. Chip destinations, mobile subtitle treatment, and additional card counts are not approved.
