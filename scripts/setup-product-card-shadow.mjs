import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createAdminClient } from './shopify-admin.mjs';

// Definition only. Never change any product's saved preference or artwork.
const api = createAdminClient();
const apply = process.argv.includes('--apply');
const key = 'hide_card_shadow';
const fields = 'id name namespace key type { name } access { storefront }';
const read = async () => (await api(`query CardShadowDefinition {
  metafieldDefinitions(first: 2, ownerType: PRODUCT, namespace: "custom", key: "${key}") { nodes { ${fields} } }
}`)).metafieldDefinitions.nodes[0];
const existing = await read();
const validate = definition => {
  assert.equal(definition.type.name, 'boolean', 'Existing field must be boolean.');
  assert.equal(definition.access.storefront, 'PUBLIC_READ', 'Existing field must be storefront-readable.');
};
if (existing) validate(existing);
console.log(JSON.stringify({ apply, field: `custom.${key}`, action: existing ? 'preserve existing definition' : 'create pinned product boolean', productValuesChanged: false }, null, 2));
if (apply && !existing) {
  const { currentAppInstallation } = await api('{ currentAppInstallation { accessScopes { handle } } }');
  assert(currentAppInstallation.accessScopes.some(scope => scope.handle === 'write_products'), 'write_products is required.');
  const backup = join(homedir(), 'Library/Application Support/Sparklys/theme-backups', `product-card-shadow-${Date.now()}`);
  await mkdir(backup, { recursive: true, mode: 0o700 });
  await writeFile(join(backup, 'before.json'), JSON.stringify({ definition: existing || null }, null, 2), { mode: 0o600 });
  const { metafieldDefinitionCreate } = await api(`mutation CardShadowDefinitionCreate($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) { createdDefinition { id } userErrors { field message } }
  }`, { definition: {
    name: 'Hide shadow for nav item and collection card', namespace: 'custom', key,
    ownerType: 'PRODUCT', type: 'boolean', pin: true, access: { storefront: 'PUBLIC_READ' },
    description: 'Hide the generated shadow under this product image in navigation and collection cards. Image sizing, card panel shadows and shadows already in the uploaded artwork stay unchanged.',
  } });
  assert.deepEqual(metafieldDefinitionCreate.userErrors, []);
  validate(await read());
  console.log(`Created and verified. Backup: ${backup}`);
}
