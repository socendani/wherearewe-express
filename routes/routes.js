var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {
        //        fraseboton: (req.session.nickname) ? "Cambiar" : "Entrar",
        color: Math.floor(Math.random() * 16777215).toString(16),
        nickname: "Pon un nick",
        roomid: req.session.roomid || "agora",
        version: req.app.locals.version
        // title: projecte +" " + version
    });
    //    next();
});


router.post('/login', function (req, res, next) {
    req.session.nickname = require('querystring').escape(req.body.nickname.toLowerCase());
    req.session.roomid = require('querystring').escape(req.body.roomid.toLowerCase());
    req.session.color = req.body.color.toLowerCase().substr(1); //quitamos almohadilla
    //Si todo es OK.. vamos a la room
    //    console.log(req.session);
    res.redirect(url_show(req));
});

router.get('/logout', function (req, res, next) {

    var controller = require("../controllers/room_controller");
    controller.logout(res, req);
    // req.session.destroy();
    // res.redirect("/");
});


//router.get('/room/:habitacio', null, function (req, res, next) {
//    res.redirect("/");
//});
router.get('/room/:habitacion?', isAuthenticated, function (req, res, next) {
    if (req.params.roomid !== undefined) {
        req.session.roomid = require('querystring').escape(req.params.roomid.toLowerCase());
    }
    var controller = require("../controllers/room_controller");
    controller.init(res, req);
});

router.get('/logs/', isAuthenticated, function (req, res, next) {
    var audit = require('../models/audit.js');
    audit.showLogs(100, function (err, logs) {

        res.render('logs', {
            err: err,
            logs: logs
        });
    });



});
//router.get('/room/:habitacion/:nickname/:color?', isAuthenticated, function (req, res, next) {
////    El middleWare 'isAuthenticated' se encargará de poner variables de session 
//    res.redirect('/room/');
////    next();
//});
//router.get('/room/:habitacion', function (req, res, next) {
//    req.session.roomid = require('querystring').escape(req.params.roomid.toLowerCase());
//    res.redirect('/');
////    next();
//});



///////////////////************  PRIVATE *************************/ç
function url_show(req) {
    //    return "/room/" + req.session.roomid + "/" + req.session.nickname + "/" + req.session.color;
    return "/room/" + req.session.roomid;
}

//MiddleWare de autenticación
function isAuthenticated(req, res, next) {

    //    req.session.roomid =  req.params.habitacion.toLowerCase();
    if ((!req.session.roomid) && (req.params.roomid != undefined)) {
        req.session.roomid = require('querystring').escape(req.params.roomid.toLowerCase());
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

    if ((!req.session.roomid) || (!req.session.nickname) || (!req.session.color)) {
        res.redirect('/');
    } else {
        return next();
    }
}



module.exports = router;
