// var moongose= require("moongose");
var Room = {};
// var rooms = function () {


Room.dameUsuarios = function () {
  return [
    {
      "_id": "11111",
      "name": "usuario1",
      "color": "red",
      "lat": 41.46,
      "long": 2.233
    },
    {
      "_id": "22222",
      "name": "usuario3",
      "color": "green",
      "lat": 41.416,
      "long": 2.2233
    }
  ]
}


// module.exports = rooms;
module.exports = {
  Room: Room
};
