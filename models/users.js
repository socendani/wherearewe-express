var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var usersSchema = new Schema({
    _id: { type: Object, required: true, unique: true },  
    nickname: {type: String, required: true},
    color: {type: String, required: true},
    room: {type: String}
}, {
    timestamps: true,
    _id: false
}
);


usersSchema.pre('save', function (done) {
    //No poden existir USUARIS que coincideixin en nickname+color+room



    this.updated_at = new Date();
    done();
});



//Nuestros MODELO
var UserModel = mongoose.model('users', usersSchema);
module.exports = UserModel;
//
//var users = function () {
////module.exports = {
//    function updateUser(room, cb) {
//        RoomModel.find({name: room.name}, function (err, docs) {
//            if (docs.length) {
//                cb('Name exists already', null);
//            } else {
//                room.save(function (err) {
//                    cb(err, room);
//                });
//            }
//        });
//    }
//};
//
//module.exports = mongoose.model('users', usersSchema);


