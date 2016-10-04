// 'use strict';
// var index_controller = function () {

var users = require('../models/users.js');
var audit = require('../models/audit.js');


module.exports = {

    init: function (res, req) {
        //        var room = require('querystring').escape(req.params.room.toLowerCase());
        //        var nickname = require('querystring').escape(req.params.nickname.toLowerCase());
        //        var color = require('querystring').escape(req.params.color.toLowerCase());
        var room = require('querystring').escape(req.session.room.toLowerCase());
        var nickname = require('querystring').escape(req.session.nickname.toLowerCase());
        var color = require('querystring').escape(req.session.color.toLowerCase());
        sess = req.session;   //NO Need.. pero és interessant la idea.
        // console.log(sess);

        //Un usuario inicializa 
        var myObject = { "nickname": nickname, "color": color, "room": room, "lat": 0, "long": 0 };
        ///http://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate
        users.findOneAndUpdate({ "_id": req.session.id }, { $set: myObject }, { upsert: true, new: true }, function (error, doc) {
            if (error) return audit.error(error);
            audit.log(doc.nickname + " INICIANDO en " + doc.room);
            //Guardamos al usuario en una variable global de session
            sess.user = doc;
        });

        //Paralelament fem neteja de missatges per no sobredimensionar la database de MONGO
        audit.cleanLogs(24);
        var mensajes = require('../models/mensajes.js');
        var m = new mensajes().cleanMensajes(5);
        var u = new users().cleanUsers(2);


        //Renderizamos la VISTA
        res.render('index', {
            title: req.app.locals.projecte + " v." + req.app.locals.version,
            projecte: req.app.locals.projecte,
            nickname: nickname,
            room: room,
            color: color
        });
    },


    logout: function (res, req) {
        console.log("Usuario.. se vaaaaaa");
        audit.log(req.session.nickname + " LOGOUT en " + req.session.room);
        users.findOneAndRemove({ "_id": req.session.id }, function (error, doc, result) {
            if (error) return audit.error(error);
            if (doc)
                audit.log(doc.nickname + " login out de  " + doc.room);
            req.session.destroy();
            res.redirect("/");
        });
    }


}
// module.exports = index_controller;











// function entrarEnRoom(room, user, callback) {
//     // room = "ROOM-" + (Math.random() * 100) + 1;
//     // room = "ROOM-1";
//     var room = new rooms({ name: room });

//     room.hasExist(room, function (err, myroom) {
//         if (err) return audit.log(err);
//         if (myroom !== null) {
//             //Añadimos al usuario
//             callback(myroom, user);
//         } else {
//             room.crearRoom(room, user, function (err, myroom) {
//                 if (err) return audit.log(user.nickname + ", NO se ha creado la room ");
//                 audit.log("Rooom creada [" + myroom.name + "].. ok");
//                 //Añadimos al usuario
//                 callback(myroom, user);
//             });
//         }

//     });
// }



// function addUserIntoRoom(room, user) {
//     console.log("... adding user ... " + room.name);
//     room.addUserIntoRoom(user, function (err, obj) {
//         if (err) return audit.log(user.nickname + " NO se ha podido unir a la room " + obj.name);
//         audit.log(user.nickname + " uniéndose a " + obj.name);
//     });
// };