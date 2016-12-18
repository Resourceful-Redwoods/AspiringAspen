var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = module.exports = require('socket.io')(http);
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var bodyParser = require('body-parser');
var socketHelpers = require('./sockethelpers.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '..', 'client/public')));
// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

io.on('connection', function(socket) {
  console.log(`User Connected - ${chalk.red(socket.id)}`);
  socket.data = {
    gameState: 'idle'
  };

  // Listens for client to request user list for populating leaderboard
  socketHelpers.socketSendUsersListener(socket);

  // Used for clients queueing up for new game, canceling match search, & quitting current game
  socketHelpers.socketQueueListener(socket);

  // Listens for a username, stores it in DB if necessary, & sets socket.data.username with their username
  socketHelpers.socketSetUsernameListener(socket);

  // Sends chat messages to sender & sender's opponent (only sends messages while in a game)
  socketHelpers.socketChatMessageListener(socket);

  // Listens for disconnected users
  socketHelpers.socketDisconnectListener(socket);

  // Listens for played cards & handles checking logic
  socketHelpers.socketPlayCardListener(socket);

  // Listens for game exits
  socketHelpers.socketExitGameListener(socket);

  // Listens for rematch requests
  socketHelpers.socketRematchRequestListener(socket);

  //Listens for signin request
  socketHelpers.socketCheckAuth(socket);

  //Listens for Signup request
  socketHelpers.socketCheckUsernameAvailability(socket);

  // Listens for challenge events
  socketHelpers.socketChallengeListener(socket);
});

const port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log(`DeckStomp listening on port ${chalk.yellow(port)}`);
});
