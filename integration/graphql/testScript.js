const { request } = require('http');

const baseUrl = 'http://localhost:3000/graphql';

function cb(res) {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => console.log(data));
}

function makeCall(gqlQuery) {
  const req = request(
    baseUrl,
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
    cb,
  );
  req.write(gqlQuery);
  req.end();
}

function makeQueryString(type, name) {
  return `{"query": "${type} ${name}{ ${name} { key }}"}`;
}

makeCall(makeQueryString('query', 'getQuery'));
makeCall(makeQueryString('query', 'getError'));
makeCall(makeQueryString('mutation', 'getMutation'));
makeCall(makeQueryString('query', 'getSkip'));
