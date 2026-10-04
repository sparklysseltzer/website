# Social Media Channels

Source: `sections/social-media-channels.liquid`, `snippets/social-channel-url.liquid`, `assets/social-channel-*.svg`.

## Composition

Add **Social Media Channels** under **Trust & information**. Six fixed slots: primary Instagram, second Instagram, TikTok, LinkedIn, YouTube and Facebook. Large circular controls use the existing `.button` geometry with Brand colours (default), Outline or Solid styles, oval sweep, easing and reduced-motion contract. Icons and labels form one native external link per channel, with `target="_blank"`, `rel="noopener noreferrer"` and a localized new-tab announcement. No JavaScript is needed. Usernames sit beneath each circle so the icons stay recognizable; platform labels distinguish channels. The optional heading is H2 and uses Section size; platform names use Body and usernames Small. Social logos are brand artwork at 2.75rem, inside circles up to 7rem; they are not inline UI icons. Controls deliberately have no panel shadow or hover lift.

The row auto-fits across the shared Editorial content width (`--content-width-editorial`, 75rem); phones use three columns, switching to two below 352px. Labels wrap without shrinking text roles. Keyboard focus covers the complete link and triggers the same sweep as hovering either icon or label. There is no Newake/icon pairing: only the separate optional heading uses the selected heading font.

## Sources and empty states

Each explicit Channel link is an optional local override. Automatic values come exclusively from the shared `social-channel-url` resolver: `shop.brand.metafields.social_links[platform].value` for primary Instagram, TikTok, LinkedIn, YouTube and Facebook; `shop.metafields.custom.instagram_soda.value` for the second Instagram account. There are no hardcoded URL backups. Both this section and Footer use the same resolver.

Maintain primary links in Shopify Brand assets. Maintain the second account in the pinned store metafield **Instagram — Sparklys Soda** (`custom.instagram_soda`, URL, storefront public read). `scripts/setup-social-channels.mjs` provisions the definition and known existing Soda URL idempotently; it preserves any existing value, uses create-only compare-and-set, and saves a private external backup. The 2026-10-02 Admin API run created definition `1432239604099` and verified the value `https://www.instagram.com/sparklyssoda/`. Section Channel link fields remain optional overrides for individual placements; leave them blank to stay synchronized with the central source.

Shopify brand lookup is documented at https://shopify.dev/docs/api/liquid/objects/brand. Development rendering confirmed saved Instagram, TikTok, LinkedIn and Facebook values. YouTube currently has no resolved link; no account is invented. Missing/invalid links are omitted on the storefront and show a noninteractive setup placeholder in the editor. Only HTTP(S) links render as external anchors. Blank Username derives the last URL path segment, stripping query/fragment; Instagram/TikTok add @ when absent. Enter a custom username for opaque channel IDs or unusual profile URLs. Merchant text remains authored content and can be translated through Shopify.

## Editor contract

Content: optional Heading; Heading font is visible only when Heading is populated. Button style selects Brand colours (default), Outline or Solid with no dependent fields. Saved Outline/Solid choices remain supported without a content migration. Each channel group starts with Hide channel (off by default), independently including both Instagram slots. When hidden, the channel is omitted from storefront and editor preview, and its Channel link and Username controls are conditionally hidden. Saved values remain intact; turning Hide channel off restores the existing central or overridden destination. This is local to the section and does not hide footer links or change central data. Visibility has independent mobile/desktop flags. Section background exposes Color only in Custom Color mode. Presets start transparent. Section settings and all mode cases are registered in the editor contract. No page composition is automatically changed.

## Icon sources

Brand/social logos are the design system's explicit exception to the Untitled UI interface-icon family (searched first). Instagram, TikTok, LinkedIn and Facebook reuse the exact path geometry of the existing Figma footer social exports; decorative footer backgrounds and clipping wrappers were removed into clean standalone SVGs with the same 8–24 coordinate bounds. Original Figma export IDs are retained in the `footer-social-*.svg` source files. YouTube uses Shopify Dawn's `assets/icon-youtube.svg` from https://github.com/Shopify/dawn/blob/main/assets/icon-youtube.svg, preserving its geometry and coordinate system. Its MIT notice is retained in `docs/shopify-dawn-license.txt`. All SVGs are local CSS masks, decorative and hidden from assistive technology; labels provide the accessible names.

## SEO and limits

This is navigation to external profiles, not a new Organization/ProfilePage entity. Do not emit another organization or `sameAs` graph from repeated section placements; organization identity belongs to the site-level entity. Only actual configured URLs are linked. No feeds, embeds, trackers, social API calls or remote runtime icon assets are loaded. Reading the sources does not change Shopify Brand settings. The Soda metafield was provisioned separately with explicit merchant authorization.

## Verification — 2026-10-02

Shopify Section Rendering API rendered five configured destinations with two distinct Instagram accounts. Headless Chromium inspected 1440px/390px layout, external-link attributes and escaped labels; a browser-only sixth-slot fixture checked YouTube artwork and both button styles without creating a fake store URL or QA template. Inspected intermediate hover frames and the 480ms shared sweep, keyboard Tab focus with a 3px ring, the shared reduced-motion override (0.01ms computed transition duration), and the 320px two-column layout without horizontal overflow. Clean SVGs parse as XML. No actual social navigation or messages were sent. Theme/editor/typography and repository checks passed. Test browser closed. Full authenticated Theme Editor interaction is not claimed; custom-heading and visibility modes are covered by schema contracts.

Centralization verification (2026-10-02): the Admin API read-back verified the public Shop URL definition and Soda value; a second script run in default read-only mode recognized both without proposing replacement. Section Rendering API returned the five central destinations. Footer links matched those destinations across general/Soda/Hard Seltzer contexts at 390px/1440px, retaining Soda-specific Instagram, external-link safety attributes and no horizontal overflow. Repository checks passed and test browser closed.

## Brand colours — 2026-10-02

Brand colours uses local CSS gradients: warm gold/pink/purple for both Instagram slots, charcoal with cyan/pink edges for TikTok, and soft blue/red/blue transitions for LinkedIn/YouTube/Facebook. These are decorative brand-inspired palettes, not assertions of official brand specifications. The white marks remain unblended to avoid colour inversion. The shared oval sweep adds a translucent dark layer, retaining the 480ms enter/360ms exit easing and reduced-motion fallback. Outline and Solid keep their existing monochrome treatment. No shadows, hover lift, JavaScript or remote assets were introduced; usernames remain on the neutral page canvas. The footer is unaffected.

Colour verification: Section Rendering API returned Brand colours by default with all five real destinations. Inspected 1440px desktop and 390px phone screenshots, with an unsaved browser-only YouTube slot to inspect all six gradients. Corrected transparent-border gradient repetition using border-box origin/no-repeat. Checked all three styles through computed CSS, a visible 3px keyboard-focus ring, intermediate sweep frames with stable white marks, reduced motion (0.01ms), and 320px without page overflow. No destination data or saved placements changed. Test browser closed; repository quality gates passed.

Design Studio comparison: `http://127.0.0.1:9293/#SocialButtons` renders all six slots in Brand colours, Outline and Solid using this section’s CSS served directly by the local-only studio. The studio buttons are inert profile previews with sample usernames, not live store links.

Per-channel visibility verification: editor contracts cover each toggle's shown/hidden field dependencies independently, and the full repository gate passes. Development Section Rendering API preserves all five configured channels under the new default-off hide flags. Headless 390px/1440px screenshots checked a browser-only three-channel subset without changing saved editor content; no phone overflow. Actual saved-toggle Theme Editor interaction was not performed. Test browser closed.

Editorial width (2026-10-02): an outer Page-width wrapper supplies responsive gutters; the inner social row uses the shared Editorial maximum and centers itself, matching Two-column and Editorial Video compositions. This removes the competing Page/section max-width declarations from the same element. Phone column rules and saved settings remain unchanged.

## Shared content width

**Layout → Content width** selects Narrow (800px), Editorial (1400px), or Page width (1920px outer frame); default: **Editorial**. No dependent settings. The shared `section-width` renderer constrains the section frame/surface while preserving mobile gutters, full-width canvas backgrounds, internal reading/artwork limits, and embedded block sizing. Existing IDs and saved content are unchanged. See [Container widths](../design-system.md#container-widths).
