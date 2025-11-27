// Initialize map
var map = L.map('map').setView([22.9734, 78.6569], 5);

// Add tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Layer groups
var districtLayer, cityLayer = L.layerGroup().addTo(map);

// Audio for alert
var alertSound = new Audio('https://www.soundjay.com/buttons/sounds/beep-07.mp3');

// Accident data with previous year
var accidentData = {
    "Bhopal": {current:1200, previous:1000, state:"Madhya Pradesh"},
    "Indore": {current:1500, previous:1400, state:"Madhya Pradesh"},
    "Delhi": {current:2000, previous:1800, state:"Delhi"},
    "Mumbai": {current:2200, previous:2100, state:"Maharashtra"},
    "Pune": {current:1500, previous:1300, state:"Maharashtra"},
    "Bangalore": {current:1700, previous:1600, state:"Karnataka"},
    "Chennai": {current:1600, previous:1500, state:"Tamil Nadu"}
    // Add more districts/cities as needed
};

// City-level data
var cityData = [
    {name:"Bhopal City", lat:23.2599, lon:77.4126, district:"Bhopal"},
    {name:"Indore City", lat:22.7196, lon:75.8577, district:"Indore"},
    {name:"Delhi City", lat:28.7041, lon:77.1025, district:"Delhi"},
    {name:"Mumbai City", lat:19.0760, lon:72.8777, district:"Mumbai"},
    {name:"Pune City", lat:18.5204, lon:73.8567, district:"Pune"},
    {name:"Bangalore City", lat:12.9716, lon:77.5946, district:"Bangalore"},
    {name:"Chennai City", lat:13.0827, lon:80.2707, district:"Chennai"}
];

// Load GeoJSON districts
fetch('india_districts.geojson')
.then(res => res.json())
.then(geojson => {
    districtLayer = L.geoJson(geojson, {
        style: { color:"#555", weight:1, fillOpacity:0.2 },
        onEachFeature: function(feature, layer){
            layer.on('mouseover', function(){
                layer.setStyle({weight:3, color:'yellow', fillOpacity:0.3});
            });
            layer.on('mouseout', function(){
                layer.setStyle({weight:1, color:'#555', fillOpacity:0.2});
            });
            layer.on('click', function(){
                var district = feature.properties.DISTRICT || feature.properties.NAME;
                showDistrictData(district);
            });
        }
    }).addTo(map);
});

// Show district + cities + alert for max % change
function showDistrictData(district){
    cityLayer.clearLayers();

    var maxChange = {district:"", percent:-Infinity, data:null};

    districtLayer.eachLayer(function(layer){
        var d = layer.feature.properties.DISTRICT || layer.feature.properties.NAME;
        var data = accidentData[d] || {current:0, previous:0};
        var percentChange = data.previous > 0 ? ((data.current - data.previous)/data.previous*100).toFixed(2) : 0;

        if(parseFloat(percentChange) > maxChange.percent){
            maxChange = {district:d, percent:parseFloat(percentChange), data:data};
        }

        if(d === district){
            cityData.forEach(city => {
                if(city.district === district){
                    L.marker([city.lat, city.lon]).addTo(cityLayer)
                        .bindPopup(city.name + "<br>Accidents: " + data.current +
                                   "<br>Previous: " + data.previous +
                                   "<br>% Change: " + percentChange + "%");
                }
            });
        }
    });

    // Alert with sound
    alertSound.play();
    alert("District with MAX accident % change:\n" + maxChange.district +
          "\nAccidents: " + maxChange.data.current +
          "\nPrevious: " + maxChange.data.previous +
          "\n% Change: " + maxChange.percent + "%");
}

// State selection → highlight districts
function selectState(stateName){
    districtLayer.eachLayer(function(layer){
        if(layer.feature.properties.STATE === stateName){
            layer.setStyle({fillOpacity:0.5, color:'blue'});
        } else {
            layer.setStyle({fillOpacity:0.2, color:'#555'});
        }
    });
}

// Search city/district
function filterCity(){
    let area = document.getElementById("citySearch").value.trim();
    var found = false;

    // Check in city data
    cityData.forEach(city => {
        if(city.name.toLowerCase() === area.toLowerCase()){
            map.setView([city.lat, city.lon], 12);
            found = true;
        }
    });

    // Check in district data
    districtLayer.eachLayer(function(layer){
        var district = layer.feature.properties.DISTRICT || layer.feature.properties.NAME;
        if(district.toLowerCase() === area.toLowerCase()){
            showDistrictData(district);
            map.fitBounds(layer.getBounds());
            found = true;
        }
    });

    var result = document.getElementById("result");
    result.innerText = found ? "Showing " + area : "City/District not found in data.";
}
