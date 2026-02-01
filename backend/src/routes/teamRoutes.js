const playerController = require('../controllers/playerController');
const teamController = require('../controllers/teamController');

const express = require('express');
const router = express.Router();

// TEAMS
router.get('/', teamController.listTeams);
router.get('/:id', teamController.readTeam);
router.get('/:teamId/players', playerController.listPlayersByTeam);

module.exports = router;