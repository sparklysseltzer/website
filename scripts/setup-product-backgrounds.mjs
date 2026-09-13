import { mkdir, writeFile } from 'node:fs/promises';
import { createAdminClient } from './shopify-admin.mjs';

const execute = process.argv.includes('--execute');
const handle = 'sparklys-soda-variety-pack';
const gradient = 'linear-gradient(180deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.9) 100%), linear-gradient(110deg, #ffb000 18%, #ffd65a 35%, #0b5588 57%, #28abe0 100%)';
const definition = {
  name: 'Gallery background image', namespace: 'custom', key: 'gallery_background_image',
  description: 'Optional background for product galleries and cards. Overrides Gallery gradient. Use background artwork without product photos or text.',
  ownerType: 'PRODUCT', type: 'file_reference',
  validations: [{ name: 'file_type_options', value: '["Image"]' }],
  access: { storefront: 'PUBLIC_READ' },
};
const graphql = createAdminClient();
const data = await graphql(`query BackgroundSetup($query:String!) {
  currentAppInstallation { accessScopes { handle } }
  products(first:2,query:$query) { nodes { id handle title
    gradient:metafield(namespace:"custom",key:"gallery_gradient") { id type value compareDigest }
    image:metafield(namespace:"custom",key:"gallery_background_image") { id type value }
  } }
  metafieldDefinitions(first:100,ownerType:PRODUCT,namespace:"custom") { nodes { id key type { name } validations { name value } } pageInfo { hasNextPage } }
}`, { query: `handle:${handle}` });
if (data.metafieldDefinitions.pageInfo.hasNextPage) throw new Error('Definition list is incomplete; paginate before proceeding.');
const product = data.products.nodes.find(item => item.handle === handle);
if (!product) throw new Error('Exact Soda Variety Pack product was not found.');
const existing = data.metafieldDefinitions.nodes.find(item => item.key === definition.key);
if (existing && (existing.type.name !== definition.type || !existing.validations.some(v => v.name === 'file_type_options' && v.value === '["Image"]'))) throw new Error('Existing background image definition differs; review before changing it.');
if (product.gradient && !['single_line_text_field', 'multi_line_text_field'].includes(product.gradient.type)) throw new Error('Unexpected gradient field type.');
console.log(JSON.stringify({ execute, product: product.title, definition: existing ? 'Preserve existing image definition' : definition, gradient, imageOverride: product.image?.value ?? null }, null, 2));
if (execute) {
  const directory = new URL('../.shopify/background-backups/', import.meta.url);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(new URL(`${Date.now()}.json`, directory), JSON.stringify(data, null, 2), { mode: 0o600 });
  if (!existing) {
    const result = await graphql(`mutation CreateBackgroundImage($definition:MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition:$definition) { createdDefinition {id} userErrors {field message} } }`, { definition });
    if (result.metafieldDefinitionCreate.userErrors.length) throw new Error(JSON.stringify(result.metafieldDefinitionCreate.userErrors));
  }
  const result = await graphql(`mutation SetVarietyBackground($metafields:[MetafieldsSetInput!]!) { metafieldsSet(metafields:$metafields) { metafields {key value} userErrors {field message} } }`, { metafields: [{ ownerId: product.id, namespace: 'custom', key: 'gallery_gradient', type: product.gradient?.type ?? 'single_line_text_field', value: gradient, compareDigest: product.gradient?.compareDigest ?? null }] });
  if (result.metafieldsSet.userErrors.length) throw new Error(JSON.stringify(result.metafieldsSet.userErrors));
  const verified = await graphql(`query VerifyBackground($id:ID!) { product(id:$id) { metafield(namespace:"custom",key:"gallery_gradient") {value} } }`, { id: product.id });
  if (verified.product.metafield.value !== gradient) throw new Error('Gradient read-back did not match.');
  console.log('Image definition available; Soda Variety Pack gradient saved and read back successfully.');
}
