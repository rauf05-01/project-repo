const API_BASE = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  return JSON.parse(localStorage.getItem('user') || '{}');
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    ...options
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!res.ok && res.status === 401) {
    localStorage.clear();
    window.location.href = 'login.html';
    return;
  }
  return res.json();
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}