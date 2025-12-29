/*
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "../db/data/players.json");
const outputPath = path.join(__dirname, "../db/data/players_enriched.json");

const players = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
let enriched = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ✅ costruisce URL Wikipedia dal nome
function buildPlayerUrl(nome, cognome) {
  const fullName = `${nome}_${cognome}`.replace(/ /g, "_");
  return `https://it.wikipedia.org/wiki/${fullName}`;
}

async function scrapePlayer(player, index, total) {
  const url = buildPlayerUrl(player.nome, player.cognome);

  console.log(`🔎 [${index + 1}/${total}] ${player.nome} ${player.cognome}`);

  try {
    const res = await axios.get(url + "?printable=yes", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "it-IT,it;q=0.9"
      }
    });

    const $ = cheerio.load(res.data);
    const infobox = $("table.infobox");

    let nazionalita = "N/D";
    let dataNascita = "N/D";
    let altezza = "N/D";
    let peso = "N/D";
    let ruolo = player.ruolo || "N/D";

    infobox.find("tr").each((_, row) => {
      const label = $(row).find("th").text().toLowerCase();
      const value = $(row).find("td").text().trim();

      if (label.includes("nascita")) dataNascita = value;
      if (label.includes("nazionalit")) nazionalita = value;
      if (label.includes("altezza")) altezza = value;
      if (label.includes("peso")) peso = value;
      if (label.includes("ruolo")) ruolo = value;
    });

    enriched.push({
      ...player,
      nazionalita,
      dataNascita,
      altezza,
      peso,
      ruolo
    });

    console.log(`✅ OK: ${player.nome} ${player.cognome}`);

  } catch (err) {
    console.warn(`⚠️ ERRORE su ${player.nome} ${player.cognome} → ${err.response?.status || err.message}`);

    enriched.push({
      ...player,
      scrapeError: true
    });
  }

  // ✅ pausa anti-ban
  await sleep(900);
}

async function start() {
  console.log(`🚀 Inizio arricchimento di ${players.length} giocatori...\n`);

  for (let i = 0; i < players.length; i++) {
    await scrapePlayer(players[i], i, players.length);
  }

  fs.writeFileSync(outputPath, JSON.stringify(enriched, null, 2));
  console.log(`\n✅ players_enriched.json creato con ${enriched.length} giocatori`);
}

start();*/


/************************************************************************************* */
// ======================= FUNZIONI UTILITY =======================
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

// ======================= CONFIGURAZIONE FINALE =======================
const INPUT_FILE = path.join(__dirname, "../db/data/players.json"); 
const OUTPUT_FILE = path.join(__dirname, "players_scraped_final.json"); // File di output finale
const REQUEST_DELAY_MS = 500; // Ritardo tra le richieste (Raccomandato)
const MAX_PLAYERS = Infinity; // *** RIMOSSO IL LIMITE: PROCESSA TUTTI I GIOCATORI ***

// ======================= FUNZIONI UTILITY =======================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeForUrl(str) {
    if (!str) return "";
    return str.trim().replace(/ /g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function buildWikiUrl(player) {
    const nomeNorm = normalizeForUrl(player.nome);
    const cognomeNorm = normalizeForUrl(player.cognome);
    return `https://it.wikipedia.org/wiki/${nomeNorm}_${cognomeNorm}`;
}

function cleanText(text) {
    if (!text) return "";
    return text
        .replace(/\[\d+\]/g, '') // Rimuove riferimenti come [1], [2]
        .replace(/\n/g, ' ')      // Rimuove newlines
        .trim();
}

function getMonthMap() {
    return {
        'gennaio': '01', 'febbraio': '02', 'marzo': '03',
        'aprile': '04', 'maggio': '05', 'giugno': '06',
        'luglio': '07', 'agosto': '08', 'settembre': '09',
        'ottobre': '10', 'novembre': '11', 'dicembre': '12',
    };
}

/**
 * Converte una data stringa italiana (es. "12 giugno 2002") nel formato DD/MM/YYYY.
 */
function formatDateStringToDDMMYYYY(dobString) {
    if (!dobString) return "N/D";
    
    const parts = dobString.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(p => p.length > 0);
    
    if (parts.length < 3) return "N/D";

    const day = parts[0].padStart(2, '0');
    const monthName = parts[1];
    const year = parts[2];
    
    const monthMap = getMonthMap();
    const month = monthMap[monthName];

    if (day && month && year) {
        return `${day}/${month}/${year}`;
    }
    
    return "N/D";
}

/**
 * Calcola l'età in base alla data di nascita in formato DD/MM/YYYY.
 */
function calculateAge(formattedDob) {
    if (!formattedDob || formattedDob === "N/D") return "N/D";
    
    const parts = formattedDob.split('/');
    if (parts.length !== 3) return "N/D";

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const year = parseInt(parts[2], 10);
    
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age > 0 && age < 100 ? age : "N/D";
}

/**
 * Estrae i dati principali dalla pagina Wikipedia.
 */
function extractFromPage(html, url) {
    const $ = cheerio.load(html);
    
    let foto = "";
    let rawDataNascita = ""; 
    let altezza = "";
    let peso = "";
    let nazionalita = "";
    let ruolo = "";

    // 1. ESTRAZIONE DATA DI NASCITA DALLA FRASE INTRODUTTIVA
    const firstParagraph = $("#mw-content-text p").first().text();
    const parenthesesMatch = firstParagraph.match(/\((.*?)\)/);

    if (parenthesesMatch && parenthesesMatch[1]) {
        const dateMatch = parenthesesMatch[1].match(/(\d{1,2}\s+[A-Za-zèòàùì]+\s+\d{4})/i);
        if (dateMatch && dateMatch[1]) {
            rawDataNascita = cleanText(dateMatch[1]); 
        }
    }
    
    // 2. ESTRAZIONE DATI DALL'INFOBOX (se presente)
    const box = $("table.infobox.calcio, table.infobox, table.sinottico").first();

    if (box.length) {
        // Estrazione Foto con filtro anti-bandiera/icona
        const img = box.find("img").first();
        if (img.length) {
            const src = img.attr("src");
            // Filtra immagini piccole (spesso icone o bandiere)
            const isSmallIcon = src && src.match(/(\d+)px/i) && parseInt(src.match(/(\d+)px/i)[1]) < 70;
            
            if (src && !isSmallIcon) {
                 foto = src.startsWith("http") ? src : `https:${src}`;
            }
        }

        // Estrazione Dati tramite righe (<tr>)
        box.find("tr").each((i, el) => {
            const th = $(el).find("th").first(); 
            const td = $(el).find("td").first(); 

            if (!th.length || !td.length) return;

            const label = cleanText(th.text()).toLowerCase();
            const value = cleanText(td.text());

            // Estrazione Altri Campi
            if (label.includes("ruolo") && !ruolo) {
                ruolo = value;
            } else if (label.includes("altezza") && !altezza) {
                altezza = value;
            } else if (label.includes("peso") && !peso) {
                peso = value;
            } else if (label.includes("nazionalit") && !nazionalita) {
                nazionalita = value;
            }
            
            // Estrazione data di nascita dall'infobox (solo se non trovata prima)
            else if ((label.includes("nascita") || label.includes("data di nascita")) && !rawDataNascita) {
                 const spanBday = td.find('span.bday').text().trim();
                 rawDataNascita = spanBday || value; 
            }
        });
    }
    
    // 3. Formatta la data e calcola l'età
    const dataNascitaFormatted = formatDateStringToDDMMYYYY(rawDataNascita);
    const eta = calculateAge(dataNascitaFormatted);

    return {
        foto,
        dataNascita: dataNascitaFormatted,
        eta,
        altezza,
        peso,
        nazionalita,
        ruolo,
        wikipedia: url,
    };
}

// ======================= FUNZIONE PRINCIPALE =======================

async function startScraping() {
    try {
        console.log(`\n⏳ Lettura di ${INPUT_FILE}...`);
        const allPlayers = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));
        
        // Non si usa .slice() quando MAX_PLAYERS è Infinity, ma per coerenza lo lasciamo
        const players = allPlayers.slice(0, MAX_PLAYERS); 
        
        console.log(`✅ Trovati ${allPlayers.length} giocatori. Avvio processo di scraping.`);

        const results = [];

        for (let i = 0; i < players.length; i++) {
            const p = players[i];
            const url = buildWikiUrl(p);

            // Stampa un progresso più chiaro
            console.log(`\n[${i + 1}/${players.length}] 🔍 Scraping: ${p.nome} ${p.cognome}...`);

            try {
                const res = await axios.get(url, { 
                    timeout: 10000, 
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                });
                
                const extra = extractFromPage(res.data, url);

                const finalData = {
                    ...p, 
                    wikipedia: extra.wikipedia,
                    foto: extra.foto || "", 
                    dataNascita: extra.dataNascita,
                    eta: extra.eta, 
                    altezza: extra.altezza || p.altezza,
                    peso: extra.peso || p.peso,
                    nazionalita: extra.nazionalita || p.nazionalita,
                    ruolo: extra.ruolo || p.ruolo, 
                };

                results.push(finalData);
                console.log(`  ✅ Dati trovati: DN: ${finalData.dataNascita}, Età: ${finalData.eta}, Alt: ${finalData.altezza}`);

            } catch (err) {
                console.log(`  ❌ ERRORE: Fallimento sulla pagina di ${p.nome} ${p.cognome} (Codice: ${err.response?.status || 'Generico'}). Saltato.`);
                
                results.push({
                    ...p,
                    wikipedia: url, // Salva comunque l'URL che ha fallito
                });
            }
            
            // Pausa solo se ci sono ancora giocatori da processare
            if (i < players.length - 1) {
                await sleep(REQUEST_DELAY_MS);
            }
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
        console.log(`\n\n🎉 PROCESSO COMPLETATO! Salvati ${results.length} giocatori nel file:\n${OUTPUT_FILE}`);

    } catch (error) {
        console.error("\n--- ERRORE FATALE ---\n", error.message);
        console.log("Verifica che il file 'players.json' esista nel percorso specificato e che le librerie siano installate.");
    }
}

startScraping();