// Create the shared Slides definition and optionally add reviewed starter entries.
// Existing definitions and entries are checked and preserved, never overwritten.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createAdminClient, STORE } from './shopify-admin.mjs';
const api = createAdminClient();
const sourcePath = process.argv.find(value => value.startsWith('--source='))?.slice(9);
const source = sourcePath ? JSON.parse(await readFile(sourcePath, 'utf8')) : [];
const fields = [
  { key: 'name', name: 'Name', type: 'single_line_text_field', required: true, description: 'Internal name used when selecting slides.' },
  { key: 'media', name: 'Media', type: 'file_reference', required: true, description: 'Choose one image or video. Videos play muted.', validations: [{ name: 'file_type_options', value: '["Image","Video"]' }] },
  { key: 'mobile_media', name: 'Mobile media', type: 'file_reference', description: 'Optional image or video for phones. Blank uses Media, cropped to fill the panel.', validations: [{ name: 'file_type_options', value: '["Image","Video"]' }] },
  { key: 'headline', name: 'Headline', type: 'multi_line_text_field', required: true, description: 'Displayed below the media. Line breaks are preserved.' },
  { key: 'link', name: 'Link', type: 'url', description: 'Optional destination URL for the media and button: a page, product, collection or external website.' },
  { key: 'button_label', name: 'Button label', type: 'single_line_text_field', description: 'Optional action label. Leave blank to use the storefront’s translated Learn more label. The button uses Link.' },
];
const before = await api(`{ shop{myshopifyDomain} currentAppInstallation{accessScopes{handle}}
 metaobjectDefinitionByType(type:"slides"){id name fieldDefinitions{key type{name} required validations{name value}}}
 metaobjects(type:"slides",first:250){nodes{id handle fields{key value}}} }`);
if (before.shop.myshopifyDomain !== STORE) throw Error('Unexpected store');
for (const scope of ['write_metaobject_definitions', 'write_metaobjects']) if (!before.currentAppInstallation.accessScopes.some(s => s.handle === scope)) throw Error(`Missing ${scope}`);
for (const entry of source) {
  if (!entry.handle || !entry.name || !entry.headline || !/^gid:\/\/shopify\/(MediaImage|Video)\/\d+$/.test(entry.media)) throw Error('Incomplete slide source');
  if (entry.link && !/^https?:\/\//.test(entry.link)) throw Error('Expected an HTTP(S) destination');
}
if (before.metaobjectDefinitionByType) for (const field of fields) {
  const actual = before.metaobjectDefinitionByType.fieldDefinitions.find(f => f.key === field.key);
  if (!actual && ['button_label', 'mobile_media'].includes(field.key)) continue;
  if (!actual || actual.type.name !== field.type || actual.required !== Boolean(field.required)) throw Error(`Existing definition differs at ${field.key}`);
  for (const validation of field.validations || []) if (!actual.validations.some(v => v.name === validation.name && v.value === validation.value)) throw Error(`Existing validation differs at ${field.key}`);
}
const additions = before.metaobjectDefinitionByType ? fields.filter(field => ['button_label', 'mobile_media'].includes(field.key) && !before.metaobjectDefinitionByType.fieldDefinitions.some(actual => actual.key === field.key)) : [];
console.log(JSON.stringify({ definition: before.metaobjectDefinitionByType ? 'Preserve Slides' : 'Create Slides', addFields: additions.map(field => field.key), entries: source.filter(e => !before.metaobjects.nodes.some(x => x.handle === e.handle)).map(e => e.name) }));
if (!process.argv.includes('--apply')) process.exit(0);
const backup = join(homedir(), 'Library/Application Support/Sparklys/store-backups', `slides-${Date.now()}`);
await mkdir(backup, { recursive: true, mode: 0o700 });
await writeFile(join(backup, 'before.json'), JSON.stringify({ before, source }, null, 2), { mode: 0o600 });
const unwrap = (data, key) => {
  if (data[key].userErrors.length) throw Error(JSON.stringify(data[key].userErrors));
  return data[key];
};
if (!before.metaobjectDefinitionByType) {
  const result = unwrap(await api(`mutation($definition:MetaobjectDefinitionCreateInput!){metaobjectDefinitionCreate(definition:$definition){metaobjectDefinition{id} userErrors{field message}}}`, { definition: {
    type: 'slides', name: 'Slides', displayNameKey: 'name', fieldDefinitions: fields,
    access: { storefront: 'PUBLIC_READ' }, capabilities: { publishable: { enabled: true }, translatable: { enabled: true } },
  } }), 'metaobjectDefinitionCreate');
  console.log(`Created Slides: ${result.metaobjectDefinition.id}`);
}
if (additions.length) {
  unwrap(await api(`mutation($id:ID!,$definition:MetaobjectDefinitionUpdateInput!){metaobjectDefinitionUpdate(id:$id,definition:$definition){metaobjectDefinition{id} userErrors{field message}}}`, {
    id: before.metaobjectDefinitionByType.id,
    definition: { fieldDefinitions: additions.map(create => ({ create })) },
  }), 'metaobjectDefinitionUpdate');
}
for (const entry of source) {
  if (before.metaobjects.nodes.some(x => x.handle === entry.handle)) continue;
  const values = Object.entries(entry).filter(([key, value]) => key !== 'handle' && value).map(([key, value]) => ({ key, value }));
  const result = unwrap(await api(`mutation($metaobject:MetaobjectCreateInput!){metaobjectCreate(metaobject:$metaobject){metaobject{id handle fields{key value}} userErrors{field message}}}`, { metaobject: {
    type: 'slides', handle: entry.handle, fields: values, capabilities: { publishable: { status: 'ACTIVE' } },
  } }), 'metaobjectCreate');
  for (const field of values) if (!result.metaobject.fields.some(f => f.key === field.key && f.value === field.value)) throw Error('Entry verification mismatch');
  console.log(`Verified ${result.metaobject.handle}`);
}
const verified = await api(`{metaobjectDefinitionByType(type:"slides"){id name fieldDefinitions{key type{name}}}}`);
for (const field of fields) if (!verified.metaobjectDefinitionByType.fieldDefinitions.some(actual => actual.key === field.key && actual.type.name === field.type)) throw Error(`Field verification failed: ${field.key}`);
console.log(JSON.stringify(verified));
console.log(`Backup: ${backup}`);
