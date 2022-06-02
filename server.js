const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const port = 3000;

dotenv.config({ path: "./.config.env" });

mongoose.connect(process.env.DATABASE_LOCAL);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// const character = {
//   name: 'Simon',
//   getCharacter() {
//     return this.name;
//   },
// };

// const give = character.getCharacter();
// console.log('?', give);
// console.log(typeof [4].toString());
// console.log(1 == '1');
// function sum(a, b) {
//   return a + b;
// }
// console.log(sum(NaN, null));
