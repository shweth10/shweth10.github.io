/* Builds index.html from the shared partials. Run: node tools/build-home.js */
'use strict';
const fs = require('fs');
const path = require('path');
const P = require('./partials');

const title = 'Expense Tracker AI - LensReport | Log by photo, voice or tap';
const desc = 'Log an expense in seconds by photo, voice or a tap. LensReport gives you AI tips from your own spending, cheaper options nearby, a budget that nudges you, and renewal reminders. Free on iPhone.';

const body = `
<header class="hero-mint">
  <div class="c">
    <h1 class="h1">Every dollar<br>gets a face.</h1>
    <p class="lede">Snap it, say it or tap it. LensReport turns each expense into a card you'll actually look at, then tells you where to save.</p>
    ${P.storeButtons()}
    ${P.stickerRow(12)}
    <p class="caption">224 hand-drawn categories. Coffee looks like coffee, not a grey circle.</p>
  </div>
</header>

<section class="strip" id="how-it-works" aria-labelledby="how-heading">
  <div class="c">
    <h2 id="how-heading" style="position:absolute;left:-9999px">How it works</h2>
    <div class="feat">
      <div><img src="/assets/art/feat_log.png" alt="" width="64" height="64"><h3>Log it any way</h3><p>Snap the receipt, say it out loud, or tap it in. AI reads the merchant, amount and category.</p></div>
      <div><img src="/assets/art/feat_tips.png" alt="" width="64" height="64"><h3>Tips from your spending</h3><p>Not generic advice. A tip that starts with what you actually logged this week.</p></div>
      <div><img src="/assets/art/feat_nearby.png" alt="" width="64" height="64"><h3>Cheaper nearby</h3><p>Paid $12 for a flat white? See well-rated spots close by that usually come in lower.</p></div>
      <div><img src="/assets/art/feat_nudge.png" alt="" width="64" height="64"><h3>Nudges before you overspend</h3><p>A budget you actually follow, with a heads-up the moment a category runs hot.</p></div>
    </div>
  </div>
</section>

<section class="c demo" id="ask-ai" aria-labelledby="ask-heading">
  ${P.ledgerMock()}
  <div>
    <h2 id="ask-heading" class="h2">Then ask it where the money went.</h2>
    <p>Every answer is built from your own entries, never invented. Ask in plain English and get a plan with real numbers behind it.</p>
    <div style="height:22px"></div>
    ${P.planMock()}
  </div>
</section>

<section class="c" aria-labelledby="cta-heading">
  <div class="band">
    <div><h2 id="cta-heading">Three free expenses to try it.</h2><p>No card. Install, log your next coffee, and see what the AI says.</p></div>
    <img src="/assets/art/goal_save_big.png" alt="" width="150" height="150">
    ${P.storeButton('btn-white')}
  </div>
</section>
`;

const html = P.page({
  headOpts: { title, desc, canonical: `${P.SITE}/`, extraHead: `${P.jsonLdApp()}\n${P.jsonLdOrg()}\n` },
  body,
});
fs.writeFileSync(path.join(__dirname, '..', 'index.html'), html, 'utf8');
console.log('index.html', Buffer.byteLength(html), 'bytes');
