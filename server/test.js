const removeAccents = require('remove-accents');

console.log(removeAccents(process.argv[2]));
console.log(decodeURIComponent(process.argv[2]));