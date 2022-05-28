const app= require('./app');
const port = 3000;
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
