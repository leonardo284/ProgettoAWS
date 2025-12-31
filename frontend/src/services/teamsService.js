import api from './api';

export const getTeams = () => {
  return api.get('/teams');
};

export const getTeamById = (id) => {
  return api.get(`/teams/${id}`);
};

export const getPlayersByTeam = (teamName) => {
  return api.get(`/teams/${teamName}/players`);
};
