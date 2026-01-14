const express = require('express');
const playerController = require('../controllers/playerController');
const teamController = require('../controllers/teamController');
const matchController = require('../controllers/matchController');
const standingController = require('../controllers/standingController');
const playerStatsController = require('../controllers/playerStatsController');

const router = express.Router();

// PLAYERS
router.get('/', playerController.listPlayers);
router.get('/players', playerController.listPlayers);
router.get('/players/:id', playerController.readPlayer);
router.put('/players/:id', playerController.updatePlayer);
router.delete('/players/:id', playerController.deletePlayer);

// TEAMS
router.get('/teams', teamController.listTeams);
router.get('/teams/:id', teamController.readTeam);
router.get('/teams/:teamId/players', playerController.listPlayersByTeam);

// MATCHES
router.post('/matches', matchController.createMatch);
router.get('/matches', matchController.listMatches);
router.get('/matches/last/:limit', matchController.listLastMatches);
router.get('/matches/giornata/:giornata', matchController.listMatchesByGiornata);
router.get('/matches/squadra/:teamId', matchController.listMatchesByTeam);
router.get('/matches/:id', matchController.readMatch);
router.put('/matches/:id', matchController.updateMatch);
router.delete('/matches/:id', matchController.deleteMatch);

// STANDINGS
router.get("/standings", standingController.listStandings);
router.get("/standings/:teamId", standingController.readStanding);
router.put("/standings/:teamId", standingController.updateStanding);
router.delete("/standings/:teamId", standingController.deleteStanding);

router.get("/standings/top/:n", standingController.getTopN);
router.get("/standings/bottom/:n", standingController.getBottomN);

// PLAYER STATISTICS
// Recupera le statistiche di un singolo giocatore tramite il suo ID
router.get('/stats/players/:id', playerStatsController.getPlayerStats);

// Recupera la classifica marcatori (Top N)
router.get('/stats/top-scorers', playerStatsController.getTopScorers);

// Recupera la classifica assistman (Top N)
router.get('/stats/top-assists', playerStatsController.getTopAssists);

// Recupera le statistiche di tutti i giocatori di una squadra
router.get('/stats/teams/:teamId', playerStatsController.getTeamStats);

module.exports = router;
