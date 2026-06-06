(function () {
    var isAdmin = false;

    function renderEntry(data, docId) {
        var timeline = document.getElementById('musicTimeline');
        if (!timeline) return;

        var section = document.createElement('div');
        section.className    = 'timeline-year';
        section.dataset.docId = docId;

        var h2 = document.createElement('h2');
        h2.textContent = '[' + data.year + '] ' + (data.title || '');

        var grid = document.createElement('div');
        grid.className = 'video-grid';

        var container = document.createElement('div');
        container.className = 'video-container';

        if (data.type === 'video' && data.url) {
            var video = document.createElement('video');
            video.controls = true;
            var source = document.createElement('source');
            source.src  = data.url;
            source.type = 'video/mp4';
            video.appendChild(source);
            container.appendChild(video);
        } else if (data.type === 'youtube' && data.url) {
            var iframe = document.createElement('iframe');
            iframe.src             = data.url;
            iframe.allowFullscreen = true;
            container.appendChild(iframe);
        }

        grid.appendChild(container);
        section.appendChild(h2);
        section.appendChild(grid);

        if (isAdmin) {
            var del = document.createElement('button');
            del.className = 'music-del-btn';
            del.innerHTML = '✕ Remover';
            del.onclick = function () {
                if (!confirm('Remover "' + h2.textContent + '"?')) return;
                db.collection('music').doc(docId).delete()
                    .then(function () { section.remove(); });
            };
            section.appendChild(del);
        }

        // Inserir em ordem decrescente de ano
        var existing = [...timeline.querySelectorAll('.timeline-year[data-doc-id]')];
        var insertBefore = existing.find(function (el) {
            return parseInt(el.querySelector('h2').textContent) < data.year;
        });
        if (insertBefore) {
            timeline.insertBefore(section, insertBefore);
        } else {
            var addBtn = document.getElementById('musicAddSection');
            if (addBtn) timeline.insertBefore(section, addBtn);
            else timeline.appendChild(section);
        }
    }

    function loadMusic() {
        db.collection('music').orderBy('year', 'desc').get()
            .then(function (snapshot) {
                snapshot.forEach(function (doc) { renderEntry(doc.data(), doc.id); });
                if (isAdmin) addUploadBtn();
            })
            .catch(function () {
                if (isAdmin) addUploadBtn();
            });
    }

    function addUploadBtn() {
        if (document.getElementById('musicUploadFab')) return;
        var fab = document.createElement('button');
        fab.id        = 'musicUploadFab';
        fab.className = 'upload-fab';
        fab.innerHTML = '+';
        fab.title     = 'Adicionar vídeo';
        fab.onclick   = openMusicPanel;
        document.body.appendChild(fab);
    }

    function openMusicPanel() {
        if (document.getElementById('musicPanel')) { document.getElementById('musicPanel').remove(); return; }

        var panel = document.createElement('div');
        panel.id        = 'musicPanel';
        panel.className = 'upload-panel';
        panel.innerHTML = [
            '<div class="upload-panel-header">',
            '  <span>Adicionar vídeo</span>',
            '  <button class="upload-panel-close" id="musicPanelClose">✕</button>',
            '</div>',
            '<div class="upload-panel-body">',
            '  <label class="upload-label-full">Título',
            '    <input type="text" id="musicTitle" placeholder="Ex: Orquestra Sonarte" maxlength="100">',
            '  </label>',
            '  <label class="upload-label-full">Ano',
            '    <input type="number" id="musicYear" value="' + new Date().getFullYear() + '" min="1900" max="2099">',
            '  </label>',
            '  <label class="upload-label-full">Tipo',
            '    <select id="musicType">',
            '      <option value="youtube">YouTube (URL)</option>',
            '      <option value="video">Vídeo (upload)</option>',
            '    </select>',
            '  </label>',
            '  <div id="musicYoutubeRow">',
            '    <label class="upload-label-full">URL do YouTube',
            '      <input type="text" id="musicYoutubeUrl" placeholder="https://www.youtube.com/embed/...">',
            '    </label>',
            '  </div>',
            '  <div id="musicVideoRow" style="display:none">',
            '    <label class="upload-label-full upload-file-label">',
            '      Selecionar vídeo',
            '      <input type="file" id="musicFile" accept="video/*">',
            '    </label>',
            '    <div id="musicFileName" class="upload-file-names"></div>',
            '  </div>',
            '  <button class="upload-submit" id="musicSubmit">Adicionar</button>',
            '  <div id="musicStatus" class="upload-status"></div>',
            '</div>',
        ].join('');
        document.body.appendChild(panel);

        document.getElementById('musicPanelClose').onclick = function () { panel.remove(); };

        document.getElementById('musicType').onchange = function () {
            var isYoutube = this.value === 'youtube';
            document.getElementById('musicYoutubeRow').style.display = isYoutube ? '' : 'none';
            document.getElementById('musicVideoRow').style.display   = isYoutube ? 'none' : '';
        };

        document.getElementById('musicFile') && (document.getElementById('musicFile').onchange = function () {
            document.getElementById('musicFileName').textContent = this.files[0] ? this.files[0].name : '';
        });

        document.getElementById('musicSubmit').onclick = function () {
            var title    = document.getElementById('musicTitle').value.trim();
            var year     = parseInt(document.getElementById('musicYear').value);
            var type     = document.getElementById('musicType').value;
            var statusEl = document.getElementById('musicStatus');

            if (!title || !year) { statusEl.textContent = 'Preencha título e ano.'; return; }

            document.getElementById('musicSubmit').disabled = true;
            statusEl.textContent = 'Salvando…';

            if (type === 'youtube') {
                var url = document.getElementById('musicYoutubeUrl').value.trim();
                // Converter URL normal para embed se necessário
                url = url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/');
                if (!url) { statusEl.textContent = 'Informe a URL.'; document.getElementById('musicSubmit').disabled = false; return; }
                db.collection('music').add({ title: title, year: year, type: 'youtube', url: url, order: Date.now() })
                    .then(function (ref) {
                        renderEntry({ title: title, year: year, type: 'youtube', url: url }, ref.id);
                        statusEl.textContent = '✓ Adicionado!';
                        setTimeout(function () { panel.remove(); }, 1200);
                    })
                    .catch(function (err) { statusEl.textContent = 'Erro: ' + err.message; document.getElementById('musicSubmit').disabled = false; });
            } else {
                var file = document.getElementById('musicFile').files[0];
                if (!file) { statusEl.textContent = 'Selecione um vídeo.'; document.getElementById('musicSubmit').disabled = false; return; }
                var path = 'images/music/' + Date.now() + '_' + file.name;
                firebase.storage().ref().child(path).put(file)
                    .then(function (snap) { return snap.ref.getDownloadURL(); })
                    .then(function (url) {
                        return db.collection('music').add({ title: title, year: year, type: 'video', url: url, order: Date.now() });
                    })
                    .then(function (ref) {
                        renderEntry({ title: title, year: year, type: 'video', url: URL.createObjectURL(file) }, ref.id);
                        statusEl.textContent = '✓ Adicionado!';
                        setTimeout(function () { panel.remove(); }, 1200);
                    })
                    .catch(function (err) { statusEl.textContent = 'Erro: ' + err.message; document.getElementById('musicSubmit').disabled = false; });
            }
        };
    }

    document.addEventListener('userLoggedIn', function (e) {
        isAdmin = (e.detail.email === ADMIN_EMAIL);
        loadMusic();
    });
})();
