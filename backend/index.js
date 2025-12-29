const express = require('express');
const app = express();
const path = require('path');
const movieRouter = require('./src/routes/routes');

global.appRoot = path.resolve(__dirname);

// Automatically parse request body as JSON
app.use(express.json());

app.use('/', movieRouter);

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
