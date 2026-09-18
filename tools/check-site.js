/* Site checks. Run: node tools/check-site.js  (exit 1 on any failure) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BANNED = /\b(templates?|teams?|contributors?|formulas?|offline|PIN|share links?)\b/i;
const NEW = ['ai-expense-tracker','budget-app','subscription-tracker','receipt-scanner-app','voice-expense-tracker','save-money-app','cheaper-nearby','expense-tracker-iphone','excel-export'];
const OLD = ['scan-documents-to-excel','receipt-scanner-to-excel','scan-receipts-to-google-sheets','gst-vat-expense-app','mileage-log-app','invoice-scanner-to-excel','expense-report-app','free-receipt-scanner-app','photo-to-excel','timesheet-app','self-employed-expense-tracker','1099-expense-tracker','quote-estimate-app','purchase-order-scanner','receipt-app-for-bookkeepers'];
const CHECK = ['index.html', ...NEW.map(s => `${s}/index.html`), 'get/index.html', 'support/index.html', 'delete-account/index.html'];
let fail = 0;
const bad = (m) => { console.error('FAIL ' + m); fail = 1; };
for (const f of CHECK) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  const m = text.match(BANNED); if (m) bad(`${f}: banned word "${m[0]}"`);
  if (!/<title>[^<]{5,}<\/title>/.test(html)) bad(`${f}: no title`);
  if (!/rel="canonical"/.test(html)) bad(`${f}: no canonical`);
  if (!/name="description"/.test(html)) bad(`${f}: no description`);
  for (const src of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    if (!fs.existsSync(path.join(ROOT, src[1]))) bad(`${f}: missing asset ${src[1]}`);
  }
  for (const href of html.matchAll(/href="\/([a-z0-9-]+)\/"/g)) {
    if (!fs.existsSync(path.join(ROOT, href[1], 'index.html'))) bad(`${f}: dead link /${href[1]}/`);
  }
}
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const s of OLD) if (sitemap.includes(`/${s}/`)) bad(`sitemap still lists ${s}`);
for (const s of NEW) if (!sitemap.includes(`/${s}/`)) bad(`sitemap missing ${s}`);
for (const s of OLD) { const h = fs.readFileSync(path.join(ROOT, s, 'index.html'), 'utf8'); if (!/http-equiv="refresh"/.test(h)) bad(`${s} is not a redirect stub`); }
for (const f of fs.readdirSync(path.join(ROOT, 'assets/art'))) {
  const b = fs.readFileSync(path.join(ROOT, 'assets/art', f)); const w = b.readUInt32BE(16);
  if (w > 480) bad(`assets/art/${f} is ${w}px wide`);
}
const home = fs.statSync(path.join(ROOT, 'index.html')).size; if (home > 60000) bad(`index.html is ${home} bytes`);
console.log(fail ? 'CHECKS FAILED' : 'All checks passed'); process.exit(fail);
