// 'use strict';
// var index_controller = function () {

var rooms = require('../models/rooms.js');
var users = require('../models/users.js');
var audit = require('../models/audit.js');


function entrarEnRoom(roomid, user, callback) {
    // roomid = "ROOM-" + (Math.random() * 100) + 1;
    // roomid = "ROOM-1";
    var room = new rooms({ name: roomid });

    room.hasExist(roomid, function (err, myroom) {
        if (err) return audit.log(err);
        if (myroom !== null) {
            //Añadimos al usuario
            callback(myroom, user);
        } else {
            room.crearRoom(roomid, user, function (err, myroom) {
                if (err) return audit.log(user.nickname + ", NO se ha creado la room ");
                audit.log("Rooom creada [" + myroom.name + "].. ok");
                //Añadimos al usuario
                callback(myroom, user);
            });
        }

    });
}



function addUserIntoRoom(room, user) {
    console.log("... adding user ... " + room.name);
    room.addUserIntoRoom(user, function (err, obj) {
        if (err) return audit.log(user.nickname + " NO se ha podido unir a la room " + obj.name);
        audit.log(user.nickname + " uniéndose a " + obj.name);
    });


};


module.exports = {

    init: function (res, req) {
        //        var roomid = require('querystring').escape(req.params.roomid.toLowerCase());
        //        var nickname = require('querystring').escape(req.params.nickname.toLowerCase());
        //        var color = require('querystring').escape(req.params.color.toLowerCase());
        var roomid = require('querystring').escape(req.session.roomid.toLowerCase());
        var nickname = require('querystring').escape(req.session.nickname.toLowerCase());
        var color = require('querystring').escape(req.session.color.toLowerCase());
        var user_id = req.session.id;
        sess = req.session;


        //Un usuario entra en una habitación
        var user = new users({ nickname: nickname, color: color, room: roomid });
        user._id = user_id;
        user.save(function (err, obj) {
            // if (err) {
            //     return console.error(err);
            // }
        });
        //Guardamos al usuaio en session
        sess.user = user;


        //El usuario ENTRA/CREA la habitación  y luego se añade a ella.
        entrarEnRoom(roomid, user, addUserIntoRoom);

        //Renderizamos la VISTA
        res.render('index', {
            title: req.app.locals.projecte + " v." + req.app.locals.version,
            fraseboton: "Entrar",
            nickname: nickname,
            roomid: roomid,
            color: color,
            projecte: req.app.locals.projecte
        });
    },


    logout: function (res, req) {
        console.log("Usuario.. se vaaaaaa");
        // console.log(sess.user);
        var room = new rooms();
        room.removeUserFromRoom(sess.user, function (err, obj) {

            req.session.destroy();
            sess=null;
            res.redirect("/");
        });


    }

};
// module.exports = index_controller;