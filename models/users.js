// var moongose= require("moongose");

var usuarios=[];

var User = {};

User.add = function (data) {
    // usuarios[data.roomid].push(data.nickname);
    console.log(data);
    usuarios[data.roomid]=[];
    usuarios[data.roomid][data.nickname]={
      "nickname": data.nickname,
      "createdAt": new Date().toLocaleTimeString()
    };

    // console.log("******");
    // console.log(usuarios);

};

User.update = function (data) {
    usuarios[data.roomid][data.nickname]={
      "nickname": data.nickname,
      "roomid": data.roomid,
      "lat": data.lat,
      "long": data.long,
      "updateAt": new Date().toLocaleTimeString()
    };

  
}

User.dameUsuarios = function (roomid) {
  console.log(usuarios[roomid]);
  return usuarios[roomid];
}


// module.exports = rooms;
module.exports = {
  User: User
};
