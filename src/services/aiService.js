import api from './api';

export async function sendChatMessage(message, sessionId, conversationHistory = []) {
  const { data } = await api.post('/ai/chat', { message, sessionId, conversationHistory });
  return data.data; // { response, usedFallback }
}

export async function getAiStatus() {
  const { data } = await api.get('/ai/status');
  return data.data; // { openaiConfigured }
}

// ---------------------- ADMIN: KNOWLEDGE BASE ----------------------
export async function getKnowledgeBaseAdmin() {
  const { data } = await api.get('/ai/knowledge');
  return data.data;
}

export async function createKnowledge(payload) {
  const { data } = await api.post('/ai/knowledge', payload);
  return data.data;
}

export async function updateKnowledge(id, payload) {
  const { data } = await api.put(`/ai/knowledge/${id}`, payload);
  return data.data;
}

export async function deleteKnowledge(id) {
  await api.delete(`/ai/knowledge/${id}`);
}

export async function getChatLogsAdmin(params) {
  const { data } = await api.get('/ai/logs', { params });
  return data;
}
