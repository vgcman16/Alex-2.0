const { createServer } = require('./server');

const port = process.env.PORT || 3000;
createServer().listen(port, () => {
  console.log(`Mobile API listening on ${port}`);
});
