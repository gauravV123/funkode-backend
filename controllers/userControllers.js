const fs = require('fs');
const { deleteOne, updateDoc, getDocumentById } = require('./handleFactory');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

filteredObj = (obj, ...allowedProp) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedProp.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getUserNameByID = getDocumentById(User);
exports.updateUser = updateDoc(User);
exports.deleteMe = deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  console.log({ id: req.params.id });
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('Invalid route to update password', 400));
  }
  const filteredBody = filteredObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.getUsersName = catchAsync(async (req, res) => {
  const users = await User.find({ active: true });
  res.status(200).json({
    status: 'success',
    total: users.length,
    users,
  });
});
