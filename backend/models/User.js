const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  provider: {
    type: String,
    default: 'local', // 'local' or 'google'
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
