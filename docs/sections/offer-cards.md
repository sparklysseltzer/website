# Offer cards

Source: `sections/offer-cards.liquid`

Display headings use the centrally resolved font-specific line height from the [design system](../design-system.md); section CSS must not introduce a separate heading rhythm.

## Purpose

Offer cards present up to four customer/use-case destinations. The homepage currently uses this section after Product Overview.

## Content sources

`Local to this template` stores heading, introduction, and card blocks on the section instance. `Globally synchronized` resolves the active `offer_teaser` entry with handle `global-offer-teaser` and its ordered `offer_card` references. Missing global data falls back to the preserved local instance. Per-placement heading and introduction visibility stay local. See [Shared section content](../shared-section-content.md).

## Card contract

Each card supports an optional Shopify image, title, optional whole-card URL, desktop subtitle, and up to five plain-text chips. When the image is blank, the approved Retail, Gastro, Events, or Companies artwork is selected automatically from the canonical card identity, with card order as the fallback for newly created local blocks. Shopify-selected images replace that artwork and use their native focal points. A URL produces one semantic linked card; no URL produces a non-interactive article. Chips are intentionally not links.

## Motion and accessibility

`offer-cards-motion` creates reversible scroll-scrubbed header/card reveals and restrained media parallax with native Web Animations. Desktop hover/focus zooms linked media. Without JavaScript or with reduced motion, the complete static content remains visible. Keyboard focus receives the same meaningful linked-card state as pointer hover.

The section uses the shared tight vertical section rhythm without a section-specific spacing override.

## Known limits

Global definitions and starter entries exist on the development store but require production workflow and translation verification. Chip destinations, mobile subtitle treatment, and additional card counts are not approved.

## Shared typography roles

Section heading; body introduction and card descriptions; card headings; label chips.

Sizes follow the central [fluid typography system](../design-system.md#shared-fluid-roles), not section-specific clamps or mobile overrides. All standard body text shares the 16–17px curve across 390–1440px at the normal browser root; font-specific heading rhythm remains centralized.
