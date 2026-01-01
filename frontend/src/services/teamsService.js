import api from './api'

export async function getTeams() {
  const res = await api.get('/teams')
  return res.data
}

export async function getTeamById(id) {
  const res = await api.get(`/teams/${id}`)
  return res.data
}

export async function getPlayersByTeam(teamName) {
  const res = await api.get(`/teams/${teamName}/players`)
  return res.data
}
