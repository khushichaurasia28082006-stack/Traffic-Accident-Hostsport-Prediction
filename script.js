// Initialize map
var map = L.map('map').setView([22.9734, 78.6569], 5);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Layers
var districtLayer, cityLayer = L.layerGroup().addTo(map);

// Audio for alert
var alertSound = new Audio('https://www.soundjay.com/buttons/sounds/beep-07.mp3');

// Accident data
var accidentData = {
    "Bhopal": {current:1200, previous:1000, state:"Madhya Pradesh"},
    "Indore": {current:1500, previous:1400, state:"Madhya Pradesh"},
    "Chhatarpur": {current:800, previous:600, state:"Madhya Pradesh"},
    "Delhi": {current:2000, previous:1800, state:"Delhi"},
    "Mumbai": {current:2200, previous:2100, state:"Maharashtra"},
    "Pune": {current:1500, previous:1300, state:"Maharashtra"},
    "Bangalore": {current:1700, previous:1600, state:"Karnataka"},
    "Chennai": {current:1600, previous:1500, state:"Tamil Nadu"}
};

// City data
var cityData = [
    {name:"Bhopal City", lat:23.2599, lon:77.4126, district:"Bhopal"},
    {name:"Indore City", lat:22.7196, lon:75.8577, district:"Indore"},
    {name:"Chhatarpur City", lat:24.5897, lon:79.5822, district:"Chhatarpur"},
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

// Show district + cities + max % change alert
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

    // Alert with beep
    alertSound.play();
    alert("District with MAX accident % change:\n" + maxChange.district +
          "\nAccidents: " + maxChange.data.current +
          "\nPrevious: " + maxChange.data.previous +
          "\n% Change: " + maxChange.percent + "%");
}

// State selection
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
    let area = document.getElementById("citySearch").value.trim().toLowerCase();
    var found = false;
    cityLayer.clearLayers();

    // Search cities
    cityData.forEach(city => {
        if(city.name.toLowerCase().includes(area) || city.district.toLowerCase().includes(area)){
            L.marker([city.lat, city.lon]).addTo(cityLayer)
                .bindPopup(city.name + " (" + city.district + ")<br>" +
                           "Accidents: " + (accidentData[city.district]?.current || 0) +
                           "<br>Previous: " + (accidentData[city.district]?.previous || 0))
                .openPopup();
            map.setView([city.lat, city.lon], 12);
            found = true;

            // Trigger alert for this city
            triggerAlert(city.district);
        }
    });

    // Search districts
    districtLayer.eachLayer(function(layer){
        var district = (layer.feature.properties.DISTRICT || layer.feature.properties.NAME).toLowerCase();
        if(district.includes(area)){
            showDistrictData(layer.feature.properties.DISTRICT || layer.feature.properties.NAME);
            map.fitBounds(layer.getBounds());
            found = true;
        }
    });

    var result = document.getElementById("result");
    result.innerText = found ? "Showing results for '" + area + "'" : "City/District not found in data.";
}

// Trigger alert function
function triggerAlert(area){
    area = area.toLowerCase();
    if(accidentData[area]){
        let data = accidentData[area];
        let percentChange = data.previous > 0 ? ((data.current - data.previous)/data.previous*100).toFixed(2) : 0;
        alertSound.play();
        alert("⚠ HIGH ACCIDENT RISK AREA: " + area.charAt(0).toUpperCase() + area.slice(1) +
              "\nAccidents: " + data.current +
              "\nPrevious: " + data.previous +
              "\n% Change: " + percentChange + "%");
    }
}
