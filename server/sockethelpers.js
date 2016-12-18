var _ = require('lodash');
var chalk = require('chalk');
var io = require('./server.js');
var datahelpers = require('./datahelpers.js');
var Users = require('./db/usermodel.js');
var bcrypt = require('bcrypt');


let waiting = [];
let rooms = {};

// Alerts front end that user data has changed
const changeUserStatus = function(username, status) {
  Users.update({name: username}, {$set: { status: status}}, function(err, user) {
    if (err) {
      console.error(err);
    }
  });
};

const increaseUserWins = function(username) {
  Users.update({name: username}, {$inc: { wins: 1}}, function(err, user) {
    if (err) {
      console.error(err);
    }
  });
};

const increaseUserLosses = function(username) {
  Users.update({name: username}, {$inc: { losses: 1}}, function(err, user) {
    if (err) {
      console.error(err);
    }
  });
};

// Returns the socket matching the socket id, if connected
const getSocket = function (socketId) {
  let socket = io.sockets.connected[socketId];
  if (!socket) {
    console.log(`Can not find socket ${chalk.red(socketId)} in connected sockets`);
    return null;
  }
  return socket;
};

// Returns the socket belonging to the client's opponent
const getOpponent = function (socket) {
  if (!socket) {
    return null;
  }
  return getSocket(socket.data.opponent);
};

// Adds the client to the queue, if they are not already queued or playing
const queue = function (socket) {
  if (socket.data.gameState === 'idle') {
    waiting.push(socket.id);
    socket.data.gameState = 'waiting';
  }
  // changeUserStatus(socket.data.username, 'online');
};

// Removes a client from the queue, if they are waiting to play
const dequeue = function (socket) {
  if (socket.data.gameState === 'waiting') {
    waiting.splice(waiting.indexOf(socket.id), 1);
    socket.data.gameState === 'idle';
    // Currently there is no listener for dequeued event...
    socket.emit('dequeued');
  }
};

// Randomly chooses a location from all avaiable locations
// then emits that to both clients of a game (starting the next round)
const chooseLocation = function(room) {
  datahelpers.getAllEnvironmentsData(function(locations) {
    let location = _.sample(locations);
    rooms[room].game.locations = locations;
    rooms[room].board.currentLocation = location;
    io.to(room).emit('location', location);
  });
};

// Draws a random card from the deck, removing it from the deck
const drawCard = function (cards) {
  let cardIndex = Math.floor(Math.random() * cards.length);
  let card = cards.splice(cardIndex, 1)[0];
  return card;
};

// Returns two hands drawn from the deck
const dealHands = function (deck, size) {
  let cards = deck.slice();
  let hand1 = {};
  let hand2 = {};

  // Alternates drawing a card for each hand
  for (let i = 1; i <= size * 2; i++) {
    let card = drawCard(cards);
    if (i % 2) {
      hand1[card.name] = card;
    } else {
      hand2[card.name] = card;
    }
  }
  return [hand1, hand2];
};

// Creates new game data & stores new hands for both clients
const newGame = function (sock1, sock2, size = 5) {
  return datahelpers.getAllCardsData(function(cards) {
    const room = sock1.id + sock2.id;
    let hands = dealHands(cards, size);
    // Initialize the game
    let match = {
      id: room,
      game: {
        rounds: {
          total: size,
          count: 0,
          wins: {}
        },
      },
      board: {
        currentLocation: null
      }
    };

    sock1.data.hand = {
      currentHand: hands.shift(),
      selectedCard: null
    };

    sock2.data.hand = {
      currentHand: hands.shift(),
      selectedCard: null
    };

    match.game.rounds.wins[sock1.id] = 0;
    match.game.rounds.wins[sock2.id] = 0;

    rooms[room] = match;

    sock1.emit('opponent username', sock2.data.username);
    sock2.emit('opponent username', sock1.data.username);

    sock1.emit('hand', sock1.data.hand);
    sock2.emit('hand', sock2.data.hand);

    chooseLocation(room);
  });
};

const makeRoom = function (sock1, sock2) {
  let room = sock1.id + sock2.id;
  _.extend(sock1.data, {
    room: room,
    opponent: sock2.id,
    opponentUsername: sock2.data.username || 'Opponent',
    gameState: 'playing',
    username: sock1.data.username || 'Guest'
  });

  _.extend(sock2.data, {
    room: room,
    opponent: sock1.id,
    opponentUsername: sock1.data.username || 'Opponent',
    gameState: 'playing',
    username: sock2.data.username || 'Guest'
  });


  sock1.join(room);
  sock2.join(room);


  io.to(room).emit('push chat message', {message: 'Only one of you will walk away from this...', user: 'admin'});

  console.log(`Made Room: ${chalk.yellow(room)} with ${chalk.red(sock1.id)} & ${chalk.red(sock2.id)}`);

  newGame(sock1, sock2);

  changeUserStatus(sock1.data.username, 'in game');
  changeUserStatus(sock2.data.username, 'in game');
};

/*
  Matches the player with the first person in the queue to play
  places the player in the queue otherwise
*/
const play = function (socket) {
  if (waiting.length) {
    let opponent = getSocket(waiting.shift());
    if (!opponent || opponent.data.gameState !== 'waiting') { //safeguards against certain async issues
      return setTimeout(play.bind(this, socket), 0);
    }

    // Alerts the client that a match has been found
    socket.emit('enter game');
    opponent.emit('enter game');
    makeRoom(socket, opponent);

  } else {
    queue(socket);
  }
};

// Removes client from the game they're in
const leaveGame = function (socket) {
  if (socket) {
    socket.leave(socket.data.room);
    socket.data.gameState = 'idle';
    delete socket.data.room;
    delete socket.data.opponent;

    changeUserStatus(socket.data.username, 'online');

    console.log(`User exited game - ${chalk.red(socket.id)}`);
  }
};

// Notifies clients in a match of the winner of that match &
// removes clients from the game they were in
const declareWinner = function (winner) {
  if (winner) {
    winner.emit('game end', 'win');
    console.log(`${chalk.red(winner.id)} ${chalk.magenta('wins')}`);
  }
  let loser = getOpponent(winner);
  if (loser) {
    console.log(`${chalk.red(loser.data.opponent)} ${chalk.magenta('wins')}`);
    loser.emit('game end', 'lose');
  }
};

// Listeners


const socketQueueListener = function (socket) {
  socket.on('queue', function(action) {
    console.log(`${chalk.red(socket.id)} wants to ${chalk.green(action)}`);
    if (action === 'enqueue') {
      if (socket.data.gameState === 'idle') {
        play(socket);
      }
    }
    if (action === 'dequeue') {
      if (socket.data.gameState === 'waiting') {
        dequeue(socket);
      }
    }
  });
};

// Sends userlist to populate leaderboard
const socketSendUsers = function(socket) {
  Users.find().exec(function(err, users) {
    if (err) {
      console.error(err);
    }
    socket.emit('populate userdata', users);
  });
};

const socketSetUsernameListener = function (socket) {
  socket.on('set username', function(name, password) {
    Users.findOne({name: name})
    .exec((err, user)=>{
      if (err) {
        console.error(err);
        return;
      }
      if (!user) {
        bcrypt.hash(password, 5, function(err, hash) {
          if (err) {
            throw err;
          }
          console.log('hashed', password, hash);
          Users.create({
            name: name,
            password: hash,
            wins: 0,
            losses: 0,
            status: 'online'
          }, function(err, user) {
            socket.data.username = user.name;
            changeUserStatus(socket.data.username, 'online');
          });  
        });
      } else {
        socket.data.username = user.name;
      }
    });
  });
};

const socketChatMessageListener = function (socket) {
  socket.on('user chat message', function(msg) {
    let message = {
      message: msg,
      user: socket.id
    };

    io.to(socket.data.room).emit('push chat message', message);
  });
};


const socketDisconnectListener = function(socket) {
  socket.on('disconnect', function() {
    let gameState = socket.data.gameState;
    console.log(`${chalk.red(socket.id)} disconnected while ${chalk.green(gameState)}`);

    if (gameState === 'waiting') {
      changeUserStatus(socket.data.username, 'offline');
      return dequeue(socket);
    }

    if (gameState === 'playing') {
      declareWinner(getOpponent(socket));
    }
    changeUserStatus(socket.data.username, 'offline');
  });
};

const socketPlayCardListener = function(socket) {
  socket.on('play card', function(card) {
    let opponent = getOpponent(socket);
    let room = rooms[socket.data.room];
    let location = room.board.currentLocation;
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
      let sockCardPower = sockCard['power'];
      let oppCardPower = oppCard['power'];

      sockCardPower += location['affects'][sockCard.type] + sockCard['advantages'][oppCard.type];
      oppCardPower += location['affects'][oppCard.type] + oppCard['advantages'][sockCard.type];
      if (sockCardPower > oppCardPower) {
        room.game.rounds.wins[socket.id]++;
        socket.emit('round end', 'You are mighty and crushed your foe!');
        opponent.emit('round end', 'You were outmatched and defeated.');
      } else if (sockCardPower === oppCardPower) {
        var randomSelector = Math.random();
        if (randomSelector > .5) {
          room.game.rounds.wins[socket.id]++;
          socket.emit('round end', 'While evenly matched the Universe favors you. WIN');
          opponent.emit('round end', 'tie');
        } else {
          room.game.rounds.wins[opponent.id]++;
          opponent.emit('round end', 'While evenly matched the Universe favors you. WIN');
          socket.emit('round end', 'tie');
        }
      } else {
        room.game.rounds.wins[opponent.id]++;
        opponent.emit('round end', 'win');
        socket.emit('round end', 'loss');
      }

    // Check if either player has won the game
      if (room.game.rounds.wins[socket.id] >= room.game.rounds.total / 2) {
        declareWinner(socket);

        increaseUserWins(socket.data.username);
        increaseUserLosses(opponent.data.username);


      } else if (room.game.rounds.wins[opponent.id] >= room.game.rounds.total / 2) {
        declareWinner(opponent);

        increaseUserWins(opponent.data.username);
        increaseUserLosses(socket.data.username);

      } else {
      // Removes the selected card from the players' hands
        delete socket.data.hand.selectedCard;
        delete opponent.data.hand.selectedCard;

      // Deselects the currently selected cards
        socket.data.hand.selectedCard = null;
        opponent.data.hand.selectedCard = null;

        chooseLocation(socket.data.room);
      }
    }
  });
};

// Sends userlist to populate leaderboard
const socketSendUsersListener = function(socket) {
  socket.on('send me userdata', function(cb) {
    Users.find().exec(function(err, users) {
      if (err) {
        console.error(err);
      }
      cb(users);
    });
  });
};

const socketExitGameListener = function(socket) {
  socket.on('game exit', function() {
    var opponent = getOpponent(socket);
    if (opponent) {
      opponent.emit('opponent exited');
      io.to(socket.data.room).emit('push chat message', {message: `${opponent.data.username} has left the game.`, user: 'admin'});
    }
    leaveGame(socket);
  });
};

const socketRematchRequestListener = function(socket) {
  socket.on('rematch', function() {
    var opponent = getOpponent(socket);
    if (!socket.data.rematchSelf) { // only broadcast 'wants to rematch' message once
      io.to(socket.data.room).emit('push chat message', {message: `${opponent.data.username} wants to rematch.`, user: 'admin'});
    }
    opponent.data.rematchOpponent = true;
    socket.data.rematchSelf = true;
    if (socket.data.rematchOpponent) { // if both want a rematch
      console.log(`${chalk.red(socket.id)} and ${chalk.red(socket.data.opponent)} want to have a rematch!`);
      io.to(socket.data.room).emit('rematch accepted');
      io.to(socket.data.room).emit('push chat message', {message: `${socket.data.username} and ${opponent.data.username} will battle to the death once again.`, user: 'admin'});
      opponent.data.rematchOpponent = false;
      opponent.data.rematchSelf = false;
      socket.data.rematchSelf = false;
      socket.data.rematchOpponent = false;
      // make sure the order of socket ids matches the current room name
      if (socket.data.room === socket.id + socket.data.opponent) {
        newGame(socket, opponent);
      } else if (socket.data.room === socket.data.opponent + socket.id) {
        newGame(opponent, socket);
      }
    }
  });
};

const socketCheckAuth = function (socket) {
  socket.on('checkAuth', function(loginDataObj) {
    Users.findOne({name: loginDataObj.username})
    .exec((err, user)=>{
      if (err) {
        console.error(err);
        return;
      }
      if (!user) {
        socket.emit('checkedAuth', false);
      } else {
        bcrypt.compare(loginDataObj.password, user.password, function(err, res) {
          if (res) {
            socket.emit('checkedAuth', true);
            changeUserStatus(user.name, 'online');
          } else {
            socket.emit('checkedAuth', false);
          }
        });
      }
    });
  });
};

const socketCheckUsernameAvailability = function (socket) {
  socket.on('checkUsernameAvailability', function(loginDataObj) {
    Users.findOne({name: loginDataObj.username})
    .exec((err, user)=>{
      if (err) {
        console.error(err);
        return;
      }
      if (!user) {
        socket.emit('checkedUsernameAvailability', false);
      } else {
        socket.emit('checkedUsernameAvailability', true);
      }
    });
  });
};

module.exports = {
  socketExitGameListener: socketExitGameListener,
  socketQueueListener: socketQueueListener,
  socketSetUsernameListener: socketSetUsernameListener,
  socketChatMessageListener: socketChatMessageListener,
  socketDisconnectListener: socketDisconnectListener,
  socketPlayCardListener: socketPlayCardListener,
  socketSendUsersListener: socketSendUsersListener,
  socketRematchRequestListener: socketRematchRequestListener,
  socketCheckAuth: socketCheckAuth,
  socketCheckUsernameAvailability: socketCheckUsernameAvailability
};
