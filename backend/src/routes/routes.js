const playerRoutes = require('./playerRoutes');
const teamRoutes = require('./teamRoutes');
const matchRoutes = require('./matchRoutes');
const standingRoutes = require('./standingRoutes');
const statsRoutes = require('./statsRoutes');
const playerController = require('../controllers/playerController');

const express = require('express');
const router = express.Router();

router.use('/players', playerRoutes);
router.use('/teams', teamRoutes);
router.use('/matches', matchRoutes);
router.use('/standings', standingRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
