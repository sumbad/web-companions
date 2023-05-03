import http from 'http';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const hostname = '127.0.0.1';
const port = 8081;

const server = http.createServer((req, res) => {
  console.log(req.url);
  const baseDir = join(dirname(fileURLToPath(import.meta.url)), './demo/dist');

  let filePath = '';

  switch (req.url) {
    case '/':
      filePath = `${baseDir}/index.html`;
      break;
    default:
      filePath = `${baseDir}${req.url}`;
      break;
  }

  if (fs.existsSync(filePath)) {
    res.statusCode = 200;
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
