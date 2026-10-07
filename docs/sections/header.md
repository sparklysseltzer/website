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
- The white bar renders the context-specific logo/menu, Store Finder, a locale-aware customer account link, and a locale-aware cart link/count. The global cart-drawer controller enhances this link to open a native modal and refreshes the count after cart changes; without JavaScript it remains a normal cart destination.
- Main navigation uses native three-level disclosures, enhanced into desktop category panels and a mobile modal sheet.

## Progressive enhancement and accessibility

`HeaderScrollIntent` restores the black bar after deliberate upward scrolling and hides it during downward movement. `header-corporate-menu` adds outside-click, Escape, and scroll dismissal while native disclosures remain functional without JavaScript. Navigation landmarks, current-page state, visible focus, touch targets, and reduced-motion behavior are preserved.

## Known gaps

Final menu hierarchy, imagery, destinations and published-language QA remain; the local mega-menu implementation and fixture verification are described below. See [Architecture](../architecture.md) for the shared context-routing contract.

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

Cart-count badges use the shared second accent (`--color-accent-secondary`, default `#FF6600`) with a 2px inverse-text (white) ring to remain distinct when the cart action is hovered.

## Breakpoint visibility

Essential-function exception: this section stays available at every breakpoint and does not expose hide controls. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

The active brand tab and its concave joins use pure white, independently of merchant surface palettes (Ananotes 112). Inactive treatments remain brand-aware.

## Main navigation — local implementation, 2026-09-15

The former main-navigation gap is implemented in `header-navigation.js` / `.css`, with `header-navigation`, `navigation-cards`, `navigation-card` and `navigation-destination` snippets. The existing menu IDs, world resolver, corporate navigation, store finder, cart count and sticky scroll controller remain authoritative. Menus are never inferred from translated titles or URL paths.

### Schema review

General → Default navigation; Utility navigation → Corporate navigation / Store finder page; Soda and Hard Seltzer → their existing Navigation pickers. There are no checkbox/select modes or conditional fields. All pickers remain additive and visible; a blank world menu retains the General fallback. Header Link image blocks were removed at merchant request; images belong to the linked resources. No per-category product pickers, animation settings or duplicate resource titles. The header schema is now in the reviewed editor registry; its frozen legacy record is not changed.

### Hierarchy and imagery

Roots with children disclose; leaves remain links. Clicking a root selects its first category with children. A root with only leaf children shows that initial card list directly. Leaf categories remain links. Real parent destinations are retained as separate links; empty/hash placeholders omit those actions. IDs combine section, presentation and loop indices. Translated Shopify Navigation labels own card titles.

Products use the shared `product-card` with `card_layout: 'navigation'`, delegating to `catalog-product-card`. Product navigation uses `custom.teaser_image` when set, otherwise the product's first gallery image (`featured_image`), without navigation-image overrides or reconstructed can artwork. Soda and Hard Seltzer retain the shared brand logo, flavour title typography/artwork and product background, with a contained image above the label and no light overlay. Other product navigation cards retain their editorial layout and Navigation title. Navigation omits prices and offer copy. The collection presentation retains its existing image order and labels. `catalog-card.css` now owns the common styles and loads through the global header, without globally loading collection filtering JavaScript.

Pages, Collections, Articles and Blogs may supply `custom.navigation_image`. Collections and Articles then use native `image`; Pages/Blogs have no invented image fallback. No metaobject webpage image mapping is assumed until its actual definition is reviewed. Unsupported destinations render a neutral text card. There are no Header image overrides. Internal resource fields avoid locale-dependent override URLs. Responsive CDN images use empty alt alongside their own link label; editorial crops retain Shopify focal points, including products.

### Interaction and lifecycle

Desktop opens only on click/Enter/Space, remains non-modal, and never changes categories on hover. Escape restores the owning root; outside click, focus leaving and normal navigation close without pulling focus back. Root changes reset the first category; repeated category selection does not replay. The panel is absolutely anchored below the white header and excluded from measured sticky clearance. Its own overflow stays within viewport bounds. Scroll controls use native rails, translated names and disabled endpoints.

One decorative black pill moves between root bounds on hover or keyboard focus. Priority is visible keyboard focus, hover, hidden. Difference-blended white labels/icons blend against the main header surface and moving pill; the root list remains transparent without an extra isolated white backing. Chevron/expanded state remains separate from hover. Travel uses a 480ms translation and absolute-box size interpolation without overshoot or deformation; there is no idle loop. Bounds refresh on layout, scroll, resize and font readiness.

Mobile enhances the outer native disclosure into a named native dialog with the current logo, close/cart controls, utility destinations, internal scrolling and safe-area padding. Root controls wrap; one inline category opens at a time and may collapse. No extra Soda promotional button is rendered; category destination remains an ordinary text link. The dialog traps Tab, restores the opener on explicit close and releases scroll locking on close, breakpoint changes, cart handoff and removal. Cart focus returns to its visible header control, not an old link inside the closed navigation dialog.

Shell opacity/translation uses Slow; mobile accordion height changes use Base. Desktop category changes keep the shell stationary: departing content fades over Fast, the incoming heading uses Slow, and cards fade left to right over 480ms with UI easing, starting after 80ms with 70ms steps capped at 210ms. Real delays preserve each card’s full fade duration; no parent fade multiplies the incoming card fade. Interrupted returns resume from combined painted panel/card opacity with no delay. Root opening and mobile retain the 40ms stagger capped at 160ms. Desktop content-size changes ease panel height; only new content animates. Current painted opacity/translation/height is used on interruption. Outgoing panels become inert immediately; closed native disclosures suppress inactive content. Reduced motion settles animations, height changes and the pill immediately. Theme Editor removal aborts listeners, disconnects observers, cancels animations and restores native content. Corporate disclosures and main navigation do not remain open together; programmatic cart entry dispatches the shared `sparklys:navigation-dismiss` event.

Native disclosures remain usable without the controller at every menu level. The enhanced mobile dialog alone is modal. Navigation does not add Product/Offer JSON-LD: these links are a global presentation of existing resources, not new product entities. Page-level structured data remains unchanged.

### Verification and separate content work

The menus were flat at initial implementation. On 2026-09-15, the supplied Soda hierarchy was copied through the approved Admin API to General and Seltzer, preserving menu identities. Resource Navigation image definitions were subsequently provisioned; see [Resource-owned navigation images](#resource-owned-navigation-images). These setup tasks are complete. Final merchant content, published-language behavior and any later schema/content migrations still require release review. DOM fixtures exercise nested Shop/Learn independently of store content.

Headless verification covers desktop (1440px and 1024px), phone (390px and 320px), first-category state, text-only cards, rapid category/root reversal, intermediate opacity, unchanged selection, Escape focus, outside click, modal Tab wrap/close, scroll-lock release, reduced motion, cart handoff and native three-level disclosures with the controller blocked. General/Soda/Seltzer server responses return 200 without Liquid errors. English publication remains deferred; its locale additions were included in the September draft release, but real English storefront verification is still needed when enabled.

Reproducible browser-only fixture: `agent-browser --session <isolated> eval --stdin < tests/browser/navigation-fixture.js`, then `... eval --stdin < tests/browser/navigation-checks.js`, against the approved localhost preview. This uses actual product images read from the storefront and synthetic menu labels/destinations solely in that browser's DOM. Reload removes it. It does not certify final merchant menu content or replace Liquid/server-render verification after content setup.

Additional checks: 1023/1024px breakpoint crossings and 125% text sizing had no horizontal overflow; real Enter/Escape keyboard activation worked; removing/reinserting an open mobile component left one initialized dialog and no scroll lock. `npm run check`, both JavaScript syntax checks and `git diff --check` passed. Raw jq reports the same 11 pre-existing Shopify comment-header errors; all JSON parses after stripping those generated leading comments. Test browser closed.

Navigation highlight update (Ananotes 119): starts hidden and follows hover or visible keyboard focus only. Current page/open menu no longer selects the decorative pill. Travel takes 480ms, with two transform keyframes and no overshoot, wobble or scale deformation; interruption starts at current painted bounds. Semantic current-page and expanded states remain unchanged.

Ananotes 129: the pill retains its last target while crossing inter-link gaps and fades only after leaving the root group (140ms grace + Fast fade). It resumes from painted bounds on reentry. Width/height interpolation preserves true rounded endcaps; layer ordering prevents the white navigation backing from covering the pill. Delayed hiding is cleared on teardown.

## Full-bleed navigation imagery

Navigation cards use edge-to-edge cover images with Shopify focal points, a light gradient rising from the bottom, and black uppercase titles in the shared Card size role (previously Compact). Content sits above the overlay. Text-only destinations retain the neutral card without an image overlay. Collection/PDP product presentation is unaffected; navigation image ownership and fallback order stay unchanged.

Navigation cards use the shared Small radius. The linked surface clips image and gradient together; the gradient extends one pixel beyond that clip to avoid a bright image seam along rounded edges. No separate media radius is applied.

Verified the full-bleed/small-radius presentation at 1440px desktop and 390px phone: Card title role is 32px/26px, cover images and the light bottom overlay share one clipping surface, mobile rail stays inside the viewport, and Escape closes the menu. The bottom gradient reaches solid white to prevent image color leaking along its lower edge.

Corner rendering correction: navigation media now fades through an alpha mask directly into a white card surface, replacing the separate gradient overlay. This removes image pixels from the lower rounded edges rather than painting a second antialiased layer over them. Product-background artwork is suppressed only in navigation cards; text cards retain their neutral surface. The visual gradient and title placement remain the same.

### Ananotes 132–138 refinements

The root strip is transparent and blends directly against the existing header surface; the moving black pill keeps rounded endcaps without a rectangular white backing. Category and rail carets reuse the padded 24-unit Untitled UI export (`icon-form-chevron-down.svg`), rendered at 24px and 20px respectively, retaining 44px targets. Panel titles are uppercase Newake with the shared optical correction beside controls.

Desktop panels span the viewport while their content retains the shared maximum-width gutters. Card rails extend through the right gutter to the viewport edge on desktop and phone. Resize/selection checks hide carousel controls whenever content fits and retain disabled endpoints when overflowing. Heading height stays stable when controls disappear. Parent destination actions are omitted when a child card already links to the same URL (including the duplicate About us action); unique destinations remain accessible with and without JavaScript.

Desktop category hover and keyboard focus use a lighter decorative pill with the same 480ms motion/easing and painted-frame interruption as the root highlight. The selected category retains its stronger muted surface; hover never changes selection. Pointer exit fades after a short grace period. Reduced motion and component teardown settle/cancel the effects and remove generated decorations.

Verification for 132–138: headless desktop 1440/2020px and phone 390px; rail right edge equals viewport width without document overflow; arrows hide for fitting lists; native disclosures still expose the five About us cards with scripts blocked; Escape restores Learn focus; reduced motion settles immediately. Category travel was sampled at start 165px, intermediate 231.24px and settled 273.39px without changing the selected category. Root endcaps and card clipping inspected in screenshots. Full checks and JavaScript syntax passed; the same 11 Shopify generated JSON comment headers require stripping before JSON parsing (all 34 files valid). Test sessions closed.

Drink product card correction: the navigation renderer now keeps the Figma logo/title composition (Soda Erode; Hard Seltzer existing flavour SVGs or Newake fallback). The teaser image takes precedence when set, with the first product gallery image as fallback; if both are missing the product media stays blank rather than substituting a Link image override. Generic non-product cards retain their editorial image overlay. Collection listing image behavior is unchanged.

Drink-card verification: full repository checks and final Theme Check passed. Headless 1440px/390px fixtures used existing shared catalog markup, live product featured images and the navigation classes to inspect contained media, logos, Erode Soda text and Hard Seltzer flavour artwork. These are visual fixtures, not a claim that the current collection-only menu already contains product links. Product image priority is enforced in both the navigation resolver and shared renderer. Browser closed.

Drink-product navigation cards reuse the shared can floor shadow and image/shadow wrapper. The wrapper matches the selected teaser/featured image aspect ratio and moves as one unit on hover/focus; layout contains the complete image. Shadow colour/strength/geometry are owned centrally by `can-artwork.css` and `can-shadow.liquid`. Uploaded opaque backgrounds or baked shadows remain part of the source image. Other navigation cards are unaffected.

### Ananotes 139–142

Removed the supplemental category destination links and bottom root destination button from the panels, as requested. Category summaries remain disclosures; navigable destinations are the configured cards and leaf links. Parent destinations are no longer duplicated as separate panel actions, including without JavaScript. The desktop category track starts at 18rem and grows to its longest unwrapped label; card space uses the remaining width and retains native horizontal scrolling. Mobile category labels retain wrapping where needed for small screens.

Soda product navigation uses the approved shared flavour-lockup line height (0.75), with a content-sized title and 1rem logo gap to center the visible composition. Font size remains the shared Card role; no new section-specific size or line-height token. This supersedes the earlier requirement to preserve unique parent destination actions.

### Resource-owned navigation images

The Header no longer exposes or reads Link image blocks. Resource Pages, Collections, Articles and Blogs own `custom.navigation_image`, a pinned, image-only file-reference definition with public storefront access. Collection and Article native images remain fallbacks. Product links retain their existing teaser → featured-image priority. Native file focal points are respected; images remain decorative next to the accessible link title.

Definitions were created and verified through Admin GraphQL on 2026-09-15 using `scripts/setup-navigation-images.mjs --apply`; running the script without that flag is read-only. Existing definitions and resource values are preserved. No store images or resource content were replaced. No local header-group image blocks were present to migrate. Before deploying this schema removal, inspect the latest editor-owned header group for any old Link image entries and review their migration separately. External/custom URL images can be supported by a dedicated URL + image metaobject; that optional fallback is not yet implemented.

139–142 QA: real menu product cards inspected at 1440px and 390px; all four desktop category labels remain 48px tall at 1024px without document overflow. Soda flavour titles use two 24px lines at desktop and two 19.5px lines on phone, preserving the shared font-size role. Native disclosure/card links remain reachable with scripts blocked. Theme/schema checks and syntax checks pass; browser closed.

### Uploaded product artwork bounds and collection heading links

Navigation product artwork now uses the shared `can-artwork` element with `data-auto-fit`. On image load it measures a maximum 256px alpha sample and fits the visible object into the existing media area; transparent upload padding no longer determines product scale or shadow width/contact. The shared floor shadow remains the single lighting source. Opaque photography, unavailable canvas access and no-JavaScript rendering retain complete original imagery without an added detached shadow. Teaser → featured priority and source files are unchanged. Existing collection cutouts remain server-calibrated. The scan occurs only on image load, not on pointer movement or resize; CSS owns responsive sizing and the image/shadow group moves together. Partially opaque baked lighting cannot be removed from source artwork.

Category headings backed by native collection links now link to that collection, with the existing Untitled UI caret, a 44px minimum target and shared Newake optical offset. This applies to all collection-backed Shop headings without matching translated menu labels. Placeholder/non-collection headings remain plain text. Native links work without JavaScript; caret motion respects reduced motion. No new structured entity is introduced.

Verified this refinement against real menu images at 1600px desktop and 390px phone, including the single cans, Variety Pack, sample pack and opaque Seltzer photos. Collection heading links are visible on mobile as well as desktop. Keyboard focus paints the shared outline; native collection links work with scripts blocked, with no detached synthetic shadow. Full repository checks and JavaScript syntax checks pass. All 34 content JSON files parse after stripping Shopify's existing generated comment headers; raw jq still reports those pre-existing headers. Test browsers closed.

### Active brand tab shadow contamination

The main bar's blurred box shadow previously extended upward and tinted the bottom of the pure-white active brand tab. Its shadow now paints on a pointer-transparent pseudo-element clipped at the main bar's top edge. Only the decorative shadow is clipped; dropdowns, focus rings and the bar remain unrestricted. Both active brand tabs and their concave joins stay pure white in resting, hover and focus states. Do not restore an unclipped box shadow on `.site-header__main`; testing only the tab's computed background color misses this compositing regression.

Navigation pill edge refinement: a single rounded background now paints the pill; the redundant equally sized inner black surface is removed to avoid doubling edge antialiasing. Settled bounds align to device pixels, while interrupted motion still starts at its actual painted bounds. The 480ms duration, easing, endcap radius and separate focus ring remain unchanged.

### Ananotes 143–148

Root carets now reuse the padded Untitled UI chevron at 16×16, producing a smaller 8px visible path and proportional stroke. Current-page ancestry (`data-current` from Shopify link state) supplies the resting desktop pill target after hover/keyboard focus leaves; mobile/native navigation retains a static current indicator. This supersedes the earlier hover-only baseline without changing disclosure state. No URL/title matching is introduced.

Soda Variety Pack uses explicit product-name lines so its logo/title group is centered on the visible lettering. The German product title Probierpaket has one optional soft hyphen after Probier; manual hyphenation avoids browser-specific breaks. These are rendering treatments of existing product titles, not new storefront copy. Other translated product names retain their original text. Non-drink product navigation cards now contain the entire image above the label, without the editorial crop/fade; pages and collections retain their full-bleed treatment. Image choice remains teaser → featured.

143–148 QA: desktop cards/carets inspected at 1440px; 390px Variety label group centered within .01px and Probierpaket exposes only its requested soft-hyphen break. Learn is highlighted on About us and regains the pill after hovering another root. Mobile current state and no-JavaScript desktop current styling verified; no horizontal overflow. Full checks and JavaScript syntax pass. Test browser closed.

Navigation product background fallback: all product navigation cards use the shared `--color-surface-muted` surface, matching neutral collection cards. A valid `custom.gallery_gradient` or `custom.gallery_background_image` takes precedence through the shared product-background renderer (image before gradient). This also applies to non-drink products; blank or rejected gradients keep the neutral fallback. Navigation no longer invents default Soda/Seltzer gradients. Collection cards and editorial navigation imagery are unchanged.

Navigation accessory/clothing product titles use the shared Compact role (18–20px), following the tote-bag annotation. Drink logo/flavour compositions retain their Card role; editorial navigation cards and collection cards are unchanged.

Ananotes 151 (2026-09-16): outgoing desktop category content fades at its painted absolute position, excluded from grid sizing. Incoming content alone determines natural panel height. The resize observer compares intrinsic target heights rather than interpolated outer-panel frames; interrupted height animations start at the current painted height, and unchanged targets do not restart. A stable scrollbar gutter prevents width/reflow feedback during height changes. Mobile native accordion behavior, reduced motion and inert outgoing content remain intact.

151 QA: DOM-only unequal-height regression passes (714px → 512px interruption → 714px), including same-target no-restart and outgoing inertness; normal categories settle to 484px without repeat height effects. Tested 1440px desktop, 1024px reduced motion, and real Enter/Escape category navigation with focus restored to the root trigger. Mobile overview/cart checks and no-JavaScript checks documented in annotation history. No schema/menu data changed.

### Shared glass and active-tab cutout — 2026-09-28

On branded desktop headers, `assets/header-glass.js` enhances the decorative `header-glass` layer. The header owns one 90% surface tint; the outer `.shopify-section-header` owns the single 1.5rem (24px) backdrop blur. The main navigation has no additional tint/filter. An SVG even-odd path paints the black switcher with a transparent active-tab opening, including rounded top corners and concave lower joins. The page therefore shows through the same glass beneath both rows, without black showing through the active tab or double-filtered seams. The decorative SVG is hidden from accessibility and cannot receive pointer input.

The opening follows measured tab bounds and existing radius/curve dimensions. A border-box ResizeObserver updates it for viewport, font and layout changes, with a font-ready measurement and disconnect cleanup for editor replacement. It does not measure or animate on scroll: the existing header scroll-intent movement carries the entire composition together. The main bar no longer isolates its color-inverting navigation labels from the shared glass; the existing clipped bottom shadow remains separate.

On phone, with no active brand, or before/without JavaScript, the main-bar tint and opaque active-tab fallback remain, over the same outer-wrapper blur. No schema, menu data, locale or structured-data changes are needed. This supersedes the earlier opaque-white-tab rendering treatment; the invariant is now an untinted join onto the shared glass, rather than a hardcoded white pixel color.

Repeatable geometry/lifecycle checks: run `tests/browser/header-glass-checks.js` through `agent-browser eval --stdin` on a branded desktop page. This checks the single blur owner, transparent opening, black strip, width changes, disconnect/reconnect and overflow.

Verification: headless Chromium at 1440px and 1024px on Soda/Hard Seltzer, 390px phone, upward/downward scroll including an intermediate reveal frame, colored-background inspection, keyboard Tab focus, menu open/Escape, reduced motion, and blocked-script fallback. Geometry/resize/reconnect checks pass; phone has no overflow and does not activate the shared desktop filter. Repository checks and JavaScript syntax checks pass. Safari was not exercised in this environment; its native backdrop compositing remains a manual cross-browser check. Test browser closed.

Tab spacing refinement: adjacent brand tabs use a 1rem margin, just 0.125rem above the original spacing. The wider 1.875rem trial was rejected because it separated the labels too far; keep the compact composition.

### Page-navigation continuity

The header uses unique `storefront-header`, `storefront-logo`, `storefront-switcher` and `storefront-actions` snapshot names under the shared [page navigation transition contract](../design-system.md#page-navigation-transitions). Native geometry animation bridges scroll-position differences; logo, world switcher and actions crossfade independently. A centered 240×72px desktop / up-to-148×64px phone logo box preserves each image's existing proportions and prevents brand changes from moving adjacent controls. The outgoing main shell is omitted so the previous mega menu is not carried across; its incoming shell remains opaque. No open menu or scroll-intent state is persisted. Reduced motion and unsupported browsers retain normal navigation.

Navigation initialization places the existing current-item pill at its final opacity/geometry without an entrance animation, replacing the server-rendered current highlight in the same task. Later hover/focus movement retains its existing animation. This prevents an active Shop button from disappearing and fading back in on every page.

Verified desktop native brand navigation and a scrolled Hard Seltzer → Home transition, including a paused intermediate frame: logo bounds match across brand variants, group position interpolates 14px → 47px, and the current pill has opacity 1 with zero animations at transition readiness. Same-brand Soda collection → product navigation also retains pill opacity 1 without a startup animation. At 390px, keyboard Enter navigation to Home preserves the 148×64px logo box without page overflow. Browser Back succeeds; reduced motion reports no active view transition or logo snapshot name. A fresh script-blocked session retains the black server-rendered current-item button. Safari remains unverified.

## Card motion — Ananotes 158

Shared catalog artwork lifts vertically without scaling, using Fast duration and UI easing. Navigation cards retain their staggered opacity entrance but no additional card translation; the panel still owns its shell transition. This avoids overlapping card and artwork movement. At 2159px, frame sampling measured an 8px lift with zero horizontal or width drift; rapid hover reversal was exercised and the settled composition inspected.

### Blur and view-transition boundaries

Keep the backdrop filter on `.shopify-section-header`, the same element that owns the header snapshot name. A named ancestor isolates descendant backdrop sampling; placing the filter on `.site-header` or `.site-header__main` leaves the computed blur intact but prevents it from blurring the page. The outer wrapper owns both prefixed and standard backdrop-filter in all contexts, including reduced motion. Child surfaces supply tint, not duplicate filters.

Verified with a browser-only black/white stripe probe before/after at 1440px and 390px: sharp stripes behind the header become blurred, including the active cutout. Both Soda and Hard Seltzer pass the updated single-blur, cutout, resize and lifecycle checks after initial tab transitions settle. Brand navigation and reduced-motion blur were checked; repository checks pass. Temporary probes and test browsers were removed.

Corporate-menu stacking: the world switcher is explicitly positioned at header-local z-index 4, above main-bar controls and navigation panels. Its view-transition group also paints above logo/actions snapshots. A popover's internal z-index cannot escape the switcher's snapshot-created stacking context; preserve the ordering on the parent rather than increasing the popover number. Verified on Soda and General desktop headers by screenshot and hit-testing the first menu link where it overlaps Store finder; keyboard Escape closes and returns focus to the summary. Phone keeps the switcher hidden without overflow.

## Ambient hero backdrop

When the first main section contains an enabled ambient hero slider, `hero-slider.css` reduces the existing translucent header surface to 80% opacity (the glass wrapper when enabled, otherwise only the main bar) so its glow can show beneath the navigation. Existing backdrop blur and z-index preserve foreground legibility and menu layering. The hero bleeds beyond its content wrapper; horizontal containment happens at the viewport without a new scroll ancestor. Pages without a leading ambient hero retain the default glass surface.

Ananotes 173 (2026-10-04): navigation-card scrollbars are visually hidden with standard and WebKit rules. Horizontal overflow, native touch/trackpad scrolling and the focusable region remain available.

## Header action fill

Cart and account circles use the shared borderless oval sweep through an inner `site-header__action-surface`. Existing 46px circles, icon dimensions and pale neutral appearance remain. The circle uses an opaque 5% foreground/surface mix so difference-blended icons stay dark at rest and light under the sweep. The inner surface clips the sweep; the outer action stays unclipped so the cart-count badge can overlap normally. The cart remains a localized link with drawer enhancement and keyboard focus. The account is a native, keyboard-accessible link to `routes.account_url`, with a localized accessible name. Reduced motion uses the shared button fallback.

## Customer account entry

The account icon links to Shopify's `routes.account_url` in the same tab on desktop and mobile. Shopify owns authentication and the hosted account destination; no custom login page or JavaScript interception is required. The existing circle and hover/focus treatment remain. The decorative inner surface stays aria-hidden; the anchor receives a localized Account / Kundenkonto screen-reader label. This implements account entry only, not an audit of signed-in account features or subscription-provider management. See [Shopify sign-in routes](https://shopify.dev/docs/storefronts/themes/sign-in).

Account-entry verification: the rendered German link is named Kundenkonto and has a 46px target on desktop and phone. Keyboard activation follows the native link. The public `https://sparklys.ch/account` route reaches Shopify's Sparklys-branded German sign-in page with its email field; no credentials were entered. The localhost Shopify CLI proxy rewrites the hosted redirect to a local `/41259008164/account` path and returns 404. This is a development-proxy limitation; the theme retains Shopify's native route rather than hardcoding an authentication URL. Signed-in account flows remain unaudited.

Product navigation cards reserve a shared 21.25rem frame. Media can shrink slightly to accommodate longer labels such as Hard Seltzer Variety Pack, while labels retain their natural height. This removes the previous roughly 3px Soda/Seltzer panel-height difference without changing catalog cards outside navigation.

Category-motion verification: headless 1440px desktop showed all four Shop category panels at 484px with 340px product cards. At an intermediate Seltzer entry frame, card opacity progressed left to right (0.178, 0.0001, 0). Rapid Soda/Seltzer reversals settled with one active category, inactive content inert and no leftover animations. Reduced motion settled immediately; the 390px mobile dialog retained category selection and had no document overflow. Repository checks, JavaScript syntax and JSON validation passed.
