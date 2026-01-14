import api from './api';

// Recupera ogni giocatore di una squadra tramite il suo teamId
export const getPlayersByTeamId = async (teamId) => {
  try {
    const response = await api.get(`/teams/${teamId}/players`);
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei giocatori:", error);
    throw error;
  }
};

/**
 * Recupera i dettagli di un singolo giocatore tramite il suo playerId
 */
export const getPlayerById = async (playerId) => {
  try {
    const response = await api.get(`/players/${playerId}`);
    return response.data;
  } catch (error) {
    console.error(`Errore nel recupero del dettaglio giocatore ${playerId}:`, error);
    throw error;
  }
};

/**
 * Recupera le statistiche generali (partite, minuti, gol, assist)
 */
export const getPlayerStats = async (playerId) => {
  try {
    const response = await api.get(`/stats/players/${playerId}`);
    const data = response.data.stats;
    return {
      played: data.presenze,
      minutes: data.minutiGiocati,
      goals: data.gol,
      assists: data.assist
    };
  } catch (error) {
    console.error(`Errore nel recupero statistiche per ${playerId}:`, error);
    // Ritorna valori a zero in caso di errore per non rompere la UI
    return { played: 0, minutes: 0, goals: 0, assists: 0 };
  }
};

/**
 * Recupera i provvedimenti disciplinari (cartellini gialli e rossi)
 */
export const getPlayerDisciplinary = async (playerId) => {
  try {
    const response = await api.get(`/stats/players/${playerId}`);
    const data = response.data.stats;
    return {
      yellow: data.ammonizioni,
      red: data.espulsioni
    };
  } catch (error) {
    console.error(`Errore nel recupero provvedimenti per ${playerId}:`, error);
    return { yellow: 0, red: 0 };
  }
};

export const getStatsByTeamId = async (teamId) => {
  try {
    const response = await api.get(`/stats/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Errore nel recupero statistiche team ${teamId}:`, error);
    throw error;
  }
};

export default {
  getPlayersByTeamId,
  getPlayerById,
  getPlayerStats,
  getPlayerDisciplinary,
  getStatsByTeamId
};