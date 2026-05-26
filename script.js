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
