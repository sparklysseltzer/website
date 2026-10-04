# Offer cards

Source: `sections/offer-cards.liquid`

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

## Typography roles

Section heading; body introduction and card descriptions; card headings; label chips.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

## Preserved typography

This section opts out of the general editorial heading-font feature through its Shopify wrapper class `heading-font-legacy`. Its original type families, weights, tracking and line heights remain authoritative. Existing variant-based type selection and pre-existing font controls (where present) are preserved; no new global font selector is added.

Editor naming (2026-09-12): **Offer cards**. Display names only; internal IDs, saved settings and rendering are unchanged.

## Destination defaults (2026-09-15)

Explicit card links remain authoritative. Otherwise the canonical artwork slot resolves the Shopify page handle `retail`, `gastro`, `events`, or `companies` through `pages`, retaining localized URLs. If a page is unavailable, the card remains an article rather than linking to a nonexistent page. Local `page.<handle>.json` templates use Page intro and are ready for merchant composition.

Ananotes 116 store inspection (2026-09-15): Admin API content access is now available. Retail (`retail`), Gastronomie (`gastro`), Events (`events`) and Firmen (`firmen`) already exist as hidden pages with template suffix `page`. Reuse them; do not create a duplicate Companies page. The Companies artwork slot prefers the existing `firmen` resource, then legacy `companies`. Local templates remain ready as `retail`, `gastro`, `events`, `companies`. Assigning those suffixes is a separate store-data step; it has not been performed by the local-only Ananotes pass. Hidden pages remain unavailable to ordinary storefront links until their publication is separately authorized. Existing explicit card links, page handles, content, visibility and saved templates are preserved.

Erode casing: the brand-inherited Soda section heading preserves authored case under the shared typography rule; existing Newake card-title treatments remain unchanged.

## Section background

**Section background** is the final group: Default, Transparent, or Custom Color. Only Custom Color shows the picker; Clear means transparent. New add-section presets start transparent; existing saved placements retain their original appearance until a color is chosen. The full-width canvas follows the [shared background contract](../design-system.md#section-backgrounds); internal panels, cards and image overlays retain their separate settings and product-world defaults. No saved templates or store data are migrated.

Offer cards use the shared [panel shadow](../design-system.md#panel-shadows) on their outer rounded surface, with nested panel shadows suppressed.

Shared motion controller (2026-10-02): media parallax targets are optional so Team can reuse card reveals without moving portraits. Existing offer-card media remains configured and animated. Keyboard focus forces the focused card's reveal to its visible end state; disconnection removes the focus listener along with scroll observers.

Ananotes 116 completed (2026-10-02): reused all four existing hidden pages and assigned `retail` → `retail`, `gastro` → `gastro`, `events` → `events`, and `firmen` → `companies` through Admin GraphQL. All four templates were read back from development theme `199837745539` before assignment. Page content, handles and hidden status are preserved; no duplicate pages were created. Existing resource-based defaults activate as each page becomes available to the storefront. Hidden destinations deliberately remain non-interactive instead of producing broken links. Publishing those pages is outside this request.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Page**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).

Heading casing (2026-10-04): the section heading preserves merchant-authored casing in every brand context, including Newake. No uppercase transform is applied; card titles and saved heading text are unchanged.
