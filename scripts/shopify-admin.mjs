import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { pathToFileURL } from 'node:url';

export const STORE = 'sparklys-hard-seltzer.myshopify.com';
const API_VERSION = '2026-07';
const CREDENTIAL_FILE = new URL('../.shopify/admin-app/.env', import.meta.url);

// Credentials stay in the ignored CLI app directory; access tokens stay in memory.
export function createAdminClient({ credentials, fetchImpl = fetch } = {}) {
  if (!credentials) {
    let saved = {};
    try { saved = parseEnv(readFileSync(CREDENTIAL_FILE, 'utf8')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    credentials = { ...saved, ...process.env };
  }
  const clientId = credentials.SHOPIFY_CLIENT_ID || credentials.SHOPIFY_API_KEY;
  const clientSecret = credentials.SHOPIFY_CLIENT_SECRET || credentials.SHOPIFY_API_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Admin app credentials are missing. Complete the connection setup in docs/development.md.');
  }
  let token;
  let expiresAt = 0;

  async function getToken() {
    if (token && Date.now() < expiresAt - 60_000) return token;
    const response = await fetchImpl(`https://${STORE}/admin/oauth/access_token`, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30_000),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
    });
    if (!response.ok) throw new Error(`Admin app authentication failed (HTTP ${response.status}). Check app installation and organization ownership.`);
    const payload = await response.json();
    if (!payload.access_token || !(payload.expires_in > 0)) throw new Error('Admin app authentication returned an invalid token response.');
    token = payload.access_token;
    expiresAt = Date.now() + payload.expires_in * 1000;
    return token;
  }

  return async function graphql(query, variables = {}) {
    const accessToken = await getToken();
    const response = await fetchImpl(`https://${STORE}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30_000),
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) throw new Error(`Admin GraphQL request failed (HTTP ${response.status}).`);
    const payload = await response.json();
    if (payload.errors?.length) {
      // Do not echo server messages that might include submitted sensitive values.
      throw new Error(`Admin GraphQL returned ${payload.errors.length} error(s). Check the query and granted scopes.`);
    }
    return payload.data;
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const graphql = createAdminClient();
    const data = await graphql(`query AdminConnection {
      shop { name myshopifyDomain }
      currentAppInstallation { app { title } accessScopes { handle } }
    }`);
    if (data.shop.myshopifyDomain !== STORE) throw new Error('Unexpected store returned by Admin API.');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
