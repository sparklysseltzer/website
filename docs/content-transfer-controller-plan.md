# Theme content transfer controller — implementation plan

Status: plan requested 2026-10-04; controller implementation is not yet authorized. Current deployment protections remain in force until the controller and its reviewed rules are implemented. No transfer or deployment is authorized by this document.

## Confirmed scope

- Only the temporary development theme (`199837745539`) and shared unpublished `website/main` (`199388037507`) are transfer endpoints. Both must belong to `sparklys-hard-seltzer.myshopify.com`; revalidate their identities/roles on every operation.
- Never target, modify or publish the live theme. Refuse arbitrary theme IDs and refuse to continue if either pinned theme changes role.
- Products, collections, page bodies, menus, Shopify Files, metafields and metaobjects stay shared at store level. Do not duplicate or synchronize these records. No Admin API writes or resource-template assignment changes belong to this controller.
- Ordinary code deployment preserves content by default. Content transfer requires an explicit user request for direction and scope on each occasion. A previous content transfer must not enable a sticky overwrite preference.
- Support Dev → website/main and website/main → Dev, either for all explicitly selected theme-content categories or a particular page, collection or product template.

## What theme content means

| Category | Files / behavior |
| --- | --- |
| Template composition | `templates/**/*.json`: sections, blocks, settings, order, dynamic references and disabled state. A selected page/collection/product transfer copies the selected JSON template only. |
| Header/footer composition | `sections/*.json` section groups, selected separately or included explicitly in a whole-content plan. |
| Saved theme settings | `config/settings_data.json`, explicitly selected; includes theme-level presentation settings and app-embed state. |
| Storefront translations | Existing `locales/*.json` content, excluding schema locales, explicitly selected. Preserve the destination default-language filenames. Show changed existing values separately from additive code-owned keys. |

Code (`assets`, Liquid implementations, `settings_schema.json`) is a separate deployment scope. A content-only transfer does not install missing section implementations. Existing code-only deployment's additive locale-key behavior remains; it never overwrites existing destination translations.

A Shopify resource and a template are different. If several products use `product.soda`, transferring that template affects every product using it on the target theme. Display this clearly in the plan. Copying one product template does not copy the product, its data or its assignment. In v1, select the exact template filename/type/suffix. A later resource-URL convenience resolver can map a page/product/collection to its assigned template using read-only Admin API access and report shared usage.

## User-facing workflow

1. User requests normal deployment: prepare code-only plan; content remains protected.
2. User explicitly requests content transfer: select direction and scope, for example Dev → website/main, `templates/page.team.json` only.
3. Snapshot both remote themes fresh and produce a plan showing endpoint identity, files added/changed, readable JSON differences, shared-template implications and dependencies.
4. Review the concrete plan. Apply only that exact checksummed plan after the requested scope is clear; no generic `--force`, implicit `--all`, remembered overwrite setting or automatic transfer on commit/push.
5. Read back target files, compare expected values, retain backup/manifest and print verification/rollback instructions. No publishing action exists.

Proposed CLI shape (not implemented):

```sh
npm run content:plan -- --from dev --to main --template page.team
npm run content:plan -- --from main --to dev --template collection.soda
npm run content:plan -- --from dev --to main --template product.soda
npm run content:plan -- --from dev --to main --scope all-theme-content
npm run content:apply -- --plan /absolute/path/to/reviewed-plan.json
npm run content:restore -- --transfer /absolute/path/to/transfer-directory --dry-run
```

The default entry point remains code-only deployment. Planning content explicitly names a scope, and planning itself performs no writes. `all-theme-content` expands into an explicit reviewed inventory; it is never the default. Multiple named templates may be selected together.

## Implementation phases

### 1. Shared planning engine and endpoint guards

Extract reusable parsing, checksumming, allowlists, backups and role checks from `sync-dev-content.mjs` and `deploy-team-theme.mjs`. Preserve the current commands as compatibility wrappers. Add tests before altering their behavior.

Download both themes to isolated directories outside Git. The source is the latest saved remote theme, not an assumed up-to-date local template. Record local worktree content checksums too. Ignore Shopify generated comment headers for semantic diffs while preserving original bytes in backups.

For selected templates, keep settings/section/block IDs and their order intact. V1 uses reviewed whole-template replacement, not an inferred field-level merge. Unselected templates, global settings, groups and locales remain untouched. Do not automatically delete destination-only files; present deletion as out of scope for v1.

### 2. Compatibility and conflict validation

Validate JSON and verify that referenced section/theme-block types and required schema fields exist in the destination code. Report incompatible or absent code as a prerequisite deployment, rather than silently uploading code or dropping fields. Resource references remain in the shared store; do not remap IDs.

Block a plan if a scope is ambiguous, a snapshot is incomplete, locale identity is ambiguous or files fall outside the allowlist. Re-fetch selected source and destination files immediately before apply and compare checksums with the plan. If either changed, stop and regenerate the plan. Shopify theme writes are not a cross-file transaction: minimize the check-to-write interval, communicate a short editor quiet period, and detect/report partial results through read-back verification.

### 3. Apply, dev-watcher coordination and rollback

Use the supported CLI/API path to apply an exact file allowlist. Persist destination backup and operation manifest before the first write. Record per-file results so interrupted operations can be inspected/recovered without blindly retrying.

For pulls to Dev, coordinate the local checkout and approved watcher: acquire the sync lock, pause the watcher for the transfer, back up local content, refuse conflicting local changes, apply the reviewed content locally and remotely, then restart the previously running watcher. Never leave local stale files able to overwrite the newly imported remote content. A stopped watcher remains stopped unless separately authorized to start.

Rollback is another explicit plan. It restores only this transfer's changed files and refuses to overwrite subsequent editor changes. New-file cleanup requires its own reviewed handling; preserve remote-only files by default.

### 4. GitHub-connected shared draft

Reconcile current `origin/main` and shared-editor content before a write to website/main. A controller-specific release checkout/worktree should carry only the approved content patch plus intentional code changes, never unrelated dev fixtures. Plan the Git/GitHub path and direct theme writes together so a connected-branch release cannot undo the transfer.

Keep the current pre-push guard active. Extend it to accept a reviewed, checksum-bound content manifest for exactly the approved paths and target—not a blanket bypass. If the content update is not yet represented in the connected branch, report reconciliation as incomplete; do not claim a durable release. Pushing Git remains an explicit deployment action, separate from making local commits.

### 5. Acceptance tests and docs

- Default deploy cannot overwrite saved settings, templates, groups or existing locale values.
- Both directions work for a selected page, collection and product template and for explicit whole-theme-content scope.
- Selecting one template changes no unrelated file, global setting, shared store record or resource assignment.
- Live/unknown targets, role drift, stale plans, local conflicts, missing code and incomplete snapshots are rejected.
- Backups/read-back verification cover success, interrupted/partial writes and conflicts during rollback.
- Dev watcher cannot undo imported content; previously stopped/running state is preserved.
- Git guard accepts only the reviewed content change; unrelated protected changes remain blocked.
- Verify representative desktop/phone rendering on Dev and unpublished website/main; no live publishing test.

Document commands, content ownership, plan review and recovery in `development.md`; update AGENTS rules only for this explicit transfer path, preserving code-only defaults and live-theme prohibition. A local visual dashboard is optional follow-up after the CLI engine is reliable.
