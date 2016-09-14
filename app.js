var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var cors = require("cors");
var routes = require('./routes/index');
var morgan = require('morgan');
//Servidor
var app = express();
var server = require("http").Server(app); //for websocket
var io = require("socket.io")(server); //for websocket



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(cors());
app.use(morgan('combined'))

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
var User = require("./models/users.js").User;
io.on('connection', function (socket) {

    function socketlog(socket, mensaje) {
//        console.log("-- SOCKET --");
//        console.log(socket);
        console.log("----------------------------------------------");
        console.log("------ Socket.roomid:" + socket.roomid);
        console.log("------ Socket.nickname:" + socket.nickname);
        console.log("------ Socket.lat:" + socket.lat);
        console.log("------ Socket.lng:" + socket.lng);
        console.log("------ Socket.time:" + socket.time);
        console.log("------ mensaje:" + mensaje);
        console.log("----------------------------------------------");
    }
//    function socketlog_variables(socket) {
//        mensaje = "usuarios de la Room (" + socket.roomid + ") ";
//        console.log("*************************************");
//        console.log(mensaje);
//        console.log("*************************************");
//        socket.emit('messages', "SYSTEM", mensaje);
//    }


    socket.on('new-user', function (data, fn) {
        //Mantenmos la session socket con el usuario ... 
        socket.nickname = data.nickname.toLowerCase(); //esto .. no funciona¿?
        socket.roomid = data.roomid.toLowerCase();
        socket.lat = 0;
        socket.lng = 0;
        socket.time = 0;
        socket.join(socket.roomid); //join al ROOMID

//        User.add(data);  //Añadimos el nuevo usuario al sistema
        //Callback client
        fn({data: "ejemplo de uso de callback en socket.io"});
    });
    socket.on('user-join', function (data) {
        mensaje = socket.nickname + " entrando en sala (" + socket.roomid + ")";
        socket.in(socket.roomid).emit('messages', socket.nickname, mensaje);
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
        //un usuario Actualiza SU posición
        mensaje = "mensaje-server: " + socket.nickname + ". lat: " + lat + ", lng: " + lng;
        socketlog(socket, mensaje);
        io.sockets.in(socket.roomid).emit('messages', socket.nickname, "update position");
        io.sockets.in(socket.roomid).emit('posicion', socket.nickname, lat, lng);
    });
    //Rebem la nova posició del usuaris d'un usuari i actualitzem 
    //la posició de la resta d'usuaris
//    socket.on('KKK_update-position', function (data) {
//        return false;
//        roomid = data.roomid;
//        console.log("-- RoomID:" + data.roomid);
//        console.log("-- Socket.roomid:" + socket.roomid);
//        User.update(data);
//        users_room = User.dameUsuarios(roomid);
//        if (!users_room) {
//            return false;
//        }
//        // console.log("usuarios=========================");
//        total = Object.getOwnPropertyNames(users_room).length;
//        console.log("usuarios habitación: (" + roomid + ") => " + total);
//        // console.log("users_room_______________________________________________");
//        // console.log(users_room);
//
//        //Noo podemos 'emitir' objetos, solo arrays.
//        var numeric_array = [];
//        for (var item in users_room) {
//            numeric_array.push(users_room[item]);
//        }
//
//        io.sockets.in(roomid).emit('usuarios', numeric_array);
//    });
});
module.exports = {app: app, server: server};
