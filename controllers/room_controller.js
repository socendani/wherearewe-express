


// var index_controller = function () {
module.exports = {
    init: function (res, req) {

        var roomid = require('querystring').escape(req.params.roomid.toLowerCase());
        var nickname = require('querystring').escape(req.params.nickname.toLowerCase());
        var color = require('querystring').escape(req.params.color.toLowerCase());

        //Renderizamos la VISTA
        res.render('index', {
            title: projecte + " v." + version,
            fraseboton: "Entrar",
            nickname: nickname,
            roomid: roomid,
            color: color,
            projecte: projecte
        });
    }
}
// module.exports = index_controller;