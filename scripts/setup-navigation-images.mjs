import { createAdminClient } from './shopify-admin.mjs';

// Explicit provisioning only: no resource values, images, menus or theme content are changed.
const api = createAdminClient();
const apply = process.argv.includes('--apply');
const owners = ['PAGE', 'COLLECTION', 'ARTICLE', 'BLOG'];
const { currentAppInstallation } = await api('{ currentAppInstallation { accessScopes { handle } } }');
const scopes = new Set(currentAppInstallation.accessScopes.map(scope => scope.handle));
const query = `query NavigationImageDefinition($owner: MetafieldOwnerType!) {
  metafieldDefinitions(first: 10, ownerType: $owner, namespace: "custom", key: "navigation_image") {
    nodes { id name type { name } access { storefront } }
  }
}`;
for (const owner of owners) {
  const { metafieldDefinitions } = await api(query, { owner });
  if (metafieldDefinitions.nodes.length) {
    const existing = metafieldDefinitions.nodes[0];
    if (existing.type.name !== 'file_reference') throw new Error(`${owner}: existing field has an incompatible type; left unchanged.`);
    console.log(`${owner}: existing Navigation image preserved (${existing.id}).`);
    continue;
  }
  const scope = owner === 'COLLECTION' ? 'write_products' : 'write_content';
  if (!scopes.has(scope)) {
    console.log(`${owner}: pending ${scope} approval; no definition created.`);
    process.exitCode = 1;
    continue;
  }
  if (!apply) { console.log(`${owner}: would create custom.navigation_image (image file reference, storefront readable).`); continue; }
  const definition = {
    name: 'Navigation image', namespace: 'custom', key: 'navigation_image', ownerType: owner,
    description: 'Image used when this resource is linked from the main navigation. Set the focal point on the image in Files.',
    type: 'file_reference', validations: [{ name: 'file_type_options', value: '["Image"]' }],
    pin: true, access: { storefront: 'PUBLIC_READ' },
  };
  const { metafieldDefinitionCreate } = await api(`mutation NavigationImageDefinitionCreate($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) { createdDefinition { id } userErrors { field message } }
  }`, { definition });
  if (metafieldDefinitionCreate.userErrors.length) throw new Error(JSON.stringify(metafieldDefinitionCreate.userErrors));
  const saved = (await api(query, { owner })).metafieldDefinitions.nodes[0];
  if (saved?.type.name !== 'file_reference' || saved?.access.storefront !== 'PUBLIC_READ') throw new Error(`${owner}: definition read-back failed.`);
  console.log(`${owner}: created and verified ${saved.id}.`);
}
