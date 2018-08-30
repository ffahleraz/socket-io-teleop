const io = require('socket.io-client');
const socket = io('http://localhost:3001/robot');

var commandCode = 'stop';

socket.on('command', function(msg){
  commandCode = msg.code;
});

setInterval(() => { console.log(commandCode); }, 50);
