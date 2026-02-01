const Match = require('../models/match');
const Standing = require('../models/standing');
const PlayerStats = require('../models/playerStats');

// Costante per il rapporto di accelerazione (es. 0.3 significa 1 secondo reale = 18 secondi di gioco)
// 300 secondi (5 min) * 0.3 = 90 minuti di gioco
const ACCELERATION_FACTOR = 0.3;


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


/**
 * POST /matches/:id/start-first-half
 */
exports.startFirstHalf = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    if (match.stato !== "NON_INIZIATA") {
      return res.status(400).json({ message: "Il match è già iniziato o concluso" });
    }

    match.stato = "IN_CORSO_PRIMO_TEMPO";
    match.inizioPrimoTempo = new Date(); 
    
    await match.save();

    // --- PUSH REAL-TIME ---
    const io = req.app.get('io');
    if (io) {
      io.emit('matchStatusUpdate', {
        matchId: match.matchId,
        stato: match.stato,
        inizioPrimoTempo: match.inizioPrimoTempo, // Inviato per far partire il timer
        message: "Fischio d'inizio!"
      });
    }

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /matches/:id/start-second-half
 */
exports.startSecondHalf = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    if (match.stato !== "FINE_PRIMO_TEMPO") {
      return res.status(400).json({ message: "Stato non valido per inizio secondo tempo" });
    }

    match.stato = "IN_CORSO_SECONDO_TEMPO";
    match.inizioSecondoTempo = new Date(); 
    
    await match.save();

    // --- PUSH REAL-TIME ---
    const io = req.app.get('io');
    if (io) {
      io.emit('matchStatusUpdate', {
        matchId: match.matchId,
        stato: match.stato,
        inizioSecondoTempo: match.inizioSecondoTempo, // Inviato per far ripartire il timer dal 45'
        message: "Inizio secondo tempo!"
      });
    }

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/**
 * POST /matches/:id/events
 */
exports.addLiveEvent = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    const { tipo, squadraId, playerId, playerOutId, minuto, dettaglio } = req.body;

    const nuovoEvento = { 
      tipo,
      squadraId: Number(squadraId),
      minuto: Math.min(minuto, 90),
      dettaglio,
      playerOutId: playerOutId ? Number(playerOutId) : null,
      playerId: playerId ? Number(playerId) : null
    };

    // --- LOGICA GOAL ---
    if (tipo === "GOAL") {
      if (Number(squadraId) === match.squadre.casa.teamId) match.risultato.casa++;
      else match.risultato.trasferta++;
    }

    match.eventi.push(nuovoEvento);
    await match.save();

    // --- PUSH REAL-TIME ---
    const io = req.app.get('io');
    if (io) {
      io.emit('matchUpdate', {
        matchId: match.matchId,
        nuovoEvento: nuovoEvento,
        risultato: match.risultato
      });
    }

    res.status(201).json(match);
  } catch (err) {
    console.error("Errore addLiveEvent:", err);
    res.status(500).json({ error: err.message });
  }
};


/**
 * Logica interna per aggiornare la classifica
 */
const _internalUpdateStandings = async (match) => {
  const { casa, trasferta } = match.squadre;
  const stagioneCorrente = match.stagione;
  const golCasa = Number(match.risultato.casa);
  const golTrasf = Number(match.risultato.trasferta);

  let puntiCasa = 0, puntiTrasf = 0;
  if (golCasa > golTrasf) puntiCasa = 3;
  else if (golCasa < golTrasf) puntiTrasf = 3;
  else { puntiCasa = 1; puntiTrasf = 1; }

  const updateTeam = async (id, nome, gF, gS, p) => {
    return await Standing.findOneAndUpdate(
      { teamId: Number(id), season: stagioneCorrente },
      {
        $inc: {
          matchPlayed: 1,
          matchWon: p === 3 ? 1 : 0,
          matchDrawn: p === 1 ? 1 : 0,
          matchLost: p === 0 ? 1 : 0,
          goals: gF,
          goalsConceded: gS,
          points: p
        },
        $set: { nome: nome }
      },
      { upsert: true }
    );
  };

  await updateTeam(casa.teamId, casa.nome, golCasa, golTrasf, puntiCasa);
  await updateTeam(trasferta.teamId, trasferta.nome, golTrasf, golCasa, puntiTrasf);
};

/**
 * Logica interna per aggiornare le statistiche dei giocatori
 */
const _internalUpdatePlayerStats = async (match) => {
  // 1. Eventi (Gol, Malus, ecc.)
  for (const evento of match.eventi) {
    if (!evento.playerId) continue;
    let incData = {};
    if (evento.tipo === "GOAL") incData["stats.gol"] = 1;
    if (evento.tipo === "AMMONIZIONE") incData["stats.ammonizioni"] = 1;
    if (evento.tipo === "ESPULSIONE") incData["stats.espulsioni"] = 1;
    if (evento.tipo === "FALLO") incData["stats.falliFatti"] = 1;

    await PlayerStats.findOneAndUpdate(
      { playerId: Number(evento.playerId) },
      { 
        $inc: incData, 
        $set: { ultimaPartitaId: match.matchId, updatedAt: new Date() } 
      },
      { upsert: true }
    );
  }

  // 2. Presenze per i titolari
  const titolari = [
    ...match.squadre.casa.formazione.titolari,
    ...match.squadre.trasferta.formazione.titolari
  ];

  for (const p of titolari) {
    await PlayerStats.findOneAndUpdate(
      { playerId: Number(p.playerId) },
      { 
        $inc: { "stats.presenze": 1 },
        $set: { nome: p.nome }
      },
      { upsert: true }
    );
  }
};


/**
 * POST /matches/:id/end-period
 * Termina il tempo e, se è la fine del secondo tempo, aggiorna tutto automaticamente.
 */
exports.endPeriod = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    let isGameOver = false;

    if (match.stato === "IN_CORSO_PRIMO_TEMPO") {
      match.stato = "FINE_PRIMO_TEMPO";
    } else if (match.stato === "IN_CORSO_SECONDO_TEMPO") {
      match.stato = "FINITA";
      isGameOver = true;
    } else {
      return res.status(400).json({ message: "Match non in corso" });
    }

    // Se la partita è finita, eseguo gli aggiornamenti
    if (isGameOver) {
      console.log(`Match ${match.matchId} concluso. Avvio aggiornamento automatico dati...`);
      await _internalUpdateStandings(match);
      await _internalUpdatePlayerStats(match);
    }

    await match.save();

    // --- PUSH REAL-TIME ---
    const io = req.app.get('io');
    if (io) {
      io.emit('matchStatusUpdate', {
        matchId: match.matchId,
        stato: match.stato,
        message: isGameOver ? "Partita finita! Classifica aggiornata." : "Fine primo tempo"
      });
    }

    res.json({
      message: isGameOver ? "Partita conclusa e dati aggiornati" : "Periodo terminato",
      match
    });
  } catch (err) {
    console.error("Errore durante endPeriod:", err);
    res.status(500).json({ error: err.message });
  }
};

// Mantengo questi export per evrntuali ricalcoli manuali via API
/*exports.updateStandings = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match || match.stato !== "FINITA") return res.status(400).send("Match non valido");
    await _internalUpdateStandings(match);
    res.json({ message: "Classifica ricalcolata" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updatePlayerStats = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).send("Match non trovato");
    await _internalUpdatePlayerStats(match);
    res.json({ message: "Statistiche ricalcolate" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};*/

