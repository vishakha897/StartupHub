import client from '../api/client';

export const generatePlan = async (input) => {
  const { data } = await client.post('/plans/generate', input);
  return data;
};

export const savePlan = async (payload) => {
  const { data } = await client.post('/plans', payload);
  return data.plan;
};

export const getPlans = async (params = {}) => {
  const { data } = await client.get('/plans', { params });
  return data.plans;
};

export const getPlan = async (id) => {
  const { data } = await client.get(`/plans/${id}`);
  return data.plan;
};

export const updatePlan = async (id, updates) => {
  const { data } = await client.put(`/plans/${id}`, updates);
  return data.plan;
};

export const deletePlan = async (id) => {
  await client.delete(`/plans/${id}`);
};

export const duplicatePlan = async (id) => {
  const { data } = await client.post(`/plans/${id}/duplicate`);
  return data.plan;
};

export const regeneratePlan = async (id) => {
  const { data } = await client.post(`/plans/${id}/regenerate`);
  return data;
};
