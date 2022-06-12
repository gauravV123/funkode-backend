// const fs = require("fs");
const Tour = require("../models/tourModel");

// const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

exports.aliasTours = (req, res, next) => {

  // req.query.limit = '5';
  // req.query.sort = 'price name -ratingsAverage';
  // req.query.fields = 'name price ratingsAverage summary difficulty';
  next();
}

exports.checkID = (req, res, next, val) => {
  // if (+val > tours.length) {
  //   res.status(202).json({
  //     message: "Wrong ID",
  //   });
  // }
  next();
};

// exports.checkBody = (req, res, next) => {
//   if (!req.body || !req.body.name) {
//     res.status(400).json({
//       message: "Body is empty",
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {

  try {

    console.log(req.query)
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let query = Tour.find(JSON.parse(JSON.stringify(req.query)));

    //SORTING
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort('-createdAt')
    }
    //FIELDS
    if (req.query.fields) {
      query = query.select(req.query.fields);
    }



    //PAGINATION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 3;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);



    //EXECUTE QUERY
    const tours = await query;

    // if(!tours.data){
    //   throw new Error('Error hai vro')
    // }
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    })
  }
};

exports.getTourByID = async (req, res) => {
  const id = +req.params.id;
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }

};

exports.updateToursByOne = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // runValidators:true
    })
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      err
    })
  }

  // if (+req.params.id > tours.length) {
  //   return res.status(404).json({
  //     status: "404",
  //   });
  // }

  // const updatedTours = tours.map((item) => {
  //   if (item.id === +req.params.id) {
  //     return { ...item, ...req.body };
  //   }
  //   return item;
  // });
  // fs.writeFile(
  //   "./dev-data/data/tours-simple.json",
  //   JSON.stringify(updatedTours),
  //   (err) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: {
  //         tour: updatedTours,
  //       },
  //     });
  //   }
  // );
};

exports.updateAllToursByOneUsingPost = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
  // const newID = tours[tours.length - 1].id + 1;
  // //const newTour = Object.assign({ id: newID }, req.body);
  // const newTour = { ...req.body, id: newID };
  // tours.push(newTour);
  // fs.writeFile(
  //   "./dev-data/data/tours-simple.json",
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
};

exports.deleteTour = async (req, res) => {
  // if (+req.params.id > tours.length) {
  //   return res.status(404).json({
  //     status: "404",
  //   });
  // }

  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: "success",
      data: Tour
    });
  } catch (err) {
    res.json({
      status: 'failed',
      message: err
    })
  }

};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: {
          minPrice: 1
        }
      },
      // {
      //   $match: {
      //     _id: {
      //       $ne: 'EASY'
      //     }
      //   }
      // }
    ])

    res.status(200).json({
      status: 200,
      stats
    })
  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: '$images'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: '$name',
          numTourStarts: { $sum: 1 },
          tours: {
            $push: '$name'
          }
        }
      },

      {
        $addFields: {
          month: '$_id'
        }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit:6
      }
    ]);

    res.status(200).json({
      status: 'success',
      size: plan.length,
      plan
    })

  }
  catch (err) {
    res.status(400).json({
      status: 'fail',
      err
    })
  }
}