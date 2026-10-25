#!/usr/bin/env bash
# Usage: scripts/lh.sh <name> [extra lighthouse flags]  (expects `node scripts/serve.mjs` running on :4321)
export CHROME_PATH="${CHROME_PATH:-/opt/pw-browsers/chromium-1243/chrome-linux64/chrome}"
mkdir -p lighthouse-reports
npx -y lighthouse@13.5.0 "${URL:-http://localhost:4321/tharau-portfolio/}" --quiet --chrome-flags="--headless=new --no-sandbox" $2 --output=json --output-path=lighthouse-reports/$1.json >/dev/null 2>&1
node -e "
const r=require('./lighthouse-reports/$1.json');const c=r.categories;
console.log('$1', Object.values(c).map(x=>x.id+':'+(x.score==null?'na':Math.round(x.score*100))).join(' '));
for (const cat of Object.values(c)) for (const ref of cat.auditRefs){const a=r.audits[ref.id]; if(ref.weight>0 && a.score!==null && a.score<1 && a.scoreDisplayMode!=='notApplicable') console.log('  FAIL',cat.id,ref.id,a.score,a.displayValue||'');}
['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].forEach(k=>console.log('  ',k,r.audits[k].displayValue));
"
