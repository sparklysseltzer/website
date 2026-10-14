import { readFile, writeFile } from 'node:fs/promises';
import { createAdminClient } from './shopify-admin.mjs';

// Explicit, reviewed input lives outside the theme. Never overwrite existing articles.
const inputPath = process.argv.find((arg) => arg.startsWith('--input='))?.slice(8);
if (!inputPath) throw new Error('Provide --input=path to the reviewed article JSON. Use --apply to create drafts.');
const apply = process.argv.includes('--apply');
const items = JSON.parse(await readFile(inputPath, 'utf8'));
if (items.length !== 9 || new Set(items.map((item) => item.handle)).size !== 9) throw new Error('Expected nine distinct reviewed article handles.');
const graphql = createAdminClient();
const inventory = await graphql(`{
 currentAppInstallation { accessScopes { handle } }
 blogs(first:100) { nodes { id handle } }
 metaobjectDefinitionByType(type:"faq") { id capabilities { publishable { enabled } } }
 metafieldDefinitions(first:100,ownerType:ARTICLE) { nodes { namespace key type { name } validations { name value } } }
}`);
for (const scope of ['write_content', 'write_metaobjects']) {
 if (!inventory.currentAppInstallation.accessScopes.some((entry) => entry.handle === scope)) throw new Error(`Missing ${scope}`);
}
const blog = inventory.blogs.nodes.find((entry) => entry.handle === 'news');
const faqDefinition = inventory.metaobjectDefinitionByType;
if (!blog || !faqDefinition?.capabilities.publishable?.enabled) throw new Error('Expected News blog and publishable FAQ definition.');
function result(data, key) {
 const value = data[key];
 if (value.userErrors?.length) throw new Error(`${key}: ${JSON.stringify(value.userErrors)}`);
 return value;
}
const definitions = [
 { name:'Article FAQs', namespace:'custom', key:'faqs', ownerType:'ARTICLE', type:'list.metaobject_reference', description:'Ordered reusable FAQs. Publish the referenced FAQ entries when the article is ready.', validations:[{name:'metaobject_definition_id',value:faqDefinition.id}], access:{storefront:'PUBLIC_READ'} },
 { name:'Article recipes', namespace:'custom', key:'recipes', ownerType:'ARTICLE', type:'json', description:'Recipe metadata matching the visible recipe names, ingredients, instructions and anchors in the article body.', access:{storefront:'PUBLIC_READ'} },
 { name:'Editorial review notes', namespace:'custom', key:'editorial_review', ownerType:'ARTICLE', type:'multi_line_text_field', description:'Internal checks required before publication.' },
];
for (const definition of definitions) {
 const existing = inventory.metafieldDefinitions.nodes.find((entry) => entry.namespace === definition.namespace && entry.key === definition.key);
 if (existing && (existing.type.name !== definition.type || (definition.key === 'faqs' && !existing.validations.some((v) => v.name === 'metaobject_definition_id' && v.value === faqDefinition.id)))) throw new Error(`Incompatible ${definition.key} definition.`);
 if (!existing && apply) result(await graphql(`mutation($definition:MetafieldDefinitionInput!){metafieldDefinitionCreate(definition:$definition){createdDefinition{id} userErrors{field message}}}`,{definition}),'metafieldDefinitionCreate');
}
const receipt=[];
for (const item of items) {
 const found = await graphql(`query($query:String!){articles(first:20,query:$query){nodes{id handle isPublished title}}}`,{query:`handle:${item.handle}`});
 const existingArticle = found.articles.nodes.find((entry)=>entry.handle===item.handle);
 if (existingArticle) {
  if (existingArticle.isPublished) throw new Error(`Refusing published article: ${item.handle}`);
  receipt.push({...existingArticle,skipped:true});
  continue;
 }
 if (!apply) { receipt.push({handle:item.handle,title:item.title,faqs:item.faqs.length,action:'create draft'}); continue; }
 const ids=[];
 for (const [index, faq] of item.faqs.entries()) {
  const handle=`soda-blog-${item.handle}-${index+1}`;
  const previous=await graphql(`query($handle:MetaobjectHandleInput!){metaobjectByHandle(handle:$handle){id capabilities{publishable{status}}}}`,{handle:{type:'faq',handle}});
  if (previous.metaobjectByHandle) {
   if(previous.metaobjectByHandle.capabilities.publishable.status!=='DRAFT') throw new Error(`Refusing active FAQ: ${handle}`);
   ids.push(previous.metaobjectByHandle.id); continue;
  }
  const answer=JSON.stringify({type:'root',children:[{type:'paragraph',children:[{type:'text',value:faq.answer}]}]});
  const created=result(await graphql(`mutation($metaobject:MetaobjectCreateInput!){metaobjectCreate(metaobject:$metaobject){metaobject{id} userErrors{field message}}}`,{metaobject:{type:'faq',handle,capabilities:{publishable:{status:'DRAFT'}},fields:[{key:'question',value:faq.question},{key:'answer',value:answer}]}}),'metaobjectCreate');
  ids.push(created.metaobject.id);
 }
 const metafields=[
  {namespace:'custom',key:'faqs',type:'list.metaobject_reference',value:JSON.stringify(ids)},
  {namespace:'custom',key:'editorial_review',type:'multi_line_text_field',value:item.review.join('\n')},
  {namespace:'global',key:'title_tag',type:'single_line_text_field',value:item.seoTitle},
  {namespace:'global',key:'description_tag',type:'single_line_text_field',value:item.seoDescription},
 ];
 if(item.recipes) metafields.push({namespace:'custom',key:'recipes',type:'json',value:JSON.stringify(item.recipes)});
 const created=result(await graphql(`mutation($article:ArticleCreateInput!){articleCreate(article:$article){article{id title handle isPublished} userErrors{field message}}}`,{article:{blogId:blog.id,title:item.title,handle:item.handle,body:item.bodyHtml,summary:item.summaryHtml,author:{name:'Sparklys Team'},isPublished:false,tags:item.tags,metafields}}),'articleCreate');
 const record=created.article;
 if(record.isPublished) throw new Error('Unexpected published state.');
 const verify=await graphql(`query($id:ID!){article(id:$id){id isPublished metafield(namespace:"custom",key:"faqs"){value}}}`,{id:record.id});
 if(verify.article.isPublished || verify.article.metafield.value!==JSON.stringify(ids)) throw new Error('Draft read-back failed.');
 receipt.push({...record,faqIds:ids});
 await writeFile(`${inputPath}.receipt.json`,JSON.stringify(receipt,null,2));
 console.log(`Created draft: ${record.title}`);
}
if(apply) await writeFile(`${inputPath}.receipt.json`,JSON.stringify(receipt,null,2));
console.log(JSON.stringify(receipt,null,2));
