const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

// set the index that each user can only make one review for a tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// static function to calculate average tour rating
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[1].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review
  // this.constructor = Review
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  // in query middleware you have only acces to the query itself, so await query will give you the review object
  this.r = await this.findOne(); // this.r - saving results from pre middleware to an object parameter so we can use it in post middleware
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query is already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
