var map = L.map('map')
map.setView([35.5, -0.09], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// If position is found, define a circle (success method), else throw the error method
let marker, circle, zoomed, ISS;

function success(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    if (marker) {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat, lng]).addTo(map);
    circle = L.circle([lat, lng], {radius: accuracy}).addTo(map);

    
}

function error(err) {
    if (err.code === 1) {
        alert("Please allow geolocation access.");
    } else {
        alert("Unable to retrieve current location.")
    }
}

var greenIcon = L.icon({
    iconUrl: 'issmodel.png',

    iconSize:     [100, 100], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    
});


function moveISS () {
    $.getJSON('http://api.open-notify.org/iss-now.json?callback=?', function(data) {
        var lat = data['iss_position']['latitude'];
        var lon = data['iss_position']['longitude'];

        if (ISS){
         map.removeLayer(ISS);
        }
        ISS = L.marker([lat, lon], {icon: greenIcon}).addTo(map);
       // ISS_Circle = L.circle([lat, lon], {radius: accuracy}).addTo(map);

        //if (!zoomed) {
         //   zoomed = map.fitBounds(ISS_Circle.getBounds());
        //}
    });

    setTimeout(moveISS, 5000); 
}

navigator.geolocation.watchPosition(success, error);
moveISS();