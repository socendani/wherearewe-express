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
  var crd = position.coords;

  // console.log('Your current position is:');
  // console.log('Latitude : ' + crd.latitude);
  // console.log('Longitude: ' + crd.longitude);
  // console.log('More or less ' + crd.accuracy + ' meters.');

  long = position.coords.longitude;
  lat = position.coords.latitude;

  document.getElementById("lat").value = lat;
  document.getElementById("long").value = long;

  var myCenter = new google.maps.LatLng(lat, long);


  var mapOptions = {
    center: myCenter,
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.roadmap
  };


  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var marker = new google.maps.Marker({
    draggable: true,
    position: myCenter
  });

  //Solo para simular movimiento
  google.maps.event.addListener(marker, 'dragend', function (event) {
    document.getElementById('lat').value = event.latLng.lat();
    document.getElementById('long').value = event.latLng.lng();
  });

  marker.setMap(map);

  emitimosPosicion();

}

function emitimosPosicion() {
  //Emitimos nuestra posicion
  var positionMsg = {
    nickname: nickname,
    roomid: roomid,
    lat: document.getElementById("lat").value,
    long: document.getElementById("long").value
  }
  console.log("emitimos nueva posicion: ");
  socket.emit('update-position', positionMsg);
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
function addMarker(element, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  // var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // var labelIndex = 0;
  var marker = new google.maps.Marker({
    position: { lat: element.lat, lng: element.long },
    label: element.nickname.charAt(0).toUpperCase(),
    title: element.nickname,
    // icon: pinSymbol(element.color),
    map: map
  });
  markers.push(marker);
}


function actualizarMapa(data) {
  // var bounds = new google.maps.LatLngBounds();
  deleteMarkers();

  data.map(function (element, index) {
    console.log(element);
    addMarker(element, map);
    // bounds.extend(new google.maps.LatLng(element.lat, element.long));
  });
  // deleteMarkers();

  // map.fitBounds(bounds);
};



// google.maps.event.addDomListener(window, 'reload', initMap);