let currentIndex = 0;
let imageCache = new Map();

function preloadImages() {
    const images = document.querySelectorAll('.location-image');
    images.forEach((img) => {
        const preloadImg = new Image();
        preloadImg.src = img.src || img.dataset.src;
        imageCache.set(img.src || img.dataset.src, preloadImg);
    });
}

function setupLazyLoading() {
    const images = document.querySelectorAll('.location-image[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

function openModal(src) {
    const modal = document.getElementById("myModal");
    const img = document.getElementById("img01");
    const images = document.querySelectorAll('.location-image');
    const navigation = document.querySelector('.navigation');

    modal.style.display = "flex";

    if (!document.getElementById('modalCloseBtn')) {
        const closeBtn = document.createElement('button');
        closeBtn.id = 'modalCloseBtn';
        closeBtn.className = 'modal-close-btn';
        closeBtn.innerHTML = '✕';
        closeBtn.setAttribute('aria-label', 'Fechar');
        closeBtn.onclick = (e) => { e.stopPropagation(); closeModal(); };
        modal.appendChild(closeBtn);
    }

    if (imageCache.has(src)) {
        img.src = src;
    } else {
        const realImg = new Image();
        realImg.onload = () => {
            img.src = src;
            imageCache.set(src, realImg);
        };
        realImg.src = src;
    }

    currentIndex = Array.from(images).findIndex(image => (image.src === src || image.dataset.src === src));

    img.style.objectFit = 'contain';
    preloadAdjacentImages(currentIndex, images);
    navigation.style.display = 'flex';

    document.addEventListener('keydown', handleKeydown);

    img.onload = function() {
        optimizeImageDisplay(img);
    };

    if (window.initSocialForPhoto) window.initSocialForPhoto(src);
}

function optimizeImageDisplay(img) {
    const mobile = window.innerWidth <= 600;
    const arrowSpace = mobile ? 100 : 0;
    const viewportWidth = window.innerWidth * 0.9 - arrowSpace;
    const viewportHeight = window.innerHeight * (mobile ? 0.80 : 0.85);

    img.style.maxWidth = `${viewportWidth}px`;
    img.style.maxHeight = `${viewportHeight}px`;
}

function preloadAdjacentImages(currentIndex, images) {
    const preloadIndexes = [
        (currentIndex - 1 + images.length) % images.length,
        (currentIndex + 1) % images.length
    ];

    preloadIndexes.forEach(index => {
        const imgSrc = images[index].src || images[index].dataset.src;
        if (imgSrc && !imageCache.has(imgSrc)) {
            const preloadImg = new Image();
            preloadImg.src = imgSrc;
            imageCache.set(imgSrc, preloadImg);
        }
    });
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    document.removeEventListener('keydown', handleKeydown);
    if (window.cleanupSocial) window.cleanupSocial();
}

function handleKeydown(event) {
    if (event.key === "Escape") {
        closeModal();
    } else if (event.key === "ArrowRight") {
        nextImage();
    } else if (event.key === "ArrowLeft") {
        prevImage();
    }
}

function prevImage() {
    const images = document.querySelectorAll('.location-image');
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImageSrc();
}

function nextImage() {
    const images = document.querySelectorAll('.location-image');
    currentIndex = (currentIndex + 1) % images.length;
    updateImageSrc();
}

function updateImageSrc() {
    const img = document.getElementById("img01");
    const images = document.querySelectorAll('.location-image');
    const newSrc = images[currentIndex].src || images[currentIndex].dataset.src;

    img.src = newSrc;
    optimizeImageDisplay(img);
    if (window.initSocialForPhoto) window.initSocialForPhoto(newSrc);
}

function toggleDropdown(e) {
    e.stopPropagation();
    document.getElementById('navDropdown').classList.toggle('open');
}

function closeDropdown(e) {
    const dropdown = document.getElementById('navDropdown');
    if (dropdown) dropdown.classList.remove('open');
}

const MONTHS_PT = ['','Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function citySlugFromPage() {
    var param = new URLSearchParams(window.location.search).get('cidade');
    if (param) return param;
    return window.location.pathname.split('/').pop().replace('.html', '');
}

function getOrCreateYearDiv(year) {
    const id = `year-${year}`;
    let div = document.getElementById(id);
    if (div) return div;

    div = document.createElement('div');
    div.className = 'timeline-year';
    div.id = id;
    div.innerHTML = `<h2>${year}</h2>`;

    const timeline = document.querySelector('.timeline');
    const allYears = [...timeline.querySelectorAll('.timeline-year')];
    const insertBefore = allYears.find(el => {
        const y = parseInt(el.querySelector('h2').textContent);
        return y < year;
    });

    if (insertBefore) {
        timeline.insertBefore(div, insertBefore);
    } else {
        timeline.appendChild(div);
    }
    return div;
}

function getOrCreateMonthEvent(yearDiv, month) {
    const label = `[${MONTHS_PT[month]}]`;
    const existing = [...yearDiv.querySelectorAll('.timeline-event h3')]
        .find(h => h.textContent.startsWith(label));
    if (existing) return existing.closest('.timeline-event').querySelector('.timeline-images');

    const event = document.createElement('div');
    event.className = 'timeline-event';
    event.innerHTML = `<h3>${label}</h3><div class="timeline-images"></div>`;

    const allEvents = [...yearDiv.querySelectorAll('.timeline-event')];
    const insertBefore = allEvents.find(el => {
        const m = MONTHS_PT.indexOf(el.querySelector('h3').textContent.replace(/[\[\]]/g, '').split(' ')[0]);
        return m > 0 && m < month;
    });

    if (insertBefore) {
        yearDiv.insertBefore(event, insertBefore);
    } else {
        yearDiv.appendChild(event);
    }
    return event.querySelector('.timeline-images');
}

window.injectFirestorePhoto = function injectFirestorePhoto(photo) {
    const yearDiv    = getOrCreateYearDiv(photo.year);
    const imagesDiv  = getOrCreateMonthEvent(yearDiv, photo.month);

    const img = document.createElement('img');
    img.src             = photo.url;
    img.alt             = photo.title || '';
    img.title           = photo.title || '';
    img.className       = 'location-image';
    img.dataset.photoId = photo.id;
    img.onclick         = () => openModal(img.src);
    imagesDiv.appendChild(img);
    imageCache.set(img.src, img);
};

function loadFirestorePhotos(citySlug) {
    if (typeof db === 'undefined' || !citySlug) return;
    db.collection('photos').doc(citySlug).collection('entries')
        .orderBy('year', 'desc').orderBy('month', 'desc').orderBy('createdAt', 'desc')
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => injectFirestorePhoto({ id: doc.id, ...doc.data() }));
        })
        .catch(() => {});
}

document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    setupLazyLoading();

    window.addEventListener('resize', function() {
        const modal = document.getElementById("myModal");
        const img = document.getElementById("img01");

        if (modal.style.display === "flex") {
            optimizeImageDisplay(img);
        }
    });
});

document.addEventListener('userLoggedIn', () => {
    loadFirestorePhotos(citySlugFromPage());
});
