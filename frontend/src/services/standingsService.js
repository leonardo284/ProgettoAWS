import api from "./api";

export async function getStandings() {
  const res = await api.get("/standings");
  // Ordino per punti per determinare la posizione in classifica
  return res.data.sort((a, b) => b.points - a.points);
}


export const getStandingByTeamId = async (teamId) => {
  try {
    // Recupero la classifica completa
    const standings = await getStandings();
    
    // Cerco la riga corrispondente al teamId
    // Uso String() per sicurezza nel caso uno sia numero e l'altro stringa
    const teamStanding = standings.find(s => String(s.teamId) === String(teamId));
    
    return teamStanding || null;
  } catch (error) {
    console.error("Errore nel recupero standing per teamId:", teamId, error);
    return null;
  }
};