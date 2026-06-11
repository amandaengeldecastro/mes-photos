(function () {
    var LINK_ICONS = {
        linkedin:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
        github:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
        whatsapp:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
        telegram:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
        instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
        maps:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-5-2V4l5 2m0 14l6-2m-6 2V6m6 12l5 2V6l-5-2m0 14V4"/></svg>',
        x:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
        youtube:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>',
        tiktok:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>',
        spotify:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13.5c2.5-1 5.5-1 8 0M7 10.5c3-1.3 7-1.3 10 0M9 16.5c2-0.7 4-0.7 6 0"/></svg>',
        link:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    };

    var DOMAIN_TYPE_MAP = {
        'linkedin.com': 'linkedin', 'github.com': 'github',
        'wa.me': 'whatsapp', 'whatsapp.com': 'whatsapp',
        't.me': 'telegram', 'telegram.me': 'telegram',
        'instagram.com': 'instagram', 'x.com': 'x', 'twitter.com': 'x',
        'youtube.com': 'youtube', 'youtu.be': 'youtube',
        'tiktok.com': 'tiktok', 'spotify.com': 'spotify',
    };

    var DEFAULT_LINKS = [
        { type: 'maps',     label: 'Mapa Fotográfico', url: 'maps.html' },
        { type: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/amandaengeldecastro/' },
    ];

    var uid = null;

    function typeFromUrl(url) {
        if (!url) return 'link';
        try {
            var host = new URL(url).hostname.replace('www.', '');
            for (var domain in DOMAIN_TYPE_MAP) {
                if (host === domain || host.endsWith('.' + domain)) return DOMAIN_TYPE_MAP[domain];
            }
        } catch (e) {}
        return 'link';
    }

    function iconFor(type, url) {
        if (LINK_ICONS[type]) return LINK_ICONS[type];
        if (url && url.startsWith('http')) {
            try {
                var domain = new URL(url).hostname;
                return '<img src="https://www.google.com/s2/favicons?domain=' + domain + '&sz=64" style="width:15px;height:15px;border-radius:3px;object-fit:contain;" />';
            } catch (e) {}
        }
        return LINK_ICONS.link;
    }

    function arrowFor(url) { return (url && url.startsWith('http')) ? '↗' : '→'; }

    function renderLinks(links, nav, isAdmin) {
        nav.innerHTML = '';

        (links || []).forEach(function (link, i) {
            var a = document.createElement('a');
            a.href      = link.url;
            a.className = 'nav-link';
            if (link.url && link.url.startsWith('http')) a.target = '_blank';
            a.innerHTML = iconFor(link.type, link.url) +
                '<span>' + link.label + '</span>' +
                '<span class="arrow">' + arrowFor(link.url) + '</span>';

            if (isAdmin && link.type !== 'maps') {
                var del = document.createElement('button');
                del.className = 'link-del-btn';
                del.innerHTML = '✕';
                del.title     = 'Remover link';
                del.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!confirm('Remover "' + link.label + '"?')) return;
                    links.splice(i, 1);
                    saveProfile({ links: links });
                    renderLinks(links, nav, isAdmin);
                };
                a.appendChild(del);
            }

            nav.appendChild(a);
        });

        if (isAdmin) {
            var addBtn = document.createElement('button');
            addBtn.className = 'nav-link nav-add-btn';
            addBtn.innerHTML = '<span style="font-size:16px;opacity:0.4">+</span><span>Adicionar link</span>';
            addBtn.onclick = function () { openAddLink(links, nav, isAdmin); };
            nav.appendChild(addBtn);
        }

        if ((links || []).length > 3) {
            nav.classList.add('icon-only');
        } else {
            nav.classList.remove('icon-only');
        }
    }

    function openAddLink(links, nav, isAdmin) {
        if (document.getElementById('addLinkPanel')) return;

        var panel = document.createElement('div');
        panel.id        = 'addLinkPanel';
        panel.className = 'edit-panel';
        panel.innerHTML = [
            '<div class="edit-panel-header">',
            '  <span>Novo link</span>',
            '  <button class="edit-panel-close" id="addLinkClose">✕</button>',
            '</div>',
            '<div class="edit-panel-body">',
            '  <label>URL<input type="text" id="addLinkUrl" placeholder="https://x.com/usuario" maxlength="300"></label>',
            '  <label>Label<input type="text" id="addLinkLabel" placeholder="Ex: X (Twitter)" maxlength="40"></label>',
            '  <div id="addLinkPreview" style="display:none;align-items:center;gap:8px;padding:8px 10px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:12px;color:rgba(255,255,255,0.6)"></div>',
            '  <button class="edit-submit" id="addLinkSave">Adicionar</button>',
            '</div>',
        ].join('');
        document.body.appendChild(panel);

        document.getElementById('addLinkClose').onclick = function () { panel.remove(); };

        document.getElementById('addLinkUrl').oninput = function () {
            var url     = this.value.trim();
            var preview = document.getElementById('addLinkPreview');
            var type    = typeFromUrl(url);
            if (url.startsWith('http')) {
                preview.style.display = 'flex';
                preview.innerHTML = iconFor(type, url) + '<span>' + (new URL(url).hostname.replace('www.','')) + '</span>';
            } else {
                preview.style.display = 'none';
            }
        };

        document.getElementById('addLinkSave').onclick = function () {
            var url   = document.getElementById('addLinkUrl').value.trim();
            var label = document.getElementById('addLinkLabel').value.trim();
            if (!label || !url) return;
            var type = typeFromUrl(url);
            links.push({ type: type, label: label, url: url });
            saveProfile({ links: links });
            renderLinks(links, nav, isAdmin);
            panel.remove();
        };
    }

    function saveProfile(partial) {
        if (!uid) return;
        db.collection('logins').doc(uid).update(partial)
            .catch(function (err) { alert('Erro ao salvar: ' + err.message); });
    }

    function makeEditable(el, field) {
        var btn = document.createElement('button');
        btn.className = 'inline-edit-btn';
        btn.innerHTML = '✎';
        btn.title     = 'Editar';
        btn.onclick = function () {
            var current = el.textContent.trim();
            var val = prompt(field + ':', current);
            if (val !== null && val.trim() !== current) {
                el.textContent = val.trim();
                var patch = {};
                patch[field] = val.trim();
                saveProfile(patch);
            }
        };
        el.parentNode.insertBefore(btn, el.nextSibling);
    }

    function applyProfile(data, isAdmin) {
        var nameEl  = document.getElementById('profileName');
        var nameEl2 = document.getElementById('profileName2');
        var roleEl  = document.getElementById('profileRole');
        var locEl   = document.getElementById('profileLocation');
        var bioEl   = document.getElementById('profileBio');
        var nav     = document.getElementById('profileNav');

        if (data.name)     { if (nameEl) nameEl.textContent = data.name; if (nameEl2) nameEl2.textContent = data.name; }
        if (data.role)     { if (roleEl) roleEl.textContent = data.role; }
        if (data.location) { if (locEl)  locEl.textContent  = data.location; }
        if (data.bio)      { if (bioEl)  bioEl.textContent  = data.bio; }

        renderLinks(data.links && data.links.length ? data.links : DEFAULT_LINKS, nav, isAdmin);

        if (isAdmin) {
            if (nameEl)  makeEditable(nameEl,  'name');
            if (nameEl2) makeEditable(nameEl2, 'name');
            if (roleEl)  makeEditable(roleEl,  'role');
            if (locEl)   makeEditable(locEl,   'location');
            if (bioEl)   makeEditable(bioEl,   'bio');
        }
    }

    function loadProfile(user, isAdmin) {
        uid = user.uid;
        db.collection('logins').doc(uid).get()
            .then(function (doc) {
                applyProfile(doc.exists ? doc.data() : {}, isAdmin);
            })
            .catch(function () {
                applyProfile({}, isAdmin);
            });
    }

    var loaded = false;
    document.addEventListener('userLoggedIn', function (e) {
        if (loaded) return;
        loaded = true;
        loadProfile(e.detail, e.detail.email === ADMIN_EMAIL);
    });

    if (window.currentUser && !loaded) {
        loaded = true;
        loadProfile(window.currentUser, window.currentUser.email === ADMIN_EMAIL);
    }
})();
