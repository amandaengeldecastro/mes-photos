// script.js
let currentIndex = 0; 

function openModal(src) {
    const modal = document.getElementById("myModal");
    modal.style.display = "flex"; 
    document.getElementById("img01").src = src;

    currentIndex = Array.from(document.querySelectorAll('.location-image')).findIndex(img => img.src === src);
    document.addEventListener('keydown', handleKeydown); 
}

function closeModal() {
    document.getElementById("myModal").style.display = "none"; 
    document.removeEventListener('keydown', handleKeydown); 
}

function handleKeydown(event) {
    const images = document.querySelectorAll('.location-image');
    if (event.key === "Escape") {
        closeModal();
    } else if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % images.length; 
        document.getElementById("img01").src = images[currentIndex].src;
    } else if (event.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + images.length) % images.length; 
        document.getElementById("img01").src = images[currentIndex].src;
    }
}
