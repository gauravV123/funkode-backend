const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const port = 3000;

dotenv.config({ path: './.config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED EXCEPTION! Shutting down...');
    process.exit(1);
  });

mongoose.connect(process.env.DATABASE).then(() => {
  console.log('DB connected successfully!!!');
});

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
