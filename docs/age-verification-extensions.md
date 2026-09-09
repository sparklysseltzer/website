# Age-check extensions

The local MVP is described in [the implementation contract](age-verification-plan.md). These are scoped follow-ups, not claims of current support.

- **AGE-001 — Account persistence:** authenticated customer write/read integration; minimal threshold/method/timestamps/version only, explicit expiry and account isolation. Requires separately approved infrastructure; no browser Admin API secrets.
- **AGE-002 — Foreign passports:** proposed shared ordinary TD3 path, preceded by a compatibility matrix; see [International coverage plan](age-verification-international-plan.md). No 100-country menu or additional shipping markets.
- **AGE-003 — Foreign IDs:** proposed curated coverage beginning with Italian CIE; reuse reviewed TD1/TD2 primitives and document-specific rules. See [International coverage plan](age-verification-international-plan.md); no unrestricted Other ID acceptance.
- **AGE-004 — Document artwork and coverage (partially delivered):** inline fields, responsive schematics and the Liechtenstein ID version switch are implemented. Further refine the supplied baseline, provide recognizable rights-cleared local illustrations for current/older CH and LI editions and a version selector where layouts differ. Verify each guide against official specimens.
- **AGE-005 — Unsupported-document assistance:** agree the merchant-operated alternative and customer wording before offering it. Never request ID photos by ordinary email or silently bypass the gate.
- **AGE-006 — Server enforcement:** separately scope Shopify checkout validation across direct/express checkout paths. A client boolean is not trustworthy evidence. This requires an app/Function architecture decision.
- **AGE-007 — Privacy and operational review:** verify every installed analytics/session-replay integration excludes document fields; optional aggregate outcomes only, no MRZ, birth dates or document numbers. Add regression coverage when integrations change.

Already in MVP: durable per-tab convenience state, context/version/expiry invalidation, rechecked cart policy, success feedback and automatic checkout handoff, expired-document acceptance, mixed-cart classification and fail-closed missing metadata.

## Direction recorded 2026-09-09

The merchant retains local MRZ checking for now. The [international coverage strategy](age-verification-international-plan.md) is a proposal, not newly implemented support. The [provider reference](age-verification-provider-reference.md) records API options and dated pricing for future evaluation only. No biometric service, subscription, new infrastructure or deployment is authorized by this documentation work.
