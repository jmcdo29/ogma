const { request } = require('http');

const baseUrl = 'http://localhost:3000/';

function cb(res) {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => console.log(data));
}

function makeCall(url) {
  request(baseUrl + url, cb).end();
}

makeCall('');
makeCall('status');
makeCall('error');
makeCall('skip');
