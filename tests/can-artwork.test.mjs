import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function fixture({ transparent = true, fails = false, fit = false } = {}) {
  let Type;
  const pixels = new Uint8ClampedArray(64).fill(255);
  if (transparent) pixels[3] = 0;
  vm.runInNewContext(readFileSync(new URL('../assets/can-artwork.js', import.meta.url), 'utf8'), {
    HTMLElement: class {},
    customElements: { get: () => undefined, define: (_, value) => { Type = value; } },
    document: { createElement: () => ({ getContext: () => ({
      drawImage() { if (fails) throw new Error('Unreadable image'); },
      getImageData: () => ({ data: pixels }),
    }) }) },
  });
  const element = new Type();
  const attributes = new Set([fit ? 'data-auto-fit' : 'data-hover-detect', 'data-hover-ready']);
  const styles = new Map();
  Object.assign(element, {
    image: { naturalWidth: 4, naturalHeight: 4 }, dataset: {},
    hasAttribute: key => attributes.has(key), setAttribute: key => attributes.add(key),
    removeAttribute: key => attributes.delete(key),
    style: { setProperty: (key, value) => styles.set(key, value) },
  });
  element.fit();
  return { element, attributes, styles };
}

test('collection cutout detection enables motion without altering uploaded geometry', () => {
  const { attributes, styles, element } = fixture();
  assert.ok(attributes.has('data-hover-ready'));
  assert.equal(styles.size, 0);
  assert.equal(element.dataset.fitted, undefined);
});
test('opaque and unreadable collection replacements clear stale hover eligibility', () => {
  for (const options of [{ transparent: false }, { fails: true }]) {
    assert.equal(fixture(options).attributes.has('data-hover-ready'), false);
  }
});
test('navigation retains alpha fitting without opting into collection hover', () => {
  const { element, styles, attributes } = fixture({ fit: true });
  assert.equal(element.dataset.fitted, '');
  assert.ok(styles.has('--can-image-width'));
  assert.equal(attributes.has('data-hover-ready'), false);
});
