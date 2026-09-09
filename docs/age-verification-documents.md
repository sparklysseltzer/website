# MRZ document references and customer guidance

Research date: 2026-09-08. Companion to the [age-check plan](age-verification-plan.md). This records the requested support matrix and research sources, not implemented validator coverage. Four choices are required: Swiss ID card, Swiss passport, Liechtenstein ID card and Liechtenstein passport. Ordinary national documents only; driving licences, residence permits and emergency/diplomatic/service passports are not implicitly supported.

## Document versions and specimen sources

| Customer choice | Version sources | Illustration and guide target |
| --- | --- | --- |
| Switzerland — ID card | [PRADO CHE-BO-02001](https://www.consilium.europa.eu/prado/en/CHE-BO-02001/index.html), first issued 3 March 2023; older [CHE-BO-01003](https://www.consilium.europa.eu/prado/en/CHE-BO-01003/index.html), first issued 1 November 2005, still listed valid | Back of the credit-card-sized document; three MRZ lines at the bottom. fedpol publishes front/back specimens of the new card. |
| Switzerland — passport | [PRADO CHE-AO-04001](https://www.consilium.europa.eu/prado/en/CHE-AO-04001/index.html), first issued 31 October 2022; [CHE-AO-03002](https://www.consilium.europa.eu/prado/en/CHE-AO-03002/index.html), first issued 1 March 2010, still listed valid | Open to the photo/personal-details page: integrated biodata card in the new version, biodata page in the previous one. Guide to the two-line passport MRZ at the bottom; verify placement on each exact specimen before producing highlights. |
| Liechtenstein — ID card | [Government introduction of the biometric ID](https://www.llv.li/de/landesverwaltung/auslaender-und-passamt/projekte/neue-identitaetskarte-und-neuer-aufenthaltsausweis-anpassungen-am-biometrischen-aufenthaltsausweis), issued from 3 January 2024; [official ID page](https://www.llv.li/de/landesverwaltung/auslaender-und-passamt/identitaetskarte); previous [PRADO LIE-BO-02001](https://www.consilium.europa.eu/prado/en/LIE-BO-02001/index.html), introduced 23 June 2009 | Separate Liechtenstein card illustration/profile. Plan a back-side, three-line card MRZ guide; precise current-version specimen and coordinate verification remain outstanding. PRADO's country list did not expose the 2024 card during research; do not substitute the 2009 picture as current. |
| Liechtenstein — passport | [PRADO LIE-AO-03001](https://www.consilium.europa.eu/prado/en/LIE-AO-03001/index.html), first issued 3 February 2026; previous [LIE-AO-02001](https://www.consilium.europa.eu/prado/en/LIE-AO-02001/index.html), introduced 26 October 2006 | New integrated biodata card versus previous personal-details page. Use the matching photo-page illustration and two-line passport MRZ guide; verify the exact specimen coordinates before implementation. |

A model's introduction date is not an individual document's expiry date. Do not reject an older design merely because a new one exists. Add a compact “My document looks different” version selector with thumbnails and issuance-era help. Country means the document's issuing country, not shipping destination or residence. Never combine Swiss and Liechtenstein profiles by replacing only a country label.

## Formats and field mapping

Use separate version profiles over shared ICAO TD1 (three lines of 30 characters) and TD3 (two lines of 44 characters) parsing primitives. [ICAO Part 5](https://www.icao.int/sites/default/files/publications/DocSeries/9303_p5_cons_en.pdf) covers TD1; [Part 4](https://www.icao.int/sites/default/files/publications/DocSeries/9303_p4_cons_en.pdf) covers passports. The official PDFs were retrieved during implementation. MVP uses standard TD1 and TD3 offsets; edition-specific artwork and nonstandard exceptions remain a rollout review.

The 2023 Swiss ID back was downloaded to temporary storage and visually inspected from [fedpol's official specimen](https://prod-fedpoladminch-hcms-sdweb.imgix.net/dam/de/sd-web/pNPQ6XAwlTSu/nIDK-back.webp). It has three bottom lines, `IDCHE` at the start, birth and expiry values on the second line, and names on the third. The eight-character document number is padded with a filler to the standard nine-character field; its check digit remains in standard TD1 position 15. This is not a shifted Swiss check-digit exception. The specimen is covered by a validator fixture. Do not request the third/name line when it is not needed for the checks.

Guided inputs must cover document number, its printed check digit, MRZ birth date and check digit, expiry and check digit, plus any variable optional data and final check digit needed for a genuine composite check. The exact grouped fields are profile-dependent. Validate against the printed digits rather than generating the expected digit into a field and calling it verified. Names and printed sex are not required merely because the document displays them.

Dates in the MRZ use YYMMDD, not the printed human-readable date format. Use “JJMMTT” in German help with a clearly fictional date example. Distinguish zero from O without silently changing characters. [fedpol](https://www.fedpol.admin.ch/en/passport-and-identity-card) specifically says Swiss document numbers do not use letters O or I and the zero has a central dot; this is Swiss-specific guidance, not a rule to copy to Liechtenstein without evidence.

## Guided experience

1. Select issuing country and ID card/passport using four clear choices; do not require knowledge of “TD1”, “TD3” or “MRZ”.
2. Show the matching document version illustration. ID help: “Turn your identity card over. Look for the three lines with letters, numbers and < signs at the bottom.” Passport help: “Open your passport to the page with your photo and personal details. Look for the two lines with < signs at the bottom.” Final placement must match the verified specimen.
3. Place labeled, focusable inputs inside the schematic at the corresponding positions; show field-specific instructions on focus. Avoid zooming the whole modal or forcing horizontal scrolling on phones.
4. Explain each field in words as well as visually: which line, where it starts and whether to include a following check digit. Keep the guide visible while entering values; no automatic focus jumps on partial input.
5. Explain that < is a filler character, not a space. Only ask users to type fillers where the selected input actually requires them. Do not assume all optional fields contain fillers.
6. Place errors next to the affected field, preserving other entries. Missing/incorrect data is not the same message as being below the required age. Support keyboard input, paste and screen-reader descriptions.

Draft German instructions for later locale translation work:

- ID: “Dreh deine Identitätskarte um. Unten findest du drei Zeilen mit Buchstaben, Zahlen und < Zeichen.”
- Passport: “Öffne deinen Pass auf der Seite mit deinem Foto und deinen persönlichen Angaben. Unten findest du zwei Zeilen mit < Zeichen.”
- Field helper: “Übertrage nur die markierten Zeichen. Achte darauf, Zahlen und Buchstaben genau zu übernehmen.”
- Version selector: “Dein Dokument sieht anders aus?”

English is the eventual source locale; these are German copy proposals, not hardcoded theme content. Preserve the existing in-cart modal, cancellation and raw-data deletion contracts.

## Images, attribution and remaining asset work

Located primary image/reference sources:

- [fedpol ID photo gallery](https://www.fedpol.admin.ch/de/fotos-neue-identitaetskarte), including downloadable front and back; back specimen visually inspected.
- [fedpol passport photo page](https://www.fedpol.admin.ch/en/photographs-of-the-new-passport) and the Swiss passport PRADO entries above. The current photo page returned reproduction terms but no downloadable passport image links in extracted content.
- Liechtenstein official ID page and the PRADO ID/passport entries above. Their metadata was accessible through search, but direct browser/image retrieval met site access challenges. Full-resolution current Liechtenstein ID and passport specimens have not yet been visually verified or imported.

fedpol's galleries describe media reproduction as identical/unmodified with fedpol attribution. Do not assume this grants modified commercial UI artwork rights. Keep any approved official specimen unmodified with attribution; place instructions separately. For interactive highlighting, prefer our own clearly marked schematic illustration that preserves document proportions and MRZ positions without reproducing security artwork, seals or a usable identity. Confirm permission before shipping official images in a commercial form. PRADO/LLV image permissions need asset-specific review; being publicly viewable is not a licence.

No customer photos or scraped personal documents. No AI-generated security-document details as a parsing reference. Final diagrams should be SVG/HTML with fictional or masked values, labeled “Example”, and accessible accompanying text. Store approved assets locally in the theme, with source, version, rights and attribution recorded; no runtime hotlink or tracking request to the source websites.

Before implementation sign-off: obtain and visually inspect each current/older supported specimen, finalize profile offsets and fixtures, approve illustration rights or schematic artwork, and confirm field highlights match each version. Version discovery is complete enough to plan the four choices; finished production illustrations and tested parser coverage are not being claimed by this research.

## Implemented baseline

Four country/document choices share standard ICAO parsing. Interactive HTML schematics, location instructions and a current/previous Liechtenstein ID selector are implemented. Exact issuer artwork remains a later refinement. Expired documents are accepted under the confirmed merchant policy. Foreign documents are scoped in the extension backlog, not enabled by a generic country switch.

## Inline document UX — 2026-09-08

The actual inputs now live inside the illustrated document's code area; the separate field grid has been removed. TD1 rows preserve document number/check digit/optional data and birth/expiry/nationality/tail order. TD3 uses the lower passport row, including optional/checksum data. Narrow screens wrap groups within the document instead of shrinking text or forcing horizontal scrolling. Accessible field labels and descriptions remain real HTML; the guide is not aria-hidden. When needed to resolve age eligibility, the full birth year appears in a clearly separated in-card annotation (from the front of an ID or the printed passport birth date), not falsely positioned as a four-digit MRZ field.

The Liechtenstein ID selector distinguishes current (from 2024) and previous (before 2024) cards. It changes guide appearance/caption while preserving entered values; changing document type clears inputs. Both use the supported standard TD1 field mapping. Historical issuer-specific exceptions remain unsupported. Current and previous artwork are schematic, not photographs or a claim of exact security-art reproduction.

Reference corrections from visual inspection:

- The supplied Reddit image shows the **2026 Liechtenstein passport**, not an identity card. It was used for the passport guide. Its specimen values are now a checksum regression fixture. [Official version record](https://www.consilium.europa.eu/prado/en/LIE-AO-03001/index.html).
- The supplied Google thumbnail shows the **2024 Liechtenstein ID front**, not the pre-2024 card. The matching [2024 back specimen](https://commons.wikimedia.org/wiki/File:2024_Liechtenstein_ID_card_back.png), sourced there to the Liechtenstein government, was visually inspected for code placement. Its printed values are a second checksum fixture. The [government introduction](https://www.llv.li/de/medienmitteilungen/einfuehrung-biometrische-identitaetskarte-und-neuer-aufenthaltsausweis) establishes the 2024 edition; [PRADO LIE-BO-02001](https://www.consilium.europa.eu/prado/en/LIE-BO-02001/index.html) documents the preceding edition.
- The supplied Wikimedia passport image currently also shows the **2026** booklet, with its photo/data page below the facing page. Do not label it as the old passport.
- The supplied Graubünden image shows the Swiss 2022 passport's cover and open spread; fields belong on the lower photo/data page, not the illustrated facing page. The supplied Swiss ID screenshot establishes the in-document input baseline.

All source images were inspected from temporary local downloads only. Runtime illustrations are original CSS/HTML schematics using shared colors, typography and radii. No document photographs, personal specimen portraits, security artwork or third-party image requests are shipped. Full production artwork remains a later refinement. Do not prefill specimen values into customer inputs.

Verification of the inline change: full checks passed with 11 validator tests. Headless desktop (1440px), phone (390px and 320px), and 150% root-text checks showed no horizontal overflow. All four document choices retained unique input names, correct enabled fields and successful specimen validation. The ID version switch preserved entered values; success cleared them. Passport guides hide the ID-only filler confirmation. Decorative content remains excluded from the accessibility tree, while actual fields and contextual help remain available.

### Conditional birth-year clarification

The full birth-year field is hidden and disabled by default. After MRZ checks pass, the validator considers valid, non-future birth dates matching the two-digit year within the existing supported range (1800 through the current year). If all possibilities meet the minimum age, no extra input is needed. If eligibility differs, reveal and focus the full-year field below the card inside its surrounding panel with a localized explanation. An explicit year must match the MRZ and calendar date; minors remain blocked. Editing the MRZ birth value clears and hides the clarification again. This applies consistently to all supported document profiles. No document data is persisted.

### Swiss ID mask simplification — 2026-09-09

Swiss ID optional blocks are rendered as fixed fillers: 15 on line one and 11 before the final digit on line two. The controller reconstructs these blocks for the unchanged strict composite validation. Only the final numeric check digit is editable; no filler checkbox or live visible field-help paragraph remains. Other profiles retain their optional-data inputs. Non-filler Swiss layouts are not supported by this simplified mask and must never bypass checksum failure. Document-number input is uppercased; numeric inputs filter typing/paste and enforce maximum lengths. Check digits have compact 44px controls with accessible labels. Screen-reader field descriptions remain. Privacy information uses the existing general info surface and accurately describes tab-only, 12-hour storage; customer-account persistence is still future work.

### Supplied Swiss ID background — 2026-09-09

The Swiss ID uses the merchant-supplied `idschweizformbackground.webp`, retained unchanged as `assets/age-swiss-id.webp` (1200 × 750). CSS displays only its upper 430px illustration region; the baked-in code area is replaced by an HTML grid containing five real inputs and fixed characters. The centered card is capped at 37.5rem (600px), or 21.25rem (340px) below the 600px viewport breakpoint, and shrinks to available space. A padded Warm surface panel with Compact radius surrounds it. Two equal grid tracks align desktop code lines; below a 32rem card width, complete groups stack in reading order. Below 16rem, dates stack individually and the document prefix moves above the number. Inputs retain dedicated document sizing, Courier text, accessible labels and at least 44px targets, with no coordinate overlays or horizontal scrolling. The full-year clarification sits below the card inside the gray panel for every profile. Other profiles retain their schematic artwork. No external runtime assets or document uploads are used.

The primary action is now “Verify & checkout” / “Prüfen & zur Kasse”. The redundant bottom back button is removed; close icon, Escape and backdrop dismissal remain. The requested privacy wording says logged-in users' age checks are remembered; implementation remains scoped to the current customer context and tab for 12 hours, not server-side customer-account persistence. The wording change does not change storage behaviour.

Document inputs use `Courier, "Courier New", monospace` to distinguish fixed-width document characters. Labels retain the shared UI font; input sizes retain shared typography roles.

### Swiss ID annotation refinements — 2026-09-09

The Swiss code guide uses the shared Compact typography role for both Courier input values and fixed characters (18–20px at a normal root). Fixed text, including all fillers and the example name line, uses Primary text. A decorative `M/F` replaces the middle dot between date fields; a decorative `<` follows the document-number field before its check digit. The localized name example is `SURNAME<<GIVENNAME` in English and `NACHNAME<<VORNAME` in German. Filler spans include surplus decorative characters clipped to the available track width, including after the example names. These spans are aria-hidden and never submitted: checksum reconstruction still uses exactly 15 and 11 fillers, and no name or sex data is collected. Narrow layouts preserve the M/F guide and move only the document prefix above its input group. No schema, commerce policy, or structured-data entity changes.

Verified headlessly at 320, 390, 599, 600, 768 and 1440px: five unique Swiss fields, no overlap, controls contained within the card, no horizontal dialog overflow, and at least 44px targets. The 390px view also passed at a 150% root size; keyboard Tab reaches the check digit with a visible focus ring. Phone and desktop screenshots were reviewed. Theme checks and all 14 validator tests passed. Strict jq rejects existing Shopify-generated comments in settings_data.json and templates/index.json; parsing after removing only those leading comments validates all JSON without editing protected files.

Swiss ID number-length correction (2026-09-09): the first input accepts at most eight characters, and validation requires exactly eight alphanumeric characters for `ch-id`. The ninth code-zone position is the fixed `<` shown after that field and appended internally for checksums. Other document profiles retain their existing number-length rules. Regression coverage rejects both seven- and nine-character Swiss ID numbers.

### Dedicated Swiss ID typography — 2026-09-09

The merchant explicitly approved independent styling for this document composition, superseding the Compact-role assignment above. Scoped `--age-document-*` tokens control Courier family, font size, 1.15 line height and input padding. Code characters and inputs use 1.5rem (24px) from 600px viewport width and 1.25rem (20px) below it, with root-relative enlargement preserved. Every input has identical .375rem horizontal and .25rem vertical padding and centered values, including single check digits. The 44px minimum target remains; inter-row spacing is .375rem. The eight-character Swiss document-number limit remains enforced. Other document profiles, modal copy and the full-year question retain shared typography. No commerce/data or JSON-LD changes.

The document-specific `--age-document-letter-spacing: .1em` applies the merchant-requested 10% tracking to fixed characters and entered values. Desktop code lines use 3:2 tracks to accommodate complete date values at 24px with tracking; narrow cards continue stacking complete groups.

The Swiss document-number field now sizes to eight Courier characters, their .1em tracking, the common horizontal padding and border. The first row uses a content-sized identity group so decorative fillers receive the released space; constrained cards can still shrink the field track. Centering, type sizes and the eight-character limit remain unchanged.

### Card-local help view — 2026-09-09

An accent pill with the existing Untitled UI alert-circle icon floats at the upper right of the document surface. Its translated Help/Hilfe label changes to Back/Zurück with the existing x-close icon while expanded. The button controls an inline help panel through aria-controls/aria-expanded; it never submits the form. The help panel replaces the entry view in the same surface. The Swiss profile uses the merchant-supplied Downloads/idschweizcallouts.webp, copied unchanged to assets/age-swiss-id-help.webp (1200 × 750), with translated alt text and an ordered legend using existing field labels. Other profiles show the shared support text without the Swiss illustration. The former bottom support disclosure is removed and its title/body live in this panel. Further merchant-written explanatory copy remains pending.

Toggling preserves the mounted inputs and entered values. Inactive content is inert during the crossfade and hidden afterward. Shared Base duration (260ms) and easing animate both opacity and container height; content is clipped only during the transition to prevent collisions with following content. Interrupted toggles resume from painted opacity/height, cancel prior animations, and discard stale cleanup. Reduced motion switches immediately. Document changes, dialog cleanup and verification return to entry; validation can focus its real field even when submitted from help. Keyboard focus stays on the toggle and skips inactive inputs.

Verified in an isolated headless browser at phone/desktop sizes: supplied image and support text, no horizontal overflow at 320/390/1440px, retained eight-character entry after toggling, rapid reversals, keyboard activation and hidden-field exclusion, profile changes, and zero animations with actual prefers-reduced-motion emulation. Full theme checks and 15 validator tests passed; JSON validates after excluding the existing Shopify-generated leading comments. No new entity or applicable JSON-LD, remote runtime image, document upload, or shared-theme deployment is introduced.

### Ananotes refinements #49–59 — 2026-09-09

The privacy notice uses the requested light blue information surface (#eaf4ff) and dark blue text (#164b76), scoped to this persistent age-check notice; global Info toasts remain unchanged. Help uses inverse white text/icons over an accent-derived background darkened by 12% for legibility, with Untitled UI Line help-circle and arrow-left replacing alert-circle/x-close. Local assets retain the official SVG geometry and existing license.

The normal card and callout image share a soft two-layer shadow. The normal illustration displays at 101% width inside a 1200:420 crop to exclude the source image’s pale right/bottom edge; source pixels/files are unchanged. Decorative filler runs are measured using the rendered Courier metrics and letter spacing, and a ResizeObserver updates them to a whole-character count. No partial trailing characters or surplus hidden runs remain. At very narrow widths the localized name example wraps between surname and given name; fixed validator filler counts remain unchanged.

The document label is Choose your ID / Wähle deinen Ausweis. Label/select share a flex row where space permits and wrap on narrow phones, with the native select constrained to available width. The location paragraph above the card is removed; other profiles retain location guidance within help. Intro copy omits the expired-document sentence, without changing expired-document acceptance. Swiss help uses the merchant-requested instructions and clickable hallo@sparklys.ch contact with the request for a Swiss ID copy; this is email copy only, not a new upload or automated verification feature. It supersedes the former Swiss visible support text; other document profiles retain existing support guidance. The numbered legend remains available to assistive technology but is visually hidden beneath the explanatory image.

Verified desktop and phone screenshots, complete filler glyphs at 320/390/599/600/768/1440px, 44px inputs without overlap, keyboard access to help/contact, preserved input on rapid toggle reversals and immediate reduced-motion switching. Full checks and all 15 validator tests passed; existing Shopify-generated comment headers require comment-aware JSON validation. No new Schema.org entity or shared-theme deployment.

## International passport form — 2026-09-09

The previous four-choice limitation is superseded by the implemented standard TD3 option and seven-field passport form described in [international passport support](age-verification-international-plan.md). Country-specific illustrations remain examples, while format-compatible passports use one shared validator and responsive Courier card.

### Background checkout policy check — 2026-09-09

Checkout refreshes the authoritative cart age policy before opening the age dialog. The originating checkout button shows an inline spinner with accessible busy/disabled semantics; repeat submissions are ignored while pending. No age dialog opens for alcohol-free carts or a reusable age result. Only a required age entry opens the modal and makes the cart drawer inert. Failed requests or missing product classification use the shared error toast and leave the cart available for retry. Replaced cart content, pending cart mutations and a closed originating drawer prevent a stale response from proceeding. Loading cleanup restores the button; reduced motion keeps a static loading indicator. Native form and no-JavaScript age-gate fallbacks are preserved.

Ananotes 60–63 (2026-09-09): help illustration uses a clipped 101% image in a rounded aspect-ratio frame; transition overflow remains visible to preserve shadows; the help/back control has stable width and dialog top anchoring with viewport-bounded scrolling. Shortened EN/DE Swiss help instructions retain the field-entry direction. Original image asset is unchanged.

### Ananotes 69–70 — 2026-09-09

Entry and help panels now share the canvas top inset instead of adding padding only to help. Their card/image top coordinates remain identical during and after help toggles; phone help width matches the entry card cap. Field validation lives directly after the card inside the entry panel, before the optional birth-year prompt, with a red error surface and local Untitled UI alert-circle icon. Existing live regions, input descriptions, invalid state and focus behavior remain connected; errors fade in through shared motion and respect reduced motion. Desktop/phone checks confirmed stable card tops and error containment.

Merchant refinement (2026-09-09): removed the extra shared top clearance added for Ananotes 69. Both card views now begin at the normal canvas inset (16px desktop / 8px phone), while the help/back button floats over them with natural compact width and 8px horizontal padding. The button retains its 44px touch height; changing its label cannot affect document layout.

Helper artwork refinement (2026-09-09): the clipped helper image frame uses the same shared Small corner radius as the entry card.

### Configurable minimum age — 2026-09-09

Theme settings → Age check → Minimum age offers 16 or 18 years, defaulting to 18. `age_check_minimum_age` supplies the server-rendered policy for explicitly alcoholic items; alcohol-free carts still require no age check. The dialog intro and underage message interpolate the freshly fetched policy threshold in English/German. Raising the threshold invalidates a remembered result that only met the lower minimum without requiring a manual policy-version change. Existing saved settings are not overwritten. Regression coverage includes a 17-year-old failing the 18-year threshold, exact 18th birthday, old-result invalidation, and rendered 18-year copy.
