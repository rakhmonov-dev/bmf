import api from './api';

// ---------------------- COURSES ----------------------
export async function getCourses() {
  const { data } = await api.get('/courses');
  return data.data;
}

export async function getCourseBySlug(slug) {
  const { data } = await api.get(`/courses/slug/${slug}`);
  return data.data;
}

export async function getAllCoursesAdmin() {
  const { data } = await api.get('/courses/admin/all');
  return data.data;
}

export async function getCourseById(id) {
  const { data } = await api.get(`/courses/${id}`);
  return data.data;
}

export async function createCourse(payload) {
  const { data } = await api.post('/courses', payload);
  return data.data;
}

export async function updateCourse(id, payload) {
  const { data } = await api.put(`/courses/${id}`, payload);
  return data.data;
}

export async function deleteCourse(id) {
  await api.delete(`/courses/${id}`);
}

// ---------------------- TEACHERS ----------------------
export async function getTeachers() {
  const { data } = await api.get('/teachers');
  return data.data;
}

export async function getAllTeachersAdmin() {
  const { data } = await api.get('/teachers/admin/all');
  return data.data;
}

export async function createTeacher(formData) {
  const { data } = await api.post('/teachers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateTeacher(id, formData) {
  const { data } = await api.put(`/teachers/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteTeacher(id) {
  await api.delete(`/teachers/${id}`);
}

// ---------------------- TESTIMONIALS ----------------------
export async function getTestimonials() {
  const { data } = await api.get('/testimonials');
  return data.data;
}

export async function getAllTestimonialsAdmin() {
  const { data } = await api.get('/testimonials/admin/all');
  return data.data;
}

export async function createTestimonial(formData) {
  const { data } = await api.post('/testimonials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateTestimonial(id, formData) {
  const { data } = await api.put(`/testimonials/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteTestimonial(id) {
  await api.delete(`/testimonials/${id}`);
}

// ---------------------- GALLERY ----------------------
export async function getGalleryImages() {
  const { data } = await api.get('/gallery');
  return data.data;
}

export async function getAllGalleryImagesAdmin() {
  const { data } = await api.get('/gallery/admin/all');
  return data.data;
}

export async function createGalleryImage(formData) {
  const { data } = await api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateGalleryImage(id, formData) {
  const { data } = await api.put(`/gallery/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteGalleryImage(id) {
  await api.delete(`/gallery/${id}`);
}

// ---------------------- FAQS ----------------------
export async function getFaqs() {
  const { data } = await api.get('/faqs');
  return data.data;
}

export async function getAllFaqsAdmin() {
  const { data } = await api.get('/faqs/admin/all');
  return data.data;
}

export async function createFaq(payload) {
  const { data } = await api.post('/faqs', payload);
  return data.data;
}

export async function updateFaq(id, payload) {
  const { data } = await api.put(`/faqs/${id}`, payload);
  return data.data;
}

export async function deleteFaq(id) {
  await api.delete(`/faqs/${id}`);
}

// ---------------------- SETTINGS ----------------------
export async function getPublicSettings() {
  const { data } = await api.get('/settings');
  return data.data; // { hero_title: '...', hero_subtitle: '...', ... }
}

export async function getAllSettingsAdmin() {
  const { data } = await api.get('/settings/admin/all');
  return data.data;
}

export async function bulkUpdateSettings(updates) {
  const { data } = await api.put('/settings/admin/bulk-update', { updates });
  return data.data;
}

// ---------------------- MESSAGES ----------------------
export async function sendMessage(payload) {
  const { data } = await api.post('/messages', payload);
  return data.data;
}

export async function getMessagesAdmin(params) {
  const { data } = await api.get('/messages', { params });
  return data;
}

export async function markMessageAsRead(id) {
  const { data } = await api.patch(`/messages/${id}/read`);
  return data.data;
}

export async function deleteMessage(id) {
  await api.delete(`/messages/${id}`);
}

export async function getUnreadMessageCount() {
  const { data } = await api.get('/messages/unread-count');
  return data.data.count;
}
