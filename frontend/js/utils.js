// Dynamic API Base
const API_BASE = (window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1') 
                 ? 'http://localhost:5000/api' 
                 : '/api';

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

function isLoggedIn() {
  return !!getToken();
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
    
    if (res.status === 401) {
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

// Only protect certain pages
const protectedPages = ['student-dashboard.html', 'lecturer-dashboard.html', 'admin-dashboard.html'];

function checkAuth() {
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage) && !isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Run check on page load
document.addEventListener('DOMContentLoaded', checkAuth);