(function () {
    if (typeof firebase === 'undefined') {
        console.error('Firebase não inicializado. Execute ./generate-config.sh');
        return;
    }

    const pageName = document.title || window.location.pathname;

    function createOverlay() {
        if (document.getElementById('authOverlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'authOverlay';
        overlay.className = 'auth-overlay';
        overlay.innerHTML = `
            <div class="auth-card">
                <p class="auth-label">Faça login para acessar esta página</p>
                <button id="googleSignInBtn" class="google-btn">
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Entrar com Google
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById('googleSignInBtn').addEventListener('click', signIn);
    }

    function removeOverlay() {
        const overlay = document.getElementById('authOverlay');
        if (!overlay) return;
        overlay.classList.add('hiding');
        setTimeout(() => overlay.remove(), 300);
    }

    function signIn() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => {
            console.error('Erro no login:', err.message);
        });
    }

    function createLogoutBtn(user) {
        if (document.getElementById('logoutBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'logoutBtn';
        btn.className = 'logout-btn';
        btn.title = `Sair (${user.email})`;
        btn.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName}" /> Sair`;
        btn.addEventListener('click', () => auth.signOut());
        document.body.appendChild(btn);
    }

    async function onLogin(user) {
        const loginRef = db.collection('logins').doc(user.uid);
        const now = new Date();
        const nowTs = firebase.firestore.FieldValue.serverTimestamp();

        let shouldNotify = false;
        const doc = await loginRef.get();

        if (!doc.exists) {
            await loginRef.set({
                email: user.email,
                name: user.displayName,
                photoURL: user.photoURL,
                firstLoginAt: nowTs,
                lastLoginAt: nowTs,
                lastNotifiedAt: nowTs,
                loginCount: 1
            });
            shouldNotify = true;
        } else {
            const data = doc.data();
            const lastNotified = data.lastNotifiedAt ? data.lastNotifiedAt.toDate() : null;
            shouldNotify = !lastNotified || (now - lastNotified) > 60 * 60 * 1000;

            const update = {
                lastLoginAt: nowTs,
                loginCount: firebase.firestore.FieldValue.increment(1)
            };
            if (shouldNotify) update.lastNotifiedAt = nowTs;
            await loginRef.update(update);
        }

        if (!shouldNotify) return;

        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const { ip } = await ipRes.json();

            const waitForEmailjs = (resolve) => {
                if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY) resolve();
                else setTimeout(() => waitForEmailjs(resolve), 200);
            };
            await new Promise(waitForEmailjs);

            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                user_name: user.displayName,
                user_email: user.email,
                user_ip: ip,
                access_time: now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
                page: pageName
            });
        } catch (e) { console.warn('Erro ao enviar e-mail:', e); }
    }

    document.body.classList.add('auth-loading');

    auth.onAuthStateChanged(user => {
        if (user) {
            removeOverlay();
            createLogoutBtn(user);
            window.currentUser = user;
            document.body.classList.remove('auth-loading');
            document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
            const sessionKey = 'session_' + user.uid;
            const lastSessionTimestamp = localStorage.getItem(sessionKey);
            const oneDayInMilliseconds = 864e5;
            const sessionExpired = !lastSessionTimestamp || (Date.now() - parseInt(lastSessionTimestamp)) > oneDayInMilliseconds;

            if (sessionExpired) {
                localStorage.setItem(sessionKey, Date.now().toString());
                onLogin(user);
            } else {
                const remaining = oneDayInMilliseconds - (Date.now() - parseInt(lastSessionTimestamp));
                setTimeout(() => auth.signOut(), remaining);
            }
        } else {
            window.currentUser = null;
            const btn = document.getElementById('logoutBtn');
            if (btn) btn.remove();
            createOverlay();
            document.body.classList.remove('auth-loading');
        }
    });
})();
