import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, relative, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const firstDefaults = { show_heading: true, heading: 'Add your split section heading', show_subtext: true, subtext: '<p>Add supporting copy for this section.</p>', show_list: true, show_button: true, button_label: 'Learn more', button_link: '', button_style: 'automatic' };

export function migratePanelSection(section) {
  if (section.type !== 'split-image-text' || section.settings?.column_content === 'blocks') return section;
  const settings = section.settings ?? {};
  const oldBlocks = section.blocks ?? {};
  if (Object.values(oldBlocks).some(block => block.type !== 'item')) throw new Error('Panel has unexpected blocks; review it before migration.');
  const order = section.block_order ?? Object.keys(oldBlocks);
  if (new Set(order).size !== order.length || order.some(id => !oldBlocks[id]) || Object.keys(oldBlocks).some(id => !order.includes(id))) throw new Error('Panel block order is inconsistent; no content was changed.');
  const leftSettings = Object.fromEntries(Object.entries(firstDefaults).map(([key, value]) => [key, settings[key] ?? value]));
  const ticks = Object.fromEntries(Object.entries(oldBlocks).map(([id, block]) => [id, { ...block, type: '_panel-tick' }]));
  const result = {
    ...section,
    settings: { ...settings, column_content: 'blocks' },
    blocks: {
      left_column: { type: '_panel-left-column', static: true, settings: leftSettings, blocks: ticks, block_order: [...order] },
      right_column: { type: '_panel-right-column', static: true, settings: {
        show_heading: Boolean(settings.second_heading), heading: settings.second_heading ?? '',
        show_subtext: Boolean(settings.second_text), subtext: settings.second_text ?? '',
        show_list: true, show_button: false, button_label: 'Learn more', button_link: '', button_style: 'automatic',
      } },
    },
  };
  delete result.block_order;
  return result;
}

export function migrateDocument(document) {
  return { ...document, sections: Object.fromEntries(Object.entries(document.sections ?? {}).map(([id, section]) => [id, migratePanelSection(section)])) };
}

// Read fresh CLI downloads; write reviewed copies to a separate directory only.
// This command never authenticates, uploads, or modifies its source files.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [sourceArg, outputArg] = process.argv.slice(2);
  if (!sourceArg || !outputArg) throw new Error('Usage: node scripts/migrate-panel-columns.mjs <download-directory> <output-directory>');
  const source = resolve(sourceArg), output = resolve(outputArg);
  if (source === output || output.startsWith(source + '/')) throw new Error('Output must be separate from the source directory.');
  let changed = 0;
  for (const folder of ['templates', 'sections']) {
    let names;
    try { names = readdirSync(join(source, folder)); } catch { continue; }
    for (const name of names.filter(name => name.endsWith('.json'))) {
      const path = join(source, folder, name);
      const original = JSON.parse(readFileSync(path, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\//, ''));
      if (!Object.values(original.sections ?? {}).some(section => section.type === 'split-image-text' && section.settings?.column_content !== 'blocks')) continue;
      const migrated = migrateDocument(original);
      const target = join(output, relative(source, path));
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, JSON.stringify(migrated, null, 2) + '\n');
      console.log(relative(source, path));
      changed++;
    }
  }
  console.log(`${changed} reviewed-copy candidate(s) created; source and Shopify unchanged.`);
}
