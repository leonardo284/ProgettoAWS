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