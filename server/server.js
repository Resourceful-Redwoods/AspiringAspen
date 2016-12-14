var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var bodyParser = require('body-parser');

var db = require('./db/database.js');
var Users = require('./db/usermodel.js');
var Cards = require('./db/cardmodel.js');
var Environments = require('./db/environmentmodel.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '..', 'client/public')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

/**** SOCKETS START ****/
/** SOCKETS DATA **/
let waiting = [];
let rooms = {};

io.on('connection', function(socket) {
  console.log(`User Connected - ${chalk.red(socket.id)}`);
  socket.data = {
    gameState: 'idle'
  };
  // Used for clients queueing up for new game, canceling match search, & quitting current game
  socket.on('game', function(action) {
    console.log(`${chalk.red(socket.id)} wants to ${chalk.green(action)}`);
    if (action === 'play') {
      if (socket.data.gameState === 'idle') {
        play(socket);
      }
    }
    if (action === 'cancel') {
      if (socket.data.gameState === 'waiting') {
        dequeue(socket);
      }
    }
    if (action === 'quit') {
      if (socket.data.gameState === 'playing') {
        declareWinner(getOpponent(socket));
      }
    }
  });

  socket.on('set username', function(name) {
    socket.data.username = name;
  });
  // Sends chat messages to sender & sender's opponent (only sends messages while in a game)
  socket.on('chat message', function(msg) {
    let message = {
      message: msg,
      user: socket.id
    };
    io.to(socket.data.room).emit('chat message', message);
  });

  socket.on('disconnect', function() {
    let gameState = socket.data.gameState;
    console.log(`${chalk.red(socket.id)} disconnected while ${chalk.green(gameState)}`);

    if (gameState === 'waiting') {
      return dequeue(socket);
    }

    if (gameState === 'playing') {
      declareWinner(getOpponent(socket));
    }
  });

  socket.on('play card', function(card) {
    let opponent = getOpponent(socket);
    let room = rooms[socket.data.room];
    let category = room.board.currentCategory;
    let oppCard = opponent.data.hand.selectedCard;

    socket.data.hand.selectedCard = socket.data.hand.currentHand[card];
    socket.emit('card played');

    // TODO: Add event for invalid card played
    if (oppCard) { // Determine winner if both players have played
      let sockCard = socket.data.hand.selectedCard;
      room.game.count++;

      // Send opponent's card data for rendering
      socket.emit('opponent card', oppCard);
      opponent.emit('opponent card', sockCard);

      // Compare cards to determine winner
      // (current data cannot lead to ties)

      if (sockCard.info[category] > oppCard.info[category]) {
        room.game.rounds.wins[socket.id]++;
        socket.emit('round end', 'win');
        opponent.emit('round end', 'loss');
      } else {
        room.game.rounds.wins[opponent.id]++;
        opponent.emit('round end', 'win');
        socket.emit('round end', 'loss');
      }

      // Check if either player has won the game
      if (room.game.rounds.wins[socket.id] >= room.game.rounds.total / 2) {
        declareWinner(socket);
      } else if (room.game.rounds.wins[opponent.id] >= room.game.rounds.total / 2) {
        declareWinner(opponent);
      } else {
        // Removes the selected card from the players' hands
        delete socket.data.hand.selectedCard;
        delete opponent.data.hand.selectedCard;

        // Deselects the currently selected cards
        socket.data.hand.selectedCard = null;
        opponent.data.hand.selectedCard = null;

        chooseCategory(socket.data.room);
      }
    }
  });
});

/**** SOCKETS END ****/
/*** SOCKETS HELPERS START ***/

function makeRoom(sock1, sock2) {
  let room = sock1.id + sock2.id;
  _.extend(sock1.data, {
    room: room,
    opponent: sock2.id,
    gameState: 'playing',
    username: sock1.data.username || 'Guest'
  });

  _.extend(sock2.data, {
    room: room,
    opponent: sock1.id,
    gameState: 'playing',
    username: sock2.data.username || 'Guest'
  });

  sock1.join(room);
  sock2.join(room);

  rooms[room] = newGame(sock1.id, sock2.id);
  console.log(`Made Room: ${chalk.yellow(room)} with ${chalk.red(sock1.id)} & ${chalk.red(sock2.id)}`);

  sock1.emit('opponent username', sock2.data.username);
  sock2.emit('opponent username', sock1.data.username);

  sock1.emit('hand', sock1.data.hand);
  sock2.emit('hand', sock2.data.hand);
  chooseCategory(room);

  // Creates new game data & stores new hands for both clients
  function newGame(id1, id2, size = 5) {
    let dummyDeck = require('./data/baseballData.js');
    // Returns two hands drawn from the dekc
    function dealHands() {
      let cards = Object.keys(dummyDeck);
      let hand1 = {};
      let hand2 = {};

      // Draws a random card from the deck, removing it from the deck
      function drawCard() {
        let cardIndex = Math.floor(Math.random() * cards.length);
        let card = cards.splice(cardIndex, 1)[0];
        return dummyDeck[card];
      }

      // Alternates drawing a card for each hand
      for (let i = 1; i <= size * 2; i++) {
        let card = drawCard();
        if (i % 2) {
          hand1[card.name] = card;
        } else {
          hand2[card.name] = card;
        }
      }
      return [hand1, hand2];
    }

    let hands = dealHands();

    // Initialize the game
    let match = {
      id: id1 + id2,
      game: {
        rounds: {
          total: size,
          count: 0,
          wins: {}
        },
        categories: ['Home Runs', 'Stolen Bases', 'Average', 'Hits', 'RBI']
      },
      board: {
        currentCategory: null
      }
    };

    getSocket(id1).data.hand = {
      currentHand: hands.shift(),
      selectedCard: null
    };

    getSocket(id2).data.hand = {
      currentHand: hands.shift(),
      selectedCard: null
    };

    match.game.rounds.wins[id1] = 0;
    match.game.rounds.wins[id2] = 0;

    return match;
  }
}

// Returns the socket matching the socket id, if connected
function getSocket(socketId) {
  let socket = io.sockets.connected[socketId];

  if (!socket) {
    console.log(`Can not find socket ${chalk.red(socketId)} in connected sockets`);
    return null;
  }

  return socket;
}

// Returns the socket belonging to the client's opponent
function getOpponent(socket) {
  if (!socket) {
    return null;
  }
  return getSocket(socket.data.opponent);
}

/*
  Matches the player with the first person in the queue to play
  places the player in the queue otherwise
*/
function play(socket) {
  if (waiting.length) {
    let opponent = getSocket(waiting.shift());
    if (!opponent || opponent.data.gameState !== 'waiting') { //safeguards against certain async issues
      return setTimeout(play.bind(this, socket), 0);
    }

    // Alerts the client that a match has been found
    socket.emit('enter game', opponent.data.username);
    opponent.emit('enter game', socket.data.username);
    makeRoom(socket, opponent);
  } else {
    queue(socket);
  }
}

// Adds the client to the queue, if they are not already queued or playing
function queue(socket) {
  if (socket.data.gameState === 'idle') {
    waiting.push(socket.id);
    socket.data.gameState = 'waiting';
  }
}

// Removes a client from the queue, if they are waiting to play
function dequeue(socket) {
  if (socket.data.gameState === 'waiting') {
    waiting.splice(waiting.indexOf(socket.id), 1);
    socket.data.gameState === 'idle';
    socket.emit('dequeued');
  }
}

// Removes client from the game they're in
function leaveGame(socket) {
  if (socket) {
    socket.leave(socket.data.room);
    socket.data.gameState = 'idle';
    delete socket.data.room;
    delete socket.data.opponent;
  }
}

// Notifies clients in a match of the winner of that match &
// removes clients from the game they were in
function declareWinner(winner) {
  if (winner) {
    winner.emit('game end', 'win');
    console.log(`${chalk.red(winner.id)} ${chalk.magenta('wins')}`);
  }
  let loser = getOpponent(winner);
  if (loser) {
    console.log(`${chalk.red(loser.data.opponent)} ${chalk.magenta('wins')}`);
    loser.emit('game end', 'lose');
    leaveGame(loser);
  }
  leaveGame(winner);
}

// Randomly chooses a category from all avaiable categories
// then emits that to both clients of a game (starting the next round)
function chooseCategory(room) {
  let category = _.sample(rooms[room].game.categories);
  rooms[room].board.currentCategory = category;
  io.to(room).emit('category', category);
}

/*** SOCKETS HELPERS END ***/

const port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log(`DeckStomp listening on port ${chalk.yellow(port)}`);
});
