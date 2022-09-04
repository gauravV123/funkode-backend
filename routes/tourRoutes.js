const express = require('express');
const tourController = require('../controllers/toursControllers');
const authController = require('../controllers/authController');
const router = express.Router();
// app.use('/api/v1/tours', router);

router.param('id', tourController.checkID);

router.route('/get-5-tours').get(tourController.aliasTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.updateAllToursByOneUsingPost);

router
  .route('/:id')
  .get(tourController.getTourByID)
  .patch(tourController.updateToursByOne)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
