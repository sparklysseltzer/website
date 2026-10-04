// Import an explicitly supplied published-theme settings snapshot; never overwrite existing entries.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createAdminClient, STORE } from './shopify-admin.mjs';
const sourcePath = process.argv.find(arg => arg.startsWith('--source='))?.slice(9);
if (!sourcePath) throw new Error('Pass --source=/path/to/published/config/settings_data.json; add --apply to provision.');
const source = JSON.parse((await readFile(sourcePath, 'utf8')).replace(/^\s*\/\*[\s\S]*?\*\//, '')).current.sections['section-team'];
if (!source?.block_order?.length) throw new Error('Published Team settings were not found.');
const api = createAdminClient();
const before = await api(`{ shop { myshopifyDomain } currentAppInstallation { accessScopes { handle } }
 metaobjectDefinitionByType(type:"team") { id name fieldDefinitions { key type { name } } }
 metaobjects(type:"team",first:100) { nodes { id handle fields { key value } capabilities { publishable { status } } } }
 files(first:100,query:"team") { nodes { id ... on MediaImage { image { url } } } } }`);
if (before.shop.myshopifyDomain !== STORE) throw new Error('Unexpected store.');
if (!before.currentAppInstallation.accessScopes.some(s => s.handle === 'write_metaobjects')) throw new Error('Missing write_metaobjects.');
const entries = source.block_order.map((key, index) => {
 const block = source.blocks[key], s = block.settings;
 const filename = s.bild.split('/').at(-1);
 const image = before.files.nodes.find(f => f.image && new URL(f.image.url).pathname.split('/').at(-1) === filename);
 if (!image) throw new Error(`Missing existing portrait: ${filename}`);
 const values = { name: s.name.replace(/\s+/g, ' ').trim(), display_name: s.name, role: s.funktion, description: s.beschreibung, portrait: image.id, linkedin: s.linkedin, instagram: s.instagram, phone: s.phone.replace(/^tel:/, ''), email: s.e_mail.replace(/^mailto:/, ''), sort_order: String(index + 1), is_person: String(s.name !== 'Canette') };
 return { handle: values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), fields: Object.entries(values).filter(([,v]) => v !== '').map(([key,value]) => ({key,value})), capabilities: { publishable: { status: block.disabled ? 'DRAFT' : 'ACTIVE' } } };
});
const fieldDefinitions = [
 ['name','Name','single_line_text_field',true], ['display_name','Name on card','multi_line_text_field'],
 ['role','Role','single_line_text_field'], ['description','Description','multi_line_text_field'],
 ['portrait','Portrait','file_reference',true], ['linkedin','LinkedIn','url'], ['instagram','Instagram','url'],
 ['phone','Phone','single_line_text_field'], ['email','Email','single_line_text_field'],
 ['sort_order','Display order','number_integer'], ['is_person','Real person','boolean']
].map(([key,name,type,required=false]) => ({key,name,type,required,...(key==='portrait'?{validations:[{name:'file_type_options',value:'["Image"]'}]}:{}),...(key==='sort_order'?{validations:[{name:'min',value:'0'},{name:'max',value:'999999'}]}:{}),...(key==='is_person'?{description:'Turn off for mascots or fictional characters; they are excluded from Person structured data.'}:{})}));
const definition = { name:'Team',type:'team',displayNameKey:'name',access:{storefront:'PUBLIC_READ'},capabilities:{publishable:{enabled:true},translatable:{enabled:true}},fieldDefinitions };
if (before.metaobjectDefinitionByType) for (const f of fieldDefinitions) {
 if (!before.metaobjectDefinitionByType.fieldDefinitions.some(old => old.key===f.key && old.type.name===f.type)) throw new Error(`Existing definition differs at ${f.key}; review before migration.`);
}
console.log(JSON.stringify({definitionExists:!!before.metaobjectDefinitionByType,create:entries.filter(e=>!before.metaobjects.nodes.some(old=>old.handle===e.handle)).map(e=>({handle:e.handle,status:e.capabilities.publishable.status}))},null,2));
if (!process.argv.includes('--apply')) process.exit(0);
if (!before.metaobjectDefinitionByType && !before.currentAppInstallation.accessScopes.some(s => s.handle === 'write_metaobject_definitions')) throw new Error('Missing write_metaobject_definitions; approve the app permission update first.');
const backup=join(homedir(),'Library/Application Support/Sparklys/store-backups',`team-${Date.now()}`);
await mkdir(backup,{recursive:true,mode:0o700});await writeFile(join(backup,'before.json'),JSON.stringify({before,source},null,2),{mode:0o600});
if (!before.metaobjectDefinitionByType) {
 const {metaobjectDefinitionCreate:r}=await api('mutation($definition:MetaobjectDefinitionCreateInput!){metaobjectDefinitionCreate(definition:$definition){metaobjectDefinition{id} userErrors{field message}}}',{definition});
 if(r.userErrors.length)throw Error(JSON.stringify(r.userErrors));
}
for (const entry of entries) {
 if(before.metaobjects.nodes.some(old=>old.handle===entry.handle))continue;
 const {metaobjectCreate:r}=await api('mutation($metaobject:MetaobjectCreateInput!){metaobjectCreate(metaobject:$metaobject){metaobject{id handle fields{key value} capabilities{publishable{status}}} userErrors{field message}}}',{metaobject:{type:'team',...entry}});
 if(r.userErrors.length)throw Error(JSON.stringify(r.userErrors));
 if(entry.fields.some(f=>r.metaobject.fields.find(x=>x.key===f.key)?.value!==f.value)||r.metaobject.capabilities.publishable.status!==entry.capabilities.publishable.status)throw Error('Read-back mismatch');
 console.log(`Verified ${r.metaobject.handle}`);
}
console.log(`Backup: ${backup}`);
