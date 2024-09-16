const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  plaidAccessToken: {
    type: String,
    required: true,
  },
  plaidItemId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
