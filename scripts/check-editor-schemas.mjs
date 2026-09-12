import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const fingerprint = schema => createHash('sha256').update(JSON.stringify(schema)).digest('hex');

const contracts = JSON.parse(readFileSync('tests/editor-schema-contracts.json', 'utf8'));
const errors = [];
const schemas = new Map();
for (const folder of ['sections', 'blocks']) {
  for (const file of readdirSync(folder).filter(name => name.endsWith('.liquid'))) {
    const path = `${folder}/${file}`;
    const source = readFileSync(path, 'utf8');
    const schema = JSON.parse(source.match(/{% schema %}([\s\S]*?){% endschema %}/)[1]);
    schemas.set(path, schema);
    const settings = schema.settings ?? [];
    const ids = settings.filter(x => x.id).map(x => x.id);
    if (new Set(ids).size !== ids.length) errors.push(`${path}: duplicate setting IDs`);
    for (const field of settings) {
      if (/figma|fallback|implementation/i.test([field.label, field.content, field.info].filter(Boolean).join(' '))) {
        // Older, unaudited schemas remain outside this editorial-copy contract.
        if (contracts[path]) errors.push(`${path}: implementation wording in ${field.id ?? field.content}`);
      }
      for (const [, id] of (field.visible_if ?? '').matchAll(/(?:section|block)\.settings\.(\w+)/g)) {
        if (!ids.includes(id)) errors.push(`${path}: ${field.id ?? field.content} references missing setting ${id}`);
      }
    }
  }
}

// Liquid evaluates and/or from right to left, not with JavaScript precedence.
function visible(expression, settings) {
  if (!expression) return true;
  const value = raw => {
    const token = raw.trim();
    const reference = token.match(/^(?:section|block)\.settings\.(\w+)$/);
    if (reference) return settings[reference[1]];
    if (/^'.*'$/.test(token)) return token.slice(1, -1);
    if (token === 'true') return true;
    if (token === 'false') return false;
    if (token === 'blank') return undefined;
    if (/^-?\d+(\.\d+)?$/.test(token)) return Number(token);
    throw new Error(`Unsupported expression operand: ${token}`);
  };
  const blank = value => value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length);
  const evaluate = raw => {
    const operation = raw.match(/^(.*?)\s+(and|or)\s+([\s\S]+)$/);
    if (operation) return operation[2] === 'and'
      ? evaluate(operation[1]) && evaluate(operation[3])
      : evaluate(operation[1]) || evaluate(operation[3]);
    const comparison = raw.match(/^(.*?)\s+(==|!=)\s+(.*?)$/);
    if (comparison) {
      const lhs = value(comparison[1]);
      const equal = comparison[3] === 'blank' ? blank(lhs) : lhs === value(comparison[3]);
      return comparison[2] === '==' ? equal : !equal;
    }
    const result = value(raw);
    return result !== false && result !== undefined && result !== null;
  };
  return evaluate(expression.replace(/^{{\s*|\s*}}$/g, ''));
}

for (const [path, contract] of Object.entries(contracts)) {
  const schema = schemas.get(path);
  if (!schema) { errors.push(`${path}: registered schema is missing`); continue; }
  if (fingerprint(schema) !== contract.schemaHash) errors.push(`${path}: schema changed; review labels, options, defaults and scenarios before updating its fingerprint`);
  const settings = schema.settings ?? [];
  let group;
  const fields = {};
  for (const field of settings) {
    if (field.type === 'header') group = field.content;
    if (field.id) fields[field.id] = { group: group ?? null, visible_if: field.visible_if ?? null };
  }
  if (Object.keys(fields).length > 5 && Object.values(fields).some(field => !field.group)) errors.push(`${path}: group every field in longer schemas`);
  try { assert.deepEqual(fields, contract.fields); }
  catch { errors.push(`${path}: field grouping/visibility changed; review and update its editor contract and mode cases`); }
  for (const control of settings.filter(x => ['checkbox', 'select'].includes(x.type))) {
    if (!contract.controls[control.id]) errors.push(`${path}: unaudited control ${control.id}`);
  }
  const defaults = Object.fromEntries(settings.filter(x => x.id).map(x => [x.id, x.default]));
  for (const scenario of contract.scenarios) {
    const state = { ...defaults, ...scenario.settings };
    for (const [expectation, shouldShow] of [['visible', true], ['hidden', false]]) {
      for (const id of scenario[expectation] ?? []) {
        const field = settings.find(x => x.id === id);
        if (!field || visible(field.visible_if, state) !== shouldShow) errors.push(`${path}: ${scenario.name}: ${id} must be ${expectation}`);
      }
    }
  }
}
// New native blocks/sections must explicitly join the review contract. Existing sections
// are listed as legacy, not silently described as fully audited.
const legacy = JSON.parse(readFileSync('tests/editor-schema-legacy.json', 'utf8'));
for (const path of schemas.keys()) {
  if (!contracts[path] && legacy[path] !== fingerprint(schemas.get(path))) errors.push(`${path}: new or changed legacy schema needs an editor contract and mode review`);
}
assert.equal(errors.length, 0, errors.join('\n'));
console.log(`Editor schema checks passed (${Object.keys(contracts).length} reviewed schemas; grouping, control inventory, dependencies and mode cases).`);
