const Standing = require('../models/standing');
const PlayerStats = require('../models/playerStats');
const Team = require('../models/team'); // Assicurati che il percorso sia corretto

exports.getFullClubStats = async (req, res) => {
  try {
    // 1. Prende la classifica base
    const standings = await Standing.find({ season: "2025/2026" }).sort({ points: -1, goals: -1 }).lean();

    // 2. Per ogni squadra, aggrega i cartellini e cerca il logo
    const fullStats = await Promise.all(standings.map(async (team) => {
      
      // Uso teamId (il numero) per trovare la squadra
      const teamData = await Team.findOne({ teamId: team.teamId }).select('logo').lean();

      // Aggregazione cartellini
      const playersData = await PlayerStats.aggregate([
        { $match: { teamId: team.teamId } },
        { $group: {
            _id: null,
            totalYellows: { $sum: "$stats.ammonizioni" },
            totalReds: { $sum: "$stats.espulsioni" }
        }}
      ]);

      return {
        ...team,
        logo: teamData?.logo || '', // Aggiungo il logo trovato (o stringa vuota)
        yc: playersData[0]?.totalYellows || 0,
        rc: playersData[0]?.totalReds || 0
      };
    }));

    res.json(fullStats);
  } catch (error) {
    console.error("Errore aggregazione club:", error);
    res.status(500).json({ message: "Errore aggregazione club", error });
  }
};