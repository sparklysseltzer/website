# Main navigation and mega menu implementation plan

Status: local implementation completed, 2026-09-15. See `docs/sections/header.md` for the implementation contract and fixture verification. Real menus are currently flat; image definitions and nesting remain separate store-content work. No deployment or store-data writes were performed.

## Goal and scope

Build the Sparklys desktop mega menu and corresponding mobile navigation in native Liquid, CSS and scoped vanilla JavaScript. Use the existing design system and shared product-card patterns. Start with click interaction; opening on hover is explicitly out of scope for this iteration.

User requirements:

- Click Shop or Learn to open its panel with its **first category already selected** and its cards visible.
- Click a category in the desktop left column to change the cards. Hover must not select categories or open panels.
- Shop cards reuse existing product-card design and show direct product imagery.
- Learn follows the same image-card principle, even though its reference has text-only entries. Provide merchant-owned destination images and a useful fallback while imagery is missing.
- Replace the permanently black first navigation item with one smooth, slightly wobbly black pill that travels between Shop, Learn and Subscribe on pointer hover.
- Mobile adapts the concept to the existing design system. Omit the **Soda entdecken** button.
- Smooth transitions, short staggered reveals, interruption handling and reduced motion are part of the first implementation.

Subscribe remains a normal link unless an actual configured child hierarchy requires a panel. This work does not implement subscription commerce or invent its destination.

## References inspected

Figma design context and screenshots were retrieved for all three nodes:

- [Desktop mega-menu content](https://www.figma.com/design/wU2QCDnknQPBZd4hacOOjq/Sparklys-Web?node-id=9775-18619): narrow left category rail, selected rounded category, bottom all-products action; right heading/short introduction, optional category destination, carousel controls and a horizontal product-card row. The supplied node is the panel content, not a complete header interaction specification.
- [Mobile Shop](https://www.figma.com/design/wU2QCDnknQPBZd4hacOOjq/Sparklys-Web?node-id=10396-81690): header/close action, Shop–Learn segmented control, category accordions, horizontal cards with the next card partially visible, bottom all-products action.
- [Mobile Learn](https://www.figma.com/design/wU2QCDnknQPBZd4hacOOjq/Sparklys-Web?node-id=10587-83609): same structure, About us expanded, additional categories and a Contact destination. Replace its text-only destinations with image cards where images exist; preserve usable text navigation otherwise.

Reference labels, descriptions, products and promotional badges are examples, not authorization to create merchant content or claims. Normalize typography, spacing, radii, logo contexts and icon treatment through the repo system. Fetch fresh Figma context in the implementation session; exported asset URLs expire.

Read first: AGENTS.md; docs/product.md; docs/architecture.md (especially Theme Editor configuration design); docs/development.md; docs/shopify-reference.md; docs/sections/README.md; docs/sections/header.md; docs/design-system.md; docs/merchant-content.md; docs/sections/main-collection.md; docs/status.md. Read the agent-browser skill before browser verification.

## Existing implementation and concurrent-work boundary

- `sections/header.liquid` resolves General/Soda/Seltzer menus through `brand-context`; settings include `menu`, `soda_menu`, `seltzer_menu`, `corporate_menu`, and `store_finder_page`. Preserve their IDs and current fallback behavior.
- Desktop currently renders links without their main-navigation children and decorates `forloop.first` as active. Mobile currently renders a simple native disclosure with top-level links.
- `assets/theme.js` contains `HeaderScrollIntent` and `HeaderCorporateMenu`. Preserve the switcher, measured `--sticky-header-height`, corporate disclosures and cart entry behavior.
- `snippets/product-card.liquid` currently routes `card_layout: 'catalog'` to `catalog-product-card.liquid`; `product-background.liquid` owns reusable product backgrounds.
- **Concurrent work is present:** collection cards, collection CSS/JS, design-system files, templates, locales and documentation were dirty during planning. Reinspect `git status` and the current versions before implementation. Do not reset, stash, overwrite, commit or roll back another session's work. Coordinate shared-file edits or wait for the collection work to settle.
- The current catalog card has special bundled product cutouts and paired-can artwork. Do not blindly reuse that image-selection order when the menu must use direct merchant product images. Add a narrow documented navigation presentation to the shared card, or share its media/background/label primitives. Do not create a second independently maintained catalog design.
- Ensure shared card styling loads on **every header-bearing page**; collection-only asset inclusion is insufficient. Avoid loading the entire collection filtering controller globally.

## Content model and image ownership

### Navigation hierarchy

Keep the existing three Shopify Navigation menu settings as the source of titles, order, nesting and destinations. Proposed hierarchy:

```text
Shop → Soda → product links
     → Hard Seltzer → product links
     → other merchant categories → destination links
Learn → About us → page/article links
      → other merchant categories → destination links
Subscribe → configured destination
```

Use `link.links`, `link.type`, `link.object` and `link.url`; do not infer behavior by matching English/German titles, parsing localized URLs or assuming the first root is always Shop. Roots with children disclose; leaves navigate. Preserve direct root/category destinations through a separate clearly labeled link in their panel. Invalid placeholder destinations must not produce fake CTAs. Categories without children stay ordinary destination links; a root containing only leaves renders those as its initial card list. Never replace an empty menu with fabricated interactive content.

Generate unique DOM IDs from section instance, presentation and loop indices. Do not treat a title-derived handle as a stable content identifier. Shopify supports the required three navigation levels; deeper content belongs on destination pages.

### Recommended image storage

Recommendation: **put the reusable navigation thumbnail on its destination resource**. Store the image in Shopify Files, selected through an image-only file-reference metafield named **Navigation image**, proposed key `custom.navigation_image`. Inspect existing definitions first and reuse an equivalent field if available.

| Destination | Resolution proposal |
| --- | --- |
| Product | Existing merchant `custom.teaser_image` when appropriate, then `featured_image`; retain shared product-background treatment. Render actual product media, not reconstructed can compositions or generated product art. |
| Page | Page `custom.navigation_image`; Pages have no native featured-image field. |
| Collection | Collection `custom.navigation_image`, then the explicitly assigned `collection.image`. Do not silently substitute a random member product for editorial Learn imagery. |
| Article | Article `custom.navigation_image` if provisioned, then native article image. |
| Blog | Blog navigation-image metafield if supported/provisioned, otherwise explicit override or text fallback. Do not choose an arbitrary latest article. |
| Metaobject webpage | An existing suitable image field in its definition; document the explicit mapping. No assumption that every definition has an `image` field. |
| External URL, policy or unsupported resource | Optional Header **Link image** block containing destination URL and image. Otherwise text fallback. |

Do not add all possible definitions upfront: provision Pages and Collections first when authorized, and other types only when the actual menu needs them. Confirm Admin API scopes and definition capabilities before writing. Use repeatable API-backed provisioning with read-before-write, backup and read-back; theme authentication alone is insufficient. This planning request does not authorize provisioning or image uploads.

Resource images are canonical across menus and languages. Exceptional Link image blocks should initially serve links without usable resource imagery, not duplicate every product/page. Match their URL exactly to the configured link; document locale-specific URL matching and duplicates (first matching block wins). For internal resources prefer the resource field to avoid locale-dependent matching. Images do not own destination titles; keep translated Navigation labels authoritative.

No image: use a deliberate text card with the same link and a neutral surface, without a broken image, fake thumbnail, or empty accessible name. The menu must ship functional before all Learn photography is supplied. Use responsive Shopify CDN output and focal points for editorial crops; contain product images and preserve transparency/colors. Reserve dimensions to prevent layout jumps. Decorative images adjacent to the same link label use empty alt; meaningful image-only content needs suitable merchant alt text.

Section/category title defaults to the Navigation label. Avoid automatically inserting full page/collection rich text into the small introduction. Omit descriptions initially unless an existing concise merchant field clearly fits; a reusable optional navigation-summary field can be a later explicit content decision.

## Desktop behavior

1. Initial state: no mega menu open. Actual page state uses `aria-current`; remove the unconditional first-item black style.
2. Click/Enter/Space on a root disclosure opens that root and selects its first category with children. Clicking the same root closes it. Clicking a different root switches within the existing shell and resets to that root's first category.
3. Category disclosure activation changes the displayed cards without navigating; expose its real destination separately. Clicking the selected category on desktop keeps it selected and does not replay motion.
4. Panel is anchored below the white bar, aligned to shared gutters/page width, bounded by available viewport height. Overflow belongs to panel/rail, never the document width. Use a subtle scrim beneath the header/panel if useful; do not block the header triggers.
5. Outside click and Escape close. Escape restores focus to the owning root. Normal link navigation and focus leaving the desktop navigation close without dragging focus backwards. Do not close merely because the pointer leaves.
6. Keep desktop as non-modal navigation: no focus trap. Close corporate popovers when main navigation opens; close main navigation when the cart/modal takes over. Avoid simultaneous overlay ownership.
7. Use a native horizontal scroller for cards; buttons scroll by a sensible card/viewport increment, with correct disabled endpoints and translated labels. All cards remain reachable. No autoplay or mandatory drag gesture.

## Moving pill: decorative hover, independent open state

One `aria-hidden`, pointer-transparent surface lives behind the top-level labels. It targets the full hovered item bounds, not the literal pointer coordinate. Keyboard focus receives the same target treatment plus the immediate shared focus ring. Hover moves the pill only; it never opens or switches content.

Default priority: keyboard focus within the group → hovered item → open root → actual active root → hidden. On pointer leave, return smoothly to that fallback. Open state also has an independent chevron/expanded cue, so hovering Learn while Shop is open is not misleading. Subscribe participates in pill motion while remaining a link.

Prototype a restrained squash/stretch on the pill surface, with one small damped overshoot. Keep text and icons geometrically stable. Measure bounds on entry, resize and font load; retarget from the current painted rectangle when moving rapidly. Use transforms for travel and deformation; width changes may be represented by scale on a separate surface layer. No animation library, infinite wobble, cursor trail or continuously running idle loop. Maintain readable contrast throughout intermediate frames and reuse shared label inversion only if verified against the traveling shape. No fixed hardcoded item widths.

## Mobile behavior

- A full-height navigation sheet with a visible close control, current brand logo and available utility actions. Use `100dvh`/safe-area-aware bounds, internal vertical scrolling and restored body scroll on close.
- Enhance the native fallback into a properly named modal sheet (prefer existing native dialog patterns). Trap focus only while mobile is modal; Escape closes and restores focus to its opener. Ensure the visible close control actually belongs to the interactive modal layer.
- Shop/Learn appear as a compact root switcher; render actual configured root groups so menus with different labels/counts still work. Keep Subscribe and other leaf roots accessible as links. Wrap/reflow long labels instead of shrinking font roles.
- Initially choose the first expandable root and its first expandable category. Root changes reset to the first category. One category is open at a time; mobile may collapse its selected category. Its cards sit inline underneath as a swipeable horizontal rail.
- Learn uses the same card model as desktop, including text fallback. No “Soda entdecken” action on mobile. A root destination such as All products or Contact is shown only if supplied by the configured menu; no invented destination.
- On responsive breakpoint crossing, immediately settle/close the old presentation, release inertness/scroll locks and place focus somewhere visible and logical. Do not animate hidden layouts or leave duplicate navigations keyboard-accessible.

## Progressive enhancement and accessibility

Render all real links server-side. Use native `details`/`summary` as the baseline for nested disclosures; keep parent destination anchors inside panels. Without JavaScript, desktop and mobile must expose every menu level through usable disclosures. Enhance into the selected-category presentation only after successful initialization. Do not hide baseline children behind a JS-only control.

Use navigation/list/link/disclosure semantics, not application `menu`/`menuitem` roles. Maintain `aria-expanded`, relationships and current-page state. Use normal Tab order and Enter/Space activation; no custom arrow-key system is needed unless implementing the complete tabs pattern. Inactive panels must be hidden/inert and non-focusable, including outgoing animation layers. Do not clone focusable content or IDs for crossfades. Keep focus on the activated category; never move it automatically to a card.

Use shared focus modality, 44px primary targets, typography and Untitled UI icon sourcing. Check visible Newake glyph alignment beside logos/icons and use the shared optical offset only where needed. Preserve corporate navigation, all three brand contexts, cart counts, cart drawer and sticky content positioning.

## Motion contract

Reuse current shared tokens (planning snapshot: Fast 200ms, Base 260ms, Slow 360ms, shared ease). Read current values again because the other session may change them. Suggested first pass:

| Transition | Initial treatment |
| --- | --- |
| Open/close shell | Slow opacity plus small vertical translation; measured height only where needed |
| Category change | Base content crossfade; shell height eases from its painted height |
| New cards | Base/Slow fade with small displacement, 35–45ms stagger, cap total delay around 160ms |
| Mobile accordion | Existing FAQ-style interrupted measured-height transition and chevron rotation |
| Traveling pill | Slow travel with a small finite squash/stretch; settle without a long spring tail |

These are implementation starting points, not approved new global timings. Add named navigation roles for stagger/deformation only if existing tokens cannot express the effect; document them in the design system and header contract. Reuse existing continuity patterns rather than introducing competing lifecycle helpers.

Cancel/retarget from the current rendered frame on rapid changes. Keep semantic state and input responsiveness immediate. Stagger only newly revealed cards; unchanged selection, cart-count updates and unrelated section refreshes do not replay it. Reduced motion removes travel, wobble, height animation and stagger, leaving immediate legible selected/open states. Tear down animations, observers, handlers and scroll locks on Theme Editor unload; reinitialize safely after header replacement.

## Implementation sequence

1. Reconcile the latest working tree and collection-card interface. Inspect current menus/resources read-only through available APIs when possible. Record missing content separately from code work.
2. Implement native three-level link/disclosure markup and resource-image resolution first. Verify no-JS navigation and malformed/empty menu fallbacks.
3. Introduce shared navigation card presentation and globally available card styling, preserving existing collection rendering. Add desktop shell/category state and horizontal navigation.
4. Implement mobile sheet/root switching/accordions, focus and scroll lifecycle. Integrate corporate/cart overlay behavior and header height measurement; the expanded menu must not inflate the sticky-header clearance token.
5. Add pill and transition choreography. Inspect intermediate frames, rapid reversals and reduced motion before judging settled screenshots.
6. Review schema and content contracts, update docs, run gates and browser journeys. Deliver local implementation plus any precise outstanding store-content setup; do not claim production support before real data verification.

Likely files: `sections/header.liquid`, focused navigation snippets, `assets/header-navigation.js` / `.css` if separation is useful, shared card primitives/styles, asset inclusion in the header/layout, local locale additions, `tests/editor-schema-contracts.json`, `docs/sections/header.md`, `docs/design-system.md`, `docs/merchant-content.md`, and relevant card documentation. Keep shared-file changes small and coordinated. No template or header-group fixture replacement is needed for the code.

### Schema review before edits

Preserve existing controls and setting IDs. Prefer the existing menu pickers plus additive Link image blocks (`url`, `image_picker`), with no mode toggle. An empty image uses the normal fallback. Avoid per-category product pickers duplicating Navigation. Do not add merchant speed/stagger/hover-mode controls for this initial implementation.

Before changing header schema, inventory every existing checkbox/select and its dependent fields, review English labels/groups in composition order, and add explicit visible/hidden mode cases to the editor contract. Record unsupported conditional visibility for resource pickers rather than leaving misleading mode controls. Do not refresh legacy fingerprints just to pass checks.

## Verification and completion criteria

Run implementation gates:

```sh
npm run check
node --check assets/theme.js
# Also node --check any newly added JavaScript file.
find config locales sections templates -type f -name '*.json' -print0 | xargs -0 -n1 jq empty
git diff --check
```

Test headlessly at representative phone/desktop widths plus 320px, tablet/breakpoint boundaries and enlarged text. Use explicit `--headed false`; extension sessions additionally use `--args '--headless=new'`. Close every task-created browser session, including after failures. Do not activate regular Chrome. A new `shopify theme dev` session needs explicit approval; reuse an already authorized preview only when available in that implementation session.

Verify:

- General/Soda/Seltzer direct entry; German and English; long labels; no fabricated links; empty/one/many-card and missing-image cases.
- Click-only root/category interaction, first-category defaults, second-click closing, Subscribe navigation, independent hover pill, no hover-open regressions.
- Keyboard traversal, Escape/focus restoration, outside click, no-JS three-level navigation, screen-reader expanded/current state and no hidden focus targets.
- Mobile root switches, accordion reversal, horizontal swipe plus keyboard access, long vertical content, safe areas, no omitted destinations and no Soda entdecken button.
- Rapid Shop → Learn → Shop, rapid category selection, exit during entry, resize/font-load measurement, reduced-motion changes, Theme Editor replacement and no motion replay on unchanged refresh.
- Header scroll intent, actual sticky clearance, corporate-menu coordination, cart-open handoff and released body locks.
- Product media fidelity, resource image focal points, intermediate pill text contrast, stagger frames, global-card styles on non-collection pages and no collection-card regressions.

Navigation is a link presentation, not a new set of product/offer entities: document that it adds no duplicate Product/Offer JSON-LD in the global header. Preserve existing page entity markup. Do not emit prices, offers or claims merely to decorate navigation cards.

This plan authorizes no deployment, publishing, menu edits, metafield provisioning or saved-content overwrite. Follow AGENTS.md for subsequent specific approvals. Local implementation can progress using honest missing-content fallbacks. Fetch/merge current editor/GitHub content before any separately authorized release, preserve protected JSON and existing locale values, and keep the shared theme unpublished.

## Shopify references checked during planning

- [Liquid link](https://shopify.dev/docs/api/liquid/objects/link): child links, associated resource types and native destinations.
- [Liquid page](https://shopify.dev/docs/api/liquid/objects/page) and [Liquid collection](https://shopify.dev/docs/api/liquid/objects/collection): resource fields and image availability.
- [Theme input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings): native menu/image controls. Consult current definition APIs and installed scopes when preparing store provisioning.
