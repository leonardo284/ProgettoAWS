const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Team = require("../models/Team");
const Player = require("../models/Player");
const Referee = require("../models/Referee");

const MONGO_URI = "mongodb://localhost:27017/campionato";

const NAMES = [
  "Marco", "Luca", "Andrea", "Matteo", "Francesco",
  "Giovanni", "Alessandro", "Stefano", "Davide", "Simone",
  "Paolo", "Federico", "Riccardo", "Nicola", "Gabriele",
  "Fabio", "Enrico", "Michele", "Roberto", "Daniele"
];

const SURNAMES = [
  "Rossi", "Bianchi", "Verdi", "Esposito", "Ferrari",
  "Romano", "Colombo", "Ricci", "Marino", "Greco",
  "Bruno", "Gallo", "Conti", "De Luca", "Mancini",
  "Costa", "Giordano", "Rizzo", "Lombardi", "Barbieri"
];

function randomName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}

function randomSurname() {
  return SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
}

function safeName(value) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : randomName();
}

function safeSurname(value) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : randomSurname();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseOrRandom(value, min, max) {
  if (!value) return randomInt(min, max);
  const n = parseInt(value);
  return isNaN(n) ? randomInt(min, max) : n;
}

function safeBirthDate(value) {
  // range realistico: 18–45 anni
  const start = new Date(1980, 0, 1);
  const end = new Date(2006, 11, 31);

  let d = null;

  if (typeof value === "string") {
    const parts = value.split("/");
    if (parts.length === 3) {
      const iso = `${parts[2]}-${parts[1]}-${parts[0]}`;
      d = new Date(iso);
    }
  }

  // se NON è una Date valida → random
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return new Date(
      start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
    );
  }

  return d;
}

function requiredString(value, fallback) {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
}


async function init() {
  try {
    console.log("🔌 Connessione a MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("🧹 Pulizia collezioni...");
    await Team.deleteMany({});
    await Player.deleteMany({});
    await Referee.deleteMany({});

    console.log("Import teams...");
    const teams = JSON.parse(
      fs.readFileSync(path.join(__dirname, "teams.json"), "utf-8")
    );

    await Team.insertMany(
      teams.map(t => ({
        teamId: t.id,
        nome: t.nome,
        league: t.league,
        stadio: t.stadio,
        colori: t.colori,
        logo: t.logo,
        social: t.social
      }))
    );

    console.log("Import players...");
    const players = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "players_scraped_final.json"),
        "utf-8"
      )
    );

    await Player.insertMany(
      players.map(p => ({
        playerId: p.idEsterno || p.id,
        nome: safeName(p.nome),
        cognome: safeSurname(p.cognome),
        ruolo: p.ruolo,
        nazionalita: p.nazionalita,
        dataNascita: safeBirthDate(p.dataNascita),
        altezzaCm: parseOrRandom(p.altezza, 160, 205),
        pesoKg: parseOrRandom(p.peso, 60, 100),
        currentTeam: { nome: p.squadra }
      }))
    );

    console.log("Creazione arbitri...");
    const referees = [];
    for (let i = 1; i <= 100; i++) {
      referees.push({
        refereeId: i,
        nome: randomName(),
        cognome: randomSurname()
      });
    }
    await Referee.insertMany(referees);

    console.log("DB inizializzato con Mongoose");
  } catch (err) {
    console.error("Errore inizializzazione DB:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

init();
