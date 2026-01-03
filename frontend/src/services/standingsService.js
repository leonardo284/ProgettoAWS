import api from "./api";

export async function getStandings() {
  const res = await api.get("/standings");
  // Ordino per punti per determinare la posizione in classifica
  return res.data.sort((a, b) => b.points - a.points);
}
