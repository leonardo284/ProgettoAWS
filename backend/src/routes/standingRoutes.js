const standingController = require('../controllers/standingController');

const express = require('express');
const router = express.Router();

// STANDINGS
router.get("/", standingController.listStandings);

module.exports = router;