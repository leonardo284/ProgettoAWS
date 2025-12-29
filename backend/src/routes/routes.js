const express = require('express');
const playerController = require('../controllers/playerController');
const teamController = require('../controllers/teamController');
const matchController = require('../controllers/matchController');

const router = express.Router();

router.get('/', moviesController.showIndex);

router.get('/movies-crud', moviesController.showCrud);

router.route('/api/teams')
	.get(teamController.listMovies)
	.post(teamController.createMovie);

router.route('/api/teams/:id')
	.get(moviesController.readMovie)
	.put(teamController.updateMovie)
	.delete(teamController.deleteMovie);

router.route('/api/players')
	.get(playerController.listMovies)
	.post(playerController.createMovie);

router.route('/api/players/:id')
	.get(playerController.readMovie)
	.put(playerController.updateMovie)
	.delete(playerController.deleteMovie);



module.exports = router;
