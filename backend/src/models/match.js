const mongoose = require("mongoose");

const PlayerSnapshotSchema = new mongoose.Schema({
  playerId: Number,
  nome: String,
  ruolo: String
}, { _id: false });

const FormationSchema = new mongoose.Schema({
  titolari: [PlayerSnapshotSchema],
  panchina: [PlayerSnapshotSchema]
}, { _id: false });

const TeamInMatchSchema = new mongoose.Schema({
  teamId: Number,
  nome: String,
  formazione: FormationSchema
}, { _id: false });

const RefereesInMatchSchema = new mongoose.Schema({
  principale: { refereeId: Number, nome: String, cognome: String },
  guardalinee1: { refereeId: Number, nome: String, cognome: String },
  guardalinee2: { refereeId: Number, nome: String, cognome: String },
  quartoUomo: { refereeId: Number, nome: String, cognome: String }
}, { _id: false });

const MatchSchema = new mongoose.Schema({
  matchId: { type: Number, unique: true },
  stagione: String,
  dataOra: Date,

  stato: {
    type: String,
    enum: [
      "NON_INIZIATA",
      "IN_CORSO",
      "FINE_PRIMO_TEMPO",
      "FINE_SECONDO_TEMPO",
      "FINITA",
      "SOSPESA",
      "ANNULLATA"
    ],
    default: "NON_INIZIATA"
  },

  arbitri: RefereesInMatchSchema,

  squadre: {
    casa: TeamInMatchSchema,
    trasferta: TeamInMatchSchema
  },

  risultato: {
    casa: Number,
    trasferta: Number
  },

  eventi: [{
    minuto: Number,
    tipo: String,
    playerId: Number,
    squadra: String
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Match", MatchSchema);
