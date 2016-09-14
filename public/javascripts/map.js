/***
 * 
 * 
 * DANI::: usar watchPosition en vez de geoposition
 * https://developer.mozilla.org/es/docs/WebAPI/Using_geolocation
 * 
 */

var map;
var markers = [];



function initMap(position) {

    // console.log('Your current position is:');
    // console.log('Latitude : ' + crd.latitude);
    // console.log('Longitude: ' + crd.longitude);
    // console.log('More or less ' + crd.accuracy + ' meters.');

    lng = position.coords.longitude;
    lat = position.coords.latitude;

    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;
    nickname = document.getElementById("nickname").value;

    var myCenter = new google.maps.LatLng(lat, lng);


    var mapOptions = {
        center: myCenter,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.roadmap
    };

    //Nos añadimos como un MARKER más
    addMarker(nickname, lat, lng, map);

//
//  map = new google.maps.Map(document.getElementById("map"), mapOptions);
//  var marker = new google.maps.Marker({
//    draggable: true,
//    position: myCenter
//  });
//
//  //Solo para simular movimiento
//  google.maps.event.addListener(marker, 'dragend', function (event) {
//    document.getElementById('lat').value = event.latLng.lat();
//    document.getElementById('long').value = event.latLng.lng();
//  });
//
//  marker.setMap(map);

    emitimosPosicion();

}

function emitimosPosicion() {
    //Emitimos nuestra posicion
//  var positionMsg = {
//    nickname: nickname,
//    roomid: roomid,
//    lat: document.getElementById("lat").value,
//    long: document.getElementById("long").value
//  }
    lat = document.getElementById("lat").value;
    lng = document.getElementById("lng").value;
    console.log("emitimos nueva posicion: " + lat + "," + lng);
    socket.emit('update-position', lat, lng);
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


// Adds a marker to the map.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
function addMarker(nickname, lat, lng, map) {
//    if (!lat)
//        return false;
    var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        // label: element.nickname.charAt(0).toUpperCase(),
        label: labels[labelIndex++ % labels.length],
        title: nickname,
        // icon: pinSymbol(element.color),
        map: map
    });
    //Lo añadimos a los makers
    markers.push(marker); //Tenemos que IDENTIFICARLO !!

    marker.setMap(map);

    google.maps.event.addListener(marker, 'dragend', function (event) {
        document.getElementById('lat').value = event.latLng.lat();
        document.getElementById('lng').value = event.latLng.lng();
    });
}
function actualizarMapa() {

    console.info(markers);
    //Borramos el MARKER
    //Lo añadimos al mapa en la nueva posicion

    // var bounds = new google.maps.LatLngBounds();

}

//function OLD_actualizarMapa(data) {
//
//    console.info(markers);
//    // var bounds = new google.maps.LatLngBounds();
//    deleteMarkers();
//
//    console.log("actualizarMapa");
//    console.log(data);
//    // for (var element in data) {
//    data.map(function (element, index) {
//        // element.lat=parseFloat(element.lat);
//        // element.long=parseFloat(element.long);
//        // console.log(element);
//        addMarker(element, map);
//        // bounds.extend(new google.maps.LatLng(element.lat, element.long));
//    });
//    // deleteMarkers();
//
//    // map.fitBounds(bounds);
//}
//;



// google.maps.event.addDomListener(window, 'reload', initMap);