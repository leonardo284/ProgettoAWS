const Standing = require("../models/standing");
const Match = require('../models/match'); 

/**
 * GET /standings
 * Lista completa (ordinata)
 */
exports.listStandings = async (req, res) => {
  try {
    // nelle standing è stato aggiunto anche il campo seasons, che nel nostro caso specifico è fisso a "2025/2026"
    const { stagione = "2025/2026" } = req.query;

    // prendo le righe di classifica della stagione attuale e le ordino per punti prima, per differenza reti poi e poi goal fatti  
    const standings = await Standing.find({ season: stagione })
                                    .sort({ points: -1, goalDifference: -1, goals: -1 });


    const standingsWithForm = await Promise.all(

      standings.map(async (row) => {
        
        const tId = Number(row.teamId);

        // per ogni riga di classifica prendo il teamId e cerco le ultime 5 partite giocate da quella squadra

        const lastMatches = await Match.find({
          stagione: stagione, 
          stato: "FINITA",    
          $or: [
            { "squadre.casa.teamId": tId },
            { "squadre.trasferta.teamId": tId }
          ]
        })
        .sort({ dataOra: -1 }) // Ordino per dataOra decrescente
        .limit(5);


        // per ogni partita determino se è stata una vittoria, sconfitta o pareggio
        const form = lastMatches.map(match => {
          const isCasa = match.squadre.casa.teamId === tId;
          const goalFatti = isCasa ? match.risultato.casa : match.risultato.trasferta;
          const goalSubiti = isCasa ? match.risultato.trasferta : match.risultato.casa;

          if (goalFatti > goalSubiti) return 'W';
          if (goalFatti < goalSubiti) return 'L';
          return 'D';
        }).reverse(); // Dal più vecchio al più recente

        // resituisco i dat della classifica combinati con il trend delle ultime partite
        return {
          ...row.toObject(),   // creo un oggetto plain js dalla riga mongoose
          form: form
        };
      })

    );

    res.json(standingsWithForm);
  } catch (err) {
    console.error("Errore listStandings:", err);
    res.status(500).json({ error: err.message });
  }
};

