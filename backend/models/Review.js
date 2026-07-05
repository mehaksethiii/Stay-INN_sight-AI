const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true,
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral',
  },
  theme: {
    type: String,
    enum: ['food', 'host', 'location', 'cleanliness', 'value', 'experience'],
    default: 'experience',
  },
  response: {
    type: String,
    default: '',
  },
  experienceType: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
