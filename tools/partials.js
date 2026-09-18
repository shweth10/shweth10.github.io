/* Shared HTML partials for lensreport.app. Used by tools/build-home.js and
 * tools/gen-landing.js so nav, footer, buttons and app-screen mocks are
 * defined exactly once. Plain Node, no dependencies. */
'use strict';

const APP_STORE = 'https://apps.apple.com/us/app/scan-to-excel-ai-lensreport/id6760954658';
const SITE = 'https://lensreport.app';
const FONTS = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap';
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:;";

const APPLE_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.4 2-3.6 2-3.7-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.1-2.8.9-3.6.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.3 1.2 9.6.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.1.8c1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.6-3.8zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z"/></svg>';

/** Full <head> inner HTML. opts: {title, desc, canonical, og?, extraHead?} */
function head({ title, desc, canonical, og = '/assets/og.png', extraHead = '' }) {
  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:site_name" content="LensReport">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE}${og}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${SITE}${og}">
  <meta name="theme-color" content="#22A05C">
  <meta name="apple-itunes-app" content="app-id=6760954658">
  <link rel="icon" href="/assets/images/app-logo.png" type="image/png">
  <link rel="apple-touch-icon" href="/assets/images/app-icon.png">
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="/assets/site.css">
${extraHead}`;
}

function storeButton(cls = 'btn-dark') {
  return `<a class="btn ${cls}" href="${APP_STORE}" target="_blank" rel="noopener noreferrer" aria-label="Download LensReport on the App Store">${APPLE_SVG}<span><small>Download on the</small><b>App Store</b></span></a>`;
}
function playSoon() {
  return `<span class="btn btn-soon" aria-label="Google Play, coming soon"><span><small>Coming soon on</small><b>Google Play</b></span></span>`;
}
function storeButtons() {
  return `<div class="cta-row">${storeButton()}${playSoon()}</div>`;
}

function nav() {
  return `<nav class="nav" aria-label="Main">
  <a class="brand" href="/"><img src="/assets/art/logo.png" alt="" width="30" height="30">Lens<b>Report</b></a>
  <ul>
    <li><a href="/#how-it-works">How it works</a></li>
    <li><a href="/#ask-ai">Ask AI</a></li>
    <li><a href="/cheaper-nearby/">Cheaper nearby</a></li>
    <li><a href="/support/">Support</a></li>
  </ul>
  <a class="btn btn-dark" href="${APP_STORE}" target="_blank" rel="noopener noreferrer">${APPLE_SVG}Get the app</a>
</nav>`;
}

function footer() {
  return `<footer class="foot">
  <span>© 2026 LensReport · Expense Tracker AI</span>
  <ul>
    <li><a href="/ai-expense-tracker/">Expense tracker</a></li>
    <li><a href="/support/">Support</a></li>
    <li><a href="/privacy/">Privacy</a></li>
    <li><a href="/terms/">Terms</a></li>
    <li><a href="/delete-account/">Delete account</a></li>
  </ul>
</footer>`;
}

function cat(slug) { return `/assets/art/cat_${slug}.png`; }

/** The Home ledger card. */
function ledgerMock() {
  return `<div class="ledger" aria-label="Example of the LensReport Home screen">
  <div class="day"><b>Today</b><span>Thu 18 Sep</span></div>
  <div class="tot">$194.50<small>$612 left this month</small></div>
  <div class="row"><div class="ic"><img src="${cat('coffee')}" alt="" width="30" height="30"></div><div class="t"><b>Blue Door Café</b><span>Flat white · Coffee</span></div><div class="amt">$12.00</div></div>
  <div class="row"><div class="ic"><img src="${cat('groceries')}" alt="" width="30" height="30"></div><div class="t"><b>FreshMart</b><span>Weekly shop · Groceries</span></div><div class="amt">$86.40</div></div>
  <div class="row"><div class="ic"><img src="${cat('fuel')}" alt="" width="30" height="30"></div><div class="t"><b>Shell</b><span>Fuel</span></div><div class="amt">$64.20</div></div>
  <div class="row"><div class="ic"><img src="${cat('takeaway')}" alt="" width="30" height="30"></div><div class="t"><b>Uber Eats</b><span>Thai Basil · Takeaway</span></div><div class="amt">$31.90</div></div>
  <div class="row tip"><span class="pill">Because you logged coffee · Brew weekday coffee at home</span></div>
</div>`;
}

/** The Ask AI money-moves plan, with the user's question above it. */
function planMock(question = 'Where can I cut $150 this month?') {
  return `<div class="chat" aria-label="Example of asking the AI">
  <div class="bub me">${question}</div>
  <div class="plan">
    <h4><b>$162 a month</b> is within reach, from three habits</h4>
    <div class="move"><img src="${cat('takeaway')}" alt="" width="28" height="28"><span>Cook two more dinners a week</span><em>+$74/mo</em></div>
    <div class="move"><img src="${cat('coffee')}" alt="" width="28" height="28"><span>Brew weekday coffee at home</span><em>+$58/mo</em></div>
    <div class="move"><img src="${cat('streaming')}" alt="" width="28" height="28"><span>Pause one streaming plan</span><em>+$30/mo</em></div>
  </div>
</div>`;
}

const STICKERS = [
  ['coffee', '$12.00'], ['groceries', '$86.40'], ['fuel', '$64.20'], ['streaming', '$15.99'],
  ['takeaway', '$31.90'], ['pharmacy', '$24.50'], ['rent', '$1,450'], ['electricity', '$118'],
  ['dining', '$58.00'], ['phone', '$49.00'], ['clothing', '$89.95'], ['subs', '$22.99'],
];
/** The category sticker grid. n = how many tiles (12 on the homepage, 6 on keyword pages). */
function stickerRow(n = 12) {
  return `<div class="stickers" aria-label="Expense categories, each with its own illustration">
${STICKERS.slice(0, n).map(([s, amt]) => `  <div class="stk"><img src="${cat(s)}" alt="${s}" width="64" height="64"><em>${amt}</em></div>`).join('\n')}
</div>`;
}

/** A push-notification banner mock, seated over a character illustration when art is given. */
function pushMock(title, body, art) {
  const banner = `<div class="push" aria-label="Example notification"><img src="/assets/art/logo.png" alt="" width="34" height="34"><div><b>${title}</b><span>${body}</span></div><i>now</i></div>`;
  if (!art) return banner;
  return `<div class="art-push"><img src="/assets/art/${art}.png" alt="" width="300" height="300">${banner}</div>`;
}

function jsonLdOrg() {
  return `<script type="application/ld+json">
${JSON.stringify([
  { '@context': 'https://schema.org', '@type': 'Organization', name: 'LensReport', url: SITE, logo: `${SITE}/assets/images/app-icon.png`, email: 'info@lensreport.app' },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'LensReport', url: SITE },
], null, 1)}
</script>`;
}

function jsonLdApp() {
  return `<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'SoftwareApplication',
  name: 'Expense Tracker AI - LensReport', operatingSystem: 'iOS', applicationCategory: 'FinanceApplication',
  description: 'Log expenses by photo, voice or a tap. AI tips from your spending, cheaper options nearby, budgets that nudge you, and renewal reminders.',
  url: SITE, installUrl: APP_STORE, image: `${SITE}/assets/og.png`,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Organization', name: 'LensReport' },
}, null, 1)}
</script>`;
}

function jsonLdFaq(faq) {
  return `<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}, null, 1)}
</script>`;
}

/** Wraps a page: doctype, head, body with nav and footer. */
function page({ headOpts, body, bodyClass = '' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
${head(headOpts)}</head>
<body class="${bodyClass}">
<div class="c">${nav()}</div>
${body}
<div class="c">${footer()}</div>
</body>
</html>
`;
}

module.exports = { APP_STORE, SITE, head, nav, footer, storeButton, playSoon, storeButtons, ledgerMock, planMock, stickerRow, pushMock, jsonLdOrg, jsonLdApp, jsonLdFaq, page, cat };
