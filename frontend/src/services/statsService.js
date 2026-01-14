import api from './api';

export const getTopScorers = async () => {
  const response = await api.get('/stats/top-scorers'); 
  return response.data;
};

export const getTopAssists = async () => {
  const response = await api.get('/stats/top-assists');
  return response.data;
};

export const getTopYellowCards = async () => {
  const response = await api.get('/stats/top-yellows');
  return response.data;
};

export const getTopRedCards = async () => {
  const response = await api.get('/stats/top-reds');
  return response.data;
};

export const getClubRankings = async () => {
  const response = await api.get('/clubs/full'); 
  return response.data;
};

export default {
  getTopScorers,
  getTopAssists,
  getTopYellowCards,
  getTopRedCards,
  getClubRankings
};