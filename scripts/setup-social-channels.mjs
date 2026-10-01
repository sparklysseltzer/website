import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createAdminClient, STORE } from './shopify-admin.mjs';

const api = createAdminClient();
const apply = process.argv.includes('--apply');
const query = `{
  shop { id myshopifyDomain metafield(namespace: "custom", key: "instagram_soda") { id type value compareDigest } }
  metafieldDefinitions(first: 10, ownerType: SHOP, namespace: "custom", key: "instagram_soda") {
    nodes { id name type { name } access { storefront } }
  }
}`;
const before = await api(query);
if (before.shop.myshopifyDomain !== STORE) throw new Error('Unexpected store.');
const definition = before.metafieldDefinitions.nodes[0];
if (definition && (definition.type.name !== 'url' || definition.access.storefront !== 'PUBLIC_READ')) {
  throw new Error('Existing social definition needs review; refusing to replace it.');
}
if (!apply) {
  console.log(JSON.stringify({ definitionExists: !!definition, valueExists: !!before.shop.metafield,
    proposedValue: 'https://www.instagram.com/sparklyssoda/' }, null, 2));
  process.exit(0);
}
const backup = join(homedir(), 'Library/Application Support/Sparklys/store-backups', `social-channels-${Date.now()}`);
await mkdir(backup, { recursive: true });
await writeFile(join(backup, 'before.json'), JSON.stringify(before, null, 2));
if (!definition) {
  const { metafieldDefinitionCreate: result } = await api(`mutation($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) { createdDefinition { id } userErrors { field message } }
  }`, { definition: { name: 'Instagram — Sparklys Soda', namespace: 'custom', key: 'instagram_soda',
    ownerType: 'SHOP', type: 'url', pin: true, access: { storefront: 'PUBLIC_READ' },
    description: 'Second Instagram account, used by Social Media Channels and the Sparklys Soda footer. Other social channels use Shopify Brand settings.' } });
  if (result.userErrors.length) throw new Error(JSON.stringify(result.userErrors));
}
if (!before.shop.metafield) {
  const { metafieldsSet: result } = await api(`mutation($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) { metafields { id } userErrors { field message } }
  }`, { metafields: [{ ownerId: before.shop.id, namespace: 'custom', key: 'instagram_soda', type: 'url',
    value: 'https://www.instagram.com/sparklyssoda/', compareDigest: null }] });
  if (result.userErrors.length) throw new Error(JSON.stringify(result.userErrors));
}
const after = await api(query);
if (!after.shop.metafield || after.metafieldDefinitions.nodes[0]?.access.storefront !== 'PUBLIC_READ') {
  throw new Error('Storefront-readable social metafield verification failed.');
}
console.log(JSON.stringify({ definition: after.metafieldDefinitions.nodes[0], value: after.shop.metafield.value, backup }, null, 2));
