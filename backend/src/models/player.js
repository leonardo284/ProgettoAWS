const mongoose = require("mongoose");

const CurrentTeamSchema = new mongoose.Schema({
  teamId: Number,
  nome: String
}, { _id: false });

const PlayerSchema = new mongoose.Schema({
  playerId: { type: Number, required: true, unique: true },
  nome: { type: String, required: true },
  cognome: { type: String, required: true },
  ruolo: String,
  nazionalita: String,
  dataNascita: Date,
  altezzaCm: Number,
  pesoKg: Number,
  currentTeam: CurrentTeamSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Player", PlayerSchema);
