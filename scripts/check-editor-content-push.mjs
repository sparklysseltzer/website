import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

export function verifyContentReview(review, { remote, local, files }) {
  assert.equal(review.remoteCommit, remote, 'Content review is stale: remote commit changed.');
  assert.equal(review.localCommit, local, 'Content review is stale: local commit changed.');
  assert.equal(review.target, 'sparklysseltzer/website:refs/heads/main');
  assert.equal(review.authorization, 'explicit-content-replacement');
  assert.deepEqual(review.files, files, 'Content review must cover exactly the protected file changes.');
}

function main() {
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
    if (!protectedFiles.length) continue;
    const reviewPath = process.env.SPARKLYS_CONTENT_REVIEW;
    if (reviewPath) {
      const files = protectedFiles.map(path => ({
        path,
        before: git(['ls-tree', remote, '--', path]),
        after: git(['ls-tree', local, '--', path]),
      }));
      verifyContentReview(JSON.parse(readFileSync(reviewPath, 'utf8')), { remote, local, files });
      console.log(`Explicit content review verified for ${files.length} protected files.`);
    } else {
      console.error(`Push blocked: shared editorial files differ from GitHub:\n${protectedFiles.join('\n')}\nPreserve the remote content or review an explicit content migration. See docs/development.md.`);
      process.exitCode = 1;
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
