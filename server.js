import { createServer } from 'node:http';

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'w317d05 Node app is running' }));
});

server.listen(port, () => {
  console.log(`w317d05 listening on port ${port}`);
});
