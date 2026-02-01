import api from './api'

/**
 *  @description Recupera tutte le squadre.
 */
export async function getTeams() {
  const res = await api.get('/teams')
  return res.data
}

/**
 *  @description Recupera la squadra dall'id.
 */
export async function getTeamById(id) {
  const res = await api.get(`/teams/${id}`)
  return res.data
}
