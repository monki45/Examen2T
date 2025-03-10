document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([36.7213, -4.4216], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const museumList = document.getElementById('museumList');
            data.features.forEach(feature => {
                const { coordinates } = feature.geometry;
                const properties = feature.properties;

                const marker = L.marker([coordinates[1], coordinates[0]], {
                    icon: L.icon({
                        iconUrl: '/images/museum.png',
                        iconSize: [30, 30]
                    })
                }).addTo(map);

                marker.on('click', () => showInfo(properties, map, [coordinates[1], coordinates[0]]));

                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.textContent = properties.Nombre;
                listItem.onclick = () => showInfo(properties, map, [coordinates[1], coordinates[0]]);

                museumList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    function showInfo(properties, map, coords) {
        map.setView(coords, 16);

        const infoHtml = Object.entries(properties)
            .map(([key, value]) => `<strong>${key}:</strong> ${value || 'No disponible'}`)
            .join('<br>');

        Swal.fire({
            title: properties.Nombre || 'Información del Punto',
            html: infoHtml,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    }
});
