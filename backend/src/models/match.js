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

const RefereeRoleSchema = {
  refereeId: Number,
  nome: String,
  cognome: String
};

const RefereesInMatchSchema = new mongoose.Schema({
  principale: RefereeRoleSchema,
  guardalinee1: RefereeRoleSchema,
  guardalinee2: RefereeRoleSchema,
  quartoUomo: RefereeRoleSchema
}, { _id: false });

const MatchSchema = new mongoose.Schema({
  matchId: { type: Number, unique: true },

  stagione: {
    type: String,
    required: true
  },

  giornata: {
    type: Number,
    required: true
  },

  dataOra: {
    type: Date,
    required: true
  },

  stadio: {
    type: String,
    required: true
  },

  spettatori: Number,

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
    casa: { type: TeamInMatchSchema, required: true },
    trasferta: { type: TeamInMatchSchema, required: true }
  },

  risultato: {
    casa: { type: Number, default: 0 },
    trasferta: { type: Number, default: 0 }
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
