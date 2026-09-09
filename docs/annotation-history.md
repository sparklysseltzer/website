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
