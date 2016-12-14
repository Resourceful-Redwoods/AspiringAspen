var mongoose = require('mongoose');

var environmentSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  affects: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

var Environment = mongoose.model('Environment', environmentSchema);

module.export = Environment;
