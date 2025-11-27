// Initialize map
var map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Layer group to hold markers
var markersLayer = L.layerGroup().addTo(map);

// Example hotspots
var hotspots = [
    {lat: 28.7041, lon: 77.1025, name: "Delhi"},
    {lat: 19.0760, lon: 72.8777, name: "Mumbai"},
    {lat: 12.9716, lon: 77.5946, name: "Bangalore"}
];

// Add initial markers
hotspots.forEach(h => {
    L.marker([h.lat, h.lon]).addTo(markersLayer)
        .bindPopup(h.name + " Accident Hotspot");
});

// Function to filter/search city hotspots
function filterCity() {
    let area = document.getElementById("citySearch").value.toLowerCase();

    // Clear previous markers
    markersLayer.clearLayers();

    // Filter hotspots
    let filtered = hotspots.filter(h => h.name.toLowerCase() === area);

    if(filtered.length > 0) {
        filtered.forEach(h => {
            L.marker([h.lat, h.lon]).addTo(markersLayer)
                .bindPopup(h.name + " Accident Hotspot")
                .openPopup();
            map.setView([h.lat, h.lon], 12); // Zoom to city
        });
        document.getElementById("result").innerText = filtered.length + " hotspot(s) found!";
    } else {
        document.getElementById("result").innerText = "No hotspot found in this area.";
    }
}

// Optional: retain old checkHotspot function for backward compatibility
function checkHotspot() {
    filterCity();
}
