// Firebase Functions Gen 2, per-function Cloud Run URLs. Project hash is
// stable unless the function is deleted and recreated; if share-viewer ever
// breaks with a CORS/404 on load, re-check the deployed URL here.
const GET_SHARED_REPORT_URL = 'https://getsharedreport-zpzuagqvoq-uc.a.run.app';

const DASHBOARD_COLORS = ['#4CAF7D', '#5E5CE6', '#FF6B6B', '#30D5C8', '#FFAB40', '#BF5AF2'];

// Extract token from URL path: /s/{token}
const redirectPath = sessionStorage.getItem('shareRedirect');
if (redirectPath) sessionStorage.removeItem('shareRedirect');
const tokenPath = redirectPath || window.location.pathname;
const pathParts = tokenPath.split('/');
const token = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

const CURRENCY_TYPES = new Set(['currency', 'amount', 'total', 'price', 'cost', 'subtotal', 'tax']);
const DATE_TYPES = new Set(['date', 'datetime', 'invoice_date', 'due_date']);

const currencyFormatter = (currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' });

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: 'numeric'
});

// ── Init ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (!token || token === 's' || token === '') {
    showError('not_found');
    return;
  }
  loadReport();
});

// ── API ──────────────────────────────────────────────────────────────────

async function loadReport() {
  try {
    showLoading();
    const res = await fetch(`${GET_SHARED_REPORT_URL}/${token}`);

    if (res.status === 404) { showError('not_found'); return; }
    if (res.status === 410) {
      const data = await res.json();
      showError(data.status || 'expired');
      return;
    }
    if (res.status === 429) { showError('rate_limited'); return; }
    if (!res.ok) { showError('error'); return; }

    const json = await res.json();
    if (json && json.pinRequired) {
      // PIN-protected shares are not yet supported in this viewer.
      // Server returns {pinRequired: true} with 200, show a clear message.
      showError('pin_required');
      return;
    }
    renderReport(json.data || json);
  } catch (e) {
    showError('error');
  }
}

// ── Render Report ────────────────────────────────────────────────────────

function renderReport(data) {
  hideLoading();

  document.getElementById('reportName').textContent = data.reportName || 'Shared Report';
  document.getElementById('templateName').textContent = data.templateName || '';

  const entryCount = data.entries ? data.entries.length : 0;
  document.getElementById('entryCount').textContent = `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}`;

  if (data.updatedAt) {
    document.getElementById('lastUpdated').textContent =
      'Updated ' + dateFormatter.format(new Date(data.updatedAt));
  } else {
    document.getElementById('updatedDot').classList.add('hidden');
    document.getElementById('lastUpdated').classList.add('hidden');
  }

  if (data.ownerDisplayName) {
    document.getElementById('sharedBy').textContent = `Shared by ${data.ownerDisplayName}`;
  }

  renderReportTable(data);

  // Use server-computed dashboard if available, otherwise compute client-side
  const dashboard = data.dashboard || computeDashboardFromEntries(data);
  if (dashboard) {
    document.getElementById('dashboardSection').classList.remove('hidden');
    renderDashboard(dashboard, data.currency);
  }

  document.getElementById('footer').classList.remove('hidden');
}

// ── Report Data Tab ──────────────────────────────────────────────────────

function renderReportTable(data) {
  const container = document.getElementById('dataTab');
  const columns = data.columns || [];
  const rawEntries = data.entries || [];
  const currency = data.currency || 'USD';
  const fmt = currencyFormatter(currency);

  if (!columns.length) {
    container.innerHTML = '<p class="empty-state">No data in this report.</p>';
    return;
  }

  // Default sort: most recent first by the report's primary date column.
  // Industry-standard convention for financial / expense reports — the
  // newest entries are usually what readers want to see. Falls back to
  // the original insertion order when no date column is detected, or
  // when an entry's date is unparseable (preserved at the tail).
  let sortDateCol = null;
  for (const col of columns) {
    const cName = col.name || col;
    const cType = (col.type || '').toLowerCase();
    if (isDateType(cType, cName)) {
      sortDateCol = cName;
      break;
    }
  }
  const entries = sortDateCol
    ? rawEntries
        .map((entry, originalIndex) => {
          const raw = entry && entry.fields ? entry.fields[sortDateCol] : null;
          const t = raw ? new Date(raw).getTime() : NaN;
          return { entry, originalIndex, t: Number.isFinite(t) ? t : -Infinity };
        })
        .sort((a, b) => {
          // Newest first. Stable on ties via originalIndex.
          if (b.t !== a.t) return b.t - a.t;
          return a.originalIndex - b.originalIndex;
        })
        .map(x => x.entry)
    : rawEntries;

  const wrapper = document.createElement('div');
  wrapper.className = 'table-scroll';

  const table = document.createElement('table');
  table.className = 'report-table';

  // Header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const numTh = document.createElement('th');
  numTh.textContent = '#';
  numTh.className = 'row-num';
  headerRow.appendChild(numTh);

  columns.forEach(col => {
    const th = document.createElement('th');
    const colName = col.name || col;
    const colType = (col.type || '').toLowerCase();
    const label = formatColumnName(colName);
    if (sortDateCol && colName === sortDateCol) {
      // Visual cue that this column is the active sort key (descending).
      // Span lets us style the arrow separately from the label without
      // breaking the column's existing right-align rules.
      th.innerHTML = '';
      const labelSpan = document.createElement('span');
      labelSpan.textContent = label;
      const arrowSpan = document.createElement('span');
      arrowSpan.className = 'sort-arrow';
      arrowSpan.textContent = ' ▼';
      arrowSpan.setAttribute('aria-label', 'sorted descending');
      th.appendChild(labelSpan);
      th.appendChild(arrowSpan);
    } else {
      th.textContent = label;
    }
    if (isCurrencyType(colType, colName) || isNumberType(colType)) {
      th.style.textAlign = 'right';
    }
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  const totals = {};

  entries.forEach((entry, idx) => {
    const tr = document.createElement('tr');
    const numTd = document.createElement('td');
    numTd.textContent = idx + 1;
    numTd.className = 'row-num';
    tr.appendChild(numTd);

    columns.forEach(col => {
      const td = document.createElement('td');
      const colName = col.name || col;
      const colType = (col.type || '').toLowerCase();
      const raw = entry.fields ? entry.fields[colName] : entry[colName];

      if (raw == null || raw === '') {
        td.textContent = '\u2014';
        td.className = 'empty-cell';
      } else if (isCurrencyType(colType, colName)) {
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          td.textContent = fmt.format(num);
          td.className = 'cell-currency';
          totals[colName] = (totals[colName] || 0) + num;
        } else {
          td.textContent = raw;
        }
      } else if (isDateType(colType, colName)) {
        const d = new Date(raw);
        td.textContent = isNaN(d.getTime()) ? raw : dateFormatter.format(d);
      } else if (isNumberType(colType)) {
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          td.textContent = num.toLocaleString('en-US');
          td.className = 'cell-number';
          totals[colName] = (totals[colName] || 0) + num;
        } else {
          td.textContent = raw;
        }
      } else {
        td.textContent = raw;
      }

      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  // Totals row
  if (Object.keys(totals).length > 0) {
    const totalRow = document.createElement('tr');
    totalRow.className = 'totals-row';
    const totalLabel = document.createElement('td');
    totalLabel.textContent = 'Total';
    totalLabel.className = 'row-num';
    totalRow.appendChild(totalLabel);

    columns.forEach(col => {
      const td = document.createElement('td');
      const colName = col.name || col;
      const colType = (col.type || '').toLowerCase();

      if (totals[colName] !== undefined) {
        if (isCurrencyType(colType, colName)) {
          td.textContent = fmt.format(totals[colName]);
          td.className = 'cell-currency';
        } else {
          td.textContent = totals[colName].toLocaleString('en-US');
          td.className = 'cell-number';
        }
      }
      totalRow.appendChild(td);
    });
    tbody.appendChild(totalRow);
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.appendChild(wrapper);
}

function formatColumnName(name) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function isCurrencyType(type, name) {
  if (CURRENCY_TYPES.has(type)) return true;
  const lower = (name || '').toLowerCase();
  return CURRENCY_TYPES.has(lower) || /amount|total|price|cost|tax|subtotal/.test(lower);
}

function isDateType(type, name) {
  if (DATE_TYPES.has(type)) return true;
  const lower = (name || '').toLowerCase();
  return /date/.test(lower);
}

function isNumberType(type) {
  return type === 'number' || type === 'quantity' || type === 'integer';
}

// ── Client-Side Dashboard Computation ─────────────────────────────────────

function computeDashboardFromEntries(data) {
  const entries = data.entries || [];
  const columns = data.columns || [];
  if (entries.length < 2) return null;

  const parseNum = (v) => v != null ? parseFloat(String(v).replace(/[^0-9.\-]/g, '')) : NaN;

  // Find the primary currency/amount field
  let amountCol = null;
  for (const col of columns) {
    const name = col.name || col;
    const type = (col.type || '').toLowerCase();
    if (isCurrencyType(type, name)) { amountCol = name; break; }
  }
  if (!amountCol) {
    for (const col of columns) {
      const name = col.name || col;
      const vals = entries.map(e => e.fields ? e.fields[name] : null).filter(v => v != null && v !== '');
      if (vals.length === 0) continue;
      if (vals.filter(v => !isNaN(parseNum(v))).length > vals.length * 0.6) { amountCol = name; break; }
    }
  }
  if (!amountCol) return null;

  // Find date field
  let dateCol = null;
  for (const col of columns) {
    const name = col.name || col;
    const type = (col.type || '').toLowerCase();
    if (isDateType(type, name)) { dateCol = name; break; }
  }

  // Find text field for categories (first non-amount, non-date text column)
  let catCol = null;
  for (const col of columns) {
    const name = col.name || col;
    const type = (col.type || '').toLowerCase();
    if (name === amountCol || name === dateCol) continue;
    if (isCurrencyType(type, name) || isDateType(type, name) || isNumberType(type)) continue;
    const vals = entries.map(e => e.fields ? e.fields[name] : null).filter(v => v != null && v !== '');
    if (vals.length > 0) { catCol = name; break; }
  }

  // Parse amounts
  const amounts = entries.map(e => {
    const raw = e.fields ? e.fields[amountCol] : null;
    return parseNum(raw);
  }).filter(v => !isNaN(v));
  if (amounts.length === 0) return null;

  const total = amounts.reduce((a, b) => a + b, 0);
  const avg = total / amounts.length;
  const highest = Math.max(...amounts);
  const fmt = currencyFormatter(data.currency);

  // KPIs
  const kpis = [
    { title: 'ENTRIES', value: entries.length, formattedValue: String(entries.length), entryCount: entries.length },
    { title: 'TOTAL AMOUNT', value: total, formattedValue: fmt.format(total), entryCount: amounts.length },
    { title: 'AVERAGE AMOUNT', value: avg, formattedValue: fmt.format(avg), entryCount: amounts.length },
    { title: 'HIGHEST', value: highest, formattedValue: fmt.format(highest), entryCount: 1 },
  ];

  // Category Breakdown
  let categoryBreakdown = [];
  if (catCol && total > 0) {
    const catTotals = {};
    entries.forEach(e => {
      const cat = (e.fields ? e.fields[catCol] : null) || 'Other';
      const val = parseNum(e.fields ? e.fields[amountCol] : null);
      if (!isNaN(val)) catTotals[cat] = (catTotals[cat] || 0) + val;
    });
    categoryBreakdown = Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category, amount: Math.round(amount * 100) / 100,
        percentage: Math.round((amount / total) * 1000) / 10,
      }));
  }

  // Daily Spending (bar chart), group amounts by date
  let charts = [];
  if (dateCol) {
    const dailyTotals = {};
    entries.forEach(e => {
      const dateRaw = e.fields ? e.fields[dateCol] : null;
      const val = parseNum(e.fields ? e.fields[amountCol] : null);
      if (!dateRaw || isNaN(val)) return;
      const d = new Date(dateRaw);
      if (isNaN(d.getTime())) return;
      const key = d.toISOString().substring(0, 10);
      dailyTotals[key] = (dailyTotals[key] || 0) + val;
    });
    const sorted = Object.entries(dailyTotals).sort((a, b) => a[0].localeCompare(b[0]));
    if (sorted.length > 0) {
      charts.push({
        title: 'Daily Spending',
        type: 'barChart',
        dataPoints: sorted.map(([label, value]) => ({
          label: new Date(label + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Math.round(value * 100) / 100,
          colorIndex: 0,
        })),
      });
    }

    // Monthly Trend (line chart), only if 2+ months
    const monthlyTotals = {};
    entries.forEach(e => {
      const dateRaw = e.fields ? e.fields[dateCol] : null;
      const val = parseNum(e.fields ? e.fields[amountCol] : null);
      if (!dateRaw || isNaN(val)) return;
      const d = new Date(dateRaw);
      if (isNaN(d.getTime())) return;
      const key = d.toISOString().substring(0, 7);
      monthlyTotals[key] = (monthlyTotals[key] || 0) + val;
    });
    const monthSorted = Object.entries(monthlyTotals).sort((a, b) => a[0].localeCompare(b[0]));
    if (monthSorted.length >= 2) {
      charts.push({
        title: 'Monthly Trend',
        type: 'lineChart',
        dataPoints: monthSorted.map(([label, value]) => ({
          label: new Date(label + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          value: Math.round(value * 100) / 100,
          colorIndex: 0,
        })),
      });
    }
  }

  // Top Merchants, group by category field, include transaction count
  let topMerchants = [];
  if (catCol && total > 0) {
    const merchantData = {};
    entries.forEach(e => {
      const name = (e.fields ? e.fields[catCol] : null) || 'Other';
      const val = parseNum(e.fields ? e.fields[amountCol] : null);
      if (isNaN(val)) return;
      if (!merchantData[name]) merchantData[name] = { amount: 0, count: 0 };
      merchantData[name].amount += val;
      merchantData[name].count += 1;
    });
    topMerchants = Object.entries(merchantData)
      .sort((a, b) => b[1].amount - a[1].amount)
      .slice(0, 10)
      .map(([merchant, d]) => ({
        merchant,
        totalSpent: Math.round(d.amount * 100) / 100,
        transactionCount: d.count,
        percentageOfTotal: Math.round((d.amount / total) * 1000) / 10,
      }));
  }

  // Smart Insights
  const insights = [];
  if (categoryBreakdown.length > 0) {
    const top = categoryBreakdown[0];
    insights.push({
      text: `${top.category} is your top expense at ${fmt.format(top.amount)} (${top.percentage}%)`,
      type: 'info',
    });
  }
  // Largest single expense
  let maxEntry = null, maxVal = 0;
  entries.forEach(e => {
    const val = parseNum(e.fields ? e.fields[amountCol] : null);
    if (!isNaN(val) && val > maxVal) {
      maxVal = val;
      maxEntry = e;
    }
  });
  if (maxEntry) {
    const who = catCol && maxEntry.fields ? maxEntry.fields[catCol] : null;
    const when = dateCol && maxEntry.fields ? maxEntry.fields[dateCol] : null;
    let text = `Largest expense: ${fmt.format(maxVal)}`;
    if (who) text += ` at ${who}`;
    if (when) text += ` on ${when}`;
    insights.push({ text, type: 'neutral' });
  }

  return {
    kpis,
    categoryBreakdown: categoryBreakdown.length > 0 ? categoryBreakdown : null,
    charts: charts.length > 0 ? charts : null,
    topMerchants: topMerchants.length > 0 ? topMerchants : null,
    insights: insights.length > 0 ? insights : null,
  };
}

// ── Dashboard Tab ────────────────────────────────────────────────────────

function renderDashboard(dashboard, currency) {
  const container = document.getElementById('dashboardTab');
  container.innerHTML = '';

  if (dashboard.kpis && dashboard.kpis.length) {
    renderKPIs(container, dashboard.kpis, currency);
  }
  if (dashboard.categoryBreakdown && dashboard.categoryBreakdown.length) {
    renderCategoryBreakdown(container, dashboard.categoryBreakdown, currency);
  }
  if (dashboard.charts && dashboard.charts.length) {
    renderCharts(container, dashboard.charts);
  }
  if (dashboard.topMerchants && dashboard.topMerchants.length) {
    renderTopMerchants(container, dashboard.topMerchants, currency);
  }
  if (dashboard.insights && dashboard.insights.length) {
    renderInsights(container, dashboard.insights);
  }
}

function renderKPIs(container, kpis, currency) {
  const grid = document.createElement('div');
  grid.className = 'kpi-grid';

  kpis.forEach((kpi, i) => {
    const card = document.createElement('div');
    card.className = 'kpi-card';
    card.style.borderLeftColor = DASHBOARD_COLORS[i % DASHBOARD_COLORS.length];

    const title = document.createElement('div');
    title.className = 'kpi-title';
    title.textContent = (kpi.title || '').toUpperCase();

    const value = document.createElement('div');
    value.className = 'kpi-value';
    value.textContent = kpi.formattedValue || (typeof kpi.value === 'number' ? kpi.value.toLocaleString('en-US') : kpi.value);

    card.appendChild(title);
    card.appendChild(value);

    if (kpi.entryCount != null) {
      const count = document.createElement('div');
      count.className = 'kpi-count';
      count.textContent = `${kpi.entryCount} ${kpi.entryCount === 1 ? 'entry' : 'entries'}`;
      card.appendChild(count);
    }

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function renderCategoryBreakdown(container, categories, currency) {
  const fmt = currencyFormatter(currency);
  const sorted = [...categories].sort((a, b) => (b.amount || 0) - (a.amount || 0));

  const section = document.createElement('div');
  section.className = 'dashboard-card';

  const heading = document.createElement('h3');
  heading.textContent = 'Category Breakdown';
  section.appendChild(heading);

  sorted.forEach((cat, i) => {
    const row = document.createElement('div');
    row.className = 'category-row';

    const header = document.createElement('div');
    header.className = 'category-header';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'category-name';
    const dot = document.createElement('span');
    dot.className = 'color-dot';
    dot.style.backgroundColor = DASHBOARD_COLORS[i % DASHBOARD_COLORS.length];
    nameSpan.appendChild(dot);
    nameSpan.appendChild(document.createTextNode(cat.category || cat.name));

    const valueSpan = document.createElement('span');
    valueSpan.className = 'category-value';
    valueSpan.textContent = `${fmt.format(cat.amount || 0)}  (${(cat.percentage || 0).toFixed(1)}%)`;

    header.appendChild(nameSpan);
    header.appendChild(valueSpan);
    row.appendChild(header);

    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.width = `${cat.percentage || 0}%`;
    fill.style.backgroundColor = DASHBOARD_COLORS[i % DASHBOARD_COLORS.length];
    bar.appendChild(fill);
    row.appendChild(bar);

    section.appendChild(row);
  });

  container.appendChild(section);
}

function renderCharts(container, charts) {
  const grid = document.createElement('div');
  grid.className = 'chart-grid';

  charts.forEach(chart => {
    const card = document.createElement('div');
    card.className = 'dashboard-card chart-card';

    if (chart.title) {
      const heading = document.createElement('h3');
      heading.textContent = chart.title;
      card.appendChild(heading);
    }

    const canvas = document.createElement('canvas');
    card.appendChild(canvas);
    grid.appendChild(card);

    const labels = (chart.dataPoints || []).map(dp => dp.label);
    const values = (chart.dataPoints || []).map(dp => dp.value);
    const colors = (chart.dataPoints || []).map((_, i) => DASHBOARD_COLORS[i % DASHBOARD_COLORS.length]);

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { family: 'Inter', size: 11 } } }
      }
    };

    if (chart.type === 'pieChart' || chart.type === 'donutChart') {
      new Chart(canvas, {
        type: 'doughnut',
        data: { labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, borderRadius: 2 }] },
        options: baseOptions
      });
    } else if (chart.type === 'barChart') {
      new Chart(canvas, {
        type: 'bar',
        data: { labels, datasets: [{ data: values, backgroundColor: DASHBOARD_COLORS[0] + '80', borderColor: DASHBOARD_COLORS[0], borderWidth: 1, borderRadius: 4 }] },
        options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#F0F1F3' } }, x: { grid: { display: false } } } }
      });
    } else if (chart.type === 'lineChart') {
      new Chart(canvas, {
        type: 'line',
        data: { labels, datasets: [{ data: values, borderColor: DASHBOARD_COLORS[0], backgroundColor: DASHBOARD_COLORS[0] + '15', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: '#fff', pointBorderColor: DASHBOARD_COLORS[0], pointBorderWidth: 2 }] },
        options: { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#F0F1F3' } }, x: { grid: { display: false } } } }
      });
    }
  });

  container.appendChild(grid);
}

function renderTopMerchants(container, merchants, currency) {
  const fmt = currencyFormatter(currency);
  const section = document.createElement('div');
  section.className = 'dashboard-card';

  const heading = document.createElement('h3');
  heading.textContent = 'Top Merchants';
  section.appendChild(heading);

  merchants.forEach((m, i) => {
    const row = document.createElement('div');
    row.className = 'merchant-row';

    const rank = document.createElement('span');
    rank.className = 'merchant-rank';
    rank.textContent = i + 1;

    const info = document.createElement('div');
    info.className = 'merchant-info';
    const name = document.createElement('span');
    name.className = 'merchant-name';
    name.textContent = m.merchant || m.name || '';
    const meta = document.createElement('span');
    meta.className = 'merchant-meta';
    const merchantTotal = m.totalSpent || m.total || 0;
    const merchantCount = m.transactionCount || m.count || 0;
    meta.textContent = `${fmt.format(merchantTotal)} \u00B7 ${merchantCount} ${merchantCount === 1 ? 'entry' : 'entries'}`;
    info.appendChild(name);
    info.appendChild(meta);

    row.appendChild(rank);
    row.appendChild(info);

    const pctVal = m.percentageOfTotal || m.percentage;
    if (pctVal != null) {
      const bar = document.createElement('div');
      bar.className = 'merchant-bar';
      const fill = document.createElement('div');
      fill.className = 'progress-bar';
      const fillInner = document.createElement('div');
      fillInner.className = 'progress-fill';
      fillInner.style.width = `${pctVal}%`;
      fillInner.style.backgroundColor = DASHBOARD_COLORS[i % DASHBOARD_COLORS.length];
      fill.appendChild(fillInner);
      bar.appendChild(fill);
      row.appendChild(bar);
    }

    section.appendChild(row);
  });

  container.appendChild(section);
}

function renderInsights(container, insights) {
  const section = document.createElement('div');
  section.className = 'dashboard-card';

  const heading = document.createElement('h3');
  heading.textContent = 'Insights';
  section.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'insights-grid';

  const iconMap = { positive: '\u2713', negative: '\u26A0', neutral: '\u2139', info: '\u2139' };
  const classMap = { positive: 'insight-positive', negative: 'insight-negative', neutral: 'insight-neutral', info: 'insight-info' };

  insights.forEach(insight => {
    const tile = document.createElement('div');
    const sentimentKey = insight.type || insight.sentiment || 'neutral';
    tile.className = `insight-tile ${classMap[sentimentKey] || 'insight-neutral'}`;

    const icon = document.createElement('span');
    icon.className = 'insight-icon';
    icon.textContent = iconMap[sentimentKey] || iconMap.neutral;

    const text = document.createElement('span');
    text.textContent = insight.text;

    tile.appendChild(icon);
    tile.appendChild(text);
    grid.appendChild(tile);
  });

  section.appendChild(grid);
  container.appendChild(section);
}

// ── States ───────────────────────────────────────────────────────────────

function showLoading() {
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('reportContent').classList.add('hidden');
  document.getElementById('errorState').classList.add('hidden');
  document.getElementById('footer').classList.add('hidden');
}

function hideLoading() {
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('reportContent').classList.remove('hidden');
}

function showError(status) {
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('reportContent').classList.add('hidden');
  document.getElementById('footer').classList.add('hidden');

  const errorState = document.getElementById('errorState');
  errorState.classList.remove('hidden');

  const titles = {
    not_found: 'Report Not Found',
    expired: 'Link Expired',
    revoked: 'No Longer Shared',
    rate_limited: 'Too Many Requests',
    pin_required: 'PIN Required',
    error: 'Something Went Wrong'
  };

  const messages = {
    not_found: 'This report was not found. It may have been deleted or the link is incorrect.',
    expired: 'This share link has expired. Ask the report owner for a new link.',
    revoked: 'This report is no longer shared. The owner has revoked access.',
    rate_limited: 'Too many requests in a short time. Please wait a moment and try again.',
    pin_required: 'This report is protected with a PIN. Open the link in the LensReport mobile app to enter it.',
    error: 'Something went wrong loading this report. Please try again later.'
  };

  const icons = {
    not_found: '\uD83D\uDD0D',
    expired: '\u23F3',
    revoked: '\uD83D\uDD12',
    rate_limited: '\u23F1\uFE0F',
    pin_required: '\uD83D\uDD10',
    error: '\u26A0\uFE0F'
  };

  document.getElementById('errorIcon').textContent = icons[status] || icons.error;
  document.getElementById('errorTitle').textContent = titles[status] || titles.error;
  document.getElementById('errorMessage').textContent = messages[status] || messages.error;
}
