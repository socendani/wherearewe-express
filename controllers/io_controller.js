


io.on('connection', function (socket) {
  var hoy = new Date().toLocaleTimeString();

  var cookie_string = socket.handshake.headers.cookie;
  var parsed_cookies = require('cookie').parse(cookie_string);
  var sid = cookieParser.signedCookie(parsed_cookies['connect.sid'], conf.secret);
  //con el sid.. podem coger la session
  mongoStore.get(sid, function (err, session) {
    if (err) console.log("session store err".red, error);
    // console.log(session);
    socket.sid = sid;
    socket.nickname = session.nickname;
    socket.room = session.room;
    socket.color = session.color;

    //JOIN del canal.
    socket.join(socket.room);

    

  });


  /****************  MENSAJES    *********************/
  socket.on('user-join', function (data, fn) {
    mensaje = "... entrando en mapa.";
    socketlog(socket, mensaje);
    //TODO: Controlar.. si es la primera vez.. hacer un emisión al CANAL de welcome..callback
    var m = new mensajes().crear(mensaje, function (err, obj) {
      if (err) return audit.error(err);
      io.sockets.in(socket.room).emit('messages', socket.nickname, mensaje);
    });

  });

  socket.on('user-left', function (data, fn) {
    mensaje = "... saliendo del mapa (" + socket.room + ")";
    socketlog(socket, mensaje);
    var m = new mensajes().crear(mensaje, function (err, obj) {
      if (err) return audit.error(err);
      io.sockets.in(socket.room).emit('messages', socket.nickname, mensaje);
      fn("logout");
    });
    //     //emitimos usuarios
    //     //        io.sockets.in(socket.room).emit('usuarios', aplicacion[socket.room].usuarios, aplicacion[socket.room].total);


  });




  socket.on('message-new', function (mensaje) {
    socketlog(socket, mensaje);
    var m = new mensajes().crear(mensaje, function (err, obj) {
      if (err) return audit.error(err);
      io.sockets.in(socket.room).emit('messages', socket.nickname, mensaje);
    });
  });


  socket.on('position-update', function (lat, lng) {
    //un usuario Actualiza SU posición y guardamos esa INFO
    mensaje = "position-update-server: ["+socket.nickname+"] lat: " + lat + ", lng: " + lng;
    console.log(mensaje);
    users.findOneAndUpdate({ "_id": socket.sid }, { $set: {"lat":lat, "lng": lng } }, { upsert: true, new: false }, function (error, doc) {
      if (error) return audit.error(error); 
      // console.log(doc);

    });
    //Actulizamos la posicion del USUARIO y punto.
    // socketlog(socket, mensaje);
    // if (socket.room !== undefined) {
    //   io.sockets.in(socket.room).emit('usuarios', aplicacion[socket.room].usuarios, aplicacion[socket.room].total);
    // }
    // io.sockets.in(socket.room).emit('posicion', socket.nickname, lat, lng, socket.color);
  });

  socket.on('position-request', function (mensaje) {
    var room = socket.room;
    var u = new users();
    u.getUsersFromRoom(socket.room, function (err, users) {
      if (err) return audit.error(err);
      io.sockets.in(socket.room).emit('position-markers', users);
    });
  });



  // /***********  Funciones useful for io   ************/
  function socketlog(socket, mensaje) {
    // var m = socket.nickname + "::" + socket.room + ' - > ' + mensaje;
    // console.log(m);
    audit.log(mensaje);
  }



});
