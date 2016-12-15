var db = require('./db/database.js');
var Users = require('./db/usermodel.js');
var Cards = require('./db/cardmodel.js');
var Environments = require('./db/environmentmodel.js');

exports.getAllUserData = function(cb) {
  Users.find().exec((err, users) => err ? console.error(err) : cb(users));
};

exports.getAllCardsData = function(cb) {
  Cards.find().exec((err, cards) => err ? console.error(err) : cb(cards));
};

exports.getAllEnvironmentsData = function(cb) {
  Environments.find().exec((err, environments) => err ? console.error(err) : cb(environments));
};
