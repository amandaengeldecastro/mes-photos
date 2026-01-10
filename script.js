let currentIndex = 0;
let scale = 1;

function openModal(src) {
    const modal = document.getElementById("myModal");
    const img = document.getElementById("img01");
    const images = document.querySelectorAll('.location-image');
    const navigation = document.querySelector('.navigation');

    modal.style.display = "flex"; // Exibe o modal
    img.src = src;

    currentIndex = Array.from(images).findIndex(image => image.src === src);
    setScale(1);
    img.style.objectFit = 'contain';

    img.onload = () => {
        adjustImageSize(modal, img);
    };

    navigation.style.display = 'flex'; // Exibe as setas de navegação

    img.addEventListener('wheel', handleWheel);
    document.addEventListener('keydown', handleKeydown);
}

function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none"; // Oculta o modal

    const navigation = document.querySelector('.navigation');
    navigation.style.display = 'none'; // Oculta as setas de navegação

    const img = document.getElementById("img01");
    img.removeEventListener('wheel', handleWheel);
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
    img.src = document.querySelectorAll('.location-image')[currentIndex].src;
    setScale(1);
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

    // Centraliza a imagem no modal
    img.style.maxWidth = '90%'; // Ajusta a largura máxima para 90% do modal
    img.style.maxHeight = '90%'; // Ajusta a altura máxima para 90% do modal
}
