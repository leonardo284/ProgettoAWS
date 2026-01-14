const PlayerStats = require('../models/playerStats');

/**
 * Recupera le statistiche aggregate di un singolo giocatore
 */
exports.getPlayerStats = async (req, res) => {
  try {
    const stats = await PlayerStats.findOne({ playerId: req.params.id })
      .populate('playerId', 'nome cognome foto'); // Prende i dettagli dell'anagrafica
    if (!stats) {
      return res.status(404).json({ message: "Statistiche non trovate" });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero statistiche", error });
  }
};


// 1. Classifica MARCATORI
exports.getTopScorers = async (req, res) => {
  try {
    const scorers = await PlayerStats.find({ "stats.gol": { $gt: 0 } })
      .sort({ "stats.gol": -1 }) // Ordina dal più alto al più basso
      .limit(20);
    res.json(scorers);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica marcatori", error: error.message });
  }
};

// 2. Classifica ASSISTMAN
exports.getTopAssists = async (req, res) => {
  try {
    const assists = await PlayerStats.find({ "stats.assist": { $gt: 0 } })
      .sort({ "stats.assist": -1 })
      .limit(20);
    res.json(assists);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica assist", error: error.message });
  }
};

// 3. Classifica AMMONIZIONI
exports.getTopYellows = async (req, res) => {
  try {
    const yellows = await PlayerStats.find({ "stats.ammonizioni": { $gt: 0 } })
      .sort({ "stats.ammonizioni": -1 })
      .limit(20);
    res.json(yellows);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica ammonizioni", error: error.message });
  }
};

// 4. Classifica ESPULSIONI
exports.getTopReds = async (req, res) => {
  try {
    const reds = await PlayerStats.find({ "stats.espulsioni": { $gt: 0 } })
      .sort({ "stats.espulsioni": -1 })
      .limit(20);
    res.json(reds);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica espulsioni", error: error.message });
  }
};
/**
 * Recupera le statistiche di tutti i giocatori di una squadra
 */
exports.getTeamStats = async (req, res) => {
  try {
    const stats = await PlayerStats.find({ teamId: req.params.teamId })
      .populate('playerId', 'nome cognome foto')
      .sort({ "stats.gol": -1 })
      .limit(20);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero statistiche della squadra", error });
  }
};