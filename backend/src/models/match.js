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

// alcuni eventi sono associati alla squadra (come rigore ed angolo)
// altri ad un giocatore specifico (goal, ammonizione, espulsione, fallo)
const EventoSchema = new mongoose.Schema({
  minuto: { type: Number, required: true },
  tipo: { 
    type: String, 
    enum: ["GOAL", "AMMONIZIONE", "ESPULSIONE", "FALLO", "RIGORE", "ANGOLO", "SOSTITUZIONE"],
    required: true 
  },
  squadraId: { type: Number, required: true },
  playerId: { type: Number, default: null }, // Chi segna, chi viene ammonito, o chi ENTRA
  
  playerOutId: { type: Number, default: null }, // Usato solo per le SOSTITUZIONI (chi esce)

  assistPlayerId: { type: Number, default: null },
  dettaglio: { type: String, default: null } 
}, { _id: true });

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

  eventi: [EventoSchema],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Match", MatchSchema);
