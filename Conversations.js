const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  members: {
    type: Array,
    required: true,
  },

});

const Conversation = mongoose.model('Conversation', userSchema);

module.exports = Conversation;
