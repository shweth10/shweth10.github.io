/* LensReport SEO landing-page generator.
 * Renders distinct keyword landing pages from the PAGES data below, all sharing
 * one brand-matched template, and regenerates sitemap.xml.
 * Run: node tools/gen-landing.js   (from repo root)
 * Adding a page: append to PAGES, re-run. Existing hand-written pages
 * (scan-documents-to-excel, receipt-scanner-to-excel, scan-receipts-to-google-sheets,
 * gst-vat-expense-app, mileage-log-app) are NOT regenerated — they're only listed
 * in REGISTRY so new pages can cross-link to them, and in sitemap.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const APP_STORE = 'https://apps.apple.com/us/app/scan-to-excel-ai-lensreport/id6760954658';
const HUB = 'scan-documents-to-excel';
const LASTMOD = '2026-06-22';

// Registry of every landing slug (existing + generated) for cross-links + sitemap.
const REGISTRY = {
  'scan-documents-to-excel':        { navTitle: 'Scan documents to Excel',        blurb: 'Any business document → a spreadsheet, no manual data entry.' },
  'receipt-scanner-to-excel':       { navTitle: 'Receipt scanner to Excel',       blurb: 'Real working formulas in a downloadable .xlsx.' },
  'scan-receipts-to-google-sheets': { navTitle: 'Scan receipts to Google Sheets', blurb: 'A spreadsheet that opens in Sheets, formulas intact.' },
  'gst-vat-expense-app':            { navTitle: 'GST & VAT expense app',          blurb: 'Tax-ready reports with GST/VAT broken out.' },
  'mileage-log-app':                { navTitle: 'Mileage log app for tradies',    blurb: 'Log mileage and fuel with cents-per-km totals.' },
};

// ---- Pages to GENERATE ----
const PAGES = [
  {
    slug: 'invoice-scanner-to-excel',
    navTitle: 'Invoice scanner to Excel', blurb: 'Scan supplier & sales invoices into a spreadsheet with formulas.',
    title: 'Invoice Scanner to Excel — Scan Invoices into Spreadsheets | LensReport',
    desc: 'Scan supplier and sales invoices into a clean Excel report with totals and tax as real formulas. Status tracking, opens in Google Sheets. Free on iOS — LensReport.',
    badge: 'Invoice scanner → Excel',
    h1: 'Scan invoices into <span class="green">real Excel</span> — no data entry',
    lede: 'Snap supplier and sales invoices and LensReport builds a clean Excel report with the <strong>totals and tax as real formulas</strong> — plus paid / pending / overdue status tracking. Opens in Google Sheets and Numbers.',
    featureHeading: 'Built for invoices — totals and tax as live formulas',
    bullets: ['Line items rolled up into one tidy row', 'Tax and totals written as working Excel formulas', 'Status tracking — paid, pending, overdue — carries to exports', 'Opens in Excel, Google Sheets and Numbers'],
    mock: { file: 'invoices.xlsx', headers: ['Vendor', 'Net', 'Tax', 'Total'], rows: [['Acme Supplies', '420.00', '=B2*0.1', '=B2+C2'], ['Metro Trade', '188.50', '=B3*0.1', '=B3+C3'], ['Coastal Co', '96.00', '=B4*0.1', '=B4+C4']] },
    faq: [
      ['Does it export real Excel formulas?', 'Yes. Tax and totals on each invoice are written as real working Excel formulas, so they recalculate when you edit a cell — not flattened numbers.'],
      ['Does it read supplier and sales invoices?', 'Both. Use the supplier-invoice or sales-invoice template and the AI reads the vendor, date, line totals and tax into a structured row.'],
      ['Can I track which invoices are paid?', 'Yes. Tag each row paid, pending or overdue; the colored status carries into your Excel, PDF and shared-link exports.'],
      ['Is my data safe?', 'Yes. Personal data such as emails, phone numbers, card numbers and IDs is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement.'],
      ['Is it free?', "It's free to start with no card needed. The free tier includes scans and exports each month; paid plans add higher limits, collaboration and AI Insights."],
    ],
    ctaTitle: 'Stop typing invoices into Excel', ctaText: 'Snap an invoice → a real spreadsheet with working formulas. Free to start.',
    related: ['receipt-scanner-to-excel', 'expense-report-app'],
  },
  {
    slug: 'expense-report-app',
    navTitle: 'Expense report app', blurb: 'Snap receipts; the expense report fills itself.',
    title: 'Expense Report App — Scan Receipts, Auto-Build Reports | LensReport',
    desc: 'The expense report app that fills itself. Scan receipts and get a finished report with categories, tax and totals as real Excel formulas. Export or share. Free on iOS.',
    badge: 'Expense reports, automated',
    h1: 'The expense report app that <span class="green">fills itself</span>',
    lede: 'Snap your receipts and LensReport builds the expense report for you — categories, tax and totals as <strong>real Excel formulas</strong>. Export to PDF, Excel or CSV, or share a link. No manual data entry.',
    featureHeading: 'From a pile of receipts to a finished report',
    bullets: ['AI fills each row — vendor, date, amount, tax', 'Categories and totals as live formulas', 'Export PDF, Excel, CSV — or a PIN-locked web link', 'Your team submits claims you approve with a tap'],
    mock: { file: 'expense-report.xlsx', headers: ['Date', 'Category', 'Net', 'Total'], rows: [['03 Jun', 'Travel', '120.00', '=C2*1.1'], ['04 Jun', 'Meals', '48.50', '=C3*1.1'], ['05 Jun', 'Supplies', '76.00', '=C4*1.1']] },
    faq: [
      ['How does it build the report?', 'You pick the expense template and snap each receipt; the AI reads the fields and fills the row. Totals and tax are real formulas, so the report adds up live.'],
      ['Can my team submit expenses?', 'Yes. On a paid plan you invite people to a shared report — they add receipts from the field, tagged to them, and you approve.'],
      ['What can I export?', 'PDF, Excel (.xlsx) and CSV, or a PIN-locked web link. The Excel opens in Google Sheets and Numbers with formulas intact.'],
      ['Is my data safe?', 'Yes. Personal data is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement. No ads, no data selling.'],
      ['Is it free?', "It's free to start with no card needed; paid plans add higher limits, team collaboration and AI Insights."],
    ],
    ctaTitle: 'Let your expense report fill itself', ctaText: 'Snap receipts → a finished report with totals done. Free to start.',
    related: ['receipt-scanner-to-excel', 'self-employed-expense-tracker'],
  },
  {
    slug: 'free-receipt-scanner-app',
    navTitle: 'Free receipt scanner app', blurb: 'Free to start — a real spreadsheet, not a photo.',
    title: 'Free Receipt Scanner App — Scan Receipts to Excel | LensReport',
    desc: 'A free receipt scanner app that builds a real Excel spreadsheet with working formulas — not a flat photo. Opens in Google Sheets. No card needed. LensReport.',
    badge: 'Free to start',
    h1: 'A <span class="green">free receipt scanner</span> that builds a real spreadsheet',
    lede: 'Free to start, no card needed. Snap a receipt and get a clean Excel report with <strong>real working formulas</strong> — not a flat photo of numbers. Opens in Google Sheets and Numbers.',
    featureHeading: 'Free to start — and it gives you a real spreadsheet',
    bullets: ['Free tier includes scans and exports every month', 'Real Excel formulas, not flattened values', 'No ads, no selling your data', 'Personal data scrubbed before the AI sees it'],
    mock: { file: 'receipts.xlsx', headers: ['Vendor', 'Net', 'Tax', 'Total'], rows: [['Cafe Roma', '18.00', '=B2*0.1', '=B2+C2'], ['Hardware Co', '64.30', '=B3*0.1', '=B3+C3'], ['Fuel Stop', '90.00', '=B4*0.1', '=B4+C4']] },
    faq: [
      ['Is it really free?', "Yes — free to start with no card needed. The free tier includes a set number of scans and exports each calendar month. Paid plans add higher limits and extra features."],
      ["What's included in the free tier?", 'Scanning receipts into reports and exporting them, within a monthly allowance. Custom templates, team collaboration and AI Insights are on paid plans.'],
      ['Is my data safe?', 'Yes. Personal data such as emails, phone numbers, card numbers and IDs is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement.'],
      ['Does it work with Google Sheets?', 'Yes. The Excel/CSV export opens directly in Google Sheets and Apple Numbers with formulas intact.'],
      ['Does it work offline?', 'Yes. Capture offline and entries queue, then process when you reconnect. Editing and export work offline too.'],
    ],
    ctaTitle: 'Scan receipts free — get a real spreadsheet', ctaText: 'No card needed. Snap a receipt → an Excel report with working formulas.',
    related: ['receipt-scanner-to-excel', 'scan-receipts-to-google-sheets'],
  },
  {
    slug: 'photo-to-excel',
    navTitle: 'Photo to Excel', blurb: 'Turn a picture of a document into structured data.',
    title: 'Convert a Photo to Excel — Picture to Spreadsheet | LensReport',
    desc: 'Turn a photo of a receipt, invoice or document into a structured Excel spreadsheet with real formulas. Import from your gallery or a PDF too. Free on iOS — LensReport.',
    badge: 'Photo → spreadsheet',
    h1: 'Turn a <span class="green">photo into an Excel spreadsheet</span>',
    lede: 'Take a photo of a receipt, invoice or business document and LensReport turns it into <strong>structured Excel data</strong> with real working formulas. Or import from your photo gallery or a PDF — no typing either way.',
    featureHeading: 'From a picture to structured, usable data',
    bullets: ['Capture with the camera, pick from gallery, or import a PDF', 'AI reads the fields into the right columns', 'Calculated columns become real Excel formulas', 'Opens in Excel, Google Sheets and Numbers'],
    mock: { file: 'from-photo.xlsx', headers: ['Item', 'Qty', 'Price', 'Total'], rows: [['Widget A', '3', '12.00', '=B2*C2'], ['Widget B', '5', '8.50', '=B3*C3'], ['Widget C', '2', '20.00', '=B4*C4']] },
    faq: [
      ['What photos can it read?', 'Photos of business documents — receipts, invoices, quotes, work orders, timesheets and more. You pick the template that matches and the AI maps the photo to those columns.'],
      ['Can I import an existing photo or PDF?', 'Yes. Capture with the camera, import from your gallery, or import a PDF. Multi-page PDFs are processed page by page.'],
      ['Does the spreadsheet have real formulas?', 'Yes. Calculated columns are written as real Excel formulas that recalculate when you edit a cell.'],
      ['Is my data safe?', 'Yes. Personal data is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement.'],
      ['Is it free?', "It's free to start with no card needed; paid plans add higher limits and extra features."],
    ],
    ctaTitle: 'Turn a photo into a spreadsheet', ctaText: 'Snap or import → structured Excel data with working formulas. Free to start.',
    related: ['receipt-scanner-to-excel', 'scan-receipts-to-google-sheets'],
  },
  {
    slug: 'timesheet-app',
    navTitle: 'Timesheet app', blurb: 'Scan paper timesheets; hours × rate as formulas.',
    title: 'Timesheet App — Scan Timesheets to Excel | LensReport',
    desc: 'Scan paper timesheets into an Excel timesheet with hours × rate as real formulas. Your crew can submit from the field. Export for payroll. Free on iOS — LensReport.',
    badge: 'Timesheets → Excel',
    h1: 'Turn paper timesheets into an <span class="green">Excel timesheet</span>',
    lede: 'Snap your crew\'s paper timesheets and LensReport builds an Excel timesheet with <strong>hours × rate as real formulas</strong>. Your team can submit their own from the field — ready for payroll.',
    featureHeading: 'Hours × rate as live formulas',
    bullets: ['Scan paper or handwritten timesheets', 'Pay calculated as hours × rate, a working formula', 'Crew submits their hours from the field', 'Export to Excel or PDF for payroll'],
    mock: { file: 'timesheet.xlsx', headers: ['Name', 'Hours', 'Rate', 'Pay'], rows: [['J. Smith', '38', '32.00', '=B2*C2'], ['A. Patel', '40', '28.50', '=B3*C3'], ['L. Brown', '32', '35.00', '=B4*C4']] },
    faq: [
      ['Can it read handwritten timesheets?', 'Yes — the AI reads printed and handwritten timesheets. Anything it gets wrong you can tap to fix inline, and the pay formula recalculates.'],
      ['Are totals real formulas?', 'Yes. Pay is hours × rate written as a working Excel formula, so it recalculates when you edit hours or rate.'],
      ['Can my crew submit their own?', 'Yes. On a paid plan you invite your team to a shared report; each person logs their hours, tagged to them, and you approve.'],
      ['Is my data safe?', 'Yes. Personal data is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement.'],
      ['Is it free?', "It's free to start with no card needed; team collaboration and higher limits are on the paid plans."],
    ],
    ctaTitle: 'Kill paper timesheet data entry', ctaText: 'Snap timesheets → an Excel timesheet with pay calculated. Free to start.',
    related: ['expense-report-app', 'quote-estimate-app'],
  },
  {
    slug: 'self-employed-expense-tracker',
    navTitle: 'Self-employed expense tracker', blurb: 'For sole traders & freelancers — tidy books from your phone.',
    title: 'Self-Employed Expense Tracker App — Scan Receipts | LensReport',
    desc: 'The expense tracker for self-employed people. Snap receipts into a tidy Excel report with tax broken out, ask your data questions, and hand a clean file to your accountant. Free on iOS.',
    badge: 'For sole traders & freelancers',
    h1: 'The <span class="green">expense tracker</span> for self-employed people',
    lede: 'Sole trader or freelancer? Snap each receipt at the moment of spend and LensReport keeps a tidy Excel report with <strong>tax broken out</strong>. Ask it where your money went, and hand a clean file to your accountant.',
    featureHeading: 'Built for one-person businesses',
    bullets: ['Snap receipts at the moment of spend — no end-of-year pile', 'Tax broken out as a real formula', 'Ask your data: "where did my money go this month?"', 'Export a clean Excel or PDF for your accountant'],
    mock: { file: 'my-expenses.xlsx', headers: ['Date', 'Vendor', 'Net', 'Total'], rows: [['03 Jun', 'Officeworks', '54.00', '=C2*1.1'], ['07 Jun', 'Shell', '88.00', '=C3*1.1'], ['09 Jun', 'Canva', '17.99', '=C4*1.1']] },
    faq: [
      ['Is it good for sole traders and freelancers?', 'Yes — it\'s designed for one-person businesses. Capture each receipt as you spend and you keep an always-current, tax-ready expense report.'],
      ['Does it help at tax time?', 'Yes. Tax is broken out as a real formula and you can export a clean Excel, PDF or CSV to hand straight to your accountant.'],
      ['Can I ask questions about my spending?', 'Yes. AI Insights (on paid plans) answers plain-English questions about your own data — "where did my money go?", "who am I spending the most with?"'],
      ['Is my data safe?', 'Yes. Personal data is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement.'],
      ['Is it free?', "It's free to start with no card needed; paid plans add higher limits, AI Insights and collaboration."],
    ],
    ctaTitle: 'Keep tidy books from your phone', ctaText: 'Snap receipts → a tax-ready expense report. Free to start.',
    related: ['expense-report-app', 'gst-vat-expense-app'],
  },
  {
    slug: '1099-expense-tracker',
    navTitle: '1099 expense tracker', blurb: 'For US contractors — categorized receipts, clean Excel for your CPA.',
    title: '1099 Expense Tracker — Scan Receipts for Tax Time | LensReport',
    desc: 'A 1099 expense tracker for independent contractors. Snap receipts into a categorized Excel report with sales tax as real formulas, ready for your CPA. Mileage log too. Free on iOS.',
    badge: 'For 1099 contractors',
    h1: 'A <span class="green">1099 expense tracker</span> that does the data entry',
    lede: 'Independent contractor? Snap your receipts and LensReport keeps a categorized Excel report with <strong>sales tax as real formulas</strong> — ready to hand to your CPA. Track mileage too, the IRS-friendly way.',
    featureHeading: 'Built for 1099 contractors',
    bullets: ['Categorize business expenses as you go', 'Sales tax broken out as a working formula', 'Export a clean Excel or CSV for your CPA', 'Log mileage with a per-mile rate as a formula'],
    mock: { file: '1099-expenses.xlsx', headers: ['Date', 'Category', 'Amount', 'Tax'], rows: [['03 Jun', 'Equipment', '240.00', '=C2*0.0825'], ['11 Jun', 'Software', '60.00', '=C3*0.0825'], ['18 Jun', 'Travel', '130.00', '=C4*0.0825']] },
    faq: [
      ['Is this good for 1099 contractors?', 'Yes — capture each deductible expense as you go and you keep a categorized, tax-ready record without manual data entry.'],
      ['Can my CPA open the report?', 'Yes. Export to Excel or CSV (opens in Google Sheets and Numbers) or a PDF — clean, structured and ready to hand over.'],
      ['Does it track mileage?', 'Yes. Use the mileage template to log distance with a per-mile rate as a real formula, alongside your expenses.'],
      ['Is my data safe?', 'Yes. Personal data is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement.'],
      ['Is it free?', "It's free to start with no card needed; paid plans add higher limits and AI Insights."],
    ],
    ctaTitle: 'Be ready for tax time', ctaText: 'Snap receipts → a categorized, CPA-ready Excel report. Free to start.',
    related: ['expense-report-app', 'mileage-log-app'],
  },
  {
    slug: 'quote-estimate-app',
    navTitle: 'Quote & estimate app', blurb: 'Capture quotes/estimates; track sent / accepted / declined.',
    title: 'Quote & Estimate App — Scan to Excel | LensReport',
    desc: 'Turn quotes and estimates into tracked spreadsheets with totals as real formulas and status (sent / accepted / declined). Export or share a link. Free on iOS — LensReport.',
    badge: 'Quotes & estimates',
    h1: 'Turn quotes and estimates into <span class="green">tracked spreadsheets</span>',
    lede: 'For trades and consultants: capture your quotes and estimates and LensReport keeps an Excel log with <strong>totals as real formulas</strong> and status tracking — sent, accepted, declined, expired — so you know what\'s live.',
    featureHeading: 'Quotes in, a tracked spreadsheet out',
    bullets: ['Subtotal, tax and quoted amount as live formulas', 'Status tracking: draft, sent, accepted, declined, expired', 'Export to Excel or PDF, or share a PIN-locked link', 'Your team can add theirs to one shared report'],
    mock: { file: 'quotes.xlsx', headers: ['Client', 'Subtotal', 'Tax', 'Quoted'], rows: [['Hill Cafe', '1200.00', '=B2*0.1', '=B2+C2'], ['Park Reno', '3400.00', '=B3*0.1', '=B3+C3'], ['Bay Fitout', '880.00', '=B4*0.1', '=B4+C4']] },
    faq: [
      ['Can I track which quotes were accepted?', 'Yes. Tag each quote draft, sent, accepted, declined or expired; the colored status carries into your exports and shared links.'],
      ['Are totals real formulas?', 'Yes. Subtotal, tax and the quoted amount are written as working Excel formulas that recalculate when you edit a cell.'],
      ['Can I share a quote log?', 'Yes. Export to Excel or PDF, or generate a PIN-locked web link to a read-only view.'],
      ['Is my data safe?', 'Yes. Personal data is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement.'],
      ['Is it free?', "It's free to start with no card needed; paid plans add higher limits, collaboration and AI Insights."],
    ],
    ctaTitle: 'Know which quotes are live', ctaText: 'Capture quotes → a tracked Excel log with status. Free to start.',
    related: ['invoice-scanner-to-excel', 'purchase-order-scanner'],
  },
  {
    slug: 'purchase-order-scanner',
    navTitle: 'Purchase order scanner', blurb: 'Capture POs & supplier bills into a tracked Excel log.',
    title: 'Purchase Order Scanner to Excel | LensReport',
    desc: 'Scan purchase orders and supplier bills into an Excel log with totals as real formulas and status tracking. Export or share. Free on iOS — LensReport.',
    badge: 'Purchase orders → Excel',
    h1: 'Scan purchase orders into an <span class="green">Excel log</span>',
    lede: 'Capture purchase orders and supplier bills and LensReport keeps an Excel log with <strong>line totals as real formulas</strong> and status tracking — so you can see what\'s ordered, delivered and paid.',
    featureHeading: 'The PO lifecycle, tracked',
    bullets: ['Quantity × unit price as a live formula', 'Status: draft, sent, confirmed, delivered', 'Match purchase orders against supplier bills', 'Export to Excel or PDF, or share a link'],
    mock: { file: 'po-log.xlsx', headers: ['Supplier', 'Qty', 'Unit', 'Total'], rows: [['Steelco', '20', '45.00', '=B2*C2'], ['PipeWorks', '12', '18.50', '=B3*C3'], ['BoltCo', '100', '0.80', '=B4*C4']] },
    faq: [
      ['Does it read purchase orders and supplier bills?', 'Yes. Use the purchase-order or supplier-invoice template; the AI reads supplier, quantities and totals into a structured row.'],
      ['Are totals real formulas?', 'Yes. Quantity × unit price and line totals are written as working Excel formulas that recalculate when you edit a cell.'],
      ['Can I track delivery status?', 'Yes. Tag each PO draft, sent, confirmed or delivered; the colored status carries into your exports.'],
      ['Is my data safe?', 'Yes. Personal data is scrubbed before the AI ever sees it, and images are processed under a zero-data-retention agreement.'],
      ['Is it free?', "It's free to start with no card needed; paid plans add higher limits and collaboration."],
    ],
    ctaTitle: 'Track every purchase order', ctaText: 'Scan POs → a tracked Excel log with totals done. Free to start.',
    related: ['invoice-scanner-to-excel', 'quote-estimate-app'],
  },
  {
    slug: 'receipt-app-for-bookkeepers',
    navTitle: 'Receipt app for bookkeepers', blurb: 'Give clients a shared report; export clean Excel/CSV to Xero or QuickBooks.',
    title: 'Receipt App for Bookkeepers & Accountants | LensReport',
    desc: 'The receipt-to-Excel app you give your clients. They drop documents into a shared report, you get notified, and you export a clean Excel/CSV into Xero or QuickBooks. Free to try.',
    badge: 'For bookkeepers & accountants',
    h1: 'The <span class="green">receipt-to-Excel app</span> you give your clients',
    lede: 'Invite each client as a contributor — they drop receipts and invoices straight into a shared report, you\'re notified the moment they add one, and you <strong>export a clean Excel or CSV</strong> into Xero or QuickBooks. No inbox ping-pong, no month-end pile.',
    featureHeading: 'Built for a practice',
    bullets: ['Invite each client to their own shared report', 'Notified the moment a client adds a document', 'Clean Excel / CSV to import into Xero or QuickBooks', 'Status tracking — paid vs pending — per client'],
    mock: { file: 'client-source-docs.xlsx', headers: ['Date', 'Vendor', 'Net', 'Total'], rows: [['03 Jun', 'Supplier A', '210.00', '=C2*1.1'], ['05 Jun', 'Supplier B', '88.40', '=C3*1.1'], ['06 Jun', 'Supplier C', '52.75', '=C4*1.1']] },
    faq: [
      ['How does it work for a bookkeeping practice?', 'You invite each client as a contributor to their own shared report. They capture source documents from their phone; you get notified and export a clean file when you reconcile.'],
      ['Can I import into Xero or QuickBooks?', 'Yes. Export to Excel or CSV and import it into your tool — LensReport is the capture front-end that gets clean, structured data out of paper.'],
      ['Do clients need to pay?', 'Contributors join with their own free accounts. The practice (or client) holds the paid plan that unlocks collaboration.'],
      ['Is client data safe?', 'Yes. Personal data is scrubbed before the AI ever sees it, images are processed under a zero-data-retention agreement, and every share link can be PIN-locked.'],
      ['Can I try it with a client first?', 'Yes. It\'s free to start, so you can trial it with a client or two before rolling it out across your book.'],
    ],
    ctaTitle: 'Stop chasing clients for receipts', ctaText: 'Invite clients to a shared report → export clean Excel for your tool. Free to try.',
    related: ['expense-report-app', 'gst-vat-expense-app'],
  },
];

// Standard template chips (breadth section) + buyer cards are shared.
const CHIPS = ['Invoices', 'Quotes &amp; estimates', 'Purchase orders', 'Work orders', 'Timesheets', 'Delivery dockets', 'Inventory counts', 'Bank deposits', 'Expense claims', 'Mileage &amp; fuel logs', 'Supplier bills', 'Receipts'];

const STORE_BTNS = `        <a class="store" href="${APP_STORE}" target="_blank" rel="noopener noreferrer" aria-label="Download LensReport on the App Store">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.365 1.43c0 1.14-.42 2.2-1.13 3-.84.96-2.2 1.7-3.32 1.6-.13-1.1.42-2.27 1.1-3 .8-.86 2.2-1.5 3.35-1.6zM20.5 17.18c-.55 1.27-.82 1.84-1.53 2.96-.99 1.56-2.38 3.5-4.1 3.51-1.53.02-1.92-1-3.99-.99-2.07.01-2.5 1.01-4.03.99-1.72-.02-3.04-1.77-4.03-3.33C-.07 16.67-.36 11.1 1.4 8.16 2.66 6.06 4.65 4.83 6.52 4.83c1.9 0 3.1 1.04 4.67 1.04 1.53 0 2.46-1.04 4.66-1.04 1.66 0 3.42.9 4.68 2.46-4.11 2.25-3.44 8.12.97 9.89z"/></svg>
          <span class="bt"><span class="lbl">Download on the</span><span class="st">App Store</span></span>
        </a>
        <span class="store store--soon" role="img" aria-label="Coming soon on Google Play">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
          <span class="bt"><span class="lbl">Coming soon on</span><span class="st">Google Play</span></span>
        </span>`;

const STYLE = `  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #F7F8FA; color: #1A2332; line-height: 1.6; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }
    :root { --green: #4CAF7D; --green-light: #5EC98F; --green-pale: #E8F5EE; --green-dark: #3A9468; --bg: #F7F8FA; --surface: #FFFFFF; --border: #E5E7EB; --text: #1A2332; --text-secondary: #6B7280; --text-muted: #9CA3AF; --shadow-sm: 0 1px 3px rgba(0,0,0,0.06); --shadow-md: 0 4px 16px rgba(0,0,0,0.08); --shadow-lg: 0 12px 40px rgba(0,0,0,0.1); --radius: 16px; --radius-sm: 12px; --radius-xs: 8px; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
    nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.85); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-bottom: 1px solid var(--border); }
    .nav-inner { max-width: 1000px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 64px; }
    .logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 19px; font-weight: 800; letter-spacing: -0.5px; display: flex; align-items: center; gap: 10px; color: var(--text); }
    .logo img { width: 34px; height: 34px; border-radius: 9px; box-shadow: var(--shadow-sm); }
    .nav-cta { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; color: #fff; background: var(--green); padding: 9px 18px; border-radius: 100px; transition: background 0.2s, transform 0.2s; }
    .nav-cta:hover { background: var(--green-dark); transform: translateY(-1px); }
    .hero { position: relative; background: linear-gradient(180deg, #FFFFFF 0%, #F7F8FA 100%); overflow: hidden; }
    .glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
    .glow.g1 { width: 540px; height: 540px; top: -12%; left: 30%; background: radial-gradient(circle, rgba(76,175,125,0.24) 0%, transparent 70%); }
    .glow.g2 { width: 360px; height: 360px; top: 30%; left: 4%; background: radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%); }
    .hero-wrap { position: relative; z-index: 2; text-align: center; max-width: 760px; margin: 0 auto; padding: clamp(56px, 8vw, 88px) 24px clamp(40px, 6vw, 60px); }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: var(--green-pale); border: 1px solid rgba(76,175,125,0.25); color: var(--green-dark); font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; padding: 6px 14px; border-radius: 100px; margin-bottom: 22px; text-transform: uppercase; letter-spacing: 1px; }
    .badge .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); }
    h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(30px, 5.4vw, 52px); font-weight: 800; line-height: 1.06; letter-spacing: -1.2px; margin-bottom: 20px; }
    h1 .green { background: linear-gradient(135deg, #4CAF7D 0%, #5EC98F 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .lede { color: var(--text-secondary); font-size: clamp(15px, 1.9vw, 18px); line-height: 1.7; max-width: 600px; margin: 0 auto 32px; }
    .cta-row { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .store { display: inline-flex; align-items: center; gap: 12px; background: #1A2332; color: #fff; padding: 12px 22px; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; border: 1px solid rgba(255,255,255,0.08); transition: transform 0.25s, box-shadow 0.25s, background 0.25s; }
    .store:hover { transform: translateY(-2px); background: #243447; box-shadow: 0 12px 28px rgba(14,23,42,0.28); }
    .store svg { width: 26px; height: 26px; fill: #fff; flex-shrink: 0; }
    .store .bt { display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2; }
    .store .lbl { font-size: 9px; font-weight: 500; color: rgba(255,255,255,0.6); letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 2px; }
    .store .st { font-size: 15px; font-weight: 700; letter-spacing: -0.2px; }
    .store--soon { background: #EEF0EF; color: #9AA0A0; border-color: transparent; cursor: default; }
    .store--soon:hover { transform: none; box-shadow: none; background: #EEF0EF; }
    .store--soon svg { fill: #9AA0A0; }
    .store--soon .lbl { color: #B3B8B8; }
    .trust { margin-top: 22px; font-size: 13px; color: var(--text-muted); }
    .section { padding: clamp(56px, 8vw, 88px) 0; }
    .section--alt { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .eyebrow { font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500; color: var(--green); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; text-align: center; }
    .section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(24px, 3.4vw, 34px); font-weight: 700; letter-spacing: -0.5px; line-height: 1.15; margin-bottom: 14px; text-align: center; }
    .section-sub { font-size: 16px; color: var(--text-secondary); max-width: 560px; margin: 0 auto 48px; text-align: center; line-height: 1.7; }
    .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .step { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; box-shadow: var(--shadow-sm); }
    .step-num { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 14px; color: var(--green); width: 34px; height: 34px; border-radius: 10px; background: var(--green-pale); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .step h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .step p { font-size: 14.5px; color: var(--text-secondary); }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px 24px; box-shadow: var(--shadow-sm); }
    .card .ic { width: 42px; height: 42px; border-radius: 12px; background: var(--green-pale); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .card .ic svg { width: 22px; height: 22px; stroke: var(--green-dark); fill: none; stroke-width: 2; }
    .card h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 8px; }
    .card p { font-size: 14.5px; color: var(--text-secondary); }
    .feature { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
    .feature h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(22px, 3vw, 30px); font-weight: 700; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 16px; }
    .feature p { color: var(--text-secondary); font-size: 16px; margin-bottom: 14px; }
    .feature ul { list-style: none; }
    .feature li { display: flex; gap: 10px; align-items: flex-start; font-size: 15px; color: var(--text); margin-bottom: 10px; }
    .feature li svg { width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; stroke: var(--green); fill: none; stroke-width: 2.5; }
    .mock { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); overflow: hidden; }
    .mock-bar { background: #F0F2F5; border-bottom: 1px solid var(--border); padding: 10px 14px; display: flex; gap: 6px; align-items: center; }
    .mock-bar i { width: 10px; height: 10px; border-radius: 50%; background: #D1D5DB; display: inline-block; }
    .mock-bar span { margin-left: 10px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-muted); }
    .mock table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
    .mock th { background: var(--green-pale); color: var(--green-dark); font-family: 'DM Mono', monospace; font-weight: 500; text-align: left; padding: 9px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
    .mock td { padding: 9px 12px; border-top: 1px solid var(--border); color: var(--text); }
    .mock td.formula { font-family: 'DM Mono', monospace; color: var(--green-dark); }
    .mock tr:nth-child(even) td { background: #FBFCFD; }
    .tchips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 760px; margin: 0 auto 24px; }
    .tchip { font-size: 13.5px; font-weight: 600; color: var(--green-dark); background: var(--green-pale); border: 1px solid rgba(76,175,125,0.25); padding: 8px 14px; border-radius: 100px; }
    .tcta-wrap { text-align: center; margin-bottom: 52px; }
    .tcta { display: inline-flex; align-items: center; gap: 6px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 15px; color: var(--green-dark); }
    .tcta:hover { color: var(--green); }
    .guides { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .guide-link { display: block; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 20px; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
    .guide-link:hover { border-color: var(--green); transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .guide-link strong { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15.5px; font-weight: 700; display: block; margin-bottom: 5px; }
    .guide-link span { font-size: 13.5px; color: var(--text-secondary); }
    .guide-link .arrow { color: var(--green); font-weight: 700; }
    .faq { max-width: 720px; margin: 0 auto; }
    .faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 12px; overflow: hidden; }
    .faq-item summary { cursor: pointer; padding: 20px 22px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 16px; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-item summary::after { content: '+'; font-size: 22px; color: var(--green); font-weight: 400; flex-shrink: 0; }
    .faq-item[open] summary::after { content: '\\2212'; }
    .faq-item .a { padding: 0 22px 20px; color: var(--text-secondary); font-size: 15px; line-height: 1.7; }
    .cta-band { text-align: center; background: linear-gradient(135deg, #3A9468 0%, #4CAF7D 100%); border-radius: var(--radius); padding: clamp(40px, 6vw, 60px) 24px; color: #fff; box-shadow: var(--shadow-lg); }
    .cta-band h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(24px, 3.4vw, 34px); font-weight: 800; letter-spacing: -0.5px; margin-bottom: 12px; }
    .cta-band p { font-size: 16px; opacity: 0.92; max-width: 480px; margin: 0 auto 28px; }
    .cta-band .store { background: #1A2332; }
    .cta-band .store--soon { background: rgba(255,255,255,0.18); color: rgba(255,255,255,0.7); }
    .cta-band .store--soon svg { fill: rgba(255,255,255,0.7); }
    .cta-band .store--soon .lbl { color: rgba(255,255,255,0.55); }
    footer { border-top: 1px solid var(--border); padding: 40px 0; background: var(--bg); }
    .footer-inner { max-width: 1000px; margin: 0 auto; padding: 0 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .footer-logo { display: flex; align-items: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 15px; color: var(--text-secondary); }
    .footer-logo img { width: 24px; height: 24px; border-radius: 6px; }
    .footer-links { display: flex; gap: 22px; flex-wrap: wrap; }
    .footer-links a { font-size: 13px; color: var(--text-secondary); transition: color 0.2s; }
    .footer-links a:hover { color: var(--text); }
    .footer-copy { font-size: 12px; color: var(--text-muted); }
    @media (max-width: 760px) { .steps, .cards, .guides { grid-template-columns: 1fr; } .feature { grid-template-columns: 1fr; } .feature .mock { order: -1; } }
  </style>`;

function mockHtml(m) {
  const head = m.headers.map(h => `<th>${h}</th>`).join('');
  const body = m.rows.map(r => '<tr>' + r.map(c => (String(c).startsWith('=') ? `<td class="formula">${c}</td>` : `<td>${c}</td>`)).join('') + '</tr>').join('\n                ');
  return `          <div class="mock" aria-hidden="true">
            <div class="mock-bar"><i></i><i></i><i></i><span>${m.file}</span></div>
            <table>
              <thead><tr>${head}</tr></thead>
              <tbody>
                ${body}
              </tbody>
            </table>
          </div>`;
}

function guidesHtml(related) {
  const slugs = [HUB, ...related].slice(0, 3);
  return slugs.map(s => {
    const r = REGISTRY[s];
    return `          <a class="guide-link" href="/${s}/"><strong>${r.navTitle}</strong><span>${r.blurb} <span class="arrow">&rarr;</span></span></a>`;
  }).join('\n');
}

function jsonLd(p) {
  const graph = [
    { '@type': 'SoftwareApplication', name: 'LensReport', operatingSystem: 'iOS', applicationCategory: 'BusinessApplication', description: p.desc, installUrl: APP_STORE, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'BreadcrumbList', itemListElement: [ { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://lensreport.app/' }, { '@type': 'ListItem', position: 2, name: p.navTitle, item: `https://lensreport.app/${p.slug}/` } ] },
    { '@type': 'FAQPage', mainEntity: p.faq.map(([q, a]) => ({ '@type': 'Question', name: q.replace(/&amp;/g, '&'), acceptedAnswer: { '@type': 'Answer', text: a.replace(/&amp;/g, '&') } })) },
  ];
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

function render(p) {
  const bullets = p.bullets.map(b => `              <li><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>${b}</li>`).join('\n');
  const faq = p.faq.map(([q, a]) => `          <details class="faq-item"><summary>${q}</summary><div class="a">${a}</div></details>`).join('\n');
  const chips = CHIPS.map(c => `<span class="tchip">${c}</span>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <title>${p.title}</title>
  <meta name="description" content="${p.desc}">
  <link rel="canonical" href="https://lensreport.app/${p.slug}/">
  <meta property="og:title" content="${p.navTitle} — LensReport">
  <meta property="og:description" content="${p.desc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://lensreport.app/${p.slug}/">
  <meta property="og:image" content="https://lensreport.app/assets/images/onboarding_01_scan_invoice.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.navTitle} — LensReport">
  <meta name="twitter:description" content="${p.desc}">
  <meta name="twitter:image" content="https://lensreport.app/assets/images/onboarding_01_scan_invoice.png">
  <meta name="theme-color" content="#4CAF7D">
  <meta name="apple-itunes-app" content="app-id=6760954658">
  <link rel="icon" href="/assets/images/app-logo.png" type="image/png">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:;">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
${STYLE}

  <script type="application/ld+json">
${jsonLd(p)}
  </script>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <a class="logo" href="/"><img src="/assets/images/app-logo.png" alt="LensReport logo">LensReport</a>
      <a class="nav-cta" href="/get">Get the app</a>
    </div>
  </nav>

  <header class="hero">
    <div class="glow g1"></div>
    <div class="glow g2"></div>
    <div class="hero-wrap">
      <span class="badge"><span class="dot"></span>${p.badge}</span>
      <h1>${p.h1}</h1>
      <p class="lede">${p.lede}</p>
      <div class="cta-row">
${STORE_BTNS}
      </div>
      <p class="trust">Free to start &middot; No card needed &middot; Personal data scrubbed before AI</p>
    </div>
  </header>

  <main>
    <section class="section">
      <div class="container">
        <p class="eyebrow">How it works</p>
        <h2 class="section-title">No manual data entry, three taps</h2>
        <p class="section-sub">Pick a template, capture or import, export. It works offline too.</p>
        <div class="steps">
          <div class="step"><div class="step-num">1</div><h3>Pick a template</h3><p>Choose the document type. Each template already knows its columns and the maths.</p></div>
          <div class="step"><div class="step-num">2</div><h3>Capture or import</h3><p>Snap a photo, pick from your gallery, or import a PDF. The AI reads every field and fills the row.</p></div>
          <div class="step"><div class="step-num">3</div><h3>Export anywhere</h3><p>Get a real Excel file with live formulas, a PDF, a CSV, or a PIN-locked web link.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="feature">
          <div>
            <h2>${p.featureHeading}</h2>
            <p>No more retyping numbers that are already printed on the page. Each one lands in a spreadsheet with the maths already done.</p>
            <ul>
${bullets}
            </ul>
          </div>
${mockHtml(p.mock)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow">No catch</p>
        <h2 class="section-title">The three things everyone asks</h2>
        <div class="cards">
          <div class="card"><div class="ic"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div><h3>Is it safe?</h3><p>Personal data &mdash; emails, phone numbers, IDs, card numbers &mdash; is scrubbed before the AI ever sees it. Images are processed under a zero-data-retention agreement.</p></div>
          <div class="card"><div class="ic"><svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div><h3>Works with Sheets?</h3><p>Yes &mdash; the Excel/CSV export opens directly in Google Sheets and Apple Numbers, formulas intact. No conversion step.</p></div>
          <div class="card"><div class="ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><h3>Setup?</h3><p>None. Pick a template, capture or import, export. Works offline too &mdash; captures queue and process when you reconnect.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <p class="eyebrow">Not just one document</p>
        <h2 class="section-title">It reads any business document</h2>
        <p class="section-sub">One of 45+ templates. Scan or import invoices, quotes, work orders, timesheets, delivery dockets and more &mdash; each becomes a clean spreadsheet with the maths done.</p>
        <div class="tchips">${chips}</div>
        <div class="tcta-wrap"><a class="tcta" href="/${HUB}/">See how it handles any document &rarr;</a></div>
        <p class="eyebrow">Related guides</p>
        <h2 class="section-title">Explore by what you need</h2>
        <div class="guides">
${guidesHtml(p.related)}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p class="eyebrow">FAQ</p>
        <h2 class="section-title">Questions</h2>
        <div class="faq">
${faq}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <h2>${p.ctaTitle}</h2>
          <p>${p.ctaText}</p>
          <div class="cta-row">
${STORE_BTNS}
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-inner">
      <div class="footer-logo"><img src="/assets/images/app-logo.png" alt="LensReport" width="24" height="24">LensReport</div>
      <div class="footer-links">
        <a href="/">Home</a>
        <a href="/support/">Support</a>
        <a href="/privacy/">Privacy Policy</a>
        <a href="/terms/">Terms of Service</a>
        <a href="mailto:info@lensreport.app">Contact</a>
      </div>
      <p class="footer-copy">&copy; 2026 LensReport. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
`;
}

// Register generated pages so they can cross-link to each other.
for (const p of PAGES) REGISTRY[p.slug] = { navTitle: p.navTitle, blurb: p.blurb };

// Write pages.
let written = 0;
for (const p of PAGES) {
  const dir = path.join(ROOT, p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), render(p), 'utf8');
  written++;
  console.log('wrote', p.slug + '/index.html');
}

// Regenerate sitemap.xml (base pages + all landing slugs).
const BASE = [
  { loc: 'https://lensreport.app/', priority: '1.0', changefreq: 'weekly' },
];
const landingSlugs = Object.keys(REGISTRY);
const TAIL = [
  { loc: 'https://lensreport.app/get/', priority: '0.6', changefreq: 'monthly' },
  { loc: 'https://lensreport.app/support/', priority: '0.5', changefreq: 'monthly' },
  { loc: 'https://lensreport.app/privacy/', priority: '0.3', changefreq: 'yearly' },
  { loc: 'https://lensreport.app/terms/', priority: '0.3', changefreq: 'yearly' },
];
const urls = [];
urls.push(`  <url>\n    <loc>https://lensreport.app/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`);
for (const s of landingSlugs) {
  const pr = s === HUB ? '0.9' : '0.8';
  urls.push(`  <url>\n    <loc>https://lensreport.app/${s}/</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${pr}</priority>\n  </url>`);
}
for (const t of TAIL) {
  urls.push(`  <url>\n    <loc>${t.loc}</loc>\n    <changefreq>${t.changefreq}</changefreq>\n    <priority>${t.priority}</priority>\n  </url>`);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log('wrote sitemap.xml with', landingSlugs.length, 'landing URLs');
console.log('done:', written, 'pages generated');
