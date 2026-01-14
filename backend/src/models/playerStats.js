const mongoose = require("mongoose");

const PlayerStatsSchema = new mongoose.Schema({
  // Riferimento al giocatore
  playerId: { 
    type: Number, 
    required: true, 
    unique: true // Un solo documento per ogni giocatore
  },
  
  // Dati identificativi rapidi per evitare troppe JOIN
  nome: String,
  cognome: String,
  foto: String,
  teamId: Number, 

  // Statistiche Aggregate
  stats: {
    presenze: { type: Number, default: 0 },
    minutiGiocati: { type: Number, default: 0 },
    gol: { type: Number, default: 0 },
    assist: { type: Number, default: 0 },
    falliFatti: { type: Number, default: 0 },
    ammonizioni: { type: Number, default: 0 }, 
    espulsioni: { type: Number, default: 0 }    
  },

  ultimaPartitaId: Number,
  updatedAt: { type: Date, default: Date.now }
});

// Indice per velocizzare la ricerca per team se serve una classifica marcatori
PlayerStatsSchema.index({ teamId: 1 });

module.exports = mongoose.model("PlayerStats", PlayerStatsSchema);