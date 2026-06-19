import apiClient from './apiClient';

export const createLeaveRequest = async (data) => {
  const response = await apiClient.post('/api/leave/request', data);
  return response.data;
};

export const getMyRequests = async () => {
  const response = await apiClient.get('/api/leave/my-requests');
  return response.data;
};

export const getAllRequests = async () => {
  const response = await apiClient.get('/api/leave/all');
  return response.data;
};

export const approveRequest = async (id) => {
  const response = await apiClient.put(`/api/leave/${id}/approve`);
  return response.data;
};

export const rejectRequest = async (id) => {
  const response = await apiClient.put(`/api/leave/${id}/reject`);
  return response.data;
};