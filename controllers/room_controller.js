
var projecte = "Where Are We";
var version="1.1";

// var index_controller = function () {
module.exports = {
  init: function (res, req) {
    
    //Renderizamos la VISTA
    res.render('index', {
      title: projecte +" " + version,
      fraseboton: (req.session.nickname) ? "Cambiar" : "Entrar",
      nickname: req.session.nickname,
      roomid: req.session.roomid,
      color: req.session.color,
      projecte: projecte
    });
  }
}
// module.exports = index_controller;