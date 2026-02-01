const matchController = require('../controllers/matchController');

const express = require('express');
const router = express.Router();

// MATCHES
router.get('/', matchController.listMatches);
router.get('/giornata/:giornata', matchController.listMatchesByGiornata);
router.get('/squadra/:teamId', matchController.listMatchesByTeam);
router.get('/:id', matchController.readMatch);

// MATCHES - Live Admin Actions
router.post('/:id/start-first-half', matchController.startFirstHalf);
router.post('/:id/start-second-half', matchController.startSecondHalf);
router.post('/:id/end-period', matchController.endPeriod); // Per intervallo o fine partita

// Gestione Eventi Live
router.post('/:id/events', matchController.addLiveEvent); 


module.exports = router;