/***
 * 
 * 
 * 
 */

function init() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initMap, initShowError);
  } else {
    alert("Este navegador no soporta geolocalizacion.");
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

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.397, lng: 2.9},
    zoom: 8
  });
}



function initMapXXX(position) {
  lon = position.coords.longitude;
  lat = position.coords.latitude;
  var myCenter = new google.maps.LatLng(lat, lon);


  var mapOptions = {
    center: myCenter,
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };


  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var marker = new google.maps.Marker({
    position: myCenter,
    animation: google.maps.Animation.BOUNCE
  });

  marker.setMap(map);

}
// google.maps.event.addDomListener(window, 'reload', initMap);