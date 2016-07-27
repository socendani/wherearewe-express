var express = require('express');
var router = express.Router();

var nickname="Mi nick";
var roomid="RDE341";
// var projecte={name: "Where Are We"};
var projecte=[];
projecte["name"]="Where Are We";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WWA', nickname: nickname , roomid: roomid , projecte: projecte});
});

module.exports = router;
