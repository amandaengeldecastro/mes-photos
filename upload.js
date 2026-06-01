(function () {
    // Coloque aqui o e-mail da sua conta Google
    const ADMIN_EMAIL = 'amandaengeldecastro@gmail.com';

    const MONTHS_PT = ['','Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    function citySlugFromPage() {
        var param = new URLSearchParams(window.location.search).get('cidade');
        if (param) return param;
        return window.location.pathname.split('/').pop().replace('.html', '');
    }

    function isAdminPage() {
        const slug = citySlugFromPage();
        return slug && slug !== 'maps' && slug !== 'index' && slug !== '';
    }

    function createUploadUI(user) {
        if (!isAdminPage()) return;
        if (document.getElementById('uploadFab')) return;

        const fab = document.createElement('button');
        fab.id        = 'uploadFab';
        fab.className = 'upload-fab';
        fab.innerHTML = '+';
        fab.title     = 'Adicionar foto';
        fab.addEventListener('click', () => openUploadPanel(user));
        document.body.appendChild(fab);
    }

    function openUploadPanel(user) {
        if (document.getElementById('uploadPanel')) {
            document.getElementById('uploadPanel').remove();
            return;
        }

        const now   = new Date();
        const panel = document.createElement('div');
        panel.id    = 'uploadPanel';
        panel.className = 'upload-panel';
        panel.innerHTML = `
            <div class="upload-panel-header">
                <span>Adicionar foto</span>
                <button class="upload-panel-close" id="uploadClose">✕</button>
            </div>
            <div class="upload-panel-body">
                <div class="upload-row">
                    <label>Ano
                        <input type="number" id="uploadYear" value="${now.getFullYear()}" min="1990" max="2099">
                    </label>
                    <label>Mês
                        <select id="uploadMonth">
                            ${MONTHS_PT.slice(1).map((m, i) =>
                                `<option value="${i+1}" ${(i+1) === now.getMonth()+1 ? 'selected' : ''}>${m}</option>`
                            ).join('')}
                        </select>
                    </label>
                </div>
                <label class="upload-label-full">Legenda (opcional)
                    <input type="text" id="uploadTitle" placeholder="Ex: Jardim Botânico" maxlength="120">
                </label>
                <label class="upload-label-full upload-file-label" id="uploadFileLabel">
                    Selecionar foto(s)
                    <input type="file" id="uploadFile" accept="image/*" multiple>
                </label>
                <div id="uploadFileNames" class="upload-file-names"></div>
                <button class="upload-submit" id="uploadSubmit" disabled>Enviar</button>
                <div id="uploadStatus" class="upload-status"></div>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('uploadClose').addEventListener('click', () => panel.remove());

        const fileInput  = document.getElementById('uploadFile');
        const submitBtn  = document.getElementById('uploadSubmit');
        const statusEl   = document.getElementById('uploadStatus');
        const namesEl    = document.getElementById('uploadFileNames');

        fileInput.addEventListener('change', () => {
            const files = [...fileInput.files];
            namesEl.textContent = files.map(f => f.name).join(', ');
            submitBtn.disabled  = files.length === 0;
        });

        submitBtn.addEventListener('click', () => doUpload(user, fileInput.files, statusEl, submitBtn));
    }

    async function doUpload(user, files, statusEl, submitBtn) {
        if (!files || files.length === 0) return;

        const citySlug = citySlugFromPage();
        const year     = parseInt(document.getElementById('uploadYear').value);
        const month    = parseInt(document.getElementById('uploadMonth').value);
        const title    = document.getElementById('uploadTitle').value.trim();

        submitBtn.disabled = true;
        statusEl.textContent = `Enviando 0 / ${files.length}…`;

        const storageService = firebase.storage();
        let done = 0;

        for (const file of files) {
            try {
                const path   = `uploads/${citySlug}/${year}_${String(month).padStart(2,'0')}_${Date.now()}_${file.name}`;
                const ref    = storageService.ref().child(path);
                const snap   = await ref.put(file);
                const url    = await snap.ref.getDownloadURL();

                await db.collection('photos').doc(citySlug).collection('entries').add({
                    citySlug,
                    year,
                    month,
                    title: title || '',
                    url,
                    uploadedBy: user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });

                done++;
                statusEl.textContent = `Enviando ${done} / ${files.length}…`;

                // Injeta imediatamente na página sem recarregar
                if (window.injectFirestorePhoto) {
                    window.injectFirestorePhoto({ year, month, title, url, id: path });
                }
            } catch (e) {
                statusEl.textContent = `Erro: ${e.message}`;
                submitBtn.disabled = false;
                return;
            }
        }

        statusEl.textContent = `✓ ${done} foto(s) adicionada(s)!`;
        setTimeout(() => document.getElementById('uploadPanel')?.remove(), 2000);
    }

    document.addEventListener('userLoggedIn', (e) => {
        const user = e.detail;
        if (user.email === ADMIN_EMAIL) {
            createUploadUI(user);
        }
    });
})();
