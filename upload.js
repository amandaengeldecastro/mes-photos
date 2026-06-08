(function () {
const MONTHS_PT = ['','Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                       'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    function citySlugFromPage() {
        var param = new URLSearchParams(window.location.search).get('cidade');
        if (param) return param;
        return window.location.pathname.split('/').pop().replace('.html', '');
    }

    function isOnMapPage() {
        var path = window.location.pathname;
        return path.endsWith('maps.html') || path.endsWith('/mes-photos/') || path === '/';
    }

    function isAdminPage() {
        if (isOnMapPage()) return true;
        var slug = citySlugFromPage();
        return slug && slug !== 'index' && slug !== '';
    }

    function toSlug(name, region) {
        var text = name + (region ? region : '');
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]/g, '');
    }

    function lookupCoordinates(cityName, regionName, country) {
        var query = [cityName, regionName, country].filter(Boolean).join(', ');
        return fetch(
            'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + '&format=json&limit=1'
        )
        .then(function (response) { return response.json(); })
        .then(function (results) {
            if (!results.length) throw new Error('Localização não encontrada. Tente um nome diferente.');
            return [parseFloat(results[0].lat), parseFloat(results[0].lon)];
        });
    }

    function createUploadUI(user) {
        if (!isAdminPage()) return;
        if (document.getElementById('uploadFab')) return;

        var fab = document.createElement('button');
        fab.id        = 'uploadFab';
        fab.className = 'upload-fab';
        fab.innerHTML = '+';
        fab.title     = isOnMapPage() ? 'Adicionar cidade' : 'Adicionar foto';
        fab.addEventListener('click', function () {
            if (isOnMapPage()) {
                openCityPanel(user);
            } else {
                openUploadPanel(user);
            }
        });
        document.body.appendChild(fab);
    }

    function openCityPanel(user) {
        if (document.getElementById('uploadPanel')) {
            document.getElementById('uploadPanel').remove();
            return;
        }

        var panel = document.createElement('div');
        panel.id        = 'uploadPanel';
        panel.className = 'upload-panel';
        panel.innerHTML = [
            '<div class="upload-panel-header">',
            '  <span>Nova cidade</span>',
            '  <button class="upload-panel-close" id="uploadClose">✕</button>',
            '</div>',
            '<div class="upload-panel-body">',
            '  <label class="upload-label-full">Nome da cidade',
            '    <input type="text" id="cityInputName" placeholder="Ex: Curitiba" maxlength="80">',
            '  </label>',
            '  <div class="upload-row">',
            '    <label>Estado / Região',
            '      <input type="text" id="cityInputRegion" placeholder="Ex: PR" maxlength="40">',
            '    </label>',
            '    <label>País',
            '      <input type="text" id="cityInputCountry" placeholder="Ex: Brasil" maxlength="60">',
            '    </label>',
            '  </div>',
            '  <button class="upload-submit" id="cityLookupBtn">Buscar coordenadas</button>',
            '  <div id="cityCoordResult" class="upload-status"></div>',
            '  <button class="upload-submit" id="cityCreateBtn" disabled>Criar cidade</button>',
            '  <div id="cityCreateStatus" class="upload-status"></div>',
            '</div>',
        ].join('');
        document.body.appendChild(panel);

        document.getElementById('uploadClose').addEventListener('click', function () {
            panel.remove();
        });

        var foundCoords = null;

        document.getElementById('cityLookupBtn').addEventListener('click', function () {
            var name      = document.getElementById('cityInputName').value.trim();
            var region    = document.getElementById('cityInputRegion').value.trim();
            var country   = document.getElementById('cityInputCountry').value.trim();
            var resultEl  = document.getElementById('cityCoordResult');

            if (!name) { resultEl.textContent = 'Informe o nome da cidade.'; return; }

            resultEl.textContent = 'Buscando…';

            lookupCoordinates(name, region, country)
                .then(function (coords) {
                    foundCoords = coords;
                    var slug = toSlug(name, region);
                    resultEl.textContent = 'Lat: ' + coords[0].toFixed(4) +
                        ', Lng: ' + coords[1].toFixed(4) + ' · slug: ' + slug;
                    document.getElementById('cityCreateBtn').disabled = false;
                })
                .catch(function (err) {
                    resultEl.textContent = err.message;
                    foundCoords = null;
                });
        });

        document.getElementById('cityCreateBtn').addEventListener('click', function () {
            var name      = document.getElementById('cityInputName').value.trim();
            var region    = document.getElementById('cityInputRegion').value.trim();
            var country   = document.getElementById('cityInputCountry').value.trim();
            var statusEl  = document.getElementById('cityCreateStatus');
            var createBtn = document.getElementById('cityCreateBtn');

            if (!foundCoords) { statusEl.textContent = 'Busque as coordenadas primeiro.'; return; }

            var displayName = region ? (name + ' — ' + region) : name;
            var slug        = toSlug(name, region);

            createBtn.disabled   = true;
            statusEl.textContent = 'Criando…';

            db.collection('cities').doc(slug).set({
                name:       displayName,
                slug:       slug,
                country:    country || 'Brasil',
                coords:     foundCoords,
                yearMonths: [],
            })
            .then(function () {
                statusEl.textContent = 'Cidade criada!';
                setTimeout(function () {
                    window.location.href = 'city.html?cidade=' + slug;
                }, 800);
            })
            .catch(function (err) {
                statusEl.textContent = 'Erro: ' + err.message;
                createBtn.disabled = false;
            });
        });
    }

    function openUploadPanel(user) {
        if (document.getElementById('uploadPanel')) {
            document.getElementById('uploadPanel').remove();
            return;
        }

        var now = new Date();

        var panel = document.createElement('div');
        panel.id        = 'uploadPanel';
        panel.className = 'upload-panel';
        panel.innerHTML = [
            '<div class="upload-panel-header">',
            '  <span>Adicionar foto</span>',
            '  <button class="upload-panel-close" id="uploadClose">✕</button>',
            '</div>',
            '<div class="upload-panel-body">',
            '  <div class="upload-row">',
            '    <label>Ano',
            '      <input type="number" id="uploadYear" value="' + now.getFullYear() + '" min="1990" max="2099">',
            '    </label>',
            '    <label>Mês',
            '      <select id="uploadMonth">',
            MONTHS_PT.slice(1).map(function (month, index) {
                var value    = index + 1;
                var selected = value === now.getMonth() + 1 ? ' selected' : '';
                return '        <option value="' + value + '"' + selected + '>' + month + '</option>';
            }).join(''),
            '      </select>',
            '    </label>',
            '  </div>',
            '  <label class="upload-label-full">Evento (opcional)',
            '    <input type="text" id="uploadEventTitle" placeholder="Ex: Aniversário" maxlength="120">',
            '  </label>',
            '  <label class="upload-label-full">Legenda (opcional)',
            '    <input type="text" id="uploadTitle" placeholder="Ex: Jardim Botânico" maxlength="120">',
            '  </label>',
            '  <label class="upload-label-full upload-file-label" id="uploadFileLabel">',
            '    Selecionar foto(s)',
            '    <input type="file" id="uploadFile" accept="image/*" multiple>',
            '  </label>',
            '  <div id="uploadFileNames" class="upload-file-names"></div>',
            '  <button class="upload-submit" id="uploadSubmit" disabled>Enviar</button>',
            '  <div id="uploadStatus" class="upload-status"></div>',
            '</div>',
        ].join('');
        document.body.appendChild(panel);

        document.getElementById('uploadClose').addEventListener('click', function () {
            panel.remove();
        });

        var fileInput = document.getElementById('uploadFile');
        var submitBtn = document.getElementById('uploadSubmit');
        var statusEl  = document.getElementById('uploadStatus');
        var namesEl   = document.getElementById('uploadFileNames');

        fileInput.addEventListener('change', function () {
            var files       = Array.from(fileInput.files);
            namesEl.textContent = files.map(function (f) { return f.name; }).join(', ');
            submitBtn.disabled  = files.length === 0;
        });

        submitBtn.addEventListener('click', function () {
            doUpload(user, fileInput.files, statusEl, submitBtn);
        });
    }

    function doUpload(user, files, statusEl, submitBtn) {
        if (!files || files.length === 0) return;

        var citySlug   = citySlugFromPage();
        var year       = parseInt(document.getElementById('uploadYear').value);
        var month      = parseInt(document.getElementById('uploadMonth').value);
        var eventTitle = document.getElementById('uploadEventTitle').value.trim();
        var title      = document.getElementById('uploadTitle').value.trim();

        submitBtn.disabled   = true;
        statusEl.textContent = 'Enviando 0 / ' + files.length + '…';

        var storageService = firebase.storage();
        var fileArray      = Array.from(files);
        var done           = 0;

        function uploadNext(index) {
            if (index >= fileArray.length) {
                db.collection('cities').doc(citySlug).update({
                    yearMonths: firebase.firestore.FieldValue.arrayUnion(year + '-' + month),
                }).catch(function (err) { console.warn('yearMonths não atualizado:', err.message); });

                statusEl.textContent = '✓ ' + done + ' foto(s) adicionada(s)!';
                setTimeout(function () {
                    var panel = document.getElementById('uploadPanel');
                    if (panel) panel.remove();
                }, 2000);
                return;
            }

            var file = fileArray[index];
            var path = 'uploads/' + citySlug + '/' + year + '_' +
                       String(month).padStart(2, '0') + '_' + Date.now() + '_' + file.name;
            var ref  = storageService.ref().child(path);

            ref.put(file)
                .then(function (snap) { return snap.ref.getDownloadURL(); })
                .then(function (url) {
                    return db.collection('photos').doc(citySlug).collection('entries').add({
                        citySlug:   citySlug,
                        year:       year,
                        month:      month,
                        eventTitle: eventTitle || '',
                        title:      title || '',
                        url:        url,
                        order:      Date.now() + index,
                        uploadedBy: user.uid,
                        createdAt:  firebase.firestore.FieldValue.serverTimestamp(),
                    }).then(function (docRef) { return { url: url, docId: docRef.id }; });
                })
                .then(function (result) {
                    done++;
                    statusEl.textContent = 'Enviando ' + done + ' / ' + fileArray.length + '…';

                    if (window.injectFirestorePhoto) {
                        window.injectFirestorePhoto({
                            year:       year,
                            month:      month,
                            eventTitle: eventTitle || '',
                            title:      title || '',
                            url:        result.url,
                            docId:      result.docId,
                            id:         path,
                        });
                    }

                    uploadNext(index + 1);
                })
                .catch(function (err) {
                    statusEl.textContent = 'Erro: ' + err.message;
                    submitBtn.disabled = false;
                });
        }

        uploadNext(0);
    }

    document.addEventListener('userLoggedIn', function (event) {
        var user = event.detail;
        if (user.email === ADMIN_EMAIL) {
            createUploadUI(user);
        }
    });
})();
