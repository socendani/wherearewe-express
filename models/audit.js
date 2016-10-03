var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var auditSchema = new Schema({
    nickname: { type: String, required: true },
    room: { type: String},
    color: { type: String},
    level: { type: String },
    fecha: { type: String },
    description: { type: String }
}, {
        timestamps: true
    }
);


auditSchema.pre('validate', function (next, done) {
    this.nickname = sess.nickname;
    this.room = sess.room;
    this.color = sess.color;
    this.fecha=new Date().toISOString().slice(0, 19);
    this.level = "NORMAL";
    this.updated_at = new Date();
    next();
});

auditSchema.methods.log = function (mensaje, level) {
    this.level = level;
    this.description = mensaje;
    this.save(function (err, obj) {
        if (err)  console.log(err);
    });
};
auditSchema.methods.error = function (mensaje) {

    console.log("ERROR : "+mensaje);
    this.level = "ERROR";
    this.description = mensaje;
    this.save(function (err, obj) {
        if (err)  console.log(err);
    });
};

auditSchema.methods.purgeCollection = function (howmany) {
    //TODO: Delete ALL items EXCEPTS howmany
};

auditSchema.methods.showLogs = function (howmany, cb) {
    audit.find({}, function(err, obj){
         if (err)  return cb(err);
         cb(null,obj);
    }).sort([['updatedAt', 'descending']]).limit(howmany);

};

auditSchema.methods.cleanLogs = function (horas) {
    if (horas===undefined) horas=10;
    var start = new Date(new Date().getTime() - (horas * 60 * 60 * 1000));
    audit.remove({
        "createdAt": {
            "$gte": start
        }
    });
};



// https://darrenderidder.github.io/talks/ModulePatterns/#/8
//Nuestros MODELO
var audit = mongoose.model('audits', auditSchema);
module.exports = new audit();



