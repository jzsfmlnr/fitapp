/* ============================================================
   FitTrack – Plan Page JS
   ============================================================ */

function resetPlan() {
  DAYS.forEach(d => currentPlan[d] = [null, null]);
  document.getElementById('plan-name').value = '';
  hideAlert('plan-alert'); hideAlert('plan-success');
  renderPlanGrid();
}

// ── Export Plan ───────────────────────────────────────────────
async function exportPlan() {
  const planName = document.getElementById('plan-name').value.trim() || 'FitMol-Plan';
  // Collect training IDs used in plan
  const usedIds = [...new Set(Object.values(currentPlan).flat().filter(Boolean))];
  // Fetch full training data for those IDs
  const { data: trainingsData } = usedIds.length
    ? await db.from('trainings').select('*').in('id', usedIds)
    : { data: [] };

  const exportObj = {
    version: 1,
    app: 'FitMol',
    exportedAt: new Date().toISOString(),
    planName,
    days: currentPlan,
    trainings: trainingsData || []
  };

  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `fitmol-plan-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Import Plan ───────────────────────────────────────────────
function importPlan() {
  const input   = document.createElement('input');
  input.type    = 'file';
  input.accept  = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const tImp = T;
      if (data.version !== 1 || data.app !== 'FitMol') {
        alert(tImp.invalid_plan_file);
        return;
      }
      const user = getSession();
      showAlert('plan-alert', tImp.importing);

      // Insert trainings, build old-id → new-id map
      const idMap = {};
      for (const tr of (data.trainings || [])) {
        const oldId = tr.id;
        const { data: newTr } = await db.from('trainings').insert({
          username: user, title: tr.title, description: tr.description,
          date: tr.date, exercises: tr.exercises
        }).select('id').single();
        if (newTr) idMap[oldId] = newTr.id;
      }

      // Remap day slots to new IDs
      const newDays = {};
      DAYS.forEach(d => {
        newDays[d] = (data.days[d] || [null, null]).map(id => (id && idMap[id]) ? idMap[id] : null);
        while (newDays[d].length < 2) newDays[d].push(null);
      });

      currentPlan = newDays;
      document.getElementById('plan-name').value = data.planName || '';
      hideAlert('plan-alert');
      const importedMsg = { de: `Plan "${data.planName}" erfolgreich importiert!`, en: `Plan "${data.planName}" imported successfully!`, hu: `"${data.planName}" terv sikeresen importálva!` };
      showAlert('plan-success', importedMsg[getLang()] || importedMsg.en, 'success');
      await loadPlanPage();
    } catch (err) {
      const tImpErr = T;
      showAlert('plan-alert', `${tImpErr.err_connection} ${err.message}`);
    }
  };
  input.click();
}

function renderPlanGrid() {
  const grid = document.getElementById('plan-grid');
  const dayNames = DAY_NAMES_I18N[getLang()] || DAY_NAMES_I18N.en;
  grid.innerHTML = DAYS.map(day => {
    const slots = currentPlan[day] || [null, null];
    return `
      <div class="plan-day-col">
        <div class="plan-day-header">${dayNames[day][0]}<span style="display:block;font-size:10px;font-weight:500;color:var(--gray)">${dayNames[day][1]}</span></div>
        ${[0, 1].map(slot => {
          const tr = slots[slot] ? allTrainings.find(t => t.id === slots[slot]) : null;
          return `
            <div class="plan-slot ${tr ? 'filled' : ''}"
                 data-day="${day}" data-slot="${slot}"
                 ondragover="event.preventDefault(); this.classList.add('drag-over')"
                 ondragleave="this.classList.remove('drag-over')"
                 ondrop="onDropTraining(event, '${day}', ${slot})"
                 onclick="onSlotClick('${day}', ${slot})">
              ${tr
                ? `<div class="plan-slot-text">${tr.title}</div>
                   <button class="plan-slot-remove" onclick="removeFromPlan('${day}',${slot});event.stopPropagation()">×</button>`
                : `<div class="plan-slot-empty">+ Training</div>`}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');
}

function onDropTraining(event, day, slot) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  const id = event.dataTransfer.getData('training-id');
  if (!id) return;
  addTrainingToDay(day, slot, id);
}

function onSlotClick(day, slot) {
  if (!selectedChipId) return;
  addTrainingToDay(day, slot, selectedChipId);
  // Deselect chip
  document.querySelectorAll('.training-chip').forEach(c => c.style.outline = '');
  selectedChipId = null;
}

function addTrainingToDay(day, slot, trainingId) {
  if (!currentPlan[day]) currentPlan[day] = [null, null];
  if (currentPlan[day][slot] !== null && currentPlan[day][slot] !== trainingId) return; // slot taken
  currentPlan[day][slot] = trainingId;
  renderPlanGrid();
}

function removeFromPlan(day, slot) {
  if (currentPlan[day]) currentPlan[day][slot] = null;
  renderPlanGrid();
}

function renderTrainingChips() {
  const row = document.getElementById('chips-row');
  const tChips = T;
  if (!allTrainings || allTrainings.length === 0) {
    row.innerHTML = `<span style="color:var(--gray);font-size:13px">${tChips.empty_trainings_chips} <a href="training.html" style="color:var(--blue)">→</a></span>`;
    return;
  }
  row.innerHTML = allTrainings.map(tr => `
    <div class="training-chip"
         draggable="true"
         data-id="${tr.id}"
         ondragstart="event.dataTransfer.setData('training-id', '${tr.id}')"
         onclick="selectChip(this, '${tr.id}')">
      🏋️ ${tr.title}
    </div>
  `).join('');
}

function selectChip(el, id) {
  if (selectedChipId === id) {
    selectedChipId = null;
    el.style.outline = '';
  } else {
    document.querySelectorAll('.training-chip').forEach(c => c.style.outline = '');
    selectedChipId = id;
    el.style.outline = '3px solid var(--gold)';
  }
}

async function savePlan() {
  hideAlert('plan-alert'); hideAlert('plan-success');
  const user = getSession(); if (!user) return;
  const name = document.getElementById('plan-name').value.trim();
  const tPlan = T;
  if (!name) { showAlert('plan-alert', tPlan.err_plan_name_required); return; }
  const btn = document.querySelector('.plan-save-row .btn');
  btn.disabled = true; btn.textContent = tPlan.saving;
  try {
    const { error } = await db.from('plans').insert({ username: user, name, days: currentPlan });
    if (error) throw error;
    const savedMsg = { de: `Plan "${name}" gespeichert!`, en: `Plan "${name}" saved!`, hu: `"${name}" terv mentve!` };
    showAlert('plan-success', savedMsg[getLang()] || savedMsg.en, 'success');
    await loadSavedPlans();
  } catch (e) { showAlert('plan-alert', `${tPlan.err_connection} ${e.message}`); }
  finally { btn.disabled = false; btn.textContent = tPlan.btn_save_plan; }
}

async function deletePlan(id) {
  const tDelP = T;
  if (!confirm(tDelP.confirm_delete_plan)) return;
  await db.from('plans').delete().eq('id', id);
  await loadSavedPlans();
}

function loadPlanIntoGrid(plan) {
  currentPlan = {};
  DAYS.forEach(d => {
    currentPlan[d] = (plan.days[d] || [null, null]).slice(0, 2);
    while (currentPlan[d].length < 2) currentPlan[d].push(null);
  });
  const tCopy = T;
  document.getElementById('plan-name').value = plan.name + tCopy.copy_suffix;
  renderPlanGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadSavedPlans() {
  const user = getSession(); if (!user) return;
  const { data: plans } = await db.from('plans').select('*').eq('username', user).order('created_at', { ascending: false });
  const list = document.getElementById('saved-plans-list');
  const tSP = T;
  if (!plans || plans.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">${tSP.empty_plans}</div></div>`;
    return;
  }
  list.innerHTML = plans.map(pl => `
    <div class="plan-card">
      <div>
        <div class="plan-card-name">${pl.name}</div>
        <div class="plan-card-meta">${new Date(pl.created_at).toLocaleDateString(getLang() === 'de' ? 'de-DE' : getLang() === 'hu' ? 'hu-HU' : 'en-GB')}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-icon" onclick='loadPlanIntoGrid(${JSON.stringify(pl)})'>📋</button>
        <button class="btn-icon btn-icon-red" onclick="deletePlan('${pl.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

async function loadPlanPage() {
  const user = guardHome(); if (!user) return;
  resetPlan();
  const [, trainingsRes, plansRes] = await Promise.all([
    loadNavbarAvatar(user),
    db.from('trainings').select('id, title').eq('username', user).order('created_at', { ascending: false }),
    db.from('plans').select('*').eq('username', user).order('created_at', { ascending: false })
  ]);
  allTrainings = (trainingsRes && trainingsRes.data) || [];
  renderTrainingChips();
  renderPlanGrid();
  renderSavedPlansData((plansRes && plansRes.data) || []);
}

function renderSavedPlansData(plans) {
  const list = document.getElementById('saved-plans-list');
  if (!list) return;
  const tSP = T;
  if (!plans || plans.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">${tSP.empty_plans}</div></div>`;
    return;
  }
  list.innerHTML = plans.map(pl => `
    <div class="plan-card">
      <div>
        <div class="plan-card-name">${pl.name}</div>
        <div class="plan-card-meta">${new Date(pl.created_at).toLocaleDateString(getLang() === 'de' ? 'de-DE' : getLang() === 'hu' ? 'hu-HU' : 'en-GB')}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-icon" onclick='loadPlanIntoGrid(${JSON.stringify(pl)})'>📋</button>
        <button class="btn-icon btn-icon-red" onclick="deletePlan('${pl.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}
