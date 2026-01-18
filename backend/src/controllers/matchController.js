const Match = require('../models/match');
const Team = require('../models/team');

// Costante per il rapporto di accelerazione (es. 0.3 significa 1 secondo reale = 18 secondi di gioco)
// 300 secondi (5 min) * 0.3 = 90 minuti di gioco
const ACCELERATION_FACTOR = 0.3;

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


/**
 * POST /matches/:id/start-first-half
 */
exports.startFirstHalf = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    if (match.stato !== "NON_INIZIATA") {
      return res.status(400).json({ message: "Stato non valido per inizio primo tempo" });
    }

    match.stato = "IN_CORSO_PRIMO_TEMPO";
    match.inizioPrimoTempo = new Date(); // Valorizza il nuovo campo
    
    await match.save();
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
      return res.status(400).json({ message: "Deve essere in intervallo per iniziare il secondo tempo" });
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
        inizioSecondoTempo: match.inizioSecondoTempo, // Passiamo il nuovo timestamp
        message: "Inizia il secondo tempo!"
      });
      console.log(`[Socket] Push: Secondo tempo iniziato per match ${match.matchId}`);
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

    // 1. Prendiamo il minuto dal body (inviato dal frontend)
    let minutoFinale = req.body.minuto;

    // 2. Fallback: Se il minuto non c'è, lo calcoliamo noi (opzionale, per sicurezza)
    if (minutoFinale === undefined || minutoFinale === null) {
      let riferimentoTempo = match.stato === "IN_CORSO_PRIMO_TEMPO" 
        ? match.inizioPrimoTempo 
        : match.inizioSecondoTempo;

      if (!riferimentoTempo) {
        return res.status(400).json({ message: "La partita non è in corso" });
      }

      const diffSecondi = (new Date() - riferimentoTempo) / 1000;
      minutoFinale = Math.floor(diffSecondi * ACCELERATION_FACTOR) + 1;
      if (match.stato === "IN_CORSO_SECONDO_TEMPO") minutoFinale += 45;
    }

    // 3. Creazione evento con il minuto ricevuto
    const nuovoEvento = { 
      ...req.body, 
      minuto: Math.min(minutoFinale, 90) // Evitiamo bug che portano a minuti assurdi
    };

    match.eventi.push(nuovoEvento);

    // Aggiornamento risultato se GOAL
    if (nuovoEvento.tipo === "GOAL") {
      if (Number(nuovoEvento.squadraId) === match.squadre.casa.teamId) match.risultato.casa++;
      else match.risultato.trasferta++;
    }

    await match.save();
    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /matches/:id/end-period
 * Gestisce la fine del primo tempo o la fine della partita
 */
exports.endPeriod = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    if (match.stato === "IN_CORSO_PRIMO_TEMPO") {
      match.stato = "FINE_PRIMO_TEMPO";
    } else if (match.stato === "IN_CORSO_SECONDO_TEMPO") {
      match.stato = "FINITA";
    } else {
      return res.status(400).json({ message: "Il match non è in un corso, impossibile terminare il periodo" });
    }

    await match.save();

    // --- PUSH REAL-TIME ---
    const io = req.app.get('io');
    if (io) {
      io.emit('matchStatusUpdate', {
        matchId: match.matchId,
        stato: match.stato,
        // Non servono nuovi timestamp, lo stato FINE_PRIMO_TEMPO o FINITA 
        // bloccherà automaticamente il calcolo del minuto nel frontend
        message: match.stato === "FINE_PRIMO_TEMPO" ? "Fine primo tempo!" : "Partita terminata!"
      });
      console.log(`[Socket] Push: Cambio stato in ${match.stato} per match ${match.matchId}`);
    }

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



/**
 * DELETE /matches/:id/events/:eventId
 * Rimuove un evento (e corregge il punteggio se era un goal)
 */
exports.deleteLiveEvent = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    const evento = match.eventi.id(req.params.eventId);
    if (!evento) return res.status(404).json({ message: "Evento non trovato" });

    // Se rimuoviamo un goal, aggiorniamo il punteggio
    if (evento.tipo === "GOAL") {
      if (evento.squadraId === match.squadre.casa.teamId) match.risultato.casa--;
      else match.risultato.trasferta--;
    }

    evento.remove();
    await match.save();
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /matches/:id/publish-formations
 * Rende visibili le formazioni
 */
exports.publishFormations = async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: Number(req.params.id) });
    if (!match) return res.status(404).json({ message: "Match non trovato" });

    match.formazioniPubblicate = true;
    await match.save();
    res.json({ message: "Formazioni pubblicate" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};