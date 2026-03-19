/* ============================================================
   FitTrack – Training Page JS
   ============================================================ */

const INTENSITY_COLORS = ['','#36B37E','#7BC67E','#F4C430','#E67E22','#E74C3C'];

function updateIntensityDisplay(val) {
  const v = parseInt(val);
  const color = INTENSITY_COLORS[v] || INTENSITY_COLORS[3];
  const slider = document.getElementById('tr-intensity');
  const label  = document.getElementById('intensity-val-label');
  const dots   = document.getElementById('intensity-dots');
  if (slider) slider.style.accentColor = color;
  if (label)  { label.textContent = v; label.style.color = color; }
  if (dots) {
    dots.innerHTML = [1,2,3,4,5].map(n =>
      `<span class="idot${n <= v ? ' idot-active' : ''}" style="${n <= v ? `background:${INTENSITY_COLORS[n]}` : ''}"></span>`
    ).join('');
  }
}

function renderTrainingExGrid() {
  const grid = document.getElementById('training-ex-grid');
  const hint = document.getElementById('training-grid-empty');
  if (!grid) return;
  grid.querySelectorAll('.tg-card').forEach(c => c.remove());
  if (currentTrainingExercises.length === 0) {
    if (hint) hint.style.display = '';
    return;
  }
  if (hint) hint.style.display = 'none';
  const t = T;
  currentTrainingExercises.forEach((ex, i) => {
    const card = document.createElement('div');
    card.className = 'tg-card';
    card.draggable = true;
    card.dataset.index = i;
    card.innerHTML = `
      <div class="tg-card-header">
        <span class="tg-num">${i + 1}</span>
        <button class="tg-remove" onclick="removeFromTraining(${i})">×</button>
      </div>
      <div class="tg-thumb">
        ${ex.image_data ? `<img src="${ex.image_data}" />` : `<span>${ex.abbreviation || '?'}</span>`}
      </div>
      <div class="tg-name">${ex.name}</div>
      <div class="tg-ctrl-label">${t.label_sets}</div>
      <div class="tg-sets">
        ${[1,2,3,4].map(n => `<button class="set-btn${ex.sets===n?' active':''}" onclick="selectSets(${i},${n})">${n}</button>`).join('')}
      </div>
      <div class="tg-ctrl-label">${t.label_reps}</div>
      <select class="tg-reps-select" onchange="updateTrainingEx(${i},'reps',this.value)">${getRepsOptions()}</select>
    `;
    card.addEventListener('dragstart', e => {
      e.stopPropagation();
      e.dataTransfer.setData('tr-reorder', String(i));
    });
    card.addEventListener('dragover', e => {
      e.preventDefault(); e.stopPropagation();
      card.classList.add('tg-drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('tg-drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault(); e.stopPropagation();
      card.classList.remove('tg-drag-over');
      const reorder = e.dataTransfer.getData('tr-reorder');
      if (reorder !== '') {
        const from = parseInt(reorder);
        if (!isNaN(from) && from !== i) {
          const moved = currentTrainingExercises.splice(from, 1)[0];
          currentTrainingExercises.splice(i, 0, moved);
          renderTrainingExGrid();
        }
        return;
      }
      const exIdx = parseInt(e.dataTransfer.getData('ex-index'));
      if (!isNaN(exIdx) && allExercises[exIdx]) addExerciseToTraining(allExercises[exIdx]);
    });
    grid.appendChild(card);
    const sel = card.querySelector('.tg-reps-select');
    if (sel) sel.value = ex.reps;
  });
}

function addExerciseToTraining(exercise) {
  if (currentTrainingExercises.find(e => e.exercise_id === exercise.id)) return;
  currentTrainingExercises.push({
    exercise_id:  exercise.id,
    name:         exercise.name,
    abbreviation: exercise.abbreviation || '',
    image_data:   exercise.image_data   || null,
    sets: 1,
    reps: 10
  });
  renderTrainingExGrid();
}

function removeFromTraining(index) {
  currentTrainingExercises.splice(index, 1);
  renderTrainingExGrid();
}

function selectSets(index, n) {
  currentTrainingExercises[index].sets = n;
  // In-place update: only toggle active class on the affected card's set buttons
  const grid = document.getElementById('training-ex-grid');
  if (!grid) return;
  const card = grid.querySelector(`[data-index="${index}"]`);
  if (!card) { renderTrainingExGrid(); return; }
  card.querySelectorAll('.set-btn').forEach((btn, j) => {
    btn.classList.toggle('active', j + 1 === n);
  });
}

function updateTrainingEx(index, field, value) {
  currentTrainingExercises[index][field] = Number(value);
}

function onDragExStart(event, index) {
  event.dataTransfer.setData('ex-index', String(index));
}

function onDropToTrainingGrid(event) {
  event.preventDefault();
  const idx = parseInt(event.dataTransfer.getData('ex-index'));
  if (!isNaN(idx) && allExercises[idx]) addExerciseToTraining(allExercises[idx]);
}

function openTrainingModal(tr = null) {
  resetTrainingBuilder();
  const t = T;
  document.getElementById('training-modal-title').textContent = tr ? t.modal_edit_training : t.modal_new_training_title;
  const strip = document.getElementById('builder-ex-strip');
  if (allExercises.length === 0) {
    strip.innerHTML = `<span style="color:var(--gray);font-size:13px">${t.empty_sidebar_exercises} <a href="exercises.html" style="color:var(--blue)">→</a></span>`;
  } else {
    strip.innerHTML = allExercises.map((ex, idx) => `
      <div class="strip-ex" draggable="true"
           ondragstart="onDragExStart(event, ${idx})"
           onclick="addExerciseToTraining(allExercises[${idx}])">
        <div class="strip-ex-thumb">
          ${ex.image_data ? `<img src="${ex.image_data}" />` : `<span>${ex.abbreviation || ex.name.charAt(0)}</span>`}
        </div>
        <div class="strip-ex-name">${ex.name}</div>
      </div>
    `).join('');
  }
  if (tr) {
    document.getElementById('edit-training-id').value = tr.id;
    document.getElementById('tr-title').value = tr.title || '';
    document.getElementById('tr-desc').value  = tr.description || '';
    const intVal = tr.intensity || 3;
    document.getElementById('tr-intensity').value = intVal;
    updateIntensityDisplay(intVal);
    currentTrainingExercises = (tr.exercises || []).map(ex => ({ ...ex, image_data: null }));
    renderTrainingExGrid();
  }
  document.getElementById('training-builder-modal').classList.add('open');
}

function closeTrainingModal() {
  document.getElementById('training-builder-modal').classList.remove('open');
}

function resetTrainingBuilder() {
  currentTrainingExercises = [];
  if (document.getElementById('tr-title'))     document.getElementById('tr-title').value = '';
  if (document.getElementById('tr-desc'))      document.getElementById('tr-desc').value  = '';
  if (document.getElementById('tr-intensity')) { document.getElementById('tr-intensity').value = 3; updateIntensityDisplay(3); }
  if (document.getElementById('edit-training-id')) document.getElementById('edit-training-id').value = '';
  hideAlert('training-alert');
  renderTrainingExGrid();
}

async function saveTraining() {
  hideAlert('training-alert');
  const user  = getSession(); if (!user) return;
  const title = document.getElementById('tr-title').value.trim();
  const desc  = document.getElementById('tr-desc').value.trim();
  const intensity = parseInt(document.getElementById('tr-intensity').value) || 3;
  const editId = document.getElementById('edit-training-id').value;
  const tTr = T;
  if (!title) { showAlert('training-alert', tTr.err_title_required); return; }
  const btn = document.getElementById('training-save-btn');
  btn.disabled = true; btn.textContent = tTr.saving;
  const payload = {
    username: user,
    title,
    description: desc,
    intensity,
    exercises: currentTrainingExercises.map(({ image_data, ...rest }) => rest)
  };
  try {
    let error;
    if (editId) {
      ({ error } = await db.from('trainings').update(payload).eq('id', editId));
    } else {
      ({ error } = await db.from('trainings').insert(payload));
    }
    if (error) throw error;
    closeTrainingModal();
    resetTrainingBuilder();
    await loadTrainings();
  } catch (e) { showAlert('training-alert', `${tTr.err_connection} ${e.message}`); }
  finally { btn.disabled = false; btn.textContent = tTr.btn_save_training; }
}

async function deleteTraining(id) {
  const tDelTr = T;
  if (!confirm(tDelTr.confirm_delete_training)) return;
  await db.from('trainings').delete().eq('id', id);
  await loadTrainings();
}

function viewTraining(id) {
  const tr = window._allTrainingCache ? window._allTrainingCache.find(t => t.id === id) : null;
  if (!tr) return;
  document.getElementById('vt-title').textContent = tr.title;
  const intVal = tr.intensity || null;
  const intColor = intVal ? INTENSITY_COLORS[intVal] : null;
  document.getElementById('vt-meta').innerHTML = intVal
    ? `<span style="background:${intColor}22;color:${intColor};border-radius:6px;padding:2px 10px;font-weight:700">● ${intVal}/5</span>`
    : '';
  const descEl = document.getElementById('vt-desc');
  if (tr.description) { descEl.textContent = tr.description; descEl.style.display = ''; }
  else descEl.style.display = 'none';
  const tV = T;
  const exList = tr.exercises || [];
  document.getElementById('vt-exercises').innerHTML = exList.length === 0
    ? `<p style="color:var(--gray);font-size:14px">${tV.no_exercises_in_training}</p>`
    : exList.map((ex, i) => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f0f2f8">
        <div style="font-size:20px;font-weight:900;color:var(--blue);min-width:28px">${i + 1}.</div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:800">${ex.name}${ex.abbreviation ? ` <span style="color:var(--gray);font-size:12px">(${ex.abbreviation})</span>` : ''}</div>
          <div style="font-size:13px;color:var(--gray);margin-top:3px">
            <span style="background:var(--blue-light);color:var(--blue);border-radius:6px;padding:2px 8px;margin-right:6px;font-weight:700">${ex.sets} ${tV.badge_sets}</span>
            <span style="background:#fff8e8;color:#e67e22;border-radius:6px;padding:2px 8px;font-weight:700">${ex.reps >= 26 ? '25+' : ex.reps} ${tV.badge_reps}</span>
          </div>
        </div>
      </div>
    `).join('');
  document.getElementById('view-training-modal').classList.add('open');
}

function loadTrainingIntoBuilder(id) {
  const tr = window._allTrainingCache ? window._allTrainingCache.find(t => t.id === id) : null;
  if (!tr) return;
  openTrainingModal(tr);
}

async function loadTrainings() {
  const user = getSession(); if (!user) return;
  const { data: trainings } = await db.from('trainings').select('*').eq('username', user).order('created_at', { ascending: false });
  window._allTrainingCache = trainings || [];
  const list = document.getElementById('saved-trainings-list');
  const tLT = T;
  if (!trainings || trainings.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🏋️</div><div class="empty-state-text">${tLT.empty_trainings}</div></div>`;
    return;
  }
  list.innerHTML = trainings.map(tr => {
    const intVal = tr.intensity || null;
    const intColor = intVal ? INTENSITY_COLORS[intVal] : null;
    const intBadge = intVal ? `<span class="tr-intensity-badge" style="background:${intColor}22;color:${intColor}">● ${intVal}/5</span>` : '';
    return `
      <div class="saved-training-card">
        <div class="saved-tr-info" style="cursor:pointer" onclick="viewTraining('${tr.id}')">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <div class="saved-tr-title">${tr.title}</div>${intBadge}
          </div>
          <div class="saved-tr-meta">${tr.description || ''}</div>
          <div class="ex-badges" style="margin-top:6px">
            ${(tr.exercises || []).map((ex, i) => `<span class="ex-badge">${i+1}. ${ex.abbreviation || ex.name}</span>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0">
          <button class="btn-icon" title="Ansehen" onclick="viewTraining('${tr.id}')">👁️</button>
          <button class="btn-icon" title="Bearbeiten" onclick="loadTrainingIntoBuilder('${tr.id}')">✏️</button>
          <button class="btn-icon btn-icon-red" title="Löschen" onclick="deleteTraining('${tr.id}')">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

async function loadTrainingPage() {
  const user = guardHome(); if (!user) return;
  const [, exerciseRes] = await Promise.all([
    loadNavbarAvatar(user),
    db.from('exercises').select('*').eq('username', user).order('name')
  ]);
  allExercises = (exerciseRes && exerciseRes.data) || [];
  await loadTrainings();
}
