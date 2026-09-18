# lensreport.app redesign: Expense Tracker AI identity

Date: 2026-09-18. Repo: `shweth10/shweth10.github.io` (GitHub Pages, custom domain lensreport.app).
Design canvas (approved): https://claude.ai/artifact/14qAv885Dzaf2xZvTchnzx. Direction **A (The Ledger)** with **B's sticker grid as the hero**.

## 1. Why

The live site still sells the pre-Phase-81 product: templates, teams, formulas, offline, share links. The app on the App Store is "Expense Tracker AI - LensReport": one personal ledger, log by photo/voice/tap, AI tips, Cheaper Nearby, budgets, subscription renewals. Sixteen SEO landing pages promise features that no longer exist. Goal: a site that matches the app one-to-one, uses the app's own illustration set, and ranks for expense-tracker queries.

Decisions taken with the owner: replace (not keep, not delete) the old keyword pages; **no pricing on the site** (install-focused, every CTA goes to the App Store); the Google Play button stays a non-clickable "Coming soon" until the Play listing is public.

## 2. Homepage

Sections, top to bottom. Copy is final unless marked.

1. **Nav**: logo + "LensReport"; links How it works, Ask AI, Cheaper nearby, Support; right: "Get the app" (App Store).
2. **Hero (from direction B)**: centred. H1 "Every dollar gets a face." Lede: "Snap it, say it or tap it. LensReport turns each expense into a card you'll actually look at, then tells you where to save." CTAs: App Store (black), Google Play (ghost, "Coming soon"). Below: a 6x2 grid of category stickers (coffee, groceries, fuel, streaming, takeaway, pharmacy, rent, electricity, dining, phone, clothing, subscriptions), each a white rounded tile with a small amount tag, alternating +/-2 degree tilt. Caption: "224 hand-drawn categories. Coffee looks like coffee, not a grey circle." Mint (`#E4F4EA`) ground for the hero band only; the rest of the page is white.
3. **Four features (from A)** on the light-grey strip, using the onboarding `feat_*` art: Log it any way / Tips from your spending / Cheaper nearby / Nudges before you overspend. Anchor `#how-it-works`.
4. **Ledger + Ask AI demo (from A)**: left, the Home ledger card (Today, total, four entries with category icons, one tip pill). Right, H2 "Then ask it where the money went.", a user bubble "Where can I cut $150 this month?" and the money-moves plan card. Anchor `#ask-ai`. No separate Cheaper Nearby demo block; the feature tile plus its keyword page cover it.
5. **CTA band**: dark green. "Three free expenses to try it." / "No card. Install, log your next coffee, and see what the AI says." + App Store button + `goal_save_big` art. (Three is `GateService.freeEntryLimit`; update if the app changes it.)
6. **Footer**: Support, Privacy, Terms, Delete account.

Removed from the homepage: the video/screenshot strip, Problem section, Who's-it-for, Collaboration, Sharing, Templates, the QR sticky card, the feature ticker ("offline-capable", "real Excel formulas"). All copy mentioning teams, contributors, templates, formulas, offline, share links or PIN goes.

## 3. Visual system

- Fonts unchanged from the live site so the kept pages restyle cheaply: Plus Jakarta Sans (display), Inter (body), DM Mono (amounts, tags). Google Fonts, preconnected, `display=swap`.
- Tokens: ink `#101913`, green `#22A05C`, green-deep `#0F3D2A`, mint `#E4F4EA`, ground `#F4F7F5`, line `#DCE5DF`, amber tip `#E39A2F` on `#FFF4DF`. Money is a plain `$` everywhere, matching the app.
- Art: copied from the app repo into `assets/art/` as **PNG resized to 2x display size** (heroes at most 480 px, feature icons 160 px, category icons 128 px). Never ship the 1024 px originals. Sources: `assets/expense/heroes/`, `assets/expense/icons/`, `assets/onboarding/`. Transparent PNGs sit directly on the page; the opaque 256 px `tips/` set is not used.
- Motion: none on load. Hover lift on sticker tiles only. `prefers-reduced-motion` respected. No scroll-reveal script.
- Page weight target: homepage HTML under 60 KB, total first load under 600 KB.

## 4. Keyword pages

The old 16 are replaced by 9, generated from `tools/gen-landing.js` (rewritten: new template, new PAGES data; the hand-written exceptions list goes away because every old page is retired).

| Slug | Target query | H1 angle |
|---|---|---|
| `/ai-expense-tracker/` | ai expense tracker app | Hub: log any way + ask AI |
| `/budget-app/` | budget app that notifies you | Daily/weekly/monthly, overspend nudges |
| `/subscription-tracker/` | subscription tracker renewal reminders | Never miss a renewal |
| `/receipt-scanner-app/` | receipt scanner app personal expenses | Catches old receipt traffic, reframed |
| `/voice-expense-tracker/` | voice expense tracker | "Say it, it's logged" |
| `/save-money-app/` | app that tells you how to save money | The money-moves plan |
| `/cheaper-nearby/` | find cheaper coffee near me app | Owns the phrase |
| `/expense-tracker-iphone/` | best expense tracker app iphone | Platform page |
| `/excel-export/` | expense tracker export to excel | The one old promise still true |

Each page: title at most 60 chars, description at most 155, one H1, lede, a feature block with 4 bullets, one app-screen mock built from the same CSS components as the homepage (ledger card, plan card, or sticker row, chosen per page), a 5-question FAQ with `FAQPage` JSON-LD, two related-page links, App Store CTA. Every claim must be true of build 599: no formulas, no teams, no offline.

**Redirects.** Each of the 16 old directories keeps an `index.html` that is a stub: `<meta http-equiv="refresh" content="0; url=/new-slug/">`, `<link rel="canonical" href="https://lensreport.app/new-slug/">`, `<meta name="robots" content="noindex">`, and a plain link. Mapping:

- receipt-scanner-to-excel, free-receipt-scanner-app, receipt-app-for-bookkeepers: `/receipt-scanner-app/`
- scan-documents-to-excel, photo-to-excel, scan-receipts-to-google-sheets: `/excel-export/`
- expense-report-app, self-employed-expense-tracker, 1099-expense-tracker, gst-vat-expense-app, mileage-log-app, invoice-scanner-to-excel, purchase-order-scanner, quote-estimate-app, timesheet-app: `/ai-expense-tracker/`

Old slugs leave the sitemap.

## 5. Site-wide SEO

- Homepage `<title>`: "Expense Tracker AI - LensReport | Log by photo, voice or tap". Description names AI tips, cheaper nearby, budgets, renewals.
- `SoftwareApplication` JSON-LD on the homepage (name, `applicationCategory: FinanceApplication`, `operatingSystem: iOS`, `offers.price: 0`, App Store URL). No `aggregateRating` until real ratings exist.
- `FAQPage` JSON-LD on every keyword page. `Organization` and `WebSite` JSON-LD on the homepage.
- New OG/Twitter image: 1200x630 PNG rendered from the sticker hero (`assets/og.png`). The old `onboarding_0*.png` images are deleted.
- `sitemap.xml` regenerated with the 9 new pages + homepage + get/support/privacy/terms/delete-account. `robots.txt` unchanged. Canonicals on every page. Apple smart-app-banner meta kept. CSP kept as-is (self + Google Fonts).
- Kept: `/get`, `/support`, `/privacy`, `/terms`, `/legal/*`, `/delete-account`, `/s` (share viewer, still used by installed builds), `/.well-known`, `404.html`, the Google verification file. These get the new nav/footer and stale copy fixed; structure untouched.

## 6. Out of scope

Pricing, blog, localisation, App Store screenshot changes, the `/s` viewer's own styling, Play Store listing copy. Analytics stays absent (none today).

## 7. Testing

- `node tools/gen-landing.js` regenerates all 9 pages + sitemap deterministically (run twice, no diff).
- A check script (`tools/check-site.js`) fails on: any page containing the words template(s), team(s), contributor, formula, offline, PIN, share link; missing `<title>`, canonical or description; any `assets/art/*.png` wider than 480 px; any old slug still in `sitemap.xml`.
- Manual: Lighthouse on the homepage at or above 90 performance and SEO on mobile; every homepage link resolves; each redirect stub lands on its target.
