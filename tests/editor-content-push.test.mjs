import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyContentReview } from '../scripts/check-editor-content-push.mjs';
const expected = { remote: 'remote-commit', local: 'local-commit', files: [{ path: 'templates/page.json', before: 'old-blob', after: 'new-blob' }] };
const review = { remoteCommit: expected.remote, localCommit: expected.local, files: expected.files, target: 'sparklysseltzer/website:refs/heads/main', authorization: 'explicit-content-replacement' };
test('accepts the exact reviewed content replacement', () => assert.doesNotThrow(() => verifyContentReview(review, expected)));
test('rejects changed remote or local commits, wrong target and missing authorization', () => {
  for (const key of ['remoteCommit', 'localCommit', 'target', 'authorization']) {
    assert.throws(() => verifyContentReview({ ...review, [key]: 'different' }, expected));
  }
});
test('rejects omitted, additional or changed protected file blobs', () => {
  for (const files of [[], [...review.files, { path: 'locales/de.json' }], [{ ...review.files[0], after: 'unreviewed-blob' }]]) {
    assert.throws(() => verifyContentReview({ ...review, files }, expected));
  }
});
