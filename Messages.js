const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: Array,
  },
});

const Conversation = mongoose.model('Conversation', userSchema);

module.exports = Conversation;
