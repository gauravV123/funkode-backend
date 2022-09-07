const Users = require('../models/userModel');
const Tour = require('../models/tourModel');
const { catchAsync } = require('../utils/catchAsync');
const { deleteOne, updateDoc, getDocumentById, createDocument } = require('./handleFactory');

exports.aliasTours = (req, res, next) => {
  next();
};

exports.checkID = (req, res, next, val) => {
  next();
};

exports.updateAllToursByOneUsingPost = createDocument(Tour);
exports.getTourByID = getDocumentById(Tour, 'reviews');
exports.updateToursByOne = updateDoc(Tour);
exports.deleteTour = deleteOne(Tour);

exports.getAllTours = catchAsync(async (req, res) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  let query = Tour.find(JSON.parse(JSON.stringify(req.query)));
  if (req.query.sort) {
    query = query.sort(req.query.sort);
  } else {
    query = query.sort('-createdAt');
  }
  if (req.query.fields) {
    query = query.select(req.query.fields);
  }

  const tours = await query;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
  res.status(400).json({
    status: 'fail',
    message: err,
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        minPrice: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 200,
    stats,
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$images',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: '$name',
        numTourStarts: { $sum: 1 },
        tours: {
          $push: '$name',
        },
      },
    },

    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);

  res.status(200).json({
    status: 'success',
    size: plan.length,
    plan,
  });
});
