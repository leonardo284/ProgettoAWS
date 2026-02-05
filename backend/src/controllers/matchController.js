const Match = require('../models/match');
const Standing = require('../models/standing');
const PlayerStats = require('../models/playerStats');
const jwt = require('jsonwebtoken'); 

// aggiungo la chiave segreta JWT qui per semplicità
// in un progetto reale andrebbe in un file .env
const JWT_SECRET = "f64fe192a6429f0d98b8e2a2d268d563e53ef05d652c6431966b70b4be265979256a76e2b8780a44ae17f1c83d89e949a7a05422ca2d4db3278ef3e7b9edd56a";

/**
 * GET /matches/:id
 * Legge una partita con i dettagli delle squadre (Logo e Nome)
 */
exports.readMatch = async (req, res) => {
  try {
    // Cerco per il campo matchId
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
 * Tutte le partite ordinate per data
 */
exports.listMatches = (req, res) => {
  Match.find()
        .sort({ dataOra: 1 })
        .then(matches => res.json(matches))
        .catch(err => res.status(500).send(err));
};

/**
 * GET /giornate/:giornata/matches
 * Tutte le partite di una giornata ordinate per data
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
 * Inizia il primo tempo di una partita
 */
exports.startFirstHalf = async (req, res) => {
  try {
    // --- CONTROLLO INTEGRATO DEL TOKEN ---
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Prende il token dopo "Bearer"

    if (!token) {
      return res.status(401).json({ message: "Token mancante: autenticazione richiesta" });
    }

    // Verifico che il token sia vero e non falsato usando la chiave segreta
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Verifico esplicitamente se è un administrator
      if (decoded.role !== 'administrator') {
        console.error(`PERMESSI INSUFFICIENTI: L'utente ${decoded.username} ha ruolo ${decoded.role}`);
        return res.status(403).json({ message: "Richiesti privilegi di amministratore" });
      }
    } catch (err) {
      return res.status(403).json({ message: "Token non valido o scaduto" });
    }
    // --------------------------------------

    // ricerco la partita tramite matchId
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    // se il match è già inziato non posso far partire il primo tempo
    if (match.stato !== "NON_INIZIATA") {
      return res.status(400).json({ message: "Il match è già iniziato o concluso" });
    }

    // aggiorno stato ed inizioPrimoTempo
    match.stato = "IN_CORSO_PRIMO_TEMPO";
    match.inizioPrimoTempo = new Date(); 
    
    // salvo le modifiche
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
    // --- CONTROLLO INTEGRATO DEL TOKEN ---
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Autenticazione richiesta" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Verifico esplicitamente se è un administrator
      if (decoded.role !== 'administrator') {
        console.error(`PERMESSI INSUFFICIENTI: L'utente ${decoded.username} ha ruolo ${decoded.role}`);
        return res.status(403).json({ message: "Richiesti privilegi di amministratore" });
      }
    } catch (err) {
      return res.status(403).json({ message: "Accesso negato: sessione non valida" });
    }
    // --------------------------------------

    // ricerco la partita tramite matchId
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
    // --- CONTROLLO INTEGRATO DEL TOKEN ---
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Token necessario per inserire eventi" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Verifico esplicitamente se è un administrator
      if (decoded.role !== 'administrator') {
        console.error(`PERMESSI INSUFFICIENTI: L'utente ${decoded.username} ha ruolo ${decoded.role}`);
        return res.status(403).json({ message: "Richiesti privilegi di amministratore" });
      }
    } catch (err) {
      return res.status(403).json({ message: "Token non valido" });
    }
    // --------------------------------------

    // cerco la partita tramite matchId
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    const { tipo, squadraId, playerId, playerOutId, assistPlayerId, minuto, dettaglio } = req.body;
    
    const nuovoEvento = { 
      tipo,
      squadraId: Number(squadraId),
      minuto: Math.min(minuto, 90),
      dettaglio,
      playerOutId: playerOutId ? Number(playerOutId) : null,
      playerId: playerId ? Number(playerId) : null,
      assistPlayerId: assistPlayerId ? Number(assistPlayerId) : null
    };

    // --- EVENTO GOAL ---
    if (tipo === "GOAL") {
      if (Number(squadraId) === match.squadre.casa.teamId) 
        match.risultato.casa++;
      else 
        match.risultato.trasferta++;
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

  // recupero dati dal match
  const { casa, trasferta } = match.squadre;
  const stagioneCorrente = match.stagione;
  const golCasa = Number(match.risultato.casa);
  const golTrasf = Number(match.risultato.trasferta);

  // Calcolo punti guadagnati dalle due squadre
  let puntiCasa = 0, puntiTrasf = 0;
  if (golCasa > golTrasf) puntiCasa = 3;
  else if (golCasa < golTrasf) puntiTrasf = 3;
  else { puntiCasa = 1; puntiTrasf = 1; }

  // funzione di utilità per aggiornare i dati di una singola squadra
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
      //Se la squadra non esiste ancora in classifica la crea e usa i valori di $inc come valori iniziali
      { upsert: true }  
    );
  };

  // Aggiorno le due squadre
  await updateTeam(casa.teamId, casa.nome, golCasa, golTrasf, puntiCasa);
  await updateTeam(trasferta.teamId, trasferta.nome, golTrasf, golCasa, puntiTrasf);
};

/**
 * Logica interna per aggiornare le statistiche dei giocatori
 */
const _internalUpdatePlayerStats = async (match) => {

  // ciclo tutti gli eventi del match
  for (const evento of match.eventi) {
    if (!evento.playerId) continue;

    // calcolo il dato da incrementare a seconda del tipo di evento
    let incData = {};
    if (evento.tipo === "GOAL") incData["stats.gol"] = 1;
    if (evento.tipo === "AMMONIZIONE") incData["stats.ammonizioni"] = 1;
    if (evento.tipo === "ESPULSIONE") incData["stats.espulsioni"] = 1;
    if (evento.tipo === "FALLO") incData["stats.falliFatti"] = 1;

    // aggiorno le statistiche del giocatore
    await PlayerStats.findOneAndUpdate(
      { playerId: Number(evento.playerId) },
      { 
        $inc: incData, 
        // imposto l'id dell'ultima partita giocata e la data di aggiornamento
        $set: { ultimaPartitaId: match.matchId, updatedAt: new Date() }  
      },      
      { upsert: true } // se non esiste il playerStats con quell'id lo crea
    );

    // Se l'evento è un GOAL e c'è un assistman, incremento i suoi assist
    if (evento.tipo === "GOAL" && evento.assistPlayerId) {
      await PlayerStats.findOneAndUpdate(
        { playerId: Number(evento.assistPlayerId) },    // where playerId = assistPlayerId
        { 
          $inc: { "stats.assist": 1 }, 
          $set: { ultimaPartitaId: match.matchId, updatedAt: new Date() } 
        },
        { upsert: true }
      );
    }

  }

  // Prendo i titolari
  const titolariIds = [
    ...match.squadre.casa.formazione.titolari.map(p => ({ playerId: p.playerId, nome: p.nome })),
    ...match.squadre.trasferta.formazione.titolari.map(p => ({ playerId: p.playerId, nome: p.nome }))
  ];

  // Estraggo i sostituti che sono entrati (playerId negli eventi di tipo SOSTITUZIONE)
  const subentratiIds = [];
  for (const evento of match.eventi) {
    if (evento.tipo === "SOSTITUZIONE" && evento.playerId) {
      // Cerco il nome del giocatore nella panchina per poterlo salvare nel set (utile in caso di upsert)
      const pCasa = match.squadre.casa.formazione.panchina.find(p => p.playerId === evento.playerId);
      const pTrasf = match.squadre.trasferta.formazione.panchina.find(p => p.playerId === evento.playerId);
      const playerObj = pCasa || pTrasf;
      
      if (playerObj) {
        subentratiIds.push({ playerId: playerObj.playerId, nome: playerObj.nome });
      }
    }
  }

  // Unisco le due liste (titolari + subentrati)
  const tuttiIGiocatoriInCampo = [...titolariIds, ...subentratiIds];

  // per ogni giocatore che ha giocato incremento la presenza
  for (const p of tuttiIGiocatoriInCampo) {
    await PlayerStats.findOneAndUpdate(
      { playerId: Number(p.playerId) },
      { 
        $inc: { "stats.presenze": 1 },
        $set: { nome: p.nome, ultimaPartitaId: match.matchId, updatedAt: new Date() }
      },
      { upsert: true }
    );
  }
};

/**
 * POST /matches/:id/end-period
 */
exports.endPeriod = async (req, res) => {
  try {
    // --- CONTROLLO INTEGRATO DEL TOKEN ---
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //console.log("--- DEBUG END PERIOD ---");
    //console.log("Header Authorization ricevuto:", authHeader);

    if (!token) {
      console.warn("Accesso negato: Token mancante nell'header della richiesta.");
      return res.status(401).json({ message: "Azione non autorizzata" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      //console.log("Verifica JWT: SUCCESS");
      //console.log("Dati utente nel token:", decoded);

      // Verifico esplicitamente se è un administrator
      if (decoded.role !== 'administrator') {
        console.error(`PERMESSI INSUFFICIENTI: L'utente ${decoded.username} ha ruolo ${decoded.role}`);
        return res.status(403).json({ message: "Richiesti privilegi di amministratore" });
      }
    } catch (err) {
      return res.status(403).json({ message: "Sessione scaduta o non valida" });
    }
    // --------------------------------------

    // ricerco la partita tramite matchId
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    let isGameOver = false;

    // Aggiorno lo stato della partita e verifico se è finita
    if (match.stato === "IN_CORSO_PRIMO_TEMPO") {
      match.stato = "FINE_PRIMO_TEMPO";
    } else if (match.stato === "IN_CORSO_SECONDO_TEMPO") {
      match.stato = "FINITA";
      isGameOver = true;
    } else {
      return res.status(400).json({ message: "Match non in corso" });
    }

    // Se la partita è finita, eseguo gli aggiornamenti alla classifica e statistiche giocatori
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