import api from "./api";

export async function getStandings() {
  const res = await api.get("/standings");
  return res.data;
}
