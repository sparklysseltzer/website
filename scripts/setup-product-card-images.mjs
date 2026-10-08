import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createAdminClient } from './shopify-admin.mjs';

// TASK-013: definitions only. Never upload files or assign product images.
const api = createAdminClient();
const apply = process.argv.includes('--apply');
const fields = 'id name namespace key description type { name } validations { name value } access { storefront }';
const readDefinitions = async () => {
  const data = await api(`query ProductCardImageDefinitions {
    navigation: metafieldDefinitions(first: 2, ownerType: PRODUCT, namespace: "custom", key: "teaser_image") { nodes { ${fields} } }
    collection: metafieldDefinitions(first: 2, ownerType: PRODUCT, namespace: "custom", key: "collection_image") { nodes { ${fields} } }
  }`);
  return { navigation: data.navigation.nodes[0], collection: data.collection.nodes[0] };
};
const readAssignments = async () => {
  const products = [];
  let after = null;
  do {
    const data = await api(`query ProductImageAssignments($after: String) {
      products(first: 100, after: $after) {
        nodes { id navigation: metafield(namespace: "custom", key: "teaser_image") { id value }
          collection: metafield(namespace: "custom", key: "collection_image") { id value } }
        pageInfo { hasNextPage endCursor }
      }
    }`, { after });
    products.push(...data.products.nodes);
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);
  return products.sort((a, b) => a.id.localeCompare(b.id));
};
const imageOnly = field => field?.type.name === 'file_reference'
  && field.validations.some(v => v.name === 'file_type_options' && v.value === '["Image"]');
const before = await readDefinitions();
assert(imageOnly(before.navigation), 'Expected existing image-only custom.teaser_image; nothing changed.');
assert(['Teaser Image', 'Navigation Image'].includes(before.navigation.name), 'Unexpected navigation label; review before changing.');
if (before.collection) {
  assert(imageOnly(before.collection) && before.collection.access.storefront === 'PUBLIC_READ', 'Existing Collection Image is incompatible; nothing changed.');
}
const assignments = await readAssignments();
console.log(JSON.stringify({ navigation: before.navigation.name, collection: before.collection?.name || 'missing', products: assignments.length, artworkMigration: false, apply }, null, 2));
if (apply) {
  const { currentAppInstallation } = await api('{ currentAppInstallation { accessScopes { handle } } }');
  assert(currentAppInstallation.accessScopes.some(scope => scope.handle === 'write_products'), 'write_products is required.');
  const backup = join(homedir(), 'Library/Application Support/Sparklys/theme-backups', `product-card-images-${Date.now()}`);
  await mkdir(backup, { recursive: true, mode: 0o700 });
  await writeFile(join(backup, 'before.json'), JSON.stringify({ definitions: before, assignments }, null, 2), { mode: 0o600 });
  console.log(`Backup: ${backup}`);
  const description = 'Image used for product navigation cards and flavour links. Collection cards use Collection Image.';
  if (before.navigation.name !== 'Navigation Image' || before.navigation.description !== description) {
    const { metafieldDefinitionUpdate } = await api(`mutation ProductNavigationImage($definition: MetafieldDefinitionUpdateInput!) {
      metafieldDefinitionUpdate(definition: $definition) { updatedDefinition { id } userErrors { field message } }
    }`, { definition: { namespace: 'custom', key: 'teaser_image', ownerType: 'PRODUCT', name: 'Navigation Image', description } });
    assert.deepEqual(metafieldDefinitionUpdate.userErrors, []);
  }
  if (!before.collection) {
    const { metafieldDefinitionCreate } = await api(`mutation ProductCollectionImage($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) { createdDefinition { id } userErrors { field message } }
    }`, { definition: {
      name: 'Collection Image', namespace: 'custom', key: 'collection_image', ownerType: 'PRODUCT',
      description: 'Image used for collection, featured collection and search product cards. Navigation uses Navigation Image.',
      type: 'file_reference', validations: [{ name: 'file_type_options', value: '["Image"]' }],
      pin: true, access: { storefront: 'PUBLIC_READ' },
    } });
    assert.deepEqual(metafieldDefinitionCreate.userErrors, []);
  }
  const saved = await readDefinitions();
  assert.deepEqual(saved.navigation, { ...before.navigation, name: 'Navigation Image', description });
  assert(imageOnly(saved.collection) && saved.collection.access.storefront === 'PUBLIC_READ');
  assert.deepEqual(await readAssignments(), assignments, 'Product image assignments changed during provisioning; review concurrent edits.');
  console.log('Definitions verified. All product image assignments unchanged.');
}
