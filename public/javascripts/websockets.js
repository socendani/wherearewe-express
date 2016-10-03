
/**********  Client Socket Receipt Functions ********/
socket.on('error', function (reason) {
    console.error('Unable to connect Socket.IO', reason);
});

socket.on('connect', function () {
    console.info('successfully established a working and authorized connection');
});
socket.on('disconnect', function () {
    console.info('connection lost..');
    html = "<h5>Se ha perdido la conexión</h5><p> .. reload en 5 segundos!</p>";
    Materialize.toast(html, 4000);
    setTimeout(function () {
        location.reload();
    }, 5000);

});



//Pintar mensajes recibidos
socket.on('messages', function (usuario, mensaje) {
//    console.log("messages-cli: " + usuario + " - " + mensaje);

    if (mensaje.indexOf("entrando en el mapa")>=0) {
         Materialize.toast(usuario+mensaje, 4000);
    }
    showIconSender();
    actualizarChat(usuario, mensaje);
});



//Pintar usuarios 
// socket.on('usuarios', function (usuarios, total) {
//     var html = usuarios.map(function (obj, index) {
//         chat_user = "chat-user";
//         if (nickname == obj.nickname) {
//             chat_user = "chat-user-me";
//         }
// //        console.log("usaurio => " + obj.nickname + "=" + obj.color);

//         label = obj.nickname.charAt(0).toUpperCase();
//         return ('<div  class="cuadro_user" style="background-color:#' + obj.color + '">&nbsp;&nbsp;' + label + '&nbsp;</div><div style="display:inline" >&nbsp;<b>' + obj.nickname + '</b></div>');
//     }).join("<br>");

//     document.getElementById('totalusuarios').innerHTML = total;
//     document.getElementById('usuarios').innerHTML = html;
// //    console.log(usuarios);
// });

socket.on('force-posicion', function () {
    emitimosPosicion();
});

socket.on('position-markers', function (markersObject) {
    // console.log("posicion-cliente::.");
    // console.log(data);
    showIconSender();
    actualizarMapa(markersObject);
})




/**********  Client Functions ********/

function showIconSender() {
//    return false;
    $("#iconsender").show();
    setTimeout(function () {
        $("#iconsender").hide();
    }, 1000);
}
function actualizarUsuarios(usuario, mensaje) {
//    console.log("actualizarChat2 => " + mensaje.nickname + "=" + mensaje.text);
    chat_user = "chat-user";
    if (nickname == usuario) {
        chat_user = "chat-user-me";
        usuario = "Yo";
    }
    html = '<div class="' + chat_user + '"><b>' + usuario + ':</b></div>';
    $('#usuarios').prepend(html);

//    Materialize.toast(html, 4000);
}

function actualizarChat(usuario, mensaje) {
//    console.log("actualizarChat********** => " + usuario + "=" + mensaje);
    chat_user = "chat-user";
    if (nickname == usuario) {
        chat_user = "chat-user-me";
        usuario = "Yo";
        total_mensajes = 0;
    } else {
        total_mensajes++;
    }
    html = '<div class="' + chat_user + '"><b>' + usuario + ': </b><em>' + mensaje + '</em></div>';
    $('#messages').prepend(html);
    pintar_mensajes();
//    Materialize.toast(html, 4000);
}


function addMessage() {
//    var message = {
//        room: document.getElementById('room').value,
//        nickname: document.getElementById('nickname').value,
//        text: document.getElementById('texto').value
//    };
    mensaje = document.getElementById('texto').value;
    socket.emit('message-new', mensaje);
    document.getElementById('texto').value = "";
    document.getElementById('texto').focus();
    return false;
}

