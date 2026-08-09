# Product

## Summary

Sparklys is rebuilding its public commerce storefront as a custom native Shopify Online Store 2.0 theme.

- Public storefront: `https://sparklys.ch`
- Shopify store: `sparklys-hard-seltzer.myshopify.com`
- Repository: `sparklysseltzer/website`
- Initial markets: Switzerland and Liechtenstein
- Minimum storefront languages: German and English
- Likely Swiss-market languages: French and Italian

Shopify remains responsible for products, variants, inventory, collections, discounts, orders, customers, payments, checkout, Markets, and store administration. This repository owns the storefront presentation and theme behavior.

## Why this architecture

The previous storefront originated in Webflow, was converted through Udesly Nexus, and then diverged through manual changes. That made normal theme evolution difficult to reason about and maintain.

We chose a custom native Shopify theme because it provides:

- complete control over HTML, CSS, JavaScript, motion, and responsive behavior;
- direct use of Shopify's product, cart, checkout, Markets, and theme editor capabilities;
- lower operational burden and broader storefront-app compatibility than a headless application;
- a durable source-controlled foundation without carrying a large commercial theme.

## Product principles

- Mobile-first commerce with fast one-handed purchase paths.
- A visually exact implementation once approved brand and Figma inputs arrive.
- Strong performance with server-rendered Liquid and minimal JavaScript.
- Accessible interaction and content as a default, not a later remediation.
- Merchant-editable page composition through sections, blocks, and settings.
- Production-quality code even during prototyping so successful work can continue into launch.
- Shopify-hosted checkout and platform-native commerce behavior wherever possible.

## Current scope

The theme foundation includes global layout, navigation, footer, homepage composition, products, collections, cart, search, standard pages, blogs, articles, and error handling.

The first visual prototype should prove:

1. the new Sparklys design language can be reproduced precisely;
2. the theme stays fast and responsive on real storefront data;
3. content remains practical to manage in Shopify;
4. critical commerce and installed-app integrations have a credible implementation path.

## Desired commerce experience

These capabilities are part of the product vision. They are not implemented yet, and the choice between custom theme work and a Shopify app remains open for each one.

### Subscriptions

Customers should be able to choose eligible Sparklys products as subscriptions, understand delivery cadence and pricing, add the selected plan to the cart, and see the plan consistently through cart, checkout, and account management.

### Age verification with identity documents

Where required, customers should be able to prove that they meet the applicable purchasing age by scanning the machine-readable zone (MRZ) of a supported identity card or passport.

This is a privacy, security, accessibility, fraud, and legal-compliance feature—not ordinary theme validation. Before implementation we must decide:

- which jurisdictions, products, and journey stages require verification;
- the accepted documents and a fallback for documents without usable MRZ data;
- whether an established Shopify-compatible verification provider or a custom service is appropriate;
- what result Shopify must retain and for how long;
- how raw document/MRZ data is prevented from entering theme logs, analytics, pixels, or unnecessary storage;
- how failure, retry, manual review, and accessible non-camera alternatives work.

The browser theme must not be treated as the trusted verification authority.

### Promotion awareness

- Applied coupon codes and their effect should be visible in the full cart and cart drawer.
- If practical and trustworthy, applied coupon state may also be shown on the product detail page.
- When no coupon is applied, eligible visitors should see a useful coupon hint on the product detail page.
- Messaging must distinguish valid, invalid, inapplicable, expired, automatic, and code-based discounts and must not promise savings that Shopify will reject at checkout.

### Cart-drawer conversion

- Provide a “last-minute sale” or last-chance offer inside the cart drawer. The exact meaning of the current “others took this” concept—social proof, popular add-on, limited-time offer, or another mechanism—still needs product definition before implementation.
- Recommend relevant add-ons in the cart/cart drawer and show progress toward the actual free-shipping threshold.
- Free-shipping progress must follow the active market, currency, discounts, shipping configuration, exclusions, and Shopify's final checkout eligibility rather than a disconnected hardcoded number.

### Build-versus-app decision

For each capability, compare a Shopify app, a theme app extension, and a custom implementation based on storefront control, checkout/account coverage, provider reliability, privacy, performance, consent, merchant workflow, recurring cost, failure modes, and lock-in. The decision can differ per capability.

### Languages and markets

The initial commercial scope is Switzerland and Liechtenstein. German and English are the minimum storefront languages. French and Italian should be evaluated as additional Swiss-market languages so the storefront can serve the country's major language regions appropriately.

Potential later country expansion includes Germany, Austria, France, and Italy. These are future markets, not launch assumptions. Their domains/subfolders, currencies, prices, catalog availability, tax presentation, shipping, age rules, legal content, consent behavior, and translations must be configured and verified per Shopify Market before launch.

Theme UI must therefore remain translatable and URL/currency agnostic from the beginning. Publishing a language in Shopify and translating merchant-entered section, product, collection, page, policy, and SEO content are separate operational tasks from adding locale strings to this repository.

## Non-goals

- Replacing Shopify as the commerce backend.
- Building a Hydrogen/headless application.
- Reintroducing Webflow/Udesly as the source-code workflow.
- Starting from a commercial theme.
- Publishing or modifying the live store during unapproved development work.
- Inventing business rules or marketing/legal claims not supplied by Sparklys.

## Success criteria

- Accurate approved visual implementation at phone and desktop widths.
- No horizontal overflow or hover-only functionality.
- Keyboard-accessible purchase and navigation journeys.
- Core product and cart behavior remains usable without JavaScript.
- Theme Check remains clean.
- Real-store integration behavior is verified before being marked supported.
- Performance and accessibility are measured on home, product, and collection pages using realistic Shopify data.
