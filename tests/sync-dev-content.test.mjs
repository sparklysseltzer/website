import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { isContentFile, mergeLocale, verifyThemes, buildPlan, applyPlan, restoreBackup } from '../scripts/sync-dev-content.mjs';

const themes = [{ id: 199388037507, name: 'website/main', role: 'unpublished' }, { id: 199384498563, role: 'development' }];
async function put(root, file, value) { await mkdir(dirname(join(root, file)), { recursive: true }); await writeFile(join(root, file), typeof value === 'string' ? value : JSON.stringify(value)); }
async function fixture(t) {
  const base = await mkdtemp(join(tmpdir(), 'sparklys-sync-test-'));
  t.after(() => rm(base, { recursive: true, force: true }));
  const local = join(base, 'local'), source = join(base, 'source'), backup = join(base, 'backup');
  await mkdir(backup);
  for (const root of [local, source]) {
    await put(root, 'config/settings_data.json', { current: { radius: root === source ? 30 : 16 } });
    await put(root, 'templates/product.json', { sections: { main: { type: 'main-product' } }, order: ['main'] });
    await put(root, 'locales/en.default.json', { old: root === source ? 'Merchant copy' : 'Development copy', ...(root === local ? { pdp: { label: 'New feature' } } : {}) });
  }
  await put(local, 'sections/main-product.liquid', 'new PDP code');
  await put(local, 'templates/page.studio.json', { sections: {} });
  await put(source, 'templates/page.retail.json', { sections: {} });
  await put(source, 'config/settings_schema.json', [{ name: 'Old code' }]);
  return { base, local, source, backup };
}

test('allowlist excludes code, schema locales and traversal paths', () => {
  for (const file of ['config/settings_data.json', 'templates/customers/account.json', 'sections/header-group.json', 'locales/en.default.json']) assert.equal(isContentFile(file), true, file);
  for (const file of ['assets/theme.js', 'config/settings_schema.json', 'sections/main-product.liquid', 'locales/en.default.schema.json', '../templates/product.json', 'templates/../../package.json']) assert.equal(isContentFile(file), false, file);
});
test('source must be our unpublished draft and preview must still be development', () => {
  verifyThemes(themes);
  for (const change of [{ role: 'live' }, { name: 'Another draft' }]) assert.throws(() => verifyThemes([{ ...themes[0], ...change }, themes[1]]));
  assert.throws(() => verifyThemes([themes[0], { ...themes[1], role: 'unpublished' }]));
});
test('merchant values including false and empty strings win without dropping new nested keys', () => {
  const source = { a: { label: '', enabled: false }, list: ['saved'] };
  const local = { a: { label: 'old', enabled: true, newKey: 'keep' }, list: ['dev'], pdp: 'new' };
  assert.deepEqual(mergeLocale(source, local), { a: { label: '', enabled: false, newKey: 'keep' }, list: ['saved'], pdp: 'new' });
  assert.deepEqual(source, { a: { label: '', enabled: false }, list: ['saved'] });
});
test('apply and restore retain code, local-only templates and new locale keys', async t => {
  const { local, source, backup } = await fixture(t);
  const original = await readFile(join(local, 'locales/en.default.json'), 'utf8');
  const plan = await buildPlan(local, source);
  assert.deepEqual(plan.map(x => x.file), ['config/settings_data.json', 'locales/en.default.json', 'templates/page.retail.json']);
  await applyPlan(local, backup, plan);
  assert.deepEqual(JSON.parse(await readFile(join(local, 'locales/en.default.json'))), { old: 'Merchant copy', pdp: { label: 'New feature' } });
  assert.equal(await readFile(join(local, 'sections/main-product.liquid'), 'utf8'), 'new PDP code');
  assert.equal(await readFile(join(local, 'templates/page.studio.json'), 'utf8'), '{"sections":{}}');
  assert.equal((await restoreBackup(local, backup, true)).length, 3);
  assert.equal(JSON.parse(await readFile(join(local, 'config/settings_data.json'))).current.radius, 30);
  await restoreBackup(local, backup);
  assert.equal(await readFile(join(local, 'locales/en.default.json'), 'utf8'), original);
  await assert.rejects(readFile(join(local, 'templates/page.retail.json')), { code: 'ENOENT' });
});
test('apply rejects concurrent edits and restore does not clobber later work', async t => {
  const { local, source, backup } = await fixture(t);
  const plan = await buildPlan(local, source);
  await put(local, 'config/settings_data.json', { current: { radius: 99 } });
  await assert.rejects(applyPlan(local, backup, plan), /changed during preparation/);
  const fresh = await buildPlan(local, source);
  await applyPlan(local, backup, fresh);
  await put(local, 'locales/en.default.json', { newer: 'Keep my later edit' });
  await assert.rejects(restoreBackup(local, backup), /changed since sync/);
});
test('incomplete downloads or missing section code stop before applying', async t => {
  const { local, source } = await fixture(t);
  await rm(join(source, 'config/settings_data.json'));
  await assert.rejects(buildPlan(local, source), /Incomplete/);
  await put(source, 'config/settings_data.json', { current: {} });
  await put(source, 'templates/product.json', { sections: { main: { type: 'missing-section' } } });
  await assert.rejects(buildPlan(local, source), /missing local section/);
});
test('default locale names stay local and generated headers alone cause no writes', async t => {
  const { local, source } = await fixture(t);
  await rm(join(source, 'locales/en.default.json'));
  await put(source, 'locales/en.json', { old: 'Merchant copy' });
  await put(source, 'templates/product.json', '/* Generated by Shopify */\n'+await readFile(join(local, 'templates/product.json'), 'utf8'));
  const plan = await buildPlan(local, source);
  assert.ok(plan.some(x => x.file === 'locales/en.default.json'));
  assert.ok(!plan.some(x => x.file === 'templates/product.json'));
});
