import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchEmployees = async (params) => {
  const response = await api.get('/employees', { params });
  return response.data;
};

export const createEmployee = async (payload) => {
  const response = await api.post('/employees', { employee: payload });
  return response.data;
};

export const updateEmployee = async (id, payload) => {
  const response = await api.patch(`/employees/${id}`, { employee: payload });
  return response.data;
};

export const deleteEmployee = async (id) => {
  await api.delete(`/employees/${id}`);
};

export const fetchSalaryInsights = async (country) => {
  const response = await api.get('/salary_insights', {
    params: { country },
  });
  return response.data;
};
