
/**********  Client Socket Receipt Functions ********/
//Pintar mensajes recibidos
socket.on('messages', function (usuario, mensaje) {
//    console.log("messages-cli: " + usuario + " - " + mensaje);
    showIconSender();
    actualizarChat(usuario, mensaje);
})

//Pintar usuarios en el mapa
socket.on('usuarios', function (data) {
    Materialize.toast(data, 4000);
})

socket.on('posicion', function (nickname, lat, lng, color) {
//    console.log("messages-cli: " + nickname + ". lang: " + lat + ", lng: " + lng + ", color: " + color);
    showIconSender();
    actualizarMapa(nickname, lat, lng, color);
})




/**********  Client Functions ********/

function showIconSender() {
    $("#iconsender").show();
    setTimeout( $("#iconsender").hide(),5000);
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
    Materialize.toast(html, 4000);
}

function actualizarChat(usuario, mensaje) {
//    console.log("actualizarChat2 => " + mensaje.nickname + "=" + mensaje.text);
    chat_user = "chat-user";
    if (nickname == usuario) {
        chat_user = "chat-user-me";
        usuario = "Yo";
    }
    html = '<div class="' + chat_user + '"><b>' + usuario + ':</b><em>' + mensaje + '</em></div>';
    $('#messages').prepend(html);
    Materialize.toast(html, 4000);
}

//function NOTUSE_actualizarChat_OLD(data) {
//    data.reverse();
//    var html = data.map(function (elem, index) {
//        chat_user = "chat-user";
//        if (nickname == elem.nickname) {
//            chat_user = "chat-user-me";
//            elem.nickname = "Yo";
//        }
//        console.log("actualizarChat => " + elem.nickname + "=" + elem.text);
//        return ('<div class="' + chat_user + '"><b>' + elem.nickname + ':</b><em>' + elem.text + '</em></div>');
//    }).join(" ");
//
//    document.getElementById('messages').innerHTML = html;
//}

function addMessage() {
//    var message = {
//        roomid: document.getElementById('roomid').value,
//        nickname: document.getElementById('nickname').value,
//        text: document.getElementById('texto').value
//    };
    mensaje = document.getElementById('texto').value;
    socket.emit('new-message', mensaje);
    document.getElementById('texto').value = "";
    document.getElementById('texto').focus();
    return false;
}

