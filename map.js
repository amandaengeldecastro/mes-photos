const locations = [
    { coords: [-25.5478, -54.5882], title: "Foz do Iguaçu — PR", country: "Brasil",   link: "fozdoiguacu.html",         years: [2014, 2017, 2018, 2022, 2023] },
    { coords: [-25.4284, -49.2733], title: "Curitiba — PR",       country: "Brasil",   link: "curitiba.html",            years: [2025] },
    { coords: [-24.9969, -54.3049], title: "Itaipulândia — PR",   country: "Brasil",   link: "itaipulandia.html",        years: [2019] },
    { coords: [-25.8231, -48.5221], title: "Matinhos — PR",       country: "Brasil",   link: "matinhos.html",            years: [2025] },
    { coords: [-25.4420, -49.0628], title: "Piraquara — PR",      country: "Brasil",   link: "piraquara.html",           years: [2025] },
    { coords: [-25.5272, -49.1922], title: "São José dos Pinhais — PR", country: "Brasil", link: "saojosedospinhais.html", years: [2025, 2026] },
    { coords: [-25.5730, -48.5044], title: "Pontal do Paraná — PR", country: "Brasil", link: "pontal.html",             years: [2025, 2026] },
    { coords: [-25.8833, -48.5753], title: "Guaratuba — PR",      country: "Brasil",   link: "guaratuba.html",           years: [2017, 2018, 2024, 2025] },
    { coords: [-25.2994, -49.1829], title: "Colombo — PR",        country: "Brasil",   link: "colombo.html",             years: [2024] },
    { coords: [-25.4292, -50.0058], title: "Palmeira — PR",       country: "Brasil",   link: "palmeira.html",            years: [2024] },
    { coords: [-25.4286, -48.7094], title: "Antonina — PR",       country: "Brasil",   link: "antonina.html",            years: [2024] },
    { coords: [-25.4472, -54.3872], title: "Sta. Terezinha de Itaipu — PR", country: "Brasil", link: "terezinha.html",  years: [2018] },
    { coords: [-25.4736, -48.8314], title: "Morretes — PR",       country: "Brasil",   link: "morretes.html",            years: [2024] },
    { coords: [-25.3292, -49.1288], title: "Almirante Tamandaré — PR", country: "Brasil", link: "almirantetamandare.html", years: [2025] },
    { coords: [-25.5931, -49.4128], title: "Araucária — PR",      country: "Brasil",   link: "araucaria.html",           years: [2026] },
    { coords: [-29.0476, -50.1431], title: "Cambará do Sul — RS", country: "Brasil",   link: "cambara.html",             years: [2014] },
    { coords: [-29.3333, -49.7333], title: "Torres — RS",         country: "Brasil",   link: "torres.html",              years: [2013] },
    { coords: [-12.9711, -38.5108], title: "Salvador — BA",       country: "Brasil",   link: "salvador.html",            years: [2015] },
    { coords: [-24.7080, -47.5553], title: "Iguape — SP",         country: "Brasil",   link: "iguape.html",              years: [2015] },
    { coords: [-23.5505, -46.6333], title: "São Paulo — SP",      country: "Brasil",   link: "saopaulo.html",            years: [2015] },
    { coords: [-22.9056, -47.0608], title: "Campinas — SP",       country: "Brasil",   link: "campinas.html",            years: [2022] },
    { coords: [-22.9068, -43.1729], title: "Rio de Janeiro — RJ", country: "Brasil",   link: "rio.html",                 years: [2014] },
    { coords: [-22.8831, -43.1039], title: "Niterói — RJ",        country: "Brasil",   link: "niteroi.html",             years: [2014] },
    { coords: [-23.0294, -54.1827], title: "Mundo Novo — MS",     country: "Brasil",   link: "mundonovo.html",           years: [2014] },
    { coords: [-28.9708, -49.6278], title: "Sombrio — SC",        country: "Brasil",   link: "sombrio.html",             years: [2014] },
    { coords: [-26.6373, -48.6831], title: "Barra Velha — SC",    country: "Brasil",   link: "barravelha.html",          years: [2025] },
    { coords: [-26.3237, -48.6462], title: "Penha — SC",          country: "Brasil",   link: "penha.html",               years: [2025] },
    { coords: [-26.7378, -49.1778], title: "Pomerode — SC",       country: "Brasil",   link: "pomerode.html",            years: [2025] },
    { coords: [-27.6447, -48.6680], title: "Palhoça — SC",        country: "Brasil",   link: "palhoca.html",             years: [2024] },
    { coords: [-27.5969, -48.5495], title: "Florianópolis — SC",  country: "Brasil",   link: "florianopolis.html",       years: [2024] },
    { coords: [-27.6136, -48.6365], title: "São José — SC",       country: "Brasil",   link: "saojose.html",             years: [2024] },
    { coords: [-30.0346, -51.2195], title: "Porto Alegre — RS",   country: "Brasil",   link: "portoalegre.html",         years: [2014, 2015] },
    { coords: [-15.7801, -47.9292], title: "Brasília — DF",       country: "Brasil",   link: "brasilia.html",            years: [2015] },
    { coords: [-26.0250, -48.8519], title: "Garuva — SC",         country: "Brasil",   link: "garuva.html",              years: [2025, 2026] },
    { coords: [-26.1158, -48.6112], title: "Itapoá — SC",         country: "Brasil",   link: "itapoa.html",              years: [2023] },
    { coords: [-3.1190,  -60.0217], title: "Manaus — AM",         country: "Brasil",   link: "manaus.html",              years: [2016] },
    { coords: [-25.5082, -54.6201], title: "Ciudad del Este — PY", country: "Paraguai", link: "cde.html",               years: [2019] },
    { coords: [-25.5333, -54.6061], title: "Presidente Franco — PY", country: "Paraguai", link: "presidentefranco.html", years: [2013] },
    { coords: [-25.2867, -57.6470], title: "Asunción — PY",       country: "Paraguai", link: "asuncion.html",           years: [2013] },
    { coords: [-25.5969, -54.5752], title: "Puerto Iguazú — ARG", country: "Argentina", link: "puertoiguazu.html",       years: [2023] },
    { coords: [-34.6037, -58.3816], title: "Buenos Aires — ARG",  country: "Argentina", link: "ba.html",                years: [2014] },
    { coords: [-27.3656, -55.8834], title: "Posadas — ARG",       country: "Argentina", link: "posadas.html",           years: [2014] },
    { coords: [-34.9658, -54.9369], title: "Punta del Este — UY", country: "Uruguai",  link: "puntadeleste.html",       years: [2014] },
    { coords: [-34.9011, -56.1645], title: "Montevideo — UY",     country: "Uruguai",  link: "montevideo.html",         years: [2014] },
    { coords: [-34.4622, -57.8442], title: "Colonia del Sacramento — UY", country: "Uruguai", link: "coloniadelsacramento.html", years: [2014] },
    { coords: [4.6109,  -74.0818],  title: "Bogotá — CO",         country: "Colômbia", link: "bogota.html",             years: [2015] },
    { coords: [10.4916, -66.9036],  title: "Caracas — VE",        country: "Venezuela", link: "caracas.html",           years: [2016] },
    { coords: [4.6023,  -61.1103],  title: "Sta. Elena de Uairén — VE", country: "Venezuela", link: "santaelenadeuairen.html", years: [2016] },
    { coords: [7.8019,  -72.4560],  title: "Tátira — VE",         country: "Venezuela", link: "tatira.html",            years: [2016] },
    { coords: [7.2431,  -70.7326],  title: "Guasdualito — VE",    country: "Venezuela", link: "guasdualito.html",       years: [2016] }
];

let infoBoxVisible = true;

function buildTimeline() {
    const visitsByYear = {};

    locations.forEach(location => {
        location.years.forEach(year => {
            if (!visitsByYear[year]) visitsByYear[year] = [];
            visitsByYear[year].push({ title: location.title, link: location.link });
        });
    });

    const sortedYears = Object.keys(visitsByYear).map(Number).sort((a, b) => b - a);
    const cityList = document.getElementById('cityList');

    sortedYears.forEach((year, index) => {
        const group = document.createElement('div');
        group.className = 'city-list-group';
        group.innerHTML = `<span class="city-list-group-label">${year}</span>` +
            visitsByYear[year].map(visit => `<a href="${visit.link}">${visit.title}</a>`).join('');
        cityList.appendChild(group);
        setTimeout(() => group.classList.add('visible'), 60 + index * 40);
    });
}

function animateOnScroll() {
    const cityList = document.getElementById('cityList');
    const listBottom = cityList.getBoundingClientRect().bottom;
    cityList.querySelectorAll('.city-list-group:not(.visible)').forEach(group => {
        if (group.getBoundingClientRect().top < listBottom + 20) {
            group.classList.add('visible');
        }
    });
}

function toggleInfoBox() {
    const cityList = document.getElementById('cityList');
    const toggleBtn = document.getElementById('toggleBtn');
    infoBoxVisible = !infoBoxVisible;
    cityList.style.display = infoBoxVisible ? '' : 'none';
    toggleBtn.textContent = infoBoxVisible ? '−' : '+';
}

document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map', {
        center: [-15.0, -55.0],
        zoom: 4,
        zoomControl: false,
        attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        maxZoom: 19
    }).addTo(map);

    locations.forEach(location => {
        const marker = L.marker(location.coords).addTo(map);
        marker.bindPopup(`
            <div>
                <h3>${location.title}</h3>
                <p><em>${location.country}</em></p>
                <a href="${location.link}">Ver detalhes →</a>
            </div>
        `);
    });

    const boundsGroup = new L.featureGroup(locations.map(location => L.marker(location.coords)));
    map.fitBounds(boundsGroup.getBounds().pad(0.1));

    document.getElementById('toggleBtn').addEventListener('click', toggleInfoBox);
    document.getElementById('cityList').addEventListener('scroll', animateOnScroll);

    buildTimeline();
});

function animateGroups() {
  const list = document.getElementById('cityList');
  const groups = list.querySelectorAll('.city-list-group');
  groups.forEach((g, i) => {
    setTimeout(() => g.classList.add('visible'), 60 + i * 40);
  });
  list.addEventListener('scroll', () => {
    const listBottom = list.getBoundingClientRect().bottom;
    list.querySelectorAll('.city-list-group:not(.visible)').forEach(g => {
      if (g.getBoundingClientRect().top < listBottom + 20) g.classList.add('visible');
    });
  });
}

animateGroups();