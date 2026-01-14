const PlayerStats = require('../models/playerStats');

/**
 * Recupera le statistiche aggregate di un singolo giocatore
 */
exports.getPlayerStats = async (req, res) => {
  try {
    const stats = await PlayerStats.findOne({ playerId: req.params.id });
    if (!stats) {
      return res.status(404).json({ message: "Statistiche non trovate per questo giocatore" });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero statistiche", error });
  }
};

/**
 * Classifica Marcatori
 */
exports.getTopScorers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const scorers = await PlayerStats.find()
      .sort({ "stats.gol": -1 })
      .limit(limit);
    res.json(scorers);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica marcatori", error });
  }
};

/**
 * Classifica Assistman
 */
exports.getTopAssists = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const assists = await PlayerStats.find()
      .sort({ "stats.assist": -1 })
      .limit(limit);
    res.json(assists);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica assist", error });
  }
};

/**
 * Recupera le statistiche di tutti i giocatori di una squadra
 */
exports.getTeamStats = async (req, res) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const stats = await PlayerStats.find({ teamId: teamId })
      .sort({ "stats.gol": -1 }); // Opzionale: li ordiniamo per gol
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero statistiche della squadra", error });
  }
};