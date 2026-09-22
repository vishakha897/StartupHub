import axios from 'axios';

// Vite exposes VITE_-prefixed vars on import.meta.env. Set VITE_API_URL
// in client/.env if the backend isn't on http://localhost:5000.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL, timeout: 30000 });

// Attach the JWT (if present) to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('startuphub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server says our token is no longer valid, clear local state so
// the app naturally redirects to /login instead of looping on 401s.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('startuphub_token');
      localStorage.removeItem('startuphub_user');
    }
    return Promise.reject(error);
  }
);

export default client;
