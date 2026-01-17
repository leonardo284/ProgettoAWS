const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const path = require('path');
const router = require('./src/routes/routes');
const authRoutes = require('./src/routes/authRoutes');


mongoose.connect('mongodb://localhost:27017/campionato');


global.appRoot = path.resolve(__dirname);

app.use(cors()) 
// Automatically parse request body as JSON
app.use(express.json());

app.use('/', router);
app.use('/auth', authRoutes);
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});


/*
app.use(cors());

app.use(express.static('public'));*/


