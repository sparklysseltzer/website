# International MRZ document coverage plan

Date: 2026-09-09. Status: proposed implementation plan; no additional documents enabled by this change.

## Objective and boundaries

Enable customers living in Switzerland or Liechtenstein to use supported foreign-issued documents. Issuing country, nationality, residence and delivery market are different concepts. Foreign-document acceptance must not enable additional Shopify markets, shipping destinations, currencies or tax behavior.

Current decision: retain local MRZ plausibility/age checks. No paid provider, camera/OCR, biometric flow or new backend in this phase. [Provider options](age-verification-provider-reference.md) are future reference only. Current implemented choices remain Swiss ID/passport and Liechtenstein ID/passport, with the coverage limitations recorded in [Document references](age-verification-documents.md).

## Recommendation

Use a short hybrid document selector:

- Keep the four existing choices and their stable profile IDs for the first rollout.
- Add **Passport — another country** for supported ordinary TD3 passport layouts.
- Add a curated set of national ID choices as their editions pass review, beginning with **Italy — electronic ID card**.
- Provide **My document looks different / Other document** assistance. This is not an automatic acceptance path or an unrestricted generic ID validator.

Avoid the customer-facing phrase Rest of the World: it does not explain which document type can be used. The passport label must be accompanied by a visual explanation that it is the ordinary international passport with two machine-readable lines on its photo/data page. Do not advertise all passports or all countries.

When the list grows, use native optgroups for ID cards and passports. A separate document-type control plus a short supported-ID-country selector is a later UI option if the combined list becomes cumbersome. Do not require a 100-country selector merely to determine the standard passport format.

## Alternatives considered

| Option | Benefit | Cost or limitation | Decision |
| --- | --- | --- | --- |
| 100+ country entries | Explicit country selection | Long list, potentially misleading coverage claim, little value for a shared passport format | Do not use initially |
| Popular country entries for every passport and ID, plus generic fallback | Familiar documents | Duplicates standard passport UI and increases artwork maintenance | Use named entries for reviewed IDs, not every standard passport |
| CH/LI plus one catch-all for every foreign document | Short | Conflates passports, IDs, permits and legacy formats | Reject unrestricted catch-all |
| CH/LI plus generic standard passport and curated foreign IDs | Broad passport reach with targeted ID convenience | Requires explicit layout support boundaries and ID edition review | Recommended |

## Formats and country differences

[ICAO Doc 9303](https://www.icao.int/publications/doc-series/doc-9303) defines TD1 (3 × 30 characters), TD2 (2 × 36) and TD3 (2 × 44). Shared format parsers can cover many issuing countries. Country/edition-specific number lengths, optional fields, date conventions, extended numbers and legacy layouts still require deliberate handling.

Italy has a national electronic identity card, the **Carta d'Identità Elettronica (CIE)**, in addition to passports. Its official documentation describes an ICAO-compatible credit-card format and a document number of two letters, five digits and two letters. The Swiss eight-character input and its fixed number filler cannot be reused for CIE. [Italian Ministry of the Interior](https://www.cartaidentita.interno.gov.it/en/cie/cie-features/)

A passport-first release is a practical first increment, not a permanent foreign-customer passport requirement. Customers may have an ID card available without a passport; supporting selected foreign IDs is part of the inclusion objective. A country appearing in the research queue is not a claim that all its IDs have MRZs or share one layout.

## Phase 1 — Broad ordinary-passport support

### Shared parser and mask

Build one neutral, recognizable passport photo-page/code guide for ordinary TD3 layouts, retaining the existing accessible inputs/help toggle, responsive sizing and locale conventions. Use rights-cleared schematic artwork rather than a Swiss image with another country label.

Use the actual printed lower MRZ line as the mapping reference. Its groups are document number (9 positions), number check digit (1), nationality (3), birth date plus check digit (7), sex (1), expiry date plus check digit (7), optional data (14), optional-data check digit (1) and composite check digit (1). The core checks consume the relevant groups; do not request names or the upper name line just to recognize the format. Do not hardcode CHE/LIE, the Swiss eight-character rule, Swiss character exclusions or Swiss filler blocks in the international path.

Nationality is not issuing country. The lower line cannot be used to infer issuing country; it carries nationality. If an edition-specific exception needs issuer/version selection, ask specifically then. Never label a nationality value as issuer. A generic standards-based path should not pretend that issuer authenticity was checked.

Preserve printed characters needed for validation, including fillers and optional data. A full 44-character lower-line paste can be an optional convenience alongside guided fields; it should parse into the same validation path, never retain or transmit raw MRZ text. Reject incorrect lengths before indexing. Do not silently alter OCR-like character confusions.

### Compatibility work before release

- Validate document-number, DOB, expiry, optional-data and composite check digits; preserve current confirmed age/expired-document policy.
- Test optional-data check-digit fillers versus numeric digits and nonempty optional fields.
- Review extended-number layouts, incomplete/unknown DOB components, special expiry conventions and older documents. Support with explicit tests or classify as unsupported; never relax checksum failure to make an exception pass.
- Retain the full-year clarification only where age eligibility remains ambiguous.
- Distinguish unsupported layout, transcription/checksum error and below-age outcome.
- Limit this phase to ordinary international passports. Internal passports, emergency documents, refugee/stateless travel documents, visas and nonstandard layouts need separate review even if they resemble a passport.

### Evidence and release gate

Review official issuer/PRADO specimens and add regression fixtures across a proposed initial sample: Italy, France, Germany, Portugal, Spain, Ukraine and the UK, plus existing CH/LI fixtures and additional examples representing optional-data variation. This is a practical research sample, not a demographic ranking or the final country allowlist. Record issuing country, document edition, official source, format, observed variations, fixture and support status in the coverage matrix.

Release the generic option only after the common format and documented edge cases pass. It can accept other ordinary passports within the verified standard contract without a country-specific drawing; unsupported structures must produce assistance rather than a false universal-coverage claim.

## Phase 2 — Curated foreign identity cards

Start with Italian CIE. Then research France, Germany, Portugal, Spain and Ukraine as a proposed queue; prioritize using actual merchant/customer needs rather than inventing population statistics. Passport support for these customers need not wait for every ID mask.

For each country and edition:

1. Inspect official front/back specimens; establish whether the edition has a usable MRZ and its actual mapping.
2. Record document-number length/character rules, optional data, date conventions, check digits and expiry exceptions.
3. Reuse TD1/TD2 primitives where valid; add an edition adapter only where needed.
4. Supply one suitable localized guide per materially different layout. Do not duplicate the validator or create a new illustrated skin merely because a country differs.
5. Add positive, wrong-digit, incomplete-input and unsupported-edition fixtures before showing the option.

No **Other ID card** acceptance option until a bounded generic ID contract has been researched and tested. The existence of TD1/TD2 does not establish universal national-ID compatibility. Review Swiss residence-permit editions as a separate later coverage increment.

## Phase 3 — Coverage refinement

Track only coarse unsupported-document requests and task completion outcomes, with no document numbers, MRZ, DOB, names or images in analytics. Use this evidence to prioritize additional ID editions, permit types and passport exceptions. If camera/OCR is later requested, it is a separate local-capture usability project; it does not strengthen authenticity by itself.

## Implementation boundaries and verification

- Keep all new behavior buildless and all customer-facing strings in English/German locales. New locale entries require reviewed integration with current editor-owned content before deployment.
- Separate parser primitives, format/profile rules and presentation/help assets. Preserve existing profile, section, block and setting IDs.
- Keep one input per value, a native selector, visible keyboard focus and 44px primary targets; preserve typed data on help toggles and clear it on document changes/close/success according to the existing contract.
- Test phone/desktop, keyboard, reduced motion, paste/filtering, ambiguous years, document switching, both cart surfaces and no-JavaScript core cart behavior. Successful tests must not place an order.
- Keep shared editorial content and deployments outside this planning task. No new Schema.org entity is introduced by private age-check form coverage.

## Next concrete deliverable

A reviewed TD3 compatibility matrix plus generic-passport UI/parser change, followed by a separately verified Italian CIE profile. The remaining foreign-ID queue stays proposed until evidence and priority are established. Provider adoption remains deferred.

## Implemented standard passport support — 2026-09-09

The selector retains the four existing choices and adds **Another country — passport** (`international-passport`). All three passport choices share the TD3 form. Country selection does not configure Shopify markets or establish residence or nationality.

Research basis: [ICAO Doc 9303 Part 4, section 4.2.2.2](https://www.icao.int/sites/default/files/publications/DocSeries/9303_p4_cons_en.pdf), eighth edition with published amendments through February 2026. Standard passports have two 44-character lines, with P at the start of the first. The form collects only checksum-relevant groups from the second line:

| Positions | Input | Length |
| --- | --- | --- |
| 1–9 | Passport number, preserving internal fillers; omitted trailing fillers are padded | Up to 9 |
| 10 | Number check digit | 1 |
| 14–20 | Birth date YYMMDD and check digit | 7 |
| 22–28 | Expiry date YYMMDD and check digit | 7 |
| 29–42 | Optional data, including all fillers | 14 |
| 43 | Optional-data check character | 1 |
| 44 | Composite check digit | 1 |

Names, issuer, nationality and sex are not collected. The displayed XXX nationality marker is illustrative, not inferred from the issuing country. International numbers allow A–Z, digits and fillers, including O and I. Empty optional data accepts either 0 or < as its check character; nonempty optional data must pass its check digit. The composite includes the printed optional check character. Existing Swiss number restrictions remain scoped to Swiss documents.

Support is format-based, not a certification of every national document/version. No country allowlist is required. Different layouts, visas, foreign ID cards, incomplete birth/expiry dates and a filler instead of the passport-number check digit remain unsupported; the form explains this rather than inventing a date or an extended-number interpretation. Expired documents retain the existing age-plausibility behavior. This is a local checksum/age plausibility check, not document authentication, identity verification or residence verification.

### Presentation and validation

Passport artwork is capped at 600px desktop and 340px phone, bounded by available width. It shares the Swiss card's isolated Courier typography (24px desktop, 20px phone), 0.1em tracking, centered input characters, equal horizontal padding and compact vertical padding. The lower code line wraps in reading order into number, dates and optional-data groups; the ending check characters stay separate so every input remains usable on narrow screens. The existing help/back transition and reduced-motion behavior are reused with passport instructions in English and German. No uploaded image or provider is required.

Tests cover the published ICAO specimen, synthetic number/filler variations, both empty optional-data check variants, nonempty optional data, each ending checksum, incomplete dates, existing CH/LI fixtures and age/century boundaries. These tests establish parser behavior, not country-by-country document authenticity.

Verification: `npm run check` passed, including 18 age-validation tests; JavaScript syntax and whitespace checks passed. Headless localhost checks at 320px, 390px and desktop verified profile switching, input containment/touch heights, help/back value retention, keyboard progression, reduced-motion switching and a published ICAO fixture through the form with checkout handoff stubbed. Strict jq reports the two existing Shopify comment-header files; comment-aware parsing validates all 21 JSON files. Nothing was published.
