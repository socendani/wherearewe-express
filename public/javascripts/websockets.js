// console.log("1111111111111");
// console.log("Servidor: " + dmr_servidor);



// console.log("Room ID => " + roomid);
// var dmr_servidor = "http://localhost:3000";
// var socket = io.connect(dmr_servidor,  { 'forceNew': true });
//var socket = io.connect();
//Creamos y/o nos unimos
//socket.emit('new-user', { nickname: nickname, roomid: roomid } );

//Emitimos nuestra bienvenida
//socket.emit('new-message', { nickname: nickname, roomid: roomid, text: nickname + " entrando en sala" });


/**********  Client Socket Receipt Functions ********/
//Pintar mensajes recibidos
socket.on('messages', function (usuario, mensaje) {
    console.log("messages-cli: "+usuario+" - "+mensaje);
    actualizarChat(usuario, mensaje);
})

//Pintar usuarios en el mapa
socket.on('usuarios', function (data) {
    actualizarMapa(data);
})

socket.on('posicion', function (usuario, lat, lng) {
    console.log("messages-cli: "+usuario+". lang: "+lat+", lng: "+lng);
    actualizarChat(usuario, "messages-cli: "+usuario+". lang: "+lat+", lng: "+lng);  //temporalmente
})




/**********  Client Functions ********/
function actualizarChat(usuario, mensaje) {
//    console.log("actualizarChat2 => " + mensaje.nickname + "=" + mensaje.text);
    chat_user = "chat-user";
    if (nickname == usuario) {
        chat_user = "chat-user-me";
        usuario = "Yo";
    }
    html = '<div class="' + chat_user + '"><b>' + usuario + ':</b><em>' + mensaje + '</em></div>';
    $('#messages').prepend(html);
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
    mensaje=document.getElementById('texto').value;
    socket.emit('new-message', mensaje);
    
    document.getElementById('texto').value = "";
    document.getElementById('texto').focus();
    return false;
}

