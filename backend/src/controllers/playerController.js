const Player = require('../models/player');

/**
 * GET /players
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
  Player.findById(req.params.id)
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
  Player.find({ 'currentTeam.nome': req.params.teamName })
    .then(players => res.json(players))
    .catch(err => res.status(500).send(err));
};

/**
 * POST /players
 */
exports.createPlayer = (req, res) => {
  const player = new Player(req.body);

  player.save()
    .then(doc => res.status(201).json(doc))
    .catch(err => res.status(500).send(err));
};

/**
 * PUT /players/:id
 */
exports.updatePlayer = (req, res) => {
  Player.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .then(player => {
      if (!player) {
        return res.status(404).send('Player not found');
      }
      res.json(player);
    })
    .catch(err => res.status(500).send(err));
};

/**
 * DELETE /players/:id
 */
exports.deletePlayer = (req, res) => {
  Player.findByIdAndDelete(req.params.id)
    .then(player => {
      if (!player) {
        return res.status(404).send('Player not found');
      }
      res.json({ message: 'Player deleted' });
    })
    .catch(err => res.status(500).send(err));
};
