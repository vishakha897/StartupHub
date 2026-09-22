import client from '../api/client';

export const register = async (name, email, password) => {
  const { data } = await client.post('/auth/register', { name, email, password });
  return data;
};

export const login = async (email, password) => {
  const { data } = await client.post('/auth/login', { email, password });
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await client.get('/auth/me');
  return data.user;
};

export const updateProfile = async (updates) => {
  const { data } = await client.put('/auth/me', updates);
  return data.user;
};
