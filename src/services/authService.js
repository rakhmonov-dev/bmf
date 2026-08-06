import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data.data; // { token, admin }
}

export async function getProfile() {
  const { data } = await api.get('/auth/profile');
  return data.data;
}
