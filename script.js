// Initialize map
var map = L.map('map').setView([20.5937, 78.9629], 5); // India

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Example hotspots
var hotspots = [
    {lat: 28.7041, lon: 77.1025, name: "Delhi"},
    {lat: 19.0760, lon: 72.8777, name: "Mumbai"},
    {lat: 12.9716, lon: 77.5946, name: "Bangalore"}
];

// Add markers
hotspots.forEach(h => {
    L.marker([h.lat, h.lon]).addTo(map)
        .bindPopup(h.name + " Accident Hotspot");
});

// Check if area is a hotspot
function checkHotspot() {
    let area = document.getElementById("area").value.toLowerCase();
    let result = hotspots.find(h => h.name.toLowerCase() === area);
    document.getElementById("result").innerText = result ? `${result.name} is a hotspot!` : "No hotspot found in this area.";
}
