let currentIndex = 0;
let scale = 1; // Fator de escala inicial

function openModal(src) {
    const modal = document.getElementById("myModal");
    modal.style.display = "flex"; 
    const img = document.getElementById("img01");
    img.src = src;

    // Atualiza o índice da imagem atual
    currentIndex = Array.from(document.querySelectorAll('.location-image')).findIndex(imgElement => imgElement.src === src);
    
    // Reseta a escala quando abrir nova imagem
    scale = 1;
    img.style.transform = `scale(${scale})`;
    
    // Ajusta a imagem para se enquadrar na tela
    img.style.maxWidth = '90%'; 
    img.style.maxHeight = '90%'; 
    img.style.objectFit = 'contain'; // Sempre manter a imagem inteira visível

    // Calcula a proporção da imagem
    img.onload = function() {
        const modalWidth = modal.clientWidth;
        const modalHeight = modal.clientHeight;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const modalRatio = modalWidth / modalHeight;

        // Define object-fit dinamicamente
        if (imgRatio > modalRatio) {
            img.style.objectFit = 'contain'; 
        } else {
            img.style.objectFit = 'contain'; // Mudei para 'contain' para sempre mostrar a imagem inteira
        }
    };

    // Remove listener anterior (se existir) e adiciona novo
    img.removeEventListener('wheel', handleWheel);
    img.addEventListener('wheel', handleWheel);
    
    document.addEventListener('keydown', handleKeydown); 
}

function closeModal() {
    document.getElementById("myModal").style.display = "none"; 
    document.removeEventListener('keydown', handleKeydown); 
    const img = document.getElementById("img01");
    
    // Remove o event listener de wheel
    img.removeEventListener('wheel', handleWheel);
    
    // Reseta a escala
    img.style.transform = `scale(1)`; 
    scale = 1; 
}

function handleKeydown(event) {
    const images = document.querySelectorAll('.location-image');
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
    
    // Reseta a escala ao mudar de imagem
    scale = 1;
    const img = document.getElementById("img01");
    img.src = images[currentIndex].src;
    img.style.transform = `scale(${scale})`;
}

function nextImage() {
    const images = document.querySelectorAll('.location-image');
    currentIndex = (currentIndex + 1) % images.length; 
    
    // Reseta a escala ao mudar de imagem
    scale = 1;
    const img = document.getElementById("img01");
    img.src = images[currentIndex].src;
    img.style.transform = `scale(${scale})`;
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
    scale = Math.min(Math.max(0.5, scale), 5); // Escala entre 0.5x e 5x (permiti zoom out maior)
    img.style.transform = `scale(${scale})`; 
    img.style.transformOrigin = 'center center'; // Zoom centralizado
}
