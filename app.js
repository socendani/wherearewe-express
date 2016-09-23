var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var cors = require("cors");
var routes = require('./routes/index');
//var morgan = require('morgan');
//Servidor
var app = express();
var server = require("http").Server(app); //for websocket
var io = require("socket.io")(server); //for websocket
var key_googlemaps = "";




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(cors());
//app.use(morgan('combined'))


//Cookies: //http://expressjs.com/es/advanced/best-practice-security.html
app.disable('x-powered-by');
var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(sessions({
    secret: "PROBANDOLASSESIONES",
    resave: true,
    saveUninitialized: true,
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
        // secure: true,
        httpOnly: true,
        // domain: 'example.com',
        // path: 'foo/bar',
        expires: expiryDate
    }

}));
//Revisar si es necesario esto:
app.use('/', routes);
//Situación
// var dmr_servidor = "http://localhost:3000";






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
//TEST SOCKETS.io

//https://scotch.io/tutorials/a-realtime-room-chat-app-using-node-webkit-socket-io-and-mean
//https://github.com/mmukhin/psitsmike_example_2/blob/master/app.js
//http://www.tamas.io/advanced-chat-using-node-js-and-socket-io-episode-1/

//Lògica de Servidor

//var messages = [];
var users = [];
var usuarios = {};
var aplicacion = {};
var projecte = "";
var version = "0.0";

//var User = require("./models/users.js").User;
io.on('connection', function (socket) {

    socket.on('user-left', function (data, fn) {
        var roomid = socket.roomid;
        mensaje = "... saliendo del mapa (" + socket.roomid + ")";
        socketlog(socket, mensaje);
        io.sockets.in(socket.roomid).emit('messages', socket.nickname, mensaje);
        //eliminamos el usuario
        for (var i = 0; i < aplicacion[roomid].usuarios.length; i++) {
            if ((aplicacion[roomid].usuarios[i].nickname === socket.nickname)
                    && (aplicacion[roomid].usuarios[i].color === socket.color)) {
                aplicacion[roomid].usuarios.splice(i, 1);
                aplicacion[roomid].total = aplicacion[roomid].total - 1;
            }
        }
        //emitimos usuarios
//        io.sockets.in(socket.roomid).emit('usuarios', aplicacion[socket.roomid].usuarios, aplicacion[socket.roomid].total);
        fn("logout");
    });
    function socketlog(socket, mensaje) {
        console.log(socket.nickname + "::" + socket.roomid + ' => ' + mensaje);

//        console.log("-- SOCKET --");
//        console.log(socket);
//        console.log("----------------------------------------------");
//        console.log("------ Socket.roomid:" + socket.roomid);
//        console.log("------ Socket.nickname:" + socket.nickname);
//        console.log("------ Socket.lat:" + socket.lat);
//        console.log("------ Socket.lng:" + socket.lng);
//        console.log("------ Socket.time:" + socket.time);
//        console.log("------ mensaje:" + mensaje);
//        console.log("----------------------------------------------");
    }

//    io.sockets.map(function (e) {
////            return e.nickname;
//        console.log(e.nickname);
//    })

    function existeUser(roomid) {
        for (var i = 0; i < aplicacion[roomid].usuarios.length; i++) {
            if ((aplicacion[roomid].usuarios[i].nickname === socket.nickname)
                    && (aplicacion[roomid].usuarios[i].color === socket.color)) {
                return true;
            }
        }
        return false;
    }

    socket.on('new-user', function (data, fn) {
//Mantenmos la session socket con el usuario ... 
        socket.nickname = data.nickname.toLowerCase(); //esto .. no funciona¿?
        socket.roomid = data.roomid.toLowerCase();
        socket.color = data.color.toLowerCase();
        socket.lat = 0;
        socket.lng = 0;
        socket.time = 0;
        socket.join(socket.roomid); //join al ROOMID
        var hoy = new Date().toLocaleTimeString();
        var roomid = socket.roomid;
        var usuario = {nickname: socket.nickname, color: socket.color, time: hoy};
        if (!aplicacion[roomid]) {
            var room = {
                "usuarios": [],
                "total": 0
            };
            Object.defineProperty(aplicacion, roomid, {value: room, writable: true, enumerable: true});
        }
        //Un REFRESH de browsers
        if (!existeUser(roomid)) {
            aplicacion[roomid].usuarios.push(usuario);
            aplicacion[roomid].total = aplicacion[roomid].total + 1;
        }

//Callback client
        fn({data: "ejemplo de uso de callback en socket.io"});
    });
    socket.on('user-join', function (data) {
        mensaje = ".... entrando en el mapa (" + socket.roomid + ")";
        socketlog(socket, mensaje);
        socket.in(socket.roomid).emit('messages', socket.nickname, mensaje);
        //FORZAMOS a que todos los clientes NOS envíen su posición
        io.sockets.in(socket.roomid).emit('force-posicion');
    });
    //Nou missatge
    socket.on('new-message', function (mensaje) {
        socketlog(socket, mensaje);
//        roomid = data.roomid;
        // messages.push(data);
        // io.sockets.emit('messages', messages);
        io.sockets.in(socket.roomid).emit('messages', socket.nickname, mensaje);
    });




    socket.on('update-position', function (lat, lng) {
        //un usuario Actualiza SU posición y emitimos a todos los datos de ESE usuario
        mensaje = "mensaje-server: lat: " + lat + ", lng: " + lng;
        socketlog(socket, mensaje);
        if (socket.roomid !== undefined) {
            io.sockets.in(socket.roomid).emit('usuarios', aplicacion[socket.roomid].usuarios, aplicacion[socket.roomid].total);
        }
        io.sockets.in(socket.roomid).emit('posicion', socket.nickname, lat, lng, socket.color);
    });
    function findClientsSocket(roomId, namespace) {
        var res = []
                , ns = io.of(namespace || "/"); // the default namespace is "/"

        if (ns) {
            for (var id in ns.connected) {
                if (roomId) {
                    var index = ns.connected[id].rooms.indexOf(roomId);
                    if (index !== -1) {
                        res.push(ns.connected[id]);
                    }
                } else {
                    res.push(ns.connected[id]);
                }
            }
        }
        return res;
    }

});
module.exports = {app: app, server: server};
