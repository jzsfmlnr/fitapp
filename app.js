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
    // Exercises
    page_exercises_title:'💪 Übungen', btn_new_exercise:'+ Neue Übung',
    empty_exercises:'Noch keine Übungen erstellt.',
    modal_new_exercise:'Neue Übung', modal_edit_exercise:'Übung bearbeiten',
    label_abbr:'Abkürzung', ex_name_ph:'z.B. Kniebeuge', ex_abbr_ph:'z.B. KB',
    label_desc:'Beschreibung', ex_desc_ph:'Kurze Beschreibung der Übung…',
    label_image:'Bild', btn_upload_tab:'📁 Hochladen', btn_camera_tab:'📷 Kamera',
    click_to_upload:'Klicken zum Hochladen', btn_capture:'📸 Aufnehmen', btn_cancel:'Abbrechen',
    btn_save_exercise:'Übung speichern', tool_bmi_label:'📊 BMI Rechner',
    // Training
    page_training_title:'📋 Meine Trainings', btn_new_training:'+ Neues Training',
    empty_trainings:'Noch keine Trainings gespeichert.',
    section_create_training:'➕ Training erstellen', btn_clear:'Leeren',
    empty_sidebar_exercises:'Noch keine Übungen.',
    label_training_info:'Training Info', label_title:'Titel',
    tr_title_ph:'z.B. Beintraining', tr_desc_ph:'Kurze Beschreibung…',
    label_date:'Datum', section_add_exercises:'Übungen hinzufügen',
    dropzone_hint:'Übungen ziehen oder antippen', btn_save_training:'Training speichern ✓',
    label_sets:'Sätze', label_weight:'Gewicht', label_reps:'Wdh.',
    body_weight_short:'Körpergew.', body_weight:'Körpergewicht',
    no_exercises_in_training:'Keine Übungen eingetragen.',
    badge_sets:'Sätze', badge_reps:'Wdh.',
    // Plan
    page_plan_title:'📅 Trainingsplan',
    chips_label:'Trainings — ziehen oder antippen, dann auf einen Tag klicken',
    empty_trainings_chips:'Noch keine Trainings.',
    section_saved_plans:'📋 Gespeicherte Pläne',
    empty_plans:'Noch keine Pläne gespeichert.',
    copy_suffix:' (Kopie)',
    // Common
    btn_import:'⬆️ Importieren', btn_export:'⬇️ Exportieren', btn_new_plan:'Neuer Plan',
    plan_name_ph:'Planname (z.B. Woche 1)', btn_save_plan:'Plan speichern ✓',
    err_name_required:'Bitte einen Namen eingeben.',
    err_title_required:'Bitte einen Titel eingeben.',
    err_plan_name_required:'Bitte einen Plannamen eingeben.',
    err_camera:'Kamerazugriff nicht möglich. Bitte Erlaubnis erteilen.',
    confirm_delete_exercise:'Übung wirklich löschen?',
    confirm_delete_training:'Training wirklich löschen?',
    confirm_delete_plan:'Plan wirklich löschen?',
    saving:'Speichern…', err_connection:'Verbindungsfehler. Bitte erneut versuchen.',
    invalid_plan_file:'Diese Datei ist kein gültiger FitMol-Plan.',
    importing:'Plan wird importiert…',
    profile_save_success:'Profil erfolgreich gespeichert!',
    err_fill_all:'Bitte alle Felder ausfüllen.',
    err_username_short:'Benutzername muss mindestens 3 Zeichen lang sein.',
    err_password_short:'Passwort muss mindestens 6 Zeichen lang sein.',
    err_passwords_mismatch:'Passwörter stimmen nicht überein.',
    err_login_invalid:'Benutzername oder Passwort falsch.',
    account_created:'Konto erfolgreich erstellt!',
    // Contact
    contact_title:'Nachricht senden', label_contact_name:'Dein Name', label_contact_msg:'Nachricht',
    btn_send:'Nachricht senden ✉️', send_success:'Nachricht erfolgreich gesendet!',
    send_error:'Fehler beim Senden. Bitte erneut versuchen.',
    contact_name_ph:'Dein Name', contact_msg_ph:'Deine Nachricht…',
    // BMI
    bmi_title:'📊 BMI Rechner', bmi_height_label:'Größe (cm)', bmi_weight_label:'Gewicht (kg)',
    bmi_height_ph:'z.B. 175', bmi_weight_ph:'z.B. 70', btn_calculate:'Berechnen →',
    bmi_underweight:'Untergewicht', bmi_normal:'Normalgewicht',
    bmi_overweight:'Übergewicht', bmi_obese:'Adipositas',
    bmi_tip_underweight:'Dein BMI ist zu niedrig. Achte auf eine ausgewogene Ernährung.',
    bmi_tip_normal:'Dein Gewicht liegt im gesunden Bereich.',
    bmi_tip_overweight:'Leicht erhöhter BMI. Sport und Ernährung können helfen.',
    bmi_tip_obese:'Erhöhtes gesundheitliches Risiko. Ärztliche Beratung empfohlen.',
    calorie_coming_soon:'Diese Funktion ist in Entwicklung und wird bald verfügbar sein.',
    // Training builder
    label_intensity:'Intensität', modal_new_training_title:'Training erstellen', modal_edit_training:'Training bearbeiten',
    // Exercise Tags
    label_tag:'Muskelgruppe', err_tag_required:'Bitte eine Muskelgruppe auswählen.',
    tag_schulter:'Schulter', tag_ruecken:'Rücken', tag_bizeps:'Bizeps', tag_trizeps:'Trizeps',
    tag_unterarm:'Unterarm', tag_beine:'Beine', tag_brust:'Brust', tag_bauch:'Bauch', tag_sonstiges:'Sonstiges',
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
    // Exercises
    page_exercises_title:'💪 Exercises', btn_new_exercise:'+ New Exercise',
    empty_exercises:'No exercises created yet.',
    modal_new_exercise:'New Exercise', modal_edit_exercise:'Edit Exercise',
    label_abbr:'Abbreviation', ex_name_ph:'e.g. Squat', ex_abbr_ph:'e.g. SQ',
    label_desc:'Description', ex_desc_ph:'Brief description of the exercise…',
    label_image:'Image', btn_upload_tab:'📁 Upload', btn_camera_tab:'📷 Camera',
    click_to_upload:'Click to upload', btn_capture:'📸 Capture', btn_cancel:'Cancel',
    btn_save_exercise:'Save Exercise', tool_bmi_label:'📊 BMI Calculator',
    // Training
    page_training_title:'📋 My Trainings', btn_new_training:'+ New Training',
    empty_trainings:'No trainings saved yet.',
    section_create_training:'➕ Create Training', btn_clear:'Clear',
    empty_sidebar_exercises:'No exercises.',
    label_training_info:'Training Info', label_title:'Title',
    tr_title_ph:'e.g. Leg Training', tr_desc_ph:'Brief description…',
    label_date:'Date', section_add_exercises:'Add Exercises',
    dropzone_hint:'Drag or tap exercises', btn_save_training:'Save Training ✓',
    label_sets:'Sets', label_weight:'Weight', label_reps:'Reps',
    body_weight_short:'Bodyweight', body_weight:'Bodyweight',
    no_exercises_in_training:'No exercises added.',
    badge_sets:'Sets', badge_reps:'Reps',
    // Plan
    page_plan_title:'📅 Training Plan',
    chips_label:'Trainings — drag or tap, then click on a day',
    empty_trainings_chips:'No trainings yet.',
    section_saved_plans:'📋 Saved Plans',
    empty_plans:'No plans saved yet.',
    copy_suffix:' (Copy)',
    // Common
    btn_import:'⬆️ Import', btn_export:'⬇️ Export', btn_new_plan:'New Plan',
    plan_name_ph:'Plan name (e.g. Week 1)', btn_save_plan:'Save Plan ✓',
    err_name_required:'Please enter a name.',
    err_title_required:'Please enter a title.',
    err_plan_name_required:'Please enter a plan name.',
    err_camera:'Camera access not possible. Please grant permission.',
    confirm_delete_exercise:'Really delete exercise?',
    confirm_delete_training:'Really delete training?',
    confirm_delete_plan:'Really delete plan?',
    saving:'Saving…', err_connection:'Connection error. Please try again.',
    invalid_plan_file:'This file is not a valid FitMol plan.',
    importing:'Importing plan…',
    profile_save_success:'Profile saved successfully!',
    err_fill_all:'Please fill in all fields.',
    err_username_short:'Username must be at least 3 characters.',
    err_password_short:'Password must be at least 6 characters.',
    err_passwords_mismatch:'Passwords do not match.',
    err_login_invalid:'Invalid username or password.',
    account_created:'Account created successfully!',
    // Contact
    contact_title:'Send Message', label_contact_name:'Your Name', label_contact_msg:'Message',
    btn_send:'Send Message ✉️', send_success:'Message sent successfully!',
    send_error:'Error sending message. Please try again.',
    contact_name_ph:'Your name', contact_msg_ph:'Your message…',
    // BMI
    bmi_title:'📊 BMI Calculator', bmi_height_label:'Height (cm)', bmi_weight_label:'Weight (kg)',
    bmi_height_ph:'e.g. 175', bmi_weight_ph:'e.g. 70', btn_calculate:'Calculate →',
    bmi_underweight:'Underweight', bmi_normal:'Normal weight',
    bmi_overweight:'Overweight', bmi_obese:'Obesity',
    bmi_tip_underweight:'Your BMI is too low. Pay attention to a balanced diet.',
    bmi_tip_normal:'Your weight is in the healthy range.',
    bmi_tip_overweight:'Slightly elevated BMI. Exercise and diet can help.',
    bmi_tip_obese:'Increased health risk. Medical advice recommended.',
    calorie_coming_soon:'This feature is in development and will be available soon.',
    // Training builder
    label_intensity:'Intensity', modal_new_training_title:'Create Training', modal_edit_training:'Edit Training',
    // Exercise Tags
    label_tag:'Muscle Group', err_tag_required:'Please select a muscle group.',
    tag_schulter:'Shoulder', tag_ruecken:'Back', tag_bizeps:'Biceps', tag_trizeps:'Triceps',
    tag_unterarm:'Forearm', tag_beine:'Legs', tag_brust:'Chest', tag_bauch:'Abs', tag_sonstiges:'Other',
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
    // Exercises
    page_exercises_title:'💪 Gyakorlatok', btn_new_exercise:'+ Új gyakorlat',
    empty_exercises:'Még nincsenek gyakorlatok.',
    modal_new_exercise:'Új gyakorlat', modal_edit_exercise:'Gyakorlat szerkesztése',
    label_abbr:'Rövidítés', ex_name_ph:'pl. Guggolás', ex_abbr_ph:'pl. GG',
    label_desc:'Leírás', ex_desc_ph:'A gyakorlat rövid leírása…',
    label_image:'Kép', btn_upload_tab:'📁 Feltöltés', btn_camera_tab:'📷 Kamera',
    click_to_upload:'Kattintson a feltöltéshez', btn_capture:'📸 Felvétel', btn_cancel:'Mégse',
    btn_save_exercise:'Gyakorlat mentése', tool_bmi_label:'📊 BMI Számológép',
    // Training
    page_training_title:'📋 Edzéseim', btn_new_training:'+ Új edzés',
    empty_trainings:'Még nincsenek mentett edzések.',
    section_create_training:'➕ Edzés létrehozása', btn_clear:'Törlés',
    empty_sidebar_exercises:'Nincsenek gyakorlatok.',
    label_training_info:'Edzés info', label_title:'Cím',
    tr_title_ph:'pl. Lábedzés', tr_desc_ph:'Rövid leírás…',
    label_date:'Dátum', section_add_exercises:'Gyakorlatok hozzáadása',
    dropzone_hint:'Húzd vagy érintsd meg a gyakorlatokat', btn_save_training:'Edzés mentése ✓',
    label_sets:'Szetek', label_weight:'Súly', label_reps:'Ism.',
    body_weight_short:'Testsúly', body_weight:'Testsúly',
    no_exercises_in_training:'Nincsenek hozzáadott gyakorlatok.',
    badge_sets:'Szetek', badge_reps:'Ism.',
    // Plan
    page_plan_title:'📅 Edzésterv',
    chips_label:'Edzések — húzd vagy érintsd meg, majd kattints egy napra',
    empty_trainings_chips:'Még nincsenek edzések.',
    section_saved_plans:'📋 Mentett tervek',
    empty_plans:'Még nincsenek mentett tervek.',
    copy_suffix:' (Másolat)',
    // Common
    btn_import:'⬆️ Importálás', btn_export:'⬇️ Exportálás', btn_new_plan:'Új terv',
    plan_name_ph:'Terv neve (pl. 1. hét)', btn_save_plan:'Terv mentése ✓',
    err_name_required:'Kérjük adjon meg egy nevet.',
    err_title_required:'Kérjük adjon meg egy címet.',
    err_plan_name_required:'Kérjük adjon meg egy terv nevet.',
    err_camera:'A kamera elérése nem lehetséges. Kérjük adja meg az engedélyt.',
    confirm_delete_exercise:'Biztosan törli a gyakorlatot?',
    confirm_delete_training:'Biztosan törli az edzést?',
    confirm_delete_plan:'Biztosan törli a tervet?',
    saving:'Mentés…', err_connection:'Kapcsolódási hiba. Kérjük próbálja újra.',
    invalid_plan_file:'Ez a fájl nem érvényes FitMol terv.',
    importing:'Terv importálása…',
    profile_save_success:'Profil sikeresen mentve!',
    err_fill_all:'Kérjük töltse ki az összes mezőt.',
    err_username_short:'A felhasználónévnek legalább 3 karakter hosszúnak kell lennie.',
    err_password_short:'A jelszónak legalább 6 karakter hosszúnak kell lennie.',
    err_passwords_mismatch:'A jelszavak nem egyeznek.',
    err_login_invalid:'Érvénytelen felhasználónév vagy jelszó.',
    account_created:'Fiók sikeresen létrehozva!',
    // Contact
    contact_title:'Üzenet küldése', label_contact_name:'Neved', label_contact_msg:'Üzenet',
    btn_send:'Üzenet küldése ✉️', send_success:'Az üzenet sikeresen el lett küldve!',
    send_error:'Hiba az üzenet küldésekor. Kérjük próbálja újra.',
    contact_name_ph:'A neved', contact_msg_ph:'Az üzeneted…',
    // BMI
    bmi_title:'📊 BMI Számológép', bmi_height_label:'Magasság (cm)', bmi_weight_label:'Súly (kg)',
    bmi_height_ph:'pl. 175', bmi_weight_ph:'pl. 70', btn_calculate:'Számítás →',
    bmi_underweight:'Alulsúly', bmi_normal:'Normál súly',
    bmi_overweight:'Túlsúly', bmi_obese:'Elhízás',
    bmi_tip_underweight:'A BMI értéked túl alacsony. Ügyelj a kiegyensúlyozott táplálkozásra.',
    bmi_tip_normal:'A testsúlyod egészséges tartományban van.',
    bmi_tip_overweight:'Enyhén emelkedett BMI. A sport és az étrend segíthet.',
    bmi_tip_obese:'Fokozott egészségügyi kockázat. Orvosi tanácsadás ajánlott.',
    calorie_coming_soon:'Ez a funkció fejlesztés alatt áll és hamarosan elérhető lesz.',
    // Training builder
    label_intensity:'Intenzitás', modal_new_training_title:'Edzés létrehozása', modal_edit_training:'Edzés szerkesztése',
    // Exercise Tags
    label_tag:'Izomcsoport', err_tag_required:'Kérjük válasszon izomcsoportot.',
    tag_schulter:'Váll', tag_ruecken:'Hát', tag_bizeps:'Bicepsz', tag_trizeps:'Tricepsz',
    tag_unterarm:'Alkar', tag_beine:'Lábak', tag_brust:'Mell', tag_bauch:'Has', tag_sonstiges:'Egyéb',
  }
};

function getLang()    { return localStorage.getItem('fitmol_lang') || 'en'; }
function setLang(l)   { localStorage.setItem('fitmol_lang', l); }

function applyLanguage(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
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
  if (!username || !password) { showAlert('login-alert', 'Please fill in all fields.'); return; }
  const btn = document.querySelector('#panel-login .btn');
  btn.disabled = true; btn.textContent = 'Logging in…';
  try {
    const hash = await hashPassword(password);
    const { data, error } = await db.from('users').select('username').eq('username', username).eq('password_hash', hash).maybeSingle();
    if (error) throw error;
    if (!data) { showAlert('login-alert', 'Invalid username or password.'); return; }
    setSession(username);
    window.location.href = 'home.html';
  } catch (e) { showAlert('login-alert', 'Connection error. Please try again.'); }
  finally { btn.disabled = false; btn.textContent = 'Login →'; }
}

async function doRegister() {
  hideAlert('register-alert'); hideAlert('register-success');
  const username  = document.getElementById('reg-username').value.trim();
  const password  = document.getElementById('reg-password').value;
  const password2 = document.getElementById('reg-password2').value;
  if (!username || !password || !password2) { showAlert('register-alert', 'Please fill in all fields.'); return; }
  if (username.length < 3) { showAlert('register-alert', 'Username must be at least 3 characters.'); return; }
  if (password.length < 6) { showAlert('register-alert', 'Password must be at least 6 characters.'); return; }
  if (password !== password2) { showAlert('register-alert', 'Passwords do not match.'); return; }
  const btn = document.querySelector('#panel-register .btn');
  btn.disabled = true; btn.textContent = 'Creating account…';
  try {
    const hash = await hashPassword(password);
    const { error } = await db.from('users').insert({ username, password_hash: hash });
    if (error) {
      if (error.code === '23505') showAlert('register-alert', 'This username is already taken.');
      else throw error;
      return;
    }
    showAlert('register-success', `Account "${username}" created successfully!`, 'success');
    document.getElementById('reg-username').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-password2').value = '';
    setTimeout(() => switchTab('login'), 2000);
  } catch (e) { showAlert('register-alert', 'Connection error. Please try again.'); }
  finally { btn.disabled = false; btn.textContent = 'Create Account ✓'; }
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
  const language  = langSel ? (langSel.value || 'en') : 'en';
  const updateData = { birthdate, gender, language };
  if (pendingAvatarData) updateData.avatar_data = pendingAvatarData;
  try {
    const { error } = await db.from('users').update(updateData).eq('username', user).select();
    if (error) throw error;
    setLang(language);
    applyLanguage(language);
    const tLang = TRANSLATIONS[language] || TRANSLATIONS.en;
    showAlert('profile-success', tLang.profile_save_success, 'success');
    pendingAvatarData = null;
    await loadNavbarAvatar(user);
  } catch (e) {
    const tErr = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
    showAlert('profile-alert', `${tErr.err_connection} ${e.message || ''}`);
  }
  finally {
    const t = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
const EMAILJS_TEMPLATE_ID = 'template_mjubl19';
const EMAILJS_PUBLIC_KEY  = '7N3bLQQxxqv6dYckx';

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
  const t    = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
          <div class="modal-title" data-i18n="bmi_title">📊 BMI Calculator</div>
          <button class="modal-close" onclick="closeBmiModal()">×</button>
        </div>
        <div class="bmi-grid" style="margin-bottom:20px">
          <div class="form-group" style="margin:0">
            <label class="form-label" for="bmi-height" data-i18n="bmi_height_label">Height (cm)</label>
            <input class="form-input" type="number" id="bmi-height" data-i18n-ph="bmi_height_ph" placeholder="e.g. 175" min="100" max="250" />
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label" for="bmi-weight" data-i18n="bmi_weight_label">Weight (kg)</label>
            <input class="form-input" type="number" id="bmi-weight" data-i18n-ph="bmi_weight_ph" placeholder="e.g. 70" min="20" max="300" />
          </div>
        </div>
        <button class="btn btn-primary" onclick="calculateBmi()" data-i18n="btn_calculate">Calculate →</button>
        <div class="bmi-result-box" id="bmi-result-box">
          <div class="bmi-result-number" id="bmi-result-number"></div>
          <div class="bmi-result-category" id="bmi-result-category"></div>
          <div class="bmi-result-tip" id="bmi-result-tip"></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el.firstElementChild);
  applyLanguage(getLang());
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
  const t = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
  box.classList.remove('bmi-underweight', 'bmi-normal', 'bmi-overweight', 'bmi-obese');
  numEl.textContent = bmi.toFixed(1);
  let cls, cat, tip;
  if      (bmi < 18.5) { cls = 'bmi-underweight'; cat = t.bmi_underweight; tip = t.bmi_tip_underweight; }
  else if (bmi < 25)   { cls = 'bmi-normal';       cat = t.bmi_normal;     tip = t.bmi_tip_normal; }
  else if (bmi < 30)   { cls = 'bmi-overweight';   cat = t.bmi_overweight; tip = t.bmi_tip_overweight; }
  else                  { cls = 'bmi-obese';        cat = t.bmi_obese;      tip = t.bmi_tip_obese; }
  catEl.textContent = cat;
  tipEl.textContent = tip;
  box.classList.add(cls, 'show');
}

// ── Calorie AI Modal ──────────────────────────────────────────
let _cachedOpenAIKey = null;

async function getOpenAIKey() {
  if (_cachedOpenAIKey) return _cachedOpenAIKey;
  const { data, error } = await db
    .from('app_config')
    .select('value')
    .eq('key', 'openai_api_key')
    .single();
  if (error || !data) throw new Error('OpenAI API Key nicht konfiguriert.');
  _cachedOpenAIKey = data.value;
  return _cachedOpenAIKey;
}

let _calorieStream = null; // camera stream ref

function injectCalorieModal() {
  if (document.getElementById('calorie-modal')) return;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-overlay" id="calorie-modal">
      <div class="modal-card calorie-modal-card">
        <div class="modal-header">
          <div class="modal-title">🤖 Calorie AI</div>
          <button class="modal-close" onclick="closeCalorieModal()">×</button>
        </div>

        <!-- Mode Toggle -->
        <div class="cal-mode-toggle">
          <button class="cal-mode-btn active" onclick="switchCalorieMode('camera')">📸 Kamera</button>
          <button class="cal-mode-btn" onclick="switchCalorieMode('text')">✏️ Text</button>
        </div>

        <!-- Camera Mode -->
        <div class="cal-mode-panel active" id="cal-camera-panel">
          <div class="cal-camera-area" id="cal-camera-area">
            <video id="cal-video" class="cal-video" autoplay playsinline></video>
            <canvas id="cal-canvas" style="display:none"></canvas>
            <img id="cal-preview-img" class="cal-preview-img" style="display:none" />
          </div>
          <div class="cal-camera-btns">
            <button class="btn btn-primary" style="width:auto;padding:12px 24px" id="cal-snap-btn" onclick="calSnap()">📸 Foto aufnehmen</button>
            <button class="btn btn-outline" style="width:auto;padding:12px 24px;display:none" id="cal-retake-btn" onclick="calRetake()">🔄 Nochmal</button>
            <button class="btn btn-primary" style="width:auto;padding:12px 24px;display:none;background:linear-gradient(135deg,#36B37E,#1a8a5a)" id="cal-analyze-btn" onclick="calAnalyzeImage()">🔍 Analysieren</button>
          </div>
        </div>

        <!-- Text Mode -->
        <div class="cal-mode-panel" id="cal-text-panel">
          <div style="margin-bottom:12px">
            <label class="form-label">Lebensmittel eingeben</label>
            <div style="display:flex;gap:8px">
              <input class="form-input" type="text" id="cal-text-input" placeholder="z.B. 200g Hähnchenbrust mit Reis" style="flex:1" />
              <button class="btn btn-primary" style="width:auto;padding:12px 20px;white-space:nowrap" onclick="calAnalyzeText()">🔍</button>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div class="cal-loading" id="cal-loading">
          <div class="cal-loading-spinner"></div>
          <div style="font-size:14px;color:var(--gray);margin-top:12px">AI analysiert...</div>
        </div>

        <!-- Result -->
        <div class="cal-result" id="cal-result"></div>
      </div>
    </div>`;
  document.body.appendChild(el.firstElementChild);
}

function openCalorieModal() {
  injectCalorieModal();
  const m = document.getElementById('calorie-modal');
  m.classList.add('open');
  // Reset state
  document.getElementById('cal-result').innerHTML = '';
  document.getElementById('cal-result').style.display = 'none';
  document.getElementById('cal-loading').style.display = 'none';
  switchCalorieMode('camera');
}

function closeCalorieModal() {
  const m = document.getElementById('calorie-modal');
  if (m) m.classList.remove('open');
  calStopCamera();
}

function switchCalorieMode(mode) {
  document.querySelectorAll('.cal-mode-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cal-mode-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.cal-mode-btn[onclick*="${mode}"]`).classList.add('active');
  document.getElementById(mode === 'camera' ? 'cal-camera-panel' : 'cal-text-panel').classList.add('active');
  if (mode === 'camera') {
    calStartCamera();
  } else {
    calStopCamera();
  }
}

async function calStartCamera() {
  const video = document.getElementById('cal-video');
  const preview = document.getElementById('cal-preview-img');
  if (preview) { preview.style.display = 'none'; }
  if (video) { video.style.display = 'block'; }
  document.getElementById('cal-snap-btn').style.display = '';
  document.getElementById('cal-retake-btn').style.display = 'none';
  document.getElementById('cal-analyze-btn').style.display = 'none';
  try {
    if (_calorieStream) return;
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    _calorieStream = stream;
    video.srcObject = stream;
  } catch (e) {
    console.error('Camera error:', e);
    document.getElementById('cal-camera-area').innerHTML = `<div style="text-align:center;padding:40px;color:var(--gray)">📷 Kamera nicht verfügbar.<br><span style="font-size:12px">Bitte erlaube den Kamerazugriff oder nutze die Texteingabe.</span></div>`;
  }
}

function calStopCamera() {
  if (_calorieStream) {
    _calorieStream.getTracks().forEach(t => t.stop());
    _calorieStream = null;
  }
}

function calSnap() {
  const video = document.getElementById('cal-video');
  const canvas = document.getElementById('cal-canvas');
  const preview = document.getElementById('cal-preview-img');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  preview.src = dataUrl;
  preview.style.display = 'block';
  video.style.display = 'none';
  calStopCamera();
  document.getElementById('cal-snap-btn').style.display = 'none';
  document.getElementById('cal-retake-btn').style.display = '';
  document.getElementById('cal-analyze-btn').style.display = '';
}

function calRetake() {
  document.getElementById('cal-preview-img').style.display = 'none';
  document.getElementById('cal-video').style.display = 'block';
  document.getElementById('cal-snap-btn').style.display = '';
  document.getElementById('cal-retake-btn').style.display = 'none';
  document.getElementById('cal-analyze-btn').style.display = 'none';
  document.getElementById('cal-result').style.display = 'none';
  calStartCamera();
}

async function calAnalyzeImage() {
  const apiKey = await getOpenAIKey();
  const dataUrl = document.getElementById('cal-preview-img').src;
  const base64 = dataUrl.split(',')[1];
  document.getElementById('cal-loading').style.display = 'flex';
  document.getElementById('cal-result').style.display = 'none';
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: 'Analysiere dieses Lebensmittel-Bild. Antworte NUR als JSON mit exakt diesem Format: {"name":"Name des Lebensmittels","calories":Zahl,"protein":Zahl,"carbs":Zahl,"fat":Zahl,"grade":"A/B/C/D/E","reason":"Kurze Begründung der Bewertung"}. calories/protein/carbs/fat pro geschätzte Portion. Grade: A=sehr gesund, B=gesund, C=neutral, D=ungesund, E=sehr ungesund. Antworte NUR mit dem JSON, kein anderer Text.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
          ]
        }],
        max_tokens: 300
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.choices[0].message.content;
    const json = JSON.parse(text.replace(/```json\n?/g, '').replace(/```/g, '').trim());
    calShowResult(json);
  } catch (e) {
    console.error('Calorie AI error:', e);
    document.getElementById('cal-result').style.display = 'block';
    document.getElementById('cal-result').innerHTML = `<div style="text-align:center;color:var(--red);padding:16px">Fehler: ${e.message}</div>`;
  }
  document.getElementById('cal-loading').style.display = 'none';
}

async function calAnalyzeText() {
  const apiKey = await getOpenAIKey();
  const input = document.getElementById('cal-text-input');
  const query = input.value.trim();
  if (!query) return;
  document.getElementById('cal-loading').style.display = 'flex';
  document.getElementById('cal-result').style.display = 'none';
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: `Analysiere dieses Lebensmittel: "${query}". Antworte NUR als JSON mit exakt diesem Format: {"name":"Name des Lebensmittels","calories":Zahl,"protein":Zahl,"carbs":Zahl,"fat":Zahl,"grade":"A/B/C/D/E","reason":"Kurze Begründung der Bewertung"}. calories/protein/carbs/fat pro geschätzte Portion. Grade: A=sehr gesund, B=gesund, C=neutral, D=ungesund, E=sehr ungesund. Antworte NUR mit dem JSON, kein anderer Text.`
        }],
        max_tokens: 300
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.choices[0].message.content;
    const json = JSON.parse(text.replace(/```json\n?/g, '').replace(/```/g, '').trim());
    calShowResult(json);
  } catch (e) {
    console.error('Calorie AI error:', e);
    document.getElementById('cal-result').style.display = 'block';
    document.getElementById('cal-result').innerHTML = `<div style="text-align:center;color:var(--red);padding:16px">Fehler: ${e.message}</div>`;
  }
  document.getElementById('cal-loading').style.display = 'none';
}

function calShowResult(r) {
  const gradeColors = { A: '#36B37E', B: '#6dd400', C: '#C9A227', D: '#E8732A', E: '#E74C3C' };
  const gradeBgs = { A: 'rgba(54,179,126,0.15)', B: 'rgba(109,212,0,0.15)', C: 'rgba(201,162,39,0.15)', D: 'rgba(232,115,42,0.15)', E: 'rgba(231,76,60,0.15)' };
  const color = gradeColors[r.grade] || '#7a84a0';
  const bg = gradeBgs[r.grade] || 'rgba(122,132,160,0.15)';
  const el = document.getElementById('cal-result');
  el.style.display = 'block';
  el.innerHTML = `
    <div class="cal-result-card">
      <div class="cal-result-grade" style="background:${bg};color:${color}">${r.grade}</div>
      <div class="cal-result-name">${r.name}</div>
      <div class="cal-result-reason">${r.reason}</div>
      <div class="cal-macros-grid">
        <div class="cal-macro">
          <div class="cal-macro-val" style="color:#E8732A">${r.calories}</div>
          <div class="cal-macro-label">kcal</div>
        </div>
        <div class="cal-macro">
          <div class="cal-macro-val" style="color:#36B37E">${r.protein}g</div>
          <div class="cal-macro-label">Protein</div>
        </div>
        <div class="cal-macro">
          <div class="cal-macro-val" style="color:#C9A227">${r.carbs}g</div>
          <div class="cal-macro-label">Carbs</div>
        </div>
        <div class="cal-macro">
          <div class="cal-macro-val" style="color:#E74C3C">${r.fat}g</div>
          <div class="cal-macro-label">Fett</div>
        </div>
      </div>
    </div>`;
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
  selectedExerciseTag = null;
  document.getElementById('ex-name').value  = '';
  document.getElementById('ex-abbr').value  = '';
  document.getElementById('ex-desc').value  = '';
  document.getElementById('edit-exercise-id').value = '';
  const t0 = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
    const tCam = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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

async function saveExercise() {
  hideAlert('modal-alert');
  const user = getSession(); if (!user) return;
  const name = document.getElementById('ex-name').value.trim();
  const abbr = document.getElementById('ex-abbr').value.trim();
  const desc = document.getElementById('ex-desc').value.trim();
  const t = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
    await loadExercisePage();
  } catch (e) { showAlert('modal-alert', `${t.err_connection} ${e.message}`); }
  finally { btn.disabled = false; btn.textContent = t.btn_save_exercise; }
}

async function deleteExercise(id) {
  const tDel = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
  if (!confirm(tDel.confirm_delete_exercise)) return;
  await db.from('exercises').delete().eq('id', id);
  await loadExercisePage();
}

async function loadExercisePage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  const { data: exercises } = await db.from('exercises').select('*').eq('username', user).order('created_at', { ascending: false });
  const grid = document.getElementById('exercise-grid');
  const tEx = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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

// ═══════════════════════════════════════════════════════════════
//  TRAINING
// ═══════════════════════════════════════════════════════════════

let currentTrainingExercises = []; // [{exercise_id, name, abbreviation, image_data, sets, reps}]
let allExercises = []; // global cache for drag-by-index
const INTENSITY_COLORS = ['','#36B37E','#7BC67E','#F4C430','#E67E22','#E74C3C'];

function getRepsOptions() {
  let html = '';
  for (let i = 1; i <= 25; i++) html += `<option value="${i}">${i}</option>`;
  html += '<option value="26">25+</option>';
  return html;
}

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
  const t = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  renderTrainingExGrid();
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
  const t = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  const tTr = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  const tDelTr = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  const tV = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  const tLT = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  await loadNavbarAvatar(user);
  const { data: exercises } = await db.from('exercises').select('*').eq('username', user).order('name');
  allExercises = exercises || [];
  await loadTrainings();
}

// ═══════════════════════════════════════════════════════════════
//  PLAN
// ═══════════════════════════════════════════════════════════════

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_NAMES_I18N = {
  de: { Mo:['Mo','Montag'], Di:['Di','Dienstag'], Mi:['Mi','Mittwoch'], Do:['Do','Donnerstag'], Fr:['Fr','Freitag'], Sa:['Sa','Samstag'], So:['So','Sonntag'] },
  en: { Mo:['Mo','Monday'], Di:['Tu','Tuesday'], Mi:['We','Wednesday'], Do:['Th','Thursday'], Fr:['Fr','Friday'], Sa:['Sa','Saturday'], So:['Su','Sunday'] },
  hu: { Mo:['H','Hétfő'], Di:['K','Kedd'], Mi:['Sze','Szerda'], Do:['Cs','Csütörtök'], Fr:['P','Péntek'], Sa:['Szo','Szombat'], So:['V','Vasárnap'] }
};

const EXERCISE_TAGS = [
  { id: 'schulter', color: '#5B8DEF', bg: '#eef3ff' },
  { id: 'ruecken',  color: '#36B37E', bg: '#e8f8f2' },
  { id: 'bizeps',   color: '#9B59B6', bg: '#f5eefa' },
  { id: 'trizeps',  color: '#E67E22', bg: '#fef3e8' },
  { id: 'unterarm', color: '#1ABC9C', bg: '#e6f9f6' },
  { id: 'beine',    color: '#E74C3C', bg: '#fdecea' },
  { id: 'brust',    color: '#E91E63', bg: '#fde8ef' },
  { id: 'bauch',    color: '#D4A017', bg: '#fdf7e3' },
  { id: 'sonstiges',color: '#8A8FA8', bg: '#f0f1f5' },
];

function getTagInfo(tagId) {
  return EXERCISE_TAGS.find(t => t.id === tagId) || null;
}

function renderTagSelector(selectedTag) {
  const t = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
  return EXERCISE_TAGS.map(tag => {
    const label = t['tag_' + tag.id] || tag.id;
    const sel = selectedTag === tag.id;
    return `<button type="button" class="tag-chip${sel ? ' selected' : ''}"
      style="background:${tag.bg};color:${tag.color};${sel ? `border-color:${tag.color};` : ''}"
      onclick="selectExerciseTag('${tag.id}')">${label}</button>`;
  }).join('');
}

let selectedExerciseTag = null;

function selectExerciseTag(id) {
  selectedExerciseTag = id;
  document.getElementById('ex-tag-selector').innerHTML = renderTagSelector(id);
}

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
      const tImp = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
      const tImpErr = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  const tChips = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  const tPlan = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  const tDelP = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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
  const tCopy = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
  document.getElementById('plan-name').value = plan.name + tCopy.copy_suffix;
  renderPlanGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadSavedPlans() {
  const user = getSession(); if (!user) return;
  const { data: plans } = await db.from('plans').select('*').eq('username', user).order('created_at', { ascending: false });
  const list = document.getElementById('saved-plans-list');
  const tSP = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
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

// ── Particle Background ───────────────────────────────────────
function initParticleBackground() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
  const COUNT = 60;
  const LINK_DIST = 120;
  const pts = Array.from({length: COUNT}, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4
  }));
  function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(26,111,255,0.5)';
      ctx.fill();
    });
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(26,111,255,${0.15 * (1 - d / LINK_DIST)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Training Logs (localStorage) ─────────────────────────────
function getTrainingLogs(username) {
  try { return JSON.parse(localStorage.getItem(`fitmol_logs_${username}`) || '[]'); }
  catch { return []; }
}
function saveTrainingLogs(username, logs) {
  localStorage.setItem(`fitmol_logs_${username}`, JSON.stringify(logs));
}
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function getLocalDateKey(isoString) {
  const d = new Date(isoString);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0,0,0,0);
  return monday;
}

// ── Train Modal ───────────────────────────────────────────────
function injectTrainModal() {
  if (document.getElementById('train-modal')) return;
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="modal-overlay" id="train-modal">
      <div class="modal-card" style="max-width:500px">
        <div class="modal-header">
          <div class="modal-title">⚡ Train</div>
          <button class="modal-close" onclick="closeTrainModal()">×</button>
        </div>
        <div id="train-modal-body"></div>
      </div>
    </div>`;
  document.body.appendChild(el.firstElementChild);
}

async function openTrainModal() {
  injectTrainModal();
  const user = getSession(); if (!user) { window.location.href = 'index.html'; return; }
  const today = getTodayKey();
  const now = new Date();
  const dateStr = now.toLocaleDateString(getLang() === 'de' ? 'de-DE' : getLang() === 'hu' ? 'hu-HU' : 'en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const logs = getTrainingLogs(user);
  const todayLog = logs.find(l => l.logged_at && getLocalDateKey(l.logged_at) === today);
  const body = document.getElementById('train-modal-body');
  if (todayLog) {
    const time = new Date(todayLog.logged_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    body.innerHTML = `
      <div class="train-modal-date">${dateStr}</div>
      <div class="train-today-banner">
        <div class="train-today-check">✅</div>
        <div class="train-today-title">${todayLog.title}</div>
        <div class="train-today-time">${time} Uhr</div>
      </div>
      <div style="margin-top:16px">
        <label style="font-size:13px;font-weight:600;color:var(--gray);display:block;margin-bottom:6px">Gewicht (kg)</label>
        <div style="display:flex;gap:8px">
          <input type="number" id="train-weight-input" placeholder="z.B. 75" step="0.1" min="0" value="${todayLog.weight || ''}"
            style="flex:1;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card-2);color:var(--black);font-size:15px;outline:none" />
          <button onclick="updateTodayWeight()" style="padding:10px 18px;border-radius:var(--radius-sm);border:none;background:var(--blue);color:#fff;font-weight:700;font-size:14px;cursor:pointer">Speichern</button>
        </div>
      </div>
    `;
  } else {
    const { data: trainings } = await db.from('trainings').select('id,title').eq('username', user).order('created_at', { ascending: false });
    const list = trainings || [];
    body.innerHTML = `
      <div class="train-modal-date">${dateStr}</div>
      <div class="train-not-today">Noch kein Training heute 💤</div>
      <div style="margin-bottom:12px">
        <label style="font-size:13px;font-weight:600;color:var(--gray);display:block;margin-bottom:6px">Gewicht (kg)</label>
        <input type="number" id="train-weight-input" placeholder="z.B. 75" step="0.1" min="0"
          style="width:100%;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card-2);color:var(--black);font-size:15px;outline:none" />
      </div>
      ${list.length > 0 ? `
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:var(--gray)">Training auswählen:</div>
        <div class="train-picker-list">
          ${list.map(tr => `
            <div class="train-pick-item" onclick="logTrainingToday('${tr.id}','${tr.title.replace(/'/g, "\\'")}')">
              <span style="font-weight:700">${tr.title}</span>
              <span>➕</span>
            </div>`).join('')}
        </div>
      ` : `<p style="text-align:center;color:var(--gray);font-size:14px">Noch keine Trainings. <a href="training.html" style="color:var(--blue)">Erstellen →</a></p>`}
    `;
  }
  document.getElementById('train-modal').classList.add('open');
}

function closeTrainModal() {
  const m = document.getElementById('train-modal');
  if (m) m.classList.remove('open');
}

function logTrainingToday(trainingId, title) {
  const user = getSession(); if (!user) return;
  const logs = getTrainingLogs(user);
  const today = getTodayKey();
  const weightInput = document.getElementById('train-weight-input');
  const weight = weightInput ? parseFloat(weightInput.value) || null : null;
  const filtered = logs.filter(l => !l.logged_at || getLocalDateKey(l.logged_at) !== today);
  filtered.push({ training_id: trainingId, title, logged_at: new Date().toISOString(), weight });
  saveTrainingLogs(user, filtered);
  openTrainModal();
}

function updateTodayWeight() {
  const user = getSession(); if (!user) return;
  const logs = getTrainingLogs(user);
  const today = getTodayKey();
  const weightInput = document.getElementById('train-weight-input');
  const weight = weightInput ? parseFloat(weightInput.value) || null : null;
  const log = logs.find(l => l.logged_at && getLocalDateKey(l.logged_at) === today);
  if (log) { log.weight = weight; saveTrainingLogs(user, logs); openTrainModal(); }
}

// ── Home Page ─────────────────────────────────────────────────
async function loadHomePage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  const logs = getTrainingLogs(user);
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
  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
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
  `;
}

// ── Analytics Page ────────────────────────────────────────────
function switchDiaryTab(tab) {
  document.querySelectorAll('.diary-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.diary-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`.diary-tab[onclick*="${tab}"]`).classList.add('active');
  document.getElementById(`diary-${tab}`).classList.add('active');
  if (tab === 'trainings') loadDiaryTrainings();
  if (tab === 'progress') renderProgressChart();
}

function loadDiaryTrainings() {
  const user = getSession(); if (!user) return;
  const logs = getTrainingLogs(user);
  const container = document.getElementById('diary-trainings-list');
  if (!container) return;
  if (logs.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray);font-size:14px;padding:20px 0">Noch keine Trainings geloggt.</p>';
    return;
  }
  const sorted = [...logs].sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  container.innerHTML = sorted.map(l => {
    const d = new Date(l.logged_at);
    const dateStr = d.toLocaleDateString('de-DE', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
    const timeStr = d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    const weightStr = l.weight ? `<div class="diary-log-weight">⚖️ ${l.weight} kg</div>` : '';
    return `<div class="diary-log-item">
      <div>
        <div class="diary-log-title">${l.title}</div>
        ${weightStr}
      </div>
      <div style="text-align:right">
        <div class="diary-log-date">${dateStr}</div>
        <div class="diary-log-date">${timeStr} Uhr</div>
      </div>
    </div>`;
  }).join('');
}

function renderProgressChart() {
  const svg = document.getElementById('progress-weight-svg');
  if (!svg) return;
  const user = getSession(); if (!user) return;
  const logs = getTrainingLogs(user).filter(l => l.weight);
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

async function loadAnalyticsPage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  const logs = getTrainingLogs(user);
  renderAnalyticsCalendar(user, logs);
  renderWeeklyChart(user, logs);
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
  const user = getSession(); if (!user) return;
  const logs = getTrainingLogs(user);
  renderAnalyticsCalendar(user, logs);
  renderWeeklyChart(user, logs);
}

function renderWeeklyChart(user, logs) {
  const svg = document.getElementById('analytics-chart-svg');
  if (!svg) return;
  const year = analyticsYear, month = analyticsMonth;
  const weeks = [];
  [0,1,2,3].forEach(w => {
    const start = w * 7 + 1;
    const end = Math.min(start + 6, new Date(year, month + 1, 0).getDate());
    const count = logs.filter(l => {
      const d = new Date(l.logged_at);
      return d.getMonth() === month && d.getFullYear() === year && d.getDate() >= start && d.getDate() <= end;
    }).length;
    weeks.push({ label: `Woche ${w+1}`, count });
  });
  const maxCount = Math.max(...weeks.map(w => w.count), 1);
  const W = 300, H = 150, PAD = 40;
  const xStep = (W - PAD * 2) / 3;
  const points = weeks.map((w, i) => ({
    x: PAD + i * xStep,
    y: H - PAD - (w.count / maxCount) * (H - PAD * 2),
    count: w.count,
    label: w.label
  }));
  let paths = '';
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i], p2 = points[i+1];
    const color = p2.count > p1.count ? '#36B37E' : p2.count < p1.count ? '#E74C3C' : '#1a6fff';
    paths += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  }
  const dots = points.map(p => `
    <circle cx="${p.x}" cy="${p.y}" r="6" fill="#050d1f" stroke="#1a6fff" stroke-width="2"/>
    <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" fill="#e8edf5" font-size="11" font-weight="bold">${p.count}</text>
    <text x="${p.x}" y="${H - 8}" text-anchor="middle" fill="#7a84a0" font-size="9">${p.label}</text>
  `).join('');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = paths + dots;
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

  if (document.getElementById('home-week-section')) {
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
  }
})();
