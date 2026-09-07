import { spawn } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cli = join(root, 'node_modules/@shopify/cli/bin/run.js');
const directories = ['config', 'locales', 'sections', 'templates', 'blocks'];
const store = 'sparklys-hard-seltzer.myshopify.com';
let child;
let stopping = false;
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => {
  stopping = true;
  child?.kill(signal);
});

function run(args) {
  return new Promise((resolveRun, reject) => {
    child = spawn(process.execPath, [cli, ...args], { cwd: root, stdio: ['ignore', 'inherit', 'inherit'] });
    child.once('error', reject);
    child.once('exit', (code) => { child = null; resolveRun(code ?? 1); });
  });
}

async function jsonFiles(base, directory) {
  let entries;
  try { entries = await readdir(join(base, directory), { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return jsonFiles(base, path);
    return entry.isFile() && entry.name.endsWith('.json') ? [path] : [];
  }));
  return files.flat();
}

function parse(source) {
  return JSON.parse(source.replace(/^\s*\/\*[\s\S]*?\*\//, ''));
}

let temporary;
try {
  console.log(`\n[${new Date().toISOString()}] Checking development-theme JSON before startup.`);
  temporary = await mkdtemp(join(tmpdir(), 'sparklys-preview-'));
  const pulled = await run(['theme', 'pull', '--store', store, '--development', '--path', temporary,
    '--nodelete', '--no-color', ...directories.flatMap((directory) => ['--only', `${directory}/*.json`])]);
  if (pulled !== 0 || stopping) throw new Error('Preflight download failed or was interrupted. Check Shopify authentication and network access.');
  const localFiles = (await Promise.all(directories.map((directory) => jsonFiles(root, directory)))).flat();
  const remoteFiles = (await Promise.all(directories.map((directory) => jsonFiles(temporary, directory)))).flat();
  if (remoteFiles.length === 0) throw new Error('Preflight returned no JSON; refusing to overwrite development settings.');
  const differences = [];
  for (const file of new Set([...localFiles, ...remoteFiles])) {
    if (!localFiles.includes(file) || !remoteFiles.includes(file)) { differences.push(file); continue; }
    const [local, remote] = await Promise.all([readFile(join(root, file), 'utf8'), readFile(join(temporary, file), 'utf8')]);
    if (!isDeepStrictEqual(parse(local), parse(remote))) differences.push(file);
  }
  if (differences.length) throw new Error(`JSON content differs: ${differences.join(', ')}. Stop with npm run dev:stop, compare both versions, reconcile deliberately, then restart. See docs/development.md.`);
  await rm(temporary, { recursive: true, force: true });
  temporary = null;
  if (!stopping) {
    console.log('JSON contents match. Allowing checksum/format normalization for this startup.');
    // keep-local is safe only after comparing every JSON document, not as a blanket default.
    process.exitCode = await run(['theme', 'dev', '--store', store, '--host', '127.0.0.1', '--port', '9292',
      '--theme-editor-sync', '--reconciliation-strategy=keep-local', '--no-color']);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (temporary) await rm(temporary, { recursive: true, force: true });
}
