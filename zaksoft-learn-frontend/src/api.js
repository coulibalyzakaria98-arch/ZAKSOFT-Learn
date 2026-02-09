import { API_URL } from './config';

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorBody = await response.text();
    console.error('API Request Failed:', errorBody);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export function getFormations() {
  return request('/formations');
}

export function getFormation(id) {
  return request(`/formations/${id}`);
}

export function createFormation(data, token) {
  return request('/formations', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
}

export function updateFormation(id, data, token) {
  return request(`/formations/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
     },
    body: JSON.stringify(data),
  });
}

export function deleteFormation(id, token) {
  return request(`/formations/${id}`, {
     method: 'DELETE',
     headers: { 'Authorization': `Bearer ${token}` }
    });
}

export function getUserProgress(userId, token) {
  return request(`/users/${userId}/progress`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

export function updateUserProgress(userId, formationId, chapterId, token) {
  return request(`/users/${userId}/progress`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ formationId, chapterId }),
  });
}
