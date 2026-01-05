import api from './api';

/**
 * Recupera la giornata corrente analizzando lo stato della classifica.
 */
export async function getCurrentMatchday() {
  try {
    const res = await api.get('/standings');
    const standings = res.data;

    if (!standings || standings.length === 0) return 1;

    // Trovo il numero massimo di partite giocate
    const maxPlayed = Math.max(...standings.map(s => s.matchPlayed));
    
    // Se siamo a fine campionato (38), restiamo sulla 38, altrimenti suggeriamo la prossima
    return maxPlayed < 38 ? maxPlayed + 1 : 38;
  } catch (error) {
    console.error("Errore nel recupero della giornata corrente:", error);
    return 1;
  }
}

export const groupMatchesByDate = (matches) => {
  // 1. Ordino prima i match per data e ora
  const sortedMatches = [...matches].sort((a, b) => new Date(a.dataOra) - new Date(b.dataOra));

  // 2. Raggruppo
  return sortedMatches.reduce((groups, match) => {
    const dateKey = new Date(match.dataOra).toISOString().split('T')[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(match);
    return groups;
  }, {});
};

export const formatDateBadge = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('it-IT', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  }).toUpperCase();
};

export const formatShortDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('it-IT', { 
    day: 'numeric', month: 'short'
  });
};

export const formatTime = (dateStr) => {
  return new Date(dateStr).toLocaleTimeString('it-IT', { 
    hour: '2-digit', minute: '2-digit' 
  });
};