import { spawnSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

// launchd owns the preview process, so closing the calling terminal cannot stop it.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const label = 'ch.sparklys.theme-preview';
const domain = `gui/${process.getuid?.()}`;
const service = `${domain}/${label}`;
const agentPath = join(homedir(), 'Library', 'LaunchAgents', `${label}.plist`);
const logDirectory = join(homedir(), 'Library', 'Logs', 'Sparklys');
const logPath = join(logDirectory, 'theme-preview.log');
const url = 'http://127.0.0.1:9292/';
const command = process.argv[2] || 'start';

function launchctl(args, required = true) {
  const result = spawnSync('/bin/launchctl', args, { encoding: 'utf8' });
  if (required && result.status !== 0) throw new Error(result.stderr || result.error?.message || 'launchctl failed');
  return result;
}

function xml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function plist() {
  const args = [process.execPath, join(root, 'scripts/dev-preview-worker.mjs')];
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>Label</key><string>${label}</string>
<key>ProgramArguments</key><array>${args.map((arg) => `<string>${xml(arg)}</string>`).join('')}</array>
<key>WorkingDirectory</key><string>${xml(root)}</string>
<key>EnvironmentVariables</key><dict>
<key>PATH</key><string>${xml(`${dirname(process.execPath)}:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin`)}</string>
<key>HOME</key><string>${xml(homedir())}</string>
</dict>
<key>RunAtLoad</key><true/>
<key>KeepAlive</key><true/>
<key>ThrottleInterval</key><integer>30</integer>
<key>StandardOutPath</key><string>${xml(logPath)}</string>
<key>StandardErrorPath</key><string>${xml(logPath)}</string>
</dict></plist>\n`;
}

async function portInUse() {
  return new Promise((resolvePort) => {
    const socket = net.connect(9292, '127.0.0.1');
    socket.setTimeout(1000);
    socket.once('connect', () => { socket.destroy(); resolvePort(true); });
    socket.once('error', () => { socket.destroy(); resolvePort(false); });
    socket.once('timeout', () => { socket.destroy(); resolvePort(false); });
  });
}

async function health() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000), redirect: 'manual' });
    await response.body?.cancel();
    return response.status;
  } catch { return null; }
}

async function status() {
  const result = launchctl(['print', service], false);
  if (result.status !== 0) {
    console.log('Preview service is stopped. Start with npm run dev.');
    return;
  }
  for (const key of ['state', 'pid', 'last exit code']) {
    const match = result.stdout.match(new RegExp(`^\\s*${key} = (.+)$`, 'm'));
    if (match) console.log(`${key}: ${match[1]}`);
  }
  const code = await health();
  console.log(`${url} ${code ? `HTTP ${code}` : 'not responding yet; inspect npm run dev:logs'}`);
  console.log(`Log: ${logPath}`);
}

async function stop() {
  if (launchctl(['print', service], false).status === 0) launchctl(['bootout', service]);
  // Removing the agent also prevents it from starting at the next login.
  await rm(agentPath, { force: true });
}

async function start() {
  if (launchctl(['print', service], false).status === 0) {
    console.log('Preview service is already loaded; no second process was started.');
    await status();
    return;
  }
  if (await portInUse()) throw new Error('Port 9292 is already occupied by an unmanaged process. Stop that process before npm run dev.');
  await readFile(join(root, 'node_modules/@shopify/cli/bin/run.js'));
  await mkdir(dirname(agentPath), { recursive: true });
  await mkdir(logDirectory, { recursive: true, mode: 0o700 });
  await writeFile(logPath, '', { flag: 'a', mode: 0o600 });
  await writeFile(agentPath, plist(), { mode: 0o600 });
  launchctl(['bootstrap', domain, agentPath]);
  console.log(`Preview is managed by launchd and will restart after an exit or at login.\n${url}\nLog: ${logPath}`);
  console.log('Initial Shopify synchronization can take a minute. Check npm run dev:status.');
}

try {
  if (process.platform !== 'darwin') throw new Error('The persistent preview uses macOS launchd. Use npm run dev:foreground on other systems.');
  if (command === 'start') await start();
  else if (command === 'stop') { await stop(); console.log('Preview stopped; automatic restart and login startup disabled.'); }
  else if (command === 'restart') {
    await stop();
    for (let attempt = 0; attempt < 50 && await portInUse(); attempt++) await new Promise((done) => setTimeout(done, 100));
    await start();
  } else if (command === 'status') await status();
  else if (command === 'logs') {
    const result = spawnSync('/usr/bin/tail', ['-n', '80', '-F', logPath], { stdio: 'inherit' });
    process.exitCode = result.status || 0;
  } else throw new Error('Usage: node scripts/dev-preview.mjs start|stop|restart|status|logs');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
