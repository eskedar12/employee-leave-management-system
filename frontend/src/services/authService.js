import apiClient from './apiClient';

export const login = async (username, password) => {
  const response = await apiClient.post('/api/auth/login', { username, password });
  return response.data;
};
export const register = async (userData) => {
  const response = await apiClient.post('/api/auth/register', userData);
  return response.data;
};
export const getCurrentUser = async () => {
  const response = await apiClient.get('/api/auth/me');
  return response.data;
};