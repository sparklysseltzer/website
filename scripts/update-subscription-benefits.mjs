import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createAdminClient } from './shopify-admin.mjs';

// Merchant-approved source copy for the flat 15% subscription model.
// Defaults to a read-only plan. No selling plans or translations are mutated here.
const api = createAdminClient();
const { metaobjectByHandle: current } = await api(`query SubscriptionBenefits {
  metaobjectByHandle(handle: {type: "subscription_benefits", handle: "standard"}) {
    id fields { key value }
  }
}`);
if (!current) throw new Error('Subscription benefits entry was not found.');
const fields = [
  { key: 'savings_title', value: '15% Rabatt auf jede Abonnementbestellung.' },
  { key: 'savings_text', value: 'Spare 15% bei jeder Lieferung, egal ob alle 2, 4, 6, 8 oder 12 Wochen.' },
];
const changes = fields.filter(field => current.fields.find(old => old.key === field.key)?.value !== field.value);
console.log(JSON.stringify({ id: current.id, changes }, null, 2));
if (process.argv.includes('--execute') && changes.length) {
  const directory = join(homedir(), 'Library/Application Support/Sparklys/backups', `subscription-benefits-${Date.now()}`);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, 'before.json'), JSON.stringify(current, null, 2));
  const result = await api(`mutation UpdateSubscriptionBenefits($id: ID!, $input: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $input) {
      metaobject { id fields { key value } } userErrors { field message }
    }
  }`, { id: current.id, input: { fields: changes } });
  if (result.metaobjectUpdate.userErrors.length) throw new Error(JSON.stringify(result.metaobjectUpdate.userErrors));
  writeFileSync(join(directory, 'after.json'), JSON.stringify(result.metaobjectUpdate.metaobject, null, 2));
  console.log('Updated subscription benefit source copy; backup saved outside the repository.');
}
