let currentIndex = 0;
let scale = 1;
let imageCache = new Map();

function preloadImages() {
    const images = document.querySelectorAll('.location-image');
    images.forEach((img, index) => {
        if (index < 5) {
            const preloadImg = new Image();
            preloadImg.src = img.src || img.dataset.src;
            imageCache.set(img.src || img.dataset.src, preloadImg);
        }
    });
}

// Lazy loading para imagens
function setupLazyLoading() {
    const images = document.querySelectorAll('.location-image[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
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
    
    if (imageCache.has(src)) {
        img.src = src;
    } else {
        const realImg = new Image();
        realImg.onload = () => {
            img.src = src;
            imageCache.set(src, realImg);
            adjustImageSize(modal, img);
        };
        realImg.src = src;
    }

    currentIndex = Array.from(images).findIndex(image => (image.src === src || image.dataset.src === src));
    setScale(1);
    img.style.objectFit = 'contain';

    preloadAdjacentImages(currentIndex, images);

    navigation.style.display = 'flex';

    img.addEventListener('wheel', handleWheel);
    document.addEventListener('keydown', handleKeydown);
}

function preloadAdjacentImages(currentIndex, images) {
    const preloadIndexes = [
        currentIndex - 1 >= 0 ? currentIndex - 1 : images.length - 1,
        currentIndex + 1 < images.length ? currentIndex + 1 : 0
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

    const navigation = document.querySelector('.navigation');
    navigation.style.display = 'none';

    const img = document.getElementById("img01");
    img.removeEventListener('wheel', handleWheel);
    document.removeEventListener('keydown', handleKeydown);
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
    
    if (imageCache.has(newSrc)) {
        img.src = newSrc;
    } else {
        const realImg = new Image();
        realImg.onload = () => {
            img.src = newSrc;
            imageCache.set(newSrc, realImg);
        };
        realImg.src = newSrc;
    }
    
    setScale(1);
    
    preloadAdjacentImages(currentIndex, images);
}

function handleWheel(event) {
    event.preventDefault();
    scale *= (event.deltaY < 0) ? 1.1 : 0.9;
    scale = Math.min(Math.max(0.5, scale), 5);
    const img = document.getElementById("img01");
    img.style.transform = `scale(${scale})`;
    img.style.transformOrigin = 'center center';
}

function setScale(value) {
    scale = value;
    const img = document.getElementById("img01");
    img.style.transform = `scale(${scale})`;
}

function adjustImageSize(modal, img) {
    const modalWidth = modal.clientWidth;
    const modalHeight = modal.clientHeight;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const modalRatio = modalWidth / modalHeight;

    img.style.objectFit = (imgRatio > modalRatio) ? 'contain' : 'contain';
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
}

document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    setupLazyLoading();
});
