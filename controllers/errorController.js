const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const message = `Invalid input data`;
  return new AppError(message, 400);
};
const handleDuplicateFieldDB = (err) => {
  //   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Duplicate field value:${errors.join('. ')} `;
  return new AppError(message, 400);
};

const handleJWTError = (err) => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpired = (err) => new AppError('Your token has expired. Plese log in again',  401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (!err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    console.log('From here', error);
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldDB(error);
    } else if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpired(error);
    } else {
      error = new AppError('Something went very wrong', 500);
    }
    sendErrorProd(error, res);
  }
};
