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

// Every active font picker shares the same editor-facing casing contract.
// Sidebar per-design fields are retired compatibility storage, not active pickers.
for (const [path, schema] of schemas) {
  const settings = schema.settings ?? [];
  for (const font of settings.filter(field => field.options?.some(option => option.value === 'newake' || /Newake/.test(option.label)))) {
    if (path === 'blocks/sidebar-box.liquid' && ['reminder_heading_font', 'subscription_heading_font'].includes(font.id)) continue;
    const next = settings[settings.indexOf(font) + 1];
    const prefix = `${path}: ${font.id} heading standard`;
    if (font.type !== 'select' || font.label !== 'Heading font') errors.push(`${prefix}: use the Heading font segmented control`);
    if (next?.type !== 'checkbox' || next.label !== 'Uppercase headings') {
      errors.push(`${prefix}: requires an adjacent Uppercase headings checkbox`);
      continue;
    }
    const scope = path.startsWith('blocks/') ? 'block' : 'section';
    const explicitFonts = font.options.filter(option => ['Erode', 'Newake'].includes(option.label));
    if (font.options.length !== 2 || font.options.some(option => option.group) || explicitFonts.map(option => option.label).join(',') !== 'Erode,Newake') {
      errors.push(`${prefix}: use exactly two ungrouped options: Erode then Newake`);
      continue;
    }
    const newake = font.options.find(option => option.label === 'Newake').value;
    const parent = font.visible_if?.replace(/^{{\s*|\s*}}$/g, '').trim();
    const expression = `{{ ${scope}.settings.${font.id} == '${newake}'${parent ? ` and ${parent}` : ''} }}`;
    if (next.visible_if !== expression) errors.push(`${prefix}: uppercase visibility must follow explicit Newake and heading content`);
    if (next.info !== 'Applies to Newake headings only. Erode always keeps the original capitalization.') errors.push(`${prefix}: use the shared uppercase help text`);
    if (next.default !== (path === 'sections/content-slider.liquid')) errors.push(`${prefix}: preserve the standard casing default`);
  }
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
  // Explicitly reviewed section-local blocks share their owning section's mode state.
  for (const [type, blockContract] of Object.entries(contract.blockContracts ?? {})) {
    const block = schema.blocks?.find(candidate => candidate.type === type);
    if (!block) { errors.push(`${path}: reviewed block ${type} is missing`); continue; }
    let blockGroup;
    const blockFields = {};
    for (const field of block.settings ?? []) {
      if (field.type === 'header') blockGroup = field.content;
      if (field.id) blockFields[field.id] = { group: blockGroup ?? null, visible_if: field.visible_if ?? null };
      if (['checkbox', 'select'].includes(field.type) && !blockContract.controls?.[field.id]) errors.push(`${path}: unaudited block control ${type}.${field.id}`);
    }
    try { assert.deepEqual(blockFields, blockContract.fields); }
    catch { errors.push(`${path}: block ${type} grouping/visibility changed`); }
    const blockDefaults = Object.fromEntries((block.settings ?? []).filter(field => field.id).map(field => [field.id, field.default]));
    for (const scenario of blockContract.scenarios) {
      const state = { ...defaults, ...blockDefaults, ...scenario.settings };
      for (const [expectation, shouldShow] of [['visible', true], ['hidden', false]]) {
        for (const id of scenario[expectation] ?? []) {
          const field = block.settings.find(field => field.id === id);
          if (!field || visible(field.visible_if, state) !== shouldShow) errors.push(`${path}: block ${type}: ${scenario.name}: ${id} must be ${expectation}`);
        }
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
