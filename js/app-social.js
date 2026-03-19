/* ============================================================
   FitTrack – Social Page JS
   ============================================================ */

let _socialTab = 'friends';
let _chatPartner = null;
let _chatChannel = null;

const AI_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><defs><radialGradient id='g' cx='40%25' cy='35%25' r='65%25'><stop offset='0%25' stop-color='%234d9fff'/><stop offset='100%25' stop-color='%231a6fff'/></radialGradient></defs><circle cx='24' cy='24' r='24' fill='url(%23g)'/><text x='24' y='31' text-anchor='middle' font-size='22' font-family='Arial' fill='white'>&#9889;</text></svg>`;

async function loadSocialPage() {
  const user = guardHome(); if (!user) return;
  await loadNavbarAvatar(user);
  injectBmiModal();
  injectCalorieModal();
  renderSocialTabs();
}

function getLastActiveText(ts) {
  if (!ts) return '';
  const t = T;
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 120) return t.social_online;
  if (diff < 3600) return `${t.social_last_active} ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `${t.social_last_active} ${Math.floor(diff/3600)}h`;
  return `${t.social_last_active} ${Math.floor(diff/86400)}d`;
}

async function renderSocialTabs() {
  const user = getSession(); if (!user) return;
  const t = T;
  const main = document.getElementById('social-main');
  if (!main) return;
  main.classList.remove('chat-active');
  if (user === 'FitMol AI') {
    _socialTab = 'admin';
    main.innerHTML = `
      <div class="social-tabs">
        <button class="social-tab-btn active">All Users</button>
      </div>
      <div id="social-tab-content"></div>
    `;
    loadAdminUserList();
    return;
  }
  const { data: pending } = await db.from('friendships').select('id').eq('user_b', user).eq('status', 'pending');
  const pendingCount = (pending || []).length;
  main.innerHTML = `
    <div class="social-tabs">
      <button class="social-tab-btn${_socialTab==='friends'?' active':''}" onclick="switchSocialTab('friends')">${t.social_friends_tab}</button>
      <button class="social-tab-btn${_socialTab==='requests'?' active':''}" onclick="switchSocialTab('requests')">
        ${t.social_requests_tab}${pendingCount>0?`<span class="social-badge">${pendingCount}</span>`:''}
      </button>
      <button class="social-tab-btn${_socialTab==='find'?' active':''}" onclick="switchSocialTab('find')">${t.social_find_tab}</button>
    </div>
    <div id="social-tab-content"></div>
  `;
  loadSocialTabContent();
}

function switchSocialTab(tab) {
  _socialTab = tab;
  document.querySelectorAll('.social-tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', ['friends','requests','find'][i] === tab);
  });
  loadSocialTabContent();
}

async function loadSocialTabContent() {
  const user = getSession(); if (!user) return;
  const t = T;
  const content = document.getElementById('social-tab-content');
  if (!content) return;

  if (_socialTab === 'friends') {
    content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gray)">${t.loading_text}</div>`;
    const [{ data: friends }, { data: aiMsgs }, { data: unreadMsgs }] = await Promise.all([
      db.from('friendships').select('*').or(`user_a.eq.${user},user_b.eq.${user}`).eq('status','accepted'),
      db.from('messages').select('read').eq('sender', 'FitMol AI').eq('receiver', user).order('created_at', { ascending: false }).limit(1),
      db.from('messages').select('sender').eq('receiver', user).eq('read', false)
    ]);
    const hasAiMsg = aiMsgs && aiMsgs.length > 0;
    const aiUnread = hasAiMsg && aiMsgs[0].read === false;
    const unreadSet = new Set((unreadMsgs || []).map(m => m.sender));
    if (!hasAiMsg && (!friends || friends.length === 0)) {
      content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">${t.social_no_friends}</div></div>`;
      return;
    }
    const names = (friends || []).map(f => f.user_a === user ? f.user_b : f.user_a);
    let usersData = [];
    if (names.length > 0) {
      const { data: ud } = await db.from('users').select('username,avatar_data,last_active').in('username', names);
      usersData = ud || [];
    }

    const aiEntry = hasAiMsg ? `
      <div class="social-friend-item" onclick="openChat('FitMol AI')">
        <div class="social-friend-avatar" style="position:relative;padding:0;overflow:hidden">
          <img src="${AI_AVATAR_SVG}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" />
          ${aiUnread?'<span class="social-unread-dot"></span>':''}
        </div>
        <div class="social-friend-info">
          <div class="social-friend-name">FitMol AI</div>
          <div class="social-friend-status" style="color:var(--blue)">Assistant</div>
        </div>
        <div class="social-friend-actions">

        </div>
      </div>` : '';
    content.innerHTML = `<div class="social-friends-list">
      ${aiEntry}
      ${usersData.map(u => `
        <div class="social-friend-item" onclick="openChat('${u.username}')">
          <div class="social-friend-avatar" style="position:relative">
            ${u.avatar_data?`<img src="${u.avatar_data}" />`:u.username.charAt(0).toUpperCase()}
            ${unreadSet.has(u.username)?'<span class="social-unread-dot"></span>':''}
          </div>
          <div class="social-friend-info">
            <div class="social-friend-name">${u.username}</div>
            <div class="social-friend-status">${getLastActiveText(u.last_active)}</div>
          </div>
          <div class="social-friend-actions">
            <button class="social-profile-btn" onclick="event.stopPropagation();openFriendProfile('${u.username}')">👤</button>
          </div>
        </div>`).join('')}
    </div>`;

  } else if (_socialTab === 'requests') {
    content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gray)">${t.loading_text}</div>`;
    const { data: reqs } = await db.from('friendships').select('*').eq('user_b', user).eq('status','pending');
    if (!reqs || reqs.length === 0) {
      content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔔</div><div class="empty-state-text">${t.social_no_requests}</div></div>`;
      return;
    }
    content.innerHTML = `<div class="social-requests-list">
      ${reqs.map(r => `
        <div class="social-request-item">
          <div class="social-friend-avatar">${r.user_a.charAt(0).toUpperCase()}</div>
          <div class="social-friend-info"><div class="social-friend-name">${r.user_a}</div></div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" style="width:auto;padding:8px 14px;font-size:13px" onclick="acceptFriendRequest('${r.id}')">${t.social_accept}</button>
            <button class="btn btn-outline" style="width:auto;padding:8px 14px;font-size:13px;color:var(--red);border-color:var(--red)" onclick="declineFriendRequest('${r.id}')">${t.social_decline}</button>
          </div>
        </div>`).join('')}
    </div>`;

  } else if (_socialTab === 'find') {
    content.innerHTML = `
      <div style="padding:16px 0">
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <input class="form-input" type="text" id="social-search-input" placeholder="${t.social_add_ph}" style="flex:1" onkeydown="if(event.key==='Enter')searchAndAddUser()" />
          <button class="btn btn-primary" style="width:auto;padding:12px 18px" onclick="searchAndAddUser()">${t.social_send_request}</button>
        </div>
        <div id="social-search-result"></div>
      </div>`;
  }
}

async function searchAndAddUser() {
  const user = getSession(); if (!user) return;
  const t = T;
  const input = document.getElementById('social-search-input');
  const result = document.getElementById('social-search-result');
  if (!input || !result) return;
  const target = input.value.trim().toLowerCase();
  if (!target) return;
  result.innerHTML = '';
  if (target === user.toLowerCase()) {
    result.innerHTML = `<div class="alert alert-error" style="display:block">${t.social_cant_add_self}</div>`; return;
  }
  const { data: tu } = await db.from('users').select('username').eq('username', target).maybeSingle();
  if (!tu) { result.innerHTML = `<div class="alert alert-error" style="display:block">${t.social_user_not_found}</div>`; return; }
  const { data: ex } = await db.from('friendships').select('id,status')
    .or(`and(user_a.eq.${user},user_b.eq.${target}),and(user_a.eq.${target},user_b.eq.${user})`).maybeSingle();
  if (ex) {
    const msg = ex.status === 'accepted' ? t.social_already_friends : t.social_request_exists;
    result.innerHTML = `<div class="alert alert-error" style="display:block">${msg}</div>`; return;
  }
  const { error } = await db.from('friendships').insert({ user_a: user, user_b: target, status: 'pending' });
  if (error) { result.innerHTML = `<div class="alert alert-error" style="display:block">${t.err_connection}</div>`; return; }
  result.innerHTML = `<div class="alert alert-success" style="display:block">${t.social_request_sent}</div>`;
  input.value = '';
}

async function acceptFriendRequest(id) {
  await db.from('friendships').update({ status: 'accepted' }).eq('id', id);
  _socialTab = 'friends';
  renderSocialTabs();
}

async function declineFriendRequest(id) {
  await db.from('friendships').delete().eq('id', id);
  renderSocialTabs();
}

// ── Chat ──────────────────────────────────────────────────────
async function openChat(friendUsername) {
  const user = getSession(); if (!user) return;
  const t = T;
  _chatPartner = friendUsername;
  if (_chatChannel) { db.removeChannel(_chatChannel); _chatChannel = null; }
  const main = document.getElementById('social-main');
  if (!main) return;
  main.classList.add('chat-active');
  document.body.classList.add('chat-mode');
  main.innerHTML = `
    <div class="chat-header">
      <button class="chat-back-btn" onclick="exitChat()">←</button>
      ${friendUsername === 'FitMol AI' ? `<img src="${AI_AVATAR_SVG}" style="width:36px;height:36px;border-radius:50%;margin-right:2px;flex-shrink:0" />` : ''}
      <div class="chat-header-info" onclick="openFriendProfile('${friendUsername}')">
        <div class="chat-partner-name">${friendUsername}</div>
        <div class="chat-partner-status" id="chat-status"></div>
      </div>
      <button class="chat-profile-btn" onclick="openFriendProfile('${friendUsername}')">👤</button>
    </div>
    <div class="chat-messages" id="chat-messages">
      <div style="text-align:center;padding:40px;color:var(--gray)">${t.loading_text}</div>
    </div>
    ${friendUsername === 'FitMol AI' ? `<div class="chat-input-row" style="justify-content:center;color:var(--gray);font-size:13px;padding:10px 16px">🤖 FitMol AI · Read-only</div>` : `<div class="chat-input-row">
      <input class="form-input" type="text" id="chat-input" placeholder="${t.social_message_ph}"
        style="flex:1;margin:0" onkeydown="if(event.key==='Enter')sendChatMessage()" />
      <button class="btn btn-primary" style="width:auto;margin:0" onclick="sendChatMessage()">${t.social_send}</button>
    </div>`}`;
  const { data: partner } = await db.from('users').select('last_active').eq('username', friendUsername).maybeSingle();
  const statusEl = document.getElementById('chat-status');
  if (statusEl) statusEl.textContent = friendUsername === 'FitMol AI' ? '🤖 Assistant' : (partner ? getLastActiveText(partner.last_active) : '');
  await loadChatMessages(user, friendUsername);
  db.from('messages').update({ read: true }).eq('sender', friendUsername).eq('receiver', user).eq('read', false).then(() => {});
  _chatChannel = db.channel(`chat-${[user,friendUsername].sort().join('-')}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      const msg = payload.new;
      if ((msg.sender===user&&msg.receiver===friendUsername)||(msg.sender===friendUsername&&msg.receiver===user)) {
        appendChatMessage(msg, user);
        scrollChatToBottom();
        if (msg.sender === friendUsername) db.from('messages').update({ read: true }).eq('id', msg.id).then(()=>{});
      }
    }).subscribe();
}

async function loadChatMessages(user, friend) {
  const t = T;
  const { data: msgs } = await db.from('messages').select('*')
    .or(`and(sender.eq.${user},receiver.eq.${friend}),and(sender.eq.${friend},receiver.eq.${user})`)
    .order('created_at', { ascending: true }).limit(200);
  const container = document.getElementById('chat-messages');
  if (!container) return;
  if (!msgs || msgs.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gray)">${t.social_no_messages}</div>`; return;
  }
  container.innerHTML = '';
  msgs.forEach(msg => appendChatMessage(msg, user, container));
  scrollChatToBottom(container);
}

function appendChatMessage(msg, currentUser, container) {
  const c = container || document.getElementById('chat-messages');
  if (!c) return;
  const isMine = msg.sender === currentUser;
  const time = new Date(msg.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const div = document.createElement('div');
  div.className = `chat-msg ${isMine ? 'chat-msg-mine' : 'chat-msg-theirs'}`;
  div.innerHTML = `<div class="chat-bubble">${msg.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div><div class="chat-time">${time}</div>`;
  c.appendChild(div);
}

function scrollChatToBottom(container) {
  const c = container || document.getElementById('chat-messages');
  if (c) c.scrollTop = c.scrollHeight;
}

async function sendChatMessage() {
  const user = getSession(); if (!user || !_chatPartner) return;
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  await db.from('messages').insert({ sender: user, receiver: _chatPartner, text });
}

function exitChat() {
  if (_chatChannel) { db.removeChannel(_chatChannel); _chatChannel = null; }
  _chatPartner = null;
  document.body.classList.remove('chat-mode');
  const main = document.getElementById('social-main');
  if (main) main.classList.remove('chat-active');
  _socialTab = 'friends';
  renderSocialTabs();
}

// ── Admin User List (FitMol AI only) ──────────────────────────
async function loadAdminUserList() {
  const content = document.getElementById('social-tab-content');
  if (!content) return;
  content.innerHTML = `<div style="text-align:center;padding:40px;color:var(--gray)">Loading users...</div>`;
  const [{ data: users }, { data: activity }] = await Promise.all([
    db.from('users').select('username,avatar_data,last_active,created_at').neq('username', 'FitMol AI').order('last_active', { ascending: false, nullsFirst: false }),
    db.from('user_activity').select('username,visit_count,last_visit')
  ]);
  const actMap = {};
  (activity || []).forEach(a => actMap[a.username] = a);
  if (!users || users.length === 0) {
    content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👥</div><div class="empty-state-text">No users yet</div></div>`;
    return;
  }
  content.innerHTML = `<div class="social-friends-list">
    ${users.map(u => {
      const act = actMap[u.username];
      const visits = act ? act.visit_count : 0;
      return `
      <div class="social-friend-item" onclick="openAdminUserProfile('${u.username}')">
        <div class="social-friend-avatar" style="position:relative">
          ${u.avatar_data ? `<img src="${u.avatar_data}" />` : u.username.charAt(0).toUpperCase()}
        </div>
        <div class="social-friend-info">
          <div class="social-friend-name">${u.username}</div>
          <div class="social-friend-status">${getLastActiveText(u.last_active)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:11px;color:var(--gray)">
          <span>${visits} visits</span>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

async function openAdminUserProfile(username) {
  const existing = document.getElementById('admin-profile-modal');
  if (existing) existing.remove();
  const [{ data: u }, { data: act }] = await Promise.all([
    db.from('users').select('username,avatar_data,last_active,created_at,language,gender').eq('username', username).maybeSingle(),
    db.from('user_activity').select('visit_count,last_visit').eq('username', username).maybeSingle()
  ]);
  if (!u) return;
  const visits = act ? act.visit_count : 0;
  const lastVisit = act && act.last_visit ? new Date(act.last_visit).toLocaleString() : '—';
  const joined = u.created_at ? new Date(u.created_at).toLocaleDateString() : '—';
  const el = document.createElement('div');
  el.id = 'admin-profile-modal';
  el.className = 'modal-overlay open';
  el.innerHTML = `
    <div class="modal-card" style="max-width:380px;text-align:center">
      <div class="modal-header">
        <div class="modal-title">${u.username}</div>
        <button class="modal-close" onclick="document.getElementById('admin-profile-modal').remove()">×</button>
      </div>
      <div style="padding:20px 0">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--blue);color:#fff;font-size:32px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;overflow:hidden">
          ${u.avatar_data ? `<img src="${u.avatar_data}" style="width:80px;height:80px;object-fit:cover" />` : u.username.charAt(0).toUpperCase()}
        </div>
        <div style="font-size:20px;font-weight:700;margin-bottom:12px">${u.username}</div>
        <div style="display:flex;flex-direction:column;gap:8px;text-align:left;padding:0 16px;font-size:13px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Last Active</span><span style="font-weight:600">${getLastActiveText(u.last_active)}</span></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Total Visits</span><span style="font-weight:600">${visits}</span></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Last Visit</span><span style="font-weight:600">${lastVisit}</span></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Joined</span><span style="font-weight:600">${joined}</span></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Language</span><span style="font-weight:600">${(u.language || '—').toUpperCase()}</span></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray)">Gender</span><span style="font-weight:600">${u.gender || '—'}</span></div>
        </div>
        <div style="margin-top:16px;display:flex;gap:8px;justify-content:center">
          <button class="btn btn-primary" style="width:auto;padding:10px 22px;font-size:13px" onclick="document.getElementById('admin-profile-modal').remove();openChat('${u.username}')">💬 Chat</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(el);
}

// ── Friend Profile Modal ──────────────────────────────────────
async function openFriendProfile(username) {
  const t = T;
  const existing = document.getElementById('friend-profile-modal');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'friend-profile-modal';
  el.className = 'modal-overlay open';
  if (username === 'FitMol AI') {
    el.innerHTML = `
      <div class="modal-card" style="max-width:340px;text-align:center">
        <div class="modal-header">
          <div class="modal-title">FitMol AI</div>
          <button class="modal-close" onclick="document.getElementById('friend-profile-modal').remove()">×</button>
        </div>
        <div style="padding:20px 0">
          <div style="width:80px;height:80px;border-radius:50%;margin:0 auto 12px;overflow:hidden">
            <img src="${AI_AVATAR_SVG}" style="width:80px;height:80px;object-fit:cover" />
          </div>
          <div style="font-size:20px;font-weight:700;margin-bottom:4px">FitMol AI</div>
          <div style="font-size:13px;color:var(--blue);margin-bottom:20px">🤖 Assistant</div>
          <button class="btn btn-primary" style="width:auto;padding:12px 28px" onclick="document.getElementById('friend-profile-modal').remove();openChat('FitMol AI')">💬 Chat</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    return;
  }
  const { data: u } = await db.from('users').select('username,avatar_data,last_active').eq('username', username).maybeSingle();
  if (!u) return;
  el.innerHTML = `
    <div class="modal-card" style="max-width:340px;text-align:center">
      <div class="modal-header">
        <div class="modal-title">${u.username}</div>
        <button class="modal-close" onclick="document.getElementById('friend-profile-modal').remove()">×</button>
      </div>
      <div style="padding:20px 0">
        <div style="width:80px;height:80px;border-radius:50%;background:var(--blue);color:#fff;font-size:32px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;overflow:hidden">
          ${u.avatar_data?`<img src="${u.avatar_data}" style="width:80px;height:80px;object-fit:cover" />`:u.username.charAt(0).toUpperCase()}
        </div>
        <div style="font-size:20px;font-weight:700;margin-bottom:4px">${u.username}</div>
        <div style="font-size:13px;color:var(--gray);margin-bottom:20px">${getLastActiveText(u.last_active)}</div>
        <button class="btn btn-primary" style="width:auto;padding:12px 28px" onclick="document.getElementById('friend-profile-modal').remove();openChat('${u.username}')">💬 Chat</button>
      </div>
    </div>`;
  document.body.appendChild(el);
}
