import api from "./api";

/**
 *  @description Recupera la classifica delle squadre.
 */
export async function getStandings() {
  const res = await api.get("/standings");
  // la classifica arriva già ordinata dal backend ma per sicurezza la ordino anche qui
  return res.data.sort((a, b) => b.points - a.points);
}
