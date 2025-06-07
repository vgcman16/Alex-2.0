const { createServer } = require('./server');
const port = process.env.PORT || 8080;
createServer().listen(port, () => {
  console.log(`Cloud sync server listening on ${port}`);
});
