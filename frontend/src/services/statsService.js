import api from './api';

/**
 * @returns la classifica dei migliori marcatori.
*/
export const getTopScorers = async () => {
  const response = await api.get('/stats/top-scorers'); 
  return response.data;
};

/**
 * @description Recupera la classifica dei migliori assistman.
 */
export const getTopAssists = async () => {
  const response = await api.get('/stats/top-assists');
  return response.data;
};

/**
 *  @description Recupera la classifica dei giocatori con più cartellini gialli.
 */
export const getTopYellowCards = async () => {
  const response = await api.get('/stats/top-yellows');
  return response.data;
};

/**
 *  @description Recupera la classifica dei giocatori con più cartellini rossi.
 */
export const getTopRedCards = async () => {
  const response = await api.get('/stats/top-reds');
  return response.data;
};

/**
 *  @description Recupera la classifica delle squadre con alcune statistiche come numerodic artellini gialli e rossi.
 */
export const getClubRankings = async () => {
  const response = await api.get('/stats/teams/full'); 
  return response.data;
};

export default {
  getTopScorers,
  getTopAssists,
  getTopYellowCards,
  getTopRedCards,
  getClubRankings
};