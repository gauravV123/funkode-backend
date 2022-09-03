const fs = require('fs');
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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(200).json({
    status: 'success',
    data: null,
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

exports.getUserNameByID = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    name: user.name,
  });
});
