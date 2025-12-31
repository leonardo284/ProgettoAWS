const mongoose = require("mongoose");

const StandingSchema = new mongoose.Schema({
  season: {
    type: String,
    required: true,
    index: true
  },
  teamId: {
    type: Number,
    required: true,
    index: true
  },

  nome: {
    type: String,
    required: true
  },

  matchPlayed: {
    type: Number,
    default: 0
  },

  matchWon: {
    type: Number,
    default: 0
  },

  matchDrawn: {
    type: Number,
    default: 0
  },

  matchLost: {
    type: Number,
    default: 0
  },

  goals: {
    type: Number,
    default: 0
  },

  goalsConceded: {
    type: Number,
    default: 0
  },

  points: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

StandingSchema.virtual('goalDifference').get(function () {
  return this.goals - this.goalsConceded;
});


// una riga per squadra per stagione
StandingSchema.index(
  { season: 1, teamId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Standing", StandingSchema);
