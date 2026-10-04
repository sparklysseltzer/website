import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function fixture({ stopped = false, hovered = false, visible = true, hidden = false, reduced = false } = {}) {
  const elements = new Map();
  let timer = null;
  vm.runInNewContext(readFileSync(new URL('../assets/product-detail.js', import.meta.url), 'utf8'), {
    HTMLElement: class {}, Intl, document: { hidden }, matchMedia: () => ({ matches: reduced }),
    setTimeout: callback => { timer = callback; return 1; }, clearTimeout: () => { timer = null; },
    customElements: { get: name => elements.get(name), define: (name, type) => elements.set(name, type) },
  });
  const product = new (elements.get('product-detail'))();
  Object.assign(product, { inView: visible, galleryStopped: stopped, galleryHovered: hovered,
    slides: [{ dataset: { mediaType: 'image' } }, { dataset: { mediaType: 'image' } }],
    slideIndex: () => 0, toggleAttribute: (_, value) => { product.badgeRunning = value; },
  });
  product.syncGalleryMotion();
  return { product, timer: () => timer };
}

test('gallery hover and manual interaction cannot permanently stop the decorative ring', () => {
  for (const state of [{ stopped: true }, { hovered: true }, { stopped: true, hovered: true }]) {
    const { product, timer } = fixture(state);
    assert.equal(product.badgeRunning, true);
    assert.equal(timer(), null);
  }
});
test('offscreen, hidden-tab and reduced-motion states still suspend both motions', () => {
  for (const state of [{ visible: false }, { hidden: true }, { reduced: true }]) {
    const { product, timer } = fixture(state);
    assert.equal(product.badgeRunning, false);
    assert.equal(timer(), null);
  }
});
test('uninterrupted image gallery retains autoplay and badge resumes after returning onscreen', () => {
  const active = fixture();
  assert.equal(active.product.badgeRunning, true);
  assert.equal(typeof active.timer(), 'function');
  const { product, timer } = fixture({ visible: false, stopped: true });
  product.inView = true;
  product.syncGalleryMotion();
  assert.equal(product.badgeRunning, true);
  assert.equal(timer(), null);
});
