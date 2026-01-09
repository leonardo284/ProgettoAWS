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


export default {
  getPlayersByTeamId,
  getPlayerById
};