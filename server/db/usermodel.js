var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  wins: Number,
  losses: Number
});

var User = mongoose.model('User', userSchema);

module.exports = User;
