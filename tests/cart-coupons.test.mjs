import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function fixture(codes, response) {
  const input = { value: 'NEWSLETTER', focus() {}, setAttribute() {} };
  const panel = { dataset: { pending: 'pending', failed: 'failed', applied: 'applied', unallocated: 'unallocated', rejected: 'rejected', removed: 'removed', duplicate: 'duplicate', single: 'single' }, querySelector: () => input, closest: () => ({ dataset: { cartSurface: 'page' } }) };
  const context = { HTMLElement: class {}, document: { querySelector: () => ({ querySelector: () => input }) } };
  const source = readFileSync(new URL('../assets/theme.js', import.meta.url), 'utf8').split("if (!customElements.get('cart-drawer'))")[0];
  vm.runInNewContext(`${source}\nglobalThis.Controller = CartDrawer;`, context);
  const cart = new context.Controller();
  cart.couponReady = Promise.resolve();
  cart.discountCodes = codes;
  cart.allocatedCodes = new Set();
  cart.dialog = { open: true };
  cart.renderDiscountCodes = () => {};
  cart.couponStatus = (message, error) => { cart.feedback = { message, error }; };
  cart.render = (sections) => { cart.allocatedCodes = new Set(sections.allocated); };
  cart.run = async (action) => { try { await action(); return true; } catch { return false; } };
  cart.requests = [];
  cart.request = async (endpoint, payload) => { cart.requests.push({ endpoint, discount: payload.discount }); if (response instanceof Error) throw response; return response; };
  return { cart, panel, input };
}
const entry = (code, applicable = true) => ({ code, applicable });
const result = (codes, allocated = []) => ({ discount_codes: codes, sections: { allocated } });

test('adding a code preserves other codes and only confirms its own allocation', async () => {
  const { cart, panel, input } = fixture([entry('FIRST')], result([entry('FIRST'), entry('newsletter')], ['first', 'newsletter']));
  await cart.updateDiscount(panel);
  assert.equal(cart.requests[0].discount, 'FIRST,NEWSLETTER');
  assert.equal(cart.feedback.message, 'applied');
  assert.equal(input.value, '');
});
test('HTTP success with inapplicable code preserves input and reports rejection', async () => {
  const { cart, panel, input } = fixture([entry('FIRST')], result([entry('FIRST'), entry('NEWSLETTER', false)], ['first']));
  await cart.updateDiscount(panel);
  assert.equal(cart.feedback.message, 'rejected');
  assert.equal(cart.feedback.error, true);
  assert.equal(input.value, 'NEWSLETTER');
});
test('accepted code without allocation does not claim a shipping saving', async () => {
  const { cart, panel } = fixture([], result([entry('NEWSLETTER')]));
  await cart.updateDiscount(panel);
  assert.equal(cart.feedback.message, 'unallocated');
});
test('removing one code preserves even temporarily inapplicable other codes', async () => {
  const { cart, panel } = fixture([entry('FIRST'), entry('SECOND', false)], result([entry('SECOND', false)]));
  await cart.updateDiscount(panel, 'first');
  assert.equal(cart.requests[0].discount, 'SECOND');
  assert.equal(cart.feedback.message, 'removed');
});
test('case-insensitive duplicate does not mutate', async () => {
  const { cart, panel } = fixture([entry('newsletter')], null);
  await cart.updateDiscount(panel);
  assert.equal(cart.requests.length, 0);
  assert.equal(cart.feedback.message, 'duplicate');
});
test('failed mutation is not retried and draft survives', async () => {
  const { cart, panel, input } = fixture([], new Error('offline'));
  await cart.updateDiscount(panel);
  assert.equal(cart.requests.length, 1);
  assert.equal(input.value, 'NEWSLETTER');
  assert.equal(cart.feedback.message, 'failed');
});
test('comma-separated input cannot create ambiguous multi-code feedback', async () => {
  const { cart, panel, input } = fixture([], null);
  input.value = 'FIRST,SECOND';
  await cart.updateDiscount(panel);
  assert.equal(cart.requests.length, 0);
  assert.equal(cart.feedback.message, 'single');
});
