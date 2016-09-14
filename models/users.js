// var moongose= require("moongose");

var usuarios = new Array();

var User = {};

User.pintarComillas = function (id) {
  return "'" + id.toString() + "'";
}


User.add = function (data) {
  var hoy = new Date().toLocaleTimeString();

  // usuarios[data.roomid].push(data.nickname);
  // console.log("***add**");
  room = this.pintarComillas(data.roomid);
  nickname = this.pintarComillas(data.nickname);

  usuarios[room] = new Array();
  // usuarios[data.roomid] = new Array();
  usuarios[room][nickname] = {
    "nickname": data.nickname,
    "createdAt": hoy
  };
  console.log(usuarios);


  // for (i = 1; i < 10; i++) {
  //   var factor = Math.random() * 0.1;
  //   la = 41.459 + factor;
  //   lo = 2.2423 + factor;
  //   nickname = this.pintarComillas(data.nickname + "_" + i);
  //   usuarios[room][nickname] = {
  //     "nickname": data.nickname,
  //     "roomid": data.roomid,
  //     "lat": la,
  //     "long": lo,
  //     "updateAt": new Date().toLocaleTimeString()
  //   };
  // };

};



User.update = function (data) {
  // var hoy = new Date().toLocaleTimeString();

  // // console.log("***update (1)**");
  // usuarios[data.roomid.toString()] = new Array();
  // usuarios[data.roomid.toString()][data.nickname.toString()] = {
  //   "roomid": data.roomid,
  //   "nickname": data.nickname,
  //   "lat": data.lat,
  //   "long": data.long,
  //   "updateAt": hoy
  // };

  // console.log("***update (2)**");
  // console.log(usuarios);
};



User.dameUsuarios = function (roomid) {
  room = this.pintarComillas(roomid);
//  console.log("+++++++++++++++ dame usuarios ["+room+"] +++++++++");
  if (usuarios[room]) {
//    console.log(usuarios[room]);
    return usuarios[room];
  } else {
    return false;
  }
}


// module.exports = rooms;
module.exports = {
  User: User
};
