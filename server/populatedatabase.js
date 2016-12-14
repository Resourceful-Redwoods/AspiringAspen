var db = require('./db/database.js');
var User = require('./db/usermodel.js');
var Card = require('./db/cardmodel.js');
var Environment = require('./db/environmentmodel.js');

var data = require('./cardData');

data.cards.forEach((card)=>{
  Card.create(card, (err, thing)=>{
    if (err) {
      throw err;
    }

  });
});

data.environments.forEach((environment)=>{
  Environment.create(environment, (err, thing)=>{
    if (err) {
      throw err;
    }

  });
});

