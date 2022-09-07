const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../../.config.env' });

const Tour = require('../../models/tourModel');

mongoose.connect(process.env.DATABASE).then((con) => {
  console.log('DB connection successful!!');
});

//READ JSON FILES

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));

//IMPORT DATA INTO DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!!!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE ALL DATA FROM DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully loaded!!!');
  } catch (err) {
    console.log({ err });
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
