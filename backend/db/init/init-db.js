const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Team = require("../../src/models/team");
const Player = require("../../src/models/player");
const Referee = require("../../src/models/referee");
const Match = require("../../src/models/match");


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

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function generateMatches(teams, referees) {
  if (teams.length !== 20) {
    throw new Error("Devono esserci ESATTAMENTE 20 squadre");
  }

  const stagione = "2025/2026";
  const startDate = new Date("2025-09-07T15:00:00");

  let matchIdCounter = 1;

  const teamList = [...teams];
  const rounds = [];

  // circle method
  for (let round = 0; round < 19; round++) {
    const matches = [];

    for (let i = 0; i < 10; i++) {
      const home = teamList[i];
      const away = teamList[19 - i];

      matches.push({ home, away });
    }

    rounds.push(matches);

    // rotate (tranne il primo)
    const fixed = teamList[0];
    const rest = teamList.slice(1);
    rest.unshift(rest.pop());
    teamList.splice(0, teamList.length, fixed, ...rest);
  }

  const allMatches = [];

  // ANDATA
  rounds.forEach((round, index) => {
    round.forEach(match => {
      allMatches.push({
        giornata: index + 1,
        casa: match.home,
        trasferta: match.away
      });
    });
  });

  // RITORNO (inverti casa/trasferta)
  rounds.forEach((round, index) => {
    round.forEach(match => {
      allMatches.push({
        giornata: index + 20,
        casa: match.away,
        trasferta: match.home
      });
    });
  });

  const matchDocs = [];

  for (const m of allMatches) {
    const arbitriRandom = shuffle(referees).slice(0, 4);

    matchDocs.push({
      matchId: matchIdCounter++,
      stagione,
      giornata: m.giornata,
      dataOra: addDays(startDate, (m.giornata - 1) * 7),
      stadio: m.casa.stadio,
      arbitri: {
        principale: arbitriRandom[0],
        guardalinee1: arbitriRandom[1],
        guardalinee2: arbitriRandom[2],
        quartoUomo: arbitriRandom[3]
      },
      squadre: {
        casa: {
          teamId: m.casa.teamId,
          nome: m.casa.nome
        },
        trasferta: {
          teamId: m.trasferta.teamId,
          nome: m.trasferta.nome
        }
      }
    });
  }

  await Match.insertMany(matchDocs);
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
    console.log("Connessione a MongoDB...");
    await mongoose.connect(MONGO_URI);

    console.log("DROP DATABASE (reset completo)...");
    await mongoose.connection.dropDatabase();


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

    console.log("Generazione partite...");
    const teamsDb = await Team.find();
    const refereesDb = await Referee.find();

    await generateMatches(teamsDb, refereesDb);


    console.log("DB inizializzato con Mongoose");
  } catch (err) {
    console.error("Errore inizializzazione DB:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

init();
