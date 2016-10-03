var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var hoy = new Date().toLocaleTimeString();

var mensajesSchema = new Schema({
    nickname: { type: String, required: true, lowercase: true, trim: true },
    color: { type: String, required: true, trim: true },
    room: { type: String, lowercase: true, trim: true },
    fecha: { type: String },
    mensaje: { type: String }
}, {
        timestamps: true,
    }
);


mensajesSchema.methods.crear = function (mensaje, callback) {
    this.mensaje = mensaje;
    this.nickname = sess.nickname;
    this.color = sess.color;
    this.room = sess.room;
    this.fecha = new Date().toISOString().slice(0, 19);
    this.save(function (err, obj) {
        if (err) return audit.error(err);
        callback(null, obj);
    });
};

mensajesSchema.methods.showMensajes = function (howmany, cb) {
    MensajeModel.find({}, function (err, obj) {
        if (err) return cb(err);
        cb(null, obj);
    }).sort([['updatedAt', 'descending']]).limit(howmany);

};

mensajesSchema.methods.cleanMensajes = function (horas) {
    if (horas===undefined) horas=10;
    var start = new Date(new Date().getTime() - (horas * 60 * 60 * 1000));
    MensajeModel.remove({
        "createdAt": {
            "$lte": start
        }
    }).remove().exec();
};



//Nuestros MODELO
var MensajeModel = mongoose.model('mensajes', mensajesSchema);
module.exports = MensajeModel;



