const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const Team = require("../../src/models/team");
const Player = require("../../src/models/player");
const Referee = require("../../src/models/referee");
const Match = require("../../src/models/match");
const Standing = require("../../src/models/standing");
const PlayerStats = require("../../src/models/playerStats");
const User = require("../../src/models/user");

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

async function initializePlayerStats(players, stagione) {
  console.log("Inizializzazione tabella statistiche giocatori...");
  const statsDocs = players.map(p => ({
    playerId: p.playerId,
    nome: p.nome,
    cognome: p.cognome,
    foto: p.foto,
    teamId: p.currentTeam.teamId,
    teamNome: p.currentTeam.nome,
    stagione: stagione,
    stats: {
      presenze: 0,
      minutiGiocati: 0,
      gol: 0,
      assist: 0,
      falliFatti: 0,
      ammonizioni: 0,
      espulsioni: 0
    }
  }));

  await PlayerStats.insertMany(statsDocs);
}

async function updatePlayerStatsAfterMatch(match) {
    if (!match.squadre.casa.formazione || !match.squadre.trasferta.formazione) return;

    // Mappa per tenere traccia dei minuti di ogni giocatore in questa partita
    const minutiPartita = new Map();

    const elaboraSquadra = (squadra) => {
        // I titolari partono con 90 minuti potenziali
        squadra.formazione.titolari.forEach(p => minutiPartita.set(p.playerId, 90));
        // Chi è in panchina parte con 0
        squadra.formazione.panchina.forEach(p => minutiPartita.set(p.playerId, 0));
    };

    elaboraSquadra(match.squadre.casa);
    elaboraSquadra(match.squadre.trasferta);

    // Analizzo gli eventi per modificare i minuti (Sostituzioni ed Espulsioni)
    match.eventi.forEach(evento => {
        if (evento.tipo === "SOSTITUZIONE") {
            // Chi esce (era tra i titolari o è entrato prima)
            // Nota: assumo che il playerId dell'evento sia chi ENTRA
            const titolariRimasti = match.squadre.casa.formazione.titolari.concat(match.squadre.trasferta.formazione.titolari)
                .filter(t => minutiPartita.get(t.playerId) === 90);
            
            if (titolariRimasti.length > 0) {
                const uscito = titolariRimasti[Math.floor(Math.random() * titolariRimasti.length)];
                minutiPartita.set(uscito.playerId, evento.minuto); // Gioca solo fino al cambio
            }
            
            // Chi entra gioca dal minuto del cambio fino alla fine
            minutiPartita.set(evento.playerId, 90 - evento.minuto);
        }

        if (evento.tipo === "ESPULSIONE") {
            // Se viene espulso, gioca solo fino a quel minuto
            minutiPartita.set(evento.playerId, evento.minuto);
        }
    });

    // 1. Aggiornamento Presenze e Minuti
    for (const [pid, min] of minutiPartita) {
        if (min > 0) {
            await PlayerStats.updateOne(
                { playerId: pid },
                { $inc: { "stats.presenze": 1, "stats.minutiGiocati": min } }
            );
        }
    }

    // 2. Aggiornamento altri eventi (Goal, Assist, Falli, Cartellini)
    for (const evento of match.eventi) {
        if (!evento.playerId && evento.tipo !== "GOAL") continue;

        let updateFields = {};
        switch (evento.tipo) {
            case "GOAL":
                if (evento.playerId) updateFields["stats.gol"] = 1;
                if (evento.assistPlayerId) {
                    await PlayerStats.updateOne(
                        { playerId: evento.assistPlayerId },
                        { $inc: { "stats.assist": 1 } }
                    );
                }
                break;
            case "AMMONIZIONE":
                updateFields["stats.ammonizioni"] = 1;
                break;
            case "ESPULSIONE":
                updateFields["stats.espulsioni"] = 1;
                break;
            case "FALLO":
                updateFields["stats.falliFatti"] = 1;
                break;
        }

        if (Object.keys(updateFields).length > 0 && evento.playerId) {
            await PlayerStats.updateOne({ playerId: evento.playerId }, { $inc: updateFields });
        }
    }
}

/**
 * Genera l'utente amministratore con password cifrata
 */
async function generateAdmin() {
  console.log("Creazione utente amministratore...");
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("admin", saltRounds);

  const admin = new User({
    username: "admin",
    password: hashedPassword,
    role: "administrator"
  });

  await admin.save();
  console.log("Utente 'admin' creato con successo.");
}

/**
 * Simula il gioco delle prime N giornate di campionato con eventi dettagliati
 */
async function playInitialMatches(nGiornate) {
  console.log(`\n--- Simulazione prime ${nGiornate} giornate con eventi dettagliati ---`);
  
  const matches = await Match.find({ giornata: { $lte: nGiornate } }).sort({ giornata: 1 });

  for (const match of matches) {
    const eventiMatch = [];
    const minutiOccupati = new Set();

    // Helper per ottenere un minuto libero
    const getFreeMinute = (minStart = 1, minEnd = 90) => {
      let tentativi = 0;
      while (tentativi < 100) {
        const m = Math.floor(Math.random() * (minEnd - minStart + 1)) + minStart;
        if (!minutiOccupati.has(m)) {
          minutiOccupati.add(m);
          return m;
        }
        tentativi++;
      }
      return null;
    };

    // Helper per generare eventi per una squadra
    const generaEventiSquadra = async (squadraType) => {
      const squadraData = match.squadre[squadraType];
      const idSquadra = squadraData.teamId;
      
      // Recuperiamo i giocatori dal DB per avere l'anagrafica completa
      const allPlayers = await Player.find({ "currentTeam.teamId": idSquadra });
      
      // Liste dinamiche per gestire le sostituzioni correttamente
      // Usiamo gli ID degli snapshot della formazione salvata nel match
      let inCampoIds = squadraData.formazione.titolari.map(p => p.playerId);
      let inPanchinaIds = squadraData.formazione.panchina.map(p => p.playerId);

      // 1. GOAL (0-4)
      const nGoals = randomInt(0, 4);
      for (let i = 0; i < nGoals; i++) {
        const min = getFreeMinute();
        if (!min || inCampoIds.length === 0) continue;
        
        const marcatoreId = inCampoIds[Math.floor(Math.random() * inCampoIds.length)];
        let assistmanId = null;
        if (Math.random() > 0.5 && inCampoIds.length > 1) {
          const potenzialiAssist = inCampoIds.filter(id => id !== marcatoreId);
          assistmanId = potenzialiAssist[Math.floor(Math.random() * potenzialiAssist.length)];
        }

        eventiMatch.push({
          minuto: min,
          tipo: "GOAL",
          squadraId: idSquadra,
          playerId: marcatoreId,
          assistPlayerId: assistmanId,
          dettaglio: Math.random() > 0.9 ? "Rigore" : "Azione"
        });
      }

      // 2. AMMONIZIONI (1-4)
      const nGialli = randomInt(1, 4);
      for (let i = 0; i < nGialli; i++) {
        const min = getFreeMinute();
        if (min && inCampoIds.length > 0) {
          const pId = inCampoIds[Math.floor(Math.random() * inCampoIds.length)];
          eventiMatch.push({ minuto: min, tipo: "AMMONIZIONE", squadraId: idSquadra, playerId: pId });
        }
      }

      // 3. SOSTITUZIONI (0-3) - Qui gestisco PLAYER IN e PLAYER OUT
      const nSost = randomInt(0, 3);
      for (let i = 0; i < nSost; i++) {
        const min = getFreeMinute(30, 85);
        if (min && inCampoIds.length > 0 && inPanchinaIds.length > 0) {
          // Scelgo chi esce (tra quelli attualmente in campo)
          const outIndex = Math.floor(Math.random() * inCampoIds.length);
          const pOutId = inCampoIds.splice(outIndex, 1)[0];

          // Scelgo chi entra (dalla panchina)
          const inIndex = Math.floor(Math.random() * inPanchinaIds.length);
          const pInId = inPanchinaIds.splice(inIndex, 1)[0];

          // Aggiorno chi è in campo
          inCampoIds.push(pInId);

          eventiMatch.push({ 
            minuto: min, 
            tipo: "SOSTITUZIONE", 
            squadraId: idSquadra, 
            playerId: pInId,      // Entra
            playerOutId: pOutId,  // Esce (fondamentale per i minuti!)
            dettaglio: "Cambio tattico" 
          });
        }
      }

      // 4. ALTRI EVENTI (Falli, Angoli, Rossi)
      // Falli
      for (let i = 0; i < randomInt(4, 10); i++) {
        const min = getFreeMinute();
        if (min && inCampoIds.length > 0) {
          const pId = inCampoIds[Math.floor(Math.random() * inCampoIds.length)];
          eventiMatch.push({ minuto: min, tipo: "FALLO", squadraId: idSquadra, playerId: pId });
        }
      }
      // Angoli
      for (let i = 0; i < randomInt(2, 7); i++) {
        const min = getFreeMinute();
        if (min) eventiMatch.push({ minuto: min, tipo: "ANGOLO", squadraId: idSquadra });
      }
      // Espulsioni
      if (Math.random() > 0.8) {
        const min = getFreeMinute();
        if (min && inCampoIds.length > 0) {
          const pId = inCampoIds[Math.floor(Math.random() * inCampoIds.length)];
          // Se espulso, lo tolgo dal campo
          inCampoIds = inCampoIds.filter(id => id !== pId);
          eventiMatch.push({ minuto: min, tipo: "ESPULSIONE", squadraId: idSquadra, playerId: pId });
        }
      }
    };

    // Generiamo eventi per casa e trasferta
    await generaEventiSquadra("casa");
    await generaEventiSquadra("trasferta");

    // Ordiniamo gli eventi per minuto
    eventiMatch.sort((a, b) => a.minuto - b.minuto);

    // Calcoliamo risultato finale
    const goalsC = eventiMatch.filter(e => e.tipo === "GOAL" && e.squadraId === match.squadre.casa.teamId).length;
    const goalsT = eventiMatch.filter(e => e.tipo === "GOAL" && e.squadraId === match.squadre.trasferta.teamId).length;

    // Aggiornamento Match
    match.risultato.casa = goalsC;
    match.risultato.trasferta = goalsT;
    match.eventi = eventiMatch;
    match.stato = "FINITA";
    match.spettatori = Math.floor(Math.random() * 30000) + 5000;
    await match.save();

    // Aggiornamento statistiche giocatori e classifica
    await updatePlayerStatsAfterMatch(match);
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
 * Popola inoltre le formazioni (titolari 4-3-3 e panchina) per ogni squadra
 */
async function generateMatches(teams, refereesDb) {
  if (teams.length !== 20) {
    throw new Error("Devono esserci ESATTAMENTE 20 squadre");
  }

  const stagione = "2025/2026";
  const baseStartDate = new Date("2025-09-05T00:00:00");

  let matchIdCounter = 1;
  const teamList = [...teams];
  const rounds = [];

  // 1. Algoritmo circle method per gli accoppiamenti
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

  // 2. Generazione date e slot per le 38 giornate
  for (let roundIdx = 0; roundIdx < 38; roundIdx++) {
    const isRitorno = roundIdx >= 19;
    const currentRound = rounds[isRitorno ? roundIdx - 19 : roundIdx];
    
    const slots = [
      { dayOffset: 1, hour: 15, min: 0 }, { dayOffset: 1, hour: 18, min: 0 },
      { dayOffset: 1, hour: 21, min: 0 }, { dayOffset: 2, hour: 12, min: 30 },
      { dayOffset: 2, hour: 15, min: 0 }, { dayOffset: 2, hour: 15, min: 0 },
      { dayOffset: 2, hour: 15, min: 0 }, { dayOffset: 2, hour: 18, min: 0 },
      { dayOffset: 2, hour: 21, min: 0 }, { dayOffset: 3, hour: 21, min: 0 }
    ];

    const shuffledRoundMatches = shuffle([...currentRound]);

    shuffledRoundMatches.forEach((m, i) => {
      const slot = slots[i];
      const matchDate = new Date(baseStartDate);
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

  // 3. Creazione Partite con formazioni (4-3-3)
  const matchDocs = [];

  // Funzione interna per generare la formazione snapshot
  const generateFormation = async (teamId) => {
    const players = await Player.find({ "currentTeam.teamId": teamId });
    
    const filterByRole = (role) => players.filter(p => p.ruolo === role);

    const titolari = [
      ...shuffle(filterByRole("Portiere")).slice(0, 1),
      ...shuffle(filterByRole("Difensore")).slice(0, 4),
      ...shuffle(filterByRole("Centrocampista")).slice(0, 3),
      ...shuffle(filterByRole("Attaccante")).slice(0, 3)
    ];

    const titolariIds = new Set(titolari.map(t => t.playerId));
    const panchina = players.filter(p => !titolariIds.has(p.playerId));

    const toSnapshot = (p) => ({
      playerId: p.playerId,
      nome: `${p.nome} ${p.cognome}`,
      ruolo: p.ruolo
    });

    return {
      titolari: titolari.map(toSnapshot),
      panchina: panchina.map(toSnapshot)
    };
  };

  console.log("Generazione partite e formazioni in corso...");
  
  for (const m of allMatchesRaw) {
    const arbitriRandom = shuffle([...refereesDb]).slice(0, 4);
    
    const formazioneCasa = await generateFormation(m.casa.teamId);
    const formazioneTrasferta = await generateFormation(m.trasferta.teamId);

    matchDocs.push({
      matchId: matchIdCounter++,
      stagione,
      giornata: m.giornata,
      dataOra: m.dataOra,
      stadio: m.casa.stadio,
      arbitri: {
        principale: { refereeId: arbitriRandom[0].refereeId, nome: arbitriRandom[0].nome, cognome: arbitriRandom[0].cognome },
        guardalinee1: { refereeId: arbitriRandom[1].refereeId, nome: arbitriRandom[1].nome, cognome: arbitriRandom[1].cognome },
        guardalinee2: { refereeId: arbitriRandom[2].refereeId, nome: arbitriRandom[2].nome, cognome: arbitriRandom[2].cognome },
        quartoUomo: { refereeId: arbitriRandom[3].refereeId, nome: arbitriRandom[3].nome, cognome: arbitriRandom[3].cognome }
      },
      squadre: {
        casa: { 
          teamId: m.casa.teamId, 
          nome: m.casa.nome,
          formazione: formazioneCasa
        },
        trasferta: { 
          teamId: m.trasferta.teamId, 
          nome: m.trasferta.nome,
          formazione: formazioneTrasferta
        }
      },
      risultato: { casa: 0, trasferta: 0 },
      eventi: [],
      stato: "NON_INIZIATA"
    });
  }

  await Match.insertMany(matchDocs);
  console.log(`${matchDocs.length} match generati con successo.`);
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

    console.log("Generazione utente admin...");
    await generateAdmin();

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
        logo: t.badge,
        banner: t.banner,
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

    const stagione = "2025/2026";
    const allPlayers = await Player.find();
    await initializePlayerStats(allPlayers, stagione);

    console.log("Simulazione campionato...");
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
