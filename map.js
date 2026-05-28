const locations = [
    { coords: [-25.5478, -54.5882], title: "Foz do Iguaçu — PR",           country: "Brasil",    link: "fozdoiguacu.html",          years: [[2023,12],[2022,11],[2021,12],[2020,8],[2019,12],[2018,7],[2017,12],[2015,6],[2014,6],[2007,1],[2006,2],[2005,7]], pinOnly: true },
    { coords: [-25.4284, -49.2733], title: "Curitiba — PR",                 country: "Brasil",    link: "curitiba.html",             years: [[2026,5],[2025,10],[2024,9],[2019,10]] },
    { coords: [-24.9969, -54.3049], title: "Itaipulândia — PR",             country: "Brasil",    link: "itaipulandia.html",         years: [[2019,7]] },
    { coords: [-25.8231, -48.5221], title: "Matinhos — PR",                 country: "Brasil",    link: "matinhos.html",             years: [[2025,6]] },
    { coords: [-25.4420, -49.0628], title: "Piraquara — PR",                country: "Brasil",    link: "piraquara.html",            years: [[2025,10]] },
    { coords: [-25.5272, -49.1922], title: "São José dos Pinhais — PR",     country: "Brasil",    link: "saojosedospinhais.html",    years: [[2026,4],[2025,9]] },
    { coords: [-25.5730, -48.5044], title: "Pontal do Paraná — PR",         country: "Brasil",    link: "pontal.html",               years: [[2026,1],[2025,4]] },
    { coords: [-25.8833, -48.5753], title: "Guaratuba — PR",                country: "Brasil",    link: "guaratuba.html",            years: [[2026,1],[2025,11],[2018,12],[2017,5]] },
    { coords: [-25.2994, -49.1829], title: "Colombo — PR",                  country: "Brasil",    link: "colombo.html",              years: [[2024,9]] },
    { coords: [-25.4292, -50.0058], title: "Palmeira — PR",                 country: "Brasil",    link: "palmeira.html",             years: [[2024,8]] },
    { coords: [-25.4286, -48.7094], title: "Antonina — PR",                 country: "Brasil",    link: "antonina.html",             years: [[2024,6]] },
    { coords: [-25.4472, -54.3872], title: "Sta. Terezinha de Itaipu — PR", country: "Brasil",    link: "terezinha.html",            years: [[2023,5],[2018,10]] },
    { coords: [-25.4736, -48.8314], title: "Morretes — PR",                 country: "Brasil",    link: "morretes.html",             years: [[2024,6]] },
    { coords: [-25.3292, -49.1288], title: "Almirante Tamandaré — PR",      country: "Brasil",    link: "almirantetamandare.html",   years: [[2025,11]] },
    { coords: [-25.5931, -49.4128], title: "Araucária — PR",                country: "Brasil",    link: "araucaria.html",            years: [[2026,3]] },
    { coords: [-29.0476, -50.1431], title: "Cambará do Sul — RS",           country: "Brasil",    link: "cambara.html",              years: [[2014,1]] },
    { coords: [-29.3333, -49.7333], title: "Torres — RS",                   country: "Brasil",    link: "torres.html",               years: [[2013,12]] },
    { coords: [-12.9711, -38.5108], title: "Salvador — BA",                 country: "Brasil",    link: "salvador.html",             years: [[2015,9]] },
    { coords: [-24.7080, -47.5553], title: "Iguape — SP",                   country: "Brasil",    link: "iguape.html",               years: [[2015,2]] },
    { coords: [-23.5505, -46.6333], title: "São Paulo — SP",                country: "Brasil",    link: "saopaulo.html",             years: [[2015,2]] },
    { coords: [-22.9056, -47.0608], title: "Campinas — SP",                 country: "Brasil",    link: "campinas.html",             years: [[2022,12]] },
    { coords: [-22.9068, -43.1729], title: "Rio de Janeiro — RJ",           country: "Brasil",    link: "rio.html",                  years: [[2014,5]] },
    { coords: [-22.8831, -43.1039], title: "Niterói — RJ",                  country: "Brasil",    link: "niteroi.html",              years: [[2014,5]] },
    { coords: [-23.0294, -54.1827], title: "Mundo Novo — MS",               country: "Brasil",    link: "mundonovo.html",            years: [[2014,1]] },
    { coords: [-28.9708, -49.6278], title: "Sombrio — SC",                  country: "Brasil",    link: "sombrio.html",              years: [[2014,1]] },
    { coords: [-26.6373, -48.6831], title: "Barra Velha — SC",              country: "Brasil",    link: "barravelha.html",           years: [[2025,7]] },
    { coords: [-27.1397, -48.5100], title: "Bombas — SC",                   country: "Brasil",    link: "bombas.html",               years: [[2010,1]] },
    { coords: [-26.3237, -48.6462], title: "Penha — SC",                    country: "Brasil",    link: "penha.html",                years: [[2025,3]] },
    { coords: [-26.7378, -49.1778], title: "Pomerode — SC",                 country: "Brasil",    link: "pomerode.html",             years: [[2025,3]] },
    { coords: [-27.6447, -48.6680], title: "Palhoça — SC",                  country: "Brasil",    link: "palhoca.html",              years: [[2024,4]] },
    { coords: [-27.5969, -48.5495], title: "Florianópolis — SC",            country: "Brasil",    link: "florianopolis.html",        years: [[2024,4]] },
    { coords: [-27.6136, -48.6365], title: "São José — SC",                 country: "Brasil",    link: "saojose.html",              years: [[2024,4]] },
    { coords: [-30.0346, -51.2195], title: "Porto Alegre — RS",             country: "Brasil",    link: "portoalegre.html",          years: [[2014,12]] },
    { coords: [-15.7801, -47.9292], title: "Brasília — DF",                 country: "Brasil",    link: "brasilia.html",             years: [[2015,9]] },
    { coords: [-26.0250, -48.8519], title: "Garuva — SC",                   country: "Brasil",    link: "garuva.html",               years: [[2026,5],[2025,9]] },
    { coords: [-26.1158, -48.6112], title: "Itapoá — SC",                   country: "Brasil",    link: "itapoa.html",               years: [[2023,7], [2010,1]] },
    { coords: [-3.1190,  -60.0217], title: "Manaus — AM",                   country: "Brasil",    link: "manaus.html",               years: [[2016,1]] },
    { coords: [-25.5082, -54.6201], title: "Ciudad del Este — PY",          country: "Paraguai",  link: "cde.html",                  years: [[2023,10],[2019,7]] },
    { coords: [-25.5333, -54.6061], title: "Presidente Franco — PY",        country: "Paraguai",  link: "presidentefranco.html",     years: [[2018,6],[2013,12]] },
    { coords: [-25.2867, -57.6470], title: "Asunción — PY",                 country: "Paraguai",  link: "asuncion.html",             years: [[2013,10]] },
    { coords: [-25.5969, -54.5752], title: "Puerto Iguazú — ARG",           country: "Argentina", link: "puertoiguazu.html",         years: [[2023,10], [2015, 6]] },
    { coords: [-34.6037, -58.3816], title: "Buenos Aires — ARG",            country: "Argentina", link: "ba.html",                   years: [[2014,12]] },
    { coords: [-27.3656, -55.8834], title: "Posadas — ARG",                 country: "Argentina", link: "posadas.html",              years: [[2014,9]] },
    { coords: [-34.9658, -54.9369], title: "Punta del Este — UY",           country: "Uruguai",   link: "puntadeleste.html",         years: [[2014,12]] },
    { coords: [-34.9011, -56.1645], title: "Montevideo — UY",               country: "Uruguai",   link: "montevideo.html",           years: [[2014,12]] },
    { coords: [-34.4622, -57.8442], title: "Colonia del Sacramento — UY",   country: "Uruguai",   link: "coloniadelsacramento.html", years: [[2014,12]] },
    { coords: [4.6109,  -74.0818],  title: "Bogotá — CO",                   country: "Colômbia",  link: "bogota.html",               years: [[2015,12]] },
    { coords: [10.4916, -66.9036],  title: "Caracas — VE",                  country: "Venezuela", link: "caracas.html",              years: [[2016,1]] },
    { coords: [4.6023,  -61.1103],  title: "Sta. Elena de Uairén — VE",     country: "Venezuela", link: "santaelenadeuairen.html",   years: [[2016,1]] },
    { coords: [7.8019,  -72.4560],  title: "Tátira — VE",                   country: "Venezuela", link: "tatira.html",               years: [[2016,1]] },
    { coords: [7.2431,  -70.7326],  title: "Guasdualito — VE",              country: "Venezuela", link: "guasdualito.html",          years: [[2016,1]] },
];

let infoBoxVisible = true;

function buildTimeline() {
    const visitsByYear = {};

    locations.forEach(location => {
        if (location.pinOnly) return;
        location.years.forEach(([year, month]) => {
            if (!visitsByYear[year]) visitsByYear[year] = [];
            visitsByYear[year].push({ title: location.title, link: location.link, month });
        });
    });

    const sortedYears = Object.keys(visitsByYear).map(Number).sort((a, b) => b - a);
    const cityList = document.getElementById('cityList');

    sortedYears.forEach((year, index) => {
        const group = document.createElement('div');
        group.className = 'city-list-group';
        const sorted = visitsByYear[year].sort((a, b) => b.month - a.month);
        group.innerHTML = `<span class="city-list-group-label">${year}</span>` +
            sorted.map(visit => `<a href="${visit.link}">${visit.title}</a>`).join('');
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
    const infoBox = document.getElementById('infoBox');
    const cityList = document.getElementById('cityList');
    const toggleBtn = document.getElementById('toggleBtn');
    infoBoxVisible = !infoBoxVisible;

    if (window.innerWidth <= 700) {
        if (infoBoxVisible) {
            cityList.style.display = '';
            setInfoBoxHeight();
        } else {
            infoBox.style.maxHeight = document.querySelector('.info-box-header').offsetHeight + 'px';
        }
    } else {
        cityList.style.display = infoBoxVisible ? '' : 'none';
    }

    toggleBtn.textContent = infoBoxVisible ? '−' : '+';
}

function setInfoBoxHeight() {
    if (window.innerWidth > 700) return;
    const infoBox = document.getElementById('infoBox');
    if (infoBox) infoBox.style.maxHeight = Math.round(window.innerHeight * 0.52) + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
    setInfoBoxHeight();
    window.addEventListener('resize', setInfoBoxHeight);

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
