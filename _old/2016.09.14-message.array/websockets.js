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
socket.on('messages', function (data) {
    actualizarChat(data);
})

//Pintar usuarios en el mapa
socket.on('usuarios', function (data) {
    actualizarMapa(data);
})




/**********  Client Functions ********/
function actualizarChat(mensaje) {
//    console.log("actualizarChat2 => " + mensaje.nickname + "=" + mensaje.text);
    chat_user = "chat-user";
    if (nickname == mensaje.nickname) {
        chat_user = "chat-user-me";
        mensaje.nickname = "Yo";
    }
    html = '<div class="' + chat_user + '"><b>' + mensaje.nickname + ':</b><em>' + mensaje.text + '</em></div>';
    $('#messages').prepend(html);
}

function actualizarChat_OLD(data) {
    data.reverse();
    var html = data.map(function (elem, index) {
        chat_user = "chat-user";
        if (nickname == elem.nickname) {
            chat_user = "chat-user-me";
            elem.nickname = "Yo";
        }
        console.log("actualizarChat => " + elem.nickname + "=" + elem.text);
        return ('<div class="' + chat_user + '"><b>' + elem.nickname + ':</b><em>' + elem.text + '</em></div>');
    }).join(" ");

    document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
    var message = {
        roomid: document.getElementById('roomid').value,
        nickname: document.getElementById('nickname').value,
        text: document.getElementById('texto').value
    };
    // console.log(message);
    socket.emit('new-message', message);
    document.getElementById('texto').value = "";
    document.getElementById('texto').focus();
    return false;
}

