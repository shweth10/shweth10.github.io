const API_BASE_URL = 'https://430cl6azv8.execute-api.ap-southeast-2.amazonaws.com/v1';

const DASHBOARD_COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];

// Extract token: check sessionStorage redirect first (GitHub Pages SPA), then URL path
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

// --- Init ---

document.addEventListener('DOMContentLoaded', () => {
  if (!token || token === 's') {
    showError('not_found');
    return;
  }
  setupTabs();
  loadReport();
});

function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
    });
  });
}

// --- API ---

async function loadReport() {
  try {
    showLoading();
    const res = await fetch(`${API_BASE_URL}/report/share/${token}`);

    if (res.status === 404) { showError('not_found'); return; }
    if (res.status === 410) {
      const data = await res.json();
      showError(data.status || 'expired');
      return;
    }
    if (!res.ok) { showError('error'); return; }

    const json = await res.json();
    renderReport(json.data);
  } catch (e) {
    showError('error');
  }
}

// --- Render ---

function renderReport(data) {
  hideLoading();

  document.getElementById('reportName').textContent = data.reportName || 'Shared Report';
  document.getElementById('templateName').textContent = data.templateName || '';

  const entryCount = data.entries ? data.entries.length : 0;
  document.getElementById('entryCount').textContent = `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}`;

  if (data.updatedAt) {
    document.getElementById('lastUpdated').textContent =
      'Updated ' + dateFormatter.format(new Date(data.updatedAt));
  }

  if (data.ownerDisplayName) {
    document.getElementById('sharedBy').textContent = `Shared by ${data.ownerDisplayName}`;
  }

  renderReportTable(data);

  if (data.dashboard) {
    renderDashboard(data.dashboard, data.currency);
  } else {
    document.querySelector('[data-tab="dashboard"]').classList.add('hidden');
  }

  document.getElementById('footer').classList.remove('hidden');
}

// --- Report Data Tab ---

function renderReportTable(data) {
  const container = document.getElementById('dataTab');
  const columns = data.columns || [];
  const entries = data.entries || [];
  const currency = data.currency || 'USD';
  const fmt = currencyFormatter(currency);

  if (!columns.length) {
    container.innerHTML = '<p class="empty-state">No data in this report.</p>';
    return;
  }

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
    th.textContent = formatColumnName(col.name || col);
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
        td.textContent = '—';
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

// --- Dashboard Tab ---

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
  const fmt = currencyFormatter(currency);
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
    if (kpi.formattedValue) {
      value.textContent = kpi.formattedValue;
    } else if (typeof kpi.value === 'number') {
      value.textContent = kpi.value.toLocaleString('en-US');
    } else {
      value.textContent = kpi.value;
    }

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
    nameSpan.appendChild(document.createTextNode(cat.name));

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

    let type, options;
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } } }
    };

    if (chart.type === 'pieChart' || chart.type === 'donutChart') {
      type = 'doughnut';
      options = { ...baseOptions };
      new Chart(canvas, {
        type,
        data: {
          labels,
          datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }]
        },
        options
      });
    } else if (chart.type === 'barChart') {
      type = 'bar';
      options = { ...baseOptions, scales: { y: { beginAtZero: true } } };
      new Chart(canvas, {
        type,
        data: {
          labels,
          datasets: [{ data: values, backgroundColor: colors, borderRadius: 4 }]
        },
        options
      });
    } else if (chart.type === 'lineChart') {
      type = 'line';
      options = { ...baseOptions, scales: { y: { beginAtZero: true } } };
      new Chart(canvas, {
        type,
        data: {
          labels,
          datasets: [{
            data: values,
            borderColor: DASHBOARD_COLORS[0],
            backgroundColor: DASHBOARD_COLORS[0] + '20',
            fill: true,
            tension: 0.4,
            pointRadius: 4
          }]
        },
        options
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
    meta.textContent = `${fmt.format(merchantTotal)} · ${merchantCount} ${merchantCount === 1 ? 'entry' : 'entries'}`;
    info.appendChild(name);
    info.appendChild(meta);

    row.appendChild(rank);
    row.appendChild(info);

    const pctVal = m.percentageOfTotal || m.percentage;
    if (pctVal != null) {
      const bar = document.createElement('div');
      bar.className = 'merchant-bar';
      const fill = document.createElement('div');
      fill.className = 'progress-fill';
      fill.style.width = `${pctVal}%`;
      fill.style.backgroundColor = DASHBOARD_COLORS[i % DASHBOARD_COLORS.length];
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
  heading.textContent = 'Smart Insights';
  section.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'insights-grid';

  const iconMap = { positive: '\u2713', negative: '\u26A0', neutral: '\u2139', info: '\uD83D\uDCA1' };
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

// --- States ---

function showLoading() {
  document.getElementById('loadingState').classList.remove('hidden');
  document.querySelector('.header').classList.add('hidden');
  document.getElementById('tabBar').classList.add('hidden');
  document.querySelector('.content').classList.add('hidden');
  document.getElementById('errorState').classList.add('hidden');
  document.getElementById('footer').classList.add('hidden');
}

function hideLoading() {
  document.getElementById('loadingState').classList.add('hidden');
  document.querySelector('.header').classList.remove('hidden');
  document.getElementById('tabBar').classList.remove('hidden');
  document.querySelector('.content').classList.remove('hidden');
}

function showError(status) {
  document.getElementById('loadingState').classList.add('hidden');
  document.querySelector('.header').classList.add('hidden');
  document.getElementById('tabBar').classList.add('hidden');
  document.querySelector('.content').classList.add('hidden');
  document.getElementById('footer').classList.add('hidden');

  const errorState = document.getElementById('errorState');
  errorState.classList.remove('hidden');

  const titles = {
    not_found: 'Report Not Found',
    expired: 'Link Expired',
    revoked: 'No Longer Shared',
    error: 'Something Went Wrong'
  };

  const messages = {
    not_found: 'This report was not found. It may have been deleted or the link is incorrect.',
    expired: 'This share link has expired. Ask the report owner for a new link.',
    revoked: 'This report is no longer shared. The owner has revoked access.',
    error: 'Something went wrong. Please try again later.'
  };

  const icons = {
    not_found: '\uD83D\uDD0D',
    expired: '\u23F3',
    revoked: '\uD83D\uDD12',
    error: '\u26A0\uFE0F'
  };

  document.getElementById('errorIcon').textContent = icons[status] || icons.error;
  document.getElementById('errorTitle').textContent = titles[status] || titles.error;
  document.getElementById('errorMessage').textContent = messages[status] || messages.error;
}
