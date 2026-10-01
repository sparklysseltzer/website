import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function fixture({ success = false, checked = false, stored, storageFails = false, response = 202 } = {}) {
  const storage = new Map(stored ? [['sparklys:contact-newsletter:/pages/kontakt:form', JSON.stringify(stored)]] : []);
  const requests = [];
  const listeners = new Map();
  const checkbox = { checked, disabled: true };
  const retry = { hidden: true, addEventListener() {}, removeEventListener() {} };
  const status = { textContent: '', focus() {} };
  const result = { hidden: true };
  const form = { id: 'form', checkValidity: () => true, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener() {} };
  const elements = { form, '[data-newsletter-opt-in]': success ? null : checkbox, '[data-newsletter-retry]': retry, '[data-newsletter-status]': status, '[data-newsletter-result]': result, '[data-contact-success]': success ? {} : null, '[data-newsletter-unavailable]': { hidden: false } };
  const fields = new Map([['contact[email]', 'bob@example.com'], ['contact[first_name]', 'Bob'], ['contact[last_name]', 'Ross'], ['contact[contact_phone_number]', '044 123 45 67'], ['contact[body]', 'PRIVATE ENQUIRY']]);
  const context = {
    HTMLElement: class { querySelector(s) { return elements[s]; } }, customElements: { get: () => true },
    location: { pathname: '/pages/kontakt' }, sessionStorage: { getItem: k => storage.get(k), setItem: (k, v) => { if (storageFails) throw Error('blocked'); storage.set(k, v); }, removeItem: k => storage.delete(k) },
    FormData: class { get(k) { return fields.get(k); } }, Date, JSON, encodeURIComponent, AbortSignal,
    document: {}, window: {}, matchMedia: () => ({ matches: true }), getComputedStyle: () => ({ getPropertyValue: () => '' }),
    fetch: async (url, options) => { requests.push({ url, ...options }); return { status: response }; },
  };
  vm.runInNewContext(readFileSync(new URL('../assets/contact-form.js', import.meta.url), 'utf8') + '\nglobalThis.Contact = SparklysContact;', context);
  const contact = new context.Contact();
  contact.dataset = { siteId: 'PUBLIC', listId: 'LISTID', newsletterPending: 'pending', newsletterSuccess: 'accepted', newsletterError: 'failed' };
  contact.connectedCallback();
  return { contact, storage, requests, listeners, checkbox, retry, status, result };
}
const pending = () => ({ createdAt: Date.now(), siteId: 'PUBLIC', listId: 'LISTID', attributes: { email: 'bob@example.com', first_name: 'Bob', last_name: 'Ross', subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } } } });
const settle = () => new Promise(resolve => setImmediate(resolve));

test('unchecked enquiry never queues or sends a subscription', () => {
  const f = fixture({ stored: pending() });
  f.listeners.get('submit')();
  assert.equal(f.storage.size, 0);
  assert.equal(f.requests.length, 0);
});
test('explicit opt-in queues identity only, with email consent and no enquiry text or SMS consent', () => {
  const f = fixture({ checked: true });
  f.listeners.get('submit')();
  const queued = JSON.parse([...f.storage.values()][0]);
  assert.equal(queued.attributes.properties.contact_phone, '044 123 45 67');
  assert.deepEqual(queued.attributes.subscriptions, { email: { marketing: { consent: 'SUBSCRIBED' } } });
  assert.equal(JSON.stringify(queued).includes('PRIVATE ENQUIRY'), false);
  assert.equal(f.requests.length, 0);
});
test('only Shopify success sends the public client request and removes the pending identity', async () => {
  const f = fixture({ success: true, stored: pending() });
  await settle();
  assert.equal(f.requests.length, 1);
  const request = f.requests[0];
  assert.equal(request.url, 'https://a.klaviyo.com/client/subscriptions?company_id=PUBLIC');
  assert.equal(request.headers.revision, '2026-07-15');
  assert.equal(request.credentials, 'omit');
  assert.equal(JSON.parse(request.body).data.relationships.list.data.id, 'LISTID');
  assert.equal(f.status.textContent, 'accepted');
  assert.equal(f.storage.size, 0);
});
test('rejected signup preserves a separate retry without resubmitting the enquiry', async () => {
  const f = fixture({ success: true, stored: pending(), response: 429 });
  await settle();
  assert.equal(f.status.textContent, 'failed');
  assert.equal(f.retry.hidden, false);
  assert.equal(f.storage.size, 1);
  await f.contact.subscribe();
  assert.equal(f.requests.length, 2);
});
test('expired or differently routed consent cannot be replayed', async () => {
  for (const stored of [{ ...pending(), createdAt: Date.now() - 16 * 60 * 1000 }, { ...pending(), listId: 'OTHER1' }]) {
    const f = fixture({ success: true, stored }); await settle();
    assert.equal(f.requests.length, 0); assert.equal(f.storage.size, 0);
  }
});
test('unavailable session storage leaves native contact usable and disables the newsletter choice', () => {
  const f = fixture({ storageFails: true });
  assert.equal(f.checkbox.disabled, true);
  assert.equal(f.listeners.size, 0);
});
