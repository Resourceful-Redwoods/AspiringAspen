var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var bodyParser = require('body-parser');

var playerData = require('./data/baseballData.js');
var helper = require('./util/helper.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '..', 'client/public')));

// players is set up to send back player data to be used in the game
// right now it is using dummy data in data/baseballData.js
// TODO: use api to have all player information

app.get('/players', function (req, res) {
  console.log('get /players');
  res.json(playerData);
});

app.get('/deck', function (req, res) {
  console.log('get /deck');
  var team = {
    hand: []
  };

  res.json( helper.getDeck(playerData, team.hand, 2 ) );
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

/**** SOCKETS START ****/
/** SOCKETS DATA **/
let waiting = [];
let rooms = {};

io.on('connection', function(socket) { // 'chat message' used to console.log (for now)
  console.log(`User Connected - ${chalk.red(socket.id)}`);
  socket.emit('chat message', `Your Id: ${socket.id}`);
  socket.data = {
    gameState: 'idle'
  };

  socket.on('game', function(action) {
    if (action === 'play') { //TODO: Forfeit if already in a game, do nothing if already waiting
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

  socket.on('select card', function(card) {
    console.log('select card', card);
    socket.data.hand.selectedCard = card;
    socket.emit('card selected', card);
  });

  socket.on('chat message', function(msg) {
    io.to(socket.data.room).emit('chat message', msg);
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

  socket.on('play card', function(card) { // TODO: Verify functionality
    let opponent = getOpponent(socket);
    let room = rooms[socket.data.room];
    let category = room.board.currentCategory;
    let oppCard = opponent.data.hand.selectedCard;
    socket.data.hand.selectedCard = socket.data.currentHand[card];

    socket.emit('card played');
    
    // TODO: Add event for invalid card played
    if (oppCard) {
      let sockCard = socket.data.hand.selectedCard;
      room.game.count++;

      if (sockCard[category] > oppCard[category]) { // Current data has no equal values
        room.game.wins[socket.id]++;
        socket.emit('round end', socket.id);
        opponent.emit('round end', socket.id);
      } else {
        room.game.wins[opponent.id]++;
        socket.emit('round end', opponent.id);
        opponent.emit('round end', opponent.id);
      }

      if (room.game.wins[socket.id] >= room.game.rounds.total / 2) {
        declareWinner(socket);
      } else if (room.game.wins[opponent.id] >= room.game.rounds.total / 2) {
        declareWinner(opponent);
      } else {
        // Removes the selected card from the players' hands
        delete socket.data.selectedCard;
        delete opponent.data.selectedCard;

        socket.data.selectedCard = null;
        opponent.data.selectedCard = null;

        chooseCategory(socket.data.room);
      }
    }
  });
});

/**** SOCKETS END ****/
/*** SOCKETS HELPERS START ***/

function newGame(id1, id2, size = 3) {
  var dummyDeck = require('./data/baseballData.js');

  function dealHands() {
    let cards = Object.keys(dummyDeck);
    let hand1 = {};
    let hand2 = {};

    function drawCard() {
      let cardIndex = Math.floor(Math.random() * cards.length);
      let card = cards.splice(cardIndex, 1)[0];
      return dummyDeck[card];
    }

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

  var hands = dealHands();

  var match = {
    id: id1 + id2,
    game: {
      rounds: {
        total: size,
        count: 0,
        wins: {}
      },
      categories: ['hr', 'sb', 'avg', 'hits', 'rbi']
    },
    board: {
      currentCategory: null,
      currentRound: {
        outcome: null
      }
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

function makeRoom(sock1, sock2) {
  let room = sock1.id + sock2.id;
  _.extend(sock1.data, {
    room: room,
    opponent: sock2.id,
    gameState: 'playing',
    username: null
  });

  _.extend(sock2.data, {
    room: room,
    opponent: sock1.id,
    gameState: 'playing',
    username: null
  });

  sock1.join(room);
  sock2.join(room);

  rooms[room] = newGame(sock1.id, sock2.id);
  console.log(`Made Room: ${chalk.yellow(room)} with ${chalk.red(sock1.id)} & ${chalk.red(sock2.id)}`);
  sock1.emit('hand', sock1.data.hand);
  sock2.emit('hand', sock2.data.hand);
  chooseCategory(room);
}

function getSocket(socketId) {
  let socket = io.sockets.connected[socketId];

  if (!socket) {
    console.log(`Can not find socket ${chalk.red(socketId)} in connected sockets`);
    return null;
  }

  return socket;
}

function getOpponent(socket) {
  return getSocket(socket.data.opponent);
}

function play(socket) {
  if (waiting.length) {
    let opponent = getSocket(waiting.shift());
    if (!opponent || opponent.data.gameState !== 'waiting') { //safeguards against certain async issues
      return setTimeout(play.bind(this, socket), 0);
    }
    socket.emit('enter game');
    opponent.emit('enter game');
    makeRoom(socket, opponent);
    let room = socket.data.room;
    io.to(room).emit('chat message', `In room: ${room}`);
  } else {
    queue(socket);
  }
}

function queue(socket) {
  waiting.push(socket.id);
  socket.data.gameState = 'waiting';
  socket.emit('chat message', 'Searching for opponent...');
}

function dequeue(socket) {
  if (socket.data.gameState === 'waiting') {
    waiting.splice(waiting.indexOf(socket.id), 1);
    socket.data.gameState === 'idle';
    socket.emit('dequeued');
  }
}

function leaveGame(socket) {
  socket.leave(socket.data.room);
  delete socket.data.room;
  delete socket.data.opponent;
}

function declareWinner(winner) {
  winner.emit('game end', 'win');
  console.log(`${chalk.red(winner.id)} ${chalk.magenta('wins')}`);
  console.log(`${chalk.red(winner.data.opponent)} ${chalk.magenta('loses')}`);
  let loser = getOpponent(winner);
  if (loser) {
    loser.emit('game end', 'lose');
    leaveGame(loser);
  }
  leaveGame(winner);
}

function chooseCategory(room) {
  let category = _.sample(rooms[room].game.categories);
  rooms[room].board.currentCategory = category;
  console.log('in chooseCategory');
  io.to(room).emit('category', category);
  return category;
}

/*** SOCKETS HELPERS END ***/



http.listen(3000, function () {
  console.log(`DeckStomp listening on port ${chalk.yellow('3000')}`);
});
