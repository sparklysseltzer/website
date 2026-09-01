# Header

Source: `sections/header.liquid`

Group: `sections/header-group.json`

## Purpose

The persistent header renders the global Sparklys shell in one of three server-resolved contexts: `default`, `soda`, or `seltzer`. Context resolution is shared with the layout and footer through `snippets/brand-context.liquid`; direct product and collection URLs do not depend on browser state.

## Merchant controls and data

- General, Soda, and Hard Seltzer Shopify Navigation menus;
- Corporate Nav for the black utility bar;
- Store Finder Shopify Page.

Pages, Products, and Collections can explicitly select their context through the `custom.product_world` metafield. The canonical `soda` and `hard-seltzer` collection handles remain the fallback classification contract and product-world switcher destinations rather than Theme Editor settings. A blank Store Finder selection uses the `haendler` handle as a development bootstrap fallback. Resource URLs remain authoritative.

## Rendering contract

- The black product-world switcher stays in normal flow; the white main bar is sticky.
- Desktop product tabs show the active context with concave joins and texture only inactive hover/focus states.
- Corporate Nav supports leaf links plus two nested disclosure levels through native `details`/`summary`.
- The white bar renders the context-specific logo/menu, Store Finder, a non-interactive account preview, and a locale-aware cart link/count.
- Mobile uses a native disclosure and the active context menu.

## Progressive enhancement and accessibility

`HeaderScrollIntent` restores the black bar after deliberate upward scrolling and hides it during downward movement. `header-corporate-menu` adds outside-click, Escape, and scroll dismissal while native disclosures remain functional without JavaScript. Navigation landmarks, current-page state, visible focus, touch targets, and reduced-motion behavior are preserved.

## Known gaps

The account circle is still a visual preview. Main-navigation desktop dropdown panels, robust nested mobile navigation, final menu destinations, and long/localized-content QA remain. See [Architecture](../architecture.md) for the shared context-routing contract.
