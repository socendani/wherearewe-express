// console.log("1111111111111");
// console.log("Servidor: " + dmr_servidor);

var nickname = document.getElementById("nickname").value;
var roomid = document.getElementById("roomid").value;

console.log("Room ID => " + roomid);
// var dmr_servidor = "http://localhost:3000";
// var socket = io.connect(dmr_servidor,  { 'forceNew': true });
var socket = io.connect();
//Creamos y/o nos unimos
socket.emit('new-user', { nickname: nickname, roomid: roomid } );

//Emitimos nuestra bienvenida
socket.emit('new-message', { nickname: nickname, roomid: roomid, text: nickname + " entrando en sala" });

//Pintar mensajes recibidos
socket.on('messages', function (data) {
  actualizarChat(data);
})

//Pintar usuarios en el mapa
socket.on('usuarios', function (data) {
  actualizarMapa(data);
})




/**********  Client Functions ********/


function actualizarChat(data) {
  data.reverse();
  var html = data.map(function (elem, index) {
    chat_user = "chat-user";
    if (nickname == elem.nickname) {
      chat_user = "chat-user-me";
      elem.nickname = "Yo";
    }
    // console.log(elem.nickname+"="+elem.text);
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
  return false;
}

