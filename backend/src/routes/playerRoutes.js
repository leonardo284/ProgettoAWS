const playerController = require('../controllers/playerController');

const express = require('express');
const router = express.Router();

// PLAYERS
router.get('/', playerController.listPlayers);
router.get('/:id', playerController.readPlayer);

module.exports = router;