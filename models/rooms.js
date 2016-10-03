'use strict';

var mongoose = require('mongoose'),
        Schema = mongoose.Schema;


var roomsSchema = new Schema({
        name: { type: String, unique: true, required: true },
        owner: { type: Object },
        owner_nickname: { type: String },
        total_usuarios: { type: Number },
        fecha: { type: String },
        usuarios: { type: Array }
}, { timestamps: true }
);





roomsSchema.pre('validate', function (next, done) {
        this.fecha = new Date().toISOString().slice(0, 19);
        next();
});


roomsSchema.methods.hasExist = function (room_name, cb) {

        RoomModel.findOne({ name: room_name }, function (err, obj) {
                if (err) return cb(room_name + ", error buscando room. ", null);
                cb(null, obj);
        });
};


roomsSchema.methods.addUserIntoRoom = function (user, cb) {
        console.log("roomsSchema.methods.addUserIntoRoom");
        var yo =this;
        RoomModel.findOne({ "usuarios._id": user.id }, function (err, obj) {
                if (obj) {
                        console.log("El usuario " + user.nickname + " ya existe en esta habitación: " + obj.id);
                } else {
                        yo.usuarios.push(user);
                        yo.total_usuarios++;
                        yo.save(function (err, obj) {
                                if (err) return cb(user.nickname + " NO se ha podido unir en " + obj.name, null);
                                cb(null, obj);
                        });
                }
        });

};

roomsSchema.methods.removeUserFromRoom = function (user, cb) {
        console.log("roomsSchema.methods.removeUserFromRoom");
        console.log("User ID = "+user.id);
        var yo =this;
// RoomModel.update({$pull : { "usuarios._id": user.id } }, function(err,obj){
//         console.log(obj);
// });

        RoomModel.findOne({ "usuarios._id": user.id }, function (err, obj) {
                if (obj) {
                        //Eliminamos el usuario del Array
                        yo.usuarios.pull(obj);
                        yo.total_usuarios--;
                        yo.save(function (err, obj) {
                                console.log("AAAAAAAAAAAAAAAAAAA:::"+err);
                                if (err) return cb(err, null);
                                cb(null, obj);
                        });
                } else {
                        return audit.log("Oh! my god!, " + user.nickname + " NO estaba en esta habitación: " + obj.id);
                }
        });

};

roomsSchema.methods.crearRoom = function (room_name, user, cb) {
        console.log("roomsSchema.methods.crearRoom");
        this.name = room_name;
        this.owner = user;
        this.owner_nickname = user.nickname;
        this.total_usuarios = 0;
        this.save(function (err, obj) {
                if (err) return cb(user.nickname + " NO se ha creado la Room! " + room_name, null);
                cb(null, obj);
        });

};



roomsSchema.methods.speak = function () {
        var greeting = this.name
                ? "Meow name is " + this.name
                : "I don't have a name";
        console.log(greeting);
};


//Nuestros MODELO
var RoomModel = mongoose.model('rooms', roomsSchema);
module.exports = RoomModel;
