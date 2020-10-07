const express = require('express');
const http = require('http');
const socket = require('socket.io');

const port = process.env.PORT || 8080
 
var app = express();
 
// start the server
const server = http.createServer(app)
 
// initialize a new instance of socket.io by passing the HTTP server object
const io = socket(server);
 
// keep track of how many players in a game (0, 1, 2)
var players;
 
// create an array of 100 games and initialize them
var games = Array(100);
for (let i = 0; i < 100; i++) {
   games[i] = {players: 0 , pid: [0 , 0]};
}
 
// Add the static directory for our js and css files
app.use(express.static(__dirname + "/"));
 
app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
 
    // just assign a random number to every player that has connected
    // the numbers have no significance so it
    // doesn't matter if 2 people get the same number
    var playerId =  Math.floor((Math.random() * 100) + 1)
    console.log(playerId + ' connected');
    
    // if a user disconnects just print their playerID
    socket.on('disconnect', function () {
      console.log(playerId + ' disconnected');
    });
   });

io.on('connection', function(socket){})

var color;

socket.on('joined', function(roomId){
    if (games[roomId].players < 2) {
        games[roomId].players++;
        games[roomId].pid[games[roomId].players - 1] = playerId;
    } // else emit the full event
    else{
        socket.emit('full', roomId)
        return;
    }
    console.log(games[roomId]);
    players = games[roomId].players;
    if(players % 2 == 0) color = BLACK;
    else color = WHITE;

    socket.emit('player', {playerId, players, color, roomId})
   });

socket.on('move', function(msg){
    socket.broadcast.emit('move', msg);
});

// play emitted once two players are in the game
socket.on('play', function (msg) {
    socket.broadcast.emit('play', msg);
    console.log("ready " + msg);
   });

// when the user disconnects from the server, remove him from the game room
socket.on('disconnect', function () {
    for (let i = 0; i < 100; i++) {
        if (games[i].pid[0] == playerId || games[i].pid[1] == playerId)
            games[i].players--;
    }
    console.log(playerId + ' disconnected');
    
});