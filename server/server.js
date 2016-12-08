var express = require('express')
var path = require('path');
var bodyParser = require('body-parser');

var playerData = require('./data/baseballData.js');

var app = express();

app.use('/static', express.static(path.join(__dirname, '/../client/public')));

app.get('/', function (req, res) {
  console.log('get /');
  res.send('Deck Stomp!!!')
});

// players is set up to send back player data to be used in the game
// right now it is using dummy data in data/baseballData.js
// TODO: use api to have all player information

app.get('/players', function (req, res) {
  console.log('get /players')
  res.json(playerData)
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});