const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http'); 
const { Server } = require('socket.io');   

const router = require('./src/routes/routes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const httpServer = createServer(app); 

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


app.set('io', io);

mongoose.connect('mongodb://localhost:27017/campionato');

global.appRoot = path.resolve(__dirname);

app.use(cors()); 
app.use(express.json());

// Log per vedere quando un utente si connette
io.on('connection', (socket) => {
  console.log('Nuovo client connesso:', socket.id);
});

app.use('/', router);
app.use('/auth', authRoutes);

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT + ' (with Socket.io)');
});