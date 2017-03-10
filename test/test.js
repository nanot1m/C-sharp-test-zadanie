const fs = require('fs');
var util = require('util');

const fabric = require('../src/fabric');
const dict = fabric('test.in');

const lines = fs.readFileSync('test.in').toString().split('\n');
const wordsCount = Number(lines[0]);
const prefixCount = Number(lines[wordsCount + 1]);
const prefixes = lines.slice(wordsCount + 2, wordsCount + 2 + prefixCount );

console.time('get-prefixes-' + prefixes.length);
prefixes.forEach(prefix => dict(prefix.replace(/\r/, '')));
console.timeEnd('get-prefixes-' + prefixes.length);

