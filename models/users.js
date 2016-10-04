var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var hoy = new Date().toLocaleTimeString();

var usersSchema = new Schema({
    _id: { type: Object, required: true, unique: true },
    nickname: { type: String, required: true, lowercase: true, trim: true },
    color: { type: String, required: true, trim: true },
    room: { type: String, lowercase: true, trim: true },
    lat: { type: String, default: 0 },
    lng: { type: String, default: 0 }
}, {
        timestamps: true,
        _id: false
    }
);


// usersSchema.pre('save', function (done) {
//     //No poden existir USUARIS que coincideixin en nickname+color+room
//     this.updated_at = new Date();
//     done();
// });

usersSchema.methods.getUsersFromRoom = function (room_name, cb) {
    UserModel.find({ room: room_name }, function (err, usuarios) {
        if (err) return cb(room_name + ", error getUsersFromRoom. " + err, null);
        //provesamos el resultado
        // console.log(usuarios);
        cb(null, usuarios);
    }).select("-_id roomid nickname color lat lng");
};

usersSchema.methods.showUsers = function (howmany, cb) {
    UserModel.find({}, function (err, obj) {
        if (err) return cb(err);
        cb(null, obj);
    }).sort([['updatedAt', 'descending']]).limit(howmany);

};

usersSchema.methods.cleanUsers = function (horas) {
    if (horas === undefined) horas = 3;
    var start = new Date(new Date().getTime() - (horas * 60 * 60 * 1000));
    UserModel.find({
        "createdAt": {
            "$lte": start
        }
    }).remove().exec(function(err, docs){console.log(docs.length)});
};





//Nuestros MODELO
var UserModel = mongoose.model('users', usersSchema);
module.exports = UserModel;


