
var projecte = "Where Are We";
var version="1.1";

// var index_controller = function () {
module.exports = {
  init: function (res, req) {

    //Si estamos Loginados y tenemos ROOM => buscamos los usuarios de esa roomid
    var Room=require("../models/rooms.js").Room;
    var usuarios=Room.dameUsuarios();

    
    console.log(usuarios);


    //Renderizamos la VISTA
    res.render('index', {
      title: projecte +" " + version,
      fraseboton: (req.session.nickname) ? "Cambiar" : "Entrar",
      nickname: req.session.nickname,
      roomid: req.session.roomid,
      projecte: projecte
    });
  }
}
// module.exports = index_controller;