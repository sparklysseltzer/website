# Subscription intro

Source: `sections/subscription-intro.liquid`; styles: `assets/subscription-page.css`.

Replaces the generic page title in `page.subscription.json`. The site navigation remains. The composition follows Figma `10130:75682`, with intro node `10313:79974`: a 75rem split layout, heading/copy/benefits/actions on the left and a rounded photograph on the right. Below 900px, copy precedes the image. Heading uses the shared Display role and line height; its width controls wrapping.

## Content and configuration

Composition order: Content, Image, Visibility, Section background. Heading and rich-text introduction are merchant content. Blank heading falls back to the page title; blank introduction uses the existing Soda subscription locale. Benefits reuse the approved subscription summary locales and yellow, green and blue tick assets. Subscribe targets `#subscription-product`; sign-in uses Shopify's account login route.

Heading font selects Erode or Newake. Uppercase headings is visible only for Newake and ignored for Erode. Both breakpoint hide controls use the shared visibility helper. Background exposes Surface only in Colored mode and Custom color only for the custom surface. Contracts are in `tests/editor-schema-contracts.json`.

The image picker uses responsive Shopify CDN images. Its blank fallback is the exact bundled Figma photograph, `subscription-intro-soda.webp`, exported from intro node `10313:79974` (683 × 1024), re-encoded as WebP at quality 90 without changing the image composition. The fallback alone rotates and crops inside the reference aspect ratio; selected images use normal cover fitting. Image alternative text is editable and blank by default because the fallback is decorative.

No entrance animation is added. Shared buttons and links retain their existing interaction motion and reduced-motion support. One server-rendered WebPage entity uses the displayed heading and canonical URL, suppressed when hidden at both breakpoints. The purchase section separately supplies real product structured data.

## Landing composition and ownership

The subscription template preserves the existing `main` section ID while replacing its generic page section. Supporting sections reuse the current Soda product and collection compositions: product benefits, merchant marquee, three reasons, ingredients, comparison, subscription poster, FAQs and two-column editorial content. Their existing merchant copy and live metaobject sources remain authoritative. The landing uses the reference pale-blue canvas and links its second subscription action back to the purchase section.

`product.subscription.json` provides the same composition as a native alternate product view for flavour/pack links. Keep these two compositions aligned when editing the landing. This is a Shopify routing requirement, not an independently assigned replacement for normal product templates. Existing product assignments remain unchanged. Both new template compositions must receive a reviewed merge with current editor content before any shared-theme deployment.

## Verification

Verified in an isolated headless development preview at 1440px and 390px: intro/photo composition, full section sequence after scroll reveals, one H1, Erode authored casing, no horizontal overflow or broken images, and native anchor navigation. Existing section motion is reused. New schema grouping/dependencies were reviewed and the editor contracts pass; the existing poster uses its legacy stored `seltzer` value for the Newake choice. The Figma photograph is about 260 KiB after WebP encoding.

Underlined account link (Ananotes 18, 2026-10-09): uses the shared `text-link--underlined` variant alongside the Subscription poster.
