# Subscription

Source: `sections/subscription.liquid`.

## Purpose and variants

Promotional subscription poster based on Hard Seltzer frame `8596:29302` and Soda frame `8596:29303`. One section provides two explicit presets under Brand storytelling so the chooser previews real content. Automatic mode resolves the existing product-world context on pages, products, and collections; on an unclassified page it renders only an editor hint, nothing on the storefront.

Seltzer uses white Newake typography, dark photography and yellow/green/blue checks. Soda uses black Erode typography, blue photography and black checks. Both use the central font-specific heading rhythm and Maison Neue Demi body text. The shared large radius, section spacing and 1400px panel width match Poster/USP. Desktop content is left-aligned within a 1200px inner container; mobile content sits below the main photographic subject with a protective gradient.

## Editor contract

Heading tracking is resolved centrally for the selected font: normal for Newake, `-0.03em` for Erode, regardless of the surrounding page's product world. Subscription has no local tracking override.

Introduction, benefits, and account copy use the shared `--line-height-body-compact` token (`1.3`) in both worlds. The existing-subscriber prompt and sign-in link form a compact two-line pair; the link's 44px touch target is provided by an extended pseudo-element, not a tall visible line box. Its focus treatment and ordinary account destination are preserved.

- Desktop and optional mobile image pickers; native Shopify focal points, no custom anchor/offset controls.
- Independent desktop/mobile minimum heights; content can grow beyond either minimum.
- Optional product-world logo, heading (automatic/Erode/Newake), introduction, subscribe action and existing-subscriber link. Dependent text/font/link fields use `visible_if`.
- Reorderable/removable benefit blocks. Each may select a translated default (discount/shipping/flexibility) or use custom text. Default selection belongs to the block, so reordering does not change its meaning. Removing all blocks removes the list.
- Empty copy uses `sections.subscription` English/German locale defaults. Custom text overrides only its field.
- Subscribe button initially uses `#`; replace it before publishing. Sign-in defaults to `routes.account_login_url`; editors may set the subscription provider's portal URL instead.

## Media and motion

Blank image pickers automatically use `subscription-seltzer.webp` (2053×686) or `subscription-soda.webp` (1024×575). Soda is an isolated rendered photo export: Figma's direct raw asset endpoint returned a blank image with its progressive-blur treatment, so the verified isolated image render preserves that treatment. This source resolution is a current limitation for Retina desktop; replace it with a higher-resolution equivalent when available. No separate grain layer is baked into these exports; the theme's existing grain remains responsible for the overall texture. The original Seltzer photo itself contains photographic texture.

Selected media uses responsive `image_url`/`image_tag`; a mobile `<source>` also works when the desktop picker is blank. Source-controlled defaults have a fixed crop; selected media uses the saved focal point at the relevant breakpoint. Text overlays remain separate CSS.

Reuses `poster-motion` through its shared `data-scroll-motion-*` hooks: reversible surface/text reveals and clipped image parallax. No new JavaScript controller or duplicated animation implementation. Static content and ordinary action links work without JavaScript; reduced motion removes animation and image overscan.

## Verification

Compared both desktop compositions with their source frames and checked 320px, 390px, 768px and 1440px layouts. Verified font-family/line-height resolution, loaded imagery, no page overflow, keyboard focus on both actions, removal of scripted effects with reduced motion, and visible content/native links with the theme JavaScript blocked. Shopify-selected replacement media still requires merchant-image/focal-point verification in the editor.

## Commerce and structured-data boundary

The three benefit defaults are supplied design copy, not newly invented subscription terms. Confirm their accuracy against the configured provider before publishing. This section does not implement selling plans, subscription purchase forms, recurring pricing, discounts, shipping rules or subscription account management.

No section-owned Offer JSON-LD: this is a marketing teaser, with no concrete product, selling plan, price or actionable offer data. Do not invent an Offer or claim end-to-end subscription support. Canonical Product/Offer structured data must come from the future real selling-plan integration, consistent with the actual displayed price and terms.

## Typography roles

Display heading; body introduction, benefits and account copy; UI actions in both worlds.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

## Ananotes correction — single-line Seltzer heading

The Hard Seltzer heading uses its natural content width and no wrapping, so “Subscription” extends beyond the narrower body-copy column on desktop. On phones its inline margins reclaim 14px of the existing panel padding on each side, keeping the 44px shared display role inside the panel at 320px. No font size or line-height exception is introduced. The Soda heading is unchanged. Longer merchant-supplied Seltzer headings must be checked against the available panel width because this heading intentionally stays on one line.
