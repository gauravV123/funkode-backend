const express = require('express');
const userController = require('../controllers/userControllers');
const router = express.Router();
const authController = require('../controllers/authController');
router.param('id', (req, res, next, val) => {
  // console.log('id= ', val);
  next();
});

router.post('/forgotPassword', authController.forgotPassword);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch('/deleteMe', authController.protect, userController.deleteMe);
router.route('/').get(userController.getUsersName);
router.route('/:id').get(userController.getUserNameByID);

module.exports = router;
