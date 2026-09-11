# Header

Source: `sections/header.liquid`

Group: `sections/header-group.json`

## Purpose

The persistent header renders the global Sparklys shell in one of three server-resolved contexts: `default`, `soda`, or `seltzer`. Context resolution is shared with the layout and footer through `snippets/brand-context.liquid`; direct product and collection URLs do not depend on browser state.

## Merchant controls and data

- General, Soda, and Hard Seltzer Shopify Navigation menus;
- Corporate Nav for the black utility bar;
- Store Finder Shopify Page.

Pages and Products explicitly select their context through the existing `custom.brand_variant` metafield (`soda` / `hardseltzer`). The resolver supports the same key for optional future Collection overrides. The canonical `soda` and `hard-seltzer` collection handles remain the fallback classification contract and product-world switcher destinations rather than Theme Editor settings. A blank Store Finder selection uses the `haendler` handle as a development bootstrap fallback. Resource URLs remain authoritative.

## Rendering contract

- The black product-world switcher stays in normal flow; the white main bar is sticky.
- Desktop product tabs show the active context with concave joins and texture only inactive hover/focus states.
- Corporate Nav supports leaf links plus two nested disclosure levels through native `details`/`summary`.
- The white bar renders the context-specific logo/menu, Store Finder, a non-interactive account preview, and a locale-aware cart link/count. The global cart-drawer controller enhances this link to open a native modal and refreshes the count after cart changes; without JavaScript it remains a normal cart destination.
- Mobile uses a native disclosure and the active context menu.

## Progressive enhancement and accessibility

`HeaderScrollIntent` restores the black bar after deliberate upward scrolling and hides it during downward movement. `header-corporate-menu` adds outside-click, Escape, and scroll dismissal while native disclosures remain functional without JavaScript. Navigation landmarks, current-page state, visible focus, touch targets, and reduced-motion behavior are preserved.

## Known gaps

The account circle is still a visual preview. Main-navigation desktop dropdown panels, robust nested mobile navigation, final menu destinations, and long/localized-content QA remain. See [Architecture](../architecture.md) for the shared context-routing contract.

## Typography roles

Label navigation text and UI mobile menu text; small secondary text; dedicated tiny cart-count badge role. No changes to navigation behavior.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

Ananotes requested a larger Hard Seltzer wordmark: desktop width is now 240px (previously 205px) with a 72px maximum height. Mobile sizing and context selection are unchanged.

The header scroll controller publishes its measured full height as --sticky-header-height via ResizeObserver. Product sticky content reserves this height plus clearance, including the world switcher when revealed.

Home shortcut (2026-09-08): the black product-world bar starts with a localized Home icon link before Hard Seltzer. It uses `routes.root_url`, and aria-current only on the homepage. Untitled UI Line home-03 is bundled as `assets/icon-home.svg` from https://github.com/untitleduico/icons/blob/main/icons/home-03.svg under the retained icon license. The 16px glyph has a 28px circular Inverse hover surface fading with Fast/shared easing on hover or keyboard focus. This secondary desktop shortcut preserves the compact bar height with a 44px-wide target; coarse-pointer devices expand the switcher height to 44px. Existing mobile switcher visibility remains unchanged, with the main logo continuing to link home. Native links work without JavaScript; reduced motion disables the surface fade.

Home icon refinement (2026-09-08): merchant requested a filled appearance. The licensed home-03 geometry is adapted locally to a filled body with an even-odd doorway cutout, retaining its original roof stroke; this is a theme adaptation, not a claimed official Solid export. The visible icon box sits 6px to the right of the main navigation’s left content edge for optical alignment with the rounded Shop button; exact edge alignment looked too far left. Its 44px-wide hit area and circular hover surface extend into the gutter; the brands container permits these effects and focus outlines to remain unclipped.

Home icon selection (2026-09-08): the current icon is the unmodified Untitled UI Line home-02 from https://github.com/untitleduico/icons/blob/main/icons/home-02.svg. Its single roof contour and doorway replace the more detailed home-03 and the temporary filled adaptation. The approved 6px optical inset and circular hover behavior remain unchanged.

Tab animation clipping (2026-09-08): the brands row clips to the black bar vertically with `clip-path: inset(0 -1rem)`, allowing 16px of horizontal gutter for the home target and tab joins. Do not remove the vertical clipping when changing home spacing: inactive tab joins translate below the bar during entry/exit and would otherwise leak into the white header. This supersedes the earlier unrestricted-overflow note.

Cart-count badges use the global accent surface with a 2px inverse-text (white) ring to remain distinct when the cart action is hovered.
