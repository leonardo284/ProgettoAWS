const mongoose = require("mongoose");

const RefereeSchema = new mongoose.Schema({
  refereeId: { type: Number, required: true, unique: true },
  nome: String,
  cognome: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Referee", RefereeSchema);
