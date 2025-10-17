let currentIndex = 0;
let scale = 1; // Fator de escala inicial

function openModal(src) {
    const modal = document.getElementById("myModal");
    modal.style.display = "flex"; 
    document.getElementById("img01").src = src;
    const img = document.getElementById("img01");
    img.style.transform = `scale(${scale})`; // Aplica a escala

    // Atualiza o índice da imagem atual
    currentIndex = Array.from(document.querySelectorAll('.location-image')).findIndex(img => img.src === src);
    document.addEventListener('keydown', handleKeydown); 
    
    // Adiciona ouvintes de eventos para zoom
    img.addEventListener('wheel', handleWheel);
}

function closeModal() {
    document.getElementById("myModal").style.display = "none"; 
    document.removeEventListener('keydown', handleKeydown); 
    const img = document.getElementById("img01");
    img.style.transform = `scale(1)`; // Reseta a escala
    scale = 1; // Reseta o fator de escala
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

function prevImage() {
    const images = document.querySelectorAll('.location-image');
    currentIndex = (currentIndex - 1 + images.length) % images.length; 
    document.getElementById("img01").src = images[currentIndex].src;
}

function nextImage() {
    const images = document.querySelectorAll('.location-image');
    currentIndex = (currentIndex + 1) % images.length; 
    document.getElementById("img01").src = images[currentIndex].src;
}

function handleWheel(event) {
    event.preventDefault(); // Evita a rolagem da página ao usar a roda do mouse
    const img = document.getElementById("img01");
    
    // Ajusta a escala do zoom com base na direção da roda do mouse
    if (event.deltaY < 0) {
        scale *= 1.1; // Zoom in
    } else {
        scale /= 1.1; // Zoom out
    }
    
    // Limita a escalabilidade
    scale = Math.min(Math.max(1, scale), 5); // Escala entre 1x e 5x
    img.style.transform = `scale(${scale})`; // Aplica a nova escala
}
