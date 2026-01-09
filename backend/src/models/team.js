const mongoose = require("mongoose");

const StadiumSchema = new mongoose.Schema({
  nome: String,
  capienza: Number,
  citta: String
}, { _id: false });

const TeamSchema = new mongoose.Schema({
  teamId: { type: Number, required: true, unique: true },
  nome: { type: String, required: true },
  league: String,
  stadio: StadiumSchema,
  colori: [String],
  logo: String,
  banner: String,
  social: Object,
  allenatore: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Team", TeamSchema);
