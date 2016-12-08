var express = require('express')
var path = require('path');
var bodyParser = require('body-parser');

var playerData = require('./data/baseballData.js');

var helper = require('./util/helper.js');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '..', 'client/public')));

// players is set up to send back player data to be used in the game
// right now it is using dummy data in data/baseballData.js
// TODO: use api to have all player information

app.get('/players', function (req, res) {
  console.log('get /players')
  res.json(playerData)
});

app.get('/deck', function (req, res) {
  console.log('get /deck')
  var team = {
    hand: []
  }

  res.json( helper.getDeck(playerData, team.hand, 2 ) )
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

app.get('/', function(req, res){
  res.send(200);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});