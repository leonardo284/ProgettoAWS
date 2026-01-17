const Standing = require("../models/standing");
const Match = require('../models/match'); 

/**
 * GET /standings
 * Lista completa (ordinata)
 */
exports.listStandings = async (req, res) => {
  try {
    const { stagione = "2025/2026" } = req.query;

    const standings = await Standing.find({ season: stagione })
      .sort({ points: -1, goalDifference: -1, goals: -1 });

    const standingsWithForm = await Promise.all(
      standings.map(async (row) => {
        // Converto row.teamId in Number per sicurezza
        const tId = Number(row.teamId);

        // 2. Cerco i match usando i nomi dei campi esatti del tuo schema
        const lastMatches = await Match.find({
          stagione: stagione, // Campo corretto: stagione
          stato: "FINITA",    // Stato corretto
          $or: [
            { "squadre.casa.teamId": tId },
            { "squadre.trasferta.teamId": tId }
          ]
        })
        .sort({ dataOra: -1 }) // Ordino per dataOra 
        .limit(5);

        // 3. Calcolo del Trend (W, D, L)
        const form = lastMatches.map(match => {
          const isCasa = match.squadre.casa.teamId === tId;
          const goalFatti = isCasa ? match.risultato.casa : match.risultato.trasferta;
          const goalSubiti = isCasa ? match.risultato.trasferta : match.risultato.casa;

          if (goalFatti > goalSubiti) return 'W';
          if (goalFatti < goalSubiti) return 'L';
          return 'D';
        }).reverse(); // Dal più vecchio al più recente

        return {
          ...row.toObject(),
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


/**
 * GET /standings/:teamId
 */
exports.readStanding = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season = "2025/2026" } = req.query;

    const standing = await Standing.findOne({ teamId, season });
    if (!standing) {
      return res.status(404).json({ message: "Standing not found" });
    }

    res.json(standing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /standings/:teamId
 */
exports.updateStanding = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season = "2025/2026" } = req.query;

    const standing = await Standing.findOneAndUpdate(
      { teamId, season },
      req.body,
      { new: true }
    );

    if (!standing) {
      return res.status(404).json({ message: "Standing not found" });
    }

    res.json(standing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /standings/:teamId
 */
exports.deleteStanding = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { season = "2025/2026" } = req.query;

    const deleted = await Standing.findOneAndDelete({ teamId, season });

    if (!deleted) {
      return res.status(404).json({ message: "Standing not found" });
    }

    res.json({ message: "Standing deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /standings/top/:n
 */
exports.getTopN = async (req, res) => {
  try {
    const n = parseInt(req.params.n);
    const { season = "2025/2026" } = req.query;

    const standings = await Standing.find({ season })
      .sort({ points: -1, goalDifference: -1, goals: -1 })
      .limit(n);

    res.json(standings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /standings/bottom/:n
 */
exports.getBottomN = async (req, res) => {
  try {
    const n = parseInt(req.params.n);
    const { season = "2025/2026" } = req.query;

    const standings = await Standing.find({ season })
      .sort({ points: 1, goalDifference: 1, goals: 1 })
      .limit(n);

    res.json(standings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
