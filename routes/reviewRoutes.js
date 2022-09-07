const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router({ mergeParams: true });
const authController = require('../controllers/authController');

router
  .route('/')
  .get(authController.protect, reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setReviewID,
    reviewController.createReview,
  );
router
  .route('/:id')
  .get(authController.protect, reviewController.getReviewById)
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, authController.restrictTo('admin'), reviewController.deleteReview);

module.exports = router;
