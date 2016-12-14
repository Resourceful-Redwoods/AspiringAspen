var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  wins: Number,
  losses: Number
});

var User = mongoose.model('User', usersSchema);
