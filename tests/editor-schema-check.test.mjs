import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function checkMutation(mutate, expected) {
  const directory = mkdtempSync(join(tmpdir(), 'sparklys-editor-contract-'));
  try {
    for (const folder of ['sections', 'blocks']) cpSync(folder, join(directory, folder), { recursive: true });
    for (const folder of ['scripts', 'tests']) mkdirSync(join(directory, folder));
    for (const file of ['scripts/check-editor-schemas.mjs', 'tests/editor-schema-contracts.json', 'tests/editor-schema-legacy.json']) cpSync(file, join(directory, file));
    mutate(directory);
    const result = spawnSync(process.execPath, ['scripts/check-editor-schemas.mjs'], { cwd: directory, encoding: 'utf8' });
    assert.notEqual(result.status, 0, 'The invalid schema must fail the gate');
    assert.match(result.stderr, expected);
  } finally { rmSync(directory, { recursive: true, force: true }); }
}
function changeSchema(directory, file, mutate) {
  const path = join(directory, file);
  const source = readFileSync(path, 'utf8');
  const match = source.match(/{% schema %}([\s\S]*?){% endschema %}/);
  const schema = JSON.parse(match[1]);
  mutate(schema);
  writeFileSync(path, source.replace(match[0], `{% schema %}${JSON.stringify(schema)}{% endschema %}`));
}

test('sidebar overlay color cannot be hidden when its strength is zero', () => {
  checkMutation(directory => changeSchema(directory, 'blocks/sidebar-box.liquid', schema => {
    schema.settings.find(field => field.id === 'override_overlay_color').visible_if = "{{ block.settings.override_overlay_strength != 0 }}";
  }), /override_overlay_color must be visible/);
});
test('a new control requires a dependency audit', () => {
  checkMutation(directory => changeSchema(directory, 'sections/text-image.liquid', schema => {
    schema.settings.push({ type: 'checkbox', id: 'new_mode', label: 'New mode', default: false });
  }), /unaudited control new_mode/);
});
test('changing an older schema requires moving it out of the legacy baseline', () => {
  checkMutation(directory => changeSchema(directory, 'sections/hero.liquid', schema => {
    schema.settings.push({ type: 'text', id: 'unreviewed', label: 'Unreviewed' });
  }), /new or changed legacy schema needs an editor contract/);
});
test('a new section cannot bypass the editor contract inventory', () => {
  checkMutation(directory => writeFileSync(join(directory, 'sections/unreviewed.liquid'), '{% schema %}{"name":"Unreviewed","settings":[]}{% endschema %}'), /unreviewed.liquid: new or changed legacy schema/);
});
