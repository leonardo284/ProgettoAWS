import api from './api'
import { getTeams } from './teamsService'
import { getPlayersByTeamId } from './playersService'; 

// CREATE
export async function createMatch(data) {
  const res = await api.post('/matches', data)
  return res.data
}

// READ ONE
/*export async function getMatchById(id) {
  const res = await api.get(`/matches/${id}`)
  return res.data
}*/

// READ ONE
export async function getMatchById(id) {
  const resMatch = await api.get(`/matches/${id}`);
  const match = resMatch.data;

  // Recupero loghi e liste giocatori complete delle due squadre
  const [teams, playersCasa, playersTrasferta] = await Promise.all([
    getTeams(),
    getPlayersByTeamId(match.squadre.casa.teamId),
    getPlayersByTeamId(match.squadre.trasferta.teamId)
  ]);

  const allPlayers = [...playersCasa, ...playersTrasferta];

  // Funzione per aggiungere foto e ruolo esteso a ogni giocatore nella formazione
  const enrich = (lista) => lista.map(p => {
    const dettagli = allPlayers.find(ap => ap.playerId === p.playerId);
    return { ...p, foto: dettagli?.foto || '', ruolo: dettagli?.ruolo || p.ruolo };
  });

  const teamCasa = teams.find(t => t.teamId === match.squadre.casa.teamId);
  const teamTrasferta = teams.find(t => t.teamId === match.squadre.trasferta.teamId);

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

// UPDATE
export async function updateMatch(id, data) {
  const res = await api.put(`/matches/${id}`, data)
  return res.data
}

// DELETE
export async function deleteMatch(id) {
  const res = await api.delete(`/matches/${id}`)
  return res.data
}

// BY TEAM
// Recupera ogni match di una singola squadra tramite il suo id
export const getMatchesByTeamId = async (teamId) => {
  try {
    // 1. Recupera in parallelo i match della squadra e la lista completa dei team
    const [resMatches, teams] = await Promise.all([
      api.get(`/matches/squadra/${teamId}`),
      getTeams()
    ]);

    const matches = resMatches.data;

    // 2. Inserisce il logo di ogni squadra dentro l'oggetto match
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


// Ultime N partite
export async function getLastMatches(limit = 10) {
  // 1. Recupero tutti i match e i team
  const [resMatches, teams] = await Promise.all([
    api.get(`/matches`), 
    getTeams()
  ])

  let allMatches = resMatches.data;

  // 2. Logica di selezione:
  // Filtro le partite FINITE
  const finishedMatches = allMatches
    .filter(m => m.stato === "FINITA")
    .sort((a, b) => new Date(b.dataOra) - new Date(a.dataOra)); // Dalla più recente alla più vecchia

  let displayMatches = [];

  if (finishedMatches.length > 0) {
    // Se ci sono partite finite, prendo le ultime N
    displayMatches = finishedMatches.slice(0, limit);
  } else {
    // Se nessuna è finita, prendo le prime da giocare
    displayMatches = allMatches
      .filter(m => m.stato === "NON_INIZIATA")
      .sort((a, b) => new Date(a.dataOra) - new Date(b.dataOra))
      .slice(0, limit);
  }

  // 3. Mappatura finale per aggiungere i loghi 
  return displayMatches.map(match => {
    const teamCasa = teams.find(t => t.teamId === match.squadre.casa.teamId || t.nome === match.squadre.casa.nome)
    const teamTrasferta = teams.find(t => t.teamId === match.squadre.trasferta.teamId || t.nome === match.squadre.trasferta.nome)

    return {
      ...match,
      squadre: {
        casa: { ...match.squadre.casa, logo: teamCasa?.logo },
        trasferta: { ...match.squadre.trasferta, logo: teamTrasferta?.logo }
      }
    }
  })
}

export async function getMatchesByGiornata(giornata) {
  // 1. Recupero simultaneo di match e team per avere i loghi
  const [resMatches, teams] = await Promise.all([
    api.get(`/matches/giornata/${giornata}`),
    getTeams()
  ])

  // 2. Mappatura per inserire i loghi delle squadre
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
  const sortedMatches = [...matches].sort((a, b) => new Date(a.dataOra) - new Date(b.dataOra))

  return sortedMatches.reduce((groups, match) => {
    const dateKey = new Date(match.dataOra).toISOString().split('T')[0]
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(match)
    return groups
  }, {})
}

export default {
  createMatch,
  getMatchById,
  updateMatch,
  deleteMatch,
  getMatchesByTeamId,
  getLastMatches,
  getMatchesByGiornata,
  groupMatchesByDate
};