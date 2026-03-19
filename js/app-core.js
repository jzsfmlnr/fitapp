/* ============================================================
   FitTrack – Core JS (shared across ALL pages)
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
    cal_mon:'Mo', cal_tue:'Di', cal_wed:'Mi', cal_thu:'Do', cal_fri:'Fr', cal_sat:'Sa', cal_sun:'So',
    bn_routine:'Routine', bn_train:'Train', bn_diary:'Tagebuch',
    label_name:'Name',
    tab_analytics:'Analyse', tab_trainings:'Trainings', tab_progress:'Fortschritt',
    weekly_trainings_title:'Wöchentliche Trainings', training_log_title:'Trainingsprotokoll',
    weight_progress_title:'Gewichtsverlauf', loading_text:'Laden...',
    routine_ex_desc:'Übung erstellen', routine_tr_desc:'Trainingseinheit erstellen',
    routine_plan_title:'Trainingsplan', routine_plan_desc:'Plane deine Woche',
    empty_workouts:'Noch keine Workouts gespeichert.',
    btn_weighin:'⚖️ Abwiegen', btn_workout_done:'🏋️ Workout erledigt?',
    bn_social:'Social',
    social_friends_tab:'Freunde', social_requests_tab:'Anfragen', social_find_tab:'Suchen',
    social_add_ph:'Username eingeben…', social_send_request:'Anfrage senden',
    social_accept:'Annehmen', social_decline:'Ablehnen',
    social_no_friends:'Noch keine Freunde. Füge jemanden hinzu!',
    social_no_requests:'Keine Anfragen.', social_no_messages:'Noch keine Nachrichten.',
    social_message_ph:'Nachricht…', social_send:'Senden',
    social_online:'Online', social_last_active:'Zuletzt aktiv vor',
    social_user_not_found:'User nicht gefunden.',
    social_request_sent:'Anfrage gesendet! ✓', social_already_friends:'Ihr seid bereits Freunde.',
    social_request_exists:'Anfrage wurde bereits gesendet.', social_cant_add_self:'Du kannst dich nicht selbst adden.',
    // Train page
    train_choose_workout:'Wähle dein Workout:', train_no_training_today:'Noch kein Training heute 💤',
    train_weight_kg:'Gewicht (kg)', train_weight_ph:'z.B. 75', train_save_btn:'Speichern',
    train_time_suffix:'Uhr', train_select_training:'Training auswählen:',
    train_no_trainings_yet:'Noch keine Trainings.', train_create_link_label:'Erstellen →',
    train_today_exercises:'Heutige Übungen:', train_set_label:'Satz', train_sets_label:'Sätze',
    train_reps_label:'Wiederholungen', train_custom_ph:'individuell',
    train_add_set:'+ Satz hinzufügen', train_finished_btn:'Fertig ✓',
    train_err_weight:'Bitte für alle Sätze ein Gewicht wählen.',
    train_err_no_exercise:'Bitte mindestens eine Übung vor dem Beenden hinzufügen.',
    train_confirm_finish:'Workout beenden und speichern?',
    train_err_save:'Fehler beim Speichern. Bitte erneut versuchen.',
    train_complete_title:'Workout abgeschlossen!', train_complete_sub:'Gut gemacht! Dein Workout wurde gespeichert.',
    train_new_workout:'Neues Workout starten', train_back_home:'← Zurück zur Startseite',
    train_spectate_no_exercises:'Keine Übungen aufgezeichnet.',
    train_workout_finished_btn:'Workout beendet ✓', train_add_exercise:'Übung hinzufügen',
    train_create_new:'+ Neu erstellen', train_last_training:'Letztes Training',
    train_view_btn:'Ansehen →', train_no_match:'Keine passenden Übungen gefunden.',
    train_no_match_hint:'Erstelle Übungen mit den richtigen Muskelgruppen.',
    train_exercise_singular:'Übung', train_exercise_plural:'Übungen',
    carousel_pull_sub:'Rücken · Bizeps', carousel_push_sub:'Brust · Trizeps',
    carousel_arms_sub:'Bizeps · Trizeps', carousel_upper_sub:'Ganzer Oberkörper',
    carousel_lower_sub:'Beine · Bauch', carousel_legs_sub:'Oberschenkel · Hamstrings',
    pr_title:'Neuer Rekord!', pr_msg:'Neue Bestleistung bei {ex}: {kg} kg.',
    pw_change_btn:'Passwort ändern', pw_old:'Altes Passwort', pw_new:'Neues Passwort', pw_confirm:'Passwort bestätigen', pw_mismatch:'Passwörter stimmen nicht überein.', pw_wrong:'Altes Passwort ist falsch.', pw_success:'Passwort erfolgreich geändert.', pw_short:'Mindestens 4 Zeichen.',
    imprint_btn:'Impressum', privacy_btn:'Datenschutz',
    imprint_title:'Impressum', privacy_title:'Datenschutzerklärung',
    imprint_note:'Diese App ist ein privates, nicht-kommerzielles Projekt.',
    privacy_data_title:'Datenspeicherung', privacy_data_body:'Wir speichern ausschließlich die Daten, die du aktiv eingibst (Benutzername, Trainings, Gewicht). Keine Weitergabe an Dritte.',
    privacy_host_body:'Die Daten werden über Supabase (EU-Server) gespeichert. Details: supabase.com/privacy',
    privacy_contact:'Kontakt',
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
    cal_mon:'Mo', cal_tue:'Tu', cal_wed:'We', cal_thu:'Th', cal_fri:'Fr', cal_sat:'Sa', cal_sun:'Su',
    bn_routine:'Routine', bn_train:'Train', bn_diary:'Diary',
    label_name:'Name',
    tab_analytics:'Analytics', tab_trainings:'Trainings', tab_progress:'Progress',
    weekly_trainings_title:'Weekly Trainings', training_log_title:'Training Log',
    weight_progress_title:'Weight Progress', loading_text:'Loading...',
    routine_ex_desc:'Create an exercise', routine_tr_desc:'Build a personalized training session',
    routine_plan_title:'Workout Plan', routine_plan_desc:'Plan your week',
    empty_workouts:'No workouts saved yet.',
    btn_weighin:'⚖️ Weigh-in', btn_workout_done:'🏋️ Workout done?',
    bn_social:'Social',
    social_friends_tab:'Friends', social_requests_tab:'Requests', social_find_tab:'Find',
    social_add_ph:'Enter username…', social_send_request:'Send Request',
    social_accept:'Accept', social_decline:'Decline',
    social_no_friends:'No friends yet. Add someone!',
    social_no_requests:'No requests.', social_no_messages:'No messages yet.',
    social_message_ph:'Message…', social_send:'Send',
    social_online:'Online', social_last_active:'Last active',
    social_user_not_found:'User not found.',
    social_request_sent:'Request sent! ✓', social_already_friends:'Already friends.',
    social_request_exists:'Request already sent.', social_cant_add_self:"You can't add yourself.",
    // Train page
    train_choose_workout:'Choose your Workout:', train_no_training_today:'No training today yet 💤',
    train_weight_kg:'Weight (kg)', train_weight_ph:'e.g. 75', train_save_btn:'Save',
    train_time_suffix:'', train_select_training:'Select Training:',
    train_no_trainings_yet:'No trainings yet.', train_create_link_label:'Create →',
    train_today_exercises:"Today's Exercises:", train_set_label:'set', train_sets_label:'sets',
    train_reps_label:'Reps', train_custom_ph:'custom',
    train_add_set:'+ Add Set', train_finished_btn:'Finished ✓',
    train_err_weight:'Please select a weight for all sets.',
    train_err_no_exercise:'Please add at least one exercise before finishing the workout.',
    train_confirm_finish:'Finish this workout and save it?',
    train_err_save:'Error saving workout. Please try again.',
    train_complete_title:'Workout Complete!', train_complete_sub:'Great job! Your workout has been saved.',
    train_new_workout:'Start New Workout', train_back_home:'← Back to Home',
    train_spectate_no_exercises:'No exercises recorded.',
    train_workout_finished_btn:'Workout Finished ✓', train_add_exercise:'Add Exercise',
    train_create_new:'+ Create New', train_last_training:'Last Training',
    train_view_btn:'View →', train_no_match:'No matching exercises found.',
    train_no_match_hint:'Create exercises with the correct muscle groups first.',
    train_exercise_singular:'exercise', train_exercise_plural:'exercises',
    carousel_pull_sub:'Back · Biceps', carousel_push_sub:'Chest · Triceps',
    carousel_arms_sub:'Biceps · Triceps', carousel_upper_sub:'Full Upper Body',
    carousel_lower_sub:'Legs · Abs', carousel_legs_sub:'Quads · Hamstrings',
    pr_title:'New Record!', pr_msg:'New personal best on {ex}: {kg} kg.',
    pw_change_btn:'Change Password', pw_old:'Current Password', pw_new:'New Password', pw_confirm:'Confirm Password', pw_mismatch:'Passwords do not match.', pw_wrong:'Current password is incorrect.', pw_success:'Password changed successfully.', pw_short:'At least 4 characters.',
    imprint_btn:'Imprint', privacy_btn:'Privacy Policy',
    imprint_title:'Imprint', privacy_title:'Privacy Policy',
    imprint_note:'This app is a private, non-commercial project.',
    privacy_data_title:'Data Storage', privacy_data_body:'We only store data you actively enter (username, trainings, weight). No sharing with third parties.',
    privacy_host_body:'Data is stored via Supabase (EU servers). Details: supabase.com/privacy',
    privacy_contact:'Contact',
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
    // Train page
    train_choose_workout:'Válaszd ki az edzést:', train_no_training_today:'Ma még nincs edzés 💤',
    train_weight_kg:'Súly (kg)', train_weight_ph:'pl. 75', train_save_btn:'Mentés',
    train_time_suffix:'', train_select_training:'Edzés kiválasztása:',
    train_no_trainings_yet:'Még nincsenek edzések.', train_create_link_label:'Létrehozás →',
    train_today_exercises:'Mai gyakorlatok:', train_set_label:'szet', train_sets_label:'szetek',
    train_reps_label:'Ismétlések', train_custom_ph:'egyéni',
    train_add_set:'+ Szet hozzáadása', train_finished_btn:'Kész ✓',
    train_err_weight:'Kérjük minden szetnél adjon meg súlyt.',
    train_err_no_exercise:'Kérjük adjon hozzá legalább egy gyakorlatot a befejezés előtt.',
    train_confirm_finish:'Befejezi és menti az edzést?',
    train_err_save:'Hiba a mentés közben. Kérjük próbálja újra.',
    train_complete_title:'Edzés befejezve!', train_complete_sub:'Remek munka! Az edzésed el lett mentve.',
    train_new_workout:'Új edzés indítása', train_back_home:'← Vissza a főoldalra',
    train_spectate_no_exercises:'Nincsenek rögzített gyakorlatok.',
    train_workout_finished_btn:'Edzés kész ✓', train_add_exercise:'Gyakorlat hozzáadása',
    train_create_new:'+ Új létrehozása', train_last_training:'Utolsó edzés',
    train_view_btn:'Megtekintés →', train_no_match:'Nem találhatók megfelelő gyakorlatok.',
    train_no_match_hint:'Először hozz létre gyakorlatokat a megfelelő izomcsoportokkal.',
    btn_weighin:'⚖️ Mérleg', btn_workout_done:'🏋️ Edzettél már?',
    bn_social:'Social',
    social_friends_tab:'Barátok', social_requests_tab:'Kérések', social_find_tab:'Keresés',
    social_add_ph:'Felhasználónév…', social_send_request:'Kérés küldése',
    social_accept:'Elfogad', social_decline:'Elutasít',
    social_no_friends:'Még nincsenek barátok.',
    social_no_requests:'Nincsenek kérések.', social_no_messages:'Még nincsenek üzenetek.',
    social_message_ph:'Üzenet…', social_send:'Küldés',
    social_online:'Online', social_last_active:'Utoljára aktív',
    social_user_not_found:'Felhasználó nem található.',
    social_request_sent:'Kérés elküldve! ✓', social_already_friends:'Már barátok vagytok.',
    social_request_exists:'Kérés már elküldve.', social_cant_add_self:'Nem adhatod hozzá saját magad.',
    train_exercise_singular:'gyakorlat', train_exercise_plural:'gyakorlat',
    carousel_pull_sub:'Hát · Bicepsz', carousel_push_sub:'Mell · Tricepsz',
    carousel_arms_sub:'Bicepsz · Tricepsz', carousel_upper_sub:'Teljes felsőtest',
    carousel_lower_sub:'Lábak · Has', carousel_legs_sub:'Quadriceps · Hamstrings',
    bn_routine:'Rutin', bn_train:'Edzés', bn_diary:'Napló',
    tab_analytics:'Elemzés', tab_trainings:'Edzések', tab_progress:'Fejlődés',
    weekly_trainings_title:'Heti edzések', training_log_title:'Edzésnapló',
    weight_progress_title:'Súlyfejlődés', loading_text:'Betöltés...',
    routine_ex_desc:'Gyakorlat létrehozása', routine_tr_desc:'Személyes edzés összeállítása',
    routine_plan_title:'Edzésterv', routine_plan_desc:'Tervezd meg a heted',
    empty_workouts:'Még nincsenek mentett edzések.',
    label_name:'Név',
    pr_title:'Új rekord!', pr_msg:'{ex}: új személyes rekord – {kg} kg.',
    pw_change_btn:'Jelszó módosítása', pw_old:'Jelenlegi jelszó', pw_new:'Új jelszó', pw_confirm:'Jelszó megerősítése', pw_mismatch:'A jelszavak nem egyeznek.', pw_wrong:'A jelenlegi jelszó helytelen.', pw_success:'Jelszó sikeresen megváltoztatva.', pw_short:'Legalább 4 karakter.',
    imprint_btn:'Impresszum', privacy_btn:'Adatvédelem',
    imprint_title:'Impresszum', privacy_title:'Adatvédelmi tájékoztató',
    imprint_note:'Ez az alkalmazás egy magán, nem kereskedelmi projekt.',
    privacy_data_title:'Adattárolás', privacy_data_body:'Csak az általad aktívan megadott adatokat tároljuk (felhasználónév, edzések, testsúly). Harmadik félnek nem adjuk tovább.',
    privacy_host_body:'Az adatok tárolása Supabase-en (EU-szerver) történik. Részletek: supabase.com/privacy',
    privacy_contact:'Kapcsolat',
  }
};

// One-time migration: reset language to 'en' for all existing users
if (!localStorage.getItem('fitmol_lang_default_en')) {
  localStorage.setItem('fitmol_lang', 'en');
  localStorage.setItem('fitmol_lang_default_en', '1');
}
function getLang()    { return localStorage.getItem('fitmol_lang') || 'en'; }
function setLang(l)   { localStorage.setItem('fitmol_lang', l); }

// Global translation cache — updated on language switch, avoids repeated lookup
let T = TRANSLATIONS[getLang()] || TRANSLATIONS.en;

function applyLanguage(lang) {
  T = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const t = T;
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
  // Language names are universal; just sync the select value to current lang
  const lSel = document.getElementById('prof-language');
  if (lSel && lSel.value !== lang) lSel.value = lang;
  document.documentElement.lang = lang;
}

// ── Helpers ───────────────────────────────────────────────────
async function hashPassword(pw) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function getSession() {
  const u = localStorage.getItem('hc_session');
  const t = localStorage.getItem('hc_session_time');
  if (!u || !t) return null;
  if (Date.now() - Number(t) > 7 * 24 * 60 * 60 * 1000) {
    clearSession();
    return null;
  }
  localStorage.setItem('hc_session_time', Date.now());
  return u;
}
function setSession(u) {
  localStorage.setItem('hc_session', u);
  localStorage.setItem('hc_session_time', Date.now());
}
function clearSession() {
  localStorage.removeItem('hc_session');
  localStorage.removeItem('hc_session_time');
}

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
  if (!u) { window.location.href = '../index.html'; return null; }
  return u;
}
function guardAuth() {
  if (getSession()) window.location.href = 'pages/home.html';
}
function logout() { clearSession(); window.location.href = '../index.html'; }

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
    window.location.href = 'pages/home.html';
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
    const { error } = await db.from('users').insert({ username, password_hash: hash, language: 'en' });
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
let _avatarMenuEl = null;
let _toolMenuEl   = null;

function toggleAvatarMenu(event) {
  event.stopPropagation();
  if (!_avatarMenuEl) _avatarMenuEl = document.getElementById('avatar-menu');
  if (!_toolMenuEl)   _toolMenuEl   = document.getElementById('tool-menu');
  if (_toolMenuEl)  _toolMenuEl.classList.remove('open');
  if (_avatarMenuEl) _avatarMenuEl.classList.toggle('open');
}

function toggleToolMenu(event) {
  event.stopPropagation();
  if (!_avatarMenuEl) _avatarMenuEl = document.getElementById('avatar-menu');
  if (!_toolMenuEl)   _toolMenuEl   = document.getElementById('tool-menu');
  if (_avatarMenuEl) _avatarMenuEl.classList.remove('open');
  if (_toolMenuEl)   _toolMenuEl.classList.toggle('open');
}

document.addEventListener('click', () => {
  if (!_avatarMenuEl) _avatarMenuEl = document.getElementById('avatar-menu');
  if (!_toolMenuEl)   _toolMenuEl   = document.getElementById('tool-menu');
  if (_avatarMenuEl) _avatarMenuEl.classList.remove('open');
  if (_toolMenuEl)   _toolMenuEl.classList.remove('open');
});

// ── Navbar Avatar ─────────────────────────────────────────────
async function loadNavbarAvatar(username) {
  const avatar  = document.getElementById('nav-avatar');
  const menuUser = document.getElementById('nav-username');
  if (menuUser) menuUser.textContent = username;
  if (!avatar) return;
  const cacheKey = 'fitmol_avatar_' + username;
  let avatarData = sessionStorage.getItem(cacheKey);
  if (avatarData === null) {
    const { data } = await db.from('users').select('avatar_data').eq('username', username).maybeSingle();
    avatarData = (data && data.avatar_data) ? data.avatar_data : '';
    sessionStorage.setItem(cacheKey, avatarData);
  }
  if (avatarData) avatar.innerHTML = `<img src="${avatarData}" alt="Avatar" loading="lazy" style="width:100%;height:100%;border-radius:50%;object-fit:cover" />`;
  else avatar.textContent = username.charAt(0).toUpperCase();
  applyLanguage(getLang());
}

// ── Exercise Tags ─────────────────────────────────────────────
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
  const t = T;
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

// ── Days (Plan) ───────────────────────────────────────────────
const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const DAY_NAMES_I18N = {
  de: { Mo:['Mo','Montag'], Di:['Di','Dienstag'], Mi:['Mi','Mittwoch'], Do:['Do','Donnerstag'], Fr:['Fr','Freitag'], Sa:['Sa','Samstag'], So:['So','Sonntag'] },
  en: { Mo:['Mo','Monday'], Di:['Tu','Tuesday'], Mi:['We','Wednesday'], Do:['Th','Thursday'], Fr:['Fr','Friday'], Sa:['Sa','Saturday'], So:['Su','Sunday'] },
  hu: { Mo:['H','Hétfő'], Di:['K','Kedd'], Mi:['Sze','Szerda'], Do:['Cs','Csütörtök'], Fr:['P','Péntek'], Sa:['Szo','Szombat'], So:['V','Vasárnap'] }
};

// ── Global State Variables ────────────────────────────────────
let currentTrainingExercises = []; // [{exercise_id, name, abbreviation, image_data, sets, reps}]
let allExercises = []; // global cache for drag-by-index
let allTrainings = []; // for plan page
let currentPlan = {};  // { Mo: [null, null], Di: [...], … }
let selectedChipId = null; // for tap-to-add on mobile
let pendingAvatarData = null;

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

// ── getRepsOptions ────────────────────────────────────────────
function getRepsOptions() {
  let html = '';
  for (let i = 1; i <= 25; i++) html += `<option value="${i}">${i}</option>`;
  html += '<option value="26">25+</option>';
  return html;
}

// ── Combined logs helper ───────────────────────────────────────
async function getCombinedLogs(username) {
  const local = getTrainingLogs(username);
  let sessions = [];
  try {
    const { data } = await db.from('workout_sessions').select('title,created_at,exercises,type').eq('username', username);
    if (data) sessions = data.map(s => ({ title: s.title, logged_at: s.created_at, exercises: s.exercises || [], type: s.type, _isSession: true }));
  } catch(e) {}
  return [...local, ...sessions];
}

// ── Weigh-in Storage ──────────────────────────────────────────
function getWeighIns(username) {
  try { return JSON.parse(localStorage.getItem(`fitmol_weighins_${username}`) || '[]'); }
  catch { return []; }
}
function saveWeighIns(username, data) {
  localStorage.setItem(`fitmol_weighins_${username}`, JSON.stringify(data));
}

// ── Social: updateLastActive & checkInactivityAndNotify ───────
async function updateLastActive(username) {
  try { await db.from('users').update({ last_active: new Date().toISOString() }).eq('username', username); } catch(e) {}
}

async function checkInactivityAndNotify(username) {
  try {
    const { data: u } = await db.from('users').select('last_active').eq('username', username).maybeSingle();
    if (!u || !u.last_active) return;
    const daysSince = (Date.now() - new Date(u.last_active).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 3) return;
    // Check if a FitMol AI message was already sent after last_active (= already notified this cycle)
    const { data: existing } = await db.from('messages')
      .select('id').eq('sender', 'FitMol AI').eq('receiver', username)
      .gte('created_at', u.last_active).limit(1).maybeSingle();
    if (existing) return;
    const msgs = [
      "Hey! We haven't seen you in a while 👀 Your training plan is still waiting for you. Come back and crush it! 💪",
      "Missing you at the gym! It's been a few days — time to get back on track. You've got this! ⚡",
      "Hey, long time no see! 🏋️ Don't let your progress slip. Jump back in whenever you're ready!"
    ];
    const text = msgs[Math.floor(Math.random() * msgs.length)];
    await db.from('messages').insert({ sender: 'FitMol AI', receiver: username, text, read: false });
  } catch(e) {}
}

// ── Social unread dot on footer ────────────────────────────────
async function checkSocialUnreadDot() {
  if (document.getElementById('social-main')) return; // already on social page, shown inline
  const user = getSession(); if (!user) return;
  const { count } = await db.from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('receiver', user).eq('read', false);
  const link = document.querySelector('a[href="social.html"].bottom-nav-item');
  if (!link) return;
  link.style.position = 'relative';
  let dot = link.querySelector('.bn-social-unread-dot');
  if (count > 0) {
    if (!dot) {
      dot = document.createElement('span');
      dot.className = 'bn-social-unread-dot';
      link.appendChild(dot);
    }
    dot.style.display = 'block';
  } else if (dot) {
    dot.style.display = 'none';
  }
}

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

// ── Contact Modal ─────────────────────────────────────────────
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
  const t    = T;
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
  const t = T;
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

// ── Train Modal (Home quick-access) ───────────────────────────
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
  const user = getSession(); if (!user) { window.location.href = '../index.html'; return; }
  const t = T;
  const today = getTodayKey();
  const now = new Date();
  const dateStr = now.toLocaleDateString(getLang() === 'de' ? 'de-DE' : getLang() === 'hu' ? 'hu-HU' : 'en-GB', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const logs = getTrainingLogs(user);
  const todayLog = logs.find(l => l.logged_at && getLocalDateKey(l.logged_at) === today);
  const body = document.getElementById('train-modal-body');
  if (todayLog) {
    const time = new Date(todayLog.logged_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const timeSuffix = t.train_time_suffix ? ' ' + t.train_time_suffix : '';
    body.innerHTML = `
      <div class="train-modal-date">${dateStr}</div>
      <div class="train-today-banner">
        <div class="train-today-check">✅</div>
        <div class="train-today-title">${todayLog.title}</div>
        <div class="train-today-time">${time}${timeSuffix}</div>
      </div>
      <div style="margin-top:16px">
        <label style="font-size:13px;font-weight:600;color:var(--gray);display:block;margin-bottom:6px">${t.train_weight_kg}</label>
        <div style="display:flex;gap:8px">
          <input type="number" id="train-weight-input" placeholder="${t.train_weight_ph}" step="0.1" min="0" value="${todayLog.weight || ''}"
            style="flex:1;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card-2);color:var(--black);font-size:15px;outline:none" />
          <button onclick="updateTodayWeight()" style="padding:10px 18px;border-radius:var(--radius-sm);border:none;background:var(--blue);color:#fff;font-weight:700;font-size:14px;cursor:pointer">${t.train_save_btn}</button>
        </div>
      </div>
    `;
  } else {
    const { data: trainings } = await db.from('trainings').select('id,title').eq('username', user).order('created_at', { ascending: false });
    const list = trainings || [];
    body.innerHTML = `
      <div class="train-modal-date">${dateStr}</div>
      <div class="train-not-today">${t.train_no_training_today}</div>
      <div style="margin-bottom:12px">
        <label style="font-size:13px;font-weight:600;color:var(--gray);display:block;margin-bottom:6px">${t.train_weight_kg}</label>
        <input type="number" id="train-weight-input" placeholder="${t.train_weight_ph}" step="0.1" min="0"
          style="width:100%;padding:10px 14px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--card-2);color:var(--black);font-size:15px;outline:none" />
      </div>
      ${list.length > 0 ? `
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:var(--gray)">${t.train_select_training}</div>
        <div class="train-picker-list">
          ${list.map(tr => `
            <div class="train-pick-item" onclick="logTrainingToday('${tr.id}','${tr.title.replace(/'/g, "\\'")}')">
              <span style="font-weight:700">${tr.title}</span>
              <span>➕</span>
            </div>`).join('')}
        </div>
      ` : `<p style="text-align:center;color:var(--gray);font-size:14px">${t.train_no_trainings_yet} <a href="training.html" style="color:var(--blue)">${t.train_create_link_label}</a></p>`}
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

// ── PR Popup ──────────────────────────────────────────────────
function showPRPopup(exerciseName, weight) {
  const t = T;
  const existing = document.getElementById('pr-popup');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'pr-popup';
  el.className = 'pr-popup';
  el.innerHTML = `
    <div class="pr-popup-title">${t.pr_title}</div>
    <div class="pr-popup-msg">${t.pr_msg.replace('{ex}', exerciseName).replace('{kg}', weight)}</div>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('pr-popup-show'));
  setTimeout(() => { el.classList.remove('pr-popup-show'); setTimeout(() => el.remove(), 350); }, 3500);
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

// ── Cleanup on page navigation ────────────────────────────────
window.addEventListener('pagehide', () => {
  if (typeof _chatChannel !== 'undefined' && _chatChannel) {
    db.removeChannel(_chatChannel);
    _chatChannel = null;
  }
});
