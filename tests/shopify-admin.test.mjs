import test from 'node:test';
import assert from 'node:assert/strict';
import { createAdminClient, STORE } from '../scripts/shopify-admin.mjs';

const credentials = { SHOPIFY_API_KEY: 'test-client', SHOPIFY_API_SECRET: 'test-secret' };
test('exchanges CLI credentials once and keeps requests on the intended store', async () => {
  const requests = [];
  const graphql = createAdminClient({ credentials, fetchImpl: async (url, options) => {
    requests.push({ url, options });
    return Response.json(url.endsWith('/access_token')
      ? { access_token: 'test-access', expires_in: 86399 }
      : { data: { ok: true } });
  } });
  assert.deepEqual(await graphql('query { shop { name } }'), { ok: true });
  await graphql('query { shop { name } }');
  assert.equal(requests.length, 3);
  assert.equal(requests[0].options.body.get('client_secret'), 'test-secret');
  assert.equal(requests[1].options.headers['X-Shopify-Access-Token'], 'test-access');
  for (const request of requests) {
    assert.equal(new URL(request.url).hostname, STORE);
    assert.equal(request.options.redirect, 'error');
    assert.ok(request.options.signal);
  }
});
test('authentication failure never sends a GraphQL request or exposes the response body', async () => {
  let calls = 0;
  const graphql = createAdminClient({ credentials, fetchImpl: async () => {
    calls++;
    return new Response('test-secret', { status: 401 });
  } });
  await assert.rejects(graphql('query { shop { name } }'), error =>
    error.message.includes('HTTP 401') && !error.message.includes('test-secret'));
  assert.equal(calls, 1);
});
test('GraphQL failures cannot be mistaken for successful writes or leak server values', async () => {
  const graphql = createAdminClient({ credentials, fetchImpl: async url => Response.json(
    url.endsWith('/access_token') ? { access_token: 'test-access', expires_in: 86399 }
      : { errors: [{ message: 'sensitive submitted value' }] }) });
  await assert.rejects(graphql('query { shop { name } }'), error =>
    error.message.includes('1 error(s)') && !error.message.includes('sensitive submitted value'));
});
