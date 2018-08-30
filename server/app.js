var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userSocket = null;
var robotSocket = null;

var robot = io
	.of('/robot')
	.on('connection', function(socket){
	  if (robotSocket == null) {
	  	robotSocket = socket;
	  	console.log('robot client connected');
	  } else {
	  	socket.disconnect(true);
	  }
	  socket.on('disconnect', function(){
	  	delete robotSocket;
	  	robotSocket = null;
	  	console.log('robot client disconnected');
	  });
	});

var user = io
	.of('/user')
	.on('connection', function(socket){
		if (userSocket == null) {
	  	userSocket = socket;
	  	console.log('user client connected');
	  } else {
	  	socket.disconnect(true);
	  }
	  socket.on('disconnect', function(){
	  	delete userSocket;
	  	userSocket = null;
	  	console.log('user client disconnected');
	  });
	  socket.on('command', function (msg) {
	  	if (robotSocket) {
		  	robotSocket.emit('command', { code: msg.code });
		  	console.log('user command: ' + msg.code);
		  } else {
		  	userSocket.emit('alert', { message: 'robot not connected' });
		  }
	  });
	});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3001, function(){
  console.log('listening on *:3000');
});