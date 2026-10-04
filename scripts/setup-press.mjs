// Import a reviewed public press-page snapshot. Existing merchant entries are never overwritten.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createAdminClient, STORE } from './shopify-admin.mjs';
const sourcePath = process.argv.find(v => v.startsWith('--source='))?.slice(9);
if (!sourcePath) throw Error('Pass --source=/path/to/press-import.json; --apply enables writes.');
const source = JSON.parse(await readFile(sourcePath, 'utf8'));
for (const entry of source) {
  if (!entry.handle || !entry.name || !entry.logoFilename || !entry.logoSource.startsWith('https://')) throw Error('Incomplete press source.');
  for (const article of entry.articles) if (!article.handle || !article.title || !article.url.startsWith('https://')) throw Error('Incomplete article source.');
}
const api = createAdminClient();
const before = await api(`{shop{myshopifyDomain} currentAppInstallation{accessScopes{handle}}
 press:metaobjectDefinitionByType(type:"press"){id fieldDefinitions{key type{name} validations{name value}}}
 article:metaobjectDefinitionByType(type:"press_article"){id fieldDefinitions{key type{name}}}
 publications:metaobjects(type:"press",first:250){nodes{id handle fields{key value}}}
 articles:metaobjects(type:"press_article",first:250){nodes{id handle fields{key value}}}
 files(first:250,query:"filename:logo*"){nodes{id ... on MediaImage{image{url}}}}}`);
if (before.shop.myshopifyDomain !== STORE) throw Error('Unexpected store.');
for (const scope of ['write_metaobject_definitions','write_metaobjects','write_files']) if (!before.currentAppInstallation.accessScopes.some(s=>s.handle===scope)) throw Error(`Missing ${scope}`);
const fields = (rows) => rows.map(([key,name,type,required=false])=>({key,name,type,required}));
const articleFields = fields([['title','Title','single_line_text_field',true],['url','URL','url',true]]);
const pressFields = fields([['name','Name','single_line_text_field',true],['logo','Logo','file_reference',true],['url','Link','url'],['articles','Articles','list.metaobject_reference']]);
pressFields[1].validations=[{name:'file_type_options',value:'["Image"]'}];
for (const [definition,expected] of [[before.article,articleFields],[before.press,pressFields]]) if (definition) for (const f of expected) if (!definition.fieldDefinitions.some(x=>x.key===f.key&&x.type.name===f.type)) throw Error(`Existing definition differs at ${f.key}`);
console.log(JSON.stringify({create:source.filter(e=>!before.publications.nodes.some(p=>p.handle===e.handle)).map(e=>e.name),articles:source.flatMap(e=>e.articles).length},null,2));
if (!process.argv.includes('--apply')) process.exit(0);
const backup=join(homedir(),'Library/Application Support/Sparklys/store-backups',`press-${Date.now()}`);
await mkdir(backup,{recursive:true,mode:0o700});await writeFile(join(backup,'before.json'),JSON.stringify({before,source},null,2),{mode:0o600});
const unwrap=(result,key)=>{const r=result[key];if(r.userErrors.length)throw Error(JSON.stringify(r.userErrors));return r;};
async function define(type,name,displayNameKey,fieldDefinitions) {
 const r=unwrap(await api(`mutation($definition:MetaobjectDefinitionCreateInput!){metaobjectDefinitionCreate(definition:$definition){metaobjectDefinition{id} userErrors{field message}}}`,{definition:{type,name,displayNameKey,fieldDefinitions,access:{storefront:'PUBLIC_READ'},capabilities:{publishable:{enabled:true},translatable:{enabled:true}}}}),'metaobjectDefinitionCreate');return r.metaobjectDefinition.id;
}
const articleDefinition=before.article?.id || await define('press_article','Press article','title',articleFields);
pressFields[3].validations=[{name:'metaobject_definition_id',value:articleDefinition},{name:'list.max',value:'50'}];
pressFields[3].description='Add or select articles from this publication, then arrange them in the order to display.';
if (before.press && !before.press.fieldDefinitions.find(f=>f.key==='articles').validations.some(v=>v.name==='metaobject_definition_id'&&v.value===articleDefinition)) throw Error('Existing article reference targets another definition.');
if (!before.press) await define('press','Press','name',pressFields);
async function create(type,handle,values) {
 const fields=Object.entries(values).filter(([,v])=>v!=='').map(([key,value])=>({key,value}));
 const r=unwrap(await api(`mutation($metaobject:MetaobjectCreateInput!){metaobjectCreate(metaobject:$metaobject){metaobject{id handle fields{key value}} userErrors{field message}}}`,{metaobject:{type,handle,fields,capabilities:{publishable:{status:'ACTIVE'}}}}),'metaobjectCreate').metaobject;
 if (fields.some(f=>r.fields.find(x=>x.key===f.key)?.value!==f.value)) throw Error('Entry read-back mismatch');
 return r;
}
for (const entry of source) {
 if (before.publications.nodes.some(p=>p.handle===entry.handle)) continue;
 let file=before.files.nodes.find(f=>f.image&&new URL(f.image.url).pathname.split('/').at(-1)===entry.logoFilename);
 if (!file) {
  const r=unwrap(await api(`mutation($files:[FileCreateInput!]!){fileCreate(files:$files){files{id fileStatus} userErrors{field message}}}`,{files:[{originalSource:entry.logoSource,filename:entry.logoFilename,contentType:'IMAGE',alt:entry.name}]}),'fileCreate');file=r.files[0];
  for (let attempt=0;attempt<12;attempt++) {
   const {node}=await api(`query($id:ID!){node(id:$id){... on MediaImage{id fileStatus image{url}}}}`,{id:file.id});
   if(node.fileStatus==='READY'){file=node;break;}
   if(node.fileStatus==='FAILED')throw Error(`Logo upload failed: ${entry.name}`);
   if(attempt===11)throw Error('Logo not ready; retry later');
   await new Promise(r=>setTimeout(r,1000));
  }
 }
 const articleIds=[];
 for (const article of entry.articles) {
  const existing=before.articles.nodes.find(a=>a.handle===article.handle);
  articleIds.push(existing?.id || (await create('press_article',article.handle,{title:article.title,url:article.url})).id);
 }
 await create('press',entry.handle,{name:entry.name,logo:file.id,url:entry.url,articles:JSON.stringify(articleIds)});
 console.log(`Verified ${entry.name}`);
}
console.log(`Backup: ${backup}`);
