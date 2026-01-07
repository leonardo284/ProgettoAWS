const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Team = require("../../src/models/team");
const Player = require("../../src/models/player");
const Referee = require("../../src/models/referee");
const Match = require("../../src/models/match");
const Standing = require("../../src/models/standing");


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

/**
 * Simula il gioco delle prime N giornate di campionato
 */
async function playInitialMatches(nGiornate) {
  console.log(`\n--- Simulazione prime ${nGiornate} giornate ---`);
  
  // Recupero i match delle giornate interessate
  const matches = await Match.find({ giornata: { $lte: nGiornate } }).sort({ giornata: 1 });

  for (const match of matches) {
    // Risultato random: casa (0-4), trasferta (0-4)
    const goalsC = Math.floor(Math.random() * 5);
    const goalsT = Math.floor(Math.random() * 5);

    // Recupero i giocatori usando il teamId salvato nello schema
    const playersCasa = await Player.find({ "currentTeam.teamId": match.squadre.casa.teamId });
    const playersTrasferta = await Player.find({ "currentTeam.teamId": match.squadre.trasferta.teamId });

    const eventiMatch = [];

    // Generazione marcatori per la squadra di casa
    for (let i = 0; i < goalsC; i++) {
      if (playersCasa.length > 0) {
        const p = playersCasa[Math.floor(Math.random() * playersCasa.length)];
        eventiMatch.push({
          minuto: Math.floor(Math.random() * 90) + 1,
          tipo: "GOAL",
          playerId: p.playerId,
          squadra: "casa"
        });
      }
    }

    // Generazione marcatori per la squadra in trasferta
    for (let i = 0; i < goalsT; i++) {
      if (playersTrasferta.length > 0) {
        const p = playersTrasferta[Math.floor(Math.random() * playersTrasferta.length)];
        eventiMatch.push({
          minuto: Math.floor(Math.random() * 90) + 1,
          tipo: "GOAL",
          playerId: p.playerId,
          squadra: "trasferta"
        });
      }
    }

    // Aggiorno il match
    match.risultato.casa = goalsC;
    match.risultato.trasferta = goalsT;
    match.eventi = eventiMatch;
    match.stato = "FINITA";
    match.spettatori = Math.floor(Math.random() * 30000) + 5000;
    await match.save();

    // Aggiorno la classifica
    await updateStanding(match.stagione, match.squadre.casa.teamId, match.squadre.trasferta.teamId, goalsC, goalsT);
  }
}

/**
 * Normalizza il ruolo dal JSON all'Enum del DB
 */
function mapRuolo(ruoloJson, playerInfo) {
  if (!ruoloJson || ruoloJson === "N/D") return "Sconosciuto";

  const r = ruoloJson.toLowerCase();

  if (r.includes("portiere")) return "Portiere";
  if (r.includes("difensore")) return "Difensore";
  if (r.includes("centrocampista")) return "Centrocampista";
  if (r.includes("attaccante")) return "Attaccante";

  // Se arriva qui, il ruolo è presente ma non mappato (es. "Allenatore" o errori)
  console.warn(`[WARN] Ruolo non riconosciuto per ${playerInfo}: "${ruoloJson}". Impostato come Sconosciuto.`);
  return "Sconosciuto";
}

/**
 * Aggiorna le statistiche della classifica per le due squadre
 */
async function updateStanding(season, idCasa, idTrasferta, goalsC, goalsT) {
  const sCasa = await Standing.findOne({ season, teamId: idCasa });
  const sTrasferta = await Standing.findOne({ season, teamId: idTrasferta });

  if (!sCasa || !sTrasferta) return;

  // Incremento partite e goals
  sCasa.matchPlayed += 1;
  sTrasferta.matchPlayed += 1;
  sCasa.goals += goalsC;
  sCasa.goalsConceded += goalsT;
  sTrasferta.goals += goalsT;
  sTrasferta.goalsConceded += goalsC;

  // Calcolo punti e risultati
  if (goalsC > goalsT) {
    sCasa.matchWon += 1;
    sCasa.points += 3;
    sTrasferta.matchLost += 1;
  } else if (goalsC < goalsT) {
    sTrasferta.matchWon += 1;
    sTrasferta.points += 3;
    sCasa.matchLost += 1;
  } else {
    sCasa.matchDrawn += 1;
    sTrasferta.matchDrawn += 1;
    sCasa.points += 1;
    sTrasferta.points += 1;
  }

  await sCasa.save();
  await sTrasferta.save();
}
/**
 * Genera il calendario completo distribuendo i match su più giorni e orari
 */
async function generateMatches(teams, referees) {
  if (teams.length !== 20) {
    throw new Error("Devono esserci ESATTAMENTE 20 squadre");
  }

  const stagione = "2025/2026";
  // Punto di inizio: il venerdì della prima settimana di campionato
  const baseStartDate = new Date("2025-09-05T00:00:00");

  let matchIdCounter = 1;
  const teamList = [...teams];
  const rounds = [];

  // Algoritmo circle method per generare gli accoppiamenti
  for (let round = 0; round < 19; round++) {
    const matches = [];
    for (let i = 0; i < 10; i++) {
      const home = teamList[i];
      const away = teamList[19 - i];
      matches.push({ home, away });
    }
    rounds.push(matches);

    const fixed = teamList[0];
    const rest = teamList.slice(1);
    rest.unshift(rest.pop());
    teamList.splice(0, teamList.length, fixed, ...rest);
  }

  const allMatchesRaw = [];

  // Genero i match di andata e ritorno
  for (let roundIdx = 0; roundIdx < 38; roundIdx++) {
    const isRitorno = roundIdx >= 19;
    const currentRound = rounds[isRitorno ? roundIdx - 19 : roundIdx];
    
    // Definisco gli slot orari richiesti per la giornata
    // Giorno 0 = Sabato, Giorno 1 = Domenica, Giorno 2 = Lunedì
    const slots = [
      { dayOffset: 1, hour: 18, min: 0 },  // Sabato 18:00 (1 partita)
      { dayOffset: 1, hour: 21, min: 0 },  // Sabato 21:00 (1 partita)
      { dayOffset: 2, hour: 12, min: 30 }, // Domenica 12:30 (1 partita)
      { dayOffset: 2, hour: 15, min: 0 },  // Domenica 15:00 (3 partite)
      { dayOffset: 2, hour: 15, min: 0 },
      { dayOffset: 2, hour: 15, min: 0 },
      { dayOffset: 2, hour: 18, min: 0 },  // Domenica 18:00 (1 partita)
      { dayOffset: 2, hour: 21, min: 0 },  // Domenica 21:00 (1 partita)
      { dayOffset: 3, hour: 21, min: 0 }   // Lunedì 21:00 (1 partita)
      // Nota: lo slot mancante (10° match) lo assegno al sabato pomeriggio per completare
      ,{ dayOffset: 1, hour: 15, min: 0 } 
    ];

    // Mischio i match della giornata per assegnarli randomicamente agli slot
    const shuffledRoundMatches = shuffle([...currentRound]);

    shuffledRoundMatches.forEach((m, i) => {
      const slot = slots[i];
      const matchDate = new Date(baseStartDate);
      // Sposto la data alla settimana corretta e aggiungo l'offset del giorno
      matchDate.setDate(baseStartDate.getDate() + (roundIdx * 7) + slot.dayOffset);
      matchDate.setHours(slot.hour, slot.min, 0, 0);

      allMatchesRaw.push({
        giornata: roundIdx + 1,
        casa: isRitorno ? m.away : m.home,
        trasferta: isRitorno ? m.home : m.away,
        dataOra: matchDate
      });
    });
  }

  const matchDocs = [];
  const refereesDb = await Referee.find();

  for (const m of allMatchesRaw) {
    const arbitriRandom = shuffle([...refereesDb]).slice(0, 4);

    matchDocs.push({
      matchId: matchIdCounter++,
      stagione,
      giornata: m.giornata,
      dataOra: m.dataOra,
      stadio: m.casa.stadio,
      arbitri: {
        principale: arbitriRandom[0],
        guardalinee1: arbitriRandom[1],
        guardalinee2: arbitriRandom[2],
        quartoUomo: arbitriRandom[3]
      },
      squadre: {
        casa: { teamId: m.casa.teamId, nome: m.casa.nome },
        trasferta: { teamId: m.trasferta.teamId, nome: m.trasferta.nome }
      }
    });
  }

  await Match.insertMany(matchDocs);
}

async function generateStandings(teams) {
  const season = "2025/2026";

  const standings = teams.map(team => ({
    season,
    teamId: team.teamId,
    nome: team.nome,
    matchPlayed: 0,
    matchWon: 0,
    matchDrawn: 0,
    matchLost: 0,
    goals: 0,
    goalsConceded: 0,
    points: 0
  }));

  await Standing.insertMany(standings);
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
        social: t.social,      
        allenatore: t.allenatore,
      }))
    );

    const teamsDb = await Team.find();

    console.log("Import players...");
    const players = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "players_scraped_final.json"),
        "utf-8"
      )
    );

    await Player.insertMany(
      players.map(p => {
        const matchTeam = teamsDb.find(t => t.nome.toLowerCase() === p.squadra.toLowerCase());
        const playerName = `${p.nome} ${p.cognome}`;

        return {
          playerId: p.idEsterno || p.id,
          nome: safeName(p.nome),
          cognome: safeSurname(p.cognome),
          // mapping del ruolo con logging
          ruolo: mapRuolo(p.ruolo, playerName),
          nazionalita: p.nazionalita === "N/D" ? "Sconosciuta" : p.nazionalita,
          dataNascita: safeBirthDate(p.dataNascita),
          altezzaCm: parseOrRandom(p.altezza, 160, 205),
          pesoKg: parseOrRandom(p.peso, 60, 100),
          foto: p.foto || null, // Importo la foto dal JSON
          currentTeam: { 
              teamId: matchTeam ? matchTeam.teamId : null, 
              nome: p.squadra 
          },
        };
      })
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
    const refereesDb = await Referee.find();

    await generateMatches(teamsDb, refereesDb);

    console.log("Inizializzazione classifica...");
    await generateStandings(teamsDb);

    console.log("Simulazione campionato...");
    // Impostare il numero di giornare da simulare
    await playInitialMatches(15); 



    console.log("DB inizializzato con Mongoose");
  } catch (err) {
    console.error("Errore inizializzazione DB:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

init();
