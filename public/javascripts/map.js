/***
 * 
 * 
 * DANI::: usar watchPosition en vez de geoposition
 * https://developer.mozilla.org/es/docs/WebAPI/Using_geolocation
 * 
 */

var map;
var lat, lng;
var color;
var markers = {};

function initMap(lat,lng) {
//    nickname = document.getElementById("nickname").value;
    var myCenter = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        center: myCenter,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.roadmap
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
}


function emitimosPosicion(lat, lng) {
    if (lat == "")
        lat = document.getElementById("lat").value;
    if (lng == "")
        lng = document.getElementById("lng").value;
//    console.log("emitimos nueva posicion: " + lat + "," + lng);
    socket.emit('update-position', lat, lng);
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;
}


// Adds a marker to the map.
function addMarker(nickname, lat, lng, color, map) {
//    if (!lat)
//        return false;

    var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
         label: nickname.charAt(0).toUpperCase(),
        title: nickname,
        icon: pinSymbol(color),
        map: map
    });
    
    console.log("Add_marker: " + nickname + ". lang: " + lat + ", lng: " + lng);
//    console.log(marker);
    google.maps.event.addListener(marker, 'dragend', function (event) {
        document.getElementById('lat').value = event.latLng.lat();
        document.getElementById('lng').value = event.latLng.lng();
    });
    
    marker.setMap(map);

    markers.nickname = {nickname: nickname, lat: lat, lng: lng, color: color};
}


function actualizarMarker(nickname, lat, lng, color) {

//    console.log("messages-cli: " + nickname + ". lang: " + lat + ", lng: " + lng + ", color: " + color);
//    console.info(markers);
//    console.info(markers[nickname]);
    //Borramos el MARKER
//    markers[nickname] = {};
//    delete markers.nickname;
    markers.nickname = undefined;
    //Lo añadimos al mapa
    addMarker(nickname, parseFloat(lat), parseFloat(lng), color, map);
    //Lo añadimos al mapa en la nueva posicion

    // var bounds = new google.maps.LatLngBounds();

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

//http://stackoverflow.com/questions/7095574/google-maps-api-3-custom-marker-color-for-default-dot-marker

//http://maps.google.com/mapfiles/ms/icons/blue.png
function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1
    };
}
//var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
//        new google.maps.Size(21, 34),
//        new google.maps.Point(0, 0),
//        new google.maps.Point(10, 34)); 
//
//http://maps.google.com/mapfiles/ms/icons/green-dot.png
//