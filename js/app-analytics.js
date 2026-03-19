/* ============================================================
   FitTrack – Analytics Page JS
   ============================================================ */

function switchDiaryTab(tab) {
  document.querySelectorAll('.diary-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.diary-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.diary-tab[onclick*="${tab}"]`).classList.add('active');
  document.getElementById(`diary-${tab}`).classList.add('active');
  if (tab === 'trainings') loadDiaryTrainings();
  if (tab === 'progress') renderProgressChart();
}

let _diarySessions = [];

async function loadDiaryTrainings() {
  const user = getSession(); if (!user) return;
  const container = document.getElementById('diary-trainings-list');
  if (!container) return;
  container.innerHTML = '<p style="text-align:center;color:var(--gray);font-size:14px;padding:20px 0">Loading…</p>';
  const logs = await getCombinedLogs(user);
  if (logs.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray);font-size:14px;padding:20px 0">No trainings logged yet.</p>';
    return;
  }
  _diarySessions = [];
  const sorted = [...logs].sort((a, b) => new Date(b.logged_at || b.created_at) - new Date(a.logged_at || a.created_at));
  container.innerHTML = sorted.map(l => {
    const d = new Date(l.logged_at || l.created_at);
    const dateStr = d.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
    const timeStr = d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    if (l._isSession) {
      const idx = _diarySessions.length;
      _diarySessions.push(l);
      const exercises = Array.isArray(l.exercises) ? l.exercises : [];
      return `<div class="diary-log-item diary-session-clickable" onclick="openDiarySessionSpectate(${idx})" style="cursor:pointer">
        <div style="flex:1;min-width:0">
          <div class="diary-log-title">${l.title}</div>
          <div class="diary-log-exercise-count">${exercises.length} exercise${exercises.length !== 1 ? 's' : ''}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;padding-left:10px">
          <div class="diary-log-date">${dateStr}</div>
          <div class="diary-log-date">${timeStr}</div>
          <div class="diary-log-view">View →</div>
        </div>
      </div>`;
    }
    const weightStr = l.weight ? `<div class="diary-log-weight">${l.weight} kg</div>` : '';
    return `<div class="diary-log-item">
      <div>
        <div class="diary-log-title">${l.title}</div>
        ${weightStr}
      </div>
      <div style="text-align:right">
        <div class="diary-log-date">${dateStr}</div>
        <div class="diary-log-date">${timeStr}</div>
      </div>
    </div>`;
  }).join('');
}

function openDiarySessionSpectate(idx) {
  const session = _diarySessions[idx];
  if (!session) return;
  const exercises = session.exercises || [];
  const exHtml = exercises.map(ex => {
    const setsStr = (ex.sets || []).map(s => `${s.weight}kg × ${s.reps}`).join(', ');
    return `<div class="spectate-exercise">
      <div class="spectate-ex-name">${ex.name}</div>
      ${setsStr ? `<div class="spectate-ex-sets">${setsStr}</div>` : ''}
    </div>`;
  }).join('');
  const existing = document.getElementById('diary-spectate-modal');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'diary-spectate-modal';
  el.className = 'modal-overlay open';
  el.innerHTML = `
    <div class="modal-card" style="max-height:80vh;display:flex;flex-direction:column">
      <div class="modal-header" style="flex-shrink:0">
        <div class="modal-title">${session.title}</div>
        <button class="modal-close" onclick="document.getElementById('diary-spectate-modal').remove()">×</button>
      </div>
      <div style="overflow-y:auto;flex:1;padding:8px 0">
        ${exHtml || '<p style="color:var(--gray);text-align:center;padding:20px">No exercises recorded.</p>'}
      </div>
    </div>`;
  document.body.appendChild(el);
}

let _progressChartHash = null;

function renderProgressChart() {
  const svg = document.getElementById('progress-weight-svg');
  if (!svg) return;
  const user = getSession(); if (!user) return;
  const logs = getTrainingLogs(user).filter(l => l.weight);
  const hash = logs.map(l => l.logged_at + ':' + l.weight).join('|');
  if (hash === _progressChartHash) return;
  _progressChartHash = hash;
  const summaryEl = document.getElementById('progress-summary');
  if (logs.length < 2) {
    svg.innerHTML = '<text x="150" y="80" text-anchor="middle" fill="#7a84a0" font-size="13">Mindestens 2 Gewichtseinträge nötig</text>';
    if (summaryEl) summaryEl.innerHTML = '';
    return;
  }
  // Weight difference summary
  if (summaryEl) {
    const sortedForDiff = [...logs].sort((a, b) => new Date(a.logged_at) - new Date(b.logged_at));
    const firstW = sortedForDiff[0].weight;
    const lastW = sortedForDiff[sortedForDiff.length - 1].weight;
    const diff = lastW - firstW;
    const absDiff = Math.abs(diff).toFixed(1);
    const gained = diff > 0;
    const color = gained ? '#E74C3C' : '#36B37E';
    const sign = gained ? '+' : '-';
    const msg = gained ? 'zugenommen. Bulk weiter!' : 'abgenommen. Niemand wird dich im Sommer erkennen!';
    summaryEl.innerHTML = `
      <div style="font-size:12px;color:var(--gray);margin-bottom:4px">du hast seit Beginn...</div>
      <div style="font-size:clamp(48px,12vw,72px);font-weight:900;color:${color};line-height:1">${sign}${absDiff} kg</div>
      <div style="font-size:12px;color:var(--gray);margin-top:6px">${msg}</div>
    `;
  }
  const sorted = [...logs].sort((a, b) => new Date(a.logged_at) - new Date(b.logged_at));
  const weights = sorted.map(l => l.weight);
  const minW = Math.min(...weights), maxW = Math.max(...weights);
  const range = maxW - minW || 1;
  const W = 300, H = 150, PAD = 40;
  const xStep = (W - PAD * 2) / Math.max(sorted.length - 1, 1);
  const points = sorted.map((l, i) => ({
    x: PAD + i * xStep,
    y: H - PAD - ((l.weight - minW) / range) * (H - PAD * 2),
    weight: l.weight,
    date: new Date(l.logged_at).toLocaleDateString('de-DE', { day:'numeric', month:'short' })
  }));
  let paths = '';
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i], p2 = points[i + 1];
    const color = p2.weight < p1.weight ? '#36B37E' : p2.weight > p1.weight ? '#E74C3C' : '#1a6fff';
    paths += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  }
  const dots = points.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="5" fill="#050d1f" stroke="#1a6fff" stroke-width="2"/>
    <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="#e8edf5" font-size="10" font-weight="bold">${p.weight}</text>
    <text x="${p.x}" y="${H - 8}" text-anchor="middle" fill="#7a84a0" font-size="8">${p.date}</text>
  `).join('');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = paths + dots;
}

let _analyticsAllLogs = [];

async function loadAnalyticsPage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  _analyticsAllLogs = await getCombinedLogs(user);
  renderAnalyticsCalendar(user, _analyticsAllLogs);
  renderWeeklyChart(user, _analyticsAllLogs);
}

let analyticsMonth = new Date().getMonth();
let analyticsYear = new Date().getFullYear();

function renderAnalyticsCalendar(user, logs) {
  const year = analyticsYear, month = analyticsMonth;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date(); today.setHours(0,0,0,0);
  const monthName = firstDay.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const trainedDays = new Set(
    logs.filter(l => {
      const d = new Date(l.logged_at);
      return d.getMonth() === month && d.getFullYear() === year;
    }).map(l => new Date(l.logged_at).getDate())
  );
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;
  let cells = '';
  for (let i = 0; i < startDow; i++) cells += `<div class="cal-day cal-day-empty"></div>`;
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const thisDate = new Date(year, month, d);
    const isFuture = thisDate > today;
    const trained = trainedDays.has(d);
    let cls = trained ? 'cal-day-trained' : (isFuture ? 'cal-day-future' : 'cal-day-missed');
    cells += `<div class="cal-day ${cls}">${d}</div>`;
  }
  const calEl = document.getElementById('analytics-calendar');
  if (!calEl) return;
  calEl.innerHTML = cells;
  const titleEl = document.getElementById('analytics-month-title');
  if (titleEl) titleEl.textContent = monthName;
}

function changeAnalyticsMonth(delta) {
  analyticsMonth += delta;
  if (analyticsMonth < 0) { analyticsMonth = 11; analyticsYear--; }
  if (analyticsMonth > 11) { analyticsMonth = 0; analyticsYear++; }
  _weeklyChartHash = null; // force re-render on month change
  const user = getSession(); if (!user) return;
  renderAnalyticsCalendar(user, _analyticsAllLogs);
  renderWeeklyChart(user, _analyticsAllLogs);
}

let _weeklyChartHash = null;

function renderWeeklyChart(user, logs) {
  const svg = document.getElementById('analytics-chart-svg');
  if (!svg) return;
  const year = analyticsYear, month = analyticsMonth;
  const weeklyHash = year + '-' + month + ':' + (logs ? logs.length : 0);
  if (weeklyHash === _weeklyChartHash) return;
  _weeklyChartHash = weeklyHash;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month, daysInMonth);

  // Start from Monday of the week that contains the 1st of the month
  const dow = firstDay.getDay(); // 0=Sun, 1=Mon…
  const daysFromMon = dow === 0 ? 6 : dow - 1;
  const cursor = new Date(firstDay);
  cursor.setDate(cursor.getDate() - daysFromMon);

  const weeks = [];
  while (cursor <= lastDay) {
    const wStart = new Date(cursor);
    const wEnd   = new Date(cursor); wEnd.setDate(wEnd.getDate() + 6);
    // Clamp to month boundaries for label & counting
    const dayFrom = wStart.getMonth() === month ? wStart.getDate() : 1;
    const dayTo   = wEnd.getMonth()   === month ? wEnd.getDate()   : daysInMonth;
    const count = logs.filter(l => {
      const d = new Date(l.logged_at);
      if (d.getMonth() !== month || d.getFullYear() !== year) return false;
      const day = d.getDate();
      return day >= dayFrom && day <= dayTo;
    }).length;
    weeks.push({ label: `${dayFrom}–${dayTo}`, count });
    cursor.setDate(cursor.getDate() + 7);
  }

  const n = weeks.length;
  const maxCount = Math.max(...weeks.map(w => w.count), 1);
  // Widen chart proportionally so labels never overlap
  const W = Math.max(300, n * 54 + 40);
  const H = 150, PAD = 32;
  const xStep = (W - PAD * 2) / Math.max(n - 1, 1);
  const lblSize = n >= 6 ? 7 : 8;

  const points = weeks.map((w, i) => ({
    x: PAD + i * xStep,
    y: H - PAD - (w.count / maxCount) * (H - PAD * 2),
    count: w.count,
    label: w.label
  }));

  let paths = '';
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i], p2 = points[i + 1];
    const color = p2.count > p1.count ? '#36B37E' : p2.count < p1.count ? '#E74C3C' : '#1a6fff';
    paths += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  }
  const dots = points.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="5" fill="#050d1f" stroke="#1a6fff" stroke-width="2"/>
    <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="#e8edf5" font-size="10" font-weight="bold">${p.count}</text>
    <text x="${p.x}" y="${H - 5}" text-anchor="middle" fill="#7a84a0" font-size="${lblSize}">${p.label}</text>
  `).join('');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = paths + dots;
}
