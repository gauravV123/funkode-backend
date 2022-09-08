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

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUserNameByID);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe/:id', userController.deleteMe);
router.route('/').get(userController.getUsersName);
router.route('/:id').get(userController.getUserNameByID).patch(userController.updateUser);

module.exports = router;
