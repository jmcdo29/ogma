// eslint-disable-next-line @typescript-eslint/no-var-requires
const socket = require('socket.io-client')('http://[::1]:3000');

function cb(...args) {
  args.forEach((arg) => console.log(arg));
}

function socketCall(message) {
  socket.emit(message, '', cb);
}

socket.on('exception', cb);

socketCall('message');
socketCall('throw');
socketCall('skip');

setTimeout(() => socket.disconnect(), 500);
