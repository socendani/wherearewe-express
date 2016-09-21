/***
 * 
 * 
 * DANI::: usar watchPosition en vez de geoposition
 * https://developer.mozilla.org/es/docs/WebAPI/Using_geolocation
 * 
 */

/************** GLOBALES ****************/
var yo;
var wpid;
var nickname = document.getElementById("nickname").value.toLowerCase();
var roomid = document.getElementById("roomid").value.toLowerCase();
var color = document.getElementById("color").value.toLowerCase();
var socket = io.connect();
var is_FirstPosition = true;

function get_pos() {
    if (!!navigator.geolocation) {
        wpid = navigator.geolocation.watchPosition(geo_success, geo_error, {enableHighAccuracy: true, maximumAge: 30000, timeout: 27000});
    } else {
        Materialize.toast("ERROR: Your Browser doesnt support the Geo Location API", 4000)
    }
}
//Usamos wathPosition en vez de getCurrentPosition

function geo_success(position) {
    emitimosPosicion(position.coords.latitude, position.coords.longitude);
    if (is_FirstPosition) {
        initMap(position.coords.latitude, position.coords.longitude);
//        emitimosPosicion(position.coords.latitude, position.coords.longitude);
        is_FirstPosition = false;
    }
}



function geo_error(error) {
    var msg;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            msg = "Es necesario activar el GPS/Localización y dar permiso al navegador.";
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
    Materialize.toast(msg, 4000)
}



//Aquesta funció s'executa onload del body una vegada estem LOGINATS
function init() {
    get_pos();

}



$(document).ready(function () {
//Inicio de emision
    socket.emit("new-user", {nickname: nickname, roomid: roomid, color: color}, function (data) {
        socket.emit("user-join", data);
    });
//    socket.emit('new-message', {nickname: nickname, roomid: roomid, text: nickname + " entrando en sala"});
    
//    setInterval('emitimosPosicion()', 50000);   
    $('.button-collapse').sideNav({'edge': 'left'});
    
   
});

