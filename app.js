/* ============================================================
   FitTrack – Main App JS
   Auth + Exercises + Training + Plan
   ============================================================ */

// ── Supabase ──────────────────────────────────────────────────
const SUPABASE_URL  = 'https://sybnmbzrmvcywmxuwzla.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Ym5tYnpybXZjeXdteHV3emxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDc1MzUsImV4cCI6MjA4ODcyMzUzNX0.V14s6AXpXs_caO7yS7mAcmlz9sBDL8uvwDPMppBE7JI';
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── i18n ──────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    nav_exercises:'Übungen', nav_training:'Training', nav_plan:'Plan',
    menu_settings:'⚙️ Einstellungen', menu_message:'✉️ Nachricht', menu_logout:'🚪 Abmelden',
    bn_home:'Home', bn_exercises:'Übungen', bn_training:'Training', bn_plan:'Plan', bn_profile:'Profil',
    dashboard_label:'Dein Dashboard',
    greeting_sub:'Bereit für dein Training? Erstelle Übungen, baue Trainings und plane deine Woche.',
    card_exercises_title:'Übungen', card_exercises_desc:'Erstelle und verwalte deine Übungen',
    card_training_title:'Training', card_training_desc:'Baue individuelle Trainingseinheiten',
    card_plan_title:'Trainingsplan', card_plan_desc:'Plane deine Woche mit Trainings',
    settings_label:'Einstellungen', profile_headline:'Dein Profil ✏️',
    profile_sub:'Passe deine persönlichen Informationen an.',
    label_birthdate:'Geburtsdatum', label_gender:'Geschlecht', label_language:'Sprache',
    btn_save:'Speichern ✓', btn_logout_btn:'🚪 Abmelden',
    gender_select:'— Bitte wählen —', gender_male:'Männlich', gender_female:'Weiblich',
    gender_diverse:'Divers', gender_none:'Keine Angabe',
    lang_de:'Deutsch', lang_en:'English', lang_hu:'Magyar',
    page_exercises_title:'💪 Übungen', btn_new_exercise:'+ Neue Übung',
    btn_import:'⬆️ Importieren', btn_export:'⬇️ Exportieren', btn_new_plan:'Neuer Plan',
    plan_name_ph:'Planname (z.B. Woche 1)', btn_save_plan:'Plan speichern ✓',
    contact_title:'Nachricht senden', label_contact_name:'Dein Name', label_contact_msg:'Nachricht',
    btn_send:'Nachricht senden ✉️', send_success:'Nachricht erfolgreich gesendet!',
    send_error:'Fehler beim Senden. Bitte erneut versuchen.',
    contact_name_ph:'Dein Name', contact_msg_ph:'Deine Nachricht…',
  },
  en: {
    nav_exercises:'Exercises', nav_training:'Training', nav_plan:'Plan',
    menu_settings:'⚙️ Settings', menu_message:'✉️ Message', menu_logout:'🚪 Logout',
    bn_home:'Home', bn_exercises:'Exercises', bn_training:'Training', bn_plan:'Plan', bn_profile:'Profile',
    dashboard_label:'Your Dashboard',
    greeting_sub:'Ready for your workout? Create exercises, build trainings and plan your week.',
    card_exercises_title:'Exercises', card_exercises_desc:'Create and manage your exercises',
    card_training_title:'Training', card_training_desc:'Build individual training sessions',
    card_plan_title:'Training Plan', card_plan_desc:'Plan your week with trainings',
    settings_label:'Settings', profile_headline:'Your Profile ✏️',
    profile_sub:'Customize your personal information.',
    label_birthdate:'Date of Birth', label_gender:'Gender', label_language:'Language',
    btn_save:'Save ✓', btn_logout_btn:'🚪 Logout',
    gender_select:'— Please select —', gender_male:'Male', gender_female:'Female',
    gender_diverse:'Diverse', gender_none:'Prefer not to say',
    lang_de:'Deutsch', lang_en:'English', lang_hu:'Magyar',
    page_exercises_title:'💪 Exercises', btn_new_exercise:'+ New Exercise',
    btn_import:'⬆️ Import', btn_export:'⬇️ Export', btn_new_plan:'New Plan',
    plan_name_ph:'Plan name (e.g. Week 1)', btn_save_plan:'Save Plan ✓',
    contact_title:'Send Message', label_contact_name:'Your Name', label_contact_msg:'Message',
    btn_send:'Send Message ✉️', send_success:'Message sent successfully!',
    send_error:'Error sending message. Please try again.',
    contact_name_ph:'Your name', contact_msg_ph:'Your message…',
  },
  hu: {
    nav_exercises:'Gyakorlatok', nav_training:'Edzés', nav_plan:'Terv',
    menu_settings:'⚙️ Beállítások', menu_message:'✉️ Üzenet', menu_logout:'🚪 Kijelentkezés',
    bn_home:'Főoldal', bn_exercises:'Gyakorlat', bn_training:'Edzés', bn_plan:'Terv', bn_profile:'Profil',
    dashboard_label:'Irányítópult',
    greeting_sub:'Készen állsz az edzésre? Hozz létre gyakorlatokat, edzéseket és tervezd meg a heted.',
    card_exercises_title:'Gyakorlatok', card_exercises_desc:'Hozz létre és kezelj gyakorlatokat',
    card_training_title:'Edzés', card_training_desc:'Egyéni edzéseket állíthatsz össze',
    card_plan_title:'Edzésterv', card_plan_desc:'Tervezd meg a heted edzésekkel',
    settings_label:'Beállítások', profile_headline:'A profilod ✏️',
    profile_sub:'Módosítsd személyes adataidat.',
    label_birthdate:'Születési dátum', label_gender:'Nem', label_language:'Nyelv',
    btn_save:'Mentés ✓', btn_logout_btn:'🚪 Kijelentkezés',
    gender_select:'— Kérjük válasszon —', gender_male:'Férfi', gender_female:'Nő',
    gender_diverse:'Egyéb', gender_none:'Nem kíván nyilatkozni',
    lang_de:'Deutsch', lang_en:'English', lang_hu:'Magyar',
    page_exercises_title:'💪 Gyakorlatok', btn_new_exercise:'+ Új gyakorlat',
    btn_import:'⬆️ Importálás', btn_export:'⬇️ Exportálás', btn_new_plan:'Új terv',
    plan_name_ph:'Terv neve (pl. 1. hét)', btn_save_plan:'Terv mentése ✓',
    contact_title:'Üzenet küldése', label_contact_name:'Neved', label_contact_msg:'Üzenet',
    btn_send:'Üzenet küldése ✉️', send_success:'Az üzenet sikeresen el lett küldve!',
    send_error:'Hiba az üzenet küldésekor. Kérjük próbálja újra.',
    contact_name_ph:'A neved', contact_msg_ph:'Az üzeneted…',
  }
};

function getLang()    { return localStorage.getItem('fitmol_lang') || 'de'; }
function setLang(l)   { localStorage.setItem('fitmol_lang', l); }

function applyLanguage(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.de;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  // Update gender/language select options on profile page
  const gSel = document.getElementById('prof-gender');
  if (gSel) {
    gSel.options[0].textContent = t.gender_select;
    gSel.options[1].textContent = t.gender_male;
    gSel.options[2].textContent = t.gender_female;
    gSel.options[3].textContent = t.gender_diverse;
    gSel.options[4].textContent = t.gender_none;
  }
  const lSel = document.getElementById('prof-language');
  if (lSel) {
    lSel.options[0].textContent = t.lang_de;
    lSel.options[1].textContent = t.lang_en;
    lSel.options[2].textContent = t.lang_hu;
  }
  document.documentElement.lang = lang;
}

// ── Helpers ───────────────────────────────────────────────────
async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function getSession()          { return sessionStorage.getItem('hc_session'); }
function setSession(u)         { sessionStorage.setItem('hc_session', u); }
function clearSession()        { sessionStorage.removeItem('hc_session'); }

function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
}
function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

function resizeImage(dataUrl, maxPx, quality) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > h) { h = Math.round(h * maxPx / w); w = maxPx; }
      else       { w = Math.round(w * maxPx / h); h = maxPx; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

function todayGerman() {
  return new Date().toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric' });
}

// ── Auth ──────────────────────────────────────────────────────
function guardHome() {
  const u = getSession();
  if (!u) { window.location.href = 'index.html'; return null; }
  return u;
}
function guardAuth() {
  if (getSession()) window.location.href = 'home.html';
}
function logout() { clearSession(); window.location.href = 'index.html'; }

function switchTab(tab) {
  const show = tab === 'login' ? 'panel-login' : 'panel-register';
  const hide = tab === 'login' ? 'panel-register' : 'panel-login';
  document.getElementById(show).style.display = '';
  document.getElementById(hide).style.display = 'none';
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
}

async function doLogin() {
  hideAlert('login-alert');
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  if (!username || !password) { showAlert('login-alert', 'Bitte alle Felder ausfüllen.'); return; }
  const btn = document.querySelector('#panel-login .btn');
  btn.disabled = true; btn.textContent = 'Anmelden…';
  try {
    const hash = await hashPassword(password);
    const { data, error } = await db.from('users').select('username').eq('username', username).eq('password_hash', hash).maybeSingle();
    if (error) throw error;
    if (!data) { showAlert('login-alert', 'Benutzername oder Passwort falsch.'); return; }
    setSession(username);
    window.location.href = 'home.html';
  } catch (e) { showAlert('login-alert', 'Verbindungsfehler. Bitte erneut versuchen.'); }
  finally { btn.disabled = false; btn.textContent = 'Anmelden →'; }
}

async function doRegister() {
  hideAlert('register-alert'); hideAlert('register-success');
  const username  = document.getElementById('reg-username').value.trim();
  const password  = document.getElementById('reg-password').value;
  const password2 = document.getElementById('reg-password2').value;
  if (!username || !password || !password2) { showAlert('register-alert', 'Bitte alle Felder ausfüllen.'); return; }
  if (username.length < 3) { showAlert('register-alert', 'Benutzername muss mindestens 3 Zeichen lang sein.'); return; }
  if (password.length < 6) { showAlert('register-alert', 'Passwort muss mindestens 6 Zeichen lang sein.'); return; }
  if (password !== password2) { showAlert('register-alert', 'Passwörter stimmen nicht überein.'); return; }
  const btn = document.querySelector('#panel-register .btn');
  btn.disabled = true; btn.textContent = 'Konto wird erstellt…';
  try {
    const hash = await hashPassword(password);
    const { error } = await db.from('users').insert({ username, password_hash: hash });
    if (error) {
      if (error.code === '23505') showAlert('register-alert', 'Dieser Benutzername ist bereits vergeben.');
      else throw error;
      return;
    }
    showAlert('register-success', `Konto "${username}" erfolgreich erstellt!`, 'success');
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-password2').value = '';
    setTimeout(() => switchTab('login'), 2000);
  } catch (e) { showAlert('register-alert', 'Verbindungsfehler. Bitte erneut versuchen.'); }
  finally { btn.disabled = false; btn.textContent = 'Konto erstellen ✓'; }
}

// ── Avatar & Tool Dropdowns ───────────────────────────────────
function toggleAvatarMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById('avatar-menu');
  const toolMenu = document.getElementById('tool-menu');
  if (toolMenu) toolMenu.classList.remove('open');
  menu.classList.toggle('open');
}

function toggleToolMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById('tool-menu');
  const avatarMenu = document.getElementById('avatar-menu');
  if (avatarMenu) avatarMenu.classList.remove('open');
  menu.classList.toggle('open');
}

document.addEventListener('click', () => {
  const menu = document.getElementById('avatar-menu');
  if (menu) menu.classList.remove('open');
  const toolMenu = document.getElementById('tool-menu');
  if (toolMenu) toolMenu.classList.remove('open');
});

// ── Navbar Avatar ─────────────────────────────────────────────
async function loadNavbarAvatar(username) {
  const avatar  = document.getElementById('nav-avatar');
  const menuUser = document.getElementById('nav-username');
  if (menuUser) menuUser.textContent = username;
  if (!avatar) return;
  const { data } = await db.from('users').select('avatar_data, language').eq('username', username).maybeSingle();
  if (data && data.avatar_data) avatar.innerHTML = `<img src="${data.avatar_data}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />`;
  else avatar.textContent = username.charAt(0).toUpperCase();
  // Sync language from DB and apply
  if (data && data.language) {
    setLang(data.language);
    applyLanguage(data.language);
  } else {
    applyLanguage(getLang());
  }
}

// ── Profile ───────────────────────────────────────────────────
let pendingAvatarData = null;

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
  const { data } = await db.from('users').select('birthdate, gender, avatar_data, language').eq('username', user).maybeSingle();
  if (!data) return;
  if (data.birthdate) document.getElementById('prof-birthdate').value = data.birthdate;
  if (data.gender)    document.getElementById('prof-gender').value    = data.gender;
  if (data.language) {
    const langSel = document.getElementById('prof-language');
    if (langSel) langSel.value = data.language;
  }
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
  const language  = langSel ? (langSel.value || 'de') : 'de';
  const updateData = { birthdate, gender, language };
  if (pendingAvatarData) updateData.avatar_data = pendingAvatarData;
  try {
    const { error } = await db.from('users').update(updateData).eq('username', user).select();
    if (error) throw error;
    setLang(language);
    applyLanguage(language);
    showAlert('profile-success', TRANSLATIONS[language]?.send_success || 'Profil erfolgreich gespeichert!', 'success');
    // Re-show correct save success text
    showAlert('profile-success', language === 'en' ? 'Profile saved successfully!' : language === 'hu' ? 'Profil sikeresen mentve!' : 'Profil erfolgreich gespeichert!', 'success');
    pendingAvatarData = null;
    await loadNavbarAvatar(user);
  } catch (e) { showAlert('profile-alert', `Fehler: ${e.message || 'Bitte erneut versuchen.'}`); }
  finally {
    const t = TRANSLATIONS[getLang()] || TRANSLATIONS.de;
    btn.disabled = false; btn.textContent = t.btn_save;
  }
}

// ── Contact Modal ─────────────────────────────────────────────
// EmailJS setup — replace these 3 values with your own:
//   1. Go to https://emailjs.com and create a free account
//   2. Add a Gmail service → copy SERVICE_ID
//   3. Create a template with vars {{name}} and {{message}} → copy TEMPLATE_ID
//   4. Copy your Public Key from Account > API Keys
const EMAILJS_SERVICE_ID  = 'service_maq182k';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

function injectContactModal() {
  if (document.getElementById('contact-modal')) return;
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="modal-overlay" id="contact-modal">
      <div class="modal-card" style="max-width:460px">
        <div class="modal-header">
          <div class="modal-title" id="contact-modal-title" data-i18n="contact_title">Nachricht senden</div>
          <button class="modal-close" onclick="closeContactModal()">×</button>
        </div>
        <div id="contact-alert" class="alert alert-error"></div>
        <div id="contact-success" class="alert alert-success"></div>
        <div class="form-group">
          <label class="form-label" for="contact-name" data-i18n="label_contact_name">Dein Name</label>
          <input class="form-input" type="text" id="contact-name" data-i18n-ph="contact_name_ph" placeholder="Dein Name" />
        </div>
        <div class="form-group">
          <label class="form-label" for="contact-message" data-i18n="label_contact_msg">Nachricht</label>
          <textarea class="form-textarea" id="contact-message" data-i18n-ph="contact_msg_ph" placeholder="Deine Nachricht…" rows="5"></textarea>
        </div>
        <button class="btn btn-primary" id="contact-send-btn" onclick="sendMessage()" data-i18n="btn_send">Nachricht senden ✉️</button>
      </div>
    </div>`;
  document.body.appendChild(div.firstElementChild);
  applyLanguage(getLang());
}

function openContactModal() {
  injectContactModal();
  hideAlert('contact-alert');
  hideAlert('contact-success');
  document.getElementById('contact-name').value    = '';
  document.getElementById('contact-message').value = '';
  document.getElementById('contact-modal').classList.add('open');
}

function closeContactModal() {
  const m = document.getElementById('contact-modal');
  if (m) m.classList.remove('open');
}

async function sendMessage() {
  const t    = TRANSLATIONS[getLang()] || TRANSLATIONS.de;
  const name = document.getElementById('contact-name').value.trim();
  const msg  = document.getElementById('contact-message').value.trim();
  hideAlert('contact-alert'); hideAlert('contact-success');
  if (!name || !msg) { showAlert('contact-alert', t.send_error); return; }
  const btn = document.getElementById('contact-send-btn');
  btn.disabled = true; btn.textContent = '…';
  try {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        message:   msg,
        to_email:  'jozsefmolnar2004@gmail.com'
      });
      showAlert('contact-success', t.send_success, 'success');
      document.getElementById('contact-name').value    = '';
      document.getElementById('contact-message').value = '';
    } else {
      // Fallback: open mailto link
      const body = encodeURIComponent(`Name: ${name}\n\n${msg}`);
      window.open(`mailto:jozsefmolnar2004@gmail.com?subject=FitMol%20Nachricht%20von%20${encodeURIComponent(name)}&body=${body}`);
      showAlert('contact-success', t.send_success, 'success');
    }
  } catch (e) { showAlert('contact-alert', t.send_error); }
  finally { btn.disabled = false; btn.textContent = t.btn_send; }
}

// ── BMI Calculator Modal ──────────────────────────────────────
function injectBmiModal() {
  if (document.getElementById('bmi-modal')) return;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-overlay" id="bmi-modal">
      <div class="modal-card" style="max-width:440px">
        <div class="modal-header">
          <div class="modal-title">📊 BMI Rechner</div>
          <button class="modal-close" onclick="closeBmiModal()">×</button>
        </div>
        <div class="bmi-grid" style="margin-bottom:20px">
          <div class="form-group" style="margin:0">
            <label class="form-label" for="bmi-height">Größe (cm)</label>
            <input class="form-input" type="number" id="bmi-height" placeholder="z.B. 175" min="100" max="250" />
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label" for="bmi-weight">Gewicht (kg)</label>
            <input class="form-input" type="number" id="bmi-weight" placeholder="z.B. 70" min="20" max="300" />
          </div>
        </div>
        <button class="btn btn-primary" onclick="calculateBmi()">Berechnen →</button>
        <div class="bmi-result-box" id="bmi-result-box">
          <div class="bmi-result-number" id="bmi-result-number"></div>
          <div class="bmi-result-category" id="bmi-result-category"></div>
          <div class="bmi-result-tip" id="bmi-result-tip"></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el.firstElementChild);
}

function openBmiModal() {
  injectBmiModal();
  document.getElementById('bmi-height').value = '';
  document.getElementById('bmi-weight').value = '';
  document.getElementById('bmi-result-box').classList.remove('show', 'bmi-underweight', 'bmi-normal', 'bmi-overweight', 'bmi-obese');
  document.getElementById('bmi-modal').classList.add('open');
}

function closeBmiModal() {
  const m = document.getElementById('bmi-modal');
  if (m) m.classList.remove('open');
}

function calculateBmi() {
  const h = parseFloat(document.getElementById('bmi-height').value);
  const w = parseFloat(document.getElementById('bmi-weight').value);
  if (!h || !w || h < 50 || w < 10) return;
  const bmi = w / ((h / 100) ** 2);
  const box = document.getElementById('bmi-result-box');
  const numEl = document.getElementById('bmi-result-number');
  const catEl = document.getElementById('bmi-result-category');
  const tipEl = document.getElementById('bmi-result-tip');
  box.classList.remove('bmi-underweight', 'bmi-normal', 'bmi-overweight', 'bmi-obese');
  numEl.textContent = bmi.toFixed(1);
  let cls, cat, tip;
  if      (bmi < 18.5) { cls = 'bmi-underweight'; cat = 'Untergewicht';  tip = 'Dein BMI ist zu niedrig. Achte auf eine ausgewogene Ernährung.'; }
  else if (bmi < 25)   { cls = 'bmi-normal';       cat = 'Normalgewicht'; tip = 'Perfekt! Dein Gewicht liegt im gesunden Bereich.'; }
  else if (bmi < 30)   { cls = 'bmi-overweight';   cat = 'Übergewicht';   tip = 'Leicht erhöhter BMI. Sport und Ernährung können helfen.'; }
  else                  { cls = 'bmi-obese';        cat = 'Adipositas';    tip = 'Erhöhtes gesundheitliches Risiko. Ärztliche Beratung empfohlen.'; }
  catEl.textContent = cat;
  tipEl.textContent = tip;
  box.classList.add(cls, 'show');
}

// ── Calorie AI Modal ──────────────────────────────────────────
function injectCalorieModal() {
  if (document.getElementById('calorie-modal')) return;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-overlay" id="calorie-modal">
      <div class="modal-card" style="max-width:440px">
        <div class="modal-header">
          <div class="modal-title">🤖 Calorie AI</div>
          <button class="modal-close" onclick="closeCalorieModal()">×</button>
        </div>
        <div class="calorie-placeholder">
          <div class="calorie-placeholder-icon">🚧</div>
          <div class="calorie-placeholder-text">Function still in progress...</div>
          <div class="calorie-placeholder-sub">Diese Funktion ist in Entwicklung und wird bald verfügbar sein.</div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el.firstElementChild);
}

function openCalorieModal() {
  injectCalorieModal();
  document.getElementById('calorie-modal').classList.add('open');
}

function closeCalorieModal() {
  const m = document.getElementById('calorie-modal');
  if (m) m.classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
//  EXERCISES
// ═══════════════════════════════════════════════════════════════

let pendingExerciseImage = null;
let cameraStream = null;
let editingExerciseId = null;

function openExerciseModal(exercise = null) {
  editingExerciseId = null;
  pendingExerciseImage = null;
  document.getElementById('ex-name').value  = '';
  document.getElementById('ex-abbr').value  = '';
  document.getElementById('ex-desc').value  = '';
  document.getElementById('edit-exercise-id').value = '';
  document.getElementById('modal-title-text').textContent = 'Neue Übung';
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
    document.getElementById('modal-title-text').textContent = 'Übung bearbeiten';
    document.getElementById('ex-name').value  = exercise.name  || '';
    document.getElementById('ex-abbr').value  = exercise.abbreviation || '';
    document.getElementById('ex-desc').value  = exercise.description  || '';
    if (exercise.image_data) {
      uploadImg.src = exercise.image_data; uploadImg.style.display = 'block';
      document.getElementById('upload-placeholder').style.display = 'none';
      pendingExerciseImage = exercise.image_data;
    }
  }
  document.getElementById('exercise-modal').classList.add('open');
}

function closeExerciseModal() {
  document.getElementById('exercise-modal').classList.remove('open');
  stopCamera();
}

function switchImgTab(tab) {
  document.getElementById('img-panel-upload').style.display = tab === 'upload' ? '' : 'none';
  document.getElementById('img-panel-camera').style.display = tab === 'camera' ? '' : 'none';
  document.getElementById('img-tab-upload').classList.toggle('active', tab === 'upload');
  document.getElementById('img-tab-camera').classList.toggle('active', tab === 'camera');
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
    showAlert('modal-alert', 'Kamerazugriff nicht möglich. Bitte Erlaubnis erteilen.');
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

async function saveExercise() {
  hideAlert('modal-alert');
  const user = getSession(); if (!user) return;
  const name = document.getElementById('ex-name').value.trim();
  const abbr = document.getElementById('ex-abbr').value.trim();
  const desc = document.getElementById('ex-desc').value.trim();
  if (!name) { showAlert('modal-alert', 'Bitte einen Namen eingeben.'); return; }
  const btn = document.getElementById('modal-save-btn');
  btn.disabled = true; btn.textContent = 'Speichern…';
  const payload = { username: user, name, abbreviation: abbr, description: desc, image_data: pendingExerciseImage || null };
  try {
    let error;
    if (editingExerciseId) {
      ({ error } = await db.from('exercises').update(payload).eq('id', editingExerciseId));
    } else {
      ({ error } = await db.from('exercises').insert(payload));
    }
    if (error) throw error;
    closeExerciseModal();
    await loadExercisePage();
  } catch (e) { showAlert('modal-alert', `Fehler: ${e.message}`); }
  finally { btn.disabled = false; btn.textContent = 'Übung speichern'; }
}

async function deleteExercise(id) {
  if (!confirm('Übung wirklich löschen?')) return;
  await db.from('exercises').delete().eq('id', id);
  await loadExercisePage();
}

async function loadExercisePage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  const { data: exercises } = await db.from('exercises').select('*').eq('username', user).order('created_at', { ascending: false });
  const grid = document.getElementById('exercise-grid');
  if (!exercises || exercises.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💪</div><div class="empty-state-text">Noch keine Übungen erstellt.</div></div>';
    return;
  }
  grid.innerHTML = exercises.map(ex => `
    <div class="exercise-card" draggable="true" data-id="${ex.id}">
      <div class="exercise-card-img">
        ${ex.image_data
          ? `<img src="${ex.image_data}" alt="${ex.name}" />`
          : `<div class="exercise-card-abbr-bg">${ex.abbreviation || '?'}</div>`}
        ${ex.abbreviation ? `<div class="exercise-card-abbr-tag">${ex.abbreviation}</div>` : ''}
      </div>
      <div class="exercise-card-body">
        <div class="exercise-card-name">${ex.name}</div>
        <div class="exercise-card-desc">${ex.description || '—'}</div>
      </div>
      <div class="exercise-card-actions">
        <button class="btn-icon" onclick='openExerciseModal(${JSON.stringify(ex)})'>✏️</button>
        <button class="btn-icon btn-icon-red" onclick="deleteExercise('${ex.id}')">🗑️</button>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════════════
//  TRAINING
// ═══════════════════════════════════════════════════════════════

let currentTrainingExercises = []; // [{exercise_id, name, abbreviation, image_data, sets, weight, reps}]
let allExercises = []; // global cache for drag-by-index

function getWeightOptions() {
  let html = '<option value="0">Körpergew.</option>';
  for (let i = 1; i <= 100; i++) html += `<option value="${i}">${i} kg</option>`;
  return html;
}

function getRepsOptions() {
  let html = '';
  for (let i = 1; i <= 25; i++) html += `<option value="${i}">${i}</option>`;
  html += '<option value="26">25+</option>';
  return html;
}

function renderTrainingExercises() {
  const list  = document.getElementById('dropzone-exercises');
  const empty = document.getElementById('dropzone-empty');
  if (currentTrainingExercises.length === 0) {
    list.style.display = 'none'; empty.style.display = '';
    return;
  }
  empty.style.display = 'none'; list.style.display = '';
  list.innerHTML = currentTrainingExercises.map((ex, i) => `
    <div class="tex-card" data-index="${i}">
      <div class="tex-header">
        <div class="tex-info">
          <div class="tex-num">${i + 1}.</div>
          <div class="tex-thumb">
            ${ex.image_data ? `<img src="${ex.image_data}" />` : (ex.abbreviation || '?')}
          </div>
          <div class="tex-ex-name">${ex.name}</div>
        </div>
        <button class="tex-remove" onclick="removeFromTraining(${i})">×</button>
      </div>
      <div class="tex-controls">
        <div class="tex-ctrl">
          <label>Sätze</label>
          <div class="sets-btns">
            ${[1,2,3,4].map(n => `<button class="set-btn${ex.sets===n?' active':''}" onclick="selectSets(${i},${n})">${n}</button>`).join('')}
          </div>
        </div>
        <div class="tex-ctrl">
          <label>Gewicht</label>
          <select class="tex-select" onchange="updateTrainingEx(${i},'weight',this.value)">
            ${getWeightOptions()}
          </select>
        </div>
        <div class="tex-ctrl">
          <label>Wdh.</label>
          <select class="tex-select" onchange="updateTrainingEx(${i},'reps',this.value)">
            ${getRepsOptions()}
          </select>
        </div>
      </div>
    </div>
  `).join('');

  // Restore select values
  currentTrainingExercises.forEach((ex, i) => {
    const card = list.children[i];
    if (!card) return;
    const selects = card.querySelectorAll('.tex-select');
    selects[0].value = ex.weight;
    selects[1].value = ex.reps;
  });
}

function addExerciseToTraining(exercise) {
  const already = currentTrainingExercises.find(e => e.exercise_id === exercise.id);
  if (already) return;
  currentTrainingExercises.push({
    exercise_id:  exercise.id,
    name:         exercise.name,
    abbreviation: exercise.abbreviation || '',
    image_data:   exercise.image_data   || null,
    sets:   1,
    weight: 0,
    reps:   10
  });
  renderTrainingExercises();
}

function removeFromTraining(index) {
  currentTrainingExercises.splice(index, 1);
  renderTrainingExercises();
}

function selectSets(index, n) {
  currentTrainingExercises[index].sets = n;
  renderTrainingExercises();
}

function updateTrainingEx(index, field, value) {
  currentTrainingExercises[index][field] = Number(value);
}

// Drag exercise from sidebar by index (avoids base64 serialization issues)
function onDragExStart(event, index) {
  event.dataTransfer.setData('ex-index', String(index));
}

function onDropExercise(event) {
  event.preventDefault();
  document.getElementById('training-dropzone').classList.remove('drag-over');
  const index = parseInt(event.dataTransfer.getData('ex-index'));
  if (!isNaN(index) && allExercises[index]) {
    addExerciseToTraining(allExercises[index]);
  }
}

function resetTrainingBuilder() {
  currentTrainingExercises = [];
  document.getElementById('tr-title').value = '';
  document.getElementById('tr-desc').value  = '';
  document.getElementById('tr-date').value  = todayGerman();
  document.getElementById('edit-training-id').value = '';
  hideAlert('training-alert');
  renderTrainingExercises();
}

async function saveTraining() {
  hideAlert('training-alert');
  const user  = getSession(); if (!user) return;
  const title = document.getElementById('tr-title').value.trim();
  const desc  = document.getElementById('tr-desc').value.trim();
  const date  = document.getElementById('tr-date').value;
  const editId = document.getElementById('edit-training-id').value;
  if (!title) { showAlert('training-alert', 'Bitte einen Titel eingeben.'); return; }
  const btn = document.getElementById('training-save-btn');
  btn.disabled = true; btn.textContent = 'Speichern…';
  const payload = {
    username:  user,
    title,
    description: desc,
    date,
    exercises: currentTrainingExercises.map(({ image_data, ...rest }) => rest) // don't store images in training JSON
  };
  try {
    let error;
    if (editId) {
      ({ error } = await db.from('trainings').update(payload).eq('id', editId));
    } else {
      ({ error } = await db.from('trainings').insert(payload));
    }
    if (error) throw error;
    resetTrainingBuilder();
    await loadTrainings();
  } catch (e) { showAlert('training-alert', `Fehler: ${e.message}`); }
  finally { btn.disabled = false; btn.textContent = 'Training speichern ✓'; }
}

async function deleteTraining(id) {
  if (!confirm('Training wirklich löschen?')) return;
  await db.from('trainings').delete().eq('id', id);
  await loadTrainings();
}

function viewTraining(id) {
  const tr = window._allTrainingCache ? window._allTrainingCache.find(t => t.id === id) : null;
  if (!tr) return;
  document.getElementById('vt-title').textContent = tr.title;
  document.getElementById('vt-meta').textContent  = tr.date ? `📅 ${tr.date}` : '';
  const descEl = document.getElementById('vt-desc');
  if (tr.description) { descEl.textContent = tr.description; descEl.style.display = ''; }
  else descEl.style.display = 'none';
  const exList = tr.exercises || [];
  document.getElementById('vt-exercises').innerHTML = exList.length === 0
    ? '<p style="color:var(--gray);font-size:14px">Keine Übungen eingetragen.</p>'
    : exList.map((ex, i) => `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f0f2f8">
        <div style="font-size:20px;font-weight:900;color:var(--blue);min-width:28px">${i + 1}.</div>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:800">${ex.name}${ex.abbreviation ? ` <span style="color:var(--gray);font-size:12px">(${ex.abbreviation})</span>` : ''}</div>
          <div style="font-size:13px;color:var(--gray);margin-top:3px">
            <span style="background:var(--blue-light);color:var(--blue);border-radius:6px;padding:2px 8px;margin-right:6px;font-weight:700">${ex.sets} Sätze</span>
            <span style="background:#f0fff8;color:#27ae60;border-radius:6px;padding:2px 8px;margin-right:6px;font-weight:700">${ex.weight === 0 ? 'Körpergewicht' : ex.weight + ' kg'}</span>
            <span style="background:#fff8e8;color:#e67e22;border-radius:6px;padding:2px 8px;font-weight:700">${ex.reps >= 26 ? '25+' : ex.reps} Wdh.</span>
          </div>
        </div>
      </div>
    `).join('');
  document.getElementById('view-training-modal').classList.add('open');
}

function loadTrainingIntoBuilder(id) {
  const tr = window._allTrainingCache ? window._allTrainingCache.find(t => t.id === id) : null;
  if (!tr) return;
  document.getElementById('tr-title').value = tr.title || '';
  document.getElementById('tr-desc').value  = tr.description || '';
  document.getElementById('tr-date').value  = tr.date || todayGerman();
  document.getElementById('edit-training-id').value = tr.id;
  currentTrainingExercises = (tr.exercises || []).map(ex => ({ ...ex, image_data: null }));
  renderTrainingExercises();
  document.getElementById('builder-section').scrollIntoView({ behavior: 'smooth' });
}

async function loadTrainings() {
  const user = getSession(); if (!user) return;
  const { data: trainings } = await db.from('trainings').select('*').eq('username', user).order('created_at', { ascending: false });
  window._allTrainingCache = trainings || [];
  const list = document.getElementById('saved-trainings-list');
  if (!trainings || trainings.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🏋️</div><div class="empty-state-text">Noch keine Trainings gespeichert.</div></div>';
    return;
  }
  list.innerHTML = trainings.map(tr => `
    <div class="saved-training-card">
      <div class="saved-tr-info" style="cursor:pointer" onclick="viewTraining('${tr.id}')">
        <div class="saved-tr-title">${tr.title}</div>
        <div class="saved-tr-meta">${tr.date ? '📅 ' + tr.date : ''}${tr.description ? ' · ' + tr.description : ''}</div>
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
  `).join('');
}

async function loadTrainingPage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  // Set today's date
  document.getElementById('tr-date').value = todayGerman();

  // Load exercises into sidebar
  const { data: exercises } = await db.from('exercises').select('*').eq('username', user).order('name');
  allExercises = exercises || [];
  const sidebar = document.getElementById('sidebar-exercises');
  if (allExercises.length === 0) {
    sidebar.innerHTML = '<div class="empty-state" style="padding:24px 0"><div class="empty-state-icon" style="font-size:28px">💪</div><div class="empty-state-text" style="font-size:13px">Noch keine Übungen. <a href="exercises.html" style="color:var(--blue)">Erstellen →</a></div></div>';
  } else {
    sidebar.innerHTML = allExercises.map((ex, idx) => `
      <div class="sidebar-ex"
           draggable="true"
           ondragstart="onDragExStart(event, ${idx})"
           onclick="addExerciseToTraining(allExercises[${idx}])">
        <div class="sidebar-ex-thumb">
          ${ex.image_data ? `<img src="${ex.image_data}" />` : (ex.abbreviation || ex.name.charAt(0))}
        </div>
        <div>
          <div class="sidebar-ex-name">${ex.name}</div>
          <div class="sidebar-ex-abbr">${ex.abbreviation || ''}</div>
        </div>
      </div>
    `).join('');
  }
  await loadTrainings();
}

// ═══════════════════════════════════════════════════════════════
//  PLAN
// ═══════════════════════════════════════════════════════════════

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_NAMES = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };

let currentPlan = {};  // { Mo: [null, null], Di: [...], … }
let allTrainings = []; // for plan page
let selectedChipId = null; // for tap-to-add on mobile

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
      if (data.version !== 1 || data.app !== 'FitMol') {
        alert('Diese Datei ist kein gültiger FitMol-Plan.');
        return;
      }
      const user = getSession();
      showAlert('plan-alert', 'Plan wird importiert…');

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
      showAlert('plan-success', `Plan "${data.planName}" erfolgreich importiert!`, 'success');
      await loadPlanPage();
    } catch (err) {
      showAlert('plan-alert', `Importfehler: ${err.message}`);
    }
  };
  input.click();
}

function renderPlanGrid() {
  const grid = document.getElementById('plan-grid');
  grid.innerHTML = DAYS.map(day => {
    const slots = currentPlan[day] || [null, null];
    return `
      <div class="plan-day-col">
        <div class="plan-day-header">${DAY_NAMES[day].substring(0,2)}<span style="display:block;font-size:10px;font-weight:500;color:var(--gray)">${DAY_NAMES[day]}</span></div>
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
  if (!allTrainings || allTrainings.length === 0) {
    row.innerHTML = '<span style="color:var(--gray);font-size:13px">Noch keine Trainings vorhanden. <a href="training.html" style="color:var(--blue)">Training erstellen →</a></span>';
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
  if (!name) { showAlert('plan-alert', 'Bitte einen Plannamen eingeben.'); return; }
  const btn = document.querySelector('.plan-save-row .btn');
  btn.disabled = true; btn.textContent = 'Speichern…';
  try {
    const { error } = await db.from('plans').insert({ username: user, name, days: currentPlan });
    if (error) throw error;
    showAlert('plan-success', `Plan "${name}" gespeichert!`, 'success');
    await loadSavedPlans();
  } catch (e) { showAlert('plan-alert', `Fehler: ${e.message}`); }
  finally { btn.disabled = false; btn.textContent = 'Plan speichern ✓'; }
}

async function deletePlan(id) {
  if (!confirm('Plan wirklich löschen?')) return;
  await db.from('plans').delete().eq('id', id);
  await loadSavedPlans();
}

function loadPlanIntoGrid(plan) {
  currentPlan = {};
  DAYS.forEach(d => {
    currentPlan[d] = (plan.days[d] || [null, null]).slice(0, 2);
    while (currentPlan[d].length < 2) currentPlan[d].push(null);
  });
  document.getElementById('plan-name').value = plan.name + ' (Kopie)';
  renderPlanGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadSavedPlans() {
  const user = getSession(); if (!user) return;
  const { data: plans } = await db.from('plans').select('*').eq('username', user).order('created_at', { ascending: false });
  const list = document.getElementById('saved-plans-list');
  if (!plans || plans.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📅</div><div class="empty-state-text">Noch keine Pläne gespeichert.</div></div>';
    return;
  }
  list.innerHTML = plans.map(pl => `
    <div class="plan-card">
      <div>
        <div class="plan-card-name">${pl.name}</div>
        <div class="plan-card-meta">${new Date(pl.created_at).toLocaleDateString('de-DE')}</div>
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
  await loadNavbarAvatar(user);
  resetPlan();
  const { data } = await db.from('trainings').select('id, title').eq('username', user).order('created_at', { ascending: false });
  allTrainings = data || [];
  renderTrainingChips();
  renderPlanGrid();
  await loadSavedPlans();
}

// ── Enter Key (Auth Pages) ────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const loginPanel = document.getElementById('panel-login');
  if (loginPanel) {
    if (document.getElementById('tab-login').classList.contains('active')) doLogin();
    else doRegister();
  }
});

// ── Page Init ─────────────────────────────────────────────────
(function init() {
  // Apply saved language immediately (before async calls)
  applyLanguage(getLang());

  if (document.getElementById('panel-login')) { guardAuth(); return; }

  // Inject modals on all app pages
  injectContactModal();
  injectBmiModal();
  injectCalorieModal();

  const user = guardHome(); if (!user) return;

  if (document.getElementById('greeting-name')) {
    // Home page
    document.getElementById('greeting-name').textContent = user;
    loadNavbarAvatar(user);
  } else if (document.getElementById('exercise-grid')) {
    // Exercises page
    loadExercisePage();
  } else if (document.getElementById('training-dropzone')) {
    // Training page
    loadTrainingPage();
  } else if (document.getElementById('plan-grid')) {
    // Plan page
    loadPlanPage();
  } else if (document.getElementById('prof-birthdate')) {
    // Profile page
    loadProfile();
  }
})();
