const Match = require('../models/match');
const Team = require('../models/team');

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
 * Legge una partita con i dettagli delle squadre (Logo e Nome)
 */
exports.readMatch = async (req, res) => {
  try {
    // Cerco per il campo numerico 'matchId'
    const match = await Match.findOne({ matchId: Number(req.params.id) }).lean();

    if (!match) {
      return res.status(404).json({ message: 'Match non trovato' });
    }
    res.json(match);
  } catch (err) {
    console.error("Errore server:", err);
    res.status(500).json({ message: "Errore interno del server", error: err.message });
  }
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
