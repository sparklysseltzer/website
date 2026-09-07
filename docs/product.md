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

The theme covers the global shell, reusable editorial modules, and native Shopify resource pages. The development homepage is a working composition with merchant-entered test content, not final launch copy. See [Implementation status](status.md) for supported capabilities and production gaps, and the [Section reference](sections/README.md) for module contracts. JSON templates own current page composition.

## Storefront brand contexts

The storefront has one general Sparklys layer and two product-world layers. These are presentation and navigation contexts, not separate stores.

| Context | Primary surfaces | Header logo | Top switcher | White navigation |
| --- | --- | --- | --- | --- |
| General Sparklys | Home and shared/global content such as cart, search, account entry points, and unclassified editorial pages | The Sparklys “Arc” wordmark | Neither Soda nor Hard Seltzer is active | General Sparklys menu |
| Sparklys Soda | The Soda landing page and Soda-classified products, collections, and supporting content | Sparklys Soda logo | Soda is active | Soda-specific menu |
| Sparklys Hard Seltzer | The Hard Seltzer landing page and Hard-Seltzer-classified products, collections, and supporting content | Sparklys Hard Seltzer logo | Hard Seltzer is active | Hard-Seltzer-specific menu |

The homepage introduces both product worlds and the overall Sparklys brand. It must not imply that either product world is selected. Soda is non-alcoholic; Hard Seltzer is alcoholic. Content, navigation, compliance behavior, and product claims must preserve that distinction.

The black top bar is the product-world switcher. The white bar below it changes logo and navigation according to the current context. Direct entry to any classified URL must render the correct context without requiring the visitor to select a tab first.

Typography follows product-world identity, with shared body/UI roles across worlds. The [design system](design-system.md) owns font selection, sizing, rhythm, and explicit editorial exceptions.

Product detail pages belong to the same product world as their products. A Soda product receives the Soda header, active Soda tab, Soda navigation, Erode Bold headings, and Soda footer. A Hard Seltzer product receives the corresponding Hard Seltzer header, tab, navigation, Newake headings, and footer. Product-world styling is not limited to collection landing pages.

The footer follows the same three contexts. General pages present the Arc plus separate Soda and Hard Seltzer navigation cards. Soda pages present the Soda logo and Soda shop card. Hard Seltzer pages present the Hard Seltzer logo and Hard Seltzer shop card. Shared newsletter, learning, company, legal, social, payment, store-finder, and language surfaces keep a consistent visual system across all three variants. Footer card headings are an intentional typography exception: they use Newake at weight 400 in every context, including Soda pages.

### Confirmed brand-landing decision

Soda and Hard Seltzer use Shopify collections as their primary brand-and-shop landing pages. Do not create parallel regular Pages that duplicate the same introduction and then send customers to a collection.

- The default collection template is a neutral product-grid surface for ordinary collections.
- The Soda collection uses the `collection.soda` template and combines its own brand design and editorial sections with the native Soda product grid.
- The Hard Seltzer collection uses the `collection.seltzer` template and combines its own brand design and editorial sections with the native Hard Seltzer product grid.
- The black-bar Soda and Hard Seltzer tabs link to the canonical brand collections resolved by the theme.
- Regular Pages remain appropriate for distinct supporting content such as ingredients, brand stories, FAQs, campaigns, or other editorial topics—not a duplicate brand catalog.

This keeps brand storytelling, merchandising, sorting, filtering, pagination, SEO ownership, and product discovery on one canonical collection destination per product world.

The current visual implementation has established the core brand language and responsive section system. Continuing implementation and launch verification must prove:

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
