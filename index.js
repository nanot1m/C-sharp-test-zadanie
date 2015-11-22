const readline = require('readline');
const fabric = require('./src/fabric');
const dict = fabric('test.in');

const rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('HOLLA! > ');
rl.prompt();

rl.on('line', function(line) {
  console.log(dict(line));
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});