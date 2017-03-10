const net = require('net');
const fabric = require('./src/fabric');
const dict = fabric('test.in');

const port = 5000;

var clientCount = 0;

net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.write('Welcome, friend!\n');
  clientCount++;
  console.log('Clients count: %d', clientCount);

  socket.on('data', (data) => {
    if (data.indexOf('get') === 0) {
      const prefix = data.slice(4, -2);
      socket.write(dict(prefix) + '\n');
    }
  });

  socket.on('end', () => {
    clientCount--;
    console.log('Clients count: %d', clientCount);
  })

}).listen(port);

console.log("Server running at port %d\n", port);
