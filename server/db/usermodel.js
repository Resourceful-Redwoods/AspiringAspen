var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  wins: Number,
  losses: Number,
  status: {
    type: String,
    required: true,
    default: 'offline'
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
