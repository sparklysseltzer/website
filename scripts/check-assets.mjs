import { readFile } from 'node:fs/promises';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const assets = [
  { path: 'assets/base.css', gzipLimit: 30 * 1024 },
  { path: 'assets/theme.js', gzipLimit: 15 * 1024 },
];

const formatKiB = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`;
const failures = [];

console.log('Global storefront asset sizes');
console.log('Asset                     Raw         Gzip       Brotli      Gzip limit');

for (const asset of assets) {
  const source = await readFile(asset.path);
  const gzipSize = gzipSync(source, { level: 9 }).byteLength;
  const brotliSize = brotliCompressSync(source, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
    },
  }).byteLength;

  console.log(
    `${asset.path.padEnd(25)} ${formatKiB(source.byteLength).padStart(10)} ${formatKiB(gzipSize).padStart(10)} ${formatKiB(brotliSize).padStart(10)} ${formatKiB(asset.gzipLimit).padStart(15)}`,
  );

  if (gzipSize > asset.gzipLimit) {
    failures.push(
      `${asset.path} is ${formatKiB(gzipSize)} gzip and exceeds its ${formatKiB(asset.gzipLimit)} review threshold.`,
    );
  }
}

if (failures.length > 0) {
  console.error('\nGlobal asset review required:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
}
