import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const store = 'sparklys-hard-seltzer.myshopify.com';
const sourceTheme = '199388037507';
const developmentTheme = '199384498563';
const backupRoot = join(homedir(), 'Library', 'Application Support', 'Sparklys', 'theme-backups', 'content-sync');
const parse = text => JSON.parse(text.replace(/^\s*\/\*[\s\S]*?\*\//, ''));
const hash = text => text === null ? null : createHash('sha256').update(text).digest('hex');
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const read = async path => readFile(path, 'utf8').catch(error => { if (error.code === 'ENOENT') return null; throw error; });

export function isContentFile(file) {
  return file === 'config/settings_data.json' ||
    /^(templates\/(?:[\w-]+\/)*[\w.-]+|sections\/[\w.-]+|locales\/[\w.-]+)\.json$/.test(file) &&
    !file.endsWith('.schema.json') && !file.split('/').some(part => part === '..' || part === '.');
}

export function verifyThemes(themes) {
  const source = themes.find(theme => String(theme.id) === sourceTheme);
  const dev = themes.find(theme => String(theme.id) === developmentTheme);
  if (source?.role !== 'unpublished' || source.name !== 'website/main') throw new Error('Source must be the unpublished website/main theme (199388037507).');
  if (dev?.role !== 'development') throw new Error('Preview target 199384498563 must still be a development theme.');
}

// Saved source values win; new development translation keys remain available.
export function mergeLocale(source, local) {
  if (!object(source) || !object(local)) return structuredClone(source);
  const merged = structuredClone(source);
  for (const [key, value] of Object.entries(local)) {
    if (!Object.hasOwn(source, key)) Object.defineProperty(merged, key, { value: structuredClone(value), enumerable: true, writable: true, configurable: true });
    else if (object(source[key]) && object(value)) merged[key] = mergeLocale(source[key], value);
  }
  return merged;
}

async function filesAt(base, directory) {
  const entries = await readdir(join(base, directory), { withFileTypes: true }).catch(error => { if (error.code === 'ENOENT') return []; throw error; });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesAt(base, path));
    else if (entry.isFile() && isContentFile(path)) files.push(path);
  }
  return files;
}

export async function buildPlan(localRoot, sourceRoot) {
  const incoming = (await Promise.all(['config', 'templates', 'sections', 'locales'].map(dir => filesAt(sourceRoot, dir)))).flat().sort();
  if (!incoming.includes('config/settings_data.json') || !incoming.some(file => file.startsWith('templates/')) || !incoming.some(file => file.startsWith('locales/'))) throw new Error('Incomplete content download; no local files changed.');
  const incomingLocales = incoming.filter(file => file.startsWith('locales/')).map(file => file.replace('.default.', '.'));
  if (new Set(incomingLocales).size !== incomingLocales.length) throw new Error('Source has duplicate locale identities.');
  const localLocales = await filesAt(localRoot, 'locales');
  const plan = [];
  for (const file of incoming) {
    const source = await read(join(sourceRoot, file));
    const data = parse(source);
    // Keep the development checkout's default-language filenames and source language.
    const language = file.replace('.default.', '.');
    const matches = localLocales.filter(local => local.replace('.default.', '.') === language);
    if (matches.length > 1) throw new Error(`Ambiguous local locale filenames for ${file}.`);
    const target = file.startsWith('locales/') ? matches[0] || file : file;
    const before = await read(join(localRoot, target));
    let after = source;
    if (target.startsWith('locales/') && before !== null) after = `${JSON.stringify(mergeLocale(data, parse(before)), null, 2)}\n`;
    // Do not churn generated headers, formatting or unchanged JSON content.
    if (before !== null && isDeepStrictEqual(parse(before), parse(after))) continue;
    plan.push({ file: target, sourceFile: file, before, after });
  }
  const localeNames = new Set([...localLocales, ...plan.map(item => item.file).filter(file => file.startsWith('locales/'))]);
  if ([...localeNames].filter(file => file.endsWith('.default.json')).length !== 1) throw new Error('Sync would produce an invalid default locale configuration.');
  for (const item of plan) {
    if (!item.file.startsWith('templates/') && !item.file.startsWith('sections/') && item.file !== 'config/settings_data.json') continue;
    const data = parse(item.after);
    for (const section of Object.values(data.sections || data.current?.sections || {})) {
      if (section.type && !section.type.startsWith('shopify://') && await read(join(localRoot, 'sections', `${section.type}.liquid`)) === null) throw new Error(`${item.file} references missing local section ${section.type}; sync code separately first.`);
    }
  }
  return plan;
}

async function atomicWrite(base, file, text) {
  if (!isContentFile(file)) throw new Error(`Refusing non-content path: ${file}`);
  const destination = join(base, file);
  await mkdir(dirname(destination), { recursive: true });
  const temporary = `${destination}.sync-${process.pid}`;
  try { await writeFile(temporary, text); await rename(temporary, destination); }
  finally { await rm(temporary, { force: true }); }
}

export async function applyPlan(localRoot, backup, plan) {
  const manifest = { version: 1, store, sourceTheme, developmentTheme, createdAt: new Date().toISOString(), files: [] };
  for (const item of plan) {
    if (!isContentFile(item.file)) throw new Error(`Refusing non-content path: ${item.file}`);
    if (await read(join(localRoot, item.file)) !== item.before) throw new Error(`Local content changed during preparation: ${item.file}. Retry.`);
    if (item.before !== null) {
      const path = join(backup, 'before', item.file);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, item.before, { mode: 0o600 });
    }
    manifest.files.push({ file: item.file, sourceFile: item.sourceFile, beforeHash: hash(item.before), afterHash: hash(item.after) });
  }
  await writeFile(join(backup, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 });
  for (const item of plan) await atomicWrite(localRoot, item.file, item.after);
}

export async function restoreBackup(localRoot, backup, dryRun = false) {
  const manifest = parse(await readFile(join(backup, 'manifest.json'), 'utf8'));
  if (manifest.version !== 1 || manifest.sourceTheme !== sourceTheme || !Array.isArray(manifest.files)) throw new Error('Not a supported content-sync backup.');
  const entries = [];
  for (const item of manifest.files) {
    if (!isContentFile(item.file)) throw new Error('Unsafe path in backup manifest.');
    const current = await read(join(localRoot, item.file));
    if (hash(current) === item.beforeHash) continue;
    if (hash(current) !== item.afterHash) throw new Error(`Content changed since sync: ${item.file}. Compare with the backup manually instead of overwriting it.`);
    const before = item.beforeHash === null ? null : await read(join(backup, 'before', item.file));
    if (hash(before) !== item.beforeHash) throw new Error(`Backup integrity check failed: ${item.file}`);
    entries.push({ file: item.file, before });
  }
  if (!dryRun) for (const item of entries) {
    if (item.before === null) await rm(join(localRoot, item.file));
    else await atomicWrite(localRoot, item.file, item.before);
  }
  return entries.map(item => item.file);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const restoreIndex = args.indexOf('--restore');
  const restorePath = restoreIndex >= 0 ? args[restoreIndex + 1] : null;
  const remaining = args.filter((arg, i) => arg !== '--dry-run' && !(restoreIndex >= 0 && (i === restoreIndex || i === restoreIndex + 1)));
  if (remaining.length || (restoreIndex >= 0 && (!restorePath || restorePath.startsWith('--')))) throw new Error('Usage: npm run sync:dev-content -- [--dry-run] [--restore <backup-directory>]');
  const lock = join(root, '.shopify', 'content-sync.lock');
  await mkdir(dirname(lock), { recursive: true });
  await mkdir(lock).catch(error => { if (error.code === 'EEXIST') throw new Error('Another content sync is running (or left .shopify/content-sync.lock).'); throw error; });
  try {
    if (restorePath) {
      const backup = resolve(restorePath);
      if (relative(backupRoot, backup).startsWith('..')) throw new Error('Restore must use a backup under the content-sync backup directory.');
      console.log(`${dryRun ? 'Would restore' : 'Restored'}: ${(await restoreBackup(root, backup, dryRun)).join(', ') || 'nothing'}`);
      return;
    }
    const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('SHOPIFY_FLAG_')));
    const cli = (...parameters) => {
      const result = spawnSync(process.execPath, [join(root, 'node_modules/@shopify/cli/bin/run.js'), ...parameters], { cwd: root, env, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
      if (result.status !== 0) throw new Error(`Shopify ${parameters.slice(0, 2).join(' ')} failed. Check authentication/network access; local content was not applied.`);
      return result.stdout;
    };
    const verify = () => verifyThemes(JSON.parse(cli('theme', 'list', '--store', store, '--json')));
    verify();
    await mkdir(backupRoot, { recursive: true, mode: 0o700 });
    const backup = await mkdtemp(join(backupRoot, `${new Date().toISOString().replaceAll(':', '-')}-`));
    const source = join(backup, 'source');
    await mkdir(source);
    console.log(`Downloading saved content from website/main (${sourceTheme}).`);
    cli('theme', 'pull', '--store', store, '--theme', sourceTheme, '--path', source, '--nodelete', '--no-color',
      ...['config/settings_data.json', 'templates/*.json', 'templates/**/*.json', 'sections/*.json', 'locales/*.json'].flatMap(file => ['--only', file]));
    const plan = await buildPlan(root, source);
    console.log(plan.map(item => `${item.before === null ? 'ADD' : 'UPDATE'} ${item.file}`).join('\n') || 'Local content already matches.');
    console.log(`Snapshot/backup: ${backup}`);
    if (dryRun) { console.log(`Dry run: ${plan.length} files would change. No local content or remote theme was written.`); return; }
    verify();
    await applyPlan(root, backup, plan);
    console.log(`Synced ${plan.length} local content files. Code and local-only files retained. No explicit remote upload was performed.`);
    console.log('A running dev watcher will upload these local edits to its development theme. Shared draft and live theme were not modified.');
  } finally { await rm(lock, { recursive: true, force: true }); }
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
