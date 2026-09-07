# Cart rebuild reference

Inspected on 2026-09-06. Source: [current cart page](https://sparklys.ch/cart) and its global cart drawer. This is a discovery record, not an implemented theme contract or approval to copy every legacy behavior. The user requested inspection before implementation and confirmed there are currently no subscription products.

## Reference and evidence

- Desktop viewport: 1440 × 1000. Phone viewport: 390 × 844.
- Test products: [Soda Yuzu & Ginger](https://sparklys.ch/products/sparklys-soda-yuzu-ginger) and [Soda Blueberry & Pomelo](https://sparklys.ch/products/sparklys-soda-blueberry-pomelo), each in the 12-pack variant.
- Each test pack displayed CHF 29.40. One pack, two of one pack, and three packs across two lines produced CHF 29.40, CHF 58.80, and CHF 88.20 respectively. These are observed store prices, not theme constants.
- Local screenshots are under `/tmp/sparklys-cart-audit/`; they are temporary evidence, not theme assets. Key captures: `cart-empty-desktop.png`, `drawer-empty-desktop.png`, `cart-filled-desktop.png`, `drawer-filled-desktop.png`, `cart-multiple-phone.png`, `drawer-multiple-phone.png`, and `drawer-empty-phone.png`.
- Some early captures caught incomplete transitions because the automated browser tab was hidden. Use the settled captures and recheck motion in an active browser before implementation sign-off.
- No checkout submission, purchase, newsletter signup, or store administration changes were made during live-site inspection.

## Cart page

The desktop cart uses a centered content column approximately 768px wide, a large uppercase cart title, and a small Hard Seltzer eyebrow even when the cart contains only Soda. A pale gray shipping message precedes the product list.

Each row contains a rounded pale image tile, linked product/variant title, circular remove control, outlined pill quantity stepper, and right-aligned line total. A separate outlined update button submits changes. The successful quantity update from one to two Yuzu packs persisted on the next page load and appeared in the drawer.

Below the items, a pale orange notice explains that shipping and discount codes are handled at the next step. Desktop order notes sit alongside subtotal, savings, total, and tax/shipping guidance. The black rounded checkout button spans the content column. On phone, the layout stacks totals first, then notes, then checkout; product titles wrap alongside smaller images.

The empty page retains the shipping notice, update action, order notes, zero totals, and checkout action. It does not use the drawer's illustrated empty state. This is a legacy behavior to resolve, not the proposed empty-cart contract.

## Drawer

- Opens from the header bag and automatically after successful product addition. The add button temporarily changes to a loading label.
- White right-side panel, approximately 600px wide on desktop, full viewport width on phone, with a dark backdrop on desktop.
- Centered bag icon and uppercase title, circular close control at the top right, then the shipping message.
- Filled rows show image, product name, option name/value, remove control, pill quantity stepper, and price. The option label comes from the product: the observed products used different names for their pack option.
- The bottom area contains the orange shipping/discount notice, total, tax/shipping guidance, and a full-width checkout link. No order-note field or cart-page link was visible inside the drawer.
- Empty state: framed Bob Ross artwork, italic English quotation, German explanatory copy, and a black continue-shopping link to the all-products collection. Filled-cart totals and checkout disappear.
- Reference artwork: `https://sparklys.ch/cdn/shop/t/11/assets/empty-cart-image-bob-ross-sparklys-hard-seltzer2x.png`. reuse was subsequently requested by the user and is now bundled as `assets/cart-empty-bob-ross.png`.
- Recommendation markup exists in the source but did not render visibly during the tested states. Its repeated placeholder items do not establish a working recommendation feature.

## State coverage

| State | Observation / remaining verification |
| --- | --- |
| Empty cart page | Captured on desktop; existing page retains zero-value form/checkout |
| Empty drawer | Captured on desktop and phone, including return to empty after last-item removal |
| One line | Inspected on both surfaces; quantity one and two |
| Multiple lines | Two Soda products inspected; phone captures saved |
| Add/loading | Loading button observed; successful add opens drawer and updates badge |
| Quantity update | Cart form update persisted and drawer loaded the updated quantity |
| Remove one line | Drawer removes the line and recalculates its total |
| Remove last line | Drawer returns to illustrated empty state |
| Below/above CHF 50 | Shipping message stays static in both states; no progress bar observed |
| Close / keyboard | Close control available; Escape did not close the open drawer in the test. Focus containment/restoration needs deliberate implementation and verification |
| Page/drawer synchronization | Underlying cart page retains stale rows after drawer removal until reload |
| Discounts / sale products | No confirmed test code or discounted product supplied; savings row observed only at zero |
| Inventory / network errors | Error text exists in source but no real error was safely reproduced; runtime layout/recovery remain unverified |
| Long cart / scrolling | Two lines tested; a cart exceeding the viewport remains to be verified |
| Order-note persistence | Field observed; save behavior not tested |
| Checkout | Entry controls inspected; checkout handoff not exercised |
| No JavaScript / reduced motion | Legacy behavior not verified; both are requirements for the native rebuild |

## Decisions needed before implementation

1. Resolved: the user explicitly requested the Bob Ross artwork and a closer reference composition in the follow-up visual review; it is now shared between page and drawer.
2. Confirm shipping eligibility. The drawer says free shipping from CHF 50 and for trial packs; the cart page says above CHF 50. Neither wording proves the actual checkout rule. Confirm the boundary, exceptions, eligible markets, and discounted-subtotal handling before authoring shipping copy or calculations.
3. Confirm first-phase scope: retain notes, keep discount-code entry at checkout, and defer recommendations, shipping progress, and subscriptions.

## Proposed native rebuild boundaries

Use the existing website's composition with the new theme's shared typography, tokens, controls, localization, and global shell. Keep a neutral cart context for mixed product worlds. Replace legacy Webflow/Udesly implementation with native Liquid and scoped vanilla JavaScript.

One authoritative Shopify cart response must update page rows, drawer rows, prices, totals, and header count together. Clearly distinguish unit and line prices: the legacy drawer showed CHF 29.40 next to quantity two while its total was CHF 58.80; the cart page showed the CHF 58.80 line total.

Implement accessible modal behavior, explicit quantity/remove labels, pending and error feedback, and a server-rendered cart fallback. Empty carts should offer shopping without an active checkout action. Product images must use Shopify data and responsive delivery. Do not port stale product-world labels, hidden recommendation placeholders, or newsletter-popup behavior into the cart.

The cart is a transactional summary, not a new standalone product entity. Do not add duplicate Product/Offer JSON-LD merely for cart rows; use the owning product pages' structured-data work tracked in [Structured-data tasks](structured-data-tasks.md).

When implementation starts, update [Main cart](sections/main-cart.md), the owning drawer documentation, [Section reference](sections/README.md) if a section is added, and [Status](status.md). Existing implementation facts remain in those guides.

## Native implementation follow-up — 2026-09-06

The user authorized the cart/page drawer rebuild. First phase now retains cart-page notes and checkout code entry, with shared native rendering and a neutral localized bag empty state. The subsequent visual review authorized Bob Ross reuse, now implemented. Shipping eligibility/progress, recommendations and subscription commerce remain deferred. Current implementation contracts and preview verification gaps are in [Main cart](sections/main-cart.md) and [Cart drawer](sections/cart-drawer.md); the observations above remain the legacy discovery record.

## Shipping confirmation — 2026-09-06

The user confirmed CHF 50 and the trial-pack exception and authorized the growing bar. This supersedes the earlier deferred-progress scope. See [Main cart](sections/main-cart.md#free-shipping-progress--2026-09-06) for the settings, catalog fallback, calculation and verification limits.
