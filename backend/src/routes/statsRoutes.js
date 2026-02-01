const playerStatsController = require('../controllers/playerStatsController');
const clubStatsController = require('../controllers/clubStatsController');

const express = require('express');
const router = express.Router();

// TEAMS STATISTICS
// Rotta per ottenere le statistiche complete dei teams
router.get('/teams/full', clubStatsController.getFullClubStats);

// PLAYER STATISTICS
// Recupera le statistiche di un singolo giocatore tramite il suo ID
router.get('/players/:id', playerStatsController.getPlayerStats);

// Recupera la classifica marcatori (Top N)
router.get('/top-scorers', playerStatsController.getTopScorers);

// Recupera la classifica assistman (Top N)
router.get('/top-assists', playerStatsController.getTopAssists);

// Recupera le statistiche di tutti i giocatori di una squadra
router.get('/teams/:teamId', playerStatsController.getTeamStats);

router.get('/top-yellows', playerStatsController.getTopYellows);

router.get('/top-reds', playerStatsController.getTopReds);



module.exports = router;