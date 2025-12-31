const Match = require('../models/match');

/**
 * POST /matches
 * Crea una partita
 */
exports.createMatch = (req, res) => {
  const match = new Match(req.body);

  match.save()
    .then(doc => res.status(201).json(doc))
    .catch(err => res.status(500).send(err));
};

/**
 * GET /matches/:id
 * Legge una partita
 */
exports.readMatch = (req, res) => {
  Match.findById(req.params.id)
    .then(match => {
      if (!match) {
        return res.status(404).send('Match not found');
      }
      res.json(match);
    })
    .catch(err => res.status(500).send(err));
};

/**
 * PUT /matches/:id
 * Modifica una partita
 */
exports.updateMatch = (req, res) => {
  Match.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
    .then(match => {
      if (!match) {
        return res.status(404).send('Match not found');
      }
      res.json(match);
    })
    .catch(err => res.status(500).send(err));
};

/**
 * DELETE /matches/:id
 * Elimina una partita
 */
exports.deleteMatch = (req, res) => {
  Match.findByIdAndDelete(req.params.id)
    .then(match => {
      if (!match) {
        return res.status(404).send('Match not found');
      }
      res.json({ message: 'Match deleted' });
    })
    .catch(err => res.status(500).send(err));
};

/**
 * GET /matches
 * Tutte le partite (opzionale)
 */
exports.listMatches = (req, res) => {
  Match.find()
    .sort({ dataOra: 1 })
    .then(matches => res.json(matches))
    .catch(err => res.status(500).send(err));
};

/**
 * GET /giornate/:giornata/matches
 * Tutte le partite di una giornata
 */
exports.listMatchesByGiornata = (req, res) => {
  Match.find({ giornata: req.params.giornata })
    .sort({ dataOra: 1 })
    .then(matches => res.json(matches))
    .catch(err => res.status(500).send(err));
};

/**
 * GET /teams/:teamId/matches
 * Tutte le partite di una squadra
 */
exports.listMatchesByTeam = (req, res) => {
  Match.find({
    $or: [
      { 'squadre.casa.teamId': Number(req.params.teamId) },
      { 'squadre.trasferta.teamId': Number(req.params.teamId) }
    ]
  })
    .sort({ dataOra: 1 })
    .then(matches => res.json(matches))
    .catch(err => res.status(500).send(err));
};


exports.listLastMatches = async (req, res) => {
  try {
    const limit = Number(req.params.limit) || 5

    const matches = await Match.find()
      .sort({ dataOra: -1 })
      .limit(limit)

    res.json(matches)
  } catch (err) {
    res.status(500).json({ message: 'Errore nel recupero match' })
  }
}
