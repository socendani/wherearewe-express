var express = require('express');
var router = express.Router();

// var nickname="Mi nick2";
// var roomid="RDE341";
// var projecte={name: "Where Are We"};
var lat = "EE";
// const projecte=[];
var projecte = "Where Are We";
var version="1.1";


router.post('/login', function (req, res, next) {

  //Guardo el nickname y roomid en session
  req.session.nickname = req.body.nickname;
  req.session.roomid = req.body.roomid;

  res.redirect("/");

});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect("/");
});

/* GET home page. */
router.get('/', function (req, res, next) {
  console.info("HOLAAAAA-----------4444444444444");
  console.log("HOLAAAAA-------------5555555555555");
  console.log(req.session.nickname);
  console.log(req.session.roomid);
  res.render('index', {
    title: 'WhereAreWe '+version,
    lat: lat,
    fraseboton: (req.session.nickname)?"Cambiar":"Entrar",
    nickname: req.session.nickname,
    roomid: req.session.roomid,
    projecte: projecte
  });
});

module.exports = router;
