console.log("daniiiii");
console.log("1111111111111");
console.log(dmr_servidor);

// var dmr_servidor = "http://localhost:3000";
var socket = io.connect(dmr_servidor);
// var socket = io.connect("http://localhost:3000");

console.log("22222222222222");
console.log(dmr_servidor);

$(function() {
  socket.emit("hello", "**************** Primer mensaje Socket *****************************************");
} );