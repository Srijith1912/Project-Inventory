import axios from 'axios';

const ADMIN_TOKEN_KEY = 'pantrypro_admin_token';
const GUEST_ID_KEY = 'pantrypro_guest_id';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const adminToken = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (adminToken) config.headers['x-admin-token'] = adminToken;

  const guestId = localStorage.getItem(GUEST_ID_KEY);
  if (guestId) config.headers['x-guest-id'] = guestId;

  return config;
});

export const setAdminToken = (token) => {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const setGuestId = (id) => {
  localStorage.setItem(GUEST_ID_KEY, id);
};

export const clearGuestId = () => {
  localStorage.removeItem(GUEST_ID_KEY);
};

export const readGuestId = () => localStorage.getItem(GUEST_ID_KEY);

export default api;
