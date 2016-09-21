var express = require('express');
var router = express.Router();
var fs = require("fs");
var version = "1.0";


fs.readFile('./VERSION', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    version = data;
})


//MiddleWare de autenticación
function isAuthenticated(req, res, next) {
//    req.session.roomid =  require('querystring').escape(req.params.habitacion.toLowerCase());
    req.session.roomid =  req.params.habitacion.toLowerCase();
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    if (req.session.nickname)
        return next();
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}


router.post('/login', function (req, res, next) {
    //Guardo el nickname y roomid en session
//    var escaped_str = require('querystring').escape('Photo on 30-11-12 at 8.09 AM #2.jpg');
//    console.log(escaped_str);

    req.session.nickname = req.body.nickname.toLowerCase();
    req.session.roomid = require('querystring').escape(req.body.roomid.toLowerCase());
    req.session.color = req.body.color.toLowerCase();

    //Si todo es OK.. vamos a la room
    res.redirect("/room/" + req.session.roomid);

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
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        nickname: "Pon un nick",
        roomid: req.session.roomid || "hab1",
        version: version
                // title: projecte +" " + version
    });
//    next();
});

//router.get('/room/:habitacio', null, function (req, res, next) {
//    res.redirect("/");
//});
//router.get('/room/', isAuthenticated, function (req, res, next) {
//    var controller = require("../controllers/room_controller");
//    controller.init(res, req);
//});
router.get('/room/:habitacion', isAuthenticated, function (req, res, next) {

    var controller = require("../controllers/room_controller");
    controller.init(res, req);
//    next();
});

module.exports = router;
