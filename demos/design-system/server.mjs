// Local-only design system studio server. Only the demo and public theme assets are served.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
http.createServer(async (req,res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  if (req.url === '/robots.txt') { res.writeHead(200, { 'Content-Type': 'text/plain' }).end('User-agent: *\nDisallow: /\n'); return; }
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const name = pathname === '/' ? '/demos/design-system/index.html' : pathname;
  if (!/^\/(assets\/[a-zA-Z0-9._-]+|demos\/design-system\/(index.html|demo.css|demo.js))$/.test(name)) { res.writeHead(404).end(); return; }
  try { const bytes = await readFile(path.join(root,name));res.writeHead(200, { 'Content-Type':mime[path.extname(name)] || 'application/octet-stream', 'Cache-Control':'no-store' });res.end(bytes); }
  catch { res.writeHead(404).end(); }
}).listen(9293,'127.0.0.1',()=>console.log('Design system studio: http://127.0.0.1:9293'));
