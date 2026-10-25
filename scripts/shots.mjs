// Dev helper: screenshots of the built site at several viewports.
import { createRequire } from 'node:module';
import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const out = process.argv[2];
const which = process.argv[3] ?? 'all';
const server = await serve(4398);
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const views = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 760 },
  tablet: { width: 820, height: 1180, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};
const errors = [];
for (const [name, v] of Object.entries(views)) {
  if (which !== 'all' && which !== name) continue;
  const { width, height, ...rest } = v;
  const ctx = await browser.newContext({ viewport: { width, height }, ...rest });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && errors.push(`${name}: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message}`));
  await page.goto('http://localhost:4398/tharau-portfolio/', { waitUntil: 'networkidle' });
  await page.mouse.move(width * 0.7, height * 0.4);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${out}/${name}-0.png` });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 1;
  for (let y = height; y < total; y += height * 0.9) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${out}/${name}-${String(i++).padStart(2, '0')}.png` });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, 'height', total, 'shots', i, 'h-overflow', overflow);
  await ctx.close();
}
console.log('errors:', errors);
await browser.close();
server.close();
