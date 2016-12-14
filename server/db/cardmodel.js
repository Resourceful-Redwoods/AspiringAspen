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
  },
  advantages: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

var Card = mongoose.model('Card', cardSchema);

module.exports = Card;
