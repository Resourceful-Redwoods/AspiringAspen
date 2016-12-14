var mongoose = require('mongoose');

var environmentSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  affects: mongoose.Schema.Types.Mixed,
  image: {
    type: String,
    required: true
  }
});

var Environment = mongoose.model('Environment', environmentSchema);

module.export = Environment;
