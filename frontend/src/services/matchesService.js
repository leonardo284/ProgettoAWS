import api from './api'
import { getTeams } from './teamsService'
import { getPlayersByTeamId } from './playersService'; 


/**
 * Recupera il dettaglio completo di una singola partita tramite il suo id
 */
export async function getMatchById(id) {
  const resMatch = await api.get(`/matches/${id}`);
  const match = resMatch.data;

  // Recupero loghi e liste giocatori complete delle due squadre
  const [teams, playersCasa, playersTrasferta] = await Promise.all([
    getTeams(),
    getPlayersByTeamId(match.squadre.casa.teamId),
    getPlayersByTeamId(match.squadre.trasferta.teamId)
  ]);

  // creo lista con tutti i giocatori della partita
  const allPlayers = [...playersCasa, ...playersTrasferta];

  // Funzione per aggiungere foto e ruolo esteso a ogni giocatore nella formazione
  const enrich = (lista) => lista.map(p => {
    const dettagli = allPlayers.find(ap => ap.playerId === p.playerId);
    return { ...p, foto: dettagli?.foto || '', ruolo: dettagli?.ruolo || p.ruolo };
  });

  // recupero i due teams della partita
  const teamCasa = teams.find(t => t.teamId === match.squadre.casa.teamId);
  const teamTrasferta = teams.find(t => t.teamId === match.squadre.trasferta.teamId);

  // restituisco oltre ai dati del match anche i loghi e le formazioni arricchite
  return {
    ...match,
    squadre: {
      casa: { 
        ...match.squadre.casa, 
        logo: teamCasa?.logo,
        formazione: {
          titolari: enrich(match.squadre.casa.formazione.titolari),
          panchina: enrich(match.squadre.casa.formazione.panchina)
        }
      },
      trasferta: { 
        ...match.squadre.trasferta, 
        logo: teamTrasferta?.logo,
        formazione: {
          titolari: enrich(match.squadre.trasferta.formazione.titolari),
          panchina: enrich(match.squadre.trasferta.formazione.panchina)
        }
      }
    }
  };
}


/** 
* Recupera ogni match di una singola squadra tramite il suo id
*/
export const getMatchesByTeamId = async (teamId) => {
  try {
    // Recupera in parallelo i match della squadra e la lista completa dei team
    const [resMatches, teams] = await Promise.all([
      api.get(`/matches/squadra/${teamId}`),
      getTeams()
    ]);

    const matches = resMatches.data;

    // Inserisce il logo di ogni squadra dentro l'oggetto match
    return matches.map(match => {
      const teamCasa = teams.find(t => t.teamId === match.squadre.casa.teamId);
      const teamTrasferta = teams.find(t => t.teamId === match.squadre.trasferta.teamId);

      return {
        ...match,
        squadre: {
          casa: { ...match.squadre.casa, logo: teamCasa?.logo },
          trasferta: { ...match.squadre.trasferta, logo: teamTrasferta?.logo }
        }
      };
    });
  } catch (error) {
    console.error("Errore recupero match e loghi:", error);
    throw error;
  }
};


/**
 * Recupero le ultime N partite 
 */
export async function getLastMatches(limit = 10) {
  // Recupero tutti i match e i team
  const [resMatches, teams] = await Promise.all([
    api.get(`/matches`), 
    getTeams()
  ])

  let allMatches = resMatches.data;

  // Filtro le partite FINITE ordinate dalla più recente
  const finishedMatches = allMatches.filter(m => m.stato === "FINITA")
                                    .sort((a, b) => new Date(b.dataOra) - new Date(a.dataOra));

  let displayMatches = [];

  if (finishedMatches.length > 0) {
    // Se ci sono partite finite, prendo le ultime N
    displayMatches = finishedMatches.slice(0, limit);
  } else {
    // Se nessuna è finita, prendo le prime da giocare
    displayMatches = allMatches.filter(m => m.stato === "NON_INIZIATA")
                                .sort((a, b) => new Date(a.dataOra) - new Date(b.dataOra))
                                .slice(0, limit);
  }

  // Mappatura finale per aggiungere i loghi 
  return displayMatches.map(match => {
    const teamCasa = teams.find(t => t.teamId === match.squadre.casa.teamId || t.nome === match.squadre.casa.nome)
    const teamTrasferta = teams.find(t => t.teamId === match.squadre.trasferta.teamId || t.nome === match.squadre.trasferta.nome)

    // restituisco il match con i loghi delle squadre
    return {
      ...match,
      squadre: {
        casa: { ...match.squadre.casa, logo: teamCasa?.logo },
        trasferta: { ...match.squadre.trasferta, logo: teamTrasferta?.logo }
      }
    }
  })
}

/**
 * Recupera i match di una specifica giornata, arricchiti con i loghi delle squadre
 */
export async function getMatchesByGiornata(giornata) {
  // Recupero simultaneo di match della giornata indicata e team per avere i loghi
  const [resMatches, teams] = await Promise.all([
    api.get(`/matches/giornata/${giornata}`),
    getTeams()
  ])

  // Mappatura per inserire i loghi delle squadre
  const matchesWithLogos = resMatches.data.map(match => {
    const teamCasa = teams.find(t => t.teamId === match.squadre.casa.teamId)
    const teamTrasferta = teams.find(t => t.teamId === match.squadre.trasferta.teamId)

    return {
      ...match,
      squadre: {
        casa: { ...match.squadre.casa, logo: teamCasa?.logo },
        trasferta: { ...match.squadre.trasferta, logo: teamTrasferta?.logo }
      }
    }
  })

  return matchesWithLogos
}

/**
 * Raggruppa e ordina i match per data
 */
export const groupMatchesByDate = (matches) => {
  // ordino i match per data
  const sortedMatches = [...matches].sort((a, b) => new Date(a.dataOra) - new Date(b.dataOra))

  // creo un dizionario dove la chiave è la data e il valore è la lista dei match di quella data
  return sortedMatches.reduce((groups, match) => {
    // estraggo la parte di data (YYYY-MM-DD) dalla data completa che funge da chiave
    const dateKey = new Date(match.dataOra).toISOString().split('T')[0]
    
    // se il gruppo per quella data non esiste, lo creo
    if (!groups[dateKey]) groups[dateKey] = []
    
    // aggiungo il match al gruppo corrispondente
    groups[dateKey].push(match)
    return groups
  }, {})
}


// --- LIVE ACTIONS ---

/**
 * Inizia il primo tempo (imposta stato e timestamp)
 */
export async function startFirstHalf(id) {
  const res = await api.post(`/matches/${id}/start-first-half`);
  return res.data;
}

/**
 * Inizia il secondo tempo (resetta timestamp)
 */
export async function startSecondHalf(id) {
  const res = await api.post(`/matches/${id}/start-second-half`);
  return res.data;
}

/**
 * Termina il tempo attuale (Intervallo o Fine Gara)
 */
export async function endPeriod(id) {
  const res = await api.post(`/matches/${id}/end-period`);
  return res.data;
}

/**
 * Aggiunge un evento live (il minuto viene calcolato dal backend)
 */
export async function addLiveEvent(id, eventData) {
  const res = await api.post(`/matches/${id}/events`, eventData);
  return res.data;
}


export default {
  getMatchById,
  getMatchesByTeamId,
  getLastMatches,
  getMatchesByGiornata,
  groupMatchesByDate,
  startFirstHalf,
  startSecondHalf,
  endPeriod,
  addLiveEvent
};