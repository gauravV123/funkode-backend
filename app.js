const express = require('express');
const morgan = require('morgan');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(
  hpp({
    whitelist: ['duration'],
  }),
);
app.use(
  express.json({
    limit: '10kb',
  }),
);
app.use(morgan('dev'));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 404,
  //   message: `Cannt find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorController);

module.exports = app;

// //-----------CLOSURES

// // const heavyDuty = (index) => {
// //   const bigArray = new Array(10000).fill('😀');
// //   console.log('created!!!');
// //   return bigArray[in  dex];
// // };

// // console.log(heavyDuty(688));
// // console.log(heavyDuty(800));
// // console.log(heavyDuty(900));

// // const heavyDuty2 = (index) => {
// //   const bigArray = new Array(10000).fill('😀');
// //   console.log('created Again!!!');
// //   return (index) => {
// //     return bigArray[index];
// //   };
// // };

// // const getHeavyDuty = heavyDuty2();
// // console.log(getHeavyDuty(600));
// // console.log(getHeavyDuty(800));
// // console.log(getHeavyDuty(600));

// //-------Encapsulation(closures)

// // const makeNuclearButton = () => {
// //   let timeWithoutDestruction = 0;
// //   const passTime = () => timeWithoutDestruction++;
// //   const totalPeaceTime = () => timeWithoutDestruction;
// //   const launch = () => {
// //     timeWithoutDestruction -= 1;
// //     return '🔥';
// //   };
// //   setInterval(passTime, 1000);
// //   return {
// //     launch,
// //     totalPeaceTime,
// //   };
// // };

// // const ohno = makeNuclearButton();
// // console.log(ohno.totalPeaceTime());

// //------------------

// // var a= "hi";
// // const sample=()=> {
// //     console.log ("original", a);
// //      var a= "bye";
// //     console.log("new", a);

// // }
// // sample();
// // console.log(a);
// //'use strict'

// // const a = function () {
// //   console.log('a', this);
// //   const b = function () {
// //     console.log('b', this);
// //     const c = {
// //       hi: function () {
// //         console.log('c', this);
// //       },
// //     };
// //     c.hi();
// //   };
// //   b();
// // };
// // a();

// // const obj = {
// //   name: 'happy',
// //   sing() {
// //     console.log('a', this);
// //     var anotherFunc = () => {
// //       console.log('b', this);
// //     };
// //     anotherFunc();
// //   },
// // };
// // obj.sing();

// // function a( ) {
// //   return this;
// // }
// // console.log(a.call());

// function sum(num1, num2= 2, num3= 3){
//   console.log(num1+num2+num3)
// }

// sum(4, 1, 5);

// const myFunc= ()=>{
//   const a= 2;
//   return ()=>console.log('a is ', a);
// }
// const a= 1;
// const test= myFunc();
// test()

// console.log("I")
// setTimeout(()=>{
//   console.log("love")
// },0)
// console.log('Java')
