const PlayerStats = require('../models/playerStats');

/**
 * Recupera le statistiche aggregate di un singolo giocatore
 */
exports.getPlayerStats = async (req, res) => {
  try {
    // cerco tramite l'id del giocatore il suo recordi di PlayerStats e prendo dalla collezione players i campi 
    // nome, cognome e foto
    const stats = await PlayerStats.findOne({ playerId: req.params.id })
                                    .populate('playerId', 'nome cognome foto'); 
    if (!stats) {
      return res.status(404).json({ message: "Statistiche non trovate" });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero statistiche", error });
  }
};


/**
 * Restituisce la classifica con i primi 20 marcatori
*/
exports.getTopScorers = async (req, res) => {
  try {
    // recupero i giocatori con più di 0 gol, li ordino in ordine decrescente e prendo i primi 20
    const scorers = await PlayerStats.find({ "stats.gol": { $gt: 0 } })
                                      .sort({ "stats.gol": -1 }) // 
                                      .limit(20);
    res.json(scorers);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica marcatori", error: error.message });
  }
};

/**
 * Restituisce la classifica con i primi 20 assistman
*/
exports.getTopAssists = async (req, res) => {
  try {
    // recupero i giocatori con più di 0 assist, li ordino in ordine decrescente e prendo i primi 20
    const assists = await PlayerStats.find({ "stats.assist": { $gt: 0 } })
                                      .sort({ "stats.assist": -1 })
                                      .limit(20);
    res.json(assists);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica assist", error: error.message });
  }
};

/**
 * Restituisce la classifica con i primi 20 giocatori con più ammonizioni
*/
exports.getTopYellows = async (req, res) => {
  try {
    // recupero i giocatori con più di 0 ammonizioni, li ordino in ordine decrescente e prendo i primi 20
    const yellows = await PlayerStats.find({ "stats.ammonizioni": { $gt: 0 } })
                                      .sort({ "stats.ammonizioni": -1 })
                                      .limit(20);
    res.json(yellows);
  } catch (error) {
    res.status(500).json({ message: "Errore classifica ammonizioni", error: error.message });
  }
};

/**
 * Restituisce la classifica con i primi 20 giocatori con più espulsioni
*/
exports.getTopReds = async (req, res) => {
  try {
    // recupero i giocatori con più di 0 espulsioni, li ordino in ordine decrescente e prendo i primi 20
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
    // cerco tutte le statistiche dei giocatori appartenenti alla squadra con teamId, aggiungo i dati dei 
    // giocatori e ordino per gol
    const stats = await PlayerStats.find({ teamId: req.params.teamId })
                                    .populate('playerId', 'nome cognome foto')
                                    .sort({ "stats.gol": -1 })
                                    .limit(20);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero statistiche della squadra", error });
  }
};