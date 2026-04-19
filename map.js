const locations = [
    { coords: [-25.5478, -54.5882], title: "Foz do Iguaçu - PR", country: "Brasil", link: "fozdoiguacu.html" },
    { coords: [-25.4284, -49.2733], title: "Curitiba - PR", country: "Brasil", link: "curitiba.html" },
    { coords: [-24.9969, -54.3049], title: "Itaipulândia - PR", country: "Brasil", link: "itaipulandia.html" },
    { coords: [-25.8231, -48.5221], title: "Matinhos - PR", country: "Brasil", link: "matinhos.html" },
    { coords: [-25.4420, -49.0628], title: "Piraquara - PR", country: "Brasil", link: "piraquara.html" },
    { coords: [-25.5272, -49.1922], title: "São José dos Pinhais - PR", country: "Brasil", link: "saojosedospinhais.html" },
    { coords: [-25.5730, -48.5044], title: "Pontal do Paraná - PR", country: "Brasil", link: "pontal.html" },
    { coords: [-25.8833, -48.5753], title: "Guaratuba - PR", country: "Brasil", link: "guaratuba.html" },
    { coords: [-25.2994, -49.1829], title: "Colombo - PR", country: "Brasil", link: "colombo.html" },
    { coords: [-25.4292, -50.0058], title: "Palmeira - PR", country: "Brasil", link: "palmeira.html" },
    { coords: [-25.4286, -48.7094], title: "Antonina - PR", country: "Brasil", link: "antonina.html" },
    { coords: [-25.4472, -54.3872], title: "Santa Terezinha de Itaipu - PR", country: "Brasil", link: "terezinha.html" },
    { coords: [-25.4736, -48.8314], title: "Morretes - PR", country: "Brasil", link: "morretes.html" },
    { coords: [-25.3292, -49.1288], title: "Almirante Tamandaré - PR", country: "Brasil", link: "almirantetamandare.html" },
    { coords: [-25.5931, -49.4128], title: "Araucária - PR", country: "Brasil", link: "araucaria.html" },
    
    { coords: [-29.0476, -50.1431], title: "Cambará do Sul - RS", country: "Brasil", link: "cambara.html" }, 
    { coords: [-29.3333, -49.7333], title: "Torres - RS", country: "Brasil", link: "torres.html" },
    { coords: [-12.9711, -38.5108], title: "Salvador - BA", country: "Brasil", link: "salvador.html" },
    { coords: [-24.7080, -47.5553], title: "Iguape - SP", country: "Brasil", link: "iguape.html" },
    { coords: [-23.5505, -46.6333], title: "São Paulo - SP", country: "Brasil", link: "saopaulo.html" },
    { coords: [-22.9056, -47.0608], title: "Campinas - SP", country: "Brasil", link: "campinas.html" },
    { coords: [-22.9068, -43.1729], title: "Rio de Janeiro - RJ", country: "Brasil", link: "rio.html" },
    { coords: [-22.8831, -43.1039], title: "Niterói - RJ", country: "Brasil", link: "niteroi.html" },
    { coords: [-23.0294, -54.1827], title: "Mundo Novo - MS", country: "Brasil", link: "mundonovo.html" },
    { coords: [-28.9708, -49.6278], title: "Sombrio - SC", country: "Brasil", link: "sombrio.html" },
    { coords: [-26.6373, -48.6831], title: "Barra Velha - SC", country: "Brasil", link: "barravelha.html" },
    { coords: [-26.3237, -48.6462], title: "Penha - SC", country: "Brasil", link: "penha.html" },
    { coords: [-26.7378, -49.1778], title: "Pomerode - SC", country: "Brasil", link: "pomerode.html" },
    { coords: [-27.6447, -48.6680], title: "Palhoça - SC", country: "Brasil", link: "palhoca.html" },
    { coords: [-27.5969, -48.5495], title: "Florianópolis - SC", country: "Brasil", link: "florianopolis.html" },
    { coords: [-27.6136, -48.6365], title: "São José - SC", country: "Brasil", link: "saojose.html" },
    { coords: [-30.0346, -51.2195], title: "Porto Alegre - RS", country: "Brasil", link: "portoalegre.html" },
    { coords: [-15.7801, -47.9292], title: "Brasília - DF", country: "Brasil", link: "brasilia.html" },
    { coords: [-26.0250, -48.8519], title: "Garuva - SC", country: "Brasil", link: "garuva.html" },
    { coords: [-26.1158, -48.6112], title: "Itapoá - SC", country: "Brasil", link: "itapoa.html" },
    { coords: [-3.1190, -60.0217], title: "Manaus - AM", country: "Brasil", link: "manaus.html" },
    
    { coords: [-25.5082, -54.6201], title: "Ciudad del Este", country: "Paraguai", link: "cde.html" },
    { coords: [-25.5333, -54.6061], title: "Presidente Franco - PY", country: "Paraguai", link: "presidentefranco.html" },
    { coords: [-25.2867, -57.6470], title: "Asunción", country: "Paraguai", link: "asuncion.html" },
    { coords: [-25.5969, -54.5752], title: "Puerto Iguazú", country: "Argentina", link: "puertoiguazu.html" },
    { coords: [-34.6037, -58.3816], title: "Buenos Aires", country: "Argentina", link: "ba.html" },
    { coords: [-27.3656, -55.8834], title: "Posadas", country: "Argentina", link: "posadas.html" },
    { coords: [-34.9658, -54.9369], title: "Punta del Este", country: "Uruguai", link: "puntadeleste.html" },
    { coords: [-34.9011, -56.1645], title: "Montevidéu", country: "Uruguai", link: "montevideo.html" },
    { coords: [-34.4622, -57.8442], title: "Colônia do Sacramento", country: "Uruguai", link: "coloniadelsacramento.html" },
    { coords: [4.6109, -74.0818], title: "Bogotá", country: "Colômbia", link: "bogota.html" },
    { coords: [10.4916, -66.9036], title: "Caracas", country: "Venezuela", link: "caracas.html" },
    { coords: [4.6023, -61.1103], title: "Santa Elena de Uairén", country: "Venezuela", link: "santaelenadeuairen.html" },
    { coords: [7.8019, -72.4560], title: "Tátira (San Antonio)", country: "Venezuela", link: "tatira.html" },
    { coords: [7.2431, -70.7326], title: "Guasdualito", country: "Venezuela", link: "guasdualito.html" }
];

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map', {
        center: [-15.0, -55.0],
        zoom: 4,
        zoomControl: false,
        attributionControl: false
    });

    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        maxZoom: 19
    });

    tileLayer.addTo(map);

    locations.forEach(location => {
        const marker = L.marker(location.coords).addTo(map);
        
        const popupContent = `
            <div>
                <h3>${location.title}</h3>
                <p><em>${location.country}</em></p>
                <a href="#" onclick="navigateToPage('${location.link}'); return false;">Ver detalhes →</a>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });

    const group = new L.featureGroup(locations.map(loc => L.marker(loc.coords)));
    map.fitBounds(group.getBounds().pad(0.1));
});

function navigateToPage(url) {
    window.location.href = url;
}