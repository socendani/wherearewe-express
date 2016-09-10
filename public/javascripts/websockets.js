// console.log("1111111111111");
// console.log("Servidor: " + dmr_servidor);

var roomid = document.getElementById("roomid").value;
console.log("Room ID => "+roomid);
// var dmr_servidor = "http://localhost:3000";
// var socket = io.connect(dmr_servidor,  { 'forceNew': true });
var socket = io.connect();
//Creamos y/o nos unimos
socket.emit('new_user', roomid);

//Pintar mensajes recibidos
socket.on('messages', function(data) {  
  render(data);
})





/**********  Client Functions ********/


function render (data) {  
  var html = data.map(function(elem, index) {
    console.log(elem.nickname+"="+elem.text);
    return('<div><b>'+elem.nickname+'</b>:<em>'+elem.text+'</em></div>');
  }).join(" ");

  document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {  
  var message = {
    roomid: document.getElementById('roomid').value,
    nickname: document.getElementById('nickname').value,
    text: document.getElementById('texto').value
  };
  console.log(message);
  socket.emit('new-message', message);
  return false;
}


// $(function() {
//   socket.emit("hello", "**************** Primer mensaje Socket *****************************************");
// } );

