(function () {
    let unsubscribeLikes = null;
    let unsubscribeComments = null;

    function photoId(src) {
        var match = src.match(/\/o\/(.+?)(?:\?|$)/);
        if (match) {
            var path = decodeURIComponent(match[1]);
            return path.replace(/[^a-zA-Z0-9]/g, '_').slice(-80);
        }
        var hash = 0;
        for (var i = 0; i < src.length; i++) {
            hash = Math.imul(31, hash) + src.charCodeAt(i) | 0;
        }
        return 'p' + Math.abs(hash).toString(36);
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function initSocialUI() {
        const modalContent = document.querySelector('.modal-content');
        if (!modalContent || document.getElementById('socialBar')) return;

        const isAdmin = window.currentUser && window.currentUser.email === ADMIN_EMAIL;

        const bar = document.createElement('div');
        bar.id = 'socialBar';
        bar.className = 'social-bar';
        bar.innerHTML = `
            <button id="likeBtn" class="like-btn" title="Curtir">
                <span id="likeIcon">🤍</span>
                <span id="likeCount">0</span>
            </button>
            <button id="commentsToggle" class="comments-toggle-btn" title="Comentários">
                <span>💬</span>
                <span id="commentsCount">0</span>
            </button>
            ${isAdmin ? '<button id="deletePhotoBtn" class="delete-photo-btn" title="Excluir foto">🗑</button>' : ''}
        `;
        modalContent.appendChild(bar);

        const panel = document.createElement('div');
        panel.id = 'commentsPanel';
        panel.className = 'comments-panel';
        panel.innerHTML = `
            <div class="comments-handle"></div>
            <div class="comments-header">
                <span>Comentários</span>
                <button class="close-panel-btn" id="closePanelBtn">✕</button>
            </div>
            <div id="commentsList" class="comments-list"></div>
            <div class="comment-form">
                <input type="text" id="commentInput" class="comment-input"
                    placeholder="Deixe um comentário..." maxlength="300" />
                <button id="commentSubmitBtn" class="comment-submit-btn">Enviar</button>
            </div>
        `;
        modalContent.appendChild(panel);

        document.getElementById('likeBtn').addEventListener('click', toggleLike);
        document.getElementById('commentsToggle').addEventListener('click', togglePanel);
        document.getElementById('closePanelBtn').addEventListener('click', closePanel);
        document.getElementById('commentSubmitBtn').addEventListener('click', submitComment);
        document.getElementById('commentInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') submitComment();
        });
        if (isAdmin) {
            document.getElementById('deletePhotoBtn').addEventListener('click', () => {
                if (window.deletePhoto) window.deletePhoto();
            });
        }
    }

    function togglePanel() {
        document.getElementById('commentsPanel').classList.toggle('open');
    }

    function closePanel() {
        const panel = document.getElementById('commentsPanel');
        if (panel) panel.classList.remove('open');
    }

    async function toggleLike() {
        if (!window.currentUser || !window._currentPhotoId) return;
        const btn = document.getElementById('likeBtn');
        if (btn) btn.disabled = true;

        const uid = window.currentUser.uid;
        const ref = db.collection('likes').doc(window._currentPhotoId);

        try {
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(ref);
                const data = doc.exists ? doc.data() : {};
                const isLiked = data.users && data.users[uid];

                if (isLiked) {
                    transaction.update(ref, {
                        count: firebase.firestore.FieldValue.increment(-1),
                        [`users.${uid}`]: firebase.firestore.FieldValue.delete()
                    });
                } else {
                    transaction.set(ref, {
                        count: firebase.firestore.FieldValue.increment(1),
                        [`users.${uid}`]: true
                    }, { merge: true });
                }
            });
        } finally {
            if (btn) btn.disabled = false;
        }
    }

    async function submitComment() {
        if (!window.currentUser || !window._currentPhotoId) return;
        const input = document.getElementById('commentInput');
        const btn = document.getElementById('commentSubmitBtn');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        btn.disabled = true;

        try {
            await db.collection('comments').doc(window._currentPhotoId)
                .collection('entries').add({
                    userId: window.currentUser.uid,
                    userName: window.currentUser.displayName || 'Anônimo',
                    userPhoto: window.currentUser.photoURL || '',
                    text: text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
        } finally {
            btn.disabled = false;
            input.focus();
        }
    }

    function renderComments(entries) {
        const list = document.getElementById('commentsList');
        if (!list) return;

        if (entries.length === 0) {
            list.innerHTML = '<p class="no-comments">Nenhum comentário ainda. Seja o primeiro!</p>';
            return;
        }

        const currentUid = window.currentUser ? window.currentUser.uid : null;
        const isAdmin = window.currentUser && window.currentUser.email === ADMIN_EMAIL;

        list.innerHTML = entries.map(entry => `
            <div class="comment-item">
                <img src="${escapeHtml(entry.userPhoto)}"
                     class="comment-avatar"
                     alt="${escapeHtml(entry.userName)}"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><circle cx=%2212%22 cy=%2212%22 r=%2212%22 fill=%22%23555%22/></svg>'" />
                <div class="comment-body">
                    <span class="comment-name">${escapeHtml(entry.userName)}</span>
                    <span class="comment-text">${escapeHtml(entry.text)}</span>
                </div>
                ${(entry.userId === currentUid || isAdmin)
                    ? `<button class="delete-comment-btn" data-id="${entry.id}" title="Excluir">✕</button>`
                    : ''}
            </div>
        `).join('');

        list.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await db.collection('comments').doc(window._currentPhotoId)
                    .collection('entries').doc(btn.dataset.id).delete();
            });
        });
    }

    window.initSocialForPhoto = function (src) {
        if (!window.currentUser || typeof db === 'undefined') return;

        initSocialUI();
        closePanel();

        const pid = photoId(src);
        window._currentPhotoId = pid;

        if (unsubscribeLikes) unsubscribeLikes();
        if (unsubscribeComments) unsubscribeComments();

        unsubscribeLikes = db.collection('likes').doc(pid).onSnapshot(doc => {
            const data = doc.exists ? doc.data() : {};
            const count = data.count || 0;
            const liked = data.users && window.currentUser && data.users[window.currentUser.uid];

            const icon = document.getElementById('likeIcon');
            const counter = document.getElementById('likeCount');
            if (icon) icon.textContent = liked ? '❤️' : '🤍';
            if (counter) counter.textContent = count > 0 ? count : '0';
        });

        unsubscribeComments = db.collection('comments').doc(pid)
            .collection('entries').orderBy('createdAt', 'asc')
            .onSnapshot(snapshot => {
                const entries = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                const counter = document.getElementById('commentsCount');
                if (counter) counter.textContent = entries.length > 0 ? entries.length : '0';
                renderComments(entries);
            });
    };

    window.cleanupSocial = function () {
        if (unsubscribeLikes) { unsubscribeLikes(); unsubscribeLikes = null; }
        if (unsubscribeComments) { unsubscribeComments(); unsubscribeComments = null; }
        window._currentPhotoId = null;
        closePanel();
    };
})();
