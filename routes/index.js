var express = require('express');
var router = express.Router();

//MiddleWare de autenticación
function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    // if (req.user.authenticated)
    if (req.session.nickname)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}


router.post('/login', function (req, res, next) {
  //Guardo el nickname y roomid en session
  req.session.nickname = req.body.nickname;
  req.session.roomid = req.body.roomid;

  //Si todo es OK.. vamos a la room
  res.redirect("/room");

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
      nickname: "Pon un nick",
      roomid: "Habitación"
      // title: projecte +" " + version
    });
    next();
});

router.get('/room', isAuthenticated, function (req, res, next) {
  var controller=require("../controllers/room_controller");
  controller.init(res,req);
});

module.exports = router;
