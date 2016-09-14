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
var server = require("http").Server(app);  //for websocket
var io = require("socket.io")(server); //for websocket



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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


//Lògica de Servidor

var messages = [];

io.on('connection', function (socket) {

  socket.on('new-user', function (data) {
    roomid = data.roomid;
    nickname = data.nickname;
    console.log(nickname + ', se ha conectado con Sockets a la Room ' + roomid);
    //joined
    socket.join(roomid);  //join al ROOMID

    var User = require("./models/users.js").User;
    User.add(data);
    //Welcome..NO NEED
    // messages = [{
    //   roomid: roomid,
    //   text: "..entrando en " + roomid,
    //   nickname: ""
    // }];
    // socket.in(roomid).emit('messages', messages);

    //Recogemos los mensages anteriores?

  });

  //Rebem la nova posició del usuaris d'un usuari i actualitzem 
  //la posició de la resta d'usuaris
  socket.on('update-position', function (data) {
    roomid = data.roomid;

    var User = require("./models/users.js").User;
    User.update(data);
    
    users_room = User.dameUsuarios(roomid);
    if (!users_room) {
      return false;
    }
    // console.log("usuarios=========================");
    total = Object.getOwnPropertyNames(users_room).length;
    console.log("usuarios habitación: (" + roomid + ") => " + total);
    // console.log("users_room_______________________________________________");
    // console.log(users_room);

    //Noo podemos 'emitir' objetos, solo arrays.
    var numeric_array = [];
    for (var item in users_room) {
      numeric_array.push(users_room[item]);
    }

    io.sockets.in(roomid).emit('usuarios', numeric_array);
  });


  // socket.emit('messages', messages);
  //Nou missatge
  socket.on('new-message', function (data) {
    console.log(data);
    roomid = data.roomid;
    messages.push(data);
    // io.sockets.emit('messages', messages);
    io.sockets.in(roomid).emit('messages', messages);
  });







});

module.exports = { app: app, server: server };
