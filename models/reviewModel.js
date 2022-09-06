const mongoose = require('mongoose');
const validator = require('validator');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Reivew must not be empty'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is needed'],
      min: 1,
      max: 5,
      //   validate: validator.isNumeric,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour'],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this
//   .populate({
//     path: 'tour',
//     select: 'name images',
//   })
  .populate({
    path: 'user',
    select:'name'
  });
  next();
});

const review = mongoose.model('Review', reviewSchema);
module.exports = review;
