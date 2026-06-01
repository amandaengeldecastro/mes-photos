let mapInstance;
let infoBoxVisible = true;

function buildTimeline(locations) {
    const visitsByYear = {};

    locations.forEach(location => {
        if (location.pinOnly) return;
        (location.yearMonths || []).forEach(yearMonth => {
            const parts = yearMonth.split('-');
            const year  = parseInt(parts[0]);
            const month = parseInt(parts[1]);
            if (!visitsByYear[year]) visitsByYear[year] = [];
            visitsByYear[year].push({ title: location.title, link: location.link, month });
        });
    });

    const sortedYears = Object.keys(visitsByYear).map(Number).sort((a, b) => b - a);
    const cityList    = document.getElementById('cityList');

    sortedYears.forEach((year, index) => {
        const group  = document.createElement('div');
        group.className = 'city-list-group';
        const sorted = visitsByYear[year].sort((a, b) => b.month - a.month);
        group.innerHTML = `<span class="city-list-group-label">${year}</span>` +
            sorted.map(visit => `<a href="${visit.link}">${visit.title}</a>`).join('');
        cityList.appendChild(group);
        setTimeout(() => group.classList.add('visible'), 60 + index * 40);
    });
}

function animateOnScroll() {
    const cityList   = document.getElementById('cityList');
    const listBottom = cityList.getBoundingClientRect().bottom;
    cityList.querySelectorAll('.city-list-group:not(.visible)').forEach(group => {
        if (group.getBoundingClientRect().top < listBottom + 20) {
            group.classList.add('visible');
        }
    });
}

function toggleInfoBox() {
    const infoBox   = document.getElementById('infoBox');
    const cityList  = document.getElementById('cityList');
    const toggleBtn = document.getElementById('toggleBtn');
    infoBoxVisible  = !infoBoxVisible;

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
    if (window.innerWidth > 700 || !infoBoxVisible) return;
    const infoBox = document.getElementById('infoBox');
    if (infoBox) infoBox.style.maxHeight = Math.round(window.innerHeight * 0.52) + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
    setInfoBoxHeight();
    window.addEventListener('resize', setInfoBoxHeight);

    mapInstance = L.map('map', {
        center:           [-15.0, -55.0],
        zoom:             4,
        zoomControl:      false,
        attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        maxZoom:     19,
    }).addTo(mapInstance);

    document.getElementById('toggleBtn').addEventListener('click', toggleInfoBox);
    document.getElementById('cityList').addEventListener('scroll', animateOnScroll);
});

document.addEventListener('userLoggedIn', () => {
    db.collection('cities').get().then(snapshot => {
        const locations = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                coords:     data.coords,
                title:      data.name,
                country:    data.country,
                link:       `city.html?cidade=${data.slug}`,
                yearMonths: data.yearMonths || [],
                pinOnly:    data.pinOnly || false,
            };
        });

        locations.forEach(location => {
            L.marker(location.coords).addTo(mapInstance).bindPopup(`
                <div>
                    <h3>${location.title}</h3>
                    <p><em>${location.country}</em></p>
                    <a href="${location.link}">Ver detalhes →</a>
                </div>
            `);
        });

        if (locations.length > 0) {
            const boundsGroup = new L.featureGroup(
                locations.map(location => L.marker(location.coords))
            );
            mapInstance.fitBounds(boundsGroup.getBounds().pad(0.1));
        }

        buildTimeline(locations);
    }).catch(err => {
        console.error('Erro ao carregar cidades:', err);
    });
});
