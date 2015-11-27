const now = new Date();
const fs = require('fs');
var util = require('util');

const fabric = require('../src/fabric');
const dict = fabric('test.in');

const lines = fs.readFileSync('test.in').toString().split('\n');
const wordsCount = Number(lines[0]);
const prefixCount = Number(lines[wordsCount + 1]);
const prefixes = lines.slice(wordsCount + 2, wordsCount + 2 + prefixCount );
console.log('\x1b[36m Prefixes count: ' + prefixCount + '\x1b[0m');
prefixes.forEach(prefix => dict(prefix.replace(/\r/, '')));
const duration = new Date - now;
console.log('\x1b[36m Test duration: ' + duration + ' ms\x1b[0m');
if (duration < 10000) {
  console.info('\x1b[32m Test is ok \x1b[0m')
} else {
  console.warn('\x1b[31m Test failed \x1b[0m')
}
