const { deleteOne, updateDoc, getDocumentById, createDocument } = require('./handleFactory');
const Reviews = require('../models/reviewModel');
const { catchAsync } = require('../utils/catchAsync');

exports.createReview = createDocument(Reviews);
exports.getReviewById = getDocumentById(Reviews);
exports.deleteReview = deleteOne(Reviews);
exports.updateReview = updateDoc(Reviews);

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

exports.setReviewID = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
