# Footer

Source: `sections/footer.liquid`

Group: `sections/footer-group.json`

## Purpose

The persistent footer mirrors the server-resolved `default`, `soda`, and `seltzer` contexts while keeping one shared structural system.

## Merchant controls and data

- separate General, Soda, and Hard Seltzer nested Shopify Navigation menus;
- shared Legal Nav.

Pages and Products explicitly select their context through the existing `custom.brand_variant` metafield (`soda` / `hardseltzer`). The resolver supports the same key for optional future Collection overrides. The canonical `soda` and `hard-seltzer` collection handles remain classification fallbacks and are not Theme Editor settings. Top-level footer menu items create cards and their children create card links. The footer year is rendered from Shopify's server time.

## Rendering contract

Each context selects its matching Arc, Soda, or Hard Seltzer identity and navigation. Footer card headings intentionally use Newake in every context. A native Shopify customer form tagged `newsletter` supplies the newsletter path expected by the existing Shopify–Klaviyo integration. General and Hard Seltzer social links use `@sparklysseltzer`; Soda uses `@sparklyssoda`; LinkedIn is shared.

Payment marks and Store Finder remain non-interactive artwork. German and English language chips submit Shopify’s native localization form. Legal links and social destinations are active.

## Progressive enhancement and accessibility

`newsletter-form` submits progressively and replaces the form with Shopify's rendered success/error state without losing the native fallback. Shopify's hCaptcha protection remains active, while its injected floating badge is visually suppressed so it cannot cover footer controls. Labels, live error/status regions, focus targets, external-link relations, visible focus, 44px social targets, and reduced-motion behavior are included.

## Known gaps

Verify Shopify-to-Klaviyo list routing and opt-in behavior operationally. Replace placeholder footer-menu destinations. Connect Store Finder and verify payment gateway coverage separately.

## Typography roles

Compact newsletter/card headings; label navigation/legal copy; UI newsletter input/action; small status text. Newake card-heading family remains unchanged.

## Shared color settings

Shared neutral UI colors now resolve through **Theme settings → Colors**, following the [color contract](../design-system.md#theme-color-settings). This supersedes fixed neutral hex values in earlier frame descriptions. Primary text, inverse text, gray/cream surfaces and hover states use global roles; product artwork, deliberate product-world accents and explicit section color overrides remain local. No schema/data-source, motion or structured-data behavior changes.

## Brand-world palettes

Colors now follow the [brand-world palette contract](../design-system.md#theme-color-settings). Explicit Soda/Seltzer sections and cards select their own palette on mixed pages; the header/footer inherit page context, and both cart surfaces always use General. Shared accent/status roles and explicit artwork/section overrides remain unchanged. Notice copy resolves through its world’s Notice text setting.

Focus treatment (2026-09-08): newsletter keyboard focus retains the contrasting shell ring; pointer focus suppresses that ring and retains the input caret. The input itself avoids a duplicate ring. Uses the [shared modality contract](../design-system.md#focus-styles), with native focus-visible fallback.

Notifications (2026-09-08): Enhanced newsletter success and server-error feedback use the shared toast system. Server feedback remains available as a hidden field description, including aria-invalid on errors; native no-JavaScript responses stay inline. After an enhanced response, focus returns to the invalid input or submit control rather than moving into the notification. Existing network-failure native-submit fallback remains unchanged. See [Notifications](../design-system.md#notifications).

Shared control refinement (2026-09-09): buttons use the global 3px control outline; cart quantity capsules share it. Normal field/select values explicitly use the regular body face and weight 400, including newsletter and product controls. Labels, button emphasis, field geometry and document artwork typography remain governed by their existing contracts.

Payment marks (2026-09-11): `snippets/payment-icons.liquid` now owns the existing eight SVG marks for both footer and PDP. Change this renderer once to update both. The set remains editorial artwork rather than a verified dynamic gateway inventory.

## Breakpoint visibility

Exposes **Hide on mobile** and **Hide on desktop**, both defaulting off. See the [shared visibility contract](README.md#breakpoint-visibility) for ranges, editor behavior and limitations.

Payment asset cleanup (2026-09-11): removed exported ancestor-frame backgrounds from the eight shared SVGs while preserving logo/card geometry. PDP and footer still consume the same assets.

## Language selection — 2026-09-12

The footer renders German (existing Swiss flag SVG) and English (existing UK flag SVG), filtered through `localization.available_languages`. The controls select languages only: no country/currency input or country assumptions. Unpublished/unavailable languages are omitted, never linked to an invented route. Shopify’s native localization form handles the current-page return and works without JavaScript. Labels use language endonyms; decorative flags have empty alt text; active state uses `aria-pressed`, and buttons retain keyboard focus and at least 44px targets. Hover feedback uses shared fast motion with reduced-motion support. No schema or template content changes.

Additional Swiss languages and an expanded menu/overlay are future work; do not add countries to this control. Publishing a store language affects the store globally and is separate from theme code deployment.

Current store availability: German is published; English is not. Merchant explicitly deferred English publication until go-live (2026-09-12). The UK control appears automatically when English is published/available for the current market. The local `/en/` preview can render English content for review despite that publication setting.

General footer completed against Figma `10986:21454` (2026-09-12): default context shows the Arc newsletter logo, separate branded Hard Seltzer/Soda shop cards, and a stacked information column. Branded contexts retain their existing complete menu layout.

Flag assets retain their exported artwork but omit ancestor canvases and the baked-in Swiss active outline; CSS now owns active selection for either language. Local phone/desktop checks confirm no overflow and 55×44px controls; keyboard focus is visible with scripts blocked. German/English PDP content renders correctly in local previews. Shopify CLI’s local `/localization` POST currently returns HTTP 401 even after an authenticated restart, so local form round-trip verification is blocked by the preview proxy; GET previews remain HTTP 200. The native form submission passed on the hosted development theme (ID `199384498563`) with scripts blocked, returning HTTP 200 in German and preserving the development theme. Recheck the full DE↔EN round trip when English publication is approved.

## General footer composition

On non-product-world pages, the first group of the existing `seltzer_menu` and `soda_menu` supplies each branded card’s child links. The `menu` setting retains its first Shop group for fallback; subsequent groups (currently Learn and Get to know) populate the stacked information column in their saved order. The menu labels can be translated or renamed without changing rendering; selection uses group order, never English title matching. Schema help documents this structure. No menu records, saved settings, section IDs or template JSON were changed.

If either brand menu is missing, the existing general menu renders completely instead of dropping its Shop links. `snippets/footer-brand-card.liquid` is a rendering primitive for a single menu group and existing logo asset. Logos are accessible h2 content; ordinary information headings retain shared Newake roles without optical offsets because they are standalone text. Brand and general destinations, including existing placeholders, remain merchant-owned.

Desktop uses two tall branded cards and stacked information cards in three equal navigation columns beside the newsletter. The newsletter can shrink at smaller desktop widths. Mobile stacks newsletter, Hard Seltzer, Soda, then information cards in semantic DOM order. Existing responsive layout, link motion, focus, reduced-motion and native newsletter/language forms remain shared. No new Schema.org entity applies to navigation; no duplicate Organization data is emitted.

Verified at 390px, 1024px and 1440px: correct four-card hierarchy, aligned logos, no horizontal overflow, and desktop card heights matching the stacked column. Also checked Soda/Seltzer context isolation and native keyboard navigation with scripts blocked. Remaining footer gaps are the existing Store Finder artwork, placeholder menu destinations and operational newsletter integration; this change completes the General composition.

## Content-to-footer spacing

The layout’s `#MainContent` supplies an outer bottom buffer using the same `--section-padding-block` token as ordinary sections (32–64px). This works across all templates and brand contexts without changing footer internals or saved settings. See the design-system spacing contract.

## Heading font selection

**Heading font** selects Erode (default for new placements) or Newake, independently of the product world. It applies to semantic headings rendered by this section, including headings inside rich text; Maison Neue body/UI text and existing size roles are unchanged. This supersedes earlier automatic brand-based font descriptions in this document. Existing explicit font selections retain their saved values. SVG logos and product-title artwork remain artwork, not configurable type. See the [shared heading contract](../design-system.md#editorial-heading-font-selection).

Footer card titles always use Newake with its original regular weight, tracking and shared line height, regardless of brand world or the section’s Heading font setting. The card-heading selector joins the shared Newake token mapping. Other editorial headings can still use the section setting; Maison Neue body text and SVG brand logos are unchanged.
