const express = require('express');
const playerController = require('../controllers/playerController');
const teamController = require('../controllers/teamController');
const matchController = require('../controllers/matchController');

const router = express.Router();

// PLAYERS
router.get('/', playerController.listPlayers);
router.get('/players/:id', playerController.readPlayer);
router.put('/players/:id', playerController.updatePlayer);
router.delete('/players/:id', playerController.deletePlayer);

// TEAMS
router.get('/teams', teamController.listTeams);
router.get('/teams/:id', teamController.readTeam);
router.get('/teams/:teamName/players', playerController.listPlayersByTeam);

// MATCHES
router.post('/matches', matchController.createMatch);
router.get('/matches/:id', matchController.readMatch);
router.put('/matches/:id', matchController.updateMatch);
router.delete('/matches/:id', matchController.deleteMatch);

// extra richieste
router.get('/matches/giornata/:giornata', matchController.listMatchesByGiornata);
router.get('/matches/squadra/:teamId', matchController.listMatchesByTeam);

module.exports = router;
