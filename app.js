var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.static('./public'));
});

server.listen(app.get('port'), function(){
  console.log("listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  socket.on('image', function (dataUrl) {
    socket.broadcast.emit('image', dataUrl);
  })
});