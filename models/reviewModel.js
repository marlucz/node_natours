const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be equal or greater than 1'],
      max: [5, 'Rating must be equal or lower than 5']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// QUERY MIDDLEWARE

// middleware to populate tour guides and tour by given id
reviewSchema.pre(/^find/, function(next) {
  const opts = [
    { path: 'user', select: 'name photo' }
    // { path: 'tour', select: 'name' }    // turned off because it was populating in virtual populate for tours, making populate chain
  ];
  this.populate(opts);

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
