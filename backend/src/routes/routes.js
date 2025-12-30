const express = require('express');
const playerController = require('../controllers/playerController');
const teamController = require('../controllers/teamController');
const matchController = require('../controllers/matchController');
const team = require('../models/team');

const router = express.Router();

router.get('/', playerController.listPlayers);
/*
router.route('/api/teams')
	.get(teamController.listMovies)
	.post(teamController.createMovie);

router.route('/api/teams/:id')
	.get(teamController.readMovie)
	.put(teamController.updateMovie)
	.delete(teamController.deleteMovie);
*/
router.route('/api/players')
	.get(playerController.listPlayers)
	.post(playerController.createPlayer);

router.route('/api/players/:id')
	.get(playerController.readPlayer)
	.put(playerController.updatePlayer)
	.delete(playerController.deletePlayer);



module.exports = router;
