const express = require('express');
const tourController = require('../controllers/toursControllers');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();
// app.use('/api/v1/tours', router);

router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRouter);

router.route('/get-5-tours').get(tourController.aliasTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.updateAllToursByOneUsingPost,
  );

router
  .route('/:id')
  .get(tourController.getTourByID)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.updateToursByOne,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour);

module.exports = router;
