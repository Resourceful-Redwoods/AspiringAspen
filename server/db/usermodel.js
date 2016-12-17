var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var io = require('../server.js');

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

userSchema.post('update', function() {
  io.sockets.emit('userdata updated');
});

var User = mongoose.model('User', userSchema);

module.exports = User;
