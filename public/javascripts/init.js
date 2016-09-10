/***
 * 
 * 
 * DANI::: usar watchPosition en vez de geoposition
 * https://developer.mozilla.org/es/docs/WebAPI/Using_geolocation
 * 
 */

$(document).ready(function () {
  setInterval('emitimosPosicion()', 5000);
  // $("#lat").change(function () {
  //   emitimosPosicion();
  // });
  // $("#long").change(function () {
  //   emitimosPosicion();
  // });
});



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

