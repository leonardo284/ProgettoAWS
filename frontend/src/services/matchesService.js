import api from './api'
import { getTeams } from './teamsService'

// CREATE
export async function createMatch(data) {
  const res = await api.post('/matches', data)
  return res.data
}

// READ ONE
export async function getMatchById(id) {
  const res = await api.get(`/matches/${id}`)
  return res.data
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
export async function getMatchesByTeam(teamId) {
  const res = await api.get(`/matches/squadra/${teamId}`)
  return res.data
}

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