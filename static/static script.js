var map = L.map('map').setView([20.5937, 78.9629], 5);

// Add OpenStreetMap layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Click event → send lat/lon to backend
map.on('click', async function(e) {
    let lat = e.latlng.lat;
    let lon = e.latlng.lng;

    let response = await fetch("/predict", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({lat: lat, lon: lon})
    });

    let data = await response.json();

    L.marker([lat, lon]).addTo(map)
        .bindPopup("Risk Level: " + data.risk_level)
        .openPopup();
});
