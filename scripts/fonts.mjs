// Subsets the self-hosted fonts to the characters the site actually uses (plus ASCII),
// which roughly halves what the browser downloads before first paint.
import subsetFont from 'subset-font';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const src = (f) => new URL(`../fonts-src/${f}`, import.meta.url);
const out = (f) => new URL(`../public/fonts/${f}`, import.meta.url);

let ascii = '';
for (let c = 0x20; c < 0x7f; c++) ascii += String.fromCharCode(c);
const text = ascii + '’‘“”–—…·•→←↑↓éÉ©®™×✓€£₹';

await mkdir(out(''), { recursive: true });
for (const [from, to, opts] of [
  // Static instances for the site (smaller than the variable font)…
  ['google-sans-latin-wght.woff2', 'google-sans-400.woff2', { variationAxes: { wght: 400 } }],
  ['google-sans-latin-wght.woff2', 'google-sans-500.woff2', { variationAxes: { wght: 500 } }],
  // …and the variable font for the résumé, which needs real bold.
  ['google-sans-latin-wght.woff2', 'google-sans.woff2', { variationAxes: { wght: { min: 400, max: 700 } } }],
  ['poppins-latin-600.woff2', 'poppins-600.woff2', {}],
  ['poppins-latin-500.woff2', 'poppins-500.woff2', {}],
]) {
  const buf = await subsetFont(await readFile(src(from)), text, { targetFormat: 'woff2', ...opts });
  await writeFile(out(to), buf);
  console.log(to, buf.length);
}
