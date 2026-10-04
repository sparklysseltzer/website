import test from 'node:test';
import assert from 'node:assert/strict';
import { migrateDocument, migratePanelSection } from '../scripts/migrate-panel-columns.mjs';

test('moves tick IDs/order and both columns without overwriting empty or disabled values', () => {
  const panel = { type: 'split-image-text', disabled: true, settings: { image_side: 'top', text_columns: 'two', heading: 'Left', show_heading: false, subtext: '', button_link: 'shopify://pages/kontakt', second_heading: 'Right', second_text: '<p>Right text</p>', panel_color: '#123456' }, blocks: { a: { type: 'item', settings: { text: 'One' }, disabled: true }, b: { type: 'item', settings: { text: 'Two' } } }, block_order: ['b', 'a'] };
  const before = structuredClone(panel), migrated = migratePanelSection(panel);
  assert.deepEqual(panel, before);
  assert.equal(migrated.disabled, true);
  assert.deepEqual(migrated.settings, { ...panel.settings, column_content: 'blocks' });
  assert.equal(migrated.blocks.left_column.settings.show_heading, false);
  assert.equal(migrated.blocks.left_column.settings.subtext, '');
  assert.equal(migrated.blocks.left_column.settings.button_link, 'shopify://pages/kontakt');
  assert.deepEqual(migrated.blocks.left_column.block_order, ['b', 'a']);
  assert.deepEqual(migrated.blocks.left_column.blocks.a, { ...panel.blocks.a, type: '_panel-tick' });
  assert.equal(migrated.blocks.right_column.settings.heading, 'Right');
  assert.equal(migrated.blocks.right_column.settings.subtext, '<p>Right text</p>');
  assert.equal(migrated.blocks.right_column.settings.show_button, false);
  assert.ok(!('block_order' in migrated));
  assert.deepEqual(migratePanelSection(migrated), migrated);
});
test('preserves unrelated sections and document-level metadata', () => {
  const document = { order: ['a', 'b'], layout: 'theme', sections: { a: { type: 'rich-text', settings: { text: 'Untouched' } }, b: { type: 'split-image-text', settings: {} } } };
  const result = migrateDocument(document);
  assert.deepEqual(result.order, document.order);
  assert.equal(result.layout, 'theme');
  assert.deepEqual(result.sections.a, document.sections.a);
  assert.deepEqual(result.sections.b.blocks.left_column.block_order, []);
});
test('rejects unfamiliar block types and incomplete ordering instead of dropping content', () => {
  assert.throws(() => migratePanelSection({ type: 'split-image-text', blocks: { x: { type: 'unknown' } } }), /unexpected/);
  assert.throws(() => migratePanelSection({ type: 'split-image-text', blocks: { x: { type: 'item' } }, block_order: [] }), /inconsistent/);
});
