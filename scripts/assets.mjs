// Generates public/Tharani-Muthukumar-Resume.pdf and public/og.png from the built site.
// Run after `astro build`, then build again so dist/ picks them up.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // pre-installed globally
import { readFileSync } from 'node:fs';
import { serve } from './serve.mjs';

const server = await serve(4399);
const browser = await chromium.launch();
const pub = (f) => new URL(`../public/${f}`, import.meta.url).pathname;

// Résumé → PDF
const page = await browser.newPage();
await page.goto('http://localhost:4399/tharau-portfolio/resume/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: pub('Tharani-Muthukumar-Resume.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });

// Social card → PNG
const b64 = (p) => readFileSync(new URL(p, import.meta.url)).toString('base64');
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(`<!doctype html><html><head><style>
@font-face{font-family:P;font-weight:600;src:url(data:font/woff2;base64,${b64('../public/fonts/poppins-600.woff2')})}
@font-face{font-family:G;font-weight:400 700;src:url(data:font/woff2;base64,${b64('../public/fonts/google-sans.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#09090b;color:#f5f2ed;font-family:G;overflow:hidden;position:relative}
.glow{position:absolute;border-radius:50%}
.g1{width:900px;height:900px;right:-300px;top:-420px;background:radial-gradient(closest-side,rgba(255,122,61,.55),transparent 70%)}
.g2{width:700px;height:700px;right:40px;top:120px;background:radial-gradient(closest-side,rgba(255,92,147,.35),transparent 70%)}
.g3{width:800px;height:800px;left:-380px;bottom:-460px;background:radial-gradient(closest-side,rgba(155,138,255,.4),transparent 70%)}
.wrap{position:absolute;inset:0;display:flex;align-items:center;padding:0 72px;gap:56px}
.txt{flex:1}
.chip{display:inline-flex;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.16);border-radius:99px;padding:10px 18px;font-size:22px;color:#d6d1c9}
.chip i{width:10px;height:10px;border-radius:50%;background:#7cf2c2}
h1{font-family:P;font-weight:600;font-size:96px;line-height:1;letter-spacing:-.04em;margin:30px 0 22px}
h1 span{color:#ff7a3d}
.role{font-size:32px;color:#f5f2ed}
.role b{background:linear-gradient(100deg,#ffc46b,#ff7a3d 35%,#ff5c93 70%,#9b8aff);-webkit-background-clip:text;color:transparent;font-weight:600}
.sub{margin-top:18px;font-size:22px;color:#a39e96}
.ph{width:360px;height:450px;border-radius:200px 200px 28px 28px;overflow:hidden;box-shadow:0 30px 90px rgba(255,122,61,.3),0 0 0 1px rgba(255,255,255,.12);flex:none}
.ph img{width:100%;height:100%;object-fit:cover;object-position:42% 30%;transform:scale(1.08)}
</style></head><body>
<div class="glow g1"></div><div class="glow g2"></div><div class="glow g3"></div>
<div class="wrap"><div class="txt">
<span class="chip"><i></i>Portfolio · Coimbatore, India</span>
<h1>Tharani<br>Muthukumar<span>.</span></h1>
<p class="role">Growth Marketer · <b>B2B SaaS</b></p>
<p class="sub">Positioning · Retention marketing · n8n · Power BI</p>
</div><div class="ph"><img src="data:image/jpeg;base64,${b64('../src/assets/tharani.jpg')}"></div></div>
</body></html>`);
await og.evaluate(() => document.fonts.ready);
await og.screenshot({ path: pub('og.png') });

await browser.close();
server.close();
console.log('resume + og done');
