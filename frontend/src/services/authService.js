import { apiRequest } from './api';

/**
 * Registriert einen neuen User
 */
export async function register(userData) {
  const response = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.name || null,
    }),
  });
  return response;
}

/**
 * Login - gibt JWT Token zurück
 */
export async function login(username, password) {
  const response = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  });
  
  // Token im localStorage speichern
  if (response.access_token) {
    localStorage.setItem('auth_token', response.access_token);
  }
  
  return response;
}

/**
 * Logout - entfernt Token
 */
export function logout() {
  localStorage.removeItem('auth_token');
}

/**
 * Prüft ob User eingeloggt ist
 */
export function isAuthenticated() {
  return !!localStorage.getItem('auth_token');
}

/**
 * Holt den aktuellen User (mit Token)
 */
export async function getCurrentUser() {
  return await apiRequest('/api/auth/me', {
    method: 'GET',
  });
}
