/***
 * 
 * 
 * DANI::: usar watchPosition en vez de geoposition
 * https://developer.mozilla.org/es/docs/WebAPI/Using_geolocation
 * 
 */

var dmr_servidor = "http://localhost:3000";
var map;
lat = "KKKK";

// function init() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(initMap, initShowError); //(success, error, options)
//   } else {
//     alert("Este navegador no soporta geolocalizacion.");
//   }
// }

function init() {
  var options = null;
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (navigator.geolocation) {
    if (isChrome) //set this var looking for Chrome un user-agent header
      options = { enableHighAccuracy: false, maximumAge: 15000, timeout: 30000 };
    else
      options = { maximumAge: Infinity, timeout: 0 };
    navigator.geolocation.getCurrentPosition(initMap, initShowError, options);
  }
}




function initShowError(error) {
  // alerta.style.display = "block"
  var msg;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = "Has negado usar tu localizacion.";
      break;
    case error.POSITION_UNAVAILABLE:
      msg = "La informacion de localizacion no esta disponible. Prueba actualizando tu Navegador :/";
      break;
    case error.TIMEOUT:
      msg = "La solicitud para obtener tu localizacion tardo demasiado.";
      break;
    case error.UNKNOWN_ERROR:
      msg = "Ocurrio un error desconocido.";
      break;
  }
  alert(msg);
  // par.innerHTML = msg;
}


/***
 * 
 */



function initMapXXX() {
  return false;
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 45.397, lng: 2.9 },
    zoom: 8
  });
}



function initMap(position) {
  var crd = position.coords;

  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  console.log('More or less ' + crd.accuracy + ' meters.');

  lon = position.coords.longitude;
  lat = position.coords.latitude;
  var myCenter = new google.maps.LatLng(lat, lon);


  var mapOptions = {
    center: myCenter,
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.roadmap
  };


  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var marker = new google.maps.Marker({
    position: myCenter,
    animation: google.maps.Animation.BOUNCE
  });

  marker.setMap(map);

}
// google.maps.event.addDomListener(window, 'reload', initMap);