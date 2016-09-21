var map;
var lat, lng;
var color;
var markers = [];
function initMap(lat, lng) {
//    nickname = document.getElementById("nickname").value;
    var myCenter = new google.maps.LatLng(lat, lng);
    var mapOptions = {
        center: myCenter,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.roadmap
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    addMarker(nickname, lat, lng, color, map);
}





function emitimosPosicion(lat, lng) {
    if (lat == null)
        lat = document.getElementById("lat").value;
    if (lng == null)
        lng = document.getElementById("lng").value;
    console.log("emitimos nueva posicion: " + lat + "," + lng);
    socket.emit('update-position', lat, lng);
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;
}


// Adds a marker to the map.
function addMarker(nickname, lat, lng, color, map) {
    if (!lat)
        return false;
    console.log("Add_marker: " + nickname + ". lang: " + lat + ", lng: " + lng);
    if (document.getElementById("nickname").value == nickname) {
        is_me = true;
    } else {
        is_me = false;
    }
    var infowindow = new google.maps.InfoWindow({
          content: "<b></b>"+nickname+"<br><b>Lat: </b>"+lat+"<br><b>Long: </b>"+lng+"<br>"
        });
    var marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        label: nickname.charAt(0).toUpperCase(),
        title: nickname,
//        draggable: true,
        icon: pinSymbol(color, is_me),
        map: map
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });
    //Personalizate atributes
    marker.nickname = nickname;
    marker.id = nickname;
    marker.color = color;

//    console.log(marker);
//    google.maps.event.addListener(marker, 'dragend', function (event) {
//        document.getElementById('lat').value = event.latLng.lat();
//        document.getElementById('lng').value = event.latLng.lng();
//        actualizarMapa(nickname, event.latLng.lat(), event.latLng.lng(), color);
//    });
    //Marker al MAPA
    marker.setMap(map);
//    markers.push({nickname: nickname, lat: lat, lng: lng, color: color});
    //maker al ARRAY
    markers.push(marker);
}

function encuadrarMapa() {
    var bounds = new google.maps.LatLngBounds();
    for (var i in markers) {
        bounds.extend(markers[i].getPosition());
    }
    map.setCenter(bounds.getCenter()); //or use custom center
    map.fitBounds(bounds);
    if (map.getZoom() > 15) {
        map.setZoom(15);
    }
}

function deleteMarker(index, callback) {
//    console.log(JSON.stringify(markers[index]));

//    var tempArray = markers; // Create a temporary array
    for (var i = 0; i < markers.length; i++) {
//        console.log(markers[i].id);
        markers[i].setMap(null);
        if (index == markers[i].id) {
//            console.log("Eliminando: " + i + "(" + markers[i].id + ")");
            markers.splice(i, 1);
        }
    }

    //Callback function WITH paràmetres!
    callback(nickname, parseFloat(lat), parseFloat(lng), color, map);
}

function actualizarMapa(nickname, lat, lng, color) {
    deleteMarker(nickname, function () {
        addMarker(nickname, parseFloat(lat), parseFloat(lng), color, map);
    });

}


function zzZ_actualizarMarker(nickname, lat, lng, color) {

//    console.log("messages-cli: " + nickname + ". lang: " + lat + ", lng: " + lng + ", color: " + color);
//    console.info("11111111");
//    console.info(markers[nickname]);
//Lo eliminamos del mapa
//    if (markers[nickname] !== undefined) {
//        markers.nickname.setMap(null);
    deleteMarker(nickname, function () {
        addMarker(nickname, parseFloat(lat), parseFloat(lng), color, map);
    });
//    }
//Borramos el MARKER
//    markers[nickname] = {};
//    markers[nickname] = undefined;
//    delete markers[nickname];
//Lo añadimos al mapa


//    console.info("2222222");
//    console.info(markers[nickname]);


//Lo añadimos al mapa en la nueva posicion
//    addMarker(nickname, parseFloat(lat), parseFloat(lng), color, map);

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
function pinSymbol(color, is_me) {
    if (is_me) {
        return {
//        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 3,
            scale: 10
        };
    } else {
        return {
//        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 10
        };
    }
}

//var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
//        new google.maps.Size(21, 34),
//        new google.maps.Point(0, 0),
//        new google.maps.Point(10, 34)); 
//
//http://maps.google.com/mapfiles/ms/icons/green-dot.png
//

function array_values(input) {
// Return just the values from the input array  
    var tmp_arr = [],
            key = '';
    for (key in input) {
        tmp_arr[tmp_arr.length] = input[key];
    }

    return tmp_arr;
}