/* Builds the kept utility pages from the shared partials and patches the two
 * legal pages (privacy, terms) with the new head, nav and footer while leaving
 * their legal text untouched. Run: node tools/build-pages.js   (idempotent) */
'use strict';
const fs = require('fs');
const path = require('path');
const P = require('./partials');
const ROOT = path.resolve(__dirname, '..');
const write = (rel, html) => fs.writeFileSync(path.join(ROOT, rel), html, 'utf8');

/* ---------- /get ---------- */
write('get/index.html', P.page({
  headOpts: {
    title: 'Get LensReport | Expense Tracker AI',
    desc: 'Download LensReport, the AI expense tracker, on the App Store. Log expenses by photo, voice or a tap. Three free expenses, no card.',
    canonical: `${P.SITE}/get/`,
    extraHead: `  <script>
    (function () {
      var APP_STORE = "${P.APP_STORE}";
      var ua = navigator.userAgent || navigator.vendor || "";
      var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      var forced = (location.search.match(/[?&]store=([^&]+)/) || [])[1];
      if (forced === "ios" || isIOS) { location.replace(APP_STORE); }
      // Android: the Google Play listing is still in closed testing, so fall through to the page.
    })();
  </script>
`,
  },
  body: `
<section class="hero-mint">
  <div class="c" style="max-width:640px">
    <img src="/assets/art/logo.png" alt="" width="72" height="72" style="margin:0 auto 18px;border-radius:18px">
    <h1 class="h1" style="font-size:44px">Get LensReport</h1>
    <p class="lede">The AI expense tracker. Log by photo, voice or a tap, then ask where the money went. Three free expenses, no card.</p>
    ${P.storeButtons()}
    <p class="caption">On an iPhone? You will be taken straight to the App Store.</p>
  </div>
</section>
<section class="c" style="padding-block:48px">
  <div class="feat">
    <div><img src="/assets/art/feat_log.png" alt="" width="64" height="64"><h3>Log it any way</h3><p>Snap the receipt, say it out loud, or tap it in.</p></div>
    <div><img src="/assets/art/feat_tips.png" alt="" width="64" height="64"><h3>Tips from your spending</h3><p>A tip that starts with what you actually logged.</p></div>
    <div><img src="/assets/art/feat_nearby.png" alt="" width="64" height="64"><h3>Cheaper nearby</h3><p>Well-rated spots close by that usually cost less.</p></div>
    <div><img src="/assets/art/feat_nudge.png" alt="" width="64" height="64"><h3>Nudges before you overspend</h3><p>A budget with a heads-up when a category runs hot.</p></div>
  </div>
</section>
`,
}));

/* ---------- /support ---------- */
const supportBody = `
<section class="c page">
  <div class="prose">
    <div class="kicker">Support</div>
    <h1 class="h1">Help with LensReport</h1>
    <p class="lede">Answers to the common questions, and how to reach us when they do not cover yours.</p>

    <h2 id="contact">Contact us</h2>
    <p>Email <a href="mailto:info@lensreport.app?subject=LensReport%20support%20request">info@lensreport.app</a>. We aim to acknowledge every request within 2 business days and resolve most within 5. Please include your device and iOS version, the app version shown at the bottom of Settings, and what you were trying to do. Please do not email receipt photos; they often contain card or personal details and we can usually help without them.</p>

    <h2 id="logging">Logging expenses</h2>
    <h3>How do I add an expense?</h3>
    <p>Tap the plus button on Home. Scan a receipt with the camera, hold the microphone and say what you spent, upload a photo from your library, or type it in. The AI fills in the merchant, amount and category; tap the entry afterwards to change anything.</p>
    <h3>The AI read my receipt wrong.</h3>
    <p>Tap the entry and correct the field. Your correction always wins, and the photo stays attached so you can check the original.</p>
    <h3>Why did my entry not save?</h3>
    <p>LensReport needs a connection to read receipts and voice entries. If you had no connection, or the app showed the reconnecting screen, try again once you are back online.</p>
    <h3>Voice entry did not hear me.</h3>
    <p>Voice uses your phone’s own speech recognition in the language your phone is set to. Check that LensReport has microphone and speech permission in iOS Settings, then hold the microphone button while you speak and release to review the text before submitting.</p>

    <h2 id="ai">Ask AI, tips and Cheaper Nearby</h2>
    <h3>Where do the AI’s numbers come from?</h3>
    <p>From your own entries. The AI writes the sentence; every figure in it is a sum of things you logged. When there is not enough data to answer, it says so.</p>
    <h3>How many questions can I ask?</h3>
    <p>Every account has a daily allowance of questions; the counter in the AI sheet shows what is left today and resets at midnight UTC.</p>
    <h3>Does Cheaper Nearby track my location?</h3>
    <p>No. You type your suburb once. Places, ratings and distances come from Google; prices are estimates and are labelled that way on every result.</p>

    <h2 id="budget">Budgets, subscriptions and notifications</h2>
    <h3>How do I set a budget?</h3>
    <p>Open the Budget tab, tap the total, pick daily, weekly or monthly, add any category limits and save. Turn off “repeats” for a one-time allowance.</p>
    <h3>I am not getting notifications.</h3>
    <p>Check iOS Settings → Notifications → LensReport is allowed, then in the app open Settings → Notifications and make sure Spending updates and Saving tips are on. The evening wrap only arrives on days with spending.</p>
    <h3>How do subscription reminders work?</h3>
    <p>Add each subscription once in Settings → Subscriptions &amp; bills with its amount and cycle. You get a reminder before each renewal date.</p>

    <h2 id="billing">Billing</h2>
    <h3>How do I subscribe or restore a purchase?</h3>
    <p>Tap the crown in the app bar or Settings → Upgrade, and confirm through the App Store. If you already subscribed on another device, open Settings → Manage subscription → Restore purchases while signed in with the same Apple ID.</p>
    <h3>How do I cancel?</h3>
    <p>Subscriptions are billed by Apple. On your iPhone open Settings → your name → Subscriptions → LensReport → Cancel. You keep access until the end of the current period, and cancelling does not delete your account.</p>
    <h3>How do I get a refund?</h3>
    <p>Refunds are handled by Apple at <a href="https://reportaproblem.apple.com/" target="_blank" rel="noopener">reportaproblem.apple.com</a>. If Apple approves it, your access is updated automatically.</p>
    <h3>What is free?</h3>
    <p>Three expenses for the life of the account, plus viewing your ledger and setting a budget. A subscription unlocks unlimited expenses, the AI, Cheaper Nearby and exports.</p>

    <h2 id="account">Account and data</h2>
    <h3>I can’t sign in.</h3>
    <p>Sign in with the same provider you signed up with; using the same email through a different provider creates a new, empty account. If you signed in with Apple and chose Hide My Email, your account is under a relay address, which is fine. Deleted accounts cannot be recovered.</p>
    <h3>How do I export my data?</h3>
    <p>Settings → Your data → Export gives you an Excel or PDF of your ledger (subscription required). A full copy of your account data is available under Settings → Export my data.</p>
    <h3>How do I delete my account?</h3>
    <p>Settings → Delete Account, or follow the steps on the <a href="/delete-account/">delete account page</a>. Deleting your account does not cancel an active subscription; cancel that with Apple as described above.</p>

    <h2 id="privacy">Privacy</h2>
    <p>Personal details such as emails, phone numbers, card numbers and ID numbers are scrubbed before anything reaches the AI, and receipt images are processed under a zero-data-retention agreement. The full detail is in the <a href="/privacy/">privacy policy</a>.</p>
  </div>
</section>
`;
write('support/index.html', P.page({
  headOpts: {
    title: 'LensReport Support | Help and FAQ',
    desc: 'Help with LensReport, the AI expense tracker: logging expenses, the AI, budgets, subscriptions, billing, sign-in and deleting your account. Contact info@lensreport.app.',
    canonical: `${P.SITE}/support/`,
  },
  body: supportBody,
}));

/* ---------- /delete-account ---------- */
write('delete-account/index.html', P.page({
  headOpts: {
    title: 'Delete Your LensReport Account',
    desc: 'How to permanently delete your LensReport account and data, in the app or by email, and what is removed.',
    canonical: `${P.SITE}/delete-account/`,
  },
  body: `
<section class="c page">
  <div class="prose">
    <div class="kicker">Account</div>
    <h1 class="h1">Delete your LensReport account</h1>
    <p class="lede">You can delete your account and everything in it at any time. This page explains how, what is removed, and the little that is kept.</p>

    <h2>Before you delete</h2>
    <p>Deletion is permanent and cannot be undone. If you want a copy of your ledger first, open Settings → Your data → Export in the app.</p>

    <h2>In the app (fastest)</h2>
    <ol>
      <li>Open LensReport and make sure you are signed in to the account you want to delete.</li>
      <li>Go to Settings → Delete Account.</li>
      <li>Confirm the two-step prompt. You will be asked to sign in again first.</li>
      <li>Your account and data are then permanently removed.</li>
    </ol>

    <h2>By email</h2>
    <p>If you cannot open the app, email <a href="mailto:info@lensreport.app?subject=Delete%20my%20LensReport%20account">info@lensreport.app</a> with the subject “Delete my account” from the address on the account, or tell us which sign-in provider you used. We verify that you own the account, acknowledge within 5 business days and complete deletion within 30 days, usually much sooner.</p>

    <h2>What is deleted</h2>
    <ul>
      <li>Your profile: email, display name and subscription state.</li>
      <li>Your ledger: every expense, its category and any notes.</li>
      <li>Every receipt photo attached to an expense.</li>
      <li>Your budgets and subscription reminders.</li>
      <li>Your AI conversation history, cached answers, usage records and feedback.</li>
    </ul>

    <h2>What is kept</h2>
    <p><strong>Your subscription is not cancelled by deleting your account.</strong> Subscriptions are billed by Apple, so cancel there to stop future charges: iPhone Settings → your name → Subscriptions → LensReport → Cancel. Apple keeps its own purchase records under its own policy.</p>
    <p>For fraud prevention we keep a non-reversible hash of your sign-in identity for up to 30 days after deletion. It contains no personal data and stops a deleted account from claiming the free allowance again immediately. A minimal security audit log with no expense content is also retained, as described in the <a href="/privacy/">privacy policy</a>.</p>

    <h2>Questions</h2>
    <p>Email <a href="mailto:info@lensreport.app?subject=Account%20deletion%20help">info@lensreport.app</a>. See also the <a href="/privacy/">privacy policy</a> and <a href="/support/">support</a>.</p>
  </div>
</section>
`,
}));

/* ---------- /legal ---------- */
write('legal/index.html', P.page({
  headOpts: { title: 'LensReport Legal', desc: 'Privacy policy and terms of service for LensReport.', canonical: `${P.SITE}/legal/` },
  body: `
<section class="c page">
  <div class="prose">
    <h1 class="h1">Legal</h1>
    <ul style="margin-top:20px">
      <li><a href="/privacy/">Privacy policy</a></li>
      <li><a href="/terms/">Terms of service</a></li>
      <li><a href="/delete-account/">Delete your account</a></li>
    </ul>
  </div>
</section>
`,
}));

/* ---------- 404 (keeps the /s/{token} share-viewer redirect) ---------- */
write('404.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <script>
    // GitHub Pages SPA redirect for /s/{token} share links
    var path = window.location.pathname;
    if (path.startsWith('/s/') && path.length > 3) {
      sessionStorage.setItem('shareRedirect', path);
      window.location.replace('/s/');
    }
  </script>
${P.head({ title: 'Page not found | LensReport', desc: 'That page does not exist.', canonical: `${P.SITE}/` })}</head>
<body>
<div class="c">${P.nav()}</div>
<section class="hero-mint">
  <div class="c" style="max-width:560px">
    <img src="/assets/art/hero_receipt_pile.png" alt="" width="220" height="220" style="margin:0 auto 16px">
    <h1 class="h1" style="font-size:44px">Nothing logged here.</h1>
    <p class="lede">That page does not exist. The homepage has everything that does.</p>
    <div class="cta-row"><a class="btn btn-dark" href="/">Go to the homepage</a></div>
  </div>
</section>
<div class="c">${P.footer()}</div>
</body>
</html>
`);

/* ---------- privacy + terms: patch head/nav/footer, keep the text ---------- */
for (const [slug, title, desc] of [
  ['privacy', 'Privacy Policy | LensReport', 'How LensReport collects, uses, stores and deletes your data.'],
  ['terms', 'Terms of Service | LensReport', 'The terms that govern your use of the LensReport app.'],
]) {
  const file = path.join(ROOT, slug, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('<!-- lr-shell -->')) continue; // already patched
  // Head: add canonical + site.css + description; keep the page's own <style>.
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>\n  <meta name="description" content="${desc}">\n  <link rel="canonical" href="${P.SITE}/${slug}/">\n  <link rel="icon" href="/assets/images/app-logo.png" type="image/png">\n  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">\n  <link rel="stylesheet" href="/assets/site.css">\n  <style>body{max-width:none;padding:0}.legal{max-width:800px;margin:0 auto;padding:24px 28px 48px}.legal header h1{font-family:var(--display)}</style>`);
  // Body: replace the back link with the nav, wrap the legal text, swap the footer.
  html = html.replace(/<body>\s*<a href="\/" class="back-link">[^<]*<\/a>/, `<body>\n<!-- lr-shell -->\n<div class="c">${P.nav()}</div>\n<div class="legal">`);
  html = html.replace(/<footer>[\s\S]*?<\/footer>\s*<\/body>/, `</div>\n<div class="c">${P.footer()}</div>\n</body>`);
  fs.writeFileSync(file, html, 'utf8');
}

console.log('built get, support, delete-account, legal, 404; patched privacy, terms');
