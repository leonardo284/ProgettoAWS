/*const axios = require('axios');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../db/data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generaTeams() {
  const res = await axios.get(
    'https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Italian%20Serie%20A'
  );

  let idCounter = 1;

  const teams = res.data.teams.map(t => ({
    id: idCounter++, // ID tuo progressivo

    nome: t.strTeam,
    league: "Serie A",

    stadio: {
      nome: t.strStadium,
      capienza: Number(t.intStadiumCapacity),
      citta: t.strLocation
    },

    descrizione: t.strDescriptionIT || t.strDescriptionEN,

    social: {
      sito: t.strWebsite,
      facebook: t.strFacebook,
      twitter: t.strTwitter,
      instagram: t.strInstagram,
      youtube: t.strYoutube
    },

    colori: [
      t.strColour1,
      t.strColour2
    ].filter(Boolean),

    logo: t.strLogo,
    badge: t.strBadge,
    banner: t.strBanner,

    fanart: [
      t.strFanart1,
      t.strFanart2,
      t.strFanart3,
      t.strFanart4
    ].filter(Boolean),

    idAPIfootball: t.idAPIfootball
  }));

  fs.writeFileSync(
    path.join(outputDir, 'teams.json'),
    JSON.stringify(teams, null, 2)
  );

  console.log("Il file teams.json è stato generato.");
}

generaTeams();*/

/********************************************************************************************** */

/*
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "../db/data");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function importaDati() {
  console.log("⏳ Scarico squadre Serie A...");

  const resTeams = await axios.get(
    "https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Italian%20Serie%20A"
  );

  let teamIdCounter = 1;
  let playerIdCounter = 1;

  // ============================
  // ✅ TEAMS.JSON (CON idTheSportsDB)
  // ============================

  const teams = resTeams.data.teams.map(t => ({
    id: teamIdCounter++,             // ✅ ID tuo
    idTheSportsDB: t.idTeam,         // ✅ ID per prendere i giocatori
    idAPIfootball: t.idAPIfootball, // ✅ opzionale per il futuro

    nome: t.strTeam,
    league: "Serie A",

    stadio: {
      nome: t.strStadium,
      capienza: Number(t.intStadiumCapacity),
      citta: t.strLocation
    },

    descrizione: t.strDescriptionIT || t.strDescriptionEN,

    social: {
      sito: t.strWebsite,
      facebook: t.strFacebook,
      twitter: t.strTwitter,
      instagram: t.strInstagram,
      youtube: t.strYoutube
    },

    colori: [t.strColour1, t.strColour2].filter(Boolean),

    logo: t.strLogo,
    badge: t.strBadge,
    banner: t.strBanner,

    fanart: [
      t.strFanart1,
      t.strFanart2,
      t.strFanart3,
      t.strFanart4
    ].filter(Boolean)
  }));

  fs.writeFileSync(
    path.join(outputDir, "teams.json"),
    JSON.stringify(teams, null, 2)
  );

  console.log("✅ teams.json creato");

  // ============================
  // ✅ PLAYERS.JSON (USANDO idTeam)
  // ============================

  console.log("⏳ Scarico giocatori per ogni squadra...");

  let players = [];

  for (const team of teams) {
    console.log(`➡️ ${team.nome}`);

    const resPlayers = await axios.get(
      `https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${team.idTheSportsDB}`
    );

    if (!resPlayers.data.player) continue;

    const cleanPlayers = resPlayers.data.player.map(p => {
      const nomeCompleto = p.strPlayer?.split(" ") || [];
      const nome = nomeCompleto.shift() || "";
      const cognome = nomeCompleto.join(" ");

      return {
        id: playerIdCounter++,        // ✅ ID tuo progressivo
        idTheSportsDB: p.idPlayer,    // ✅ ID API UTILE

        nome: nome,
        cognome: cognome,

        altezza: p.strHeight,
        peso: p.strWeight,
        nazionalita: p.strNationality,

        dataNascita: p.dateBorn,
        ruolo: p.strPosition,
        stato: p.strStatus,

        squadra: team.nome,

        descrizione:
          p.strDescriptionIT ||
          p.strDescriptionEN ||
          p.strDescriptionFR,

        immagini: {
          foto: p.strThumb,
          sagoma: p.strCutout,
          render: p.strRender
        }
      };
    });

    players = players.concat(cleanPlayers);
  }

  fs.writeFileSync(
    path.join(outputDir, "players.json"),
    JSON.stringify(players, null, 2)
  );

  console.log("✅ players.json creato");
  console.log("🔥 IMPORT COMPLETATO!");
}

importaDati();*/

/**********************************************************************************************/

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// === Carica le squadre dal tuo JSON ===
const teamsPath = path.join(__dirname, "../db/data/teams.json");
const teams = JSON.parse(fs.readFileSync(teamsPath, "utf-8"));

let players = [];
let playerId = 1;

// === Funzione che costruisce l'URL Wikipedia della rosa ===
function buildWikiUrl(teamName) {
  const mapping = {
    "AC Milan": "Associazione_Calcio_Milan",
    "Atalanta": "Atalanta_Bergamasca_Calcio",
    "Bologna": "Bologna_Football_Club_1909",
    "Cagliari": "Cagliari_Calcio",
    "Como": "Como_1907",
    "Cremonese": "Unione_Sportiva_Cremonese",
    "Fiorentina": "ACF_Fiorentina",
    "Genoa": "Genoa_Cricket_and_Football_Club",
    "Hellas Verona": "Hellas_Verona_Football_Club",
    "Inter Milan": "Football_Club_Internazionale_Milano",
    "Juventus": "Juventus_Football_Club",
    "Lazio": "Società_Sportiva_Lazio",
    "Lecce": "Unione_Sportiva_Lecce",
    "Napoli": "Società_Sportiva_Calcio_Napoli",
    "Parma": "Parma_Calcio_1913",
    "Pisa": "Pisa_Sporting_Club",
    "Roma": "Associazione_Sportiva_Roma",
    "Sassuolo": "Unione_Sportiva_Sassuolo_Calcio",
    "Torino": "Torino_Football_Club",
    "Udinese": "Udinese_Calcio"
  };

  const page = mapping[teamName];
  if (!page) return null;

  return `https://it.wikipedia.org/wiki/${page}`;
}
async function scrapeTeam(team) {
  console.log(`➡️ Scarico rosa completa: ${team.nome}`);

  const url = buildWikiUrl(team.nome);
  if (!url) return;

  try {
    const res = await axios.get(url + "?printable=yes", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "it-IT,it;q=0.9"
      }
    });

    const $ = cheerio.load(res.data);

    let totaleSquadra = 0;

    // ✅ Prendiamo TUTTE le tabelle con intestazione tipica della rosa
    $("table.wikitable").each((_, table) => {
      const header = $(table).find("th").first().text().toLowerCase();

      // ✅ queste parole chiave identificano una rosa vera
      if (
        header.includes("ruolo") ||
        header.includes("n.") ||
        header.includes("n°") ||
        header.includes("giocatore")
      ) {
        $(table).find("tbody tr").each((_, row) => {
          let nomeCompleto = "";

          $(row).find("a[href^='/wiki/']").each((_, a) => {
            const txt = $(a).text().trim();
            if (
              txt.length > 4 &&
              !/^\d+$/.test(txt) &&
              !txt.startsWith("[") &&
              !txt.toLowerCase().includes("staff")
            ) {
              nomeCompleto = txt;
              return false;
            }
          });

          if (!nomeCompleto) return;

          const parti = nomeCompleto.split(" ");
          const nome = parti.shift();
          const cognome = parti.join(" ");

          players.push({
            id: playerId++,
            nome,
            cognome,
            altezza: "N/D",
            peso: "N/D",
            nazionalita: "N/D",
            dataNascita: "N/D",
            ruolo: "N/D",
            squadra: team.nome,
            foto: "",
            idEsterno: 900000 + playerId
          });

          totaleSquadra++;
        });
      }
    });

    console.log(`✅ ${team.nome}: ${totaleSquadra} giocatori`);

  } catch (err) {
    console.error(`❌ Errore su ${team.nome}:`, err.response?.status);
  }
}






async function start() {
  for (const team of teams) {
    await scrapeTeam(team);
  }

  const outputPath = path.join(__dirname, "../db/data/players1.json");

  fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));
  console.log(`✅ players.json creato con ${players.length} giocatori`);
}

start();



