# Website Redesign (Expense Tracker AI identity) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace lensreport.app's homepage and keyword pages with the approved direction (A layout, B sticker hero) so the site matches the shipped Expense Tracker AI app and ranks for expense-tracker queries.

**Architecture:** One external stylesheet (`assets/site.css`) and one partials module (`tools/partials.js`) feed both the hand-written homepage and the regenerated keyword pages, so nav, footer, buttons and the app-screen mocks are defined once. Art is exported from the app repo at 2x display size into `assets/art/`. Old keyword directories become redirect stubs written by the same generator.

**Tech Stack:** Static HTML/CSS on GitHub Pages, Node (no deps) for generation and checks, Dart `image` package (from the app repo) for art export, Playwright MCP for the OG image screenshot.

**Spec:** `docs/superpowers/specs/2026-09-18-website-redesign-expense-tracker-identity.md`

## Global Constraints

- No pricing anywhere on the site. Every CTA is the App Store link `https://apps.apple.com/us/app/scan-to-excel-ai-lensreport/id6760954658`; Google Play is a non-clickable "Coming soon".
- Banned words on homepage, keyword pages, `/get`, `/support`, `/delete-account`: template(s), team(s), contributor, formula, offline, PIN, share link. (`/privacy`, `/terms`, `/legal` are legal text and only get the new nav/footer.)
- Money is a plain `$`. Free allowance copy is "Three free expenses".
- Fonts: Plus Jakarta Sans, Inter, DM Mono via Google Fonts. CSP stays `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:;`.
- No PNG in `assets/art/` wider than 480 px. No scroll-reveal JS. No motion on load.
- Homepage HTML under 60 KB.

---

### Task 1: Export app art into `assets/art/`

**Files:**
- Create: `tools/export-art.dart` (run from the LensReport app repo so the `image` package resolves)
- Create: `assets/art/*.png` (output)

**Interfaces:**
- Produces: files named exactly `logo.png`, `hero_saver.png`, `hero_ask_me.png`, `goal_save_big.png`, `goal_stick_budget.png`, `goal_cut_subs.png`, `feat_log.png`, `feat_tips.png`, `feat_nearby.png`, `feat_nudge.png`, `hero_receipt_pile.png`, `hero_on_track.png`, `hero_one_less.png`, `hero_bills.png`, `hero_coffee.png`, and `cat_<slug>.png` for coffee, groceries, fuel, streaming, takeaway, pharmacy, rent, electricity, dining, phone, clothing, subs.

- [ ] **Step 1: Write the export script**

```dart
// tools/export-art.dart  (run: cd <LensReport app repo> && dart run "<this repo>/tools/export-art.dart")
import 'dart:io';
import 'package:image/image.dart' as img;

const out = 'C:/Users/shweth/Documents/GitHub Personal/shweth10.github.io/assets/art/';
const heroes = 'assets/expense/heroes/';
const icons = 'assets/expense/icons/';
const onb = 'assets/onboarding/';

final spec = <String, List<Object>>{
  'logo': ['C:/Users/shweth/Documents/GitHub Personal/shweth10.github.io/assets/images/app-logo.png', 128],
  'hero_saver': ['${heroes}hero_proud_saver.png', 480],
  'hero_ask_me': ['${heroes}hero_ask_me.png', 480],
  'hero_receipt_pile': ['${heroes}hero_receipt_pile.png', 360],
  'hero_on_track': ['${heroes}hero_on_track.png', 360],
  'hero_one_less': ['${heroes}hero_one_less_visit.png', 360],
  'hero_bills': ['${heroes}hero_bills.png', 360],
  'hero_coffee': ['${heroes}hero_coffee.png', 360],
  'goal_save_big': ['${onb}goal_save_big.png', 300],
  'goal_stick_budget': ['${onb}goal_stick_budget.png', 160],
  'goal_cut_subs': ['${onb}goal_cut_subscriptions.png', 160],
  'feat_log': ['${onb}feat_log.png', 160],
  'feat_tips': ['${onb}feat_tips.png', 160],
  'feat_nearby': ['${onb}feat_nearby.png', 160],
  'feat_nudge': ['${onb}feat_nudge.png', 160],
  'cat_coffee': ['${icons}cat_coffee.png', 128],
  'cat_groceries': ['${icons}cat_groceries.png', 128],
  'cat_fuel': ['${icons}cat_transport_fuel.png', 128],
  'cat_streaming': ['${icons}cat_streaming.png', 128],
  'cat_takeaway': ['${icons}cat_takeaway.png', 128],
  'cat_pharmacy': ['${icons}cat_pharmacy.png', 128],
  'cat_rent': ['${icons}cat_housing_rent.png', 128],
  'cat_electricity': ['${icons}cat_electricity.png', 128],
  'cat_dining': ['${icons}cat_dining.png', 128],
  'cat_phone': ['${icons}cat_phone_internet.png', 128],
  'cat_clothing': ['${icons}cat_clothing.png', 128],
  'cat_subs': ['${icons}cat_subscriptions.png', 128],
};

void main() {
  Directory(out).createSync(recursive: true);
  spec.forEach((name, v) {
    final f = File(v[0] as String);
    if (!f.existsSync()) { stderr.writeln('MISSING $name'); exitCode = 1; return; }
    var im = img.decodePng(f.readAsBytesSync())!;
    final size = v[1] as int;
    if (im.width > size) im = img.copyResize(im, width: size, interpolation: img.Interpolation.cubic);
    File('$out$name.png').writeAsBytesSync(img.encodePng(im, level: 9));
    stdout.writeln('$name ${im.width}px');
  });
}
```

- [ ] **Step 2: Run it from the app repo**

Run: `cd "C:/Users/shweth/Documents/GitHub Personal/LensReport" && dart run "C:/Users/shweth/Documents/GitHub Personal/shweth10.github.io/tools/export-art.dart"`
Expected: 27 lines, none MISSING, exit 0.

- [ ] **Step 3: Verify widths and commit**

Run: `ls assets/art | wc -l` → 27. Commit: `git add tools/export-art.dart assets/art && git commit -m "Add app art for the redesign"`.

---

### Task 2: Shared stylesheet and partials

**Files:**
- Create: `assets/site.css`
- Create: `tools/partials.js`

**Interfaces:**
- Produces: `assets/site.css` classes `.c .nav .brand .btn .btn-dark .btn-ghost .kicker .h1 .lede .hero-mint .stickers .stk .feat .ledger .row .pill .chat .bub .plan .move .band .foot`, all as in the approved canvas (direction A + B hero), tokens `--ink --green --green-deep --mint --ground --line`.
- Produces: `tools/partials.js` exporting `{ APP_STORE, head(opts), nav(), storeButtons(), footer(), ledgerMock(), planMock(), stickerRow(), jsonLdOrg() }` where `head({title, desc, canonical, og})` returns the full `<head>` inner HTML (meta, CSP, fonts, `<link rel="stylesheet" href="/assets/site.css">`, apple-itunes-app, icon).

- [ ] **Step 1: Write `assets/site.css`** — port the `.site`, `.a` and `.b` rules from the canvas into un-namespaced selectors, phone-first breakpoints at 900 px and 560 px, `prefers-reduced-motion` guard on the sticker hover.
- [ ] **Step 2: Write `tools/partials.js`** with the strings above; `nav()` links `/#how-it-works`, `/#ask-ai`, `/cheaper-nearby/`, `/support/`.
- [ ] **Step 3: Commit** `git add assets/site.css tools/partials.js && git commit -m "Shared stylesheet and HTML partials"`.

---

### Task 3: Homepage

**Files:**
- Create: `tools/build-home.js` (assembles `index.html` from partials so nav/footer never drift)
- Replace: `index.html`

- [ ] **Step 1: Write `tools/build-home.js`** producing the six spec sections (nav, sticker hero, four features `#how-it-works`, ledger + Ask AI `#ask-ai`, CTA band, footer) with the spec's copy verbatim, plus `SoftwareApplication`, `Organization`, `WebSite` JSON-LD. Title "Expense Tracker AI - LensReport | Log by photo, voice or tap". OG image `/assets/og.png`.
- [ ] **Step 2: Run** `node tools/build-home.js` and check `wc -c index.html` < 60000.
- [ ] **Step 3: Open** `index.html` in the browser at 1280 px and 400 px; fix anything clipped.
- [ ] **Step 4: Commit** `git add tools/build-home.js index.html && git commit -m "Homepage: Expense Tracker AI identity"`.

---

### Task 4: Keyword pages, redirects, sitemap

**Files:**
- Rewrite: `tools/gen-landing.js`
- Create: 9 new `<slug>/index.html`; rewrite 16 old `<slug>/index.html` as stubs
- Rewrite: `sitemap.xml`

- [ ] **Step 1: Rewrite the generator**: `PAGES` = the 9 spec rows, each with `title, desc, h1, lede, bullets[4], mock ('ledger'|'plan'|'stickers'), faq[5], related[2]`. `REDIRECTS` = the spec mapping. `render(p)` uses partials; `stub(from, to)` writes `<meta http-equiv="refresh" content="0; url=/${to}/">` + canonical + `noindex` + link. Sitemap = homepage + 9 + get/support/privacy/terms/delete-account, `lastmod` 2026-09-18.
- [ ] **Step 2: Run twice**: `node tools/gen-landing.js && node tools/gen-landing.js && git status --short | wc -l` — second run produces no new changes.
- [ ] **Step 3: Commit** `git add -A tools/gen-landing.js sitemap.xml */index.html && git commit -m "Keyword pages for the expense tracker; retire the old set with redirects"`.

---

### Task 5: Check script

**Files:**
- Create: `tools/check-site.js`

- [ ] **Step 1: Write it**

```js
// tools/check-site.js — exit 1 on any failure
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
```

- [ ] **Step 2: Run** `node tools/check-site.js` → fix every FAIL line, re-run until "All checks passed".
- [ ] **Step 3: Commit** `git add tools/check-site.js && git commit -m "Site check script"`.

---

### Task 6: Restyle the kept pages

**Files:**
- Modify: `get/index.html`, `support/index.html`, `delete-account/index.html`, `privacy/index.html`, `terms/index.html`, `legal/index.html`, `404.html`

- [ ] **Step 1**: Replace each page's nav and footer with `partials.nav()` / `partials.footer()` output and link `/assets/site.css`; on get/support/delete-account rewrite stale copy (teams, templates, share links, offline) to the ledger vocabulary. Privacy/terms content untouched.
- [ ] **Step 2**: `node tools/check-site.js` passes. Commit `git commit -am "Restyle kept pages with the new nav and footer"`.

---

### Task 7: OG image and old assets

**Files:**
- Create: `assets/og.png` (1200x630) from `tools/og.html`
- Delete: `assets/images/onboarding_0*.png`, `assets/images/app-preview/`, `assets/app-demo.mp4`, `assets/IAVLensreport.mp4`, `assets/BrowserScreenshot.png`, `assets/whos-it-for/`

- [ ] **Step 1**: Write `tools/og.html` (sticker hero at 1200x630, headline + logo), screenshot it with Playwright at exactly 1200x630, save as `assets/og.png`.
- [ ] **Step 2**: `git grep -l "app-preview\|onboarding_0\|whos-it-for\|app-demo"` → only the files being deleted reference them; then delete and commit `git commit -m "New OG image; drop old-identity media"`.

---

### Task 8: Final verification and push

- [ ] `node tools/gen-landing.js && node tools/build-home.js && node tools/check-site.js` all clean, `git status` clean.
- [ ] Browser pass: homepage at 1280 and 400 px, one keyword page, one redirect stub, `/support`.
- [ ] `git push`; verify `https://lensreport.app/` after Pages deploys (1-2 min) and `curl -I https://lensreport.app/receipt-scanner-to-excel/` returns 200 with the stub.
