import api from './api'

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

// LAST N MATCHES
export async function getLastMatches(limit = 5) {
  const res = await api.get(`/matches/last/${limit}`)
  return res.data
}
