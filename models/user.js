const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
}, {
  collection: 'login', // Specify the collection name
});

const User = mongoose.model('User', userSchema);

module.exports = User;
