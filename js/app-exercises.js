/* ============================================================
   FitTrack – Exercises Page JS
   ============================================================ */

let pendingExerciseImage = null;
let cameraStream = null;
let editingExerciseId = null;

function openExerciseModal(exercise = null) {
  editingExerciseId = null;
  pendingExerciseImage = null;
  selectedExerciseTag = null;
  document.getElementById('ex-name').value  = '';
  document.getElementById('ex-abbr').value  = '';
  document.getElementById('ex-desc').value  = '';
  document.getElementById('edit-exercise-id').value = '';
  const t0 = T;
  document.getElementById('modal-title-text').textContent = t0.modal_new_exercise;
  const uploadImg = document.getElementById('upload-preview-img');
  uploadImg.src = ''; uploadImg.style.display = 'none';
  document.getElementById('upload-placeholder').style.display = '';
  document.getElementById('camera-preview-img').src = '';
  document.getElementById('camera-preview-img').style.display = 'none';
  hideAlert('modal-alert');
  switchImgTab('upload');

  if (exercise) {
    editingExerciseId = exercise.id;
    document.getElementById('edit-exercise-id').value = exercise.id;
    document.getElementById('modal-title-text').textContent = t0.modal_edit_exercise;
    document.getElementById('ex-name').value  = exercise.name  || '';
    document.getElementById('ex-abbr').value  = exercise.abbreviation || '';
    document.getElementById('ex-desc').value  = exercise.description  || '';
    selectedExerciseTag = exercise.tag || null;
    if (exercise.image_data) {
      uploadImg.src = exercise.image_data; uploadImg.style.display = 'block';
      document.getElementById('upload-placeholder').style.display = 'none';
      pendingExerciseImage = exercise.image_data;
    }
  }
  document.getElementById('ex-tag-selector').innerHTML = renderTagSelector(selectedExerciseTag);
  document.getElementById('exercise-modal').classList.add('open');
}

function closeExerciseModal() {
  document.getElementById('exercise-modal').classList.remove('open');
  stopCamera();
}

function switchImgTab(tab) {
  document.getElementById('img-panel-upload').style.display = tab === 'upload' ? '' : 'none';
  document.getElementById('img-panel-camera').style.display = tab === 'camera' ? '' : 'none';
  const aiPanel = document.getElementById('img-panel-ai');
  if (aiPanel) aiPanel.style.display = tab === 'ai' ? '' : 'none';
  document.getElementById('img-tab-upload').classList.toggle('active', tab === 'upload');
  document.getElementById('img-tab-camera').classList.toggle('active', tab === 'camera');
  const aiTab = document.getElementById('img-tab-ai');
  if (aiTab) aiTab.classList.toggle('active', tab === 'ai');
  if (tab === 'camera') startCamera();
  else stopCamera();
}

function handleExerciseImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    pendingExerciseImage = await resizeImage(e.target.result, 300, 0.75);
    const img = document.getElementById('upload-preview-img');
    img.src = pendingExerciseImage; img.style.display = 'block';
    document.getElementById('upload-placeholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    document.getElementById('camera-video').srcObject = cameraStream;
    document.getElementById('camera-video').style.display = 'block';
    document.getElementById('camera-preview-img').style.display = 'none';
  } catch (e) {
    const tCam = T;
    showAlert('modal-alert', tCam.err_camera);
    switchImgTab('upload');
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop());
    cameraStream = null;
  }
  const vid = document.getElementById('camera-video');
  if (vid) { vid.srcObject = null; vid.style.display = 'none'; }
}

async function capturePhoto() {
  const video = document.getElementById('camera-video');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const raw = canvas.toDataURL('image/jpeg', 0.9);
  pendingExerciseImage = await resizeImage(raw, 300, 0.75);
  const preview = document.getElementById('camera-preview-img');
  preview.src = pendingExerciseImage; preview.style.display = 'block';
  stopCamera();
}

async function generateExerciseImageAI() {
  const name = (document.getElementById('ex-name')?.value || '').trim();
  if (!name) { alert('Please enter an exercise name first.'); return; }
  const btn = document.getElementById('ai-generate-btn');
  const status = document.getElementById('ai-status');
  const previewImg = document.getElementById('ai-preview-img');
  const placeholder = document.getElementById('ai-placeholder');
  if (btn) btn.disabled = true;
  if (status) status.textContent = 'Generating… this may take 15–30 seconds';
  if (placeholder) placeholder.innerHTML = '<div style="font-size:32px">⏳</div><div>Generating…</div>';
  if (previewImg) previewImg.style.display = 'none';
  const prompt = `Minimalist anatomical fitness illustration, 1:1 square format. A person performing the exercise "${name}" on a fitness machine or with dumbbells. Slight 30-degree front perspective, upper body focused. White outline style human figure on solid dark blue to black background. Machine shown in white minimalist lines. Primary muscle group highlighted in bright red. Flat 2D vector style, no 3D effects, no text, no logos, no shading. Thin uniform line weight. Clinical clean style like a fitness textbook illustration.`;
  try {
    const apiKey = await getOpenAIKey();
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
    });
    if (!res.ok) { const err = await res.json(); throw new Error(err.error?.message || 'Generation failed'); }
    const json = await res.json();
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new Error('No image returned');
    const dataUrl = `data:image/png;base64,${b64}`;
    pendingExerciseImage = await resizeImage(dataUrl, 300, 0.75);
    if (previewImg) { previewImg.src = pendingExerciseImage; previewImg.style.display = 'block'; }
    if (placeholder) placeholder.style.display = 'none';
    if (status) status.textContent = 'Image generated! Save the exercise to use it.';
  } catch(e) {
    if (status) status.textContent = `Generation failed: ${e.message}`;
    if (placeholder) placeholder.innerHTML = '<div style="font-size:32px">✨</div><div>Enter a name, then generate</div>';
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function saveExercise() {
  hideAlert('modal-alert');
  const user = getSession(); if (!user) return;
  const name = document.getElementById('ex-name').value.trim();
  const abbr = document.getElementById('ex-abbr').value.trim();
  const desc = document.getElementById('ex-desc').value.trim();
  const t = T;
  if (!name) { showAlert('modal-alert', t.err_name_required); return; }
  if (!selectedExerciseTag) { showAlert('modal-alert', t.err_tag_required); return; }
  const btn = document.getElementById('modal-save-btn');
  btn.disabled = true; btn.textContent = t.saving;
  const payload = { username: user, name, abbreviation: abbr, description: desc, image_data: pendingExerciseImage || null, tag: selectedExerciseTag };
  try {
    let error;
    if (editingExerciseId) {
      ({ error } = await db.from('exercises').update(payload).eq('id', editingExerciseId));
    } else {
      ({ error } = await db.from('exercises').insert(payload));
    }
    if (error) throw error;
    closeExerciseModal();
    const _urlParams = new URLSearchParams(location.search);
    if (_urlParams.get('from') === 'train') {
      window.location.href = 'train.html';
      return;
    }
    if (typeof window._afterExerciseSave === 'function') {
      const cb = window._afterExerciseSave;
      window._afterExerciseSave = null;
      await cb();
    } else {
      await loadExercisePage();
    }
  } catch (e) { showAlert('modal-alert', `${t.err_connection} ${e.message}`); }
  finally { btn.disabled = false; btn.textContent = t.btn_save_exercise; }
}

async function deleteExercise(id) {
  const tDel = T;
  if (!confirm(tDel.confirm_delete_exercise)) return;
  await db.from('exercises').delete().eq('id', id);
  await loadExercisePage();
}

async function loadExercisePage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  const _exParams = new URLSearchParams(location.search);
  if (_exParams.get('new') === '1') { setTimeout(() => openExerciseModal(null), 150); }
  const { data: exercises } = await db.from('exercises').select('*').eq('username', user).order('created_at', { ascending: false });
  const grid = document.getElementById('exercise-grid');
  const tEx = T;
  if (!exercises || exercises.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">💪</div><div class="empty-state-text">${tEx.empty_exercises}</div></div>`;
    return;
  }
  window._exerciseCache = exercises;
  // Group by tag, sort groups by count descending
  const tagGroups = {};
  exercises.forEach(ex => {
    const tag = ex.tag || 'sonstiges';
    if (!tagGroups[tag]) tagGroups[tag] = [];
    tagGroups[tag].push(ex);
  });
  const sortedTags = Object.keys(tagGroups).sort((a, b) => tagGroups[b].length - tagGroups[a].length);
  grid.innerHTML = sortedTags.map(tagId => {
    const tg = getTagInfo(tagId);
    const tagLabel = tg ? (tEx['tag_' + tg.id] || tg.id) : tagId;
    const tagColor = tg ? tg.color : '#7a84a0';
    const items = tagGroups[tagId];
    return `
    <div class="ex-tag-group">
      <div class="ex-tag-group-header" style="color:${tagColor}">${tagLabel} <span style="opacity:0.5;font-size:13px">(${items.length})</span></div>
      <div class="ex-tag-group-grid">
        ${items.map(ex => {
          const safeId = ex.id.replace(/'/g, "\\'");
          return `
          <div class="exercise-card-mini" draggable="true" data-id="${ex.id}">
            <div class="ex-mini-img">
              ${ex.image_data
                ? `<img src="${ex.image_data}" alt="${ex.name}" />`
                : `<div class="ex-mini-abbr">${ex.abbreviation || '?'}</div>`}
            </div>
            <div class="ex-mini-name">${ex.name}</div>
            <div class="ex-mini-actions">
              <button class="btn-icon" style="width:28px;height:28px" onclick="openExerciseModal(window._exerciseCache.find(e=>e.id==='${safeId}'))">✏️</button>
              <button class="btn-icon btn-icon-red" style="width:28px;height:28px" onclick="deleteExercise('${safeId}')">🗑️</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}
