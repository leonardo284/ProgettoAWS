const Player = require('../models/player');

/**
 * GET /players
 * Recupera tutti i giocatori
 */
exports.listPlayers = (req, res) => {
  Player.find()
    .then(players => res.json(players))
    .catch(err => res.status(500).send(err));
};

/**
 * GET /players/:id
 */
exports.readPlayer = (req, res) => {
  Player.findOne({ playerId: req.params.id })
    .then(player => {
      if (!player) {
        return res.status(404).send('Player not found');
      }
      res.json(player);
    })
    .catch(err => res.status(500).send(err));
};

/**
 * GET /teams/:teamName/players
 * Recupera tutti i giocatori di una squadra
 */
exports.listPlayersByTeam = (req, res) => {
  const teamId = Number(req.params.teamId);

  Player.find({ 'currentTeam.teamId': teamId })
    .then(players => res.json(players))
    .catch(err => res.status(500).json({ error: "Errore nel recupero dei giocatori", details: err }));
};

