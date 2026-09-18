/* LensReport keyword landing-page generator.
 * Renders the PAGES below from the shared partials (tools/partials.js +
 * assets/site.css), writes a redirect stub for every retired slug in
 * REDIRECTS, and regenerates sitemap.xml.
 * Run: node tools/gen-landing.js   (from repo root; idempotent)
 * Every claim on these pages must be true of the shipped app: one personal
 * expense ledger, log by photo / voice / tap, AI tips, Cheaper Nearby,
 * budgets, subscription renewals. No teams, no report builders, no offline.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const P = require('./partials');

const ROOT = path.resolve(__dirname, '..');
const LASTMOD = '2026-09-18';

const PAGES = [
  {
    slug: 'ai-expense-tracker',
    navTitle: 'AI expense tracker', blurb: 'Log by photo, voice or tap. Ask AI where the money went.',
    title: 'AI Expense Tracker App for iPhone | LensReport',
    desc: 'An AI expense tracker that logs spending by photo, voice or a tap, then answers questions about your own money. Tips, budgets, cheaper options nearby. Free on iPhone.',
    h1: 'The AI expense tracker that talks back',
    lede: 'Log an expense in seconds by photo, voice or a tap. Then ask LensReport where the money went and get a plan built from your own entries, not a guess.',
    featureHeading: 'Built around one question: where did it go?',
    bullets: ['Snap a receipt, say "twelve dollars coffee", or tap it in. AI fills the merchant, amount and category.', 'Ask anything in plain English: "why is this month higher?", "what did I spend at Shell?"', 'Every answer is grounded in your entries. If the data is not there, it says so.', 'Tips start from what you actually logged this week, not generic advice.'],
    mock: 'plan',
    faq: [
      ['What can the AI actually do?', 'It answers questions about your own spending, spots patterns like a takeaway habit or a subscription you stopped using, and turns that into a short plan with real numbers. It never invents a figure: every number comes from an entry you logged.'],
      ['How do I log an expense?', 'Three ways. Point the camera at a receipt and the AI reads it. Hold the microphone and say what you spent. Or tap the amount in on a keypad and pick a category.'],
      ['Does it work for personal spending or business?', 'It is built for personal spending: groceries, coffee, fuel, bills, subscriptions. One ledger, one person.'],
      ['Is my data safe?', 'Emails, phone numbers, card numbers and ID numbers are scrubbed before anything reaches the AI, and receipt images are processed under a zero-data-retention agreement. You can delete your account and all data from Settings at any time.'],
      ['Is it free?', 'You get three free expenses to try it with no card needed. A subscription unlocks unlimited expenses, the AI, budgets and exports.'],
    ],
    ctaTitle: 'Ask your spending a question', ctaText: 'Three free expenses to try it. No card.',
    related: ['save-money-app', 'receipt-scanner-app'],
  },
  {
    slug: 'budget-app',
    navTitle: 'Budget app', blurb: 'A daily, weekly or monthly budget that nudges you before you overspend.',
    title: 'Budget App That Notifies You Before You Overspend | LensReport',
    desc: 'Set a daily, weekly or monthly budget with per-category limits. LensReport nudges you the moment a category runs hot, so you follow the budget instead of reading about it later.',
    h1: 'A budget you actually follow',
    lede: 'Set a total and a few category limits. LensReport watches what you log and sends a nudge the moment takeaway, coffee or fuel runs ahead of plan.',
    featureHeading: 'The budget lives where you spend',
    bullets: ['Daily, weekly or monthly cycles, or a one-time amount that never resets.', 'Envelope limits per category: groceries, coffee, takeaway, whatever you pick.', 'A pacing line that tells you what you can spend per day to stay on track.', 'Notifications when a category crosses its limit, not a report at month end.'],
    mock: 'push',
    faq: [
      ['How do I set a budget?', 'Open the Budget tab, tap the total, choose a cycle (daily, weekly or monthly) and add limits for the categories you care about. Save once; it repeats each cycle.'],
      ['Will it warn me before I go over?', 'Yes. When a category passes its limit you get a notification on your phone right away, with the amount over and a suggestion for a cap.'],
      ['Can I have a one-time budget?', 'Yes. Turn off "repeats" and the budget becomes a single allowance that never resets, useful for a trip or a project.'],
      ['Does the budget need every expense typed in?', 'No. Photo and voice entries count the same as typed ones, and the AI categorises them for you.'],
      ['Is it free?', 'Setting a budget is free. Three free expenses let you try the whole app; a subscription unlocks unlimited expenses.'],
    ],
    ctaTitle: 'Set a budget in under a minute', ctaText: 'Three free expenses to try it. No card.',
    related: ['ai-expense-tracker', 'save-money-app'],
  },
  {
    slug: 'subscription-tracker',
    navTitle: 'Subscription tracker', blurb: 'Every renewal in one place, with a reminder before it bills.',
    title: 'Subscription Tracker With Renewal Reminders | LensReport',
    desc: 'Track every subscription and bill in one place. LensReport reminds you before each renewal, shows what repeats cost per month and per year, and flags plans you stopped using.',
    h1: 'Never miss a renewal again',
    lede: 'Streaming, phone, gym, insurance: add each one once and LensReport reminds you before it bills, shows what your repeats cost per year, and asks whether you still use them.',
    featureHeading: 'Repeats, in one list',
    bullets: ['Pick a provider from the grid or type your own; set the amount and the billing cycle.', 'A reminder notification before each renewal date.', 'Monthly and yearly totals for everything that repeats, and its share of your spend.', '"Still using Disney+?" when nothing has been logged against a plan for weeks.'],
    mock: 'push',
    faq: [
      ['Which subscriptions can I track?', 'Any. Streaming, music, phone and internet, gym, insurance, software, rent. Pick from the provider grid or add your own name and amount.'],
      ['When does the reminder arrive?', 'Before the renewal date, as a notification on your phone, so you can cancel or top up first.'],
      ['Does it detect subscriptions automatically?', 'Add each one once; LensReport does not read your bank account. The AI will point out a plan that looks unused from your logged spending.'],
      ['Can I see what all my subscriptions cost per year?', 'Yes. The Subscriptions screen totals what repeats per month and per year and shows the share of this month’s spend that is subscriptions.'],
      ['Is it free?', 'Three free expenses let you try the whole app; a subscription to LensReport unlocks unlimited entries.'],
    ],
    ctaTitle: 'Add your first subscription', ctaText: 'Three free expenses to try it. No card.',
    related: ['budget-app', 'ai-expense-tracker'],
  },
  {
    slug: 'receipt-scanner-app',
    navTitle: 'Receipt scanner app', blurb: 'Point the camera at a receipt; AI reads the merchant, amount and category.',
    title: 'Receipt Scanner App for Personal Expenses | LensReport',
    desc: 'Scan a receipt and LensReport reads the merchant, total and category into your expense ledger. No typing. AI tips and cheaper options nearby afterwards. Free on iPhone.',
    h1: 'Scan the receipt, skip the typing',
    lede: 'Point your camera at any receipt. LensReport reads the merchant, the total and the category, drops it into your ledger, and keeps the photo with the entry.',
    featureHeading: 'A scanner that knows what it is looking at',
    bullets: ['Merchant, date, total and category read from the receipt by AI.', 'Multi-item receipts roll up into one clean entry with the items listed.', 'The photo stays attached, so you can check the original any time.', 'Every scanned expense gets a hand-drawn category icon, so the list is readable at a glance.'],
    mock: 'ledger',
    faq: [
      ['What receipts can it read?', 'Café, supermarket, fuel, pharmacy, restaurant and retail receipts, printed or on a screen. Faded thermal paper works better than you would expect; a torn total is the usual failure.'],
      ['What if it reads something wrong?', 'Tap the entry and fix the field. Your correction wins, and the photo stays attached so you can check.'],
      ['Can I add a receipt to an expense I typed earlier?', 'Yes. Open the entry and attach a photo from the camera or your library.'],
      ['Does scanning use my data allowance?', 'The receipt image is uploaded once, read, and processed under a zero-data-retention agreement. Personal details like card numbers are scrubbed first.'],
      ['Is it free?', 'Three free expenses to try it, scanned or typed. A subscription unlocks unlimited scanning.'],
    ],
    ctaTitle: 'Scan your next receipt', ctaText: 'Three free expenses to try it. No card.',
    related: ['voice-expense-tracker', 'ai-expense-tracker'],
  },
  {
    slug: 'voice-expense-tracker',
    navTitle: 'Voice expense tracker', blurb: 'Say what you spent. The entry is logged and categorised.',
    title: 'Voice Expense Tracker: Say It, It’s Logged | LensReport',
    desc: 'Log an expense by voice. Hold the mic, say "twelve dollars coffee at Blue Door", check the transcript and submit. LensReport fills the merchant, amount and category.',
    h1: 'Say it, and it’s logged',
    lede: 'Hold the microphone, say what you spent, check the words on screen and submit. LensReport turns the sentence into a categorised entry with the amount and merchant filled in.',
    featureHeading: 'Fastest way to log a coffee',
    bullets: ['Hold to talk, release to review. Nothing is sent until you tap submit.', 'Works in the language your phone is set to; the app ships in 12.', 'The AI picks the category and merchant from the sentence.', 'Wrong word? Edit the transcript before it goes anywhere.'],
    mock: 'ledger',
    faq: [
      ['What do I say?', 'Anything natural: "eighteen fifty lunch at the food court", "fuel sixty four dollars Shell". The AI reads the amount, the place and the category from it.'],
      ['Does it send my voice anywhere?', 'No. Your phone turns the speech into text on the device. Only the text you approve is sent, and it is scrubbed of personal details first.'],
      ['Can I fix a mis-heard word?', 'Yes. The transcript is editable before you submit, and the saved entry can be edited afterwards too.'],
      ['Does voice work without a connection?', 'No. LensReport needs a connection to turn the sentence into an entry.'],
      ['Is it free?', 'Three free expenses to try it, by voice, photo or typing. A subscription unlocks unlimited entries.'],
    ],
    ctaTitle: 'Log your next expense out loud', ctaText: 'Three free expenses to try it. No card.',
    related: ['receipt-scanner-app', 'ai-expense-tracker'],
  },
  {
    slug: 'save-money-app',
    navTitle: 'Save money app', blurb: 'Ask where you can cut $150 and get a plan built from your own spending.',
    title: 'App That Tells You How to Save Money | LensReport',
    desc: 'Ask LensReport where you can save and get a plan with real numbers from your own spending: cook two more dinners, brew weekday coffee, pause one streaming plan.',
    h1: 'Ask it how to save $150 this month',
    lede: 'Generic saving tips do not know you. LensReport reads your own entries, finds the two or three habits that add up, and shows what each is worth per month.',
    featureHeading: 'A plan, not a lecture',
    bullets: ['"Where can I cut $150?" returns two or three money moves with a monthly figure on each.', 'Pick a spend area (eating out, groceries, subscriptions) and get tips for just that one.', 'A daily tip on the Home screen that starts with what you logged yesterday.', 'Cheaper options near you when you overpay for a coffee or a lunch.'],
    mock: 'plan',
    faq: [
      ['Where do the numbers come from?', 'From your entries. If the plan says weekday coffees cost $58 a month, that is the sum of the coffees you logged. The AI writes the sentence; it does not make up the figure.'],
      ['What if I have barely logged anything?', 'You get tips for the spend areas you choose and an honest note that there is not enough data yet, instead of a made-up plan.'],
      ['Does it judge my spending?', 'No. The tips are about patterns, never about whether a purchase was a good idea.'],
      ['Can it set the budget for me?', 'When a move suggests a cap, one tap opens the budget with that limit filled in.'],
      ['Is it free?', 'Three free expenses to try it. A subscription unlocks unlimited entries and the AI.'],
    ],
    ctaTitle: 'See your first money moves', ctaText: 'Three free expenses to try it. No card.',
    related: ['ai-expense-tracker', 'cheaper-nearby'],
  },
  {
    slug: 'cheaper-nearby',
    navTitle: 'Cheaper nearby', blurb: 'Paid $12 for a flat white? See well-rated spots close by that run lower.',
    title: 'Find Cheaper Coffee, Lunch and Fuel Near You | LensReport',
    desc: 'Log a coffee, lunch, groceries or fuel and LensReport shows well-rated places nearby that usually cost less, with distance and ratings from Google. Prices are labelled estimates.',
    h1: 'Cheaper nearby, right after you pay',
    lede: 'Log a $12 flat white and LensReport looks around your suburb for well-rated cafés that usually charge less. Real places, real ratings and distance, with the price clearly marked as an estimate.',
    featureHeading: 'Only where a cheaper option is a fair claim',
    bullets: ['Coffee, takeaway, dining, groceries, fuel, pharmacy and personal care, from $5 up.', 'Ratings, review counts and distance come from Google Places.', 'Prices are AI estimates and are labelled that way every time; nothing is padded to fill a list.', 'You type your suburb once. LensReport never tracks your location.'],
    mock: 'stickers',
    faq: [
      ['Does it track my location?', 'No. You type the suburb or area you spend in, once. No GPS, nothing stored about where you are.'],
      ['Are the prices real?', 'The places, ratings and distances are real and come from Google. Prices are estimates from the type of place and its price level, and the app says so on every result.'],
      ['Why did nothing show up for my coffee?', 'When fewer than two well-rated places nearby are likely to be cheaper, LensReport says so rather than listing something it cannot stand behind.'],
      ['Which expenses trigger it?', 'Coffee, takeaway, dining, groceries, fuel, pharmacy and personal care, when the amount is $5 or more.'],
      ['Is it free?', 'Three free expenses to try it. A subscription unlocks unlimited lookups.'],
    ],
    ctaTitle: 'Find a cheaper coffee', ctaText: 'Three free expenses to try it. No card.',
    related: ['save-money-app', 'ai-expense-tracker'],
  },
  {
    slug: 'expense-tracker-iphone',
    navTitle: 'Expense tracker for iPhone', blurb: 'Built for iPhone: camera, voice, notifications and the App Store.',
    title: 'Expense Tracker App for iPhone with AI | LensReport',
    desc: 'LensReport is an expense tracker made for iPhone: scan receipts with the camera, log by voice, get budget nudges as notifications, and ask AI about your spending. Free on the App Store.',
    h1: 'The expense tracker made for iPhone',
    lede: 'Camera for receipts, microphone for voice entries, notifications for budget nudges and renewals, and an AI you can ask about your own money. Download it from the App Store and log your first expense in a minute.',
    featureHeading: 'Uses the phone you already have',
    bullets: ['Receipt scanning with the iPhone camera, voice entry with the microphone.', 'Budget and renewal nudges arrive as normal iOS notifications.', 'Sign in with Apple or Google; delete your account from Settings whenever you like.', 'Android is on the way: a Google Play release is in testing.'],
    mock: 'ledger',
    faq: [
      ['Which iPhones does it support?', 'Any iPhone running iOS 15.5 or later. The app is on the App Store now.'],
      ['Is there an Android version?', 'A Google Play version is in closed testing. The button on this site will go live when it is public.'],
      ['Does it sync between devices?', 'Sign in with the same account and your ledger is there. A subscription keeps everything backed up in the cloud.'],
      ['Can I export my data?', 'Yes. Export your ledger to Excel or PDF from Settings; a subscription is required for exports.'],
      ['Is it free?', 'Three free expenses to try it with no card. A subscription unlocks unlimited entries, the AI, budgets and exports.'],
    ],
    ctaTitle: 'Get LensReport on your iPhone', ctaText: 'Three free expenses to try it. No card.',
    related: ['ai-expense-tracker', 'receipt-scanner-app'],
  },
  {
    slug: 'excel-export',
    navTitle: 'Export expenses to Excel', blurb: 'Your ledger as a clean .xlsx or PDF, whenever you need it.',
    title: 'Expense Tracker That Exports to Excel and PDF | LensReport',
    desc: 'Log expenses by photo, voice or tap, then export the ledger to Excel or PDF from Settings. Categories, merchants, dates and amounts in clean columns, ready for your accountant.',
    h1: 'Your expenses, exported to Excel',
    lede: 'Everything you log lives in one ledger. When you need it somewhere else, export it as an Excel workbook or a PDF: one row per expense, with date, merchant, category and amount.',
    featureHeading: 'Clean columns, no cleanup',
    bullets: ['Excel (.xlsx) and PDF exports from Settings.', 'Date, merchant, category, amount and notes in their own columns.', 'Opens in Excel, Numbers and Google Sheets.', 'Export as often as you like on a subscription.'],
    mock: 'ledger',
    faq: [
      ['What is in the export?', 'Every expense in the ledger, one per row: date, merchant, description, category, amount, payment method and notes.'],
      ['Can I export just one month?', 'The export covers the whole ledger; filter by date in Excel or Sheets once it is open.'],
      ['Does it open in Google Sheets?', 'Yes. The .xlsx file opens in Excel, Apple Numbers and Google Sheets.'],
      ['Is export free?', 'Exports need a subscription. Logging your three free expenses does not.'],
      ['Can my accountant use it?', 'Yes. The columns are plain values, so an accountant or bookkeeper can sort, filter and total them however they like.'],
    ],
    ctaTitle: 'Log it once, export it anywhere', ctaText: 'Three free expenses to try it. No card.',
    related: ['ai-expense-tracker', 'expense-tracker-iphone'],
  },
];

/** Retired slugs and where they now point. */
const REDIRECTS = {
  'receipt-scanner-to-excel': 'receipt-scanner-app',
  'free-receipt-scanner-app': 'receipt-scanner-app',
  'receipt-app-for-bookkeepers': 'receipt-scanner-app',
  'scan-documents-to-excel': 'excel-export',
  'photo-to-excel': 'excel-export',
  'scan-receipts-to-google-sheets': 'excel-export',
  'expense-report-app': 'ai-expense-tracker',
  'self-employed-expense-tracker': 'ai-expense-tracker',
  '1099-expense-tracker': 'ai-expense-tracker',
  'gst-vat-expense-app': 'ai-expense-tracker',
  'mileage-log-app': 'ai-expense-tracker',
  'invoice-scanner-to-excel': 'ai-expense-tracker',
  'purchase-order-scanner': 'ai-expense-tracker',
  'quote-estimate-app': 'ai-expense-tracker',
  'timesheet-app': 'ai-expense-tracker',
};

const BY_SLUG = Object.fromEntries(PAGES.map((p) => [p.slug, p]));

function mockHtml(kind, p) {
  switch (kind) {
    case 'ledger': return P.ledgerMock();
    case 'plan': return P.planMock();
    case 'stickers': return P.stickerRow(6);
    case 'push':
      return p.slug === 'subscription-tracker'
        ? P.pushMock('Disney+ renews tomorrow', '$15.99 on Friday. Still using it? Nothing logged in three weeks.', 'hero_bills')
        : P.pushMock('Takeaway is $18 over budget', 'Two Uber Eats orders this week. Want a cap for takeaway?', 'hero_on_track');
    default: throw new Error('unknown mock ' + kind);
  }
}

function relatedHtml(p) {
  return `<div class="related">
${p.related.map((s) => { const r = BY_SLUG[s]; return `  <a href="/${s}/"><b>${r.navTitle}</b><span>${r.blurb}</span></a>`; }).join('\n')}
</div>`;
}

function faqHtml(p) {
  return `<div class="faq">
${p.faq.map(([q, a]) => `  <details><summary>${q}</summary><p>${a}</p></details>`).join('\n')}
</div>`;
}

function render(p) {
  const canonical = `${P.SITE}/${p.slug}/`;
  const body = `
<header class="hero-mint hero-left">
  <div class="c demo">
    <div>
      <div class="kicker">Expense Tracker AI</div>
      <h1 class="h1">${p.h1}</h1>
      <p class="lede">${p.lede}</p>
      ${P.storeButtons()}
    </div>
    <div class="mock">${mockHtml(p.mock, p)}</div>
  </div>
</header>

<section class="c page">
  <div class="prose">
    <h2 class="first">${p.featureHeading}</h2>
    <ul class="bullets">
${p.bullets.map((b) => `      <li>${b}</li>`).join('\n')}
    </ul>
  </div>

  <div class="prose"><h2>Questions people ask</h2></div>
  ${faqHtml(p)}

  <div class="prose"><h2>Related</h2></div>
  ${relatedHtml(p)}
</section>

<section class="c">
  <div class="band">
    <div><h2>${p.ctaTitle}</h2><p>${p.ctaText}</p></div>
    <img src="/assets/art/goal_save_big.png" alt="" width="150" height="150">
    ${P.storeButton('btn-white')}
  </div>
</section>
`;
  return P.page({ headOpts: { title: p.title, desc: p.desc, canonical, extraHead: `${P.jsonLdFaq(p.faq)}\n` }, body });
}

function stub(from, to) {
  const target = `${P.SITE}/${to}/`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url=/${to}/">
  <link rel="canonical" href="${target}">
  <title>Moved</title>
</head>
<body>
  <p>This page has moved to <a href="/${to}/">${target}</a>.</p>
</body>
</html>
`;
}

// ---- write ----
for (const p of PAGES) {
  const dir = path.join(ROOT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(p), 'utf8');
}
for (const [from, to] of Object.entries(REDIRECTS)) {
  if (!BY_SLUG[to]) throw new Error(`redirect target ${to} is not a page`);
  const dir = path.join(ROOT, from);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), stub(from, to), 'utf8');
}

const KEEP = ['get', 'support', 'privacy', 'terms', 'delete-account'];
const urls = ['', ...PAGES.map((p) => p.slug + '/'), ...KEEP.map((k) => k + '/')];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${P.SITE}/${u}</loc><lastmod>${LASTMOD}</lastmod><changefreq>${u === '' ? 'weekly' : 'monthly'}</changefreq><priority>${u === '' ? '1.0' : KEEP.includes(u.replace('/', '')) ? '0.3' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log(`wrote ${PAGES.length} pages, ${Object.keys(REDIRECTS).length} redirects, sitemap with ${urls.length} urls`);
