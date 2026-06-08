(function () {
    var isAdmin = false;

    function renderPet(data, docId) {
        var grid = document.getElementById('petsGrid');
        if (!grid) return;

        var card = document.createElement('div');
        card.className    = 'pet-card';
        card.dataset.docId = docId;
        card.onclick = function () { openModal(card.querySelector('img').src); };

        var img = document.createElement('img');
        img.src       = data.url;
        img.alt       = data.name || '';
        img.className = 'location-image';

        var span = document.createElement('span');
        span.className   = 'pet-name';
        span.textContent = data.name || '';

        card.appendChild(img);
        card.appendChild(span);

        if (isAdmin) {
            var del = document.createElement('button');
            del.className = 'pet-del-btn';
            del.innerHTML = '✕';
            del.title     = 'Remover';
            del.onclick = function (e) {
                e.stopPropagation();
                if (!confirm('Remover ' + (data.name || 'este pet') + '?')) return;
                db.collection('pets').doc(docId).delete()
                    .then(function () { card.remove(); })
                    .catch(function (err) { alert('Erro: ' + err.message); });
            };
            card.appendChild(del);

            span.onclick = function (e) {
                e.stopPropagation();
                var newName = prompt('Nome:', span.textContent);
                if (newName !== null && newName.trim()) {
                    db.collection('pets').doc(docId).update({ name: newName.trim() })
                        .then(function () { span.textContent = newName.trim(); })
                        .catch(function (err) { alert('Erro ao salvar: ' + err.message); });
                }
            };
        }

        grid.appendChild(card);
    }

    function loadPets() {
        db.collection('pets').orderBy('order', 'asc').get()
            .then(function (snapshot) {
                snapshot.forEach(function (doc) { renderPet(doc.data(), doc.id); });
                if (isAdmin) addUploadBtn();
            })
            .catch(function () {
                if (isAdmin) addUploadBtn();
            });
    }

    function addUploadBtn() {
        if (document.getElementById('petUploadFab')) return;
        var fab = document.createElement('button');
        fab.id        = 'petUploadFab';
        fab.className = 'upload-fab';
        fab.innerHTML = '+';
        fab.title     = 'Adicionar pet';
        fab.onclick   = openPetPanel;
        document.body.appendChild(fab);
    }

    function openPetPanel() {
        if (document.getElementById('petPanel')) { document.getElementById('petPanel').remove(); return; }

        var panel = document.createElement('div');
        panel.id        = 'petPanel';
        panel.className = 'upload-panel';
        panel.innerHTML = [
            '<div class="upload-panel-header">',
            '  <span>Adicionar pet</span>',
            '  <button class="upload-panel-close" id="petPanelClose">✕</button>',
            '</div>',
            '<div class="upload-panel-body">',
            '  <label class="upload-label-full">Nome',
            '    <input type="text" id="petName" placeholder="Ex: Saller" maxlength="60">',
            '  </label>',
            '  <label class="upload-label-full upload-file-label">',
            '    Selecionar foto',
            '    <input type="file" id="petFile" accept="image/*">',
            '  </label>',
            '  <div id="petFileName" class="upload-file-names"></div>',
            '  <button class="upload-submit" id="petSubmit" disabled>Adicionar</button>',
            '  <div id="petStatus" class="upload-status"></div>',
            '</div>',
        ].join('');
        document.body.appendChild(panel);

        document.getElementById('petPanelClose').onclick = function () { panel.remove(); };

        var fileInput = document.getElementById('petFile');
        var submitBtn = document.getElementById('petSubmit');
        var statusEl  = document.getElementById('petStatus');

        fileInput.onchange = function () {
            document.getElementById('petFileName').textContent = fileInput.files[0] ? fileInput.files[0].name : '';
            submitBtn.disabled = !fileInput.files[0];
        };

        submitBtn.onclick = function () {
            var name = document.getElementById('petName').value.trim();
            var file = fileInput.files[0];
            if (!file) return;

            submitBtn.disabled   = true;
            statusEl.textContent = 'Enviando…';

            var path = 'images/pets/' + Date.now() + '_' + file.name;
            firebase.storage().ref().child(path).put(file)
                .then(function (snap) { return snap.ref.getDownloadURL(); })
                .then(function (url) {
                    return db.collection('pets').add({
                        name:  name,
                        url:   url,
                        order: Date.now(),
                    });
                })
                .then(function (ref) {
                    statusEl.textContent = '✓ Adicionado!';
                    renderPet({ name: name, url: URL.createObjectURL(file) }, ref.id);
                    setTimeout(function () { panel.remove(); }, 1200);
                })
                .catch(function (err) {
                    statusEl.textContent = 'Erro: ' + err.message;
                    submitBtn.disabled = false;
                });
        };
    }

    document.addEventListener('userLoggedIn', function (e) {
        isAdmin = (e.detail.email === ADMIN_EMAIL);
        loadPets();
    });
})();
