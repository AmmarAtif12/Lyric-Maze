import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export function fetchLyrics(artist) {
  return api.get(`/api/lyrics/${encodeURIComponent(artist)}`);
}

export function fetchQuizQuestion(artist) {
  return api.get(`/api/lyrics/quiz/${encodeURIComponent(artist)}`);
}

export function saveScore(scoreData) {
  return api.post('/api/scores', scoreData);
}

export function fetchLeaderboard() {
  return api.get('/api/scores/leaderboard');
}

export function fetchUserProfile(userId) {
  return api.get(`/api/users/${encodeURIComponent(userId)}`);
}

export function updateUserProfile(userId, data) {
  return api.put(`/api/users/${encodeURIComponent(userId)}`, data);
}

export default api;
