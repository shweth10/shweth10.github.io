# "Problem We're Solving" Section — lensreport.app
## Updated Implementation Specification v3

---

## 1. Overview

This is the updated spec incorporating one change from v2:

1. **Block 2 MIT Sloan stat rewritten** — The decision-making insight loss statistic has been reworded to explicitly connect businesses making decisions without past report insights to the $3 trillion annual loss figure, and closes with a line that frames exactly what LensReport solves. All other content, hyperlinks, image prompts, and definitions of done from v2 remain unchanged.

---

## 2. Hyperlink Styling

All sourced fact links use the following visual treatment:

- Color: `#2563EB` (standard accessible blue — distinct from the brand's sage green so it reads clearly as a citation link)
- Underline: always underlined, not on hover only — these are citations, not nav links
- Font weight: same as surrounding body text — no bold
- On hover: slightly darker blue, underline remains
- `target="_blank"` with `rel="noopener noreferrer"` on every external link
- Do not add footnote numbers or asterisks — the underlined blue word is the citation signal

---

## 3. Updated Copy — With Sourced Hyperlinks

The format below marks every hyperlinked phrase in `[square brackets]` followed by `(URL)` for the developer. These become inline `<a>` tags in the final HTML.

---

### Section Eyebrow
```
THE PROBLEM
```

### Section Heading
```
Documents are created everywhere.
Most of them go nowhere.
```

### Section Subheading
```
Invoices, receipts, expense records, delivery dockets — generated worldwide, every day.
And [80–90% of all business data generated today is unstructured](https://www.athento.com/unstructured-information-the-great-challenge-and-opportunity-for-companies-in-2025/) —
scattered, unorganised, stuffed in pockets, piled on desks, or sitting unread in an email inbox.
```

---

### Block 1 — The Document Chaos

**Label:** `THE PILE`

**Heading:**
```
Every business generates documents. Few actually manage them.
```

**Body:**
```
Receipts stuffed in pockets. Invoices photographed and forgotten. Delivery dockets that never
make it off the job site. [45% of small businesses still rely on paper-based document management](https://usesignhouse.com/blog/document-management-industry-stats/)
with [11% having no document management system at all](https://usesignhouse.com/blog/document-management-industry-stats/).
The paperwork exists — it just never gets anywhere useful.
```

---

### Block 2 — The Consequences

**Label:** `THE COST`

**Heading:**
```
When reporting doesn't happen, the consequences stack up fast.
```

**Body:**
```
Tax deductions are missed. Penalties are triggered. [Businesses in the US alone waste $8 billion
every year managing paper documents](https://usesignhouse.com/blog/document-management-industry-stats/) — and that's before accounting for the decisions never made.

[Businesses that make decisions without consulting past report insights lose an estimated $3 trillion
every year](https://www.capellasolutions.com/blog/you-wont-believe-how-much-bad-data-is-costing-you), according to MIT Sloan Management Review. Not from lack of activity — but from activity
that was never recorded, never reported, and never turned into insight.

[Gartner puts the average annual cost of poor data quality at $15 million per organisation](https://www.actian.com/blog/data-management/the-costly-consequences-of-poor-data-quality/).
Meanwhile, [80% of organisations are still making decisions on stale, outdated data](https://www.ibm.com/think/insights/delayed-data-cost) —
and [85% of data leaders admit this has directly cost their company money](https://www.ibm.com/think/insights/delayed-data-cost).

Accountants and bookkeepers spend hours chasing paperwork and doing manual data entry —
costing businesses time and money they can't afford to waste.
```

---

### Block 3 — The Hidden Value

**Label:** `THE OPPORTUNITY`

**Heading:**
```
Every document contains data. Most of it is never captured.
```

**Body:**
```
[53% of small and medium businesses don't know what insights their own data could provide](https://aws.amazon.com/blogs/smb/why-small-and-medium-businesses-are-missing-out-on-the-full-benefits-data-can-provide/).
Yet [companies that leverage data effectively can increase revenue by up to 20%](https://enricher.io/blog/the-cost-of-incomplete-data), according to McKinsey.

Every one of those documents — if properly captured and organised — gives business owners
the insight to make better decisions, reduce costs, and stay ahead. The data already exists.
It just needs somewhere to go.
```

---

### Block 4 — The Solution Moment

**Label:** `THE SHIFT`

**Heading:**
```
Captured. Organised. Reported. Instantly.
```

**Body:**
```
LensReport turns every scan into a structured data entry, every entry into a live report,
and every report into a decision-ready export — with AI that answers the questions your
data has been waiting to answer.
```

*(No citations in Block 4 — this is the product statement, not a fact claim.)*

---

### Closing Statement
```
Every one of those documents contains data that, if properly captured and reported, gives
business owners the insight to make better decisions, reduce costs, and stay ahead —
while foreseeing future losses before they happen.
```

---

## 4. Source Reference Table

| Fact | Source | URL |
|------|---------|-----|
| 80–90% of business data is unstructured | Gartner via Athento | https://www.athento.com/unstructured-information-the-great-challenge-and-opportunity-for-companies-in-2025/ |
| 45% of small businesses use paper-based document management | SignHouse Industry Stats | https://usesignhouse.com/blog/document-management-industry-stats/ |
| 11% of small businesses have no document management system | SignHouse Industry Stats | https://usesignhouse.com/blog/document-management-industry-stats/ |
| US businesses waste $8 billion/year on paper document management | SignHouse Industry Stats | https://usesignhouse.com/blog/document-management-industry-stats/ |
| Businesses making decisions without past report insights lose $3 trillion/year | MIT Sloan Management Review via Capella Solutions | https://www.capellasolutions.com/blog/you-wont-believe-how-much-bad-data-is-costing-you |
| Gartner: poor data quality costs $15 million/org/year | Gartner via Actian | https://www.actian.com/blog/data-management/the-costly-consequences-of-poor-data-quality/ |
| 80% of organisations use stale data for decisions | IBM | https://www.ibm.com/think/insights/delayed-data-cost |
| 85% of data leaders say outdated data cost their company money | IBM | https://www.ibm.com/think/insights/delayed-data-cost |
| 53% of SMBs don't know what insights their data could provide | AWS SMB Survey | https://aws.amazon.com/blogs/smb/why-small-and-medium-businesses-are-missing-out-on-the-full-benefits-data-can-provide/ |
| Companies leveraging data can increase revenue by up to 20% | McKinsey via Enricher | https://enricher.io/blog/the-cost-of-incomplete-data |

---

## 5. Brand-Themed Image Generation Prompts

All four prompts now follow the **LensReport Sage & Slate design system**:

- **Primary green:** sage green `#3D7A6B` — used for key accent elements, icon fills, sparkle stars, swirl lines, and report header bars
- **Background tint:** mint `#E8F5F1` — used for card backgrounds, table cell fills, and soft panel backgrounds behind floating elements
- **Surface:** warm off-white `#F7F7F5` — the overall illustration background, not pure white
- **Outlines and characters:** near-black `#1A1A1A` — all bold outlines, character features, text, and icon strokes
- **Alert / warning accent:** warm coral — used only in Block 2 (consequences) for alert icons and warning indicators
- **No bright lime green.** The accent is the muted sage green of the brand, not a neon or pure green.
- **Illustration style:** flat 2D digital illustration, bold near-black outlines, no gradients, no shading, no drop shadows, clean modern mobile app illustration style, 4:5 portrait aspect ratio

---

### Visual 1 — The Document Chaos (Block 1: THE PILE)

Flat 2D digital illustration, 4:5 portrait aspect ratio, warm off-white background (#F7F7F5). A bird's-eye view of a large wooden desk surface in near-black outline (#1A1A1A) completely overwhelmed with scattered documents — crumpled receipts, unfolded invoices, stapled expense records, and loose delivery dockets overlapping each other in every direction. Each document is outlined in near-black with minimal interior detail — horizontal ruled lines suggesting text, and small dollar sign symbols. A smartphone sits face-up at the edge of the desk showing a notification badge with a high unread count, the badge filled in sage green (#3D7A6B). One desk drawer is half-open with more papers spilling out. A coffee cup with a ring stain sits on top of a pile of receipts. The document pile itself has a soft mint (#E8F5F1) fill on a few of the uppermost receipt slips to create visual hierarchy. No character present — the desk tells the story. Bold near-black outlines throughout, warm off-white background, accent colors sage green and mint only, no gradients, no shading, no shadows, generous empty space at the top of the frame.

---

### Visual 2 — The Consequences (Block 2: THE COST)

Flat 2D digital illustration, 4:5 portrait aspect ratio, warm off-white background (#F7F7F5). A male character in a plain black t-shirt sits at a desk, shoulders slumped, staring at an open laptop screen. The laptop screen shows three stacked alert panels — one showing a tax penalty notice icon, one showing a question mark over a bar chart with a downward arrow, one showing a clock with an overdue label — each outlined in near-black with a warm coral fill on the X mark or warning indicator beside it. The character's expression is stressed and defeated, one hand pressed to his forehead. A thought bubble above his head contains three small icons outlined in near-black: a dollar sign with a downward arrow in warm coral, a calendar with a circled missed date in warm coral, and a document with a question mark in sage green. A small crumpled receipt pile sits beside the laptop on the desk surface with a mint (#E8F5F1) fill. Bold near-black outlines throughout, warm off-white background, sage green for neutral elements, warm coral for alert and loss indicators only, no gradients, no shading, no shadows, generous empty space at the bottom of the frame.

---

### Visual 3 — The Hidden Value (Block 3: THE OPPORTUNITY)

Flat 2D digital illustration, 4:5 portrait aspect ratio, warm off-white background (#F7F7F5). A single receipt document floats large and centered in the frame, illustrated in near-black outline with a mint (#E8F5F1) fill on its surface, horizontal text lines suggesting line items and amounts, and a small dollar sign at the top. From the receipt, six thin sage green (#3D7A6B) curved lines radiate outward like spokes, each ending in a distinct floating icon inside a small rounded rectangle with a mint fill and sage green border: a bar chart trending upward, a tax document with a sage green checkmark, a lightbulb, a calendar with a sage green dot, a shield with a sage green checkmark, and a coin stack. The radiating lines and icon borders are all in sage green. No character present — concept-forward illustration. Bold near-black outlines throughout, warm off-white background, sage green and mint accents only, no gradients, no shading, no shadows, clean modern illustration style, generous empty space at the top and bottom of the frame.

---

### Visual 4 — The Solution Moment (Block 4: THE SHIFT)

Flat 2D digital illustration, 4:5 portrait aspect ratio, warm off-white background (#F7F7F5). A female character in a dark blazer outlined in near-black stands confidently, holding a sage green smartphone in one hand with the screen visible. The phone screen shows a neatly organised report table — header bar filled in sage green (#3D7A6B) with white column label text, four data rows with a mint (#E8F5F1) fill and near-black text, each row showing a sage green filled circle checkmark in the leftmost column. From the phone screen, a single clean sage green upward-trending arrow rises and curves toward the top right of the frame, growing slightly larger as it ascends. Beside the character, a small floating panel with a mint fill shows a simplified bar chart with three ascending sage green bars. Her expression is calm and assured. Bold near-black outlines throughout, warm off-white background, sage green (#3D7A6B) and mint (#E8F5F1) accents only, no bright green, no gradients, no shading, no shadows, clean modern mobile app illustration style, generous empty space at the top of the frame.

---

## 6. Asset Storage

```
/assets/problem/
├── visual-1-chaos.png
├── visual-2-consequences.png
├── visual-3-hidden-value.png
└── visual-4-solution.png
```

Generate at minimum 1200px wide at 4:5 ratio. Compress to ≤ 120KB each before deployment.

---

## 7. Hyperlink Implementation Notes for Developer

- Every fact link opens in a new tab (`target="_blank" rel="noopener noreferrer"`)
- Link color: `#2563EB` — always underlined, does not change color on hover beyond a 10% darkening
- Do not style citation links with the brand sage green — blue is the universal signal for an external citation and keeps it visually distinct from brand UI elements
- Links must be accessible: ensure 4.5:1 contrast ratio against the white/off-white card background. `#2563EB` on `#FFFFFF` passes at 5.93:1.
- The linked phrase should be the natural language claim — not "source", "click here", or a number. Example: `[80% of organisations are still making decisions on stale data](url)` not `data is stale [1]`.

---

## 8. Definition of Done

- [ ] All four illustration images load correctly, display at 4:5 ratio, and use sage green / mint / warm off-white / near-black palette — no neon green, no pure white background
- [ ] Every fact in the copy that has a source in the table above is hyperlinked in blue
- [ ] All hyperlinks open in a new tab with `rel="noopener noreferrer"`
- [ ] Hyperlink color `#2563EB` passes contrast check against card background
- [ ] MIT Sloan $3 trillion "decisions without past report insights" stat appears in Block 2 with correct Capella Solutions link
- [ ] Closing line of MIT Sloan stat reads exactly: *"Not from lack of activity — but from activity that was never recorded, never reported, and never turned into insight."*
- [ ] Gartner $15 million fact appears in Block 2 with correct link
- [ ] IBM 80% and 85% stale data facts appear in Block 2 with correct links
- [ ] AWS 53% SMB insight fact appears in Block 3 with correct link
- [ ] McKinsey 20% revenue upside fact appears in Block 3 with correct link
- [ ] Illustration palette visually matches the existing site's Sage & Slate design system
- [ ] No bright lime or neon green appears in any illustration
- [ ] Warm coral appears only in Visual 2 on alert/warning elements
- [ ] Section passes Lighthouse accessibility audit ≥ 90 including link contrast
- [ ] All existing items from v1 Definition of Done remain satisfied
