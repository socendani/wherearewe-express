var express = require('express');
var router = express.Router();
var fs = require("fs");

//fs.readFile('./VERSION', 'utf8', function (err, data) {
fs.readFile('./package.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    obj = JSON.parse(data);
    version = obj.version;
    projecte = obj.name;
    console.log("Project: " + projecte + " - v. " + version);
});

//CONFIG secret
fs.readFile('./config/key.googlemaps', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    key_googlemaps = data;
});

function url_show(req) {
//    return "/room/" + req.session.roomid + "/" + req.session.nickname + "/" + req.session.color;
    return "/room/" + req.session.roomid + "/";
}



//MiddleWare de autenticación
function isAuthenticated(req, res, next) {

//    req.session.roomid =  req.params.habitacion.toLowerCase();
    if ((!req.session.roomid) && (req.params.habitacion != undefined)) {
        req.session.roomid = require('querystring').escape(req.params.habitacion.toLowerCase());
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


router.post('/login', function (req, res, next) {
    req.session.nickname = require('querystring').escape(req.body.nickname.toLowerCase());
    req.session.roomid = require('querystring').escape(req.body.roomid.toLowerCase());
    req.session.color = req.body.color.toLowerCase().substr(1); //quitamos almohadilla
    //Si todo es OK.. vamos a la room
    res.redirect(url_show(req));
//    res.redirect("/room/");s
//    res.redirect("/room/" + req.session.roomid + "/" + req.session.nickname + "/" + req.session.color);

});
router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect("/");
});
/* GET home page. */
router.get('/', function (req, res, next) {
    //Renderizamos la VISTA

    res.render('login', {
        fraseboton: (req.session.nickname) ? "Cambiar" : "Entrar",
        color: Math.floor(Math.random() * 16777215).toString(16),
        nickname: "Pon tu apodo ..",
        roomid: req.session.roomid || "agora",
        version: version
                // title: projecte +" " + version
    });
//    next();
});
//router.get('/room/:habitacio', null, function (req, res, next) {
//    res.redirect("/");
//});
router.get('/room/', isAuthenticated, function (req, res, next) {
    var controller = require("../controllers/room_controller");
    controller.init(res, req);
});
router.get('/room/:habitacion/:nickname/:color?', isAuthenticated, function (req, res, next) {
//    El middleWare 'isAuthenticated' se encargará de poner variables de session 
//    res.redirect('/room/');
//    res.redirect('/room/'+ req.session.roomid );
    var controller = require("../controllers/room_controller");
    controller.init(res, req);
    next();
});
router.get('/room/:habitacion', isAuthenticated, function (req, res, next) {
//    req.session.roomid = require('querystring').escape(req.params.habitacion.toLowerCase());
//    res.redirect('/');
    var controller = require("../controllers/room_controller");
    controller.init(res, req);
//    next();
});
module.exports = router;
