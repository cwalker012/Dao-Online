var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var players = {};
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    players[socket.id] = {
        playerId: socket.id
    }
    socket.on('disconnect', function () {
        // remove this player from our players object
        delete players[socket.id];
        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);
        console.log('user disconnected');
    });
  });

server.listen(8081, function () {
    console.log(`Listening on ${server.address().port}`);
});