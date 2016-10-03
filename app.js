/*************** Requirements ***************/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var sessions = require('express-session');
var cors = require("cors");
var routes = require('./routes/routes');
//var morgan = require('morgan');
//Servidor
app = express();
var server = require("http").Server(app); //for websocket
var io = require("socket.io")(server); //for websocket
// require("../controllers/io_controller.js"); //for module of io I/O

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


var fs = require("fs");
/************  MODULES USES IN PROJECT  ************/
var sess;  //DMR:  https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/
var users = require('./models/users.js');
var audit = require('./models/audit.js');
var mensajes = require('./models/mensajes.js');


/***** Globals del projecte **/
app.locals.projecte = "";
app.locals.version = "0.0";
app.locals.key_googlemaps = "";

/************ CONF OBJECT ***********/

// var fs = require('fs'),
// configPath = './config.json';
// var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
// exports.conf=parsed;

switch (app.get('env')) {
    case "development":
        require('./config/config.js');
        var conf = {
            mongo_ruta: process.env.mongo_ruta,
            secret: process.env.secret
        };
        break;

    default: //https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars

        var conf = {
            mongo_ruta: process.env.mongo_ruta,
            secret: process.env.secret
        };
}



/*************  DB Connection ***********/
mongoose.Promise = global.Promise;
var mongoStore = new MongoStore({   //useful in io.socket FOR access to Session collection
    mongooseConnection: mongoose.connection
});


// mongoose.set('debug', true);
mongoose.connect(conf.mongo_ruta, function (err, res) {
    if (err) {
        console.log('ERROR: connecting to Database. ' + err);
    }
    console.log("Connection MongoDB ..OK  - Environtment: " + app.get('env'));
});

/************  CONFIGURE *************/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(cors());
app.disable('x-powered-by');
app.use(session({
    secret: conf.secret,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    maxAge: new Date(Date.now() + 1000 * 60 * 60),  // 1 hour
    store: mongoStore
}));



/**************    INIT *******************/
fs.readFile('./package.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    if (data) {
        obj = JSON.parse(data);
        app.locals.version = obj.version;
        app.locals.projecte = obj.name;
        console.log("**********************************************************");
        console.log("******        socendani                            *******");
        console.log("         Project: " + app.locals.projecte + " - v. " + app.locals.version);
        console.log("******                                             *******");
        console.log("**********************************************************");
    }
});
// important that this comes after session management
app.use('/', routes);

//START::
//app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });


});




/************************ INCLUDE  SOCKET.IO  (for code clearly) ************************/
eval(require('fs').readFileSync('./controllers/io_controller.js', 'utf8'));


module.exports = { app: app, server: server };

//TEST SOCKETS.io

//https://scotch.io/tutorials/a-realtime-room-chat-app-using-node-webkit-socket-io-and-mean
//https://github.com/mmukhin/psitsmike_example_2/blob/master/app.js
//http://www.tamas.io/advanced-chat-using-node-js-and-socket-io-episode-1/

//Lògica de Servidor

//var messages = [];
// var users = [];
// var usuarios = {};
// var aplicacion = {};
// var projecte = "";
// var version = "0.0";

//function sessionCleanup() {
//    sessionStore.all(function (err, sessions) {
//        for (var i = 0; i < sessions.length; i++) {
//            sessionStore.get(sessions[i], function () {});
//        }
//    });
//}

//var User = require("./models/users.js").User;
// io.on('connection', function (socket) {
//     socket.on('new-user', function (data, fn) {

//         console.log("NEWWWWWWWWWWW-USER: "+data);

        // //Mantenmos la session socket con el usuario ... 
        // socket.nickname = data.nickname.toLowerCase(); //esto .. no funciona¿?
        // socket.room = data.room.toLowerCase();
        // socket.color = data.color.toLowerCase();
        // socket.lat = 0;
        // socket.lng = 0;
        // socket.time = 0;
        // socket.join(socket.room); //join al room
        // var hoy = new Date().toLocaleTimeString();
        // var room = socket.room;
        // var usuario = { nickname: socket.nickname, color: socket.color, time: hoy };
        // if (!aplicacion[room]) {
        //     var room = {
        //         "usuarios": [],
        //         "total": 0
        //     };
        //     Object.defineProperty(aplicacion, room, { value: room, writable: true, enumerable: true });
        // }
        // //Un REFRESH de browsers
        // if (!existeUser(room)) {
        //     aplicacion[room].usuarios.push(usuario);
        //     aplicacion[room].total = aplicacion[room].total + 1;
        // }

        // //Callback client
        // fn({ data: "ejemplo de uso de callback en socket.io" });
    // });


    // socket.on('user-left', function (data, fn) {
    //     var room = socket.room;
    //     mensaje = "... saliendo del mapa (" + socket.room + ")";
    //     socketlog(socket, mensaje);
    //     io.sockets.in(socket.room).emit('messages', socket.nickname, mensaje);
    //     //eliminamos el usuario
    //     for (var i = 0; i < aplicacion[room].usuarios.length; i++) {
    //         if ((aplicacion[room].usuarios[i].nickname === socket.nickname) && (aplicacion[room].usuarios[i].color === socket.color)) {
    //             aplicacion[room].usuarios.splice(i, 1);
    //             aplicacion[room].total = aplicacion[room].total - 1;
    //         }
    //     }
    //     //emitimos usuarios
    //     //        io.sockets.in(socket.room).emit('usuarios', aplicacion[socket.room].usuarios, aplicacion[socket.room].total);

    //     fn("logout");
    // });



    // socket.on('user-join', function (data) {
    //     mensaje = ".... entrando en el mapa (" + socket.room + ")";
    //     socketlog(socket, mensaje);
    //     socket.in(socket.room).emit('messages', socket.nickname, mensaje);
    //     //FORZAMOS a que todos los clientes NOS envíen su posición
    //     io.sockets.in(socket.room).emit('force-posicion');
    // });
    // //Nou missatge
    // socket.on('new-message', function (mensaje) {
    //     socketlog(socket, mensaje);
    //     //        room = data.room;
    //     // messages.push(data);
    //     // io.sockets.emit('messages', messages);
    //     io.sockets.in(socket.room).emit('messages', socket.nickname, mensaje);
    // });




    // socket.on('update-position', function (lat, lng) {
    //     //un usuario Actualiza SU posición y emitimos a todos los datos de ESE usuario
    //     mensaje = "mensaje-server: lat: " + lat + ", lng: " + lng;
    //     socketlog(socket, mensaje);
    //     if (socket.room !== undefined) {
    //         io.sockets.in(socket.room).emit('usuarios', aplicacion[socket.room].usuarios, aplicacion[socket.room].total);
    //     }
    //     io.sockets.in(socket.room).emit('posicion', socket.nickname, lat, lng, socket.color);
    // });

    // /***********  Funciones useful for io   ************/
    // function socketlog(socket, mensaje) {
    //     console.log(socket.nickname + "::" + socket.room + ' => ' + mensaje);
    // }

    // function existeUser(room) {
    //     for (var i = 0; i < aplicacion[room].usuarios.length; i++) {
    //         if ((aplicacion[room].usuarios[i].nickname === socket.nickname) && (aplicacion[room].usuarios[i].color === socket.color)) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // function findClientsSocket(room, namespace) {
    //     var res = [], ns = io.of(namespace || "/"); // the default namespace is "/"

    //     if (ns) {
    //         for (var id in ns.connected) {
    //             if (room) {
    //                 var index = ns.connected[id].rooms.indexOf(room);
    //                 if (index !== -1) {
    //                     res.push(ns.connected[id]);
    //                 }
    //             } else {
    //                 res.push(ns.connected[id]);
    //             }
    //         }
    //     }
    //     return res;
    // }

// });

