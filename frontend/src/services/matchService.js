import api from './api'

export const getLastMatches = async () => {
  const { data } = await api.get('/matches/giornata/1')
  return data
}
