var express = require('express');
var router = express.Router();
var controller = require("../controllers/app_controller");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {
        fraseboton: (req.session.nickname) ? "Cambiar" : "Entrar",
        color: Math.floor(Math.random() * 16777215).toString(16),
        nickname: "Escribe tu nombre",
        room: req.session.room || "agora",
        version: req.app.locals.version
    });
    //    next();
});


router.post('/login', function (req, res, next) {
    req.session.nickname = require('querystring').escape(req.body.nickname.toLowerCase());
    req.session.room = require('querystring').escape(req.body.room.toLowerCase());
    req.session.color = req.body.color.toLowerCase().substr(1); //quitamos almohadilla
    //Si todo es OK.. vamos a la room
    //    console.log(req.session);
    res.redirect(url_show(req));
});

router.get('/logout', function (req, res, next) {
    controller.logout(res, req);
    // req.session.destroy();
    // res.redirect("/");
});


//router.get('/room/:habitacio', null, function (req, res, next) {
//    res.redirect("/");
//});
router.get('/room/:room', isAuthenticated, function (req, res, next) {
    // if (req.params.room !== undefined) {
    //     req.session.room = require('querystring').escape(req.params.room.toLowerCase());
    // }
    controller.init(res, req);
});
router.get('/room/:room/:nickname?/:color?', isAuthenticated, function (req, res, next) {
    // if (req.params.room !== undefined) {
    //     req.session.room = require('querystring').escape(req.params.room.toLowerCase());
    // }
    controller.init(res, req);
    // res.redirect(url_show(req));
});

router.get('/tafanera/', function (req, res, next) {
    var audit = require('../models/audit.js');
    var mensajes = require('../models/mensajes.js');
    var users = require('../models/users.js');
    var estadisticas = 0;

    var mis_logs, mis_mensajes, mis_users;

    audit.showLogs(30, function (error, logs) {
        if (error) return console.error(error);
        estadisticas++;
        mis_logs=logs;
        mostrarView();
    });

    var m = new mensajes();
    m.showMensajes(30, function (error, mensajes) {
        if (error) return console.error(error);
        estadisticas++;
        mis_mensajes=mensajes;
        mostrarView();
    });
    
    var u = new users();
    u.showUsers(100, function (error, users) {
        if (error) return console.error(error);
        estadisticas++;
        mis_users=users;
        mostrarView();
    });

   
    function mostrarView() {
        // console.log("Estadísticas: " + estadisticas);
        if (estadisticas == 3) {
            res.render('tafanera', {
                mensajes: mis_mensajes,
                users: mis_users,
                logs: mis_logs
            });
        }
    }




});
//router.get('/room/:habitacion/:nickname/:color?', isAuthenticated, function (req, res, next) {
////    El middleWare 'isAuthenticated' se encargará de poner variables de session 
//    res.redirect('/room/');
////    next();
//});
//router.get('/room/:habitacion', function (req, res, next) {
//    req.session.room = require('querystring').escape(req.params.room.toLowerCase());
//    res.redirect('/');
////    next();
//});



///////////////////************  PRIVATE *************************/ç
function url_show(req) {
    //    return "/room/" + req.session.room + "/" + req.session.nickname + "/" + req.session.color;
    return "/room/" + req.session.room + "/" + req.session.nickname;
}

//MiddleWare de autenticación
function isAuthenticated(req, res, next) {

    //    req.session.room =  req.params.habitacion.toLowerCase();
    if ((!req.session.room) && (req.params.room != undefined)) {
        req.session.room = require('querystring').escape(req.params.room.toLowerCase());
    }
    if ((!req.session.nickname) && (req.params.nickname != undefined)) {
        req.session.nickname = require('querystring').escape(req.params.nickname.toLowerCase());
    }
    //    if ((!req.session.color) {&& (req.params.color != undefined)) {
    if ((!req.session.color)) {
        var color = req.params.color;
        if (!color) {
            color = Math.floor(Math.random() * 16777215).toString(16);
        }
        req.session.color = color.toLowerCase();
    }

    if ((!req.session.room) || (!req.session.nickname) || (!req.session.color)) {
        res.redirect('/');
    } else {
        return next();
    }
}



module.exports = router;
