# Form control baseline

Status: two opt-in styles, updated 2026-10-02. Cart coupon fields and the age-check document selector now adopt the baseline. Other storefront fields, newsletter compositions, quantity controls and MRZ artwork have not been migrated. The design system studio is at `http://127.0.0.1:9293`; start it with `npm run studio`. Keep `demos/design-system/` as the permanent local reference; reusable implementation lives in `assets/forms.css` and `assets/forms.js`.

## Design sources

- [Field states](https://www.figma.com/design/wU2QCDnknQPBZd4hacOOjq/Sparklys-Web?node-id=8642-32748): white surfaces, 3px black borders, pill single-line fields, Maison Neue text (regular field values per the 2026-09-09 refinement) and small uppercase labels.
- [Packaging Size, closed/open component](https://www.figma.com/design/wU2QCDnknQPBZd4hacOOjq/Sparklys-Web?node-id=5960-6910): 48px trigger, rounded outlined menu, checkmark and quiet gray option state.
- [Frequency Selection](https://www.figma.com/design/wU2QCDnknQPBZd4hacOOjq/Sparklys-Web?node-id=6622-29370): 30px radio indicator with a 12px black dot.

The demo adapts Figma's raw font sizes to existing shared typography roles. Multiline fields use the merchant-controlled Large radius. Semantic error colors and keyboard focus use existing shared roles. No new product, subscription or legal claims are adopted from the design.

## Tokens

| Token | Baseline |
| --- | --- |
| `--form-control-height` | 3rem / 48px minimum |
| `--form-control-border-width` | `--control-outline-width` / 3px |
| `--form-control-radius` | 999px |
| `--form-control-radius-multiline` | `--radius-large` |
| `--form-control-padding-inline` | 1.25rem / 20px |
| `--form-control-padding-block` | .625rem / 10px |
| `--form-control-gap` | .5rem / 8px |
| `--form-choice-size` | 1.875rem / 30px |
| `--form-choice-dot-size` | .75rem / 12px |
| `--form-choice-radius` | .375rem / 6px |

Border, surface, text, muted text, hover and error tokens alias existing semantic colors. Font sizes use `--font-size-ui` and `--font-size-small`; there are no new fluid type scales. Demo tuning overrides tokens only inside its preview container and can copy those overrides for review. It does not save theme settings.

## Adoption

The global layout loads `forms.css` after `base.css` and defers `forms.js` for the cart and age-check surfaces. Use Shopify `asset_url` at integration time. The theme already provides the shared input-modality helper in `theme.js`; no competing helper is installed. New reusable copy must come from English/German locale files. The standalone demo's editorial labels are temporary English examples.

```html
<div class="form-field">
  <label class="form-field__label" for="ContactEmail">Email</label>
  <input class="form-control" type="email" id="ContactEmail" name="email"
    aria-describedby="EmailHelp EmailError">
  <p class="form-field__hint" id="EmailHelp">Supporting copy.</p>
  <p class="form-field__error" id="EmailError" hidden>Validation message.</p>
</div>
```

Use `textarea.form-control` for multiline content. Set `aria-invalid="true"` on the control and expose its associated message only after validation. Labels remain visible. Read-only and disabled treatments are distinct. Keep business validation in the owning form; the baseline does not invent application rules.

```html
<label class="form-choice">
  <input type="checkbox" name="preference">
  <span class="form-choice__indicator" aria-hidden="true"></span>
  <span>Visible label</span>
</label>
```

Use `type="radio"` and a shared `name` inside a labeled `fieldset` for radio groups. `form-choice--card` adds the outlined choice-card composition. Checked checkboxes use a black surface with a white Untitled UI check, enlarged from 18px to 24px at the default size for a heavier visible stroke without modifying the source geometry. Smaller choice sizes constrain the mark to the available interior. Mixed state uses the same inverse surface with a white dash; checked hover preserves contrast. Checkbox indeterminate state is supported via the native DOM property. Native inputs preserve keyboard and form behavior, and labels provide at least a 44px hit height.

```html
<label class="form-field__label" for="Packaging">Packaging size</label>
<sparklys-select>
  <select class="form-control" id="Packaging" name="packaging">
    <option value="12">12-pack</option>
    <option value="24" selected>24-pack</option>
  </select>
</sparklys-select>
```

The native select remains the form value source and the no-JavaScript fallback. Enhancement supplies a labeled select-only combobox/listbox with Arrow keys, Home/End, Enter/Space, Escape, Tab and text-prefix navigation. Disabled/hidden options cannot be selected. Native `input` and `change` events are dispatched; form reset and native select attribute/option changes resynchronize the trigger. Programmatic `.value` changes must dispatch `change`. Invalid required selects focus the visible trigger; the owning form must still provide its associated error copy.

The popup opens above when space below is limited and otherwise below. Its scroll region is viewport-bounded; it must be used in a parent that permits visible overflow. It does not yet portal across clipped scroll containers. Multiple and grouped selects deliberately retain the native control; test those journeys before introducing custom equivalents. Browser/assistive-technology coverage beyond the tested Chromium preview is a follow-up before broad storefront rollout.

## Motion and accessibility

Selection marks and surfaces use the shared Fast duration/easing. Dropdown open/close combines a 4px directional movement with a crossfade over the shared Fast duration (200ms); reversals resume from the current opacity and transform. Escape/outside-click/Tab close without trapping focus; the native value changes only on selection. Reduced motion is immediate. Focus remains governed by the shared pointer-versus-keyboard contract with a native CSS fallback. Forced-colors mode retains visible choice marks.

The check and full-size chevron are unmodified Figma exports from the existing Untitled UI `check` (5763:8158) and `chevron-down` (5763:7727) components, saved as `icon-check.svg` and `icon-form-chevron-down.svg`. Existing compact chevron assets are not replaced. Error feedback reuses `icon-alert-circle.svg`.

This is a UI primitive library and local prototype, with no entity content requiring JSON-LD. No Shopify template, saved setting, market, live theme or editorial content is changed.

Verification: theme checks and existing tests pass; headless Chromium verified 390px/desktop layout, native select fallback with scripts blocked, keyboard choice skipping disabled options, required-email feedback, token tuning/reset, and reduced-motion popup behavior. Demo server remains local-only on port 9293 for review.

Field values, dropdown triggers and options use the shared regular field-family/weight roles; uppercase labels retain their emphasis. Button and quantity outlines share the 3px control outline token.

PDP adoption (2026-09-11): packaging and delivery frequency use `sparklys-select` with native select fallbacks; purchase choices use shared radio cards; quantity uses the shared outlined capsule. The actual Add submitter owns Ajax loading/focus, even with a separately associated native variant-update button.

## Enquiry forms — 2026-10-02

[Approved form reference](https://www.figma.com/design/wU2QCDnknQPBZd4hacOOjq/Sparklys-Web?node-id=11621-54200) defines the contact/editorial family. Add `form--inquiry` to the owning form or region; reuse the same field, native select, progressive dropdown and choice markup. Contact form opts in, including its Press page placement. The style must not be placed on `body`, a global page shell or a mixed commerce container.

- White field surfaces, 2px warm-gray borders (`#c9c4b9`), Small-radius corners (16px default), 16px horizontal padding, 48px minimum height and 8px label gap.
- Sentence-case, flush-left Maison Neue labels use the shared UI role, as do field values. Textarea minimum is 120px with the same Small radius. No section-specific font sizes are introduced.
- Placeholder/help text uses warm muted `#786e5b` at full opacity for readable contrast, rather than the reference's 40% opacity. Labels always remain visible.
- Dropdown triggers inherit the same border/surface/corners; popup corners match and options use Compact radius. The reference has no open-dropdown state, so the existing keyboard, selection, animation and native fallback contracts remain authoritative.
- Choices reuse existing native semantics/check artwork with 24px indicators and a 44px label target. Error colors, immediate keyboard rings, subtle pointer focus, disabled/read-only distinctions and reduced-motion behavior remain shared. Labels transition their error color with Fast timing.

This changes control styling only: it does not import the reference's event fields, duplicate labels, centered heading, divider or Next action into the Contact form. Its existing left-aligned editable H2 and native submission remain intact. No new static artwork is needed for these controls; chevrons/checks/errors reuse existing shared assets.

The older pill/3px style remains the commerce baseline. PDP variants, selling plans, purchase choices, cart coupon inputs, age verification, article-share controls and footer newsletter styling are unchanged. The studio's Form style switch defaults to Enquiry and can preview Commerce independently; Reset restores the selected family's tokens. Copied tuning is scoped to that family instead of `:root`.

Verification (2026-10-02): headless Chromium confirmed Contact's 2px warm border/16px corners at 1440px and 390px, sentence-case labels, no horizontal overflow, pointer outline style `none` and the keyboard ring. Studio keyboard dropdown selection updates the native value and closes; enquiry/commerce switching restores each family's geometry. Required-email feedback is visible in the studio. Reduced motion leaves no dropdown animations. With scripts blocked, the 48px native select retains the enquiry style and Contact's four required fields prevent empty submission and focus First name. No enquiry/subscription was sent. Real Soda PDP variant/plan controls remain 3px black pills at desktop and phone widths. Full repository, JavaScript syntax, JSON and whitespace checks passed; isolated browser closed.

## Checkbox selection marks

Checked and mixed checkboxes keep the unfilled field surface and existing border. Checked state displays a bold foreground tick; mixed state displays a centered foreground minus at half the indicator width. `icon-check-bold.svg` retains the existing Untitled UI check path with an explicitly approved 3-unit stroke for this control; the original check asset remains unchanged for dropdowns and other consumers. The shared native checked/indeterminate states, disabled opacity, mark transitions, focus and reduced-motion behavior remain. Forced-colors uses Canvas/CanvasText instead of a filled selection. Radio dots and PDP choice-card styling are unchanged.
