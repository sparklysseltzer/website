# Subscription product

Source: `sections/subscription-product.liquid`; shared renderer: `snippets/product-detail.liquid`; existing PDP scripts and styles, plus `assets/subscription-page.css`.

The subscription landing's purchase section reuses the regular PDP gallery, flavour artwork, variants, quantity, selling plans, price calculations, cart submission, USPs, benefits, shipping hints and payment icons. It follows Figma purchase node `10312:79429` with current Shopify catalog data. It omits the regular description and additional marketing photographs, uses the existing Soda logo above an H2 beneath the landing H1, and keeps the desktop purchase column static.

## Product selection and native routing

Starting product selects a Soda product with selling plans. When blank, the existing Blueberry & Pomelo product is the fallback. The Soda collection's ordered flavour-products metafield supplies flavour choices, with collection products as fallback. Products without an allocation on their initial variant are omitted. In the alternate `product.subscription` view, Shopify's current product takes precedence over the starting picker.

Shopify page requests do not resolve a different product from a variant query. Flavour links therefore use the product's locale-aware URL with `view=subscription`, its variant and selling plan, anchored to the purchase section. The alternate template retains the entire landing composition. The native packaging GET form also preserves this view; enhanced pack/plan changes update the same product-view URL so refreshes retain the selection. Ordinary product URLs and templates keep their normal purchase flow.

Subscription mode requires a real selling-plan allocation, selects the first when none is explicitly selected, removes one-time purchase from both enhanced and native controls, and disables submission if the selected variant lacks an allocation. It does not change Shopify product requirements globally. Without JavaScript, the native plan selector, packaging update and product form remain usable. The existing shared cart handles subscription additions and free-shipping messaging.

## Configuration and structured data

Composition order: Product, Section background. Starting product is followed by the shared Heading font control and Newake-only Uppercase headings. Background dependencies match the shared contract. This is an essential purchase section without breakpoint hide toggles. It has no add-section preset. Empty/unconfigured subscription products show an administrative prompt only in the editor.

A single Shopify-generated Product/ProductGroup structured-data entity describes the actual selected product and offers. No subscription pricing, delivery terms, reviews or checkout behavior are invented. Existing PDP limitations for large catalogs, prepaid plans and completed checkout still apply. The page reuses the store's current frequencies and discounts; no backend subscription or shipping rules are changed.

## Verification

Development preview checks covered all three Soda flavour links, 12/24-pack selection, refresh persistence, keyboard delivery selection, subscription-only controls, actual Ajax subscription addition and the cart's free-shipping message. With page JavaScript execution disabled, packaging reload retained the alternate subscription view and native monthly subscription submission reached the cart with the chosen 24-pack and selling plan. Ordinary Soda PDP rendering retained one-time purchase and its H1. Product, WebPage and FAQ JSON-LD parsed successfully. No checkout or payment was submitted; test-cart items were cleared and the isolated browser closed.

Subscription model update (2026-10-08): the shared plan label omits the redundant discount suffix. The five current delivery intervals are 2, 4, 6, 8 and 12 weeks, each with 15% off. Cart prices and selling-plan identity remain Shopify-driven.
