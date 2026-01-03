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

// BY GIORNATA
export async function getMatchesByGiornata(giornata) {
  const res = await api.get(`/matches/giornata/${giornata}`)
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
  // Filtriamo le partite FINITE
  const finishedMatches = allMatches
    .filter(m => m.stato === "FINITA")
    .sort((a, b) => new Date(b.dataOra) - new Date(a.dataOra)); // Dalla più recente alla più vecchia

  let displayMatches = [];

  if (finishedMatches.length > 0) {
    // Se ci sono partite finite, prendiamo le ultime N
    displayMatches = finishedMatches.slice(0, limit);
  } else {
    // Se nessuna è finita, prendiamo le prime da giocare
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