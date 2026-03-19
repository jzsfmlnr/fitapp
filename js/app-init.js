/* ============================================================
   FitTrack – Init JS (runs on every page)
   ============================================================ */

// ── Weigh-in Modal ────────────────────────────────────────────
function injectWeighInModal() {
  if (document.getElementById('weighin-modal')) return;
  const weights = [];
  for (let w = 65; w <= 110; w += 0.5) weights.push(w);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-overlay" id="weighin-modal">
      <div class="modal-card" style="max-width:360px">
        <div class="modal-header">
          <div class="modal-title">⚖️ Weigh-in</div>
          <button class="modal-close" onclick="closeWeighInModal()">×</button>
        </div>
        <div style="padding:4px 0 8px">
          <label style="font-size:13px;font-weight:600;color:var(--gray);display:block;margin-bottom:8px">Gewicht (kg)</label>
          <select id="weighin-kg-select" style="width:100%;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card-2);color:var(--black);font-size:16px;outline:none">
            ${weights.map(w => `<option value="${w}">${w} kg</option>`).join('')}
          </select>
          <label style="font-size:13px;font-weight:600;color:var(--gray);display:block;margin-top:16px;margin-bottom:8px">Uhrzeit</label>
          <input type="time" id="weighin-time-input" value="${timeStr}" style="width:100%;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card-2);color:var(--black);font-size:16px;outline:none" />
          <button onclick="confirmWeighIn()" style="margin-top:20px;width:100%;padding:14px;border-radius:var(--radius-sm);border:none;background:var(--blue);color:#fff;font-weight:700;font-size:16px;cursor:pointer">Speichern ✓</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el.firstElementChild);
}

function openWeighInModal() {
  const user = getSession(); if (!user) return;
  injectWeighInModal();
  const today = getTodayKey();
  const weighins = getWeighIns(user);
  const existing = weighins.find(w => w.date === today);
  if (existing) {
    const sel = document.getElementById('weighin-kg-select');
    if (sel) sel.value = existing.weight;
    const timeInput = document.getElementById('weighin-time-input');
    if (timeInput && existing.time) timeInput.value = existing.time;
  }
  document.getElementById('weighin-modal').classList.add('open');
}

function closeWeighInModal() {
  const m = document.getElementById('weighin-modal');
  if (m) m.classList.remove('open');
}

function confirmWeighIn() {
  const user = getSession(); if (!user) return;
  const weight = parseFloat(document.getElementById('weighin-kg-select').value);
  const time = document.getElementById('weighin-time-input').value;
  const today = getTodayKey();
  const weighins = getWeighIns(user);
  const idx = weighins.findIndex(w => w.date === today);
  if (idx >= 0) weighins[idx] = { date: today, weight, time };
  else weighins.push({ date: today, weight, time });
  saveWeighIns(user, weighins);
  closeWeighInModal();
  loadHomePage();
}

// ── Workout Done Modal ────────────────────────────────────────
function injectWorkoutDoneModal() {
  if (document.getElementById('workout-done-modal')) return;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-overlay" id="workout-done-modal">
      <div class="modal-card" style="max-width:500px">
        <div class="modal-header">
          <div class="modal-title">🏋️ Workout done?</div>
          <button class="modal-close" onclick="closeWorkoutDoneModal()">×</button>
        </div>
        <div id="workout-done-modal-body"></div>
      </div>
    </div>`;
  document.body.appendChild(el.firstElementChild);
}

async function openWorkoutDoneModal() {
  injectWorkoutDoneModal();
  const user = getSession(); if (!user) return;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const today = getTodayKey();
  const logs = getTrainingLogs(user);
  const todayLog = logs.find(l => l.logged_at && getLocalDateKey(l.logged_at) === today);
  const { data: trainings } = await db.from('trainings').select('id,title').eq('username', user).order('created_at', { ascending: false });
  const list = trainings || [];
  const body = document.getElementById('workout-done-modal-body');
  const selectHtml = list.length > 0 ? `
    <label style="font-size:13px;font-weight:600;color:var(--gray);display:block;margin-bottom:8px">Training auswählen:</label>
    <select id="workout-done-select" style="width:100%;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card-2);color:var(--black);font-size:15px;outline:none;margin-bottom:16px">
      ${list.map(tr => `<option value="${tr.id}" data-title="${tr.title.replace(/"/g,'&quot;')}">${tr.title}</option>`).join('')}
    </select>
    <label style="font-size:13px;font-weight:600;color:var(--gray);display:block;margin-bottom:8px">Uhrzeit</label>
    <input type="time" id="workout-done-time" value="${timeStr}" style="width:100%;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card-2);color:var(--black);font-size:16px;outline:none;margin-bottom:20px" />
    <button onclick="confirmWorkoutDone()" style="width:100%;padding:14px;border-radius:var(--radius-sm);border:none;background:var(--blue);color:#fff;font-weight:700;font-size:16px;cursor:pointer">Speichern ✓</button>
  ` : `<p style="text-align:center;color:var(--gray);font-size:14px;padding:20px 0">Noch keine Trainings. <a href="training.html" style="color:var(--blue)">Erstellen →</a></p>`;
  if (todayLog) {
    const t = new Date(todayLog.logged_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    body.innerHTML = `
      <div class="train-today-banner" style="margin-bottom:16px">
        <div class="train-today-check">✅</div>
        <div class="train-today-title">${todayLog.title}</div>
        <div class="train-today-time">${t} Uhr</div>
      </div>
      <div style="font-size:13px;font-weight:600;color:var(--gray);margin-bottom:12px">Anderes Training wählen:</div>
      ${selectHtml}`;
  } else {
    body.innerHTML = `<div class="train-not-today">Noch kein Workout heute 💤</div>${selectHtml}`;
  }
  document.getElementById('workout-done-modal').classList.add('open');
}

function closeWorkoutDoneModal() {
  const m = document.getElementById('workout-done-modal');
  if (m) m.classList.remove('open');
}

function confirmWorkoutDone() {
  const user = getSession(); if (!user) return;
  const sel = document.getElementById('workout-done-select');
  if (!sel) return;
  const trainingId = sel.value;
  const title = sel.options[sel.selectedIndex].dataset.title || sel.options[sel.selectedIndex].text;
  const timeVal = document.getElementById('workout-done-time').value || '';
  const today = getTodayKey();
  const logs = getTrainingLogs(user);
  const filtered = logs.filter(l => !l.logged_at || getLocalDateKey(l.logged_at) !== today);
  let loggedAt;
  if (timeVal) {
    const [h, m] = timeVal.split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0);
    loggedAt = d.toISOString();
  } else {
    loggedAt = new Date().toISOString();
  }
  filtered.push({ training_id: trainingId, title, logged_at: loggedAt, weight: null });
  saveTrainingLogs(user, filtered);
  closeWorkoutDoneModal();
  loadHomePage();
}

// ── Home Page ─────────────────────────────────────────────────
async function loadHomePage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  const logs = await getCombinedLogs(user);
  const weekStart = getWeekStart();
  const today = new Date(); today.setHours(23,59,59,999);
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6); weekEnd.setHours(23,59,59,999);
  const weekLogs = logs.filter(l => {
    const d = new Date(l.logged_at);
    return d >= weekStart && d <= weekEnd;
  });
  const count = weekLogs.length;
  let motive, color;
  if (count === 0) { motive = "Who's gonna carry the logs?"; color = '#ff1900'; }
  else if (count < 3) { motive = 'MORE!'; color = '#ff1a1a'; }
  else { motive = 'Mafiaboss Incoming...'; color = '#36B37E'; }
  const dots = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart); day.setDate(weekStart.getDate() + i);
    const dayKey = `${day.getFullYear()}-${String(day.getMonth()+1).padStart(2,'0')}-${String(day.getDate()).padStart(2,'0')}`;
    const trained = weekLogs.some(l => l.logged_at && getLocalDateKey(l.logged_at) === dayKey);
    const isPast = day <= today;
    dots.push({ day, trained, isPast });
  }
  const _di18n = DAY_NAMES_I18N[getLang()] || DAY_NAMES_I18N.en;
  const dayNames = DAYS.map(k => _di18n[k][0]);
  const weighins = getWeighIns(user);
  const todayWeighIn = weighins.find(w => w.date === getTodayKey());
  const _ht = T;
  const weighInLabel = todayWeighIn ? `⚖️ ${todayWeighIn.weight} kg` : _ht.btn_weighin;
  const logs2 = getTrainingLogs(user);
  const todayWorkoutLog = logs2.find(l => l.logged_at && getLocalDateKey(l.logged_at) === getTodayKey());
  const workoutLabel = todayWorkoutLog ? `✅ ${todayWorkoutLog.title}` : _ht.btn_workout_done;
  const main = document.querySelector('main.home-content');
  main.innerHTML = `
    <div class="home-week-count">
      <div class="week-number" style="color:${color}">${count}</div>
      <div class="week-motive" style="color:${color}">${motive}</div>
      <div class="week-dots">
        ${dots.map((d, i) => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
            <div class="week-dot ${d.trained ? 'week-dot-active' : 'week-dot-inactive'}"></div>
            <span style="font-size:10px;color:var(--gray)">${dayNames[i]}</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="home-quick-actions">
      <button class="home-quick-btn ${todayWeighIn ? 'home-quick-btn-done' : ''}" onclick="openWeighInModal()">${weighInLabel}</button>
      <button class="home-quick-btn ${todayWorkoutLog ? 'home-quick-btn-done' : ''}" onclick="openWorkoutDoneModal()">${workoutLabel}</button>
    </div>
  `;
}

// ── Page Init ─────────────────────────────────────────────────
(function init() {
  // Apply saved language immediately (before async calls)
  applyLanguage(getLang());

  if (document.getElementById('panel-login')) { guardAuth(); return; }

  // Inject modals on all app pages
  injectContactModal();
  injectBmiModal();
  injectCalorieModal();
  injectTrainModal();
  initParticleBackground();

  const user = guardHome(); if (!user) return;

  // Apply stored language immediately on every page
  applyLanguage(getLang());

  if (document.getElementById('train-page-content')) {
    // Train page
    loadTrainPage();
  } else if (document.getElementById('home-week-section')) {
    // Home page
    loadHomePage();
  } else if (document.getElementById('analytics-calendar')) {
    // Analytics page
    loadAnalyticsPage();
  } else if (document.getElementById('routine-page')) {
    // Routine page
    loadNavbarAvatar(user);
  } else if (document.getElementById('exercise-grid')) {
    // Exercises page
    loadExercisePage();
  } else if (document.getElementById('training-builder-modal')) {
    // Training page
    loadTrainingPage();
  } else if (document.getElementById('plan-grid')) {
    // Plan page
    loadPlanPage();
  } else if (document.getElementById('prof-birthdate')) {
    // Profile page
    loadProfile();
  } else if (document.getElementById('social-main')) {
    // Social page
    loadSocialPage();
  }
  // Check inactivity and send FitMol AI message if needed (before updating last_active)
  checkInactivityAndNotify(user);
  // Update last_active on every page load (reset inactivity clock)
  updateLastActive(user);
  // Check unread messages and show dot on Social footer button
  checkSocialUnreadDot();
})();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('../sw.js').catch(() => {});
}
