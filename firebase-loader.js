(function () {
    function load(src) {
        return new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    load('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
        .then(function () {
            return Promise.all([
                load('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js'),
                load('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js'),
                load('https://www.gstatic.com/firebasejs/10.14.1/firebase-storage-compat.js'),
                load('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'),
            ]);
        })
        .then(function () { return load('firebase-config.js'); })
        .then(function () {
            return Promise.all([load('auth.js'), load('social.js'), load('upload.js')]);
        });
})();
