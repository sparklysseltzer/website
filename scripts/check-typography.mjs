import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

// Exact, documented artwork exceptions. Ordinary sections must use shared roles.
const exceptions = new Map([
  ['sections/soda-three-reasons.liquid', new Set(['clamp(3.5rem, 6vw, 5.125rem)', 'calc(192 / 82 * 1em)', '1em'])],
  ['sections/product-overview-teaser.liquid', new Set(['clamp(1.75rem, 2.2vw, 2.5rem)', 'clamp(2.25rem, calc(21cqi - 1.25rem), 3.875rem)', '2rem'])],
]);
const base = readFileSync('assets/base.css', 'utf8');
const roles = new Set([...base.matchAll(/--font-size-([\w-]+):/g)].map(m => m[1]));
const files = ['assets', 'sections', 'snippets', 'layout'].flatMap(dir =>
  readdirSync(dir).filter(name => /\.(css|liquid)$/.test(name)).map(name => `${dir}/${name}`));
const errors = [];
for (const file of files) {
  const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of source.matchAll(/(?<![\w-])font-size\s*:\s*([^;}]+)/g)) {
    const value = match[1].trim();
    const role = value.match(/^var\(--font-size-([\w-]+)\)$/)?.[1];
    if (role && roles.has(role)) continue;
    if (file === 'assets/base.css' && value === '100%') continue;
    if (exceptions.get(file)?.has(value)) continue;
    errors.push(`${file}: unapproved font-size: ${value}`);
  }
  for (const match of source.matchAll(/(?<![\w-])font\s*:\s*([^;}]+)/g)) {
    if (match[1].trim() !== 'inherit') errors.push(`${file}: font shorthand bypasses typography roles`);
  }
  if (file !== 'assets/base.css' && /--font-size-[\w-]+\s*:/.test(source)) {
    errors.push(`${file}: typography roles must be defined centrally`);
  }
}
assert.equal(errors.length, 0, errors.join('\n'));
// Regression: body interpolation remains shared, gently fluid, and root-relative.
const formula = base.match(/--font-size-body: clamp\(([\d.]+)rem, calc\(([\d.]+)rem \+ ([\d.]+)vw\), ([\d.]+)rem\)/);
assert.ok(formula, 'Body must retain rem bounds and a rem + vw preferred value');
const [, min, intercept, slope, max] = formula.map(Number);
const size = (width, root = 16) => Math.min(max * root, Math.max(min * root, intercept * root + slope * width / 100));
for (const [width, expected] of [[320, 16], [390, 16], [915, 16.5], [1440, 17], [1920, 17]]) {
  assert.ok(Math.abs(size(width) - expected) < .001, `Unexpected body size at ${width}px`);
}
assert.ok(size(390, 32) >= 32, 'Enlarged root text must remain supported');
console.log(`Typography checks passed (${files.length} source files, ${roles.size} shared roles).`);
