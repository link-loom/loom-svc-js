const http = require('http');

const port = process.env.PORT || 3601;
const requestPath = process.argv[2] || '/streaming/tick?count=3&interval=500';

console.log(`Connecting to http://localhost:${port}${requestPath}\n`);

const req = http.get(
  {
    hostname: 'localhost',
    port,
    path: requestPath,
    headers: { Accept: 'text/event-stream' },
  },
  (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}\n`);

    res.on('data', (chunk) => process.stdout.write(chunk.toString()));
    res.on('end', () => console.log('\n[stream ended]'));
  },
);

req.on('error', (err) => console.error('Error:', err.message));
