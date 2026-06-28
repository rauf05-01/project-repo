// Dynamic API Base
const API_BASE = (window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1') 
                 ? 'http://localhost:5000/api' 
                 : '/api';

// Session Management
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

// Auto logout after 24 hours (optional security)
function checkTokenExpiry() {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      logout();
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

async function apiRequest(endpoint, options = {}) {
  if (!checkTokenExpiry()) {
    window.location.href = 'login.html';
    return null;
  }

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
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Request failed');
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

// Auto check token on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (window.location.pathname.includes('login') || window.location.pathname.includes('register')) {
      // Don't check on auth pages
    } else if (!isLoggedIn()) {
      window.location.href = 'login.html';
    }
  });
}