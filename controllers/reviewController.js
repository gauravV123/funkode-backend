const Reviews = require('../models/reviewModel');
const { catchAsync } = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const review = await Reviews.find(filter);
  res.status(200).json({
    status: 'success',
    results: review.length,
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Reviews.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

exports.getReviewById = catchAsync(async (req, res, next) => {
  const review = await Reviews.findById(req.params.id);
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});
