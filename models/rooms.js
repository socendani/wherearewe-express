// var moongose= require("moongose");
var Room = {};
// var rooms = function () {


Room.dameUsuarios = function () {
  var factor=Math.random() ;
  return [
    {
      "_id": "11111",
      "name": "juan",
      "color": "red",
      "lat": 41.459+ factor,
      "long": 2.242+ factor
    },
    {
      "_id": "22222",
      "name": "pedro",
      "color": "green",
      "lat": 41.458+ factor,
      "long": 2.243+ factor
    }
  ]
}


// module.exports = rooms;
module.exports = {
  Room: Room
};
