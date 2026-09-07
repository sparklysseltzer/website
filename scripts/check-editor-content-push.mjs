import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const input = readFileSync(0, 'utf8').trim();
const git = (args) => {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error('Cannot compare remote content. Fetch origin and retry.');
  return result.stdout.trim();
};
for (const line of input.split('\n').filter(Boolean)) {
  const [, local, remoteRef, remote] = line.split(/\s+/);
  if (remoteRef !== 'refs/heads/main') continue;
  if (/^0+$/.test(local) || /^0+$/.test(remote)) throw new Error('Shared branch creation/deletion requires a reviewed migration.');
  git(['merge-base', '--is-ancestor', remote, local]);
  const protectedFiles = git(['diff', '--name-only', remote, local]).split('\n').filter((path) =>
    path === 'config/settings_data.json' || path.startsWith('templates/') ||
    (path.startsWith('sections/') && path.endsWith('.json')) || path.startsWith('locales/'));
  if (protectedFiles.length) {
    console.error(`Push blocked: shared editorial files differ from GitHub:\n${protectedFiles.join('\n')}\nPreserve the remote content or review an explicit content migration. See docs/development.md.`);
    process.exitCode = 1;
  }
}
