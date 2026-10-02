import api from './api';

// ---------------------- PLACEMENT TEST ----------------------
export async function getTestQuestions(subject = 'english') {
  const { data } = await api.get('/test/questions', { params: { subject } });
  return data.data;
}

export async function submitTest(answers, subject = 'english') {
  const { data } = await api.post('/test/submit', { answers, subject });
  return data.data; // { attemptId, score, maxScore, percentage, determinedLevel, levelBreakdown }
}

// ---------------------- ADMIN: TEST QUESTIONS ----------------------
export async function getAllQuestionsAdmin() {
  const { data } = await api.get('/test/admin/questions');
  return data.data;
}

export async function createQuestion(payload) {
  const { data } = await api.post('/test/admin/questions', payload);
  return data.data;
}

export async function updateQuestion(id, payload) {
  const { data } = await api.put(`/test/admin/questions/${id}`, payload);
  return data.data;
}

export async function deleteQuestion(id) {
  await api.delete(`/test/admin/questions/${id}`);
}

// ---------------------- APPLICATIONS ----------------------
export async function submitApplication(payload) {
  const { data } = await api.post('/applications', payload);
  return data.data;
}

export async function getApplicationsAdmin(params) {
  const { data } = await api.get('/applications', { params });
  return data; // { data: [...], pagination: {...} }
}

export async function getApplicationById(id) {
  const { data } = await api.get(`/applications/${id}`);
  return data.data;
}

export async function updateApplicationStatus(id, status, adminNote) {
  const { data } = await api.patch(`/applications/${id}/status`, { status, adminNote });
  return data.data;
}

export async function deleteApplication(id) {
  await api.delete(`/applications/${id}`);
}

export async function getDashboardStats() {
  const { data } = await api.get('/applications/dashboard-stats');
  return data.data;
}
