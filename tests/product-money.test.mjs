import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const elements = new Map();
vm.runInNewContext(readFileSync(new URL('../assets/product-detail.js', import.meta.url), 'utf8'), {
  HTMLElement: class {}, Intl,
  customElements: { get: name => elements.get(name), define: (name, type) => elements.set(name, type) },
});
const Product = elements.get('product-detail');
function money(locale, country, currency, amount = 2940) {
  const product = new Product();
  product.dataset = { locale, country, currency };
  return product.money(amount).replace(/\u00a0/g, ' ');
}
test('German Swiss and Liechtenstein shoppers receive decimal points', () => {
  assert.equal(money('de', 'CH', 'CHF'), 'CHF 29.40');
  assert.equal(money('de', 'LI', 'CHF'), 'CHF 29.40');
});
test('German Germany uses decimal commas, independently of currency', () => {
  assert.equal(money('de', 'DE', 'EUR'), '29,40 EUR');
  assert.equal(money('de', 'DE', 'CHF'), '29,40 CHF');
});
test('selected country overrides a language tag region without losing language', () => {
  assert.equal(money('de-DE', 'CH', 'CHF'), 'CHF 29.40');
  assert.equal(money('de-CH', 'DE', 'EUR'), '29,40 EUR');
});
test('keeps exact cents and falls back to the supplied locale when country is absent', () => {
  assert.equal(money('de', 'CH', 'CHF', 2945), 'CHF 29.45');
  assert.equal(money('de-CH', undefined, 'CHF'), 'CHF 29.40');
});
