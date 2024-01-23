const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

//AI PROMPT
//create me another schema for reviews: reviewSchema. it should have a rating which is between 0 and 5 required, a comment, createdBy required, createdAt which is a date (default is current date), and aboolean isHidden with default false
