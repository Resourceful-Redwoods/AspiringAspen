var mongoose = require('mongoose');

var cardSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  power: {
    type: Number,
    required: true
  }
});

var Card = mongoose.model('Card', cardSchema);

module.export = Card;
