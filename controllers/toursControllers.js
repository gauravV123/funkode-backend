// const fs = require("fs");
const Tour = require("../models/tourModel");

// const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

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
    const tours = await Tour.find(req.query);
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
      message: "Some error occured"
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
      message: err.message
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
      message: 'Invalid data sent!'
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
