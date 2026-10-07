# Annotation history

Archive of approved storefront annotation fixes. Ananotes is the current review tool; older entries retain their original onUI provenance. See [Ananotes browser annotations](development.md#ananotes-browser-annotations) for tool and bridge context. Save the original comment, annotation ID, affected section, implementation summary, approval date, and commit reference before deleting an annotation from the canvas. Delete only the approved IDs, never indiscriminately clear a page that may contain new feedback.

Keep durable implementation rules in the [design system](design-system.md) and owning section documents. This history records decisions; it is not a restorable backup of the annotation tools' complete metadata.

## 2026-09-05 — Homepage visual corrections

Page: `http://127.0.0.1:9292`.

All seven fixes were approved for archival and removal by the user and removed from onUI. Implementation commits: `15048b6` (shared typography and heading rhythm), `a91aac9` (ingredient/reason compositions and award exports), and `cca30d7` (Subscription account-link spacing).

### Soda 3 Reasons — composed headline

- Annotation ID: `1788625983351-dbiuidutb`
- Original comment: “alignment not good, check with figma”
- Target: large numeral and two-line `.soda-reasons__heading` (original rectangle: x646.43, y8481.82, width502.63, height173.37).
- Fix: aligned the final text baselines and matched the reference lockup: 82px words / 62px line height beside a 192px numeral, scaling proportionally. Documented the explicitly approved composition exception without changing global display typography.
- Reference: [Soda 3 Reasons](sections/soda-three-reasons.md).

### Hard Seltzer Ingredients — headline alignment

- Annotation ID: `1788631813830-c6sz8m18n`
- Original comment: “move a bit down, vertically align to the 3”
- Target: `h2.seltzer-ingredients__heading > span:nth-of-type(2)`.
- Fix: centered the composition across breakpoints and applied a font-relative `.08em` optical offset to the words beside the outlined numeral. Kept the shared Newake line height.
- Reference: [Hard Seltzer Ingredients](sections/hard-seltzer-ingredients.md).

### Soda 3 Reasons — leaf illustration

- Annotation ID: `1788631934537-5a4fu0fpi`
- Original comment: “image is like 2 layers and wrong, export freshly from figma as one svg and correct it”
- Original target: `span.soda-reasons__leaf > img:nth-of-type(1)`.
- Fix: replaced the independently positioned layers with the complete `soda-reason-leaf.svg` export, preserving the source mask, rotation, and offsets. No grain was baked into the asset.
- Reference: [Soda 3 Reasons](sections/soda-three-reasons.md).

### Hard Seltzer Awards — cropped shadows

- Annotation ID: `1788631985886-wgow524hq`
- Original comment: “shadows of the award images are cropped in export, freshly export from figma and respect the shadows look theyre not cropped”
- Target: `div.seltzer-awards__inner.page-width`.
- Fix: re-exported all three complete medal compositions at 3× resolution with full shadow bounds and transparent backgrounds. Converted to WebP with lossless alpha and updated intrinsic dimensions. Transparent overlapping margins no longer cover adjacent shadows with white rectangles.
- Reference: [Hard Seltzer Awards](sections/hard-seltzer-awards.md).

### Soda 3 Reasons — card-title line height

- Annotation ID: `1788634787670-vj965d3ca`
- Original comment: “lineheight not good, use design token centrally for lineheight also here, make sure letters dont overlap (refer figma)”
- Target: `article.soda-reasons__item:nth-of-type(2) > h3`.
- Fix: mapped every reason-card title to the central small-Erode heading role (`--line-height-heading-small-erode: 1`), giving 32px type / 32px leading at desktop instead of tight display leading.
- References: [Design system](design-system.md), [Soda 3 Reasons](sections/soda-three-reasons.md).

### Subscription — account-link spacing in both worlds

- Annotation ID: `1788634893861-l4j5v15j1`
- Original comment: “change lineheight, use design tokens also here, refer to figma. also do it for our seltzer subscription section”
- Target: `.subscription--soda .subscription__account`; fix also applies to Hard Seltzer.
- Fix: introduced the shared `--line-height-body-compact: 1.3` role and removed the oversized visible sign-in line box. A pseudo-element preserves the 44px hit area; keyboard focus remains visible.
- Reference: [Subscription](sections/subscription.md).

### Soda Ingredients — card-title line height

- Annotation ID: `1788634999475-yrppiafbk`
- Original comment: “also here: centralized token for lineheight, dont overlap chars”
- Target: `article.soda-ingredients__item:nth-of-type(1) > h3`.
- Fix: mapped all ingredient-card titles to the same small-Erode role as Soda 3 Reasons, retaining clear multiline separation and responsive sizing.
- References: [Design system](design-system.md), [Soda Ingredients](sections/soda-ingredients.md).

### Verification

The implementation was visually checked against the relevant source frames at desktop and phone widths, including a 320px overflow check. Subscription keyboard focus and its 44px hit area were verified. Theme Check, asset budgets, JavaScript syntax, and whitespace checks passed. The raw JSON command encounters two existing Shopify-generated leading comments; all theme JSON parses after stripping those comments.


## Ananotes — 2026-09-07 cart refinements

Resolved after local preview checks: 1788811451259-22sk17s2e (smaller aligned item discount badges), 1788811498500-u07be3c4o (content-width coupon chips with accessible × icon removal), 1788811632990-mq5othhpd (quantity input outline replaced by neutral focus fill), 1788811650536-0fxhdyunp (stepper hover transition with reduced-motion support), and 1788710115760-w9f8au3z0 (240px desktop Hard Seltzer header wordmark). Real SPARKLYS10 apply/removal and phone layout verified; desktop logo width/overflow checked. Original annotation comments remain in Ananotes. The two product-title notes containing only test remain pending.

## Ananotes — 2026-09-07 supporting totals and badge icon

- #15, `1788811766666-aqdfei6df`: “back to normal text color (also for versand)” — subtotal/shipping use the General Primary text token again. Savings and old-price styles remain unchanged.
- #16, `1788812154630-odvlheb3a`: “make smaller to fit smaller text” — item-discount tag icons scale to 1.2em (12px with Badge text), preserving other tag icons at 16px.

Verified with a real SPARKLYS10 allocation in the local preview, drawer and full cart at 390px and 1440px. Both supporting rows render normal black text; badge icons measure 12px; neither surface overflows. Theme Check, asset/typography/cart checks, JavaScript syntax, JSON validation (ignoring Shopify generated leading comments), and whitespace checks passed. Both notes were marked resolved through MCP, preserving their original comments and IDs. The isolated headless browser was closed.

Ananotes 1788812888855-bhnq4kvnx: reduced coupon chip padding to a 44px total control height. Ananotes 1788812951578-s9loxmkg2: replaced fixed-diameter shared button sweep with a button-sized clip-path reveal; verified completed hover coverage on 536px primary and 1000px secondary buttons in an isolated browser fixture. Shorthand fix ananotes is documented in AGENTS.md and development.md.

Resolved Ananotes 1788813349552-nlkqyxldb: coupon chip icon bounds have equal 12px left/right spacing. Resolved 1788813883181-vz1jitci8: quantity hover uses the same fixed 40px circle inside its 44px target; only color transitions. Existing coupon apply/removal behavior preserved.


## Ananotes — 2026-09-08

Resolved 1788816602075-ly7n4whz0 and 1788817194590-1fkb97jr9: normal shipping-message text in a compact light-gray panel, including qualified carts. Resolved 1788817097316-7i1w448l2: animated circular coupon-remove hover/focus surface. Resolved 1788817280541-01brdeam6: changed line prices fade over 200ms after confirmed updates, respecting reduced motion. Resolved 1788818112435-4igirlhfb: sticky product info reserves the measured header height plus clearance. Verified desktop header bottom 100px versus info top 149px, qualified panel #f2f2f2 with black text, remove hover opacity .12, quantity 2→3 with price transitions on both cart surfaces, and phone layout without overflow.

## Ananotes — 2026-09-09 Swiss ID simplification

Processed notes 1788868726020-ifjq22clt (accent cart-count badge/white ring), 1788912114545-4f55mc72p (remove Swiss optional field), 1788912145993-03iwjp99v (single final digit), 1788912184374-2k6m1zbqk (compact check digit), 1788912221487-m81cvn5cd (uppercase/shorter document number), 1788912260816-xxd8zhm9p and 1788912268727-tv4sbpi7e (numeric dates), 1788912385834-ni0vhsry0 (remove filler checkbox), 1788912400488-fwcnahfee (remove visible contextual paragraph), and 1788912628891-8gkokxiw5 (info-style privacy notice). Originals remain in Ananotes. Privacy copy deliberately retains accurate same-tab/12-hour wording instead of claiming unimplemented account persistence. All strict MRZ checks remain; this only reconstructs the supported Swiss filler blocks before validation.

## Ananotes — 2026-09-09 supplied ID artwork and copy

1788943331449-irflk3fr5: applied requested privacy wording (storage behaviour unchanged). 1788943429323-zdt11m5vo: use merchant-supplied Swiss ID background and overlay actual fields in its gaps. 1788943464173-qrhglpicz: primary label “Prüfen & zur Kasse”, English “Verify & checkout”. 1788943500394-eqcguo5o5: remove bottom back button; retain accessible close and Escape dismissal. Original comments remain in Ananotes.

## 2026-09-09 — Swiss ID code guide

Completed five localhost notes: #44 (`1788944638176-zn8uqqalm`) M/F guide; #45 (`1788944766607-m26bqycqu`) Primary-text fillers; #46 (`1788944785235-n7o3fhtrf`) filler after document number; #47 (`1788944856639-9pfr3i4tq`) localized example name line; and `1788944892009-tk5bv9vuy` larger shared Compact type and fillers spanning available width. Decorative text does not alter submitted fields or validation. Verified phone/desktop layouts from 320–1440px, enlarged text and keyboard focus; full theme checks passed. Existing Shopify comment headers require comment-aware JSON validation. No annotation records were deleted and no shared-theme deployment was performed.

## 2026-09-09 — Age-check annotations #49–59

Implemented all eleven pending localhost notes: blue privacy notice; white Help label with question/left-arrow icons; cropped pale artwork edge; whole-character filler fitting for ending/name rows; revised Swiss help instructions/contact; shadows for card/help image; removed pre-card location paragraph; responsive label/select row and revised label; removed expired-document sentence from intro. Verified phone/desktop, narrow breakpoints, keyboard contact access, retained input, rapid reversals and reduced motion. Full checks passed. Original annotations retained; shared theme not deployed.

## Ananotes 60–64 — 2026-09-09

Resolved locally: help-image right edge (60), help/back shadow clipping flicker (61), shorter Swiss instructions (62), stable floating help/back control (63), and red rejected-coupon badge with a separate alert explanation (64). Verified with isolated headless phone/desktop checks; no publishing or annotation deletion.

## Ananotes 65–68 — 2026-09-09

Completed locally: compact recommendation drink-pack labels (65), vertically centered coupon error icon (66), subtle unselected variant hover (67), and stable coupon badge sizing during recommendation/cart updates (1788950707208-f3qu4ygqj; reference not yet assigned by bridge). Verified live label rendering and simulated coupon section updates on phone/desktop. No publishing or annotation deletion.

## Ananotes 69–70 — 2026-09-09

Fixed the remaining help-card downward movement by removing the unequal panel top padding (69). Moved field validation below the card within the gray canvas and added an error surface and alert icon (70). Verified identical image/card top positions before, during and after toggles at desktop and phone widths, including reduced motion. Resolved locally; nothing published.

## 2026-09-09 — Cart and age-check form baseline

- `1788956797602-cmqhzk8f7`: cart coupon input adopts shared pill styling in drawer and full cart. Verified editable after the cart refresh settles, 3px border and 999px radius.
- `1788956839763-sts5ank6b`: document selector adopts the shared styled dropdown, keeping the native select and existing profile-change handler. Verified keyboard End/Enter selects the international passport, first Escape closes the dropdown without dismissing the age dialog, and phone/desktop positioning.
- Theme checks, asset budgets, JavaScript syntax and whitespace checks pass. Strict jq still rejects two existing generated comment headers; comment-aware JSON parsing passes. Browser checks use an isolated session; no checkout was submitted.

## 2026-09-09 — Youth protection and toast close colors

- `1788957014550-x2n7lvpee`: combined the youth-protection rationale, configured online minimum age and ID/passport instruction in English/German. Focused wording on the merchant’s sales policy rather than a general statutory consumption-age claim. Verified both 18/16 interpolation and phone layout.
- `1788957791606-cr2pwobie`: close glyph and hover/focus surface now derive from each toast’s status palette; verified red error and yellow warning hover colors in the browser.
- Theme checks, JavaScript syntax and whitespace checks pass. Existing generated JSON comment headers require comment-aware parsing, which passes. Isolated browser closed.

## 2026-09-11 — PDP and age-check feedback

Implemented notes 76–98 plus the Soda variety artwork note: compact subscription layout, inline price comparison, nested frequency selector, Figma tick/copy/artwork proportions, sticky purchase column, robust description cutoff, transparent payment marks, shipping formatting/link cleanup, header cart icon, removal of duplicate logos and pause control, hover/focus gallery arrows, and generic warning-to-success age fields without digit placeholders. Note 75 is partially addressed: shop-policy copy updated, broad age-16 legal clause omitted pending wording review. No shared-theme deployment or publishing.

## 2026-09-12 — PDP and shared action refinements

Resolved Ananotes 100–113 after local implementation and phone/desktop checks: delivery labels, badge sizing/continuous slow rotation with pause, hidden redundant prompts, compact purchase spacing, stable frequency expansion, faster bottom-up button sweep, payment artwork corners, smaller cart glyph, white active brand tab, and orange cart-removal hover. Keyboard, reduced motion, native no-JavaScript plan options and subscription add-to-cart were checked. Note 75 remains acknowledged with its previously documented age-wording review; its approved shop-policy sentence is already implemented. No shared-theme deployment or publishing.

## 2026-09-15 — Product overview and collection feedback

- 115: canonical PDP link fallbacks, updated Maracuja/Holunder cutouts and complete transparent script logos from Figma, and alcohol badge behind growing can artwork. Explicit merchant links remain authoritative.
- 117: paired Variety Pack artwork shares the card lift/scale transition while retaining individual can rotations; keyboard focus and reduced motion verified.
- `1789447352099-q7p2bn932`: removed the collection hero pause button and its unused handlers/styles; visibility suspension, reduced motion and editor animation setting remain.
- 116 remains acknowledged: local Offer card page resolution and four editorial template starters are prepared. Hidden-page discovery/creation and template assignment are not performed: Admin API lacks page scopes and store-data changes remain a separate authorized step. See Offer cards documentation for the concrete destination map. Earlier note 75 remains unchanged pending wording review.

Verification: local desktop and 390px phone rendering, all four PDP URLs and artwork loading, intermediate and settled paired-can transforms, preserved rotations, keyboard focus and static reduced-motion state. `npm run check`, JavaScript syntax checks and `git diff --check` passed. Raw jq rejects existing Shopify comment headers; all 34 JSON files parse after removing those headers. No store content or shared draft deployment changed. Isolated browser session closed.

## 2026-09-15 — Ananotes 119–126

- 119: input-only navigation highlight, hidden initially, 480ms travel without wobble/overshoot; semantic active states retained.
- 120–122: removed hero footnotes, reduced sky scale and removed sky parallax, added staggered copy entrances to both product-world heroes. Sky uses feathered mirrored source panels because the Figma wide composite includes baked-in cans; separate can motion remains.
- 123–124: visually hidden count/loading live region (fetch errors still visible), smaller complete product images with contained proportions and shared media floor; navigation cards excluded.
- 125–126: shared regular-button outline paints above sweep; inverse border for light Poster actions and foreground border for footer newsletter action. Small-button hit targets preserved.

Verified headlessly at 1440px and 390px: navigation starts/returns hidden, 480ms two-keyframe travel, hero intro stagger (0–200ms), both hero footnotes absent, reduced-motion hero suspension, product containment/no viewport overflow, white Poster hover outline and black newsletter hover outline. Theme checks, JavaScript syntax checks and diff whitespace checks passed; JSON parsed after removing Shopify-generated comment headers (raw jq retains known header errors). Browser closed. Notes 75 and 116 remain acknowledged for their previously documented separate work. No deployment or store-data changes.

## 2026-09-15 — Embedded newsletter action

Resolved `1789472107286-i4ilkm05c`: restores the newsletter's white inset outline through reusable `button--embedded`, superseding note 126's foreground border. The border uses the input surface token and remains above the hover sweep. Desktop rest/hover and 390px keyboard-focus checks passed, with no horizontal overflow; no newsletter signup submitted. Full checks, theme.js syntax, header-aware JSON parsing and diff checks passed. Isolated browser closed. Earlier notes 75 and 116 remain acknowledged.

## 2026-09-15 — Ananotes 128–130

- 128: embedded newsletter action now combines its white outer edge with a foreground inner ring, so both idle and white-hover states have the appropriate outline.
- 129: navigation pill uses translation and absolute width/height instead of scaling; corrected layer ordering, retained target through link gaps, delayed/faded exit and painted-state interruption preserve continuous travel and round endcaps.
- 130: both collection heroes follow fine-pointer movement throughout the viewport, including over the header; leaving the hero no longer resets motion. Browser exit/blur, touch, reduced motion and offscreen guards remain.

Verified desktop intermediate/settled navigation bounds and rounded rendering, newsletter hover appearance, pointer target updates above both heroes, phone keyboard focus, reduced-motion suspension and no horizontal overflow. Full theme checks, JS syntax checks and diff checks passed; JSON validated after stripping Shopify comment headers (raw jq still rejects generated headers). No newsletter submitted. Test browser closed. Notes 75/116 remain acknowledged; no deployment or store-data changes.

## 2026-09-15 — Product Overview shared floor

Resolved `1789473290267-4nhpslh9z`: applied the requested Seltzer shadow top 93.1% / left 3%, then lowered the whole artwork composition proportionally by 1.5% to compensate for the new cutouts' transparent bottom margin. Visible alpha-bound can bases now align within 0.01px at 1440px desktop and 390px phone. Verified 1379px hover retains the combined shadow/can composition, without page overflow. Full checks, theme.js syntax, header-aware JSON parsing and diff checks passed. Browser closed. No content settings or deployment changed; notes 75/116 remain acknowledged.

## 2026-09-15 — Navigation refinements (132–138)

Removed the root navigation's white backing, kept clean rounded highlight bounds, replaced enlarged tight-crop carets with padded library artwork, omitted duplicate parent destinations already present as cards, extended rails to viewport edges, hid redundant scroll controls, added a lighter traveling category hover/focus highlight, and uppercased panel headings. Verified desktop/phone, native fallback, keyboard, reduced motion and intermediate category travel. No theme deployment; separately authorized menu copies were backed up and verified through Admin GraphQL.

## 2026-09-15 — Navigation composition (139–142)

Removed supplemental category/root destination actions; widened the desktop category track to at least 18rem with unwrapped labels; centered the logo/flavour composition and reused the 0.75 flavour-lockup rhythm with deliberate Soda title line breaks. Verified real menus at desktop 1440/1024px and phone 390px, plus native disclosure links with JavaScript blocked. Resource image ownership was changed separately at merchant request: Header image blocks removed and pinned navigation-image definitions provisioned through Admin GraphQL. Full checks pass; generated Shopify JSON comments remain the only raw-jq limitation.

## 2026-09-15 — Navigation refinements 143–148

Resolved 143–148: smaller padded root carets; ™ in automatic collection hero eyebrows; content-width Variety Pack title alignment; optional Probier-paket soft-hyphen wrapping; contained accessory/clothing product media; current-root ancestry highlighting with hover/focus return. Also removed duplicate pill painting and snapped settled bounds to device pixels. Verified desktop screenshots, 390px current state and label layout (Variety lockup center error under .01px), restored Learn pill after pointer exit, and no-JavaScript current-root styling. Full checks and JS syntax pass; existing Shopify JSON comment headers require stripping before parsing. Test browser closed.

Older 116 remains acknowledged: existing hidden target pages were found via read-only Admin API; local Companies fallback now prefers Firmen. Store template assignments/publication remain separate. Older 75 remains acknowledged for its outstanding legal-copy review; no legal text was changed.

## 2026-09-15 — Soda hero and navigation product typography

- Resolved 149 (`1789499778046-gy42khbzc`): Soda/Erode collection hero matches Figma 8734:14210 leading, 62/75, through a documented composition exception. Shared Display sizing and other heading fonts remain unchanged.
- Resolved `1789502158203-h6sldj0s6`: accessory/clothing navigation product titles use Compact (20px desktop, 18px phone). Branded drink lockups and collection titles are unchanged.
- Verified rendered desktop 1440px and phone 390px, including headline leading and navigation cards. Repository checks, syntax and diff checks passed; generated Shopify comment headers were stripped for JSON validation (34 valid files). Headless browser closed. Existing notes 75 and 116 remain acknowledged.

## 2026-09-16 — Navigation continuity, overview grid and cart UI

- 151 (`1789502246933-94un3c521`): remove outgoing category content from grid sizing during its fade, cache intrinsic panel targets and preserve painted height on interruption. Stable scrollbars prevent width feedback. `tests/browser/navigation-height-checks.js` exercises a DOM-only unequal-height fixture: 714px → 512px intermediate → 714px reversal, unchanged-target animation identity and inert outgoing content.
- 152 (`1789502513357-fpkvpv9vz`): four product overview cards use a 2×2 compact grid below 1200px; navigation pills wrap. No horizontal scroll at 320px/390px. Existing can/floor/brand/flavour composition remains; compact cards omit their decorative arrow and retain full-card native links.
- 153 (`1789518731663-aw2ngm88f`): cart drawer title selects shared Newake tokens and the .06em optical correction instead of inheriting editorial Erode.
- `1789518761620-j71645ktp`: toast host centered at the viewport top, including above modal content. Desktop center measured 720px at 1440px; phone center 195px at 390px.
- Verified real desktop/phone rendering, 1024px reduced-motion navigation, keyboard category activation/Escape with root focus restoration, and script-blocked phone overview with all four native links. Full checks, syntax and whitespace passed. All 34 JSON files parse after removing Shopify's existing generated comment headers; raw jq continues to reject those comments. Isolated browsers closed. Prior blog work preserved; no store-data changes or deployment. Older notes 75/116 remain acknowledged.

## 2026-10-02 — Contact required-fields note

Resolved Ananotes 162 (`1790882123315-5dvjzxud8`): removed the standalone required-fields explanation, retaining individual labels, asterisks and all four native required constraints. Verified 390px/1440px rendering and no horizontal overflow. Full repository, JavaScript, JSON and whitespace checks passed. Browser closed. Older 75 (wording review) and 116 (store assignments/publication) remain acknowledged under their existing scope decisions.

## Remaining notes 75 and 116 — 2026-10-02

- 75: finalized the cart-first age introduction in English/German with explicit online-shop policy wording and the configured age placeholder. The broad retail age-16 assertion is omitted. Verified rendered German copy in the existing dialog at desktop and 390px with no overflow; no document data or checkout submission used.
- 116: verified all four template files on the development theme and assigned existing hidden Retail, Gastronomie, Events and Firmen pages to `retail`, `gastro`, `events`, `companies` respectively through Admin GraphQL. Backed up prior records outside Git and verified assignments/hidden status by read-back. Default resource links already exist; the homepage correctly renders non-linked cards while destinations remain hidden. No duplicate pages or publication.
- Repository checks, JavaScript syntax, header-aware JSON parsing and whitespace checks passed. Isolated browser closed. No shared/live theme deployment.

## Press article logos — 2026-10-02

Resolved note 163 (`1790931135010-5cf8t9f8d`): publisher logos now appear on the left inside each article Link box, replacing separate publication headings. Article titles, source URLs, accessible new-tab behavior and ItemList data remain intact. Verified desktop and phone rendering, 320px overflow, loaded logos and keyboard focus. Full checks passed; test browser closed. No store content edits or publication.

## Notes 164–166 — 2026-10-02

164: external press article links use the official Untitled UI external-link icon; internal cards retain chevrons. 165: wide-desktop packaging label uses cap/alphabetic text-box trimming for visible centering, with phone styling unchanged. 166: Contact/Press newsletter choices center checkbox and label without the previous top offset. Verified desktop/phone, exact annotation viewport geometry, icon orientation, keyboard ring and no overflow. All quality gates passed; isolated browsers closed. No store data, template content, submission or publishing changes.

## Notes 167–171 — 2026-10-04

- 167: drawer close uses the existing Untitled UI X mask, centered geometrically in the 44px control/32px circle instead of a font glyph.
- 168: quantity step updates restore the initiating plus/minus button after Ajax replacement, preserving keyboard focus without forcing the number-field caret. Direct numeric edits retain their input target; a now-disabled decrement falls back to a usable control.
- 169: standalone editorial Image blocks and inline rich-text images have no default rounding/shadow. Explicit image-and-text panels retain their surface treatment.
- 170: mobile Soda/Hard Seltzer collection heroes place cans first, then copy, shop button and benefits. Desktop copy/art columns remain intact.
- 171: standalone Text and image uses the shared reversible poster-motion surface/text reveal, with static reduced-motion and no-JavaScript fallbacks. Embedded instances remain static.

Verified in isolated headless Chromium at 390px and 1440px: centered close geometry and screenshot, real isolated-cart quantity 1→2→1 with button focus instead of a caret, visible keyboard focus, both mobile collection orders and desktop columns, unframed About image, intermediate/settled scroll animation and reduced-motion cancellation. Script-blocked homepage keeps content/action visible and mobile collection order remains intact. No checkout or customer data used. Full repository, JS syntax, JSON and whitespace gates pass. All task browsers closed; no shared/live deployment.

## 2026-10-04 — Content Slider, navigation scrollbar and Soda badge

- Ananotes 172 (`1791145621067-x91ehnl3s`): viewport-bleed cards now settle inside shared page gutters after Next/drag, preserving the initial container inset. Verified second-card left edge at 16px on 338px phone and 32px on 1600px desktop, plus a 32px trailing gutter at the end.
- Ananotes 173 (`1791148008616-s6ivdtsiy`): hid navigation-card horizontal scrollbar without disabling native overflow or the focusable region. Verified the open desktop Shop panel and scrollbar styles; touch/trackpad behavior remains native.
- Ananotes 174 (`1791148102774-to4gx1956`): separated rotating Soda badge state from gallery hover/manual-stop state. Browser checks confirmed motion continues after interaction and across its 40-second iteration boundary. Regression tests cover hover/manual stop, offscreen, hidden-tab and reduced-motion suspension/resume. Gallery autoplay rules are preserved.

Only the local development theme was updated. Test browser closed; no records deleted. Resolution status is stored through the Ananotes MCP bridge after checks pass.

Ananotes 175 (`1791149627139-b3ghm5eia`): added the existing reversible card reveal to Content Slider with bounded horizontal stagger and stationary geometry. Studio fixtures share the wrapper. Verified intermediate, complete and reverse states, keyboard-focus reveal, phone layout and reduced-motion cancellation; no overflow. No schema or saved content changes.

Ananotes 176 (2026-10-04): corrected badge timing to use the nearest word on the same wrapped line instead of its zero-height baseline anchor. At 1600px and 390px, all three badges matched their neighboring text opacity exactly at intermediate scroll positions in both directions, with no overflow. Full checks passed; isolated browser closed.

## Design Studio note 1 — 2026-10-05

Resolved `1791041936134-i5edxlua3` for port 9293: shared checkboxes retain their white field surface when checked/mixed, with a bold black tick or minus instead of a filled box. Added a checkbox-only bold derivative of the existing Untitled UI check path; radio/dropdown icons remain intact. Verified checked/mixed/disabled rendering in the Studio, native Space transition from mixed to checked, focus and 390px overflow. Repository checks passed; test browser closed.

## 2026-10-06: Ananotes 177–180

Removed Product Overview top padding only at its existing compact breakpoint (1200px and below), removed Offer Card arrow decorations while preserving native whole-card links when destinations are available, added shared Merchant/Press scroll reveals, and moved Versus staggering onto the individual cards. Hidden offer destination pages remain unpublished and intentionally non-interactive. Verified 390/900/1440px geometry, zero compact versus 64px wide overview top padding, no removed arrows, five distinct intermediate card animation timings, fully visible settled/reduced-motion cards, independent moving marquee track and 390px full viewport width. Script-blocked comparison/marquee content stayed visible; the native comparison scroller received keyboard focus. Full repository checks passed, and the isolated browser was closed.

## 2026-10-07: Ananotes 182–186

- 182 (`1791396985797-ws8qd6soj`): Hard Seltzer hero shop action resolves Maracuja's Shopify product URL.
- 183 (`1791397992265-kny5unebp`): Soda hero shop action resolves Soda Variety Pack's Shopify product URL. Both retain the catalog anchor when their product is unavailable to Liquid.
- 184 (`1791398667977-6whfqcpjx`): compact Sidebar box circles reuse the shared round-arrow sweep and keyboard/reduced-motion behavior, preserving 36px decorative geometry and whole-card links.
- 185 (`1791398833898-vn9jcikco`): Subscription account layout includes the shared link's negative inline margins, keeping the default sign-in label on one line while allowing the account pair to wrap below the button on phones.
- 186 (`1791398902789-qstca6qpx`): Subscription buttons clip the light backing and overlap the inner outline by one pixel to cover the light seam around the dark fill. The shared sweep and existing surface colors remain.

Verified three annotated routes at 320, 390, 1440 and 2389px: correct hero URLs, single-line default account labels, 48px actions and no horizontal overflow. Inspected phone/desktop screenshots, shared sweep intermediate and reversal states, reduced-motion results and keyboard focus. Both hero destinations were reached with JavaScript disabled at phone and desktop widths. Theme Check (154 files), editor contracts (61 schemas), asset/typography and repository tests passed; JavaScript syntax, header-aware JSON parsing and whitespace checks passed. Raw jq rejects Shopify's existing generated comment headers; parsing after removing only those headers in memory passed for all 31 JSON files. Existing merchant template edits were preserved. The approved development watcher synced code only; no shared/live deployment. Test browser closed before handoff.

## 2026-10-07: Ananotes 187

Resolved `1791399972579-neeqdhg65`: the cart page now uses white in the central document-background resolver and matching theme-color metadata. Existing panels and editor-owned content remain unchanged. Headless empty-cart screenshots at 390px and 1440px confirmed the white canvas and no horizontal overflow. Full repository checks, JavaScript syntax, header-aware JSON parsing and whitespace validation passed. Raw jq rejected only the existing Shopify-generated comment headers; all 31 JSON files parsed after removing those headers in memory. The isolated test browser was closed. Development preview only; no shared/live deployment.
