/* ============================================================
   FitTrack – Train Page JS (Live Workout Tracker + Carousel)
   ============================================================ */

const WORKOUT_TYPE_TAGS = {
  push:    ['schulter', 'trizeps', 'brust'],
  pull:    ['ruecken', 'bizeps', 'schulter', 'unterarm'],
  arms:    ['bizeps', 'trizeps', 'schulter', 'unterarm'],
  upper_body: ['ruecken', 'brust', 'schulter', 'trizeps', 'bizeps', 'unterarm', 'bauch'],
  lower_body: ['beine', 'bauch'],
  legs:    ['beine', 'bauch'],
};
const WORKOUT_TYPE_LABELS = { push:'Push', pull:'Pull', arms:'Arms', upper_body:'Upper Body', lower_body:'Lower Body', legs:'Legs' };

let currentWorkout = null;
let currentExerciseData = null;
let currentExerciseSets = [];
let currentExerciseSuggestions = [];
let _trainExerciseCache = [];
let _lastSessionForType = null;

const CAROUSEL_ITEMS = [
  { type: 'pull',       label: 'Pull',       icon: '⬇️',  subKey: 'carousel_pull_sub' },
  { type: 'push',       label: 'Push',       icon: '⬆️',  subKey: 'carousel_push_sub' },
  { type: 'arms',       label: 'Arms',       icon: '💪',  subKey: 'carousel_arms_sub' },
  { type: 'upper_body', label: 'Upper Body', icon: '🏋️', subKey: 'carousel_upper_sub' },
  { type: 'lower_body', label: 'Lower Body', icon: '🦵',  subKey: 'carousel_lower_sub' },
  { type: 'legs',       label: 'Legs',       icon: '🏃',  subKey: 'carousel_legs_sub' },
];
let carouselIndex = 0;
let _carouselDragged = false;

function getWeightSuggestions(lastWeight) {
  if (!lastWeight || lastWeight <= 0) return [5, 10, 15, 20, 25];
  const step = lastWeight < 20 ? 1 : lastWeight < 50 ? 2 : 5;
  return [-2, -1, 0, 1, 2].map(i => Math.max(0.5, parseFloat((lastWeight + i * step).toFixed(1))));
}

async function loadTrainPage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  injectBmiModal();
  injectCalorieModal();
  renderWorkoutTypeSelection();
}

function renderWorkoutTypeSelection() {
  const t = T;
  const content = document.getElementById('train-page-content');
  if (!content) return;
  content.style.overflowY = 'hidden';
  currentWorkout = null;
  carouselIndex = 0;
  content.innerHTML = `
    <div class="train-hero">
      <div class="train-hero-sub">${t.train_choose_workout}</div>
    </div>
    <div class="carousel-3d-outer">

      <div class="carousel-3d-scene" id="carousel-scene">
        <div class="carousel-3d-track" id="carousel-track">
          ${CAROUSEL_ITEMS.map((item, i) => `
            <div class="carousel-3d-item" id="c3d-${i}">
              <div class="carousel-card" onclick="onCarouselCardClick(${i})">
                <div class="carousel-card-icon">${item.icon}</div>
                <div class="carousel-card-label">${item.label}</div>
                <div class="carousel-card-sub">${t[item.subKey] || item.subKey}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
    <div class="carousel-dots" id="carousel-dots">
      ${CAROUSEL_ITEMS.map((_, i) => `<div class="carousel-dot${i === 0 ? ' active' : ''}" onclick="rotateCarouselTo(${i})"></div>`).join('')}
    </div>
    <div class="carousel-select-wrap">
    </div>
  `;
  initCarousel3D();
}

function initCarousel3D() {
  const n = CAROUSEL_ITEMS.length;
  const radius = 140;
  CAROUSEL_ITEMS.forEach((_, i) => {
    const el = document.getElementById(`c3d-${i}`);
    if (el) el.style.transform = `rotateY(${i * (360 / n)}deg) translateZ(${radius}px)`;
  });
  updateCarousel3D();
  initCarouselSwipe();
}

function updateCarousel3D() {
  const n = CAROUSEL_ITEMS.length;
  const track = document.getElementById('carousel-track');
  if (track) track.style.transform = `rotateY(${-carouselIndex * (360 / n)}deg)`;
  CAROUSEL_ITEMS.forEach((_, i) => {
    const el = document.getElementById(`c3d-${i}`);
    if (!el) return;
    let diff = ((i - carouselIndex) % n + n) % n;
    if (diff > n / 2) diff = n - diff;
    el.classList.toggle('active', diff === 0);
    el.style.opacity = [1, 0.55, 0.2, 0][Math.min(diff, 3)];
    el.style.pointerEvents = diff <= 1 ? 'auto' : 'none';
  });
  const lbl = document.getElementById('carousel-active-label');
  if (lbl) lbl.textContent = CAROUSEL_ITEMS[carouselIndex].label;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
}

function rotateCarousel(dir) {
  const n = CAROUSEL_ITEMS.length;
  carouselIndex = ((carouselIndex + dir) % n + n) % n;
  updateCarousel3D();
}

function rotateCarouselTo(i) {
  carouselIndex = i;
  updateCarousel3D();
}

function onCarouselCardClick(i) {
  if (_carouselDragged) return;
  if (i !== carouselIndex) {
    carouselIndex = i;
    updateCarousel3D();
  } else {
    confirmCarouselSelection();
  }
}

function confirmCarouselSelection() {
  selectWorkoutType(CAROUSEL_ITEMS[carouselIndex].type);
}

function initCarouselSwipe() {
  const scene = document.getElementById('carousel-scene');
  if (!scene) return;
  let startX = 0;
  scene.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    _carouselDragged = false;
  }, { passive: true });
  scene.addEventListener('touchmove', () => { _carouselDragged = true; }, { passive: true });
  scene.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { rotateCarousel(dx < 0 ? 1 : -1); _carouselDragged = true; }
    setTimeout(() => { _carouselDragged = false; }, 80);
  }, { passive: true });
  let mx = 0;
  scene.addEventListener('mousedown', e => { mx = e.clientX; _carouselDragged = false; });
  scene.addEventListener('mousemove', e => { if (Math.abs(e.clientX - mx) > 5) _carouselDragged = true; });
  scene.addEventListener('mouseup', e => {
    const dx = e.clientX - mx;
    if (Math.abs(dx) > 40) rotateCarousel(dx < 0 ? 1 : -1);
    setTimeout(() => { _carouselDragged = false; }, 80);
  });
}

async function selectWorkoutType(type) {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2,'0');
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2,'0');
  const min = String(now.getMinutes()).padStart(2,'0');
  const title = `${WORKOUT_TYPE_LABELS[type]} - ${dd}.${mm}.${yyyy} - ${hh}:${min}`;
  currentWorkout = { type, title, date: now.toISOString(), exercises: [] };
  await renderExerciseSelection();
}

async function renderExerciseSelection() {
  const user = getSession(); if (!user || !currentWorkout) return;
  const content = document.getElementById('train-page-content');
  if (!content) return;
  content.style.overflowY = 'auto';
  const t = T;
  content.innerHTML = `<div style="text-align:center;padding:60px;color:var(--gray)">${t.loading_text}</div>`;
  const [exerciseRes, lastRes] = await Promise.all([
    db.from('exercises').select('*').eq('username', user),
    db.from('workout_sessions').select('*').eq('username', user).eq('type', currentWorkout.type).order('created_at', { ascending: false }).limit(1)
  ]);
  _trainExerciseCache = exerciseRes.data || [];
  _lastSessionForType = (lastRes.data && lastRes.data.length > 0) ? lastRes.data[0] : null;
  const tags = WORKOUT_TYPE_TAGS[currentWorkout.type] || [];
  const grouped = {};
  tags.forEach(tag => {
    const matches = _trainExerciseCache.filter(e => e.tag === tag);
    if (matches.length > 0) grouped[tag] = matches;
  });
  const tagNames = { schulter: t.tag_schulter, ruecken: t.tag_ruecken, bizeps: t.tag_bizeps, trizeps: t.tag_trizeps, unterarm: t.tag_unterarm, beine: t.tag_beine, brust: t.tag_brust, bauch: t.tag_bauch, sonstiges: t.tag_sonstiges };
  let exerciseHtml = Object.keys(grouped).length === 0
    ? `<div style="text-align:center;padding:40px 20px;color:var(--gray)"><div style="font-size:40px;margin-bottom:12px">💪</div><div style="font-size:16px;font-weight:600;margin-bottom:8px">${t.train_no_match}</div><div style="font-size:13px">${t.train_no_match_hint}</div></div>`
    : tags.filter(t => grouped[t]).map(tag => {
        const tg = getTagInfo(tag);
        const color = tg ? tg.color : '#7a84a0';
        const items = grouped[tag];
        return `
          <div class="ex-tag-group">
            <div class="ex-tag-group-header" style="color:${color}">${tagNames[tag] || tag} <span style="opacity:0.5;font-size:13px">(${items.length})</span></div>
            <div class="ex-tag-group-grid">
              ${items.map(ex => `
                <div class="exercise-card-mini train-ex-card" onclick="openTrainExerciseModal('${ex.id}')">
                  <div class="ex-mini-img">
                    ${ex.image_data ? `<img src="${ex.image_data}" alt="${ex.name}" />` : `<div class="ex-mini-abbr">${ex.abbreviation || '?'}</div>`}
                  </div>
                  <div class="ex-mini-name">${ex.name}</div>
                </div>`).join('')}
            </div>
          </div>`;
      }).join('');
  const lastSessionHtml = _lastSessionForType ? (() => {
    const ls = _lastSessionForType;
    const d = new Date(ls.created_at);
    const dateStr = d.toLocaleDateString(getLang() === 'de' ? 'de-DE' : getLang() === 'hu' ? 'hu-HU' : 'en-GB', { day:'numeric', month:'short', year:'numeric' });
    const exCount = (ls.exercises || []).length;
    return `<div class="last-training-card" onclick="openLastTrainingSpectate()">
      <div class="last-training-label">${t.train_last_training}</div>
      <div class="last-training-title">${ls.title}</div>
      <div class="last-training-meta">${dateStr} · ${exCount} ${exCount !== 1 ? t.train_exercise_plural : t.train_exercise_singular}</div>
      <div class="last-training-arrow">${t.train_view_btn}</div>
    </div>`;
  })() : '';

  content.innerHTML = `
    <div class="train-session-header">
      <div>
        <div class="train-session-type">${WORKOUT_TYPE_LABELS[currentWorkout.type]}</div>
        <div class="train-session-title-small">${currentWorkout.title}</div>
      </div>
      <button class="btn-finish-workout" onclick="confirmFinishWorkout()">${t.train_workout_finished_btn}</button>
    </div>
    <div id="train-session-log"></div>
    ${lastSessionHtml}
    <div class="train-add-ex-header">
      <span>${t.train_add_exercise}</span>
      <button class="btn-create-ex-inline" onclick="openNewExerciseFromTrain()">${t.train_create_new}</button>
    </div>
    ${exerciseHtml}
    <div style="height:100px"></div>
  `;
  renderSessionLog();
}

function renderSessionLog() {
  const t = T;
  const log = document.getElementById('train-session-log');
  if (!log || !currentWorkout || currentWorkout.exercises.length === 0) {
    if (log) log.innerHTML = '';
    return;
  }
  log.innerHTML = `
    <div class="session-log-wrap">
      <div class="session-log-title">${t.train_today_exercises}</div>
      ${currentWorkout.exercises.map(ex => `
        <div class="session-log-item" onclick="openTrainExerciseModal('${ex.id}')">
          <div>
            <div class="session-log-name">${ex.name}</div>
            <div class="session-log-sets">${ex.sets.length} ${ex.sets.length !== 1 ? t.train_sets_label : t.train_set_label} · ${ex.sets.map(s => `${s.weight}kg×${s.reps}`).join(', ')}</div>
          </div>
          <span class="session-log-edit">✏️</span>
        </div>
      `).join('')}
    </div>
  `;
}

async function openTrainExerciseModal(exerciseId) {
  const user = getSession(); if (!user) return;
  const ex = _trainExerciseCache.find(e => e.id === exerciseId);
  if (!ex) return;
  currentExerciseData = ex;
  let lastWeight = null;
  try {
    const { data } = await db.from('exercise_last_weights').select('weight').eq('username', user).eq('exercise_id', exerciseId).maybeSingle();
    if (data) lastWeight = data.weight;
  } catch (e) { /* ignore */ }
  currentExerciseSuggestions = getWeightSuggestions(lastWeight);
  const existing = currentWorkout?.exercises.find(e => e.id === exerciseId);
  const defaultWeight = lastWeight || currentExerciseSuggestions[2];
  currentExerciseSets = existing
    ? existing.sets.map(s => ({...s}))
    : [
        { weight: defaultWeight, reps: 8 },
        { weight: defaultWeight, reps: 8 },
        { weight: defaultWeight, reps: 8 },
      ];
  injectTrainExerciseModal();
  const m = document.getElementById('train-exercise-modal');
  if (m) {
    document.getElementById('train-ex-modal-name').textContent = ex.name;
    const img = document.getElementById('train-ex-modal-img');
    if (ex.image_data) { img.src = ex.image_data; img.style.display = 'block'; }
    else img.style.display = 'none';
    renderTrainSetRows();
    m.classList.add('open');
  }
}

function injectTrainExerciseModal() {
  const existing = document.getElementById('train-exercise-modal');
  if (existing) existing.remove();
  const t = T;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-overlay" id="train-exercise-modal">
      <div class="modal-card" style="max-width:520px;max-height:88vh;display:flex;flex-direction:column">
        <div class="modal-header" style="flex-shrink:0">
          <div style="display:flex;align-items:center;gap:12px">
            <img id="train-ex-modal-img" style="width:40px;height:40px;border-radius:10px;object-fit:cover;display:none" />
            <div class="modal-title" id="train-ex-modal-name"></div>
          </div>
          <button class="modal-close" onclick="closeTrainExerciseModal()">×</button>
        </div>
        <div id="train-sets-container" style="overflow-y:auto;flex:1;padding:0 4px"></div>
        <div class="train-sets-footer" style="flex-shrink:0">
          <button class="btn-add-set" onclick="addTrainSet()">${t.train_add_set}</button>
          <button class="btn-set-finished" onclick="confirmExerciseSets()">${t.train_finished_btn}</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el.firstElementChild);
}

function closeTrainExerciseModal() {
  const m = document.getElementById('train-exercise-modal');
  if (m) m.classList.remove('open');
}

function renderTrainSetRows() {
  const t = T;
  const container = document.getElementById('train-sets-container');
  if (!container) return;
  container.innerHTML = currentExerciseSets.map((set, i) => {
    const isCustom = !currentExerciseSuggestions.map(Number).includes(Number(set.weight));
    return `
      <div class="train-set-row" id="train-set-row-${i}">
        <div class="train-set-row-header">
          <span class="train-set-badge">${t.train_set_label} ${i + 1}</span>
          <button class="train-set-del${currentExerciseSets.length <= 1 ? ' hidden' : ''}" onclick="removeTrainSet(${i})">✕</button>
        </div>
        <div class="train-set-weights-label">${t.train_weight_kg}</div>
        <div class="train-set-weight-chips">
          ${currentExerciseSuggestions.map(w => `
            <button class="train-weight-chip train-wt-chip${Number(set.weight) === Number(w) && !isCustom ? ' selected' : ''}" onclick="setTrainSetWeight(${i}, ${w})">${w}</button>
          `).join('')}
          <input class="train-weight-custom train-wt-custom" type="number" placeholder="${t.train_custom_ph}" min="0" step="0.5"
            value="${isCustom && set.weight ? set.weight : ''}"
            oninput="setTrainSetWeightCustom(${i}, this.value)" />
        </div>
        <div class="train-set-weights-label" style="margin-top:10px">${t.train_reps_label}</div>
        <div class="train-set-weight-chips">
          ${[8, 10, 12, 14, 16].map(r => `
            <button class="train-weight-chip train-reps-chip${set.reps === r ? ' selected' : ''}" onclick="setTrainSetRepsBtn(${i}, ${r})">${r}</button>
          `).join('')}
          <input class="train-weight-custom train-reps-custom" type="number" placeholder="${t.train_custom_ph}" min="1" max="999"
            value="${![8,10,12,14,16].includes(set.reps) && set.reps ? set.reps : ''}"
            oninput="setTrainSetRepsCustom(${i}, this.value)" />
        </div>
      </div>`;
  }).join('');
}

function setTrainSetWeight(i, w) {
  currentExerciseSets[i].weight = w;
  const row = document.getElementById(`train-set-row-${i}`);
  if (!row) return;
  row.querySelectorAll('.train-wt-chip').forEach(c => {
    c.classList.toggle('selected', parseFloat(c.textContent) === w);
  });
  const customInput = row.querySelector('.train-wt-custom');
  if (customInput) customInput.value = '';
}

function setTrainSetWeightCustom(i, val) {
  const w = parseFloat(val);
  if (!isNaN(w) && w > 0) {
    currentExerciseSets[i].weight = w;
    const row = document.getElementById(`train-set-row-${i}`);
    if (row) row.querySelectorAll('.train-wt-chip').forEach(c => c.classList.remove('selected'));
  }
}

function setTrainSetRepsBtn(i, r) {
  currentExerciseSets[i].reps = r;
  const row = document.getElementById(`train-set-row-${i}`);
  if (!row) return;
  row.querySelectorAll('.train-reps-chip').forEach(c => {
    c.classList.toggle('selected', parseInt(c.textContent) === r);
  });
  const customInput = row.querySelector('.train-reps-custom');
  if (customInput) customInput.value = '';
}

function setTrainSetRepsCustom(i, val) {
  const r = parseInt(val);
  if (!isNaN(r) && r > 0) {
    currentExerciseSets[i].reps = r;
    const row = document.getElementById(`train-set-row-${i}`);
    if (row) row.querySelectorAll('.train-reps-chip').forEach(c => c.classList.remove('selected'));
  }
}

function addTrainSet() {
  const last = currentExerciseSets[currentExerciseSets.length - 1];
  currentExerciseSets.push({ weight: last ? last.weight : currentExerciseSuggestions[2], reps: last ? last.reps : 8 });
  renderTrainSetRows();
}

function removeTrainSet(i) {
  if (currentExerciseSets.length <= 1) return;
  currentExerciseSets.forEach((s, idx) => {
    const row = document.getElementById(`train-set-row-${idx}`);
    if (row) {
      const customWeight = row.querySelector('.train-wt-custom');
      if (customWeight && customWeight.value) s.weight = parseFloat(customWeight.value) || s.weight;
      const customReps = row.querySelector('.train-reps-custom');
      if (customReps && customReps.value) s.reps = parseInt(customReps.value) || s.reps;
    }
  });
  currentExerciseSets.splice(i, 1);
  renderTrainSetRows();
}

async function confirmExerciseSets() {
  const user = getSession(); if (!user) return;
  if (!currentWorkout || !currentExerciseData) return;
  const t = T;
  const sets = currentExerciseSets.map((s, i) => {
    const row = document.getElementById(`train-set-row-${i}`);
    let weight = s.weight;
    let reps = s.reps;
    if (row) {
      const customInput = row.querySelector('.train-wt-custom');
      if (customInput && customInput.value) weight = parseFloat(customInput.value) || weight;
      const customReps = row.querySelector('.train-reps-custom');
      if (customReps && customReps.value) reps = parseInt(customReps.value) || reps;
    }
    return { weight: weight || 0, reps: reps || 1 };
  });
  if (sets.some(s => !s.weight || s.weight <= 0)) {
    alert(t.train_err_weight);
    return;
  }
  const idx = currentWorkout.exercises.findIndex(e => e.id === currentExerciseData.id);
  const entry = { id: currentExerciseData.id, name: currentExerciseData.name, abbreviation: currentExerciseData.abbreviation, image_data: currentExerciseData.image_data, tag: currentExerciseData.tag, sets };
  if (idx >= 0) currentWorkout.exercises[idx] = entry;
  else currentWorkout.exercises.push(entry);
  const maxWeight = Math.max(...sets.map(s => s.weight));
  if (maxWeight > 0) {
    const { data: existing } = await db.from('exercise_last_weights')
      .select('weight').eq('username', user).eq('exercise_id', currentExerciseData.id).maybeSingle();
    if (existing && maxWeight > existing.weight) {
      showPRPopup(currentExerciseData.name, maxWeight);
    }
    db.from('exercise_last_weights').upsert(
      { username: user, exercise_id: currentExerciseData.id, weight: maxWeight },
      { onConflict: 'username,exercise_id' }
    ).then(() => {}).catch(() => {});
  }
  closeTrainExerciseModal();
  renderSessionLog();
}

function openNewExerciseFromTrain() {
  if (!currentWorkout) return;
  window.location.href = 'exercises.html?new=1&from=train';
}

async function confirmFinishWorkout() {
  const user = getSession(); if (!user) return;
  if (!currentWorkout) return;
  const t = T;
  if (currentWorkout.exercises.length === 0) {
    alert(t.train_err_no_exercise);
    return;
  }
  if (!confirm(t.train_confirm_finish)) return;
  try {
    const { error } = await db.from('workout_sessions').insert({
      username: user,
      type: currentWorkout.type,
      title: currentWorkout.title,
      exercises: currentWorkout.exercises,
      created_at: currentWorkout.date,
    });
    if (error) throw error;
  } catch (e) {
    alert(t.train_err_save);
    return;
  }
  currentWorkout = null;
  const content = document.getElementById('train-page-content');
  if (content) content.innerHTML = `
    <div class="train-finish-screen">
      <div style="font-size:72px;margin-bottom:20px">💪</div>
      <h2 class="train-finish-title">${t.train_complete_title}</h2>
      <p class="train-finish-sub">${t.train_complete_sub}</p>
      <div style="display:flex;flex-direction:column;gap:12px;max-width:280px;margin:0 auto">
        <button class="btn btn-primary" onclick="renderWorkoutTypeSelection()">${t.train_new_workout}</button>
        <a href="home.html" class="btn btn-outline" style="text-align:center;text-decoration:none">${t.train_back_home}</a>
      </div>
    </div>
  `;
}

function openLastTrainingSpectate() {
  if (!_lastSessionForType) return;
  const t = T;
  const s = _lastSessionForType;
  const exercises = s.exercises || [];
  const exHtml = exercises.map(ex => {
    const setsStr = (ex.sets || []).map(st => `${st.weight}kg × ${st.reps}`).join(', ');
    return `<div class="spectate-exercise">
      <div class="spectate-ex-name">${ex.name}</div>
      ${setsStr ? `<div class="spectate-ex-sets">${setsStr}</div>` : ''}
    </div>`;
  }).join('');
  const existing = document.getElementById('last-training-spectate-modal');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'last-training-spectate-modal';
  el.className = 'modal-overlay open';
  el.innerHTML = `
    <div class="modal-card" style="max-height:80vh;display:flex;flex-direction:column">
      <div class="modal-header" style="flex-shrink:0">
        <div class="modal-title">${s.title}</div>
        <button class="modal-close" onclick="document.getElementById('last-training-spectate-modal').remove()">×</button>
      </div>
      <div style="overflow-y:auto;flex:1;padding:8px 0">
        ${exHtml || `<p style="color:var(--gray);text-align:center;padding:20px">${t.train_spectate_no_exercises}</p>`}
      </div>
    </div>`;
  document.body.appendChild(el);
}
