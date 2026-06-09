export const getMapHTML = (lat: number, lng: number): string => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body, #map { width: 100%; height: 100%; }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var map = L.map('map').setView([${lat}, ${lng}], 16);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            var userIcon = L.divIcon({
                className: '',
                html: '<div style="width:16px;height:16px;border-radius:50%;background:#2196F3;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,0.4);"></div>',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
            });
            L.marker([${lat}, ${lng}], { icon: userIcon })
                .addTo(map)
                .bindPopup('Você está aqui');

            var reportMarkers = [];

            function updateMarkers(markers) {
                reportMarkers.forEach(function(m) { map.removeLayer(m); });
                reportMarkers = [];

                markers.forEach(function(m) {
                    var icon = L.divIcon({
                        className: '',
                        html: '<div style="width:14px;height:14px;border-radius:50%;background:' + m.color + ';border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>',
                        iconSize: [14, 14],
                        iconAnchor: [7, 7],
                    });
                    var marker = L.marker([m.lat, m.lng], { icon: icon })
                        .addTo(map)
                        .bindPopup('<b>' + m.title + '</b><br>' + m.description);
                    reportMarkers.push(marker);
                });
            }
        </script>
    </body>
    </html>
`;