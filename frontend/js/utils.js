// Dynamic API Base for Development & Production
const API_BASE = (window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1') 
                 ? 'http://localhost:5000/api' 
                 : '/api';

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
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    
    if (!res.ok && res.status === 401) {
      localStorage.clear();
      window.location.href = 'login.html';
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}