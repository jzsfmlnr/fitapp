/* ============================================================
   FitTrack – Profile Page JS
   ============================================================ */

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    pendingAvatarData = await resizeImage(e.target.result, 120, 0.6);
    const imgEl  = document.getElementById('profile-avatar-img');
    const holder = document.getElementById('profile-avatar-placeholder');
    imgEl.src = pendingAvatarData; imgEl.style.display = 'block'; holder.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

async function loadProfile() {
  const user = guardHome();
  if (!user) return;
  const dispName = document.getElementById('profile-display-name');
  if (dispName) dispName.textContent = user;
  await loadNavbarAvatar(user);
  const { data } = await db.from('users').select('birthdate, gender, avatar_data').eq('username', user).maybeSingle();
  if (!data) return;
  if (data.birthdate) document.getElementById('prof-birthdate').value = data.birthdate;
  if (data.gender)    document.getElementById('prof-gender').value    = data.gender;
  const langSel = document.getElementById('prof-language');
  if (langSel) langSel.value = getLang();
  if (data.avatar_data) {
    const imgEl  = document.getElementById('profile-avatar-img');
    const holder = document.getElementById('profile-avatar-placeholder');
    imgEl.src = data.avatar_data; imgEl.style.display = 'block'; holder.style.display = 'none';
  } else {
    const initial = document.getElementById('profile-avatar-initial');
    if (initial) initial.textContent = user.charAt(0).toUpperCase();
  }
}

async function saveProfile() {
  const user = getSession(); if (!user) return;
  hideAlert('profile-alert'); hideAlert('profile-success');
  const btn = document.getElementById('save-btn');
  btn.disabled = true; btn.textContent = '…';
  const birthdate = document.getElementById('prof-birthdate').value || null;
  const gender    = document.getElementById('prof-gender').value    || null;
  const langSel   = document.getElementById('prof-language');
  const language  = langSel ? (langSel.value || 'en') : 'en';
  // Language is stored only in localStorage, not in Supabase
  setLang(language);
  const updateData = { birthdate, gender };
  if (pendingAvatarData) updateData.avatar_data = pendingAvatarData;
  try {
    const { error } = await db.from('users').update(updateData).eq('username', user).select();
    if (error) throw error;
    applyLanguage(language);
    const tLang = TRANSLATIONS[language] || TRANSLATIONS.en;
    showAlert('profile-success', tLang.profile_save_success, 'success');
    if (pendingAvatarData) sessionStorage.removeItem('fitmol_avatar_' + user);
    pendingAvatarData = null;
    await loadNavbarAvatar(user);
  } catch (e) {
    const tErr = T;
    showAlert('profile-alert', `${tErr.err_connection} ${e.message || ''}`);
  }
  finally {
    const t = T;
    btn.disabled = false; btn.textContent = t.btn_save;
  }
}

// ── Change Password Modal ─────────────────────────────────────
function openChangePasswordModal() {
  const t = T;
  const existing = document.getElementById('pw-change-modal');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'pw-change-modal';
  el.className = 'modal-overlay open';
  el.innerHTML = `
    <div class="modal-card" style="max-width:380px">
      <div class="modal-header">
        <div class="modal-title">${t.pw_change_btn}</div>
        <button class="modal-close" onclick="document.getElementById('pw-change-modal').remove()">×</button>
      </div>
      <div style="padding:16px 0;display:flex;flex-direction:column;gap:12px">
        <div id="pw-alert" class="alert alert-error"></div>
        <div id="pw-success" class="alert alert-success"></div>
        <input class="form-input" type="password" id="pw-new" placeholder="${t.pw_new}" />
        <input class="form-input" type="password" id="pw-confirm" placeholder="${t.pw_confirm}" />
        <button class="btn btn-primary" onclick="submitChangePassword()">✓ ${t.pw_change_btn}</button>
      </div>
    </div>`;
  document.body.appendChild(el);
}

async function submitChangePassword() {
  const t = T;
  const alertEl = document.getElementById('pw-alert');
  const successEl = document.getElementById('pw-success');
  if (alertEl) { alertEl.style.display = 'none'; alertEl.textContent = ''; }
  if (successEl) { successEl.style.display = 'none'; successEl.textContent = ''; }

  const newPw = document.getElementById('pw-new').value;
  const confirmPw = document.getElementById('pw-confirm').value;

  if (newPw.length < 4) {
    if (alertEl) { alertEl.textContent = t.pw_short; alertEl.style.display = 'block'; }
    return;
  }
  if (newPw !== confirmPw) {
    if (alertEl) { alertEl.textContent = t.pw_mismatch; alertEl.style.display = 'block'; }
    return;
  }

  const user = getSession();
  if (!user) return;

  const newHash = await hashPassword(newPw);
  await db.from('users').update({ password_hash: newHash }).eq('username', user);
  if (successEl) { successEl.textContent = t.pw_success; successEl.style.display = 'block'; }
  document.getElementById('pw-old').value = '';
  document.getElementById('pw-new').value = '';
  document.getElementById('pw-confirm').value = '';
  setTimeout(() => { const m = document.getElementById('pw-change-modal'); if (m) m.remove(); }, 1500);
}

// ── Impressum & Datenschutz ───────────────────────────────────
function openImprintModal() {
  const t = T;
  const existing = document.getElementById('imprint-modal');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'imprint-modal';
  el.className = 'modal-overlay open';
  el.innerHTML = `
    <div class="modal-card" style="max-width:460px;max-height:80vh;overflow-y:auto">
      <div class="modal-header">
        <div class="modal-title">${t.imprint_title}</div>
        <button class="modal-close" onclick="document.getElementById('imprint-modal').remove()">×</button>
      </div>
      <div style="font-size:14px;line-height:1.8;color:var(--black)">
        <p><strong>FitMol</strong></p>
        <p>Jozsef Molnar</p>
        <p>Vienna</p>
        <p style="margin-top:10px">E-Mail: kontakt@fitmol.at</p>
        <p style="margin-top:10px;color:var(--gray);font-size:13px">${t.imprint_note}</p>
      </div>
    </div>`;
  document.body.appendChild(el);
}

function openPrivacyModal() {
  const t = T;
  const existing = document.getElementById('privacy-modal');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'privacy-modal';
  el.className = 'modal-overlay open';
  el.innerHTML = `
    <div class="modal-card" style="max-width:460px;max-height:80vh;overflow-y:auto">
      <div class="modal-header">
        <div class="modal-title">${t.privacy_title}</div>
        <button class="modal-close" onclick="document.getElementById('privacy-modal').remove()">×</button>
      </div>
      <div style="font-size:14px;line-height:1.8;color:var(--black)">
        <p><strong>${t.privacy_data_title}</strong></p>
        <p style="color:var(--gray);font-size:13px">${t.privacy_data_body}</p>
        <p style="margin-top:12px"><strong>Supabase</strong></p>
        <p style="color:var(--gray);font-size:13px">${t.privacy_host_body}</p>
        <p style="margin-top:12px"><strong>${t.privacy_contact}</strong></p>
        <p style="color:var(--gray);font-size:13px">kontakt@fitmol.app</p>
      </div>
    </div>`;
  document.body.appendChild(el);
}
