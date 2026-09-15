# Collection hero

Source: `sections/collection-hero.liquid`, `assets/collection.css`, `assets/collection.js`.

Introduces branded and neutral collection pages. The all-products resource suppresses this hero because its catalog supplies the title and filter navigation. The hero owns the only H1 on ordinary collections; enable **Title provided by Collection hero** on the accompanying Collection section. The separate setting preserves the hidden H1 on older standalone catalogs.

## Content and editor contract

Automatic uses the existing `brand-context` resolver and `custom.brand_variant`; no new product-world classification. Soda uses Erode and the sky treatment; Hard Seltzer uses Newake and warm/green color fields. General collections use an Erode title, collection description and neutral surface. Explicit heading font choices affect headings only. Brand defaults translate approved Figma text through English/German locales; merchant heading, intro and label overrides remain translatable theme content.

Groups follow Design, Content, Artwork, Action and Visibility. The shop label appears only when its action is enabled; the action targets the real catalog anchor. Image pickers remain useful additive overrides in all worlds, including a neutral collection with custom artwork. Empty pickers select bundled brand artwork; there are no crop controls or duplicate brand metafields. Both images use contain; background images use cover and Shopify focal points. Default neutral collections have no decorative cans.

## Shared benefits

The collection's existing `custom.usp_set` supplies ordered USP captions, icons and footnote through the shared snippets. The complete stored set is respected (currently six Hard Seltzer benefits, although the older Figma hero depicts five). `custom.featured_usp` is an optional reference to an existing `usp_item`, presented larger before that set. Soda now references `soda-no-added-sugar`. This does not insert the extra badge into every PDP or Product benefits section. Edit shared text/icons in the referenced metaobject; do not substitute locale text for populated source values.

The new badge has the intentionally English artwork caption “No added sugar”, as provided in Figma. Its complete vector export was uploaded to Shopify Files and linked to the metaobject on 2026-09-15. Existing German-source/English-translation ownership remains unchanged.

## Artwork and motion

References: Figma `7136:10094` (Soda), `8945:15055` (Hard Seltzer), file `wU2QCDnknQPBZd4hacOOjq`. Those hero rasters contain baked cans, so the implementation reuses the existing transparent Product Overview cans for independently animated layers. Their label artwork therefore follows the existing theme exports rather than the flattened hero mockup.

- `collection-hero-sky.webp`: optimized exact sky-layer export `10121:60284`, 719×889, reused as a cover background. It is a source-layer reconstruction rather than the flattened hero image.
- `usp-soda-no-added-sugar.svg`: complete `8733:14130` composite including outline and shadow, viewBox 135×110. The metaobject image is authoritative; this file also supplies the stable seeded fallback.
- Existing Soda can assets: 600×1072. Maracuja and Holunder: 385×1000, replaced with the merchant’s tightly trimmed September 15 exports. Intrinsic dimensions match the supplied files; no upscaling during conversion.

Only transforms animate: independent cans follow overlapping horizontal/vertical orbital periods (up to 18px horizontally, 20px vertically and 3° roll, scaled down on phones). Fine-pointer movement adds damped attraction and subtle perspective tilt, with different depths per can; leaving the browser viewport eases back to the uninterrupted idle drift. Touch keeps the idle motion without intercepting gestures. A single frame-rate-independent animation loop updates can transforms, with no layout reads in that loop. Soft radial color fields translate and stretch over 22–26 seconds, and Soda clouds remain static at a reduced scale. Text stays static. No animated blur filters, canvas, scroll locking or layout animation. An in-view observer and page visibility pause ambient animations; reentry resumes their current position without advancing the hidden time. The visible pause button was removed following Ananotes feedback on 2026-09-15. System reduced motion and the editor's Animate artwork setting disable enhancement; the entire composition remains visible without JavaScript.

## Layout, typography and structured data

Phone stacks copy, benefits and artwork; the benefits use a three-column grid with wrapping labels. Desktop uses a 44/56 copy/art split. Hero heading uses Display, copy Body, benefit labels Label, footnotes and motion controls Small. Font-specific line heights remain shared. The hero introduces no separate entity; the accompanying catalog owns CollectionPage/ItemList JSON-LD. Claims and footnotes stay visible, including with JS disabled.

Motion verification (2026-09-15): desktop idle transforms advance between sampled frames; pointer response eases toward the cursor and returns near neutral after leaving. Pause freezes the can transform exactly; reduced motion clears transforms and hides the control. Phone idle motion remains active with no horizontal overflow. Shared checks and JavaScript syntax validation pass.

Ananotes 120–122: hero footnotes are no longer rendered. Soda sky no longer uses an enlarged full-width portrait cover or scroll/pointer parallax. Desktop uses two feathered mirrored panels at approximately half width, a single panel on phones, and a white bottom fade. This is a sky-only approximation of the flattened Figma composite; foreground cans retain independent motion. Copy children reveal once per connection with the shared Slow duration, 16px upward travel and 50ms stagger capped at 200ms. Reduced motion cancels entrance effects and ambient motion; no JavaScript keeps everything visible.

Ananotes 130: both worlds observe fine-pointer movement on `window`, normalizing coordinates against the entire viewport. Header-to-hero movement keeps the same damped target, without resetting at the hero boundary. Pointer leaving the viewport, cancellation or window blur resets the target. Reduced motion, touch exclusion, offscreen suspension and abort-controller cleanup remain authoritative.

Shared floor-shadow review: these cans float without a ground plane, so they intentionally do not receive `can-shadow`. Future grounded can applications must use the shared primitive documented in the design system rather than adding independent shadow rules.

Ananotes 144: automatic brand eyebrows use Sparklys™ for both Soda and Hard Seltzer, replacing the registered mark. Merchant-provided eyebrow copy remains authoritative.

Ananotes 149: the Soda hero with Erode uses a named composition exception, `--soda-hero-heading-leading: calc(62 / 75)`, matching Figma text node `8734:14210`. Display type size remains shared. The resolved font is exposed on the hero so explicit Newake choices retain normal Newake leading. Other collection worlds and general Erode typography remain unchanged.
