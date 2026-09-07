import { spawnSync } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

// The shared editorial theme is deliberately separate from the development theme.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cli = join(root, 'node_modules/@shopify/cli/bin/run.js');
const store = 'sparklys-hard-seltzer.myshopify.com';
const theme = '199388037507';
const execute = process.argv.includes('--execute');
if (process.argv.slice(2).some((arg) => arg !== '--execute')) throw new Error('Only --execute is supported.');
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('SHOPIFY_FLAG_')));
function run(args) {
  const result = spawnSync(process.execPath, [cli, ...args], { cwd: root, env, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Shopify command failed');
  return result.stdout;
}
function verifyTarget() {
  const themes = JSON.parse(run(['theme', 'list', '--store', store, '--json']));
  const target = themes.find((entry) => String(entry.id) === theme);
  if (target?.role !== 'unpublished') throw new Error('Target must exist and be unpublished; refusing deployment.');
  return themes.find((entry) => entry.role === 'live')?.id;
}
const liveBefore = verifyTarget();
const stamp = new Date().toISOString().replaceAll(':', '-');
const directory = join(homedir(), 'Library', 'Application Support', 'Sparklys', 'theme-backups', stamp);
const backup = join(directory, 'before');
const staging = join(directory, 'code');
await mkdir(backup, { recursive: true });
await mkdir(staging, { recursive: true });
run(['theme', 'pull', '--store', store, '--theme', theme, '--path', backup, '--nodelete', '--no-color']);
const files = [];
async function collect(directory, prefix = '') {
  const entries = await readdir(join(root, directory, prefix), { withFileTypes: true }).catch((error) => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  for (const entry of entries) {
    const relative = join(directory, prefix, entry.name);
    if (entry.isDirectory()) await collect(directory, join(prefix, entry.name));
    else if (directory === 'assets' || entry.name.endsWith('.liquid')) files.push(relative);
  }
}
for (const directory of ['assets', 'layout', 'sections', 'snippets', 'blocks']) await collect(directory);
files.push('config/settings_schema.json');
for (const file of files) {
  await mkdir(dirname(join(staging, file)), { recursive: true });
  await copyFile(join(root, file), join(staging, file));
}
// Preserve the remote default-language filenames and all existing translation values.
// Add only missing keys required by new code. Text changes require a reviewed migration.
const parse = (source) => JSON.parse(source.replace(/^\s*\/\*[\s\S]*?\*\//, ''));
function fillMissing(remote, local) {
  for (const [key, value] of Object.entries(local)) {
    if (!(key in remote)) remote[key] = value;
    else if (value && typeof value === 'object' && !Array.isArray(value) && remote[key] && typeof remote[key] === 'object') fillMissing(remote[key], value);
  }
  return remote;
}
const remoteLocales = await readdir(join(backup, 'locales'));
for (const filename of await readdir(join(root, 'locales'))) {
  if (!filename.endsWith('.json')) continue;
  const language = filename.replace('.default.', '.');
  const target = remoteLocales.find((name) => name.replace('.default.', '.') === language);
  if (!target) throw new Error(`Locale ${filename} has no remote counterpart. Review language migration first.`);
  const remote = parse(await readFile(join(backup, 'locales', target), 'utf8'));
  const original = JSON.stringify(remote);
  const merged = fillMissing(remote, parse(await readFile(join(root, 'locales', filename), 'utf8')));
  if (JSON.stringify(merged) !== original) {
    const file = join('locales', target);
    await mkdir(dirname(join(staging, file)), { recursive: true });
    await writeFile(join(staging, file), `${JSON.stringify(merged, null, 2)}\n`);
    files.push(file);
  }
}
await writeFile(join(directory, 'manifest.json'), JSON.stringify({ store, theme, files, backup }, null, 2));
console.log(`Backup and deployment manifest: ${directory}`);
console.log(`Prepared ${files.length} code files; saved settings, templates and section groups excluded. No remote deletions.`);
if (!execute) {
  console.log('Read-only preparation complete. Use --execute for the authorized deployment.');
} else {
  if (verifyTarget() !== liveBefore) throw new Error('Live theme changed during preparation; refusing deployment.');
  // Detect concurrent editorial saves before uploading the additive locale merge.
  const latest = join(directory, 'latest-locales');
  await mkdir(latest, { recursive: true });
  run(['theme', 'pull', '--store', store, '--theme', theme, '--path', latest, '--only', 'locales/*.json', '--nodelete', '--no-color']);
  for (const file of files.filter((file) => file.startsWith('locales/'))) {
    if (JSON.stringify(parse(await readFile(join(latest, file), 'utf8'))) !== JSON.stringify(parse(await readFile(join(backup, file), 'utf8')))) throw new Error('Translations changed during preparation. Retry after editorial work pauses.');
  }
  console.log(run(['theme', 'push', '--store', store, '--theme', theme, '--path', staging, '--nodelete', '--json', ...files.flatMap((file) => ['--only', file])]));
  if (verifyTarget() !== liveBefore) throw new Error('Live theme changed; inspect Shopify activity.');
}
